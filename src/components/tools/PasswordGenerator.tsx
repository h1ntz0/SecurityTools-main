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
    onLogEvent('Password', 'Generated Password', `${config.length} chars`);
  };

  const handleDiceware = () => {
    const phrase = generateDicewarePassphrase(5);
    setPassword(phrase);
    setCopied(false);
    onShowToast('Diceware passphrase generated');
    onLogEvent('Password', 'Generated Diceware Phrase', '5 words');
  };

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    onShowToast('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    handleGenerate();
  }, [config]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 font-mono text-xs">
      <div className="lg:col-span-7 space-y-4">
        <div>
          <label className="text-[#A1A1AA] mb-1.5 block">Generated Password</label>
          <div className="flex items-center gap-2 bg-[#18181B] border border-[#F4F4F5]/10 rounded-lg p-2.5">
            <input
              type="text"
              readOnly
              value={password}
              className="w-full bg-transparent text-sm text-[#34D399] tracking-wider select-all focus:outline-none"
              placeholder="Generating..."
            />
            <button
              onClick={handleCopy}
              className="px-2.5 py-1.5 rounded bg-[#34D399]/15 hover:bg-[#34D399] text-[#34D399] hover:text-[#18181B] text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <div className="bg-[#18181B] border border-[#F4F4F5]/10 rounded-lg p-3.5 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#A1A1AA]">Length: {config.length} chars</span>
            <span className="text-[#34D399] font-bold">{config.length}</span>
          </div>
          <input
            type="range"
            min={8}
            max={64}
            value={config.length}
            onChange={(e) => setConfig({ ...config, length: parseInt(e.target.value, 10) })}
            className="w-full h-1.5 bg-[#27272A] accent-[#34D399] rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#A1A1AA]/60">
            <span>8 (Min)</span>
            <span>24 (Recommended)</span>
            <span>64 (Max)</span>
          </div>
        </div>

        <div className="bg-[#18181B] border border-[#F4F4F5]/10 rounded-lg p-3.5 space-y-2 text-xs">
          <div className="text-[#A1A1AA] mb-1 font-medium text-[11px]">Character options</div>
          
          <label className="flex items-center gap-2.5 cursor-pointer text-[#F4F4F5]/80 hover:text-[#F4F4F5]">
            <input
              type="checkbox"
              checked={config.useUpper}
              onChange={(e) => setConfig({ ...config, useUpper: e.target.checked })}
              className="w-4 h-4 rounded border-[#F4F4F5]/20 bg-[#27272A] accent-[#34D399]"
            />
            <span>Uppercase letters (A–Z)</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer text-[#F4F4F5]/80 hover:text-[#F4F4F5]">
            <input
              type="checkbox"
              checked={config.useLower}
              onChange={(e) => setConfig({ ...config, useLower: e.target.checked })}
              className="w-4 h-4 rounded border-[#F4F4F5]/20 bg-[#27272A] accent-[#34D399]"
            />
            <span>Lowercase letters (a–z)</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer text-[#F4F4F5]/80 hover:text-[#F4F4F5]">
            <input
              type="checkbox"
              checked={config.useNumbers}
              onChange={(e) => setConfig({ ...config, useNumbers: e.target.checked })}
              className="w-4 h-4 rounded border-[#F4F4F5]/20 bg-[#27272A] accent-[#34D399]"
            />
            <span>Numbers (0–9)</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer text-[#F4F4F5]/80 hover:text-[#F4F4F5]">
            <input
              type="checkbox"
              checked={config.useSymbols}
              onChange={(e) => setConfig({ ...config, useSymbols: e.target.checked })}
              className="w-4 h-4 rounded border-[#F4F4F5]/20 bg-[#27272A] accent-[#34D399]"
            />
            <span>Symbols (!@#$%^&*)</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer text-[#A1A1AA] hover:text-[#F4F4F5] pt-2 border-t border-[#F4F4F5]/10">
            <input
              type="checkbox"
              checked={config.excludeAmbiguous}
              onChange={(e) => setConfig({ ...config, excludeAmbiguous: e.target.checked })}
              className="w-4 h-4 rounded border-[#F4F4F5]/20 bg-[#27272A] accent-[#34D399]"
            />
            <span>Exclude ambiguous characters (O, 0, l, 1)</span>
          </label>
        </div>

        <div className="flex gap-2.5">
          <button
            onClick={handleGenerate}
            className="flex-1 py-2 rounded bg-[#34D399] hover:bg-[#34D399]/90 text-[#18181B] font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Generate New
          </button>

          <button
            onClick={handleDiceware}
            className="px-3.5 py-2 rounded bg-[#27272A] hover:bg-[#F4F4F5]/5 text-[#F4F4F5] border border-[#F4F4F5]/15 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Dices className="w-3.5 h-3.5 text-[#34D399]" />
            Diceware (5 words)
          </button>
        </div>
      </div>

      <div className="lg:col-span-5 space-y-3">
        <div className="bg-[#18181B] border border-[#F4F4F5]/10 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#F4F4F5]/10">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#34D399]" />
              <span className="font-semibold text-xs text-[#F4F4F5]">Entropy & Strength</span>
            </div>
            <span className="text-[10px] text-[#A1A1AA]">NIST 800-63B</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-[#A1A1AA]">Shannon Entropy</span>
              <span className={`font-bold ${entropy.colorClass}`}>~{entropy.bits} bits</span>
            </div>
            <div className="w-full h-1.5 bg-[#27272A] rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-200 ${
                  entropy.bits >= 75 ? 'bg-[#34D399]' : entropy.bits >= 50 ? 'bg-amber-400' : 'bg-red-400'
                }`}
                style={{ width: `${entropy.percentage}%` }}
              />
            </div>
          </div>

          <div className="space-y-2 text-xs pt-1">
            <div className="flex justify-between">
              <span className="text-[#A1A1AA]">Rating</span>
              <span className={`font-medium ${entropy.colorClass}`}>{entropy.strengthLabel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A1A1AA]">Crack Time Estimate</span>
              <span className="text-[#F4F4F5] text-right">{entropy.crackTimeEstimate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A1A1AA]">Random Source</span>
              <span className="text-[#34D399]">Web Crypto API</span>
            </div>
          </div>

          <div className="p-2.5 rounded bg-[#27272A] text-[11px] text-[#A1A1AA] leading-relaxed font-sans">
            Passwords are generated locally in your browser memory and are never transmitted over the network.
          </div>
        </div>
      </div>
    </div>
  );
};
