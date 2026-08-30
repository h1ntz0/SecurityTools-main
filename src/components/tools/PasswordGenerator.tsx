import React, { useState, useEffect } from 'react';
import { Copy, RefreshCw, Dices, Check, ShieldCheck } from 'lucide-react';
import { generateSecurePassword, generateDicewarePassphrase, calculatePasswordEntropy, PasswordConfig } from '../../utils/crypto';

interface PasswordGeneratorProps {
  onShowToast: (msg: string) => void;
  onLogEvent: (tool: string, action: string, details?: string) => void;
}

export const PasswordGenerator: React.FC<PasswordGeneratorProps> = ({ onShowToast, onLogEvent }) => {
  const [config, setConfig] = useState<PasswordConfig>({
    length: 24,
    useUpper: true,
    useLower: true,
    useNumbers: true,
    useSymbols: true,
    excludeAmbiguous: false
  });

  const [password, setPassword] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const entropy = calculatePasswordEntropy(password);

  const handleGenerate = () => {
    const newPass = generateSecurePassword(config);
    setPassword(newPass);
    setCopied(false);
    onLogEvent('Password', 'Generated Random Key', `${config.length} chars, ${entropy.bits} bits`);
  };

  const handleDiceware = () => {
    const phrase = generateDicewarePassphrase(5);
    setPassword(phrase);
    setCopied(false);
    onShowToast('Diceware passphrase generated (5 words)');
    onLogEvent('Password', 'Generated Diceware Phrase', '5 words EFF wordlist');
  };

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    onShowToast('Password copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    handleGenerate();
  }, [config]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Configuration & Output Column */}
      <div className="lg:col-span-7 space-y-5">
        {/* Output Box */}
        <div>
          <label className="text-xs font-mono text-[#E2E8F0]/60 mb-1.5 block">Generated Secret / Key</label>
          <div className="flex items-center gap-2 bg-[#131924] border border-[#E2E8F0]/15 focus-within:border-[#F59E0B] rounded-xl p-3 shadow-inner">
            <input
              type="text"
              readOnly
              value={password}
              className="w-full bg-transparent font-mono text-sm sm:text-base text-[#F59E0B] tracking-wider select-all focus:outline-none"
              placeholder="Generating..."
            />
            <button
              onClick={handleCopy}
              className="px-3 py-2 rounded-lg bg-[#F59E0B]/15 hover:bg-[#F59E0B] text-[#F59E0B] hover:text-[#0B0F17] font-mono text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-[#F59E0B]" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Length Slider */}
        <div className="bg-[#131924] border border-[#E2E8F0]/10 rounded-xl p-4 space-y-3 font-mono">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#E2E8F0]/70">Length: {config.length} characters</span>
            <span className="text-[#F59E0B] font-bold">{config.length}</span>
          </div>
          <input
            type="range"
            min={8}
            max={64}
            value={config.length}
            onChange={(e) => setConfig({ ...config, length: parseInt(e.target.value, 10) })}
            className="w-full h-1.5 bg-[#E2E8F0]/10 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#E2E8F0]/40">
            <span>8 (Min)</span>
            <span>24 (Recommended)</span>
            <span>64 (Max)</span>
          </div>
        </div>

        {/* Character Set Checkboxes */}
        <div className="bg-[#131924] border border-[#E2E8F0]/10 rounded-xl p-4 space-y-2.5 font-mono text-xs">
          <div className="text-[#E2E8F0]/60 mb-2 font-semibold uppercase text-[10px] tracking-wider">Character Set Rules</div>
          
          <label className="flex items-center gap-3 cursor-pointer text-[#E2E8F0]/80 hover:text-[#E2E8F0]">
            <input
              type="checkbox"
              checked={config.useUpper}
              onChange={(e) => setConfig({ ...config, useUpper: e.target.checked })}
              className="w-4 h-4 rounded border-[#E2E8F0]/20 bg-[#E2E8F0]/5 checked:bg-[#F59E0B] text-[#F59E0B]"
            />
            <span>Uppercase Letters (A–Z)</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer text-[#E2E8F0]/80 hover:text-[#E2E8F0]">
            <input
              type="checkbox"
              checked={config.useLower}
              onChange={(e) => setConfig({ ...config, useLower: e.target.checked })}
              className="w-4 h-4 rounded border-[#E2E8F0]/20 bg-[#E2E8F0]/5 checked:bg-[#F59E0B] text-[#F59E0B]"
            />
            <span>Lowercase Letters (a–z)</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer text-[#E2E8F0]/80 hover:text-[#E2E8F0]">
            <input
              type="checkbox"
              checked={config.useNumbers}
              onChange={(e) => setConfig({ ...config, useNumbers: e.target.checked })}
              className="w-4 h-4 rounded border-[#E2E8F0]/20 bg-[#E2E8F0]/5 checked:bg-[#F59E0B] text-[#F59E0B]"
            />
            <span>Numbers & Digits (0–9)</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer text-[#E2E8F0]/80 hover:text-[#E2E8F0]">
            <input
              type="checkbox"
              checked={config.useSymbols}
              onChange={(e) => setConfig({ ...config, useSymbols: e.target.checked })}
              className="w-4 h-4 rounded border-[#E2E8F0]/20 bg-[#E2E8F0]/5 checked:bg-[#F59E0B] text-[#F59E0B]"
            />
            <span>Special Symbols (!@#$%^&*)</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer text-[#E2E8F0]/80 hover:text-[#E2E8F0] pt-2 border-t border-[#E2E8F0]/10">
            <input
              type="checkbox"
              checked={config.excludeAmbiguous}
              onChange={(e) => setConfig({ ...config, excludeAmbiguous: e.target.checked })}
              className="w-4 h-4 rounded border-[#E2E8F0]/20 bg-[#E2E8F0]/5 checked:bg-[#F59E0B] text-[#F59E0B]"
            />
            <span className="text-[#E2E8F0]/60">Exclude Ambiguous Characters (O, 0, l, 1, I)</span>
          </label>
        </div>

        {/* Generator Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleGenerate}
            className="flex-1 min-w-[140px] px-4 py-2.5 rounded-lg bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-[#0B0F17] font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Regenerate
          </button>

          <button
            onClick={handleDiceware}
            className="px-4 py-2.5 rounded-lg bg-[#131924] hover:bg-[#E2E8F0]/10 text-[#E2E8F0] border border-[#E2E8F0]/20 font-mono text-xs font-semibold transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <Dices className="w-4 h-4 text-[#F59E0B]" />
            Diceware Passphrase
          </button>
        </div>
      </div>

      {/* Entropy & Security Analysis Column */}
      <div className="lg:col-span-5 space-y-4">
        <div className="bg-[#131924] border border-[#E2E8F0]/10 rounded-xl p-5 space-y-4 font-mono">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]/10">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#F59E0B]" />
              <span className="text-xs font-bold text-[#E2E8F0] uppercase tracking-wider">Entropy Metrics</span>
            </div>
            <span className="text-[10px] text-[#E2E8F0]/50">NIST 800-63B</span>
          </div>

          {/* Entropy Gauge */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-[#E2E8F0]/60">Shannon Entropy</span>
              <span className={`font-bold ${entropy.colorClass}`}>~{entropy.bits} bits</span>
            </div>
            <div className="w-full h-2 bg-[#E2E8F0]/10 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  entropy.bits >= 75 ? 'bg-[#F59E0B]' : entropy.bits >= 50 ? 'bg-amber-400' : 'bg-red-400'
                }`}
                style={{ width: `${entropy.percentage}%` }}
              />
            </div>
          </div>

          {/* Security Table */}
          <div className="space-y-2.5 text-xs pt-2">
            <div className="flex justify-between">
              <span className="text-[#E2E8F0]/50">Strength Rating</span>
              <span className={`font-semibold ${entropy.colorClass}`}>{entropy.strengthLabel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#E2E8F0]/50">Estimated Brute-force</span>
              <span className="text-[#E2E8F0] font-medium text-right">{entropy.crackTimeEstimate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#E2E8F0]/50">Entropy / Character</span>
              <span className="text-[#E2E8F0] font-medium">
                {password.length > 0 ? (entropy.bits / password.length).toFixed(2) : 0} bits/char
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#E2E8F0]/50">RNG Source</span>
              <span className="text-[#F59E0B]">crypto.getRandomValues</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-black/40 border border-[#E2E8F0]/5 text-[11px] text-[#E2E8F0]/60 leading-relaxed font-sans">
            Cryptographic keys generated via hardware-backed CSPRNG inside your browser sandbox. Passwords are never serialized or sent over network.
          </div>
        </div>
      </div>
    </div>
  );
};
