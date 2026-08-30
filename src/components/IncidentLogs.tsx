import React from 'react';
import { Download, Trash2 } from 'lucide-react';
import { LogEntry } from '../types';

interface IncidentLogsProps {
  logs: LogEntry[];
  onClearLogs: () => void;
  onShowToast: (msg: string) => void;
}

export const IncidentLogs: React.FC<IncidentLogsProps> = ({ logs, onClearLogs, onShowToast }) => {
  const handleExport = () => {
    if (logs.length === 0) {
      onShowToast('No logs to export');
      return;
    }

    const payload = JSON.stringify(logs, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `securitytools-log-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onShowToast('Logs exported as JSON');
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-[#F4F4F5]">Activity Logs</div>
          <div className="text-xs text-[#A1A1AA] font-sans mt-0.5">
            In-memory session log of actions in this browser session.
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            disabled={logs.length === 0}
            className="px-2.5 py-1.5 rounded bg-[#18181B] hover:bg-[#27272A] text-[#F4F4F5] border border-[#F4F4F5]/10 text-xs transition-colors flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#34D399]" />
            Export JSON
          </button>
          <button
            onClick={onClearLogs}
            disabled={logs.length === 0}
            className="px-2.5 py-1.5 rounded bg-[#18181B] hover:bg-red-500/10 text-[#A1A1AA] hover:text-red-400 border border-[#F4F4F5]/10 text-xs transition-colors flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>
      </div>

      <div className="bg-[#18181B] border border-[#F4F4F5]/10 rounded-lg overflow-hidden">
        <div className="bg-[#27272A] px-3 py-2 border-b border-[#F4F4F5]/10 flex items-center justify-between text-[11px] text-[#A1A1AA]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#34D399]" />
            <span>Session Logs ({logs.length})</span>
          </div>
        </div>

        <div className="p-3 max-h-80 overflow-y-auto space-y-1.5 text-xs">
          {logs.length === 0 ? (
            <div className="py-6 text-center text-[#A1A1AA]/50 italic">
              No activity recorded yet.
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3 p-2 rounded bg-[#27272A] border border-[#F4F4F5]/5 hover:border-[#34D399]/30 transition-colors text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[#A1A1AA] text-[11px] shrink-0">{log.timestamp}</span>
                  <span className="px-1.5 py-0.2 rounded bg-[#34D399]/10 text-[#34D399] text-[10px] font-semibold shrink-0">
                    {log.tool}
                  </span>
                  <span className="text-[#F4F4F5] truncate">{log.action}</span>
                </div>
                {log.details && (
                  <span className="text-[#A1A1AA] text-[11px] font-sans truncate sm:text-right">
                    {log.details}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
