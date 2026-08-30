import React from 'react';
import { Cpu, Lock, Smartphone } from 'lucide-react';

interface HeroProps {
  onOpenToolkit: () => void;
  onQuickGenerate: () => void;
  onOpenQr: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenToolkit, onQuickGenerate, onOpenQr }) => {
  return (
    <section className="border-b border-[#E2E8F0]/10 bg-gradient-to-b from-[#0B0F17] via-[#0D1525] to-[#0B0F17] pt-12 pb-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Engineering Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] font-mono text-[11px] font-semibold tracking-wider uppercase mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
          100% Client-Side · Zero Telemetry · WebCrypto Native
        </div>

        {/* Hero Title */}
        <h1 className="font-mono font-bold text-3xl sm:text-5xl lg:text-6xl text-[#E2E8F0] tracking-tight leading-tight sm:leading-none mb-4">
          Security & Crypto <br className="hidden sm:inline" />
          <span className="text-[#F59E0B] underline decoration-[#F59E0B]/30 underline-offset-8">Tools for Engineers</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl text-[#E2E8F0]/70 text-sm sm:text-base leading-relaxed mb-8">
          Production-grade cryptographic calculations, NIST 800-63B password entropy, JWT deep inspection, CIDR subnet math, and MITRE ATT&CK port intelligence. Executed entirely inside your local browser.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 mb-10">
          <button
            onClick={onOpenToolkit}
            className="px-5 py-2.5 rounded-lg bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-[#0B0F17] font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-[#F59E0B]/20 active:scale-95 cursor-pointer"
          >
            <Cpu className="w-4 h-4" />
            Open Toolkit
          </button>

          <button
            onClick={onQuickGenerate}
            className="px-5 py-2.5 rounded-lg bg-[#131924] hover:bg-[#E2E8F0]/10 text-[#E2E8F0] border border-[#E2E8F0]/20 font-mono text-xs font-semibold transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <Lock className="w-4 h-4 text-[#F59E0B]" />
            Quick Password
          </button>

          <button
            onClick={onOpenQr}
            className="px-4 py-2.5 rounded-lg bg-[#F59E0B]/10 hover:bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30 font-mono text-xs font-semibold transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <Smartphone className="w-4 h-4" />
            Buka di HP (QR)
          </button>
        </div>

        {/* Engineering Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#E2E8F0]/10 font-mono text-xs">
          <div className="space-y-0.5">
            <div className="text-[#E2E8F0] font-bold text-sm">WebCrypto API</div>
            <div className="text-[#E2E8F0]/50 text-[11px]">Hardware CSPRNG</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-[#E2E8F0] font-bold text-sm">NIST 800-63B</div>
            <div className="text-[#E2E8F0]/50 text-[11px]">Entropy Standards</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-[#E2E8F0] font-bold text-sm">MITRE ATT&CK</div>
            <div className="text-[#E2E8F0]/50 text-[11px]">v14 Port Matrix</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-[#F59E0B] font-bold text-sm flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
              0 KB Egress
            </div>
            <div className="text-[#E2E8F0]/50 text-[11px]">Strict Sandbox</div>
          </div>
        </div>
      </div>
    </section>
  );
};
