# CyberShield AI — Enterprise Security Operations & Threat Response Platform

CyberShield AI is an integrated, full-stack cybersecurity operations platform that combines automated AI-powered threat analysis, vulnerability lifecycle management, real-time incident containment, cyberbullying and harassment detection, zero-knowledge client-side password entropy auditing, and interactive cyber awareness training.

Built with **React 19**, **TypeScript**, **Tailwind CSS v4**, **Express**, **Vite**, and the modern **Google GenAI SDK (`@google/genai`)**.

---

## 🌟 Key Capabilities & Modules

1. **AI Threat & Phishing Analyzer**:
   - Analyzes URLs, raw emails, SMS smishing messages, WhatsApp scams, text samples, and phone numbers.
   - Dual-engine architecture: Fast deterministic heuristic baseline paired with deep Gemini AI semantic analysis.
   - Accurately classifies legitimate international & domestic phone numbers (E.164 conforming) as `SAFE`, while catching predatory 1-900 lines, Wangiri satellite scams, IRS/bank impersonations, and tech support refund schemes.
   - One-click incident escalation directly to the Incident Response Center.

2. **Incident Response & Investigation Hub**:
   - Real-time containment workflows: Quarantining endpoints, revoking credentials, isolating subnet traffic, blocking malicious IPs.
   - Evidence timeline, severity categorization, triage logs, and SOC forensic audit trails.

3. **Vulnerability Management Center (CVE)**:
   - Real-time tracking of CVE advisories with CVSS 3.1 scoring, affected components, and exploit maturity.
   - Automated AI remediation playbooks and patch tracking.

4. **Cyberbullying & Harassment Protection**:
   - Real-time text analysis for toxic language, cyber-harassment, threats, and hate speech.
   - Severity scoring, emotional distress indicators, and instant incident reporting.

5. **Client-Side Password Security Vault**:
   - 100% zero-knowledge, client-side entropy calculation.
   - Real-time brute-force crack time estimates, dictionary patterns, common leet-speak detection, and entropy recommendations.

6. **Cyber Awareness & Phishing Simulator**:
   - Interactive training scenarios simulating spear-phishing, fake CEO wire transfers, cloud credential harvest attempts, and smishing attacks.
   - Employee awareness metrics, quiz scoring, and real-time feedback.

7. **System Security & Compliance Audit Logs**:
   - Comprehensive audit logging of all threat detections, user authentication events, incident escalations, and system actions.
   - Filterable by severity, module, and timestamp.

---

## 🏗️ Project Architecture

```
cybershield-ai/
├── .env.example            # Environment variables template
├── .gitignore              # Git ignored files & directories
├── index.html              # Single Page Application HTML entry point
├── metadata.json           # Application metadata & permissions
├── package.json            # Dependencies and npm run scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build & plugin configuration
├── server.ts               # Express backend API + Vite middleware server (Port 3000)
├── public/                 # Static public assets (images, icons)
├── src/
│   ├── main.tsx            # React application entry point
│   ├── App.tsx             # Root React component, state management & tab routing
│   ├── index.css           # Global Tailwind CSS imports & base styles
│   ├── types.ts            # TypeScript definitions (Threats, Incidents, CVEs, Users, etc.)
│   ├── assets/
│   │   └── images/         # High-resolution SOC graphics and avatar assets
│   ├── lib/
│   │   ├── api.ts          # Client-side API client for interacting with Express endpoints
│   │   └── passwordAnalyzer.ts # Client-side password entropy & security calculator
│   └── components/
│       ├── TopBar.tsx                      # Top navigation bar, health status & user profile
│       ├── Sidebar.tsx                     # Primary navigation sidebar & module selector
│       ├── DashboardView.tsx               # Executive SOC overview & telemetry widgets
│       ├── ThreatAnalyzerView.tsx          # Multi-vector phishing & threat analyzer
│       ├── VulnerabilityCenterView.tsx     # CVE vulnerability tracker & remediation
│       ├── IncidentResponseView.tsx        # Incident triage, containment & forensic evidence
│       ├── CyberbullyingProtectionView.tsx # Toxicity & harassment protection tool
│       ├── PasswordSecurityView.tsx        # Zero-knowledge password entropy vault
│       ├── CyberAwarenessView.tsx          # Phishing simulator & interactive security drills
│       ├── AuditLogsView.tsx               # Compliance audit trail & security activity logs
│       ├── AuthModal.tsx                   # User authentication & role selection modal
│       ├── LoginPage.tsx                   # Full-page dedicated authentication view
│       └── NotificationsModal.tsx          # Real-time security notifications drawer
└── README.md               # Complete local setup & deployment guide (this file)
```

---

## 🚀 Getting Started Locally

### Prerequisites

- **Node.js**: `v18.0.0` or higher (Node 20+ or 22+ recommended)
- **Package Manager**: `npm` (comes with Node), `pnpm`, `yarn`, or `bun`

Verify your Node version:
```bash
node -v
npm -v
```

---

### Step 1: Extract or Clone the Source Code

If you downloaded the `cybershield-ai.zip` archive or cloned the repository, navigate into the project directory:

```bash
cd cybershield-ai
```

---

### Step 2: Install Project Dependencies

Run the standard install command:

```bash
npm install
```

*(Or if using bun: `bun install`)*

---

### Step 3: Configure Environment Variables

Create your `.env` file from the provided `.env.example`:

```bash
cp .env.example .env
```

Open `.env` in your text editor:

```env
# Optional: Required for real Gemini AI deep threat scanning & cyberbullying classification.
# If omitted or invalid, CyberShield AI automatically falls back gracefully to its
# deterministic heuristic security engines without crashing!
GEMINI_API_KEY="your-gemini-api-key-here"

# The port for the unified full-stack server (default is 3000)
PORT=3000

# Base URL for the app
APP_URL="http://localhost:3000"
```

> **Note on GEMINI_API_KEY**:
> You can obtain a free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
> Even without an API key, the built-in deterministic heuristic engine analyzes threats, phone numbers, CVEs, password entropy, and incident management smoothly!

---

### Step 4: Run the Development Server

Start the full-stack server (Express backend + Vite frontend):

```bash
npm run dev
```

You should see:
```
[CyberShield AI] Core server running on http://0.0.0.0:3000
```

Now open your browser and navigate to:
```
http://localhost:3000
```

---

## 🛠️ Available NPM Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the unified Express + Vite development server on port 3000 |
| `npm run build` | Compiles TypeScript and creates optimized production assets in `dist/` |
| `npm start` | Runs the production server using `tsx server.ts` |
| `npm run lint` | Runs TypeScript type checking (`tsc --noEmit`) to verify code health |
| `npm run clean` | Cleans build artifacts (`dist/`) |

---

## 🚢 Production Deployment

To build and run in production mode:

```bash
# 1. Build client bundle
npm run build

# 2. Run the Express server with NODE_ENV=production
NODE_ENV=production npm start
```

The Express server will automatically serve the compiled static files from `dist/` and handle all `/api/*` endpoints.

---

## 📡 Key API Endpoints Reference

All API routes run on the unified origin (Port 3000):

- `GET /api/health` — Returns server health check, uptime, memory, and registered API catalog.
- `GET /api/backend/status` — Comprehensive backend runtime telemetry, AI provider status, and database metrics.
- `GET /api/backend/ping` — Low-latency roundtrip ping measurement endpoint.
- `GET /api/backend/db-tables` — Real-time database collections and records inspector.
- `POST /api/backend/reset-db` — Re-seeds backend database to default enterprise datasets.
- `POST /api/auth/login` — Authenticates credentials or quick-switches role personas.
- `POST /api/auth/register` — Registers new enterprise user account with RBAC.
- `GET /api/auth/me` — Retrieves current session user from JWT Bearer token.
- `POST /api/threats/analyze` — Analyzes URLs, emails, SMS, phone numbers, or text using deterministic rules + Gemini AI.
- `GET /api/threats/history` — Retrieves threat scanning audit history.
- `GET /api/incidents` — Retrieves active incident response records.
- `POST /api/incidents` — Creates or escalates an incident ticket.
- `POST /api/incidents/:id/ai-analyze` — Runs AI incident containment and MITRE ATT&CK mitigation.
- `GET /api/vulnerabilities` — Retrieves CVE vulnerability records.
- `POST /api/cyberbullying/analyze` — Analyzes text for toxicity, harassment, and threat signals.
- `GET /api/awareness/modules` — Retrieves 8 interactive cybersecurity training modules.
- `GET /api/dashboard/summary` — Returns aggregated SOC telemetry, metrics, and trends.
- `GET /api/notifications` — Retrieves real-time security alert notifications.
- `GET /api/audit-logs` — Retrieves immutable security audit log entries.
- `GET /api/export-project` — Downloads the complete project source code as a ZIP archive.
- `GET /api/notifications` — Retrieves real-time security notifications.
- `GET /api/export-project` — Downloads the complete project source code as a ZIP archive.

---

## 🛡️ License & Credits

Designed and built as a resilient, enterprise-ready cybersecurity management platform.
Distributed for security engineering, education, and incident response teams.
