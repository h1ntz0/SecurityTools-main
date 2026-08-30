# SecurityTools

A fast, lightweight, and offline-friendly security toolkit that runs entirely in your browser.

No data leaves your device. Everything is computed locally using the standard Web Crypto API.

---

## Features

- **Password Generator**: Generate random passwords or Diceware passphrases with entropy score and brute-force estimates.
- **AES-GCM Encryption**: Encrypt and decrypt text using AES-256-GCM with PBKDF2 key derivation.
- **Hash & Checksum**: Compute and compare SHA-1, SHA-256, SHA-384, and SHA-512 hashes.
- **Multi-Encoder**: Convert text between Base64, Base64URL, Hex, Binary, URL-encoding, HTML entities, and ROT13.
- **JWT Decoder**: Inspect JWT header, claims payload, signature format, and token expiration time.
- **Security Headers**: Generate Content-Security-Policy (CSP), HSTS, and X-Frame-Options configs for Nginx, Caddy, Cloudflare, and Next.js.
- **Subnet Calculator**: Calculate IPv4 network address, broadcast, netmask, wildcard, and usable host ranges.
- **URL Analyzer**: Parse URL components, query parameters, protocol issues, and common injection patterns.
- **Port Reference**: Quick lookup table for standard network service ports and associated risks.
- **Activity Logs**: Local in-memory log of tools used in your session with JSON export.

---

## Quick Start

### Development
```bash
# Clone the repository
git clone https://github.com/h1ntz0/SecurityTools-main.git
cd SecurityTools-main

# Install dependencies
npm install

# Start local dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build & Deploy
```bash
# Build static bundle
npm run build
```

The output files will be in the `dist/` directory, ready to be served with Nginx, Apache, or any static file host.

---

## Privacy & Security

- **100% Client-Side**: All cryptography runs inside your browser sandbox.
- **Zero Telemetry**: No analytics, tracking pixels, or third-party API calls.
- **Offline Capable**: Once loaded, it works without an internet connection.

---

## Tech Stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS v4
- Web Crypto API

---

## License

MIT License. See [LICENSE](LICENSE) for details.
