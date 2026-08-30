import React, { useState, useEffect, useRef } from 'react';
import { Search, KeyRound, Hash, ShieldCheck, Globe, Network, Database, Terminal, Lock, Binary, Shield } from 'lucide-react';
import { ViewId } from '../types/navigation';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectView: (view: ViewId) => void;
}

interface CommandItem {
  id: ViewId;
  label: string;
  category: string;
  icon: React.ElementType;
  shortcut?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectView
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const commands: CommandItem[] = [
    { id: 'crypto-password', label: 'Password & NIST Entropy Generator', category: 'Cryptography', icon: KeyRound, shortcut: 'Ctrl+1' },
    { id: 'integrity-hash', label: 'Hash & Checksum Verifier', category: 'Integrity', icon: Hash, shortcut: 'Ctrl+2' },
    { id: 'appsec-jwt', label: 'JWT Token Inspector', category: 'AppSec', icon: ShieldCheck, shortcut: 'Ctrl+3' },
    { id: 'network-url', label: 'URL & Endpoint Analyzer', category: 'Network', icon: Globe, shortcut: 'Ctrl+4' },
    { id: 'network-cidr', label: 'CIDR Subnet Calculator', category: 'Network', icon: Network, shortcut: 'Ctrl+5' },
    { id: 'crypto-aes', label: 'AES-GCM-256 Symmetric Vault', category: 'Cryptography', icon: Lock, shortcut: 'Ctrl+6' },
    { id: 'integrity-encoder', label: 'Multi-Format Encoder / Decoder', category: 'Integrity', icon: Binary, shortcut: 'Ctrl+7' },
    { id: 'appsec-headers', label: 'HTTP Security Headers Builder', category: 'AppSec', icon: Shield, shortcut: 'Ctrl+8' },
    { id: 'network-mitre', label: 'MITRE ATT&CK Port Matrix', category: 'Network', icon: Database },
    { id: 'system-logs', label: 'Session Audit Event Logs', category: 'System', icon: Terminal }
  ];

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        onSelectView(filtered[selectedIndex].id);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#0B0F17] border border-[#F59E0B]/40 rounded-lg overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 border-b border-[#E2E8F0]/10 bg-[#131924]">
          <Search className="w-4 h-4 text-[#E2E8F0]/40 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a tool name..."
            className="w-full bg-transparent font-mono text-xs text-[#E2E8F0] placeholder:text-[#E2E8F0]/30 focus:outline-none"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-[#E2E8F0]/40 bg-[#0B0F17] rounded border border-[#E2E8F0]/10">
            ESC
          </kbd>
        </div>

        <div className="max-h-72 overflow-y-auto p-1.5 space-y-0.5 font-mono text-xs">
          {filtered.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#E2E8F0]/40">
              No matching tools
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectView(item.id);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between gap-2.5 px-2.5 py-2 rounded text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#F59E0B] text-[#0B0F17] font-semibold'
                      : 'text-[#E2E8F0]/80 hover:bg-[#E2E8F0]/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.shortcut && (
                    <kbd className={`px-1.5 py-0.2 text-[10px] rounded border ${
                      isSelected ? 'border-[#0B0F17]/30 bg-[#0B0F17]/10 text-[#0B0F17]' : 'border-[#E2E8F0]/10 bg-[#131924] text-[#E2E8F0]/40'
                    }`}>
                      {item.shortcut}
                    </kbd>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
