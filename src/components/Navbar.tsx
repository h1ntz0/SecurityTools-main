import React, { useState } from 'react';
import { ShieldCheck, Search, QrCode, Menu, X, Smartphone } from 'lucide-react';

interface NavbarProps {
  onOpenCmd: () => void;
  onOpenQr: () => void;
  onScrollTo: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCmd, onOpenQr, onScrollTo }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    onScrollTo(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#18181B]/90 backdrop-blur-md border-b border-[#F4F4F5]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#34D399]/10 border border-[#34D399]/30 flex items-center justify-center text-[#34D399] group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-sm text-[#F4F4F5] tracking-tight">SecurityTools</span>
              <span className="text-[10px] font-mono text-[#34D399] bg-[#34D399]/10 border border-[#34D399]/30 px-1.5 py-0.2 rounded font-semibold">
                v2.5
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 ml-6 text-xs font-mono">
            <button
              onClick={() => handleNavClick('toolkit')}
              className="px-3 py-1.5 rounded-md text-[#F4F4F5]/70 hover:text-[#F4F4F5] hover:bg-[#F4F4F5]/5 transition-colors cursor-pointer"
            >
              Toolkit
            </button>
            <button
              onClick={() => handleNavClick('portdb')}
              className="px-3 py-1.5 rounded-md text-[#F4F4F5]/70 hover:text-[#F4F4F5] hover:bg-[#F4F4F5]/5 transition-colors cursor-pointer"
            >
              Port & Risk DB
            </button>
            <button
              onClick={() => handleNavClick('incidents')}
              className="px-3 py-1.5 rounded-md text-[#F4F4F5]/70 hover:text-[#F4F4F5] hover:bg-[#F4F4F5]/5 transition-colors cursor-pointer"
            >
              Incident Logs
            </button>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile QR Button - Highlighted */}
          <button
            onClick={onOpenQr}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#34D399]/10 border border-[#34D399]/40 text-[#34D399] hover:bg-[#34D399]/20 transition-all font-mono text-xs font-semibold shadow-sm shadow-[#34D399]/10 cursor-pointer"
            title="Scan QR to open on phone"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Buka di HP</span>
            <QrCode className="w-3.5 h-3.5 opacity-80" />
          </button>

          {/* Command Palette Trigger */}
          <button
            onClick={onOpenCmd}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#27272A] border border-[#F4F4F5]/15 text-[#F4F4F5]/60 hover:text-[#F4F4F5] hover:border-[#34D399]/50 transition-all font-mono text-xs cursor-pointer"
            title="Command search"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-[#F4F4F5]/40">Search tools...</span>
            <kbd className="text-[10px] text-[#F4F4F5]/40 bg-[#F4F4F5]/10 px-1.5 py-0.5 rounded border border-[#F4F4F5]/10">
              Ctrl+K
            </kbd>
          </button>

          {/* Offline badge */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F4F4F5]/5 border border-[#F4F4F5]/10 text-[11px] font-mono text-[#F4F4F5]/60">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
            <span>Client-Side</span>
          </div>

          {/* GitHub link */}
          <a
            href="https://github.com/h1ntz0/SecurityTools-main"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg text-[#F4F4F5]/60 hover:text-[#F4F4F5] hover:bg-[#F4F4F5]/5 transition-colors"
            title="GitHub Repository"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#F4F4F5]/70 hover:text-[#F4F4F5] hover:bg-[#F4F4F5]/5 transition-colors border border-[#F4F4F5]/10 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#F4F4F5]/10 bg-[#18181B] px-4 py-3 space-y-2 animate-in slide-in-from-top-2 duration-150 font-mono text-xs">
          <button
            onClick={() => handleNavClick('toolkit')}
            className="w-full text-left px-3 py-2 rounded-lg text-[#F4F4F5]/80 hover:bg-[#F4F4F5]/5 hover:text-[#34D399] transition-colors cursor-pointer"
          >
            → Security Toolkit
          </button>
          <button
            onClick={() => handleNavClick('portdb')}
            className="w-full text-left px-3 py-2 rounded-lg text-[#F4F4F5]/80 hover:bg-[#F4F4F5]/5 hover:text-[#34D399] transition-colors cursor-pointer"
          >
            → MITRE Port DB
          </button>
          <button
            onClick={() => handleNavClick('incidents')}
            className="w-full text-left px-3 py-2 rounded-lg text-[#F4F4F5]/80 hover:bg-[#F4F4F5]/5 hover:text-[#34D399] transition-colors cursor-pointer"
          >
            → Incident Logs
          </button>
          <div className="pt-2 border-t border-[#F4F4F5]/10 flex items-center justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQr();
              }}
              className="flex items-center gap-2 text-[#34D399] font-semibold py-1.5 cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              Tampilkan QR Code HP
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCmd();
              }}
              className="flex items-center gap-1.5 text-[#F4F4F5]/60 py-1.5 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              Command Palette
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
