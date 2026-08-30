import React, { useState, useEffect, useRef } from 'react';
import { Search, KeyRound, Hash, ShieldCheck, Globe, Network, Database, History, Lock, Binary, Shield } from 'lucide-react';
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
    { id: 'crypto-password', label: 'Password Generator', category: 'Crypto', icon: KeyRound, shortcut: 'Ctrl+1' },
    { id: 'integrity-hash', label: 'Hash & Checksum', category: 'Crypto', icon: Hash, shortcut: 'Ctrl+2' },
    { id: 'appsec-jwt', label: 'JWT Decoder', category: 'Web', icon: ShieldCheck, shortcut: 'Ctrl+3' },
    { id: 'network-url', label: 'URL Analyzer', category: 'Network', icon: Globe, shortcut: 'Ctrl+4' },
    { id: 'network-cidr', label: 'Subnet Calculator', category: 'Network', icon: Network, shortcut: 'Ctrl+5' },
    { id: 'crypto-aes', label: 'AES-GCM Encryption', category: 'Crypto', icon: Lock, shortcut: 'Ctrl+6' },
    { id: 'integrity-encoder', label: 'Encoder / Decoder', category: 'Crypto', icon: Binary, shortcut: 'Ctrl+7' },
    { id: 'appsec-headers', label: 'Security Headers', category: 'Web', icon: Shield, shortcut: 'Ctrl+8' },
    { id: 'network-mitre', label: 'Port Reference', category: 'Network', icon: Database },
    { id: 'system-logs', label: 'Activity Logs', category: 'Logs', icon: History }
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
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#18181B] border border-[#34D399]/40 rounded-lg overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 border-b border-[#F4F4F5]/10 bg-[#27272A]">
          <Search className="w-4 h-4 text-[#A1A1AA] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search tools..."
            className="w-full bg-transparent font-mono text-xs text-[#F4F4F5] placeholder:text-[#A1A1AA]/50 focus:outline-none"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-[#A1A1AA] bg-[#18181B] rounded border border-[#F4F4F5]/10">
            ESC
          </kbd>
        </div>

        <div className="max-h-72 overflow-y-auto p-1.5 space-y-0.5 font-mono text-xs">
          {filtered.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#A1A1AA]">
              No tools found
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
                      ? 'bg-[#34D399] text-[#18181B] font-semibold'
                      : 'text-[#F4F4F5]/80 hover:bg-[#F4F4F5]/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.shortcut && (
                    <kbd className={`px-1.5 py-0.2 text-[10px] rounded border ${
                      isSelected ? 'border-[#18181B]/30 bg-[#18181B]/10 text-[#18181B]' : 'border-[#F4F4F5]/10 bg-[#27272A] text-[#A1A1AA]'
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
