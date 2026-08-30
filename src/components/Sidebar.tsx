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
  Terminal,
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
  const navSections: { title: string; items: { id: ViewId; label: string; icon: React.ElementType }[] }[] = [
    {
      title: 'Console',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'Cryptography',
      items: [
        { id: 'crypto-password', label: 'Password / Entropy', icon: KeyRound },
        { id: 'crypto-aes', label: 'AES-GCM-256 Vault', icon: Lock }
      ]
    },
    {
      title: 'Integrity',
      items: [
        { id: 'integrity-hash', label: 'Hash & Checksum', icon: Hash },
        { id: 'integrity-encoder', label: 'Multi-Encoder', icon: Binary }
      ]
    },
    {
      title: 'AppSec',
      items: [
        { id: 'appsec-jwt', label: 'JWT Inspector', icon: ShieldCheck },
        { id: 'appsec-headers', label: 'Security Headers', icon: Shield }
      ]
    },
    {
      title: 'Network',
      items: [
        { id: 'network-cidr', label: 'CIDR Subnetting', icon: Network },
        { id: 'network-url', label: 'URL Analyzer', icon: Globe },
        { id: 'network-mitre', label: 'Port Matrix', icon: Database }
      ]
    },
    {
      title: 'System',
      items: [
        { id: 'system-logs', label: 'Audit Logs', icon: Terminal }
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
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#0B0F17] border-r border-[#E2E8F0]/10 transition-all duration-200 ${
          isOpen ? 'w-60' : 'w-16'
        } ${isMobileOpen ? 'translate-x-0 !w-60' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Header */}
        <div className="h-12 flex items-center justify-between px-3 border-b border-[#E2E8F0]/10 bg-[#0B0F17]">
          <button
            onClick={() => handleNav('dashboard')}
            className="flex items-center gap-2 min-w-0 text-left cursor-pointer"
          >
            <div className="w-6 h-6 rounded bg-[#F59E0B]/10 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B] shrink-0 font-mono font-bold text-xs">
              CS
            </div>
            {isOpen && (
              <span className="font-mono font-bold text-xs text-[#E2E8F0] tracking-wider">
                SECURITYTOOLS
              </span>
            )}
          </button>

          <button
            onClick={onToggle}
            className="hidden md:flex p-1 rounded text-[#E2E8F0]/40 hover:text-[#E2E8F0] hover:bg-[#E2E8F0]/5 transition-colors cursor-pointer"
          >
            {isOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 overflow-y-auto p-2 space-y-3 font-mono text-xs">
          {navSections.map((sec, idx) => (
            <div key={idx} className="space-y-0.5">
              {isOpen && (
                <div className="px-2 py-1 text-[10px] font-semibold text-[#E2E8F0]/30 uppercase tracking-wider">
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
                        ? 'bg-[#F59E0B] text-[#0B0F17] font-bold'
                        : 'text-[#E2E8F0]/70 hover:text-[#E2E8F0] hover:bg-[#E2E8F0]/5'
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
        <div className="p-2.5 border-t border-[#E2E8F0]/10 bg-[#0B0F17] text-[10px] font-mono text-[#E2E8F0]/40">
          {isOpen ? (
            <div className="flex items-center justify-between">
              <span>Sandbox</span>
              <span className="text-[#F59E0B]">Port 8080</span>
            </div>
          ) : (
            <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] mx-auto" />
          )}
        </div>
      </aside>
    </>
  );
};
