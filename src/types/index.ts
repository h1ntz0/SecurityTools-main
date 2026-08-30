export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'ALL';

export interface PortRecord {
  port: number;
  service: string;
  proto: string;
  risk: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  vector: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  tool: string;
  action: string;
  details?: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

export type ToolTab = 'password' | 'hash' | 'jwt' | 'url' | 'cidr' | 'aes' | 'encoder' | 'headers';

export interface SubnetResult {
  network: string;
  netmask: string;
  broadcast: string;
  firstHost: string;
  lastHost: string;
  usableHosts: number;
  totalHosts: number;
  prefix: number;
  wildcard: string;
  binaryMask: string;
  ipClass: string;
}

export interface JwtTokenData {
  header: Record<string, unknown> | null;
  payload: Record<string, unknown> | null;
  signature: string;
  rawHeader: string;
  rawPayload: string;
  isExpired: boolean | null;
  issuedAt?: string;
  expiresAt?: string;
  algorithm?: string;
}

export interface UrlAnalysisResult {
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  params: Record<string, string>;
  hash: string;
  origin: string;
  risks: { severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'; description: string }[];
}

export interface AesEncryptedPayload {
  version: '1.0';
  algorithm: 'AES-GCM-256';
  kdf: 'PBKDF2-SHA256';
  iterations: number;
  salt: string; // Base64
  iv: string;   // Base64
  ciphertext: string; // Base64 (includes 128-bit auth tag)
}

export interface MultiFormatEncoding {
  raw: string;
  base64: string;
  base64Url: string;
  hex: string;
  binary: string;
  urlEncoded: string;
  htmlEntities: string;
  rot13: string;
}
