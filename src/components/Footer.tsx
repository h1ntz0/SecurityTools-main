import React from 'react';
import { ShieldCheck, Smartphone } from 'lucide-react';

interface FooterProps {
  onOpenQr: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenQr }) => {
  return (
    <footer className="py-8 bg-[#0B0F17] border-t border-[#E2E8F0]/10 font-mono text-xs text-[#E2E8F0]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#F59E0B]" />
          <span className="text-[#E2E8F0] font-semibold">SecurityTools v2.5</span>
          <span>· Modern Security Engineering Suite</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onOpenQr}
            className="text-[#E2E8F0]/60 hover:text-[#F59E0B] transition-colors flex items-center gap-1"
          >
            <Smartphone className="w-3.5 h-3.5" />
            Scan QR HP
          </button>
          <span>·</span>
          <span>Zero Server Storage</span>
          <span>·</span>
          <span>MIT License</span>
        </div>
      </div>
    </footer>
  );
};
