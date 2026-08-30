import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, Copy, Check, RotateCcw } from 'lucide-react';
import { parseJwt } from '../../utils/jwt';
import { JwtTokenData } from '../../types';

const SAMPLE_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlNlY3VyaXR5VG9vbHMgVXNlciIsImFkbWluIjp0cnVlLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MjIwODk4ODgwMH0.4PclnQ3i7rZ8-O5N11q9l0iY_2-YvW-E1F_N_q0-z-M';

interface JwtInspectorProps {
  onShowToast: (msg: string) => void;
  onLogEvent: (tool: string, action: string, details?: string) => void;
}

export const JwtInspector: React.FC<JwtInspectorProps> = ({ onShowToast, onLogEvent }) => {
  const [tokenInput, setTokenInput] = useState<string>(SAMPLE_JWT);
  const [jwtData, setJwtData] = useState<JwtTokenData | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  useEffect(() => {
    if (!tokenInput.trim()) {
      setJwtData(null);
      return;
    }
    const data = parseJwt(tokenInput);
    setJwtData(data);
  }, [tokenInput]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(label);
    onShowToast(`${label} copied`);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleLoadSample = () => {
    setTokenInput(SAMPLE_JWT);
    onShowToast('Sample token loaded');
    onLogEvent('JWT', 'Loaded sample token');
  };

  const handleClear = () => {
    setTokenInput('');
    setJwtData(null);
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[#A1A1AA]">JWT String</label>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLoadSample}
              className="text-[#34D399] hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
            >
              Load Sample
            </button>
            {tokenInput && (
              <button
                onClick={handleClear}
                className="text-[#A1A1AA] hover:text-[#F4F4F5] flex items-center gap-1 text-[11px] cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Clear
              </button>
            )}
          </div>
        </div>
        <textarea
          rows={3}
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          placeholder="Paste JWT token (eyJhbGciOi...)..."
          className="w-full bg-[#18181B] border border-[#F4F4F5]/10 focus:border-[#34D399] rounded-lg p-2.5 text-xs text-[#34D399] placeholder:text-[#A1A1AA]/40 focus:outline-none resize-y break-all"
        />
      </div>

      {jwtData ? (
        <div className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 bg-[#18181B] border border-[#F4F4F5]/10 rounded-lg text-xs">
            <div>
              <div className="text-[#A1A1AA] text-[10px]">Algorithm</div>
              <div className="text-[#F4F4F5] font-semibold">{jwtData.algorithm}</div>
            </div>

            <div>
              <div className="text-[#A1A1AA] text-[10px]">Status</div>
              {jwtData.isExpired === null ? (
                <div className="text-[#A1A1AA]">No exp claim</div>
              ) : jwtData.isExpired ? (
                <div className="text-red-400 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Expired
                </div>
              ) : (
                <div className="text-[#34D399] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Valid
                </div>
              )}
            </div>

            <div>
              <div className="text-[#A1A1AA] text-[10px]">Expires At</div>
              <div className="text-[#F4F4F5] truncate">
                {jwtData.expiresAt || 'No exp'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
            <div className="bg-[#18181B] border border-[#F4F4F5]/10 rounded-lg p-3 space-y-1.5">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#F4F4F5]/10">
                <span className="font-semibold text-xs text-[#F4F4F5]">Header</span>
                <button
                  onClick={() => handleCopy(jwtData.rawHeader, 'Header')}
                  className="text-[#34D399] hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
                >
                  {copiedSection === 'Header' ? <Check className="w-3 h-3 text-[#34D399]" /> : <Copy className="w-3 h-3" />}
                  {copiedSection === 'Header' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="text-xs text-[#F4F4F5] bg-[#27272A] p-2.5 rounded overflow-x-auto max-h-48">
                {jwtData.rawHeader}
              </pre>
            </div>

            <div className="bg-[#18181B] border border-[#F4F4F5]/10 rounded-lg p-3 space-y-1.5">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#F4F4F5]/10">
                <span className="font-semibold text-xs text-[#34D399]">Payload</span>
                <button
                  onClick={() => handleCopy(jwtData.rawPayload, 'Payload')}
                  className="text-[#34D399] hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
                >
                  {copiedSection === 'Payload' ? <Check className="w-3 h-3 text-[#34D399]" /> : <Copy className="w-3 h-3" />}
                  {copiedSection === 'Payload' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="text-xs text-[#34D399] bg-[#27272A] p-2.5 rounded overflow-x-auto max-h-48">
                {jwtData.rawPayload}
              </pre>
            </div>
          </div>

          <div className="bg-[#18181B] border border-[#F4F4F5]/10 rounded-lg p-3 space-y-1.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#F4F4F5]/10">
              <span className="font-semibold text-xs text-[#A1A1AA]">Signature</span>
              <button
                onClick={() => handleCopy(jwtData.signature, 'Signature')}
                className="text-[#34D399] hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
              >
                {copiedSection === 'Signature' ? <Check className="w-3 h-3 text-[#34D399]" /> : <Copy className="w-3 h-3" />}
                {copiedSection === 'Signature' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="text-xs text-[#A1A1AA] bg-[#27272A] p-2.5 rounded break-all select-all">
              {jwtData.signature}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 text-center bg-[#18181B] border border-[#F4F4F5]/10 rounded-lg text-xs text-[#A1A1AA]">
          Paste a valid JWT string to inspect decoded payload.
        </div>
      )}
    </div>
  );
};
