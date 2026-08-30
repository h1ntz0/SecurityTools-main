import React from 'react';
import {
  LayoutDashboard,
  KeyRound,
  Lock,
  Hash,
  Binary,
  ShieldCheck,
  Shield,
  Network,
  Globe,
  Database,
  History,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ViewId } from '../types/navigation';

interface SidebarProps {
  currentView: ViewId;
  onSelectView: (view: ViewId) => void;
  isOpen: boolean;
  onToggle: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  isOpen,
  onToggle,
  isMobileOpen,
  onMobileClose
}) => {
  const sections: { title: string; items: { id: ViewId; label: string; icon: React.ElementType }[] }[] = [
    {
      title: 'General',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'Crypto & Hash',
      items: [
        { id: 'crypto-password', label: 'Password Generator', icon: KeyRound },
        { id: 'crypto-aes', label: 'AES-GCM Encryption', icon: Lock },
        { id: 'integrity-hash', label: 'Hash & Checksum', icon: Hash },
        { id: 'integrity-encoder', label: 'Encoder / Decoder', icon: Binary }
      ]
    },
    {
      title: 'Web & Network',
      items: [
        { id: 'appsec-jwt', label: 'JWT Decoder', icon: ShieldCheck },
        { id: 'appsec-headers', label: 'Security Headers', icon: Shield },
        { id: 'network-cidr', label: 'Subnet Calculator', icon: Network },
        { id: 'network-url', label: 'URL Analyzer', icon: Globe },
        { id: 'network-mitre', label: 'Port Reference', icon: Database }
      ]
    },
    {
      title: 'Logs',
      items: [
        { id: 'system-logs', label: 'Activity Logs', icon: History }
      ]
    }
  ];

  const handleNav = (id: ViewId) => {
    onSelectView(id);
    onMobileClose();
  };

  return (
    <>
      {isMobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#18181B] border-r border-[#F4F4F5]/10 transition-all duration-150 ${
          isOpen ? 'w-56' : 'w-14'
        } ${isMobileOpen ? 'translate-x-0 !w-56' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Header */}
        <div className="h-12 flex items-center justify-between px-3 border-b border-[#F4F4F5]/10 bg-[#18181B]">
          <button
            onClick={() => handleNav('dashboard')}
            className="flex items-center gap-2 min-w-0 text-left cursor-pointer"
          >
            <div className="w-6 h-6 rounded bg-[#34D399]/15 border border-[#34D399]/30 flex items-center justify-center text-[#34D399] shrink-0 font-mono font-bold text-xs">
              ST
            </div>
            {isOpen && (
              <span className="font-mono font-semibold text-xs text-[#F4F4F5] tracking-wide truncate">
                SecurityTools
              </span>
            )}
          </button>

          <button
            onClick={onToggle}
            className="hidden md:flex p-1 rounded text-[#F4F4F5]/40 hover:text-[#F4F4F5] hover:bg-[#F4F4F5]/5 transition-colors cursor-pointer"
            title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto p-2 space-y-3 font-mono text-xs">
          {sections.map((sec, idx) => (
            <div key={idx} className="space-y-0.5">
              {isOpen && (
                <div className="px-2 py-1 text-[10px] font-medium text-[#A1A1AA]/60 uppercase tracking-wider">
                  {sec.title}
                </div>
              )}
              {sec.items.map((item) => {
                const Icon = item.icon;
                const active = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    title={!isOpen ? item.label : undefined}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-left transition-colors cursor-pointer text-xs ${
                      active
                        ? 'bg-[#34D399] text-[#18181B] font-semibold'
                        : 'text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#F4F4F5]/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    {isOpen && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-2.5 border-t border-[#F4F4F5]/10 bg-[#18181B] text-[10px] font-mono text-[#A1A1AA]">
          {isOpen ? (
            <div className="flex items-center justify-between">
              <span>Client-side only</span>
              <span className="text-[#34D399]">Offline</span>
            </div>
          ) : (
            <div className="w-1.5 h-1.5 rounded-full bg-[#34D399] mx-auto" />
          )}
        </div>
      </aside>
    </>
  );
};
