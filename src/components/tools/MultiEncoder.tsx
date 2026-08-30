import React, { useState, useMemo } from 'react';
import { Copy, Check, RotateCcw } from 'lucide-react';
import { transformAllEncodings } from '../../utils/encoder';

interface MultiEncoderProps {
  onShowToast: (msg: string) => void;
  onLogEvent: (tool: string, action: string, details?: string) => void;
}

export const MultiEncoder: React.FC<MultiEncoderProps> = ({ onShowToast, onLogEvent }) => {
  const [inputText, setInputText] = useState('Hello SecurityTools');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const transformed = useMemo(() => {
    return transformAllEncodings(inputText);
  }, [inputText]);

  const handleCopy = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    onShowToast(`${label} copied`);
    onLogEvent('Encoder', `Copied ${label}`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const formats = [
    { key: 'base64', label: 'Base64', value: transformed.base64 },
    { key: 'base64Url', label: 'Base64URL', value: transformed.base64Url },
    { key: 'hex', label: 'Hex', value: transformed.hex },
    { key: 'binary', label: 'Binary', value: transformed.binary },
    { key: 'urlEncoded', label: 'URL Encoded', value: transformed.urlEncoded },
    { key: 'htmlEntities', label: 'HTML Entities', value: transformed.htmlEntities },
    { key: 'rot13', label: 'ROT13', value: transformed.rot13 }
  ];

  return (
    <div className="space-y-4 font-mono text-xs">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[#A1A1AA]">Input Text</label>
          {inputText && (
            <button
              onClick={() => setInputText('')}
              className="text-[#A1A1AA] hover:text-[#F4F4F5] flex items-center gap-1 text-[11px] cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Clear
            </button>
          )}
        </div>
        <textarea
          rows={3}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type or paste text..."
          className="w-full bg-[#18181B] border border-[#F4F4F5]/10 focus:border-[#34D399] rounded-lg p-2.5 text-[#F4F4F5] placeholder:text-[#A1A1AA]/40 focus:outline-none resize-y"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {formats.map((fmt) => (
          <div key={fmt.key} className="bg-[#18181B] border border-[#F4F4F5]/10 rounded-lg p-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-medium text-[#F4F4F5] text-xs">{fmt.label}</span>
              <button
                onClick={() => handleCopy(fmt.value, fmt.label)}
                disabled={!fmt.value}
                className="text-[#34D399] hover:underline flex items-center gap-1 text-[11px] disabled:opacity-30 cursor-pointer"
              >
                {copiedKey === fmt.label ? <Check className="w-3 h-3 text-[#34D399]" /> : <Copy className="w-3 h-3" />}
                {copiedKey === fmt.label ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="p-2 bg-[#27272A] border border-[#F4F4F5]/5 rounded text-[#34D399] text-xs break-all max-h-20 overflow-y-auto select-all">
              {fmt.value || <span className="text-[#A1A1AA]/30 italic">Empty</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
