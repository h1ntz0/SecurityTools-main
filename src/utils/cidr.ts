import { SubnetResult } from '../types';

function ipToInt(ip: string): number {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}

function intToIp(int: number): string {
  return [
    (int >>> 24) & 255,
    (int >>> 16) & 255,
    (int >>> 8) & 255,
    int & 255
  ].join('.');
}

export function calculateCidr(cidrInput: string): SubnetResult | null {
  try {
    const match = cidrInput.trim().match(/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\/(\d{1,2})$/);
    if (!match) return null;

    const [, ipStr, prefixStr] = match;
    const prefix = parseInt(prefixStr, 10);
    if (prefix < 0 || prefix > 32) return null;

    const octets = ipStr.split('.').map(Number);
    if (octets.some(o => isNaN(o) || o < 0 || o > 255)) return null;

    const ip = ipToInt(ipStr);
    const mask = prefix === 0 ? 0 : (0xFFFFFFFF << (32 - prefix)) >>> 0;
    const network = (ip & mask) >>> 0;
    const broadcast = (network | ~mask) >>> 0;

    const hostMin = prefix < 31 ? (network + 1) >>> 0 : network;
    const hostMax = prefix < 31 ? (broadcast - 1) >>> 0 : broadcast;
    const usableHosts = prefix >= 31 ? (prefix === 32 ? 1 : 2) : Math.max(0, Math.pow(2, 32 - prefix) - 2);
    const totalHosts = Math.pow(2, 32 - prefix);
    const wildcard = ~mask >>> 0;

    let ipClass = 'Classless / Special';
    const firstOctet = octets[0];
    if (firstOctet >= 1 && firstOctet <= 126) ipClass = 'Class A (Public/Private)';
    else if (firstOctet === 127) ipClass = 'Loopback (127.0.0.0/8)';
    else if (firstOctet >= 128 && firstOctet <= 191) ipClass = 'Class B (Public/Private)';
    else if (firstOctet >= 192 && firstOctet <= 223) ipClass = 'Class C (Public/Private)';
    else if (firstOctet >= 224 && firstOctet <= 239) ipClass = 'Class D (Multicast)';
    else if (firstOctet >= 240 && firstOctet <= 255) ipClass = 'Class E (Experimental)';

    const binaryMask = (mask >>> 0).toString(2).padStart(32, '0').match(/.{8}/g)?.join('.') || '';

    return {
      network: intToIp(network),
      netmask: intToIp(mask),
      broadcast: intToIp(broadcast),
      firstHost: intToIp(hostMin),
      lastHost: intToIp(hostMax),
      usableHosts,
      totalHosts,
      prefix,
      wildcard: intToIp(wildcard),
      binaryMask,
      ipClass
    };
  } catch {
    return null;
  }
}
