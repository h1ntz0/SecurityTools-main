import { DICEWARE_WORDLIST } from '../data/diceware';

export interface PasswordConfig {
  length: number;
  useUpper: boolean;
  useLower: boolean;
  useNumbers: boolean;
  useSymbols: boolean;
  excludeAmbiguous: boolean;
}

export function generateSecurePassword(config: PasswordConfig): string {
  let charPool = '';
  if (config.useUpper) charPool += config.excludeAmbiguous ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (config.useLower) charPool += config.excludeAmbiguous ? 'abcdefghijkmnopqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
  if (config.useNumbers) charPool += config.excludeAmbiguous ? '23456789' : '0123456789';
  if (config.useSymbols) charPool += '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (!charPool) {
    charPool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  }

  const length = Math.max(8, Math.min(128, config.length));
  let result = '';

  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);
    for (let i = 0; i < length; i++) {
      result += charPool[randomValues[i] % charPool.length];
    }
  } else {
    for (let i = 0; i < length; i++) {
      result += charPool[Math.floor(Math.random() * charPool.length)];
    }
  }

  return result;
}

export function generateDicewarePassphrase(wordCount = 5): string {
  const words: string[] = [];
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const randomValues = new Uint32Array(wordCount);
    window.crypto.getRandomValues(randomValues);
    for (let i = 0; i < wordCount; i++) {
      words.push(DICEWARE_WORDLIST[randomValues[i] % DICEWARE_WORDLIST.length]);
    }
  } else {
    for (let i = 0; i < wordCount; i++) {
      words.push(DICEWARE_WORDLIST[Math.floor(Math.random() * DICEWARE_WORDLIST.length)]);
    }
  }
  return words.join('-');
}

export function calculatePasswordEntropy(password: string): {
  bits: number;
  strengthLabel: string;
  crackTimeEstimate: string;
  percentage: number;
  colorClass: string;
} {
  if (!password) {
    return { bits: 0, strengthLabel: 'None', crackTimeEstimate: 'Instant', percentage: 0, colorClass: 'text-neutral-500' };
  }

  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/[0-9]/.test(password)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32;

  if (poolSize === 0) poolSize = 26;
  const bits = Math.round(password.length * Math.log2(poolSize));

  let strengthLabel = 'Very Weak';
  let crackTimeEstimate = 'Seconds';
  let percentage = 15;
  let colorClass = 'text-red-400';

  if (bits >= 100) {
    strengthLabel = 'Exceptional';
    crackTimeEstimate = 'Centuries / Mathematically Impractical';
    percentage = 100;
    colorClass = 'text-[#00FF94]';
  } else if (bits >= 75) {
    strengthLabel = 'Strong';
    crackTimeEstimate = 'Decades to Millennia';
    percentage = 80;
    colorClass = 'text-[#00FF94]';
  } else if (bits >= 50) {
    strengthLabel = 'Moderate';
    crackTimeEstimate = 'Months to Years';
    percentage = 50;
    colorClass = 'text-amber-400';
  } else if (bits >= 35) {
    strengthLabel = 'Weak';
    crackTimeEstimate = 'Minutes to Days';
    percentage = 30;
    colorClass = 'text-red-400';
  }

  return { bits, strengthLabel, crackTimeEstimate, percentage, colorClass };
}

// Pure JS SHA-256 fallback implementation
function sha256Fallback(str: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }

  const maxWord = Math.pow(2, 32);
  let i = 0, j = 0;
  let result = '';

  const words: number[] = [];
  const asciiBitLength = str.length * 8;

  const hash: number[] = [];
  const k: number[] = [];
  let primeCounter = 0;

  const isComposite: Record<number, number> = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 300; i += candidate) {
        isComposite[i] = candidate;
      }
      hash[primeCounter] = (Math.pow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (Math.pow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  let ascii = str + '\x80';
  while ((ascii.length % 64) - 56) ascii += '\x00';
  for (i = 0; i < ascii.length; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return '';
    words[i >> 2] |= j << (((3 - i) % 4) * 8);
  }
  words[words.length] = (asciiBitLength / maxWord) | 0;
  words[words.length] = asciiBitLength;

  for (j = 0; j < words.length; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash.slice(0);

    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15],
        w2 = w[i - 2];

      const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
      const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
      w[i] = i < 16 ? w[i] : (w[i - 16] + s0 + w[i - 7] + s1) | 0;

      const s1b = rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25);
      const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
      const temp1 = (hash[7] + s1b + ch + k[i] + w[i]) | 0;
      const s0b = rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22);
      const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
      const temp2 = (s0b + maj) | 0;

      hash[7] = hash[6];
      hash[6] = hash[5];
      hash[5] = hash[4];
      hash[4] = (hash[3] + temp1) | 0;
      hash[3] = hash[2];
      hash[2] = hash[1];
      hash[1] = hash[0];
      hash[0] = (temp1 + temp2) | 0;
    }

    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j >= 0; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? '0' : '') + b.toString(16);
    }
  }
  return result;
}

export async function computeHash(text: string, algorithm: 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await window.crypto.subtle.digest(algorithm, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fallback below
    }
  }

  return sha256Fallback(text);
}
