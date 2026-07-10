import sys
import json
import tempfile
import os
import traceback
from http.server import HTTPServer, BaseHTTPRequestHandler

os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

DEVICE = "cuda"
COMPUTE_TYPE = "float16"
MODEL_SIZE = "large-v3"

print(f"[WHISPER] faster-whisper {MODEL_SIZE} yükleniyor ({DEVICE}/{COMPUTE_TYPE})...")

try:
    import torch
    if not torch.cuda.is_available():
        raise RuntimeError("CUDA mevcut değil — torch.cuda.is_available() False döndü")
    _ = torch.zeros(1).cuda()
    from faster_whisper import WhisperModel
    model = WhisperModel(MODEL_SIZE, device=DEVICE, compute_type=COMPUTE_TYPE)
    print(f"[WHISPER] Model hazır. GPU: {torch.cuda.get_device_name(0)}")
except Exception as e:
    print(f"[WHISPER] CUDA başarısız — tam hata:")
    traceback.print_exc()
    print(f"[WHISPER] CPU fallback başlatılıyor (medium/int8)...")
    from faster_whisper import WhisperModel
    model = WhisperModel("medium", device="cpu", compute_type="int8")
    DEVICE = "cpu"
    MODEL_SIZE = "medium"
    print("[WHISPER] Model hazır (CPU/medium).")


class Handler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

    def send_json(self, code, data):
        body = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-Length', len(body))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        if self.path == '/health':
            self.send_json(200, {"status": "ok", "model": MODEL_SIZE, "device": DEVICE})
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        if self.path != '/transcribe':
            self.send_response(404)
            self.end_headers()
            return

        length = int(self.headers.get('Content-Length', 0))
        if length == 0:
            self.send_json(400, {"error": "Ses verisi yok"})
            return

        audio_data = self.rfile.read(length)
        content_type = self.headers.get('Content-Type', 'audio/wav')
        ext = '.wav' if 'wav' in content_type else '.webm'

        tmp = tempfile.NamedTemporaryFile(delete=False, suffix=ext)
        try:
            tmp.write(audio_data)
            tmp.close()

            segments, info = model.transcribe(
                tmp.name,
                language="tr",
                beam_size=5,
                vad_filter=True,
                vad_parameters=dict(min_silence_duration_ms=300),
            )
            text = " ".join(s.text for s in segments).strip()
            print(f"[WHISPER] → {text[:100]}" if text else "[WHISPER] (boş ses)")
            self.send_json(200, {"text": text, "language": info.language})
        except Exception as e:
            print(f"[WHISPER] Hata: {e}")
            self.send_json(500, {"error": str(e)})
        finally:
            try:
                os.unlink(tmp.name)
            except Exception:
                pass


if __name__ == '__main__':
    server = HTTPServer(('127.0.0.1', 8021), Handler)
    print("[WHISPER] Sunucu çalışıyor: http://127.0.0.1:8021")
    server.serve_forever()
