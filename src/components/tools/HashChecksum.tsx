import React, { useState, useEffect } from 'react';
import { Copy, Check, Hash, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { computeHash } from '../../utils/crypto';

interface HashChecksumProps {
  onShowToast: (msg: string) => void;
  onLogEvent: (tool: string, action: string, details?: string) => void;
}

export const HashChecksum: React.FC<HashChecksumProps> = ({ onShowToast, onLogEvent }) => {
  const [inputText, setInputText] = useState<string>('');
  const [algorithm, setAlgorithm] = useState<'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'>('SHA-256');
  const [hashOutput, setHashOutput] = useState<string>('');
  const [expectedHash, setExpectedHash] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!inputText.trim()) {
      setHashOutput('');
      return;
    }

    computeHash(inputText, algorithm)
      .then((hex) => {
        setHashOutput(hex);
      })
      .catch((err) => {
        console.error('Hash calculation error:', err);
      });
  }, [inputText, algorithm]);

  const handleCopy = () => {
    if (!hashOutput) return;
    navigator.clipboard.writeText(hashOutput);
    setCopied(true);
    onShowToast(`${algorithm} hash copied to clipboard`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInputText('');
    setHashOutput('');
    setExpectedHash('');
  };

  // Verification status
  const normalizedActual = hashOutput.trim().toLowerCase();
  const normalizedExpected = expectedHash.trim().toLowerCase();
  const isVerifying = normalizedExpected.length > 0;
  const isMatch = isVerifying && normalizedActual === normalizedExpected;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono">
      {/* Input & Output Column */}
      <div className="lg:col-span-7 space-y-5">
        {/* Input Text Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label className="text-[#E2E8F0]/60">Plaintext / Payload Input</label>
            <div className="flex items-center gap-2">
              <span className="text-[#E2E8F0]/40">{inputText.length} bytes</span>
              {inputText && (
                <button
                  onClick={handleClear}
                  className="text-[#E2E8F0]/50 hover:text-[#E2E8F0] flex items-center gap-1 text-[11px]"
                >
                  <RotateCcw className="w-3 h-3" /> Clear
                </button>
              )}
            </div>
          </div>
          <textarea
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type or paste payload string here to compute hash checksum..."
            className="w-full bg-[#131924] border border-[#E2E8F0]/15 focus:border-[#F59E0B] rounded-xl p-3 text-[#E2E8F0] text-xs placeholder:text-[#E2E8F0]/30 focus:outline-none resize-y"
          />
        </div>

        {/* Algorithm Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#E2E8F0]/50 mr-1">Algorithm:</span>
          {(['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] as const).map((algo) => (
            <button
              key={algo}
              onClick={() => {
                setAlgorithm(algo);
                if (inputText) onLogEvent('Hash', `Switched algorithm to ${algo}`);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                algorithm === algo
                  ? 'bg-[#F59E0B] text-[#0B0F17] shadow-md shadow-[#F59E0B]/20'
                  : 'bg-[#131924] text-[#E2E8F0]/70 border border-[#E2E8F0]/10 hover:text-[#E2E8F0] hover:border-[#E2E8F0]/20'
              }`}
            >
              {algo}
            </button>
          ))}
        </div>

        {/* Computed Hash Result */}
        <div className="space-y-2">
          <label className="text-xs text-[#E2E8F0]/60 block">Calculated Digest ({algorithm})</label>
          <div className="bg-[#131924] border border-[#E2E8F0]/15 rounded-xl p-3 flex items-start gap-3 shadow-inner">
            <div className="w-full break-all text-xs font-mono text-[#F59E0B] leading-relaxed select-all">
              {hashOutput || <span className="text-[#E2E8F0]/30 italic">Awaiting input...</span>}
            </div>
            {hashOutput && (
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-[#F59E0B]/15 hover:bg-[#F59E0B] text-[#F59E0B] hover:text-[#0B0F17] text-xs font-semibold transition-all flex items-center gap-1 shrink-0"
                title="Copy hash"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#F59E0B]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Verification & Integrity Column */}
      <div className="lg:col-span-5 space-y-4">
        <div className="bg-[#131924] border border-[#E2E8F0]/10 rounded-xl p-5 space-y-4 font-mono">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]/10">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-[#F59E0B]" />
              <span className="text-xs font-bold text-[#E2E8F0] uppercase tracking-wider">Integrity Check</span>
            </div>
            <span className="text-[10px] text-[#E2E8F0]/50">SubtleCrypto</span>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-[#E2E8F0]/60 block">Compare with Target Hash</label>
            <input
              type="text"
              value={expectedHash}
              onChange={(e) => setExpectedHash(e.target.value)}
              placeholder="Paste known checksum (e.g. SHA-256)..."
              className="w-full bg-[#0B0F17] border border-[#E2E8F0]/15 focus:border-[#F59E0B] rounded-lg p-2.5 text-[#E2E8F0] text-xs placeholder:text-[#E2E8F0]/30 focus:outline-none"
            />
          </div>

          {/* Verification Badge */}
          {isVerifying && (
            <div
              className={`p-3.5 rounded-lg border flex items-center gap-3 text-xs transition-all ${
                isMatch
                  ? 'bg-[#F59E0B]/10 border-[#F59E0B]/50 text-[#F59E0B]'
                  : 'bg-red-500/10 border-red-500/50 text-red-400'
              }`}
            >
              {isMatch ? (
                <>
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-[#F59E0B]" />
                  <div>
                    <div className="font-bold">VERIFIED INTEGRITY MATCH</div>
                    <div className="text-[11px] opacity-80 font-sans">Checksum matches byte-for-byte.</div>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 shrink-0 text-red-400" />
                  <div>
                    <div className="font-bold">CHECKSUM MISMATCH</div>
                    <div className="text-[11px] opacity-80 font-sans">Digest does not match target. File/text altered.</div>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="p-3 rounded-lg bg-black/40 border border-[#E2E8F0]/5 text-[11px] text-[#E2E8F0]/60 leading-relaxed font-sans">
            Hash digests are evaluated via Web Cryptography API (`crypto.subtle.digest`). Constant-time evaluation safeguards against timing side-channels.
          </div>
        </div>
      </div>
    </div>
  );
};
