# PARS — AI Holding Operating System

**PARS** is a personal AI operating system built around **Börü**, an orchestrator agent that routes tasks to specialized sub-agents, manages memory, runs voice-based interaction, and controls a real-time command panel.

## Architecture

```
PARS/
├── boru-panel/          # Web UI (HTML/CSS/JS) + Node.js backend
│   ├── index.html       # Real-time command console (voice + text)
│   └── server/          # Express server + agent modules
│       ├── server.js        # Main server, API routing, voice auth
│       ├── boru-tools.js    # Tool execution engine
│       ├── boru-brain.js    # Memory + context routing
│       ├── boru-workflow.js # Multi-step workflow engine
│       ├── boru-tasks.js    # Task queue management
│       ├── boru-metrics.js  # Metrics & dashboard data
│       ├── boru-telegram.js # Telegram remote control
│       └── boru-sources.js  # Source file watcher
├── scripts/             # Python AI services
│   ├── xtts_server.py       # XTTS v2 TTS + voice verification (port 8020)
│   └── whisper_server.py    # faster-whisper STT (port 8021)
├── assets/              # Static assets
├── projects/            # Per-project configs (ARES, XR, MEDIA, SECURITY, KNOWLEDGE)
├── .claude/             # Claude Code agent definitions & rules
└── docs/                # Documentation
```

## Features

- **Voice Authentication** — resemblyzer voice verification + password bypass
- **Real-time TTS** — XTTS v2 with speaker cloning (GPU)
- **STT** — faster-whisper large-v3 (GPU)
- **Orchestrator** — Groq LLaMA 70B for tool calls, 8B for fast chat
- **Session Memory** — Obsidian vault integration via `bilge-vault/`
- **Remote Control** — Telegram bot interface
- **Task Queue** — Autonomous task runner with retry logic
- **Multi-agent** — Specialized agents: ARES, XR, MEDIA, SECURITY, KNOWLEDGE

## Stack

| Layer | Tech |
|---|---|
| Frontend | Vanilla HTML/CSS/JS |
| Backend | Node.js + Express |
| LLM | Groq (LLaMA 3.3 70B / 3.1 8B) |
| TTS | XTTS v2 (Coqui) |
| STT | faster-whisper large-v3 |
| Voice Auth | resemblyzer |
| Memory | Obsidian (MCP) |
| Automation | Playwright (Telegram) |

## Setup

### 1. API Keys

```
boru-panel/server/groq.key    ← Groq API key
boru-panel/server/gemini.key  ← Gemini API key (optional)
```

### 2. Voice Sample

```
assets/voice/speaker.wav  ← Your voice sample for authentication (16kHz mono WAV)
```

### 3. Node.js Backend

```bash
cd boru-panel/server
npm install
node server.js
```

### 4. Python Services

```bash
# XTTS TTS + Voice Verify (GPU required)
python scripts/xtts_server.py

# Whisper STT (GPU recommended)
python scripts/whisper_server.py
```

### 5. Open Panel

Navigate to `http://localhost:3737`

## Security

- API keys stored as plain files (`.key`), excluded from git
- Voice authentication uses SHA256-hashed PIN as bypass
- No credentials are committed — use `.env` or local key files

## License

MIT
