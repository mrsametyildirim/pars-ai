<div align="center">

# PARS
### Poly Augmented Reality Systems

**The world's first multi-layered, phygital reality ecosystem**

*Blending physical and digital worlds — for everyone, everywhere, at the same time.*

---

[📄 Read the Whitepaper](docs/PARS_Whitepaper.pdf) · [🎮 TLOA Game](#-the-legend-of-acun) · [🪙 PARGT Token](#-pars-game-token-pargt) · [🗺 Roadmap](#-roadmap) · [⚙️ AI Operating System](#%EF%B8%8F-pars-ai-operating-system-this-repo)

</div>

---

## What is PARS?

PARS (**Poly Augmented Reality Systems**) is a next-generation technology platform that enables multiple users to experience the same augmented reality environment simultaneously — transforming AR from a personal, isolated experience into a shared, social one.

Where traditional AR shows one person a digital overlay on the real world, **PARS lets thousands of people see, interact with, and build the same digital layer together — in real time.**

This shared layer is called **PARAVERSE**.

---

## 🌐 PARAVERSE

PARAVERSE is a living, layered digital universe built on top of the physical world. Unlike the Metaverse — which isolates users in a fully virtual space — PARAVERSE keeps users grounded in physical reality while enriching it with persistent digital content.

**PARAVERSE is not a destination. It's a layer on top of everywhere.**

| Traditional AR | Traditional Metaverse | PARAVERSE |
|---|---|---|
| Single-user | Fully virtual | Multi-user + physical world |
| Isolated experience | Isolates from reality | Social + physical together |
| Screen-bound | VR headset-bound | Phone, glasses, wearables |
| No persistence | Closed ecosystem | Open, cross-platform |

### PARAVERSE Products

- 🗺 **Digital Land** — Lease, purchase, and build on virtual land overlaid on real locations
- 🎮 **PARS Gaming** — TLOA and future AR-native games
- 📱 **PAR Media** — Next-generation social media in mixed reality
- 🛍 **AR Trading Module** — Buy, sell, and trade in augmented spaces
- 🎓 **AR Education Module** — Immersive learning environments
- 🏙 **PARSVille** — Digital investment and real estate
- 📢 **PARS Advertising** — Spatial advertising on digital billboards
- 👗 **PAR Fashion** — Wearable AR cosmetics and fashion
- 🧭 **PARAVERSE GPS** — Navigation enriched with AR overlays
- ☕ **PAR Cafe / PAR Book** — Social and cultural spaces in AR
- 🎪 **Global AR Parties & Events** — Shared experiences at scale
- 🛠 **PARS Game Engine** — Open platform for indie developers

---

## 🎮 The Legend of Acun

**TLOA (The Legend of Acun)** is PARS's flagship title — an AR-integrated action-card game for iOS and Android, set in *Old Acun*, a mythological fantasy universe with enough depth for multiple book series and a 3D game adaptation.

Unlike traditional card games, TLOA plays out in the real world:

- **Real-time Strategy (RTS)** card battles — not turn-based
- **AR integration** — cards, characters, and battles appear in your physical surroundings
- **PvE story mode** — deep narrative with branching decisions
- **PvP system** — guild wars, ranked tournaments, group battles
- **Daily AR mini-games** — collect items by physically exploring the world
- **Play-to-Earn** — every action generates value in PARGT tokens

> *"Every move strategic. Every battle reflex-driven. Every discovery an opportunity."*

---

## 🪙 PARS Game Token (PARGT)

**PARGT** is the native utility token powering the entire PARS ecosystem.

**Core principle:** *Your time has value.*

PARS was designed so that participation — not just payment — generates real, transferable economic value.

### How to Earn PARGT

| Method | Description |
|---|---|
| 🎯 Mission rewards | Complete in-game tasks, watch ads, promote content |
| 🗺 Exploration | Collect rewards scattered across the real-world map |
| ⚔️ Dungeon farming | Farm dungeons, convert loot to tokens |
| 🏙 Virtual real estate | Earn passive income from land rentals and billboards |
| 💼 Freelance in PARAVERSE | Offer services to other users |
| 📈 Trading | Buy low, sell high in the digital economy |
| 🧪 Beta rewards | Free PARGT for beta testers |

### Token Distribution

- **Pre-sale & listing**: Gate.io (before beta)
- **Post-beta**: Binance launchpad + market exchanges
- **Token burn target**: 10% of total supply (2 billion tokens) by 2027

---

## 🗺 Roadmap

| Phase | Target | Milestone |
|---|---|---|
| ✅ Phase 1–3 | 2021–2024 | Foundation, team, tech R&D, TLOA prototype |
| 🔄 Phase 4 | 2025 | Beta launch, Gate.io pre-sale, PARGT distribution |
| 🔄 Phase 5 | 2026/Q2 | Public launch, mobile release, community growth |
| 🔜 Phase 6 | 2027/Q2 | CEX listings (Binance, OKX, Bybit), sponsorships, staking |
| 🔜 Phase 7 | 2027/Q4 | Full PARAVERSE launch — virtual land, DAO, global expansion |

**Hardware roadmap (by 2028):** Smart clothing · Smartwatches · AR glasses · Haptic gloves · Smart lenses

---

## ⚙️ PARS AI Operating System *(this repo)*

To build and run PARAVERSE at scale, PARS operates a custom AI infrastructure internally: **Börü** — an orchestrator agent that routes tasks, manages memory, runs voice interaction, and coordinates specialized sub-agents across all PARS business units.

This repository contains the full source of that system.

```
pars-ai/
├── boru-panel/          # Real-time command console (voice + text UI)
│   ├── index.html       # Web interface
│   └── server/          # Node.js backend
│       ├── server.js        # Main server, API routing, voice auth
│       ├── boru-tools.js    # Tool execution engine
│       ├── boru-brain.js    # Memory + context routing
│       ├── boru-workflow.js # Multi-step workflow engine
│       ├── boru-tasks.js    # Autonomous task queue
│       ├── boru-metrics.js  # Dashboard metrics
│       └── boru-telegram.js # Telegram remote control
├── scripts/
│   ├── xtts_server.py       # XTTS v2 TTS + voice verification (GPU · port 8020)
│   └── whisper_server.py    # faster-whisper STT large-v3 (GPU · port 8021)
├── .claude/             # Agent definitions, rules, slash commands
├── projects/            # Per-division configs: ARES · XR · MEDIA · SECURITY · KNOWLEDGE
└── docs/
    └── PARS_Whitepaper.pdf  # Full company whitepaper
```

### Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML/CSS/JS |
| Backend | Node.js + Express |
| LLM Routing | Groq — LLaMA 3.3 70B (tools) · LLaMA 3.1 8B (fast chat) |
| TTS | XTTS v2 (Coqui) with voice cloning |
| STT | faster-whisper large-v3 |
| Voice Auth | resemblyzer cosine similarity |
| Memory | Obsidian vault (MCP) |
| Remote Control | Playwright + Telegram |
| Agent Framework | Claude Code (Anthropic) |

### Quick Start

```bash
# 1. API Keys
echo "your-groq-key" > boru-panel/server/groq.key

# 2. Backend
cd boru-panel/server && npm install && node server.js

# 3. Python services (GPU recommended)
python scripts/xtts_server.py   # TTS + voice auth  (port 8020)
python scripts/whisper_server.py # STT              (port 8021)

# 4. Open panel
# Navigate to http://localhost:3737
```

---

## 📄 Documentation

| Resource | Link |
|---|---|
| 📄 Whitepaper | [docs/PARS_Whitepaper.pdf](docs/PARS_Whitepaper.pdf) |
| 🤖 Agent Index | [docs/PARS_AGENTS_INDEX.md](docs/PARS_AGENTS_INDEX.md) |
| 🔊 Voice Interface | [docs/PARS_VOICE_INTERFACE.md](docs/PARS_VOICE_INTERFACE.md) |
| 🔐 Security | [docs/PARS_SECURITY.md](docs/PARS_SECURITY.md) |
| 🧠 Memory Architecture | [docs/PARS_MEMORY.md](docs/PARS_MEMORY.md) |
| 🗺 MCP Map | [docs/PARS_MCP_MAP.md](docs/PARS_MCP_MAP.md) |

---

## 🌍 Founded

November 11, 2021 — by a university team of game developers, architects, and AR engineers united by a single vision:

> *To build a world where physical and digital realities are no longer separate.*

---

<div align="center">

**PARS · Poly Augmented Reality Systems**

*Always trust the process.*

</div>
