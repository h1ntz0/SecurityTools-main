import React, { useState, useEffect } from 'react';
import { Globe, AlertTriangle, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { analyzeUrl } from '../../utils/url';
import { UrlAnalysisResult } from '../../types';

const SAMPLE_URL = 'https://admin-auth.corp.internal:8443/api/v2/auth/callback?redirect_uri=https%3A%2F%2Fapp.corp.internal%2Fdashboard&session_id=sec_9942a1&state=0xfa918b#access_token';

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
    onShowToast('Sample endpoint URL loaded');
    onLogEvent('URL', 'Loaded sample security test endpoint');
  };

  const handleClear = () => {
    setUrlInput('');
    setResult(null);
  };

  return (
    <div className="space-y-6 font-mono">
      {/* URL Input Box */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label className="text-[#E2E8F0]/60">Target URL / Webhook Endpoint</label>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLoadSample}
              className="text-[#F59E0B] hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
            >
              <Sparkles className="w-3 h-3" /> Load Sample
            </button>
            {urlInput && (
              <button
                onClick={handleClear}
                className="text-[#E2E8F0]/50 hover:text-[#E2E8F0] flex items-center gap-1 text-[11px] cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Clear
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 bg-[#131924] border border-[#E2E8F0]/15 focus-within:border-[#F59E0B] rounded-xl p-3 shadow-inner">
          <Globe className="w-5 h-5 text-[#F59E0B] shrink-0" />
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/path?key=value#hash..."
            className="w-full bg-transparent text-xs sm:text-sm text-[#E2E8F0] placeholder:text-[#E2E8F0]/30 focus:outline-none"
          />
        </div>
      </div>

      {/* Analysis Output */}
      {result ? (
        <div className="space-y-5">
          {/* Security Risk Heuristics Banner */}
          <div className="space-y-2">
            <div className="text-xs text-[#E2E8F0]/60 uppercase font-semibold tracking-wider">
              Security Risk Assessment
            </div>
            {result.risks.length === 0 ? (
              <div className="p-3.5 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] flex items-center gap-3 text-xs">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>No high-risk URL anomaly patterns identified. Protocol and syntax follow standard guidelines.</span>
              </div>
            ) : (
              <div className="space-y-2">
                {result.risks.map((risk, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
                      risk.severity === 'CRITICAL' || risk.severity === 'HIGH'
                        ? 'bg-red-500/10 border-red-500/40 text-red-300'
                        : 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold mr-2">[{risk.severity}]</span>
                      <span className="font-sans">{risk.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Component Breakdown Table */}
          <div className="bg-[#131924] border border-[#E2E8F0]/10 rounded-xl overflow-hidden text-xs">
            <div className="px-4 py-3 border-b border-[#E2E8F0]/10 font-bold text-[#E2E8F0] uppercase tracking-wider text-[11px] bg-[#0B0F17]">
              Parsed Component Matrix
            </div>
            <div className="divide-y divide-white/5">
              <div className="grid grid-cols-1 sm:grid-cols-4 p-3 gap-2">
                <span className="text-[#E2E8F0]/50">Protocol:</span>
                <span className="sm:col-span-3 text-[#F59E0B] font-semibold">{result.protocol}://</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 p-3 gap-2">
                <span className="text-[#E2E8F0]/50">Hostname:</span>
                <span className="sm:col-span-3 text-[#E2E8F0] font-semibold">{result.hostname}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 p-3 gap-2">
                <span className="text-[#E2E8F0]/50">Port:</span>
                <span className="sm:col-span-3 text-[#E2E8F0]">{result.port}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 p-3 gap-2">
                <span className="text-[#E2E8F0]/50">Pathname:</span>
                <span className="sm:col-span-3 text-[#E2E8F0]/90">{result.pathname}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 p-3 gap-2">
                <span className="text-[#E2E8F0]/50">Origin:</span>
                <span className="sm:col-span-3 text-[#E2E8F0]/90">{result.origin}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 p-3 gap-2">
                <span className="text-[#E2E8F0]/50">URL Fragment:</span>
                <span className="sm:col-span-3 text-[#E2E8F0]/90">{result.hash}</span>
              </div>
            </div>
          </div>

          {/* Query Parameters Inspection */}
          <div className="bg-[#131924] border border-[#E2E8F0]/10 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-[#E2E8F0]/10">
              <span className="font-bold text-[#E2E8F0] uppercase tracking-wider text-[11px]">
                Query Parameters ({Object.keys(result.params).length})
              </span>
            </div>
            {Object.keys(result.params).length === 0 ? (
              <div className="text-[#E2E8F0]/40 text-xs py-2 italic">No search query parameters found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(result.params).map(([k, v]) => (
                  <div key={k} className="p-2.5 rounded-lg bg-[#0B0F17] border border-[#E2E8F0]/10 space-y-1">
                    <div className="text-[11px] text-[#E2E8F0]/50 font-bold truncate">{k}</div>
                    <div className="text-xs text-[#F59E0B] break-all select-all">{v}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-[#131924] border border-[#E2E8F0]/10 rounded-xl text-xs text-[#E2E8F0]/40">
          Enter a valid URL to dissect protocols, hostname structures, parameters, and potential injection anomalies.
        </div>
      )}
    </div>
  );
};
