import React, { useState, useMemo } from 'react';
import { ShieldCheck, Copy, Check } from 'lucide-react';
import { SecurityHeadersConfig, generateSecurityHeaders, formatHeadersForServer } from '../../utils/headers';

interface SecurityHeadersProps {
  onShowToast: (msg: string) => void;
  onLogEvent: (tool: string, action: string, details?: string) => void;
}

export const SecurityHeaders: React.FC<SecurityHeadersProps> = ({ onShowToast, onLogEvent }) => {
  const [config, setConfig] = useState<SecurityHeadersConfig>({
    cspMode: 'strict',
    enableHsts: true,
    hstsPreload: true,
    frameOptions: 'DENY',
    contentTypeOptions: true,
    referrerPolicy: 'strict-origin-when-cross-origin',
    permissionsPolicy: true,
    coop: true,
    coep: false
  });

  const [serverTarget, setServerTarget] = useState<'nginx' | 'caddy' | 'cloudflare' | 'nextjs' | 'apache'>('nginx');
  const [copied, setCopied] = useState(false);

  const headers = useMemo(() => generateSecurityHeaders(config), [config]);
  const formattedCode = useMemo(() => formatHeadersForServer(headers, serverTarget), [headers, serverTarget]);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedCode);
    setCopied(true);
    onShowToast(`${serverTarget.toUpperCase()} config copied`);
    onLogEvent('Headers', `Exported headers for ${serverTarget}`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Config Options Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#131924] border border-[#E2E8F0]/10 rounded-xl p-4 space-y-3">
            <div className="text-[#E2E8F0] font-bold pb-2 border-b border-[#E2E8F0]/10 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#F59E0B]" />
              HTTP Security Header Rules
            </div>

            {/* CSP Mode */}
            <div className="space-y-1">
              <label className="text-[#E2E8F0]/60 text-[11px]">Content-Security-Policy (CSP)</label>
              <select
                value={config.cspMode}
                onChange={(e) => setConfig({ ...config, cspMode: e.target.value as any })}
                className="w-full bg-[#0B0F17] border border-[#E2E8F0]/15 rounded-lg p-2 text-[#E2E8F0] focus:border-[#F59E0B] focus:outline-none"
              >
                <option value="strict">Strict (default-src 'self', script-src 'self')</option>
                <option value="spa">SPA / Vite Friendly (unsafe-inline allowed)</option>
                <option value="relaxed">Relaxed / Permissive</option>
              </select>
            </div>

            {/* HSTS */}
            <label className="flex items-center gap-3 cursor-pointer text-[#E2E8F0]/80 hover:text-[#E2E8F0] pt-1">
              <input
                type="checkbox"
                checked={config.enableHsts}
                onChange={(e) => setConfig({ ...config, enableHsts: e.target.checked })}
                className="w-4 h-4 rounded border-[#E2E8F0]/20 bg-[#E2E8F0]/5 checked:bg-[#F59E0B] text-[#F59E0B]"
              />
              <span>Strict-Transport-Security (HSTS 2-Year Max-Age)</span>
            </label>

            {/* X-Frame-Options */}
            <div className="space-y-1 pt-1">
              <label className="text-[#E2E8F0]/60 text-[11px]">X-Frame-Options (Clickjacking Protection)</label>
              <select
                value={config.frameOptions}
                onChange={(e) => setConfig({ ...config, frameOptions: e.target.value as any })}
                className="w-full bg-[#0B0F17] border border-[#E2E8F0]/15 rounded-lg p-2 text-[#E2E8F0] focus:border-[#F59E0B] focus:outline-none"
              >
                <option value="DENY">DENY (Zero framing allowed)</option>
                <option value="SAMEORIGIN">SAMEORIGIN</option>
                <option value="OFF">Disabled</option>
              </select>
            </div>

            {/* MIME Sniffing & Permissions */}
            <label className="flex items-center gap-3 cursor-pointer text-[#E2E8F0]/80 hover:text-[#E2E8F0] pt-1">
              <input
                type="checkbox"
                checked={config.contentTypeOptions}
                onChange={(e) => setConfig({ ...config, contentTypeOptions: e.target.checked })}
                className="w-4 h-4 rounded border-[#E2E8F0]/20 bg-[#E2E8F0]/5 checked:bg-[#F59E0B] text-[#F59E0B]"
              />
              <span>X-Content-Type-Options: nosniff</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer text-[#E2E8F0]/80 hover:text-[#E2E8F0]">
              <input
                type="checkbox"
                checked={config.permissionsPolicy}
                onChange={(e) => setConfig({ ...config, permissionsPolicy: e.target.checked })}
                className="w-4 h-4 rounded border-[#E2E8F0]/20 bg-[#E2E8F0]/5 checked:bg-[#F59E0B] text-[#F59E0B]"
              />
              <span>Permissions-Policy (Disable Camera, Mic, Geolocation)</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer text-[#E2E8F0]/80 hover:text-[#E2E8F0]">
              <input
                type="checkbox"
                checked={config.coop}
                onChange={(e) => setConfig({ ...config, coop: e.target.checked })}
                className="w-4 h-4 rounded border-[#E2E8F0]/20 bg-[#E2E8F0]/5 checked:bg-[#F59E0B] text-[#F59E0B]"
              />
              <span>Cross-Origin-Opener-Policy (COOP same-origin)</span>
            </label>
          </div>
        </div>

        {/* Server Snippet Output Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between gap-2">
            {/* Target Server Switcher */}
            <div className="flex flex-wrap gap-1">
              {(['nginx', 'caddy', 'cloudflare', 'nextjs', 'apache'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setServerTarget(t)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase transition-colors cursor-pointer ${
                    serverTarget === t
                      ? 'bg-[#F59E0B] text-[#0B0F17]'
                      : 'bg-[#131924] text-[#E2E8F0]/60 hover:text-[#E2E8F0]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-[#F59E0B]/15 hover:bg-[#F59E0B] text-[#F59E0B] hover:text-[#0B0F17] font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#F59E0B]" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Config'}
            </button>
          </div>

          <pre className="p-4 bg-[#131924] border border-[#F59E0B]/30 rounded-xl text-[#F59E0B] text-[11px] overflow-x-auto max-h-96 select-all whitespace-pre leading-relaxed">
            {formattedCode}
          </pre>
        </div>
      </div>
    </div>
  );
};
