import { MultiFormatEncoding } from '../types';

export function stringToHex(str: string): string {
  const enc = new TextEncoder();
  const bytes = enc.encode(str);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

export function hexToString(hex: string): string {
  const clean = hex.replace(/[^0-9a-fA-F]/g, '');
  if (clean.length % 2 !== 0) throw new Error('Hex string must have an even length');
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < clean.length; i += 2) {
    bytes[i / 2] = parseInt(clean.substring(i, i + 2), 16);
  }
  return new TextDecoder().decode(bytes);
}

export function stringToBinary(str: string): string {
  const enc = new TextEncoder();
  const bytes = enc.encode(str);
  return Array.from(bytes).map(b => b.toString(2).padStart(8, '0')).join(' ');
}

export function binaryToString(bin: string): string {
  const clean = bin.replace(/[^01]/g, '');
  if (clean.length % 8 !== 0) throw new Error('Binary stream must be multiples of 8 bits');
  const bytes = new Uint8Array(clean.length / 8);
  for (let i = 0; i < clean.length; i += 8) {
    bytes[i / 8] = parseInt(clean.substring(i, i + 8), 2);
  }
  return new TextDecoder().decode(bytes);
}

export function stringToRot13(str: string): string {
  return str.replace(/[a-zA-Z]/g, (c) => {
    const code = c.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      return String.fromCharCode(((code - 65 + 13) % 26) + 65);
    }
    return String.fromCharCode(((code - 97 + 13) % 26) + 97);
  });
}

export function stringToHtmlEntities(str: string): string {
  return str.replace(/[&<>"'/]/g, (s) => `&#${s.charCodeAt(0)};`);
}

export function transformAllEncodings(input: string): MultiFormatEncoding {
  if (!input) {
    return {
      raw: '',
      base64: '',
      base64Url: '',
      hex: '',
      binary: '',
      urlEncoded: '',
      htmlEntities: '',
      rot13: ''
    };
  }

  let b64 = '';
  try {
    const bytes = new TextEncoder().encode(input);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    b64 = btoa(binary);
  } catch {
    b64 = 'Encoding error';
  }

  const b64Url = b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const hex = stringToHex(input);
  const binary = stringToBinary(input);
  const urlEncoded = encodeURIComponent(input);
  const htmlEntities = stringToHtmlEntities(input);
  const rot13 = stringToRot13(input);

  return {
    raw: input,
    base64: b64,
    base64Url: b64Url,
    hex,
    binary,
    urlEncoded,
    htmlEntities,
    rot13
  };
}
