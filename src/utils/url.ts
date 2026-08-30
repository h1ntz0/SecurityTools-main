import { UrlAnalysisResult } from '../types';

export function analyzeUrl(inputUrl: string): UrlAnalysisResult | null {
  try {
    const parsed = new URL(inputUrl.trim());
    const params: Record<string, string> = {};
    parsed.searchParams.forEach((val, key) => {
      params[key] = val;
    });

    const risks: { severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'; description: string }[] = [];

    // Protocol check
    if (parsed.protocol === 'http:') {
      risks.push({
        severity: 'HIGH',
        description: 'Unencrypted plain HTTP protocol. Sensitive tokens and traffic are vulnerable to MITM interception.'
      });
    }

    // IP as host
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(parsed.hostname)) {
      risks.push({
        severity: 'MEDIUM',
        description: 'Raw IP address host. Often indicates unverified backend, internal test servers, or direct C2 node.'
      });
    }

    // High param count
    if (Object.keys(params).length > 6) {
      risks.push({
        severity: 'LOW',
        description: `High query parameter count (${Object.keys(params).length}). May cause sensitive leakage into web access logs.`
      });
    }

    // Suspicious keywords in path / params
    const rawLower = inputUrl.toLowerCase();
    const xssPatterns = ['<script', 'javascript:', 'eval(', 'document.cookie', 'onload=', 'onerror='];
    if (xssPatterns.some(p => rawLower.includes(p))) {
      risks.push({
        severity: 'CRITICAL',
        description: 'Potential XSS or script injection payload detected in query arguments or pathname.'
      });
    }

    // Punycode check
    if (parsed.hostname.startsWith('xn--')) {
      risks.push({
        severity: 'HIGH',
        description: 'Punycode/IDN hostname detected. Check against Homograph attack vectors spoofing genuine brand domains.'
      });
    }

    // Port check
    if (parsed.port && !['80', '443'].includes(parsed.port)) {
      risks.push({
        severity: 'LOW',
        description: `Non-standard service port :${parsed.port} in use.`
      });
    }

    return {
      protocol: parsed.protocol.replace(':', ''),
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === 'https:' ? '443' : '80'),
      pathname: parsed.pathname || '/',
      search: parsed.search,
      params,
      hash: parsed.hash || 'none',
      origin: parsed.origin,
      risks
    };
  } catch {
    return null;
  }
}
