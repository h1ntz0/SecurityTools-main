import React from 'react';
import { Menu, Search, ChevronRight } from 'lucide-react';
import { ViewId } from '../types/navigation';

interface TopHeaderProps {
  currentView: ViewId;
  onOpenCmd: () => void;
  onMobileMenuToggle: () => void;
}

const VIEW_TITLES: Record<ViewId, { category: string; title: string }> = {
  dashboard: { category: 'Console', title: 'Dashboard' },
  'crypto-password': { category: 'Cryptography', title: 'Password Generator' },
  'crypto-aes': { category: 'Cryptography', title: 'AES-GCM-256 Vault' },
  'integrity-hash': { category: 'Integrity', title: 'Hash Checksum' },
  'integrity-encoder': { category: 'Integrity', title: 'Multi-Encoder' },
  'appsec-jwt': { category: 'AppSec', title: 'JWT Inspector' },
  'appsec-headers': { category: 'AppSec', title: 'Security Headers' },
  'network-cidr': { category: 'Network', title: 'CIDR Subnetting' },
  'network-url': { category: 'Network', title: 'URL Analyzer' },
  'network-mitre': { category: 'Threat Intel', title: 'Port Matrix' },
  'system-logs': { category: 'System', title: 'Audit Logs' }
};

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentView,
  onOpenCmd,
  onMobileMenuToggle
}) => {
  const currentInfo = VIEW_TITLES[currentView] || { category: 'Console', title: 'Dashboard' };

  return (
    <header className="sticky top-0 z-30 h-12 bg-[#0B0F17]/95 backdrop-blur-sm border-b border-[#E2E8F0]/10 px-4 sm:px-6 flex items-center justify-between gap-4 font-mono text-xs">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMobileMenuToggle}
          className="p-1 rounded text-[#E2E8F0]/70 hover:text-[#E2E8F0] md:hidden border border-[#E2E8F0]/10 cursor-pointer"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5 truncate">
          <span className="text-[#E2E8F0]/40 hidden sm:inline">{currentInfo.category}</span>
          <ChevronRight className="w-3 h-3 text-[#E2E8F0]/30 hidden sm:inline" />
          <span className="text-[#E2E8F0] font-semibold truncate">{currentInfo.title}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onOpenCmd}
          className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#131924] border border-[#E2E8F0]/10 text-[#E2E8F0]/60 hover:text-[#E2E8F0] hover:border-[#F59E0B]/40 transition-colors cursor-pointer text-xs"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px]">Command</span>
          <kbd className="text-[10px] text-[#E2E8F0]/40 bg-[#0B0F17] px-1 py-0.2 rounded border border-[#E2E8F0]/10">
            Ctrl+K
          </kbd>
        </button>
      </div>
    </header>
  );
};
