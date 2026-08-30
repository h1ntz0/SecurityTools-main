import React, { useState, useMemo } from 'react';
import { Copy, Check, RotateCcw, ArrowRightLeft } from 'lucide-react';
import { transformAllEncodings } from '../../utils/encoder';

interface MultiEncoderProps {
  onShowToast: (msg: string) => void;
  onLogEvent: (tool: string, action: string, details?: string) => void;
}

export const MultiEncoder: React.FC<MultiEncoderProps> = ({ onShowToast, onLogEvent }) => {
  const [inputText, setInputText] = useState('SeniorSecDev#2026');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const transformed = useMemo(() => {
    return transformAllEncodings(inputText);
  }, [inputText]);

  const handleCopy = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    onShowToast(`${label} copied to clipboard`);
    onLogEvent('Multi-Encoder', `Copied ${label} format`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const formats = [
    { key: 'base64', label: 'Base64 (Standard RFC 4648)', value: transformed.base64 },
    { key: 'base64Url', label: 'Base64URL (JWT safe)', value: transformed.base64Url },
    { key: 'hex', label: 'Hexadecimal (Raw bytes)', value: transformed.hex },
    { key: 'binary', label: 'Binary (8-bit bytes stream)', value: transformed.binary },
    { key: 'urlEncoded', label: 'URL Percent Encoded', value: transformed.urlEncoded },
    { key: 'htmlEntities', label: 'HTML Numerical Entities', value: transformed.htmlEntities },
    { key: 'rot13', label: 'ROT13 Caesar Cipher', value: transformed.rot13 }
  ];

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Input Box */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label className="text-[#E2E8F0]/60 flex items-center gap-2">
            <ArrowRightLeft className="w-3.5 h-3.5 text-[#F59E0B]" />
            Input String (Live Multi-Format Transformation)
          </label>
          {inputText && (
            <button
              onClick={() => setInputText('')}
              className="text-[#E2E8F0]/50 hover:text-[#E2E8F0] flex items-center gap-1 text-[11px] cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Clear
            </button>
          )}
        </div>
        <textarea
          rows={3}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type or paste any text or payload here..."
          className="w-full bg-[#131924] border border-[#E2E8F0]/15 focus:border-[#F59E0B] rounded-xl p-3 text-[#E2E8F0] placeholder:text-[#E2E8F0]/30 focus:outline-none resize-y"
        />
      </div>

      {/* Grid of Transformed Formats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {formats.map((fmt) => (
          <div key={fmt.key} className="bg-[#131924] border border-[#E2E8F0]/10 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#E2E8F0]/80 text-[11px]">{fmt.label}</span>
              <button
                onClick={() => handleCopy(fmt.value, fmt.label)}
                disabled={!fmt.value}
                className="text-[#F59E0B] hover:underline flex items-center gap-1 text-[11px] disabled:opacity-30 cursor-pointer"
              >
                {copiedKey === fmt.label ? <Check className="w-3 h-3 text-[#F59E0B]" /> : <Copy className="w-3 h-3" />}
                {copiedKey === fmt.label ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="p-2.5 bg-[#0B0F17] border border-[#E2E8F0]/5 rounded-lg text-[#F59E0B] text-xs break-all max-h-24 overflow-y-auto select-all">
              {fmt.value || <span className="text-[#E2E8F0]/20 italic">Empty</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
