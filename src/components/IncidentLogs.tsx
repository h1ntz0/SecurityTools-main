import React from 'react';
import { Terminal, Download, Trash2 } from 'lucide-react';
import { LogEntry } from '../types';

interface IncidentLogsProps {
  logs: LogEntry[];
  onClearLogs: () => void;
  onShowToast: (msg: string) => void;
}

export const IncidentLogs: React.FC<IncidentLogsProps> = ({ logs, onClearLogs, onShowToast }) => {
  const handleExport = () => {
    if (logs.length === 0) {
      onShowToast('No incident logs to export');
      return;
    }

    const payload = JSON.stringify(logs, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `securitytools-audit-log-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onShowToast('Audit log JSON exported');
  };

  return (
    <section id="incidents" className="py-12 border-b border-[#E2E8F0]/10 scroll-mt-14 font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-[#F59E0B] text-xs font-semibold uppercase tracking-wider mb-1">
              <Terminal className="w-4 h-4" />
              Session Audit Trail
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#E2E8F0]">Local Security Incident & Event Logs</h2>
            <p className="text-xs text-[#E2E8F0]/60 font-sans mt-1">
              In-memory chronological transaction log of local cryptographic operations. Ephemeral session storage only.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              disabled={logs.length === 0}
              className="px-3 py-1.5 rounded-lg bg-[#131924] hover:bg-[#E2E8F0]/10 text-[#E2E8F0] border border-[#E2E8F0]/20 text-xs font-semibold transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#F59E0B]" />
              Export JSON
            </button>
            <button
              onClick={onClearLogs}
              disabled={logs.length === 0}
              className="px-3 py-1.5 rounded-lg bg-[#131924] hover:bg-red-500/10 text-[#E2E8F0]/70 hover:text-red-400 border border-[#E2E8F0]/20 text-xs font-semibold transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          </div>
        </div>

        {/* Logs Console Box */}
        <div className="bg-[#131924] border border-[#E2E8F0]/10 rounded-xl overflow-hidden shadow-xl">
          <div className="bg-[#0B0F17] px-4 py-2.5 border-b border-[#E2E8F0]/10 flex items-center justify-between text-[11px] text-[#E2E8F0]/50">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
              <span>LIVE BUFFER ({logs.length} entries)</span>
            </div>
            <span>STDOUT / VOLATILE</span>
          </div>

          <div className="p-4 max-h-72 overflow-y-auto space-y-2 text-xs">
            {logs.length === 0 ? (
              <div className="py-8 text-center text-[#E2E8F0]/40 italic">
                No activity recorded yet. Run a password generator, hash calculation, or URL inspection to populate events.
              </div>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 p-2 rounded-lg bg-[#0B0F17]/60 border border-[#E2E8F0]/5 font-mono text-xs hover:border-[#F59E0B]/30 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-[#E2E8F0]/40 text-[11px] shrink-0">{log.timestamp}</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] text-[10px] font-bold shrink-0">
                      {log.tool}
                    </span>
                    <span className="text-[#E2E8F0] font-medium truncate">{log.action}</span>
                  </div>
                  {log.details && (
                    <span className="text-[#E2E8F0]/50 text-[11px] font-sans truncate sm:text-right">
                      {log.details}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
