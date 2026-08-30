import React, { useState, useEffect } from 'react';
import { Copy, Check, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
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
    onShowToast(`${algorithm} hash copied`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInputText('');
    setHashOutput('');
    setExpectedHash('');
  };

  const normalizedActual = hashOutput.trim().toLowerCase();
  const normalizedExpected = expectedHash.trim().toLowerCase();
  const isVerifying = normalizedExpected.length > 0;
  const isMatch = isVerifying && normalizedActual === normalizedExpected;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 font-mono text-xs">
      <div className="lg:col-span-7 space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[#A1A1AA]">Input Text</label>
            {inputText && (
              <button
                onClick={handleClear}
                className="text-[#A1A1AA] hover:text-[#F4F4F5] flex items-center gap-1 text-[11px] cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Clear
              </button>
            )}
          </div>
          <textarea
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type or paste text to hash..."
            className="w-full bg-[#18181B] border border-[#F4F4F5]/10 focus:border-[#34D399] rounded-lg p-2.5 text-[#F4F4F5] text-xs placeholder:text-[#A1A1AA]/40 focus:outline-none resize-y"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-[#A1A1AA] mr-1">Algorithm:</span>
          {(['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] as const).map((algo) => (
            <button
              key={algo}
              onClick={() => {
                setAlgorithm(algo);
                if (inputText) onLogEvent('Hash', `Switched to ${algo}`);
              }}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                algorithm === algo
                  ? 'bg-[#34D399] text-[#18181B]'
                  : 'bg-[#18181B] text-[#A1A1AA] hover:text-[#F4F4F5]'
              }`}
            >
              {algo}
            </button>
          ))}
        </div>

        <div className="space-y-1.5">
          <label className="text-[#A1A1AA] block">{algorithm} Output</label>
          <div className="bg-[#18181B] border border-[#F4F4F5]/10 rounded-lg p-2.5 flex items-start gap-2">
            <div className="w-full break-all text-xs font-mono text-[#34D399] leading-relaxed select-all">
              {hashOutput || <span className="text-[#A1A1AA]/40 italic">Waiting for input...</span>}
            </div>
            {hashOutput && (
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 rounded bg-[#34D399]/15 hover:bg-[#34D399] text-[#34D399] hover:text-[#18181B] text-xs font-medium transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="lg:col-span-5 space-y-3">
        <div className="bg-[#18181B] border border-[#F4F4F5]/10 rounded-lg p-4 space-y-3">
          <div className="pb-2 border-b border-[#F4F4F5]/10 text-xs font-semibold text-[#F4F4F5]">
            Compare / Verify
          </div>

          <div className="space-y-1">
            <label className="text-[#A1A1AA] block text-[11px]">Expected Hash</label>
            <input
              type="text"
              value={expectedHash}
              onChange={(e) => setExpectedHash(e.target.value)}
              placeholder="Paste checksum to compare..."
              className="w-full bg-[#27272A] border border-[#F4F4F5]/10 focus:border-[#34D399] rounded-lg p-2 text-[#F4F4F5] text-xs placeholder:text-[#A1A1AA]/40 focus:outline-none"
            />
          </div>

          {isVerifying && (
            <div
              className={`p-3 rounded-lg border flex items-center gap-2.5 text-xs ${
                isMatch
                  ? 'bg-[#34D399]/10 border-[#34D399]/40 text-[#34D399]'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}
            >
              {isMatch ? (
                <>
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[#34D399]" />
                  <div>
                    <div className="font-semibold">Hashes match</div>
                    <div className="text-[11px] opacity-80 font-sans">The input matches the expected hash.</div>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <div>
                    <div className="font-semibold">Hashes do not match</div>
                    <div className="text-[11px] opacity-80 font-sans">The computed hash differs from expected.</div>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="p-2.5 rounded bg-[#27272A] text-[11px] text-[#A1A1AA] leading-relaxed font-sans">
            Evaluated locally in browser memory via Web Crypto API.
          </div>
        </div>
      </div>
    </div>
  );
};
