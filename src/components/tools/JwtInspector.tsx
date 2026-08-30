import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, Clock, Copy, Check, RotateCcw, Sparkles } from 'lucide-react';
import { parseJwt } from '../../utils/jwt';
import { JwtTokenData } from '../../types';

const SAMPLE_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlNlbmlvciBTZWN1cml0eSBFbmdpbmVlciIsImFkbWluIjp0cnVlLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MjIwODk4ODgwMH0.4PclnQ3i7rZ8-O5N11q9l0iY_2-YvW-E1F_N_q0-z-M';

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
    onShowToast(`${label} copied to clipboard`);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleLoadSample = () => {
    setTokenInput(SAMPLE_JWT);
    onShowToast('Sample JWT token loaded');
    onLogEvent('JWT', 'Loaded sample debug token');
  };

  const handleClear = () => {
    setTokenInput('');
    setJwtData(null);
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Input Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label className="text-[#E2E8F0]/60">Raw JWT Token String (Header.Payload.Signature)</label>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLoadSample}
              className="text-[#F59E0B] hover:underline flex items-center gap-1 text-[11px]"
            >
              <Sparkles className="w-3 h-3" /> Load Sample
            </button>
            {tokenInput && (
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
          rows={3}
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          placeholder="Paste JSON Web Token (eyJhbGciOi...)..."
          className="w-full bg-[#131924] border border-[#E2E8F0]/15 focus:border-[#F59E0B] rounded-xl p-3 text-xs text-[#F59E0B] placeholder:text-[#E2E8F0]/30 focus:outline-none resize-y break-all"
        />
      </div>

      {/* Inspection Output Grid */}
      {jwtData ? (
        <div className="space-y-5">
          {/* Token Meta Status Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[#131924] border border-[#E2E8F0]/10 rounded-xl text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-[#E2E8F0]/5 flex items-center justify-center text-[#F59E0B]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[#E2E8F0]/50 text-[10px]">Algorithm</div>
                <div className="text-[#E2E8F0] font-bold">{jwtData.algorithm}</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-[#E2E8F0]/5 flex items-center justify-center text-[#F59E0B]">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[#E2E8F0]/50 text-[10px]">Token Status</div>
                {jwtData.isExpired === null ? (
                  <div className="text-[#E2E8F0]/70">No Expiry Claim (exp)</div>
                ) : jwtData.isExpired ? (
                  <div className="text-red-400 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> EXPIRED
                  </div>
                ) : (
                  <div className="text-[#F59E0B] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> VALID TOKEN
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-[#E2E8F0]/5 flex items-center justify-center text-[#F59E0B]">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[#E2E8F0]/50 text-[10px]">Expires At</div>
                <div className="text-[#E2E8F0] truncate max-w-[150px]">
                  {jwtData.expiresAt || 'Infinite / No exp'}
                </div>
              </div>
            </div>
          </div>

          {/* JSON Decoded Views */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Header Box */}
            <div className="bg-[#131924] border border-[#E2E8F0]/10 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]/10">
                <span className="text-xs font-bold text-[#E2E8F0] uppercase tracking-wider text-rose-400">
                  1. JOSE Header
                </span>
                <button
                  onClick={() => handleCopy(jwtData.rawHeader, 'Header')}
                  className="text-[#E2E8F0]/50 hover:text-[#E2E8F0] flex items-center gap-1 text-xs"
                >
                  {copiedSection === 'Header' ? <Check className="w-3.5 h-3.5 text-[#F59E0B]" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedSection === 'Header' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="text-xs text-[#E2E8F0]/90 bg-[#0B0F17] p-3 rounded-lg overflow-x-auto max-h-56">
                {jwtData.rawHeader}
              </pre>
            </div>

            {/* Payload Claims Box */}
            <div className="bg-[#131924] border border-[#E2E8F0]/10 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]/10">
                <span className="text-xs font-bold text-[#E2E8F0] uppercase tracking-wider text-[#F59E0B]">
                  2. Payload Claims
                </span>
                <button
                  onClick={() => handleCopy(jwtData.rawPayload, 'Payload')}
                  className="text-[#E2E8F0]/50 hover:text-[#E2E8F0] flex items-center gap-1 text-xs"
                >
                  {copiedSection === 'Payload' ? <Check className="w-3.5 h-3.5 text-[#F59E0B]" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedSection === 'Payload' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="text-xs text-[#F59E0B] bg-[#0B0F17] p-3 rounded-lg overflow-x-auto max-h-56">
                {jwtData.rawPayload}
              </pre>
            </div>
          </div>

          {/* Signature Box */}
          <div className="bg-[#131924] border border-[#E2E8F0]/10 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]/10">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                3. Raw Cryptographic Signature
              </span>
              <button
                onClick={() => handleCopy(jwtData.signature, 'Signature')}
                className="text-[#E2E8F0]/50 hover:text-[#E2E8F0] flex items-center gap-1 text-xs"
              >
                {copiedSection === 'Signature' ? <Check className="w-3.5 h-3.5 text-[#F59E0B]" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSection === 'Signature' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="text-xs text-cyan-400 bg-[#0B0F17] p-3 rounded-lg break-all select-all">
              {jwtData.signature}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-[#131924] border border-[#E2E8F0]/10 rounded-xl text-xs text-[#E2E8F0]/40">
          Paste a valid 3-part base64url encoded JWT token string to view decoded claims.
        </div>
      )}
    </div>
  );
};
