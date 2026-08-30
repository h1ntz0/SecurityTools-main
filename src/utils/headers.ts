export interface SecurityHeadersConfig {
  cspMode: 'strict' | 'relaxed' | 'spa';
  enableHsts: boolean;
  hstsPreload: boolean;
  frameOptions: 'DENY' | 'SAMEORIGIN' | 'OFF';
  contentTypeOptions: boolean;
  referrerPolicy: 'no-referrer' | 'strict-origin-when-cross-origin' | 'no-referrer-when-downgrade';
  permissionsPolicy: boolean;
  coop: boolean;
  coep: boolean;
}

export function generateSecurityHeaders(config: SecurityHeadersConfig): Record<string, string> {
  const headers: Record<string, string> = {};

  // Content Security Policy
  if (config.cspMode === 'strict') {
    headers['Content-Security-Policy'] =
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;";
  } else if (config.cspMode === 'spa') {
    headers['Content-Security-Policy'] =
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';";
  } else {
    headers['Content-Security-Policy'] =
      "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; frame-ancestors 'self';";
  }

  // Strict-Transport-Security
  if (config.enableHsts) {
    let val = 'max-age=63072000; includeSubDomains';
    if (config.hstsPreload) val += '; preload';
    headers['Strict-Transport-Security'] = val;
  }

  // X-Frame-Options
  if (config.frameOptions !== 'OFF') {
    headers['X-Frame-Options'] = config.frameOptions;
  }

  // X-Content-Type-Options
  if (config.contentTypeOptions) {
    headers['X-Content-Type-Options'] = 'nosniff';
  }

  // Referrer-Policy
  headers['Referrer-Policy'] = config.referrerPolicy;

  // Permissions-Policy
  if (config.permissionsPolicy) {
    headers['Permissions-Policy'] =
      'camera=(), microphone=(), geolocation=(), payment=(), usb=(), screen-wake-lock=()';
  }

  // Cross-Origin-Opener-Policy
  if (config.coop) {
    headers['Cross-Origin-Opener-Policy'] = 'same-origin';
  }

  // Cross-Origin-Embedder-Policy
  if (config.coep) {
    headers['Cross-Origin-Embedder-Policy'] = 'require-corp';
  }

  return headers;
}

export function formatHeadersForServer(
  headers: Record<string, string>,
  target: 'nginx' | 'caddy' | 'cloudflare' | 'nextjs' | 'apache'
): string {
  if (target === 'nginx') {
    return Object.entries(headers)
      .map(([k, v]) => `add_header ${k} "${v}" always;`)
      .join('\n');
  }

  if (target === 'caddy') {
    const lines = Object.entries(headers).map(([k, v]) => `    ${k} "${v}"`);
    return `header {\n${lines.join('\n')}\n}`;
  }

  if (target === 'apache') {
    return Object.entries(headers)
      .map(([k, v]) => `Header always set ${k} "${v}"`)
      .join('\n');
  }

  if (target === 'cloudflare') {
    const rules = Object.entries(headers).map(([k, v]) => `  response.headers.set('${k}', '${v}');`);
    return `addEventListener('fetch', event => {\n  event.respondWith(handleRequest(event.request))\n})\n\nasync function handleRequest(request) {\n  const response = await fetch(request)\n${rules.join('\n')}\n  return response\n}`;
  }

  if (target === 'nextjs') {
    const headerObjs = Object.entries(headers).map(([k, v]) => `      { key: '${k}', value: '${v.replace(/'/g, "\\'")}' }`);
    return `// next.config.js\nmodule.exports = {\n  async headers() {\n    return [\n      {\n        source: '/(.*)',\n        headers: [\n${headerObjs.join(',\n')}\n        ],\n      },\n    ]\n  },\n}`;
  }

  return '';
}
