import { JwtTokenData } from '../types';

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
}

export function parseJwt(token: string): JwtTokenData | null {
  try {
    const parts = token.trim().split('.');
    if (parts.length !== 3) {
      return null;
    }

    const rawHeader = base64UrlDecode(parts[0]);
    const rawPayload = base64UrlDecode(parts[1]);

    const header = JSON.parse(rawHeader);
    const payload = JSON.parse(rawPayload);

    let isExpired: boolean | null = null;
    let expiresAt: string | undefined;
    let issuedAt: string | undefined;

    if (payload.exp && typeof payload.exp === 'number') {
      const expMs = payload.exp * 1000;
      isExpired = Date.now() > expMs;
      expiresAt = new Date(expMs).toISOString();
    }

    if (payload.iat && typeof payload.iat === 'number') {
      issuedAt = new Date(payload.iat * 1000).toISOString();
    }

    return {
      header,
      payload,
      signature: parts[2],
      rawHeader: JSON.stringify(header, null, 2),
      rawPayload: JSON.stringify(payload, null, 2),
      isExpired,
      expiresAt,
      issuedAt,
      algorithm: header.alg || 'Unknown'
    };
  } catch {
    return null;
  }
}
