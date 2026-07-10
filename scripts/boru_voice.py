"""
Boru Voice — Optimum Pipeline
STT : faster-whisper GPU large-v3  |  port 8021
TTS : edge-tts tr-TR-EmelNeural    |  ~200ms, cloud-first
      XTTS v2 GPU (auto-fallback)  |  ~800ms, local high-quality
LLM : claude CLI stream-json       |  cümle cümle TTS
"""

import os, re, sys, wave, json, ctypes, tempfile, subprocess, asyncio
import urllib.request, urllib.error

WHISPER_URL  = "http://127.0.0.1:8021"
XTTS_URL     = "http://127.0.0.1:8020"
VOICE        = "tr-TR-EmelNeural"
VOICE_RATE   = "-10%"
VOICE_PITCH  = "-3Hz"
SILENCE_RMS  = 250
SILENCE_SEC  = 1.2
MAX_REC_SEC  = 30
MIN_SENT_LEN = 12  # cümle sayılması için min karakter

_SENT_RE = re.compile(r'(?<=[.!?…])\s+')
_loop    = asyncio.new_event_loop()  # kalıcı loop — her speak() için yeniden oluşturma yok

try:
    import edge_tts as _edge
    _EDGE_OK = True
except ImportError:
    _EDGE_OK = False
    print("[TTS] edge-tts eksik: pip install edge-tts")


# ─── Windows MCI — MP3/WAV oynatma (sıfır bağımlılık) ───────────────────────

_winmm = ctypes.windll.winmm

def _mci(cmd: str):
    _winmm.mciSendStringW(cmd, None, 0, None)

def _play_mp3(path: str):
    p = path.replace("\\", "/")
    _mci(f'open "{p}" type mp3audio alias boru_mp3')
    _mci("play boru_mp3 wait")
    _mci("close boru_mp3")

def _play_wav(path: str):
    import winsound
    winsound.PlaySound(path, winsound.SND_FILENAME)


# ─── TTS ─────────────────────────────────────────────────────────────────────

def _service_ok(url: str, timeout: float = 1.0) -> bool:
    try:
        urllib.request.urlopen(f"{url}/health", timeout=timeout)
        return True
    except Exception:
        return False

async def _edge_save(text: str, path: str):
    await _edge.Communicate(text, VOICE, rate=VOICE_RATE, pitch=VOICE_PITCH).save(path)

def speak(text: str):
    text = text.strip()
    if not text:
        return

    # edge-tts: ~200-400ms, cloud, sıfır GPU bekleme
    if _EDGE_OK:
        try:
            tmp = os.path.join(tempfile.gettempdir(), "boru_edge.mp3")
            _loop.run_until_complete(_edge_save(text, tmp))
            _play_mp3(tmp)
            return
        except Exception:
            pass

    print(f"[Boru] {text}")


# ─── STT ─────────────────────────────────────────────────────────────────────

def listen_and_transcribe() -> str | None:
    try:
        import pyaudio
        import numpy as np
    except ImportError:
        print("[STT] pip install pyaudio numpy")
        return None

    HZ, CHUNK = 16000, 1024
    p = pyaudio.PyAudio()
    s = p.open(format=pyaudio.paInt16, channels=1, rate=HZ,
               input=True, frames_per_buffer=CHUNK)

    print("[Boru] Dinliyor...", end="", flush=True)
    frames, started, silent_n = [], False, 0
    max_chunks = int(HZ / CHUNK * MAX_REC_SEC)
    sil_limit  = int(HZ / CHUNK * SILENCE_SEC)

    for _ in range(max_chunks):
        data = s.read(CHUNK, exception_on_overflow=False)
        frames.append(data)
        rms = np.sqrt(np.mean(np.frombuffer(data, np.int16).astype(np.float32) ** 2))
        if rms > SILENCE_RMS:
            if not started:
                print(" ●", end="", flush=True)
            started, silent_n = True, 0
        elif started:
            silent_n += 1
            if silent_n >= sil_limit:
                break

    s.stop_stream(); s.close(); p.terminate()
    print(" ✓")

    wav = os.path.join(tempfile.gettempdir(), "boru_in.wav")
    with wave.open(wav, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(p.get_sample_size(pyaudio.paInt16))
        wf.setframerate(HZ)
        wf.writeframes(b"".join(frames))

    try:
        with open(wav, "rb") as f:
            data = f.read()
        req = urllib.request.Request(
            f"{WHISPER_URL}/transcribe", data=data,
            headers={"Content-Type": "audio/wav"}
        )
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.loads(r.read())["text"].strip()
    except Exception as e:
        print(f"[STT Hata] {e}")
        return None


# ─── LLM — Streaming sentence-by-sentence TTS ────────────────────────────────

def ask_claude_stream(prompt: str) -> str:
    proc = subprocess.Popen(
        ["claude", "--output-format", "text", "-p", prompt],
        stdout=subprocess.PIPE, stderr=subprocess.DEVNULL,
        text=True, encoding="utf-8", errors="replace",
        bufsize=1, cwd="C:\\PARS"
    )

    text_buf = ""
    full_lines = []
    print("[Boru] ", end="", flush=True)

    for line in proc.stdout:
        text_buf += line
        full_lines.append(line)

        parts = _SENT_RE.split(text_buf)
        for sentence in parts[:-1]:
            s = sentence.strip()
            if len(s) >= MIN_SENT_LEN:
                print(s, end=" ", flush=True)
                speak(s)
        text_buf = parts[-1]

    if text_buf.strip() and len(text_buf.strip()) >= 3:
        print(text_buf.strip(), flush=True)
        speak(text_buf.strip())
    else:
        print(flush=True)

    proc.wait()
    return "".join(full_lines).strip()


# ─── Main ────────────────────────────────────────────────────────────────────

def main():
    whisper_ok = _service_ok(WHISPER_URL)
    if not whisper_ok:
        print("[Uyarı] Whisper sunucusu kapalı — metin modunda devam")
        print("        Ses için: .\\scripts\\boru_panel.ps1\n")

    tts_mode = "edge-tts (cloud ~300ms)" if _EDGE_OK else "metin"
    print(f"[Boru] STT: {'faster-whisper GPU' if whisper_ok else 'kapalı'} | TTS: {tts_mode}\n")

    speak("Ben Boru. Hazırım.")

    while True:
        try:
            if whisper_ok:
                user_input = listen_and_transcribe()
                if not user_input:
                    continue
                print(f"\n[Sen] {user_input}\n")
            else:
                user_input = input("[Metin] > ").strip()
                if not user_input:
                    continue

            if user_input.lower() in ["çıkış", "exit", "quit", "kapat"]:
                speak("Görüşmek üzere.")
                break

            ask_claude_stream(user_input)
            print()

            # Whisper tekrar açıldıysa sessiz geçiş
            whisper_ok = _service_ok(WHISPER_URL)

        except KeyboardInterrupt:
            speak("Görüşmek üzere.")
            break


if __name__ == "__main__":
    main()
