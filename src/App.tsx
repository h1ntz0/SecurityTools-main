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
      action: 'Session started',
      details: 'Ready'
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

  // Keyboard Shortcuts (Ctrl+K, Ctrl+0..8)
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
    <div className="min-h-screen bg-[#18181B] text-[#F4F4F5] flex selection:bg-[#34D399]/20 selection:text-[#34D399]">
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
        className={`flex-1 flex flex-col min-w-0 transition-all duration-150 ${
          sidebarOpen ? 'md:ml-56' : 'md:ml-14'
        }`}
      >
        <TopHeader
          currentView={currentView}
          onOpenCmd={() => setCmdOpen(true)}
          onMobileMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        <main className="flex-1 p-3.5 sm:p-5 max-w-5xl w-full mx-auto">
          {currentView === 'dashboard' && (
            <DashboardView onNavigate={navigateTo} logs={logs} />
          )}

          {currentView === 'crypto-password' && (
            <div className="space-y-3">
              <div className="font-mono text-xs">
                <div className="text-[#34D399] font-medium">Password Generator</div>
              </div>
              <div className="bg-[#27272A] border border-[#F4F4F5]/10 rounded-lg p-4">
                <PasswordGenerator onShowToast={addToast} onLogEvent={logEvent} />
              </div>
            </div>
          )}

          {currentView === 'crypto-aes' && (
            <div className="space-y-3">
              <div className="font-mono text-xs">
                <div className="text-[#34D399] font-medium">AES-GCM Encryption & Decryption</div>
              </div>
              <div className="bg-[#27272A] border border-[#F4F4F5]/10 rounded-lg p-4">
                <AesVault onShowToast={addToast} onLogEvent={logEvent} />
              </div>
            </div>
          )}

          {currentView === 'integrity-hash' && (
            <div className="space-y-3">
              <div className="font-mono text-xs">
                <div className="text-[#34D399] font-medium">Hash & Checksum Verifier</div>
              </div>
              <div className="bg-[#27272A] border border-[#F4F4F5]/10 rounded-lg p-4">
                <HashChecksum onShowToast={addToast} onLogEvent={logEvent} />
              </div>
            </div>
          )}

          {currentView === 'integrity-encoder' && (
            <div className="space-y-3">
              <div className="font-mono text-xs">
                <div className="text-[#34D399] font-medium">Multi-Format Encoder / Decoder</div>
              </div>
              <div className="bg-[#27272A] border border-[#F4F4F5]/10 rounded-lg p-4">
                <MultiEncoder onShowToast={addToast} onLogEvent={logEvent} />
              </div>
            </div>
          )}

          {currentView === 'appsec-jwt' && (
            <div className="space-y-3">
              <div className="font-mono text-xs">
                <div className="text-[#34D399] font-medium">JWT Decoder</div>
              </div>
              <div className="bg-[#27272A] border border-[#F4F4F5]/10 rounded-lg p-4">
                <JwtInspector onShowToast={addToast} onLogEvent={logEvent} />
              </div>
            </div>
          )}

          {currentView === 'appsec-headers' && (
            <div className="space-y-3">
              <div className="font-mono text-xs">
                <div className="text-[#34D399] font-medium">Security Headers Generator</div>
              </div>
              <div className="bg-[#27272A] border border-[#F4F4F5]/10 rounded-lg p-4">
                <SecurityHeaders onShowToast={addToast} onLogEvent={logEvent} />
              </div>
            </div>
          )}

          {currentView === 'network-cidr' && (
            <div className="space-y-3">
              <div className="font-mono text-xs">
                <div className="text-[#34D399] font-medium">Subnet Calculator</div>
              </div>
              <div className="bg-[#27272A] border border-[#F4F4F5]/10 rounded-lg p-4">
                <CidrCalculator onShowToast={addToast} onLogEvent={logEvent} />
              </div>
            </div>
          )}

          {currentView === 'network-url' && (
            <div className="space-y-3">
              <div className="font-mono text-xs">
                <div className="text-[#34D399] font-medium">URL Analyzer</div>
              </div>
              <div className="bg-[#27272A] border border-[#F4F4F5]/10 rounded-lg p-4">
                <UrlAnalyzer onShowToast={addToast} onLogEvent={logEvent} />
              </div>
            </div>
          )}

          {currentView === 'network-mitre' && (
            <div className="space-y-3">
              <PortRiskDb />
            </div>
          )}

          {currentView === 'system-logs' && (
            <div className="space-y-3">
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
