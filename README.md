# Mailman 📬

A modern Chrome extension that transforms your Gmail inbox into a calm, organized, stack-based email workspace.

Inspired by **Linear**, **Notion**, and **Arc Browser**.

## Features

- **Stack Grouping** — Emails organized by category (Work, Personal, Finance, Shopping, etc.)
- **Sender Grouping** — See all emails from a sender in one place
- **Priority Sorting** — Critical, Important, Medium, Low with smart ranking
- **Focus Mode** — Hide newsletters, promotions, and spam
- **Command Palette** — Quick search with `⌘K`
- **Keyboard Shortcuts** — Navigate with J/K, toggle focus with F, theme with T
- **Dark & Light Themes** — Premium design with smooth animations
- **Chrome Side Panel** — Lives alongside Gmail without interfering

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Extension | WXT (Manifest V3) |
| State | Zustand |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Storage | IndexedDB + chrome.storage |
| Data | Gmail REST API via OAuth2 |

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Google Chrome

### Installation

```bash
# Install dependencies
npm install

# Start development server (opens Chrome with extension loaded)
npm run dev
```

### Loading in Chrome (Manual)

1. Run `npm run build`
2. Open Chrome → `chrome://extensions`
3. Enable **Developer mode** (top right)
4. Click **Load unpacked**
5. Select the `.output/chrome-mv3` directory

### Gmail API Setup

To use with your Gmail account:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the **Gmail API**
4. Configure the **OAuth consent screen**
5. Create **OAuth client ID** credentials (Chrome Extension type)
6. Copy your extension ID from `chrome://extensions`
7. Replace `YOUR_CLIENT_ID.apps.googleusercontent.com` in `wxt.config.ts`

## Project Structure

```
mailing/
├── entrypoints/           # Extension entry points
│   ├── background.ts      # Service worker
│   ├── content.ts         # Gmail page enhancements
│   ├── sidepanel/          # Main UI (React app)
│   └── popup/              # Quick actions popup
├── components/             # React components
│   ├── layout/             # Header, NavTabs
│   ├── stacks/             # StackList, StackCard
│   ├── senders/            # SenderList, SenderCard
│   ├── preview/            # Email preview panel
│   ├── search/             # Search bar
│   ├── modals/             # Settings
│   ├── ui/                 # Avatar, Badge, Toggle, etc.
│   └── animations/         # FadeIn, StaggerChildren
├── services/               # Business logic
│   ├── gmail/              # API client, auth
│   ├── grouping/           # Category & sender groupers
│   ├── ranking/            # Priority ranker
│   └── search/             # Search engine
├── hooks/                  # React hooks
├── store/                  # Zustand stores
├── storage/                # IndexedDB & chrome.storage
├── types/                  # TypeScript type definitions
├── utils/                  # Utilities
├── constants/              # Categories, shortcuts, theme
└── styles/                 # Tailwind CSS
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `J` | Next email |
| `K` | Previous email |
| `Enter` | Open email |
| `Escape` | Close preview |
| `⌘K` / `/` | Search |
| `F` | Toggle focus mode |
| `T` | Toggle theme |
| `1` | Stack view |
| `2` | Sender view |

## Development

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run compile      # Type check
```

## Architecture

The extension uses a **hybrid Side Panel + Content Script** approach:

- **Side Panel**: Houses the full Mailman UI (stacks, search, preview, settings)
- **Content Script**: Adds a lightweight floating indicator on Gmail
- **Background Worker**: Manages Gmail API auth, side panel lifecycle, badge updates
- **Gmail API**: Fetches emails via OAuth2 (read-only, local processing)

All data processing happens locally in the browser. No external servers.

## License

MIT
