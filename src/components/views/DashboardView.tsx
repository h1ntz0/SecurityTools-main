import React from 'react';
import { KeyRound, Lock, Hash, Binary, ShieldCheck, Shield, Network, Globe, Database, Terminal, ArrowUpRight } from 'lucide-react';
import { ViewId } from '../../types/navigation';
import { LogEntry } from '../../types';

interface DashboardViewProps {
  onNavigate: (viewId: ViewId) => void;
  logs: LogEntry[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, logs }) => {
  const tools = [
    { id: 'crypto-password' as ViewId, name: 'Password / NIST Entropy', desc: 'Hardware CSPRNG & Diceware passphrases', icon: KeyRound, cat: 'Crypto' },
    { id: 'crypto-aes' as ViewId, name: 'AES-GCM-256 Vault', desc: 'PBKDF2 100k key derivation & sealed envelope', icon: Lock, cat: 'Crypto' },
    { id: 'integrity-hash' as ViewId, name: 'Hash & Checksum', desc: 'SHA-1/256/384/512 compute & match', icon: Hash, cat: 'Integrity' },
    { id: 'integrity-encoder' as ViewId, name: 'Multi-Format Transformer', desc: 'Base64, Hex, Binary, URL, HTML, Rot13', icon: Binary, cat: 'Integrity' },
    { id: 'appsec-jwt' as ViewId, name: 'JWT Inspector', desc: 'Header, claims payload, and expiration parser', icon: ShieldCheck, cat: 'AppSec' },
    { id: 'appsec-headers' as ViewId, name: 'Security Headers', desc: 'CSP, HSTS, X-Frame configs for Nginx & Caddy', icon: Shield, cat: 'AppSec' },
    { id: 'network-cidr' as ViewId, name: 'CIDR Subnetting', desc: 'IPv4 network boundaries & host ranges', icon: Network, cat: 'Network' },
    { id: 'network-url' as ViewId, name: 'URL Risk Analyzer', desc: 'Protocol, query parameter volume, XSS heuristics', icon: Globe, cat: 'Network' },
    { id: 'network-mitre' as ViewId, name: 'MITRE Port Matrix', desc: '27 standard services mapped to ATT&CK tactics', icon: Database, cat: 'Intel' }
  ];

  return (
    <div className="space-y-6 font-mono text-xs max-w-6xl mx-auto">
      {/* Status Banner */}
      <div className="p-4 bg-[#131924] border border-[#E2E8F0]/10 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-[#F59E0B] font-bold text-sm">Security Engineering Console</div>
          <div className="text-[#E2E8F0]/60 text-xs font-sans mt-0.5">
            Client-side cryptographic tool suite. Zero telemetry.
          </div>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-[#E2E8F0]/50 shrink-0">
          <span>Engine: <strong className="text-[#F59E0B]">WebCrypto</strong></span>
          <span>Port: <strong className="text-[#E2E8F0]">8080</strong></span>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {tools.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => onNavigate(t.id)}
              className="p-3.5 bg-[#131924] border border-[#E2E8F0]/10 hover:border-[#F59E0B]/50 rounded-lg text-left transition-colors cursor-pointer group flex flex-col justify-between gap-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-[#F59E0B]">{t.cat}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#E2E8F0]/30 group-hover:text-[#F59E0B] transition-colors" />
              </div>
              <div>
                <div className="font-semibold text-[#E2E8F0] group-hover:text-[#F59E0B] transition-colors flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>{t.name}</span>
                </div>
                <div className="text-[11px] text-[#E2E8F0]/50 font-sans mt-1">
                  {t.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Event Logs */}
      <div className="bg-[#131924] border border-[#E2E8F0]/10 rounded-lg p-3.5 space-y-2">
        <div className="flex items-center justify-between text-xs pb-2 border-b border-[#E2E8F0]/10">
          <div className="flex items-center gap-2 font-semibold text-[#E2E8F0]">
            <Terminal className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Audit Events</span>
          </div>
          <button
            onClick={() => onNavigate('system-logs')}
            className="text-[#F59E0B] hover:underline text-[11px] cursor-pointer"
          >
            View All →
          </button>
        </div>

        <div className="space-y-1">
          {logs.slice(0, 3).map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-1.5 rounded bg-[#0B0F17] text-[11px]"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="text-[#E2E8F0]/40">{log.timestamp}</span>
                <span className="text-[#F59E0B] font-semibold">[{log.tool}]</span>
                <span className="text-[#E2E8F0] truncate">{log.action}</span>
              </div>
              <span className="text-[#E2E8F0]/40 font-sans text-[10px] hidden sm:inline">{log.details}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
