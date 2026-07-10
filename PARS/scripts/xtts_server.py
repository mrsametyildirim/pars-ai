"""
XTTS v2 TTS sunucusu — Türkçe neural ses, GPU hızlandırmalı
Port: 8020  |  GET /health  |  POST /tts {"text":"..."}
"""
import sys
import os
import json
import tempfile

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

# torch ve CUDA DLL'lerini TTS.api'den ÖNCE yükle (Windows DLL sıralaması)
import torch
_ = torch.zeros(1)

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
print(f"[XTTS] Cihaz: {DEVICE}", flush=True)

print("[XTTS] Model yükleniyor...", flush=True)
from TTS.api import TTS
from http.server import HTTPServer, BaseHTTPRequestHandler

tts_model = TTS("tts_models/multilingual/multi-dataset/xtts_v2").to(DEVICE)

# Zero-shot klonlama için Türkçe ses örneği kontrolü
SPEAKER_WAV = r"C:\PARS\assets\voice\speaker.wav"
USE_SPEAKER_WAV = os.path.isfile(SPEAKER_WAV)
if USE_SPEAKER_WAV:
    print(f"[XTTS] Özel ses örneği bulundu: {SPEAKER_WAV}", flush=True)
    SPEAKER = None
else:
    print("[XTTS] Özel ses yok — C:\\PARS\\assets\\voice\\speaker.wav ekleyebilirsin", flush=True)
    # Built-in speaker — multilingual için en stabil olanlar
    SPEAKER = None
    try:
        synth = tts_model.synthesizer
        sm = getattr(getattr(synth, "tts_model", None), "speaker_manager", None)
        if sm and hasattr(sm, "name_to_id") and sm.name_to_id:
            names = list(sm.name_to_id)
            preferred = ["Ana Florence", "Claribel Dervla", "Dionisio Schuyler"]
            SPEAKER = next((n for n in preferred if n in names), names[0])
            print(f"[XTTS] {len(names)} konuşmacı. Seçilen: {SPEAKER}", flush=True)
    except Exception as e:
        print(f"[XTTS] Speaker tespiti hatası: {e}", flush=True)

# ── HIZ: speaker latent'lerini bir kez önden hesapla (her çağrıda tekrar hesaplama) ──
import numpy as _np
import wave as _wave
FAST = False
XTTS = None
GPT_LATENT = None
SPK_EMB = None
if USE_SPEAKER_WAV:
    try:
        XTTS = tts_model.synthesizer.tts_model
        GPT_LATENT, SPK_EMB = XTTS.get_conditioning_latents(audio_path=[SPEAKER_WAV])
        FAST = True
        print("[XTTS] Hızlı mod: speaker latent önbelleğe alındı.", flush=True)
        # Isınma: ilk çağrı CUDA derlemesi yüzünden yavaş — şimdi tetikle
        try:
            import tempfile as _tf
            _w = _tf.NamedTemporaryFile(suffix=".wav", delete=False).name
            XTTS.inference("Merhaba.", "tr", GPT_LATENT, SPK_EMB, temperature=0.65)
            print("[XTTS] Isınma tamam — çağrılar artık hızlı.", flush=True)
        except Exception as _e:
            print(f"[XTTS] Isınma atlandı: {_e}", flush=True)
    except Exception as e:
        print(f"[XTTS] Latent önbellek hatası, normal moda dönülüyor: {e}", flush=True)
        FAST = False

def synth_fast(text, out_path):
    out = XTTS.inference(text, "tr", GPT_LATENT, SPK_EMB, temperature=0.65, enable_text_splitting=True)
    wav = _np.asarray(out["wav"], dtype=_np.float32)
    wav = _np.clip(wav, -1.0, 1.0)
    pcm = (wav * 32767.0).astype("<i2").tobytes()
    with _wave.open(out_path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(24000); w.writeframes(pcm)

print("[XTTS] Sunucu hazır.", flush=True)

# ── Kaya ses doğrulama (resemblyzer) ──
VERIFY_AVAILABLE = False
KAYA_EMBEDDING   = None
VERIFY_THRESHOLD = 0.65

try:
    from resemblyzer import VoiceEncoder, preprocess_wav
    from pathlib import Path
    import numpy as np
    _enc = VoiceEncoder()
    if USE_SPEAKER_WAV:
        _ref = preprocess_wav(Path(SPEAKER_WAV))
        KAYA_EMBEDDING = _enc.embed_utterance(_ref)
        VERIFY_AVAILABLE = True
        print("[VERIFY] Kaya ses parmak izi hazır.", flush=True)
    else:
        print("[VERIFY] speaker.wav yok — doğrulama devre dışı.", flush=True)
except Exception as e:
    print(f"[VERIFY] resemblyzer yüklenemedi: {e}", flush=True)


def verify_speaker(wav_bytes):
    if not VERIFY_AVAILABLE:
        return True, 1.0
    try:
        import io as _io
        import tempfile as _tmp
        with _tmp.NamedTemporaryFile(suffix='.wav', delete=False) as f:
            f.write(wav_bytes); tmp = f.name
        test_wav = preprocess_wav(Path(tmp))
        os.unlink(tmp)
        test_emb = _enc.embed_utterance(test_wav)
        sim = float(np.dot(KAYA_EMBEDDING, test_emb))
        return sim >= VERIFY_THRESHOLD, round(sim, 3)
    except Exception as e:
        print(f"[VERIFY] Hata: {e}", flush=True)
        return True, 1.0


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *_): pass

    def do_GET(self):
        if self.path == "/verify-status":
            body = json.dumps({"available": VERIFY_AVAILABLE, "threshold": VERIFY_THRESHOLD}).encode()
            self.send_response(200); self.send_header("Content-Type","application/json"); self.send_header("Content-Length",str(len(body))); self.end_headers(); self.wfile.write(body); return
        if self.path == "/health":
            body = json.dumps({"status": "ok", "device": DEVICE, "speaker": SPEAKER_WAV if USE_SPEAKER_WAV else SPEAKER}).encode()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        if self.path == "/verify":
            length = int(self.headers.get("Content-Length", 0))
            wav_bytes = self.rfile.read(length) if length else b""
            verified, sim = verify_speaker(wav_bytes)
            body = json.dumps({"verified": verified, "similarity": sim}).encode()
            self.send_response(200); self.send_header("Content-Type","application/json"); self.send_header("Content-Length",str(len(body))); self.end_headers(); self.wfile.write(body); return
        if self.path != "/tts":
            self.send_response(404)
            self.end_headers()
            return
        length = int(self.headers.get("Content-Length", 0))
        raw = self.rfile.read(length) if length else b"{}"
        try:
            body = json.loads(raw.decode("utf-8", errors="replace"))
        except Exception:
            self.send_response(400)
            self.end_headers()
            return
        text = str(body.get("text", "")).strip()[:800]
        if not text:
            self.send_response(400)
            self.end_headers()
            return
        try:
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
                tmp = f.name
            if FAST:
                synth_fast(text, tmp)
            else:
                kwargs = dict(text=text, language="tr", file_path=tmp)
                if USE_SPEAKER_WAV:
                    kwargs["speaker_wav"] = SPEAKER_WAV
                elif SPEAKER:
                    kwargs["speaker"] = SPEAKER
                tts_model.tts_to_file(**kwargs)
            with open(tmp, "rb") as f:
                data = f.read()
            os.unlink(tmp)
            self.send_response(200)
            self.send_header("Content-Type", "audio/wav")
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)
        except Exception as e:
            print(f"[XTTS] Hata: {e}", flush=True)
            self.send_response(500)
            self.end_headers()


if __name__ == "__main__":
    server = HTTPServer(("127.0.0.1", 8020), Handler)
    print("[XTTS] Sunucu calisıyor: http://127.0.0.1:8020", flush=True)
    server.serve_forever()
