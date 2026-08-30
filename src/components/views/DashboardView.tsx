import React from 'react';
import { KeyRound, Lock, Hash, Binary, ShieldCheck, Shield, Network, Globe, Database, History, ArrowUpRight } from 'lucide-react';
import { ViewId } from '../../types/navigation';
import { LogEntry } from '../../types';

interface DashboardViewProps {
  onNavigate: (viewId: ViewId) => void;
  logs: LogEntry[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, logs }) => {
  const tools = [
    { id: 'crypto-password' as ViewId, name: 'Password Generator', desc: 'Random passwords and Diceware passphrases with entropy score', icon: KeyRound, cat: 'Crypto' },
    { id: 'crypto-aes' as ViewId, name: 'AES-GCM Encryption', desc: 'Encrypt or decrypt text using AES-256-GCM and PBKDF2', icon: Lock, cat: 'Crypto' },
    { id: 'integrity-hash' as ViewId, name: 'Hash & Checksum', desc: 'Compute SHA-1/256/384/512 hashes and compare values', icon: Hash, cat: 'Crypto' },
    { id: 'integrity-encoder' as ViewId, name: 'Encoder / Decoder', desc: 'Convert text to Base64, Hex, Binary, URL encode, and ROT13', icon: Binary, cat: 'Crypto' },
    { id: 'appsec-jwt' as ViewId, name: 'JWT Decoder', desc: 'Decode header, claims payload, and check expiration time', icon: ShieldCheck, cat: 'Web' },
    { id: 'appsec-headers' as ViewId, name: 'Security Headers', desc: 'Generate CSP, HSTS, and X-Frame-Options config snippets', icon: Shield, cat: 'Web' },
    { id: 'network-cidr' as ViewId, name: 'Subnet Calculator', desc: 'Calculate IPv4 network ranges, broadcast, netmask, and hosts', icon: Network, cat: 'Network' },
    { id: 'network-url' as ViewId, name: 'URL Analyzer', desc: 'Inspect URL parts, query params, and check for basic issues', icon: Globe, cat: 'Network' },
    { id: 'network-mitre' as ViewId, name: 'Port Reference', desc: 'Lookup common network service ports and typical risks', icon: Database, cat: 'Network' }
  ];

  return (
    <div className="space-y-5 font-mono text-xs max-w-5xl mx-auto">
      {/* Overview Banner */}
      <div className="p-4 bg-[#27272A] border border-[#F4F4F5]/10 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="text-[#34D399] font-semibold text-sm">SecurityTools</div>
          <div className="text-[#A1A1AA] text-xs font-sans mt-0.5">
            Client-side developer and security utilities. Runs offline in your browser.
          </div>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-[#A1A1AA] shrink-0">
          <span>Engine: <strong className="text-[#F4F4F5]">Web Crypto API</strong></span>
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
              className="p-3.5 bg-[#27272A] border border-[#F4F4F5]/10 hover:border-[#34D399]/40 rounded-lg text-left transition-colors cursor-pointer group flex flex-col justify-between gap-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-medium text-[#34D399]">{t.cat}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#A1A1AA]/40 group-hover:text-[#34D399] transition-colors" />
              </div>
              <div>
                <div className="font-medium text-[#F4F4F5] group-hover:text-[#34D399] transition-colors flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-[#34D399]" />
                  <span>{t.name}</span>
                </div>
                <div className="text-[11px] text-[#A1A1AA] font-sans mt-1">
                  {t.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Activity Logs preview */}
      <div className="bg-[#27272A] border border-[#F4F4F5]/10 rounded-lg p-3.5 space-y-2">
        <div className="flex items-center justify-between text-xs pb-2 border-b border-[#F4F4F5]/10">
          <div className="flex items-center gap-2 font-medium text-[#F4F4F5]">
            <History className="w-3.5 h-3.5 text-[#34D399]" />
            <span>Recent Activity</span>
          </div>
          <button
            onClick={() => onNavigate('system-logs')}
            className="text-[#34D399] hover:underline text-[11px] cursor-pointer"
          >
            View All →
          </button>
        </div>

        <div className="space-y-1">
          {logs.slice(0, 3).map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-1.5 rounded bg-[#18181B] text-[11px]"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="text-[#A1A1AA]">{log.timestamp}</span>
                <span className="text-[#34D399]">[{log.tool}]</span>
                <span className="text-[#F4F4F5] truncate">{log.action}</span>
              </div>
              <span className="text-[#A1A1AA] font-sans text-[10px] hidden sm:inline">{log.details}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
