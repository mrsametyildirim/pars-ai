"""
Bilge Capture — claude-mem ilkesiyle oturum sonu hafıza yakalama.
Stop hook ile cagrilir: her Claude oturumu kapandiginda calismaz.
Manuel: python bilge_capture.py "oturum ozeti buraya"
"""
import sys
import os
from datetime import datetime

VAULT = r"C:\PARS\bilge-vault"
SESSIONS_DIR = os.path.join(VAULT, "40-sessions")

os.makedirs(SESSIONS_DIR, exist_ok=True)

def capture(summary: str):
    date_str = datetime.now().strftime("%Y-%m-%d")
    time_str = datetime.now().strftime("%H:%M")
    filename = os.path.join(SESSIONS_DIR, f"{date_str}.md")

    entry = f"\n## {time_str}\n{summary}\n"

    if not os.path.exists(filename):
        header = f"# Oturum Kayitlari — {date_str}\n"
        with open(filename, "w", encoding="utf-8") as f:
            f.write(header + entry)
    else:
        with open(filename, "a", encoding="utf-8") as f:
            f.write(entry)

    print(f"[Bilge] Kaydedildi: {filename}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        capture(" ".join(sys.argv[1:]))
    else:
        capture("Oturum tamamlandi. Manuel ozet eklenmedi.")
