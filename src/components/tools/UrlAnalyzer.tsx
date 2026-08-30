import React, { useState, useEffect } from 'react';
import { Globe, AlertTriangle, CheckCircle2, RotateCcw } from 'lucide-react';
import { analyzeUrl } from '../../utils/url';
import { UrlAnalysisResult } from '../../types';

const SAMPLE_URL = 'https://admin.example.internal:8443/api/v1/auth/callback?redirect_uri=https%3A%2F%2Fapp.example.internal%2Fdashboard&session_id=sec_1092a#token';

interface UrlAnalyzerProps {
  onShowToast: (msg: string) => void;
  onLogEvent: (tool: string, action: string, details?: string) => void;
}

export const UrlAnalyzer: React.FC<UrlAnalyzerProps> = ({ onShowToast, onLogEvent }) => {
  const [urlInput, setUrlInput] = useState<string>(SAMPLE_URL);
  const [result, setResult] = useState<UrlAnalysisResult | null>(null);

  useEffect(() => {
    if (!urlInput.trim()) {
      setResult(null);
      return;
    }
    const res = analyzeUrl(urlInput);
    setResult(res);
  }, [urlInput]);

  const handleLoadSample = () => {
    setUrlInput(SAMPLE_URL);
    onShowToast('Sample URL loaded');
    onLogEvent('URL', 'Loaded sample URL');
  };

  const handleClear = () => {
    setUrlInput('');
    setResult(null);
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[#A1A1AA]">URL Input</label>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLoadSample}
              className="text-[#34D399] hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
            >
              Load Sample
            </button>
            {urlInput && (
              <button
                onClick={handleClear}
                className="text-[#A1A1AA] hover:text-[#F4F4F5] flex items-center gap-1 text-[11px] cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Clear
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 bg-[#18181B] border border-[#F4F4F5]/10 focus-within:border-[#34D399] rounded-lg p-2.5">
          <Globe className="w-4 h-4 text-[#34D399] shrink-0" />
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/path?key=value#hash..."
            className="w-full bg-transparent text-xs text-[#F4F4F5] placeholder:text-[#A1A1AA]/40 focus:outline-none"
          />
        </div>
      </div>

      {result ? (
        <div className="space-y-3.5">
          <div className="space-y-1.5">
            <div className="text-xs text-[#A1A1AA] font-medium">
              Security Checks
            </div>
            {result.risks.length === 0 ? (
              <div className="p-3 rounded-lg bg-[#34D399]/10 border border-[#34D399]/30 text-[#34D399] flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>No obvious security issues detected in URL structure.</span>
              </div>
            ) : (
              <div className="space-y-1.5">
                {result.risks.map((risk, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-lg border flex items-start gap-2 text-xs ${
                      risk.severity === 'CRITICAL' || risk.severity === 'HIGH'
                        ? 'bg-red-500/10 border-red-500/30 text-red-300'
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold mr-1.5">[{risk.severity}]</span>
                      <span className="font-sans">{risk.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#18181B] border border-[#F4F4F5]/10 rounded-lg overflow-hidden text-xs">
            <div className="divide-y divide-white/5">
              <div className="grid grid-cols-1 sm:grid-cols-4 p-2.5 gap-1">
                <span className="text-[#A1A1AA]">Protocol:</span>
                <span className="sm:col-span-3 text-[#34D399] font-medium">{result.protocol}://</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 p-2.5 gap-1">
                <span className="text-[#A1A1AA]">Hostname:</span>
                <span className="sm:col-span-3 text-[#F4F4F5] font-medium">{result.hostname}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 p-2.5 gap-1">
                <span className="text-[#A1A1AA]">Port:</span>
                <span className="sm:col-span-3 text-[#F4F4F5]">{result.port}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 p-2.5 gap-1">
                <span className="text-[#A1A1AA]">Pathname:</span>
                <span className="sm:col-span-3 text-[#F4F4F5]">{result.pathname}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 p-2.5 gap-1">
                <span className="text-[#A1A1AA]">Origin:</span>
                <span className="sm:col-span-3 text-[#F4F4F5]">{result.origin}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 p-2.5 gap-1">
                <span className="text-[#A1A1AA]">Hash / Fragment:</span>
                <span className="sm:col-span-3 text-[#F4F4F5]">{result.hash}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#18181B] border border-[#F4F4F5]/10 rounded-lg p-3 space-y-2">
            <div className="text-xs font-semibold text-[#F4F4F5]">
              Query Parameters ({Object.keys(result.params).length})
            </div>
            {Object.keys(result.params).length === 0 ? (
              <div className="text-[#A1A1AA]/50 text-xs py-1 italic">No parameters found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                {Object.entries(result.params).map(([k, v]) => (
                  <div key={k} className="p-2 rounded bg-[#27272A] border border-[#F4F4F5]/5">
                    <div className="text-[11px] text-[#A1A1AA] font-semibold truncate">{k}</div>
                    <div className="text-xs text-[#34D399] break-all select-all">{v}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-6 text-center bg-[#18181B] border border-[#F4F4F5]/10 rounded-lg text-xs text-[#A1A1AA]">
          Enter a URL to parse components and check for risks.
        </div>
      )}
    </div>
  );
};
