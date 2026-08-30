import React, { useState, useMemo } from 'react';
import { Copy, Check } from 'lucide-react';
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
    <div className="space-y-4 font-mono text-xs">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6 space-y-3">
          <div className="bg-[#18181B] border border-[#F4F4F5]/10 rounded-lg p-3.5 space-y-2.5">
            <div className="text-[#F4F4F5] font-semibold pb-1.5 border-b border-[#F4F4F5]/10 text-xs">
              Header Options
            </div>

            <div className="space-y-1">
              <label className="text-[#A1A1AA] text-[11px]">Content-Security-Policy</label>
              <select
                value={config.cspMode}
                onChange={(e) => setConfig({ ...config, cspMode: e.target.value as any })}
                className="w-full bg-[#27272A] border border-[#F4F4F5]/10 rounded-lg p-2 text-[#F4F4F5] focus:border-[#34D399] focus:outline-none text-xs"
              >
                <option value="strict">Strict (default-src 'self')</option>
                <option value="spa">SPA / Vite Friendly</option>
                <option value="relaxed">Relaxed / Permissive</option>
              </select>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer text-[#F4F4F5]/80 hover:text-[#F4F4F5]">
              <input
                type="checkbox"
                checked={config.enableHsts}
                onChange={(e) => setConfig({ ...config, enableHsts: e.target.checked })}
                className="w-4 h-4 rounded border-[#F4F4F5]/20 bg-[#27272A] accent-[#34D399]"
              />
              <span>Strict-Transport-Security (HSTS)</span>
            </label>

            <div className="space-y-1">
              <label className="text-[#A1A1AA] text-[11px]">X-Frame-Options</label>
              <select
                value={config.frameOptions}
                onChange={(e) => setConfig({ ...config, frameOptions: e.target.value as any })}
                className="w-full bg-[#27272A] border border-[#F4F4F5]/10 rounded-lg p-2 text-[#F4F4F5] focus:border-[#34D399] focus:outline-none text-xs"
              >
                <option value="DENY">DENY (Prevent embedding)</option>
                <option value="SAMEORIGIN">SAMEORIGIN</option>
                <option value="OFF">Disabled</option>
              </select>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer text-[#F4F4F5]/80 hover:text-[#F4F4F5]">
              <input
                type="checkbox"
                checked={config.contentTypeOptions}
                onChange={(e) => setConfig({ ...config, contentTypeOptions: e.target.checked })}
                className="w-4 h-4 rounded border-[#F4F4F5]/20 bg-[#27272A] accent-[#34D399]"
              />
              <span>X-Content-Type-Options: nosniff</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer text-[#F4F4F5]/80 hover:text-[#F4F4F5]">
              <input
                type="checkbox"
                checked={config.permissionsPolicy}
                onChange={(e) => setConfig({ ...config, permissionsPolicy: e.target.checked })}
                className="w-4 h-4 rounded border-[#F4F4F5]/20 bg-[#27272A] accent-[#34D399]"
              />
              <span>Permissions-Policy (Disable Camera, Mic)</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer text-[#F4F4F5]/80 hover:text-[#F4F4F5]">
              <input
                type="checkbox"
                checked={config.coop}
                onChange={(e) => setConfig({ ...config, coop: e.target.checked })}
                className="w-4 h-4 rounded border-[#F4F4F5]/20 bg-[#27272A] accent-[#34D399]"
              />
              <span>Cross-Origin-Opener-Policy (same-origin)</span>
            </label>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1">
              {(['nginx', 'caddy', 'cloudflare', 'nextjs', 'apache'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setServerTarget(t)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium uppercase transition-colors cursor-pointer ${
                    serverTarget === t
                      ? 'bg-[#34D399] text-[#18181B]'
                      : 'bg-[#18181B] text-[#A1A1AA] hover:text-[#F4F4F5]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              onClick={handleCopy}
              className="px-2.5 py-1 rounded bg-[#34D399]/15 hover:bg-[#34D399] text-[#34D399] hover:text-[#18181B] text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <pre className="p-3 bg-[#18181B] border border-[#F4F4F5]/10 rounded-lg text-[#34D399] text-[11px] overflow-x-auto max-h-80 select-all whitespace-pre leading-relaxed">
            {formattedCode}
          </pre>
        </div>
      </div>
    </div>
  );
};
