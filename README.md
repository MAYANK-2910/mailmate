<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-6366f1?style=for-the-badge" alt="Version" />
  <img src="https://img.shields.io/badge/manifest-v3-34d399?style=for-the-badge" alt="Manifest V3" />
  <img src="https://img.shields.io/badge/react-19-61dafb?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/typescript-strict-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/license-MIT-eab308?style=for-the-badge" alt="MIT License" />
</p>

<h1 align="center">📬 Mailman</h1>

<p align="center">
  <strong>Transform your Gmail into a calm, organized, stack-based email workspace.</strong>
</p>

<p align="center">
  A modern Chrome extension that replaces Gmail's flat chronological inbox<br/>
  with categorized stacks, sender groups, priority ranking, and focus mode.
</p>

<p align="center">
  <em>Inspired by <strong>Linear</strong>, <strong>Notion</strong>, and <strong>Arc Browser</strong></em>
</p>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📂 **Stack Grouping** | Emails auto-organized into 11 categories — Work, Personal, Finance, Shopping, Social, Newsletters, Promotions, Education, Updates, Spam, Important |
| 👤 **Sender Grouping** | See all emails from a sender in one collapsible group with unread counts |
| ⚡ **Priority Sorting** | Multi-factor scoring engine ranks emails as Critical, Important, Medium, or Low |
| 🎯 **Focus Mode** | One-click toggle hides newsletters, promotions, spam — shows only human conversations |
| 🔍 **Command Palette** | Fast search via `⌘K` across sender, subject, and category with keyboard navigation |
| ⌨️ **Keyboard Shortcuts** | Navigate with J/K, toggle focus with F, switch themes with T, and more |
| 🌙 **Dark & Light Themes** | Premium design with smooth Framer Motion animations and glassmorphism |
| 📌 **Chrome Side Panel** | Lives alongside Gmail — persists across tabs, zero CSS conflicts |
| 🔒 **Privacy First** | All processing local, read-only Gmail access, data never leaves your browser |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     Chrome Extension (WXT)                    │
├──────────────┬──────────────┬───────────────┬────────────────┤
│  Background  │  Side Panel  │Content Script │     Popup      │
│  (Worker)    │  (React App) │ (Gmail Page)  │ (Quick Actions)│
├──────────────┴──────────────┴───────────────┴────────────────┤
│                                                               │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │Gmail API│  │ Category │  │ Priority │  │   Search     │  │
│  │ Client  │→ │ Grouper  │→ │  Ranker  │→ │   Engine     │  │
│  └────┬────┘  └──────────┘  └──────────┘  └──────────────┘  │
│       │                                                       │
│  ┌────┴────┐  ┌──────────┐  ┌──────────┐                    │
│  │ OAuth2  │  │IndexedDB │  │ Zustand  │                    │
│  │(chrome. │  │  Cache   │  │  Store   │                    │
│  │identity)│  └──────────┘  └──────────┘                    │
│  └─────────┘                                                 │
└──────────────────────────────────────────────────────────────┘
```

**Why this architecture?**
- **Gmail API** (not DOM scraping) → reliable structured data, survives Gmail UI updates, supports 50k+ emails
- **Side Panel** (not content injection) → native Chrome surface, no CSS conflicts, persists across navigations
- **Content Script** is lightweight — just a floating indicator button on Gmail

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | React 19 + TypeScript (strict) | Type-safe, component-driven UI |
| **Extension** | WXT + Manifest V3 | Modern DX, file-based entrypoints, cross-browser |
| **State** | Zustand | Lightweight, no boilerplate, React 19 compatible |
| **Styling** | Tailwind CSS v4 | Utility-first, custom theme tokens, dark/light modes |
| **Animations** | Framer Motion | Spring physics, layout animations, gesture support |
| **Storage** | IndexedDB + chrome.storage | Offline cache + synced settings |
| **Data** | Gmail REST API + OAuth2 | Structured email data, full thread access |
| **Security** | DOMPurify | Sanitized HTML rendering for email bodies |
| **Utilities** | date-fns, clsx, react-window | Date formatting, class merging, virtualization |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+  
- **npm** 9+  
- **Google Chrome** (latest)

### 1. Clone & Install

```bash
git clone https://github.com/MAYANK-2910/mailmate.git
cd mailmate
npm install
```

### 2. Gmail API Setup

> You need a Google Cloud project to authenticate with Gmail.

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. **Create a new project** (or select existing)
3. Navigate to **APIs & Services → Library**
4. Search for **Gmail API** and click **Enable**
5. Go to **APIs & Services → OAuth consent screen**
   - Choose **External** user type
   - Fill in app name, support email
   - Add scope: `https://www.googleapis.com/auth/gmail.readonly`
   - Add your email as a test user
6. Go to **APIs & Services → Credentials**
   - Click **Create Credentials → OAuth client ID**
   - Application type: **Chrome Extension**
   - Item ID: *(get this from step 3 below)*

### 3. Configure Extension ID

```bash
# Start dev mode first to generate the extension
npm run dev
```

1. Open Chrome → `chrome://extensions` → Enable **Developer mode**
2. Find **Mailman** in the list and copy the **Extension ID**
3. Go back to Google Cloud Console → paste the ID in your OAuth credential
4. Copy the **Client ID** from Google Cloud Console
5. Open `wxt.config.ts` and replace:

```typescript
oauth2: {
  client_id: 'YOUR_CLIENT_ID.apps.googleusercontent.com',  // ← paste here
  scopes: ['https://www.googleapis.com/auth/gmail.readonly'],
},
```

### 4. Run

```bash
# Development (auto-reloads on changes)
npm run dev

# Production build
npm run build
```

### 5. Load in Chrome (Production)

1. Run `npm run build`
2. Open Chrome → `chrome://extensions`
3. Enable **Developer mode** (top right toggle)
4. Click **Load unpacked**
5. Select the `.output/chrome-mv3` folder
6. Navigate to **Gmail** → click the Mailman extension icon
7. **Sign in with Google** (one-click) → your stacks appear!

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `J` | Next email |
| `K` | Previous email |
| `Enter` | Open email |
| `Escape` | Close preview |
| `⌘K` or `/` | Open search |
| `F` | Toggle focus mode |
| `T` | Toggle dark/light theme |
| `1` | Switch to Stack view |
| `2` | Switch to Sender view |
| `E` | Archive |
| `S` | Star/Unstar |
| `R` | Reply |
| `Shift + ?` | Show all shortcuts |

---

## 📁 Project Structure

```
mailmate/
├── entrypoints/                # Chrome extension entry points
│   ├── background.ts           # Service worker — auth, side panel, badges
│   ├── content.ts              # Gmail page — floating indicator button
│   ├── sidepanel/              # Main UI (React app in Chrome Side Panel)
│   │   ├── index.html
│   │   ├── main.tsx
│   │   └── App.tsx             # Root app with auth flow + layout
│   └── popup/                  # Extension popup (quick actions)
│       ├── index.html
│       ├── main.tsx
│       └── App.tsx
│
├── components/                 # React components
│   ├── layout/                 # Header, NavTabs
│   ├── stacks/                 # StackList, StackCard, EmailRow
│   ├── senders/                # SenderList, SenderCard
│   ├── preview/                # PreviewPanel (email detail view)
│   ├── search/                 # SearchBar (command palette)
│   ├── modals/                 # SettingsModal
│   ├── ui/                     # Avatar, Badge, Skeleton, Toggle, EmptyState
│   └── animations/             # FadeIn, StaggerChildren
│
├── services/                   # Core business logic
│   ├── gmail/                  # Gmail API client + OAuth2 auth
│   │   ├── auth.ts             # chrome.identity token management
│   │   └── api.ts              # REST API, MIME parsing, batch ops
│   ├── grouping/               # Email organization
│   │   ├── categoryGrouper.ts  # Weighted scoring classifier
│   │   └── senderGrouper.ts    # Sender aggregation
│   ├── ranking/
│   │   └── priorityRanker.ts   # Multi-factor priority scoring
│   └── search/
│       └── searchEngine.ts     # Multi-field search + highlighting
│
├── hooks/                      # React hooks
│   ├── useEmails.ts            # Auth → fetch → categorize → rank pipeline
│   ├── useSearch.ts            # Debounced search with results
│   ├── useKeyboardShortcuts.ts # Global keyboard listener
│   ├── useTheme.ts             # CSS variable injection
│   └── useFocusMode.ts         # Noise category filtering
│
├── store/                      # Zustand state management
│   ├── emailStore.ts           # Emails, stacks, selections, UI state
│   └── settingsStore.ts        # Theme, preferences
│
├── storage/                    # Persistence layer
│   ├── indexedDB.ts            # Email cache + TTL cache
│   └── chromeStorage.ts        # Extension settings sync
│
├── types/                      # TypeScript type definitions
│   ├── email.ts                # Email, Sender, Gmail API types
│   ├── stack.ts                # Stack, SenderGroup
│   └── ui.ts                   # Theme, Settings, Shortcuts
│
├── utils/                      # Utility functions
│   ├── cn.ts                   # clsx class merging
│   ├── avatar.ts               # Deterministic avatar colors
│   ├── date.ts                 # Smart date formatting
│   ├── sanitize.ts             # DOMPurify HTML sanitization
│   └── debounce.ts             # Generic debounce
│
├── constants/                  # App constants
│   ├── categories.ts           # 11 categories with rules
│   ├── shortcuts.ts            # Keyboard shortcut mapping
│   └── theme.ts                # Dark/light color tokens
│
├── styles/
│   └── index.css               # Tailwind v4 + theme + animations
│
├── wxt.config.ts               # WXT extension configuration
├── tsconfig.json               # TypeScript strict config
├── package.json                # Dependencies and scripts
├── LICENSE                     # MIT
└── README.md                   # You are here
```

---

## 🧠 How It Works

### Email Pipeline

```
Gmail API  →  Parse MIME  →  Categorize  →  Rank Priority  →  Group into Stacks  →  Render
```

1. **Fetch** — Background worker authenticates via `chrome.identity`, fetches inbox via Gmail REST API
2. **Parse** — MIME payloads are decoded (base64url), headers extracted, senders parsed
3. **Categorize** — Weighted scoring across Gmail labels (50pts), sender domains (40pts), keywords (20pts)
4. **Rank** — Priority score from: unread (+30), urgency keywords (+25), recency (+20), starred (+15)
5. **Group** — Emails grouped into collapsible stacks by category or by sender
6. **Cache** — Results stored in IndexedDB for instant load on next open

### Category Classification

Each email is scored against all 11 categories. The highest-scoring category wins:

| Signal | Weight | Example |
|--------|--------|---------|
| Gmail Label match | 50 | `CATEGORY_PROMOTIONS` → Promotions |
| Sender domain match | 40 | `github.com` → Work |
| Subject keyword match | 20 | "invoice" → Finance |
| Snippet keyword match | 10 | "shipped" → Shopping |

---

## 🔒 Privacy & Security

- **Read-only access** — The extension only reads emails, never modifies or sends
- **Local processing** — All categorization, ranking, and search happens in your browser
- **No external servers** — Data goes directly from your browser to Google's API
- **Minimal permissions** — Only `gmail.readonly` scope
- **Sanitized rendering** — Email HTML is cleaned with DOMPurify before display
- **Secure storage** — Cached data stays in browser's IndexedDB, never transmitted

---

## 🔧 Development

```bash
npm run dev            # Start dev server (auto-opens Chrome)
npm run build          # Production build → .output/chrome-mv3/
npm run build:firefox  # Firefox build
npm run compile        # TypeScript type checking
npm run zip            # Package for Chrome Web Store
```

### Dev workflow

1. `npm run dev` starts WXT dev server with HMR
2. Changes to popup/sidepanel hot-reload instantly
3. Content script and background changes require extension reload
4. Open `chrome://extensions` → click the reload button on Mailman

---

## 🗺️ Roadmap

- [ ] Gmail compose integration (reply/forward from side panel)
- [ ] Custom category rules (user-defined keywords and domains)
- [ ] Email snoozing and reminders
- [ ] Unread count badge sync
- [ ] Cross-browser support (Firefox, Edge)
- [ ] Outlook and Yahoo Mail API adapters
- [ ] Email templates and quick replies
- [ ] Advanced analytics (response times, volume trends)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feat/my-feature`
3. **Commit** with conventional commits: `git commit -m "feat: add my feature"`
4. **Push** to your fork: `git push origin feat/my-feature`
5. **Open** a Pull Request

### Code Guidelines

- Functional React components only
- Strict TypeScript — no `any` types
- Conventional commit messages (`feat:`, `fix:`, `docs:`, `chore:`)
- All components must have ARIA labels for accessibility

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

