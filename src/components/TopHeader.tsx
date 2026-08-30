import React from 'react';
import { Menu, Search, ChevronRight } from 'lucide-react';
import { ViewId } from '../types/navigation';

interface TopHeaderProps {
  currentView: ViewId;
  onOpenCmd: () => void;
  onMobileMenuToggle: () => void;
}

const VIEW_TITLES: Record<ViewId, { category: string; title: string }> = {
  dashboard: { category: 'General', title: 'Dashboard' },
  'crypto-password': { category: 'Crypto', title: 'Password Generator' },
  'crypto-aes': { category: 'Crypto', title: 'AES-GCM Encryption' },
  'integrity-hash': { category: 'Crypto', title: 'Hash & Checksum' },
  'integrity-encoder': { category: 'Crypto', title: 'Encoder / Decoder' },
  'appsec-jwt': { category: 'Web', title: 'JWT Decoder' },
  'appsec-headers': { category: 'Web', title: 'Security Headers' },
  'network-cidr': { category: 'Network', title: 'Subnet Calculator' },
  'network-url': { category: 'Network', title: 'URL Analyzer' },
  'network-mitre': { category: 'Network', title: 'Port Reference' },
  'system-logs': { category: 'Logs', title: 'Activity Logs' }
};

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentView,
  onOpenCmd,
  onMobileMenuToggle
}) => {
  const currentInfo = VIEW_TITLES[currentView] || { category: 'General', title: 'Dashboard' };

  return (
    <header className="sticky top-0 z-30 h-12 bg-[#18181B]/95 backdrop-blur-xs border-b border-[#F4F4F5]/10 px-4 sm:px-6 flex items-center justify-between gap-4 font-mono text-xs">
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          onClick={onMobileMenuToggle}
          className="p-1 rounded text-[#A1A1AA] hover:text-[#F4F4F5] md:hidden border border-[#F4F4F5]/10 cursor-pointer"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5 truncate">
          <span className="text-[#A1A1AA] hidden sm:inline">{currentInfo.category}</span>
          <ChevronRight className="w-3 h-3 text-[#A1A1AA]/40 hidden sm:inline" />
          <span className="text-[#F4F4F5] font-medium truncate">{currentInfo.title}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onOpenCmd}
          className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#27272A] border border-[#F4F4F5]/10 text-[#A1A1AA] hover:text-[#F4F4F5] hover:border-[#34D399]/40 transition-colors cursor-pointer text-xs"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px]">Search</span>
          <kbd className="text-[10px] text-[#A1A1AA] bg-[#18181B] px-1 py-0.2 rounded border border-[#F4F4F5]/10">
            Ctrl+K
          </kbd>
        </button>
      </div>
    </header>
  );
};
