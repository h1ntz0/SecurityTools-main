<div align="center">

# 🛡️ SecurityTools
### Modern Client-Side Cryptographic & Security Engineering Console

[![React](https://img.shields.io/badge/React-19.0-2563eb?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-F59E0B?style=flat-square&logo=tailwindcss&logoColor=black)](https://tailwindcss.com/)
[![WebCrypto API](https://img.shields.io/badge/WebCrypto-Hardware_CSPRNG-000000?style=flat-square&logo=w3c&logoColor=white)](https://www.w3.org/TR/WebCryptoAPI/)
[![Nginx](https://img.shields.io/badge/Nginx-Production_Ready-009639?style=flat-square&logo=nginx&logoColor=white)](https://nginx.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

<p align="center">
  A production-grade, offline-first security workbench built for developers, penetration testers, and security engineers. Operates with <strong>zero network egress</strong>, hardware-backed cryptographic primitives, and an ultra-dense, keyboard-first terminal design system.
</p>

---

</div>

## 📑 Table of Contents
- [Key Architectural Principles](#-key-architectural-principles)
- [Design System (Industrial Amber Dark Mode)](#-design-system-industrial-amber-dark-mode)
- [Module Matrix & Capabilities](#-module-matrix--capabilities)
- [Cryptographic Specifications](#-cryptographic-specifications)
- [Mobile & Local LAN Access](#-mobile--local-lan-access)
- [Installation & Getting Started](#-installation--getting-started)
- [Production Nginx Deployment](#-production-nginx-deployment)
- [Keyboard Shortcuts](#-keyboard-shortcuts)
- [License](#-license)

---

## ⚡ Key Architectural Principles

1. **Zero Data Telemetry & Egress**: 100% of cryptographic operations (hashing, symmetric key derivation, AES-GCM encryption, JWT parsing, and entropy calculation) occur within your local browser runtime. Zero bytes leave your machine.
2. **Strict 3-Color Industrial Palette**: Engineered without unnecessary decorative graphics, emojis, or AI slop. High-contrast typography optimized for long coding sessions and rapid analysis.
3. **Modular Categorized Workspace**: Distinct workspaces organized via a persistent sidebar drawer and synchronized via URL hash routing (`#dashboard`, `#crypto-password`, `#crypto-aes`, etc.).
4. **Mobile Responsive & Wi-Fi Ready**: Fully responsive layout tested across mobile viewports (iPhone/Android) and desktop monitors.

---

## 🎨 Design System (Industrial Amber Dark Mode)

SecurityTools is engineered with a strict 3-color palette adhering to high-contrast accessibility standards:

| Token | Hex Code | Role | Description |
|---|---|---|---|
| **Canvas / Background** | `#0B0F17` / `#131924` | Deep Obsidian | Primary workspace, panel surfaces, and borders |
| **Accent** | `#F59E0B` | Industrial Terminal Amber | Active indicators, focus states, cryptographic badges |
| **Foreground / Text** | `#E2E8F0` | Crisp Off-White | Monospace headers, terminal outputs, JSON claims |

---

## 🛠️ Module Matrix & Capabilities

### 1. Cryptography & Primitives
- **Password & NIST Entropy Generator (`Ctrl+1`)**:
  - Hardware-backed CSPRNG (`window.crypto.getRandomValues`)
  - NIST 800-63B Shannon Entropy bit calculation & brute-force time estimates
  - EFF Diceware 5-word passphrase generator with pure JavaScript fallback
- **AES-GCM-256 Symmetric Vault (`Ctrl+6`)**:
  - Client-side key derivation via PBKDF2-HMAC-SHA256 (100,000 iterations)
  - 128-bit authentication tag verification to prevent bit-flipping attacks
  - Exportable JSON envelope format with CSPRNG salt & IV

### 2. Integrity & Encoders
- **Hash Checksum & Match Verifier (`Ctrl+2`)**:
  - Instant SHA-1, SHA-256, SHA-384, and SHA-512 digest computation
  - Constant-time verification matcher for file integrity checks
  - Built-in pure JS fallback engine for non-secure mobile browser contexts
- **Multi-Format Transformer (`Ctrl+7`)**:
  - Simultaneous real-time conversion: Base64, Base64URL, Hex bytes, 8-bit binary stream, URL percent-encoding, HTML entities, and ROT13

### 3. Application Security & Auth
- **JWT Token Deep Inspector (`Ctrl+3`)**:
  - JOSE header and payload claims parser
  - Real-time validity indicator (Active vs. Expired countdown timestamp)
  - Standard claim definitions breakdown (`iss`, `sub`, `aud`, `exp`, `nbf`, `iat`, `jti`)
- **HTTP Security Headers Builder (`Ctrl+8`)**:
  - Hardened rule generator for CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Permissions-Policy, COOP/COEP
  - 1-click export configs for **Nginx**, **Caddy**, **Cloudflare**, **Apache**, and **Next.js**

### 4. Network & Threat Intelligence
- **CIDR Subnet Calculator (`Ctrl+5`)**:
  - IPv4 subnet boundary calculations: Network ID, Broadcast, Usable Host range
  - Wildcard mask, binary netmask breakdown, and CIDR prefix allocation
- **URL Risk & Injection Analyzer (`Ctrl+4`)**:
  - Dissect protocol boundaries, port anomalies, query parameter volume
  - Heuristic pattern detection for XSS vectors, punycode spoofing, and unencrypted HTTP
- **MITRE ATT&CK Port & Risk DB**:
  - 27 common network services mapped to adversary tactics (Initial Access, Lateral Movement, Exfiltration)
  - Live risk-level filtering (Critical, High, Medium, Low)

### 5. System & Auditing
- **Session Audit Event Logs**:
  - In-memory chronological activity log recording all cryptographic transformations
  - 1-click JSON export for audit trail verification

---

## 🔒 Cryptographic Specifications

```
  [User Plaintext]
         │
         ▼
  [PBKDF2-HMAC-SHA256] ──► (100,000 Iterations + 16-byte CSPRNG Salt)
         │
         ▼
  [AES-256-GCM Key] ─────► (12-byte CSPRNG IV)
         │
         ▼
  [Sealed Envelope JSON] ──► { ciphertext, iv, salt, authTag, algorithm: "AES-GCM-256" }
```

---

## 📱 Mobile & Local LAN Access

SecurityTools includes an integrated CLI utility to seamlessly access the interface on your smartphone over local Wi-Fi:

```bash
# Serve over local Wi-Fi with automatic QR code generation
serve-mobile 8080
```

Access directly on mobile:
```
http://<YOUR_LOCAL_IP>:8080
```

---

## 🚀 Installation & Getting Started

### Prerequisites
- **Node.js**: v18.x or higher
- **npm** or **pnpm**

### Setup
```bash
# 1. Clone the repository
git clone https://github.com/h1ntz0/SecurityTools-main.git
cd SecurityTools-main

# 2. Install dependencies
npm install

# 3. Launch Vite development server
npm run dev
```

The console will be accessible at `http://localhost:5173`.

---

## 🌐 Production Nginx Deployment

```bash
# 1. Compile the production distribution
npm run build

# 2. Configure Nginx virtual host (/etc/nginx/sites-available/securitytools)
server {
    listen 80;
    listen 8080;
    server_name _;

    root /path/to/SecurityTools/dist;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript image/svg+xml;

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-store, no-cache, must-revalidate" always;
    }
}

# 3. Reload Nginx
sudo nginx -t && sudo nginx -s reload
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + K` / `Cmd + K` | Global Command Palette & Fuzzy Tool Search |
| `Ctrl + 0` | Overview Dashboard |
| `Ctrl + 1` | Password & NIST Entropy Generator |
| `Ctrl + 2` | Hash & Checksum Verifier |
| `Ctrl + 3` | JWT Token Inspector |
| `Ctrl + 4` | URL & Injection Analyzer |
| `Ctrl + 5` | CIDR Subnet Calculator |
| `Ctrl + 6` | AES-GCM-256 Symmetric Vault |
| `Ctrl + 7` | Multi-Format Transformer |
| `Ctrl + 8` | HTTP Security Headers Builder |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
