import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { CommandPalette } from './components/CommandPalette';
import { ToastContainer } from './components/ToastContainer';
import { DashboardView } from './components/views/DashboardView';
import { PasswordGenerator } from './components/tools/PasswordGenerator';
import { AesVault } from './components/tools/AesVault';
import { HashChecksum } from './components/tools/HashChecksum';
import { MultiEncoder } from './components/tools/MultiEncoder';
import { JwtInspector } from './components/tools/JwtInspector';
import { SecurityHeaders } from './components/tools/SecurityHeaders';
import { CidrCalculator } from './components/tools/CidrCalculator';
import { UrlAnalyzer } from './components/tools/UrlAnalyzer';
import { PortRiskDb } from './components/PortRiskDb';
import { IncidentLogs } from './components/IncidentLogs';
import { ViewId } from './types/navigation';
import { ToastMessage, LogEntry } from './types';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewId>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'init-1',
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      tool: 'System',
      action: 'Console workspace ready',
      details: 'Port 8080 active'
    }
  ]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as ViewId;
      if (hash) {
        setCurrentView(hash);
      }
    };

    if (window.location.hash) {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (viewId: ViewId) => {
    setCurrentView(viewId);
    window.location.hash = viewId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2000);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const logEvent = useCallback((tool: string, action: string, details?: string) => {
    const entry: LogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      tool,
      action,
      details
    };
    setLogs((prev) => [entry, ...prev.slice(0, 49)]);
  }, []);

  // Keyboard Shortcuts (Ctrl+K, Ctrl+1..8)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      } else if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        navigateTo('dashboard');
      } else if ((e.ctrlKey || e.metaKey) && e.key === '1') {
        e.preventDefault();
        navigateTo('crypto-password');
      } else if ((e.ctrlKey || e.metaKey) && e.key === '2') {
        e.preventDefault();
        navigateTo('integrity-hash');
      } else if ((e.ctrlKey || e.metaKey) && e.key === '3') {
        e.preventDefault();
        navigateTo('appsec-jwt');
      } else if ((e.ctrlKey || e.metaKey) && e.key === '4') {
        e.preventDefault();
        navigateTo('network-url');
      } else if ((e.ctrlKey || e.metaKey) && e.key === '5') {
        e.preventDefault();
        navigateTo('network-cidr');
      } else if ((e.ctrlKey || e.metaKey) && e.key === '6') {
        e.preventDefault();
        navigateTo('crypto-aes');
      } else if ((e.ctrlKey || e.metaKey) && e.key === '7') {
        e.preventDefault();
        navigateTo('integrity-encoder');
      } else if ((e.ctrlKey || e.metaKey) && e.key === '8') {
        e.preventDefault();
        navigateTo('appsec-headers');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F17] text-[#E2E8F0] flex selection:bg-[#F59E0B]/20 selection:text-[#F59E0B]">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <CommandPalette
        isOpen={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onSelectView={navigateTo}
      />

      <Sidebar
        currentView={currentView}
        onSelectView={navigateTo}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        isMobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ${
          sidebarOpen ? 'md:ml-60' : 'md:ml-16'
        }`}
      >
        <TopHeader
          currentView={currentView}
          onOpenCmd={() => setCmdOpen(true)}
          onMobileMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        <main className="flex-1 p-3.5 sm:p-5 lg:p-6">
          {currentView === 'dashboard' && (
            <DashboardView onNavigate={navigateTo} logs={logs} />
          )}

          {currentView === 'crypto-password' && (
            <div className="max-w-5xl mx-auto space-y-4">
              <div className="font-mono text-xs">
                <div className="text-[#F59E0B] font-bold">Cryptography / Password Generator</div>
              </div>
              <div className="bg-[#131924] border border-[#E2E8F0]/10 rounded-lg p-4 shadow-sm">
                <PasswordGenerator onShowToast={addToast} onLogEvent={logEvent} />
              </div>
            </div>
          )}

          {currentView === 'crypto-aes' && (
            <div className="max-w-5xl mx-auto space-y-4">
              <div className="font-mono text-xs">
                <div className="text-[#F59E0B] font-bold">Cryptography / AES-GCM-256 Symmetric Vault</div>
              </div>
              <div className="bg-[#131924] border border-[#E2E8F0]/10 rounded-lg p-4 shadow-sm">
                <AesVault onShowToast={addToast} onLogEvent={logEvent} />
              </div>
            </div>
          )}

          {currentView === 'integrity-hash' && (
            <div className="max-w-5xl mx-auto space-y-4">
              <div className="font-mono text-xs">
                <div className="text-[#F59E0B] font-bold">Integrity / Hash & Checksum Verifier</div>
              </div>
              <div className="bg-[#131924] border border-[#E2E8F0]/10 rounded-lg p-4 shadow-sm">
                <HashChecksum onShowToast={addToast} onLogEvent={logEvent} />
              </div>
            </div>
          )}

          {currentView === 'integrity-encoder' && (
            <div className="max-w-5xl mx-auto space-y-4">
              <div className="font-mono text-xs">
                <div className="text-[#F59E0B] font-bold">Integrity / Multi-Format Transformer</div>
              </div>
              <div className="bg-[#131924] border border-[#E2E8F0]/10 rounded-lg p-4 shadow-sm">
                <MultiEncoder onShowToast={addToast} onLogEvent={logEvent} />
              </div>
            </div>
          )}

          {currentView === 'appsec-jwt' && (
            <div className="max-w-5xl mx-auto space-y-4">
              <div className="font-mono text-xs">
                <div className="text-[#F59E0B] font-bold">AppSec / JWT Inspector</div>
              </div>
              <div className="bg-[#131924] border border-[#E2E8F0]/10 rounded-lg p-4 shadow-sm">
                <JwtInspector onShowToast={addToast} onLogEvent={logEvent} />
              </div>
            </div>
          )}

          {currentView === 'appsec-headers' && (
            <div className="max-w-5xl mx-auto space-y-4">
              <div className="font-mono text-xs">
                <div className="text-[#F59E0B] font-bold">AppSec / Security Headers Builder</div>
              </div>
              <div className="bg-[#131924] border border-[#E2E8F0]/10 rounded-lg p-4 shadow-sm">
                <SecurityHeaders onShowToast={addToast} onLogEvent={logEvent} />
              </div>
            </div>
          )}

          {currentView === 'network-cidr' && (
            <div className="max-w-5xl mx-auto space-y-4">
              <div className="font-mono text-xs">
                <div className="text-[#F59E0B] font-bold">Network / CIDR Subnet Calculator</div>
              </div>
              <div className="bg-[#131924] border border-[#E2E8F0]/10 rounded-lg p-4 shadow-sm">
                <CidrCalculator onShowToast={addToast} onLogEvent={logEvent} />
              </div>
            </div>
          )}

          {currentView === 'network-url' && (
            <div className="max-w-5xl mx-auto space-y-4">
              <div className="font-mono text-xs">
                <div className="text-[#F59E0B] font-bold">Network / URL Risk Analyzer</div>
              </div>
              <div className="bg-[#131924] border border-[#E2E8F0]/10 rounded-lg p-4 shadow-sm">
                <UrlAnalyzer onShowToast={addToast} onLogEvent={logEvent} />
              </div>
            </div>
          )}

          {currentView === 'network-mitre' && (
            <div className="max-w-5xl mx-auto space-y-4">
              <PortRiskDb />
            </div>
          )}

          {currentView === 'system-logs' && (
            <div className="max-w-5xl mx-auto space-y-4">
              <IncidentLogs
                logs={logs}
                onClearLogs={() => {
                  setLogs([]);
                  addToast('Logs cleared');
                }}
                onShowToast={addToast}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
