import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Smartphone, Copy, ExternalLink, RefreshCw } from 'lucide-react';

interface MobileQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const MobileQrModal: React.FC<MobileQrModalProps> = ({ isOpen, onClose, onShowToast }) => {
  const [networkIp, setNetworkIp] = useState<string>('172.26.152.83');
  const [port, setPort] = useState<string>('5173');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      setNetworkIp(window.location.hostname);
    }
    if (typeof window !== 'undefined' && window.location.port) {
      setPort(window.location.port);
    }
  }, []);

  const activeUrl = `http://${networkIp}:${port}`;

  useEffect(() => {
    if (!isOpen) return;

    QRCode.toDataURL(activeUrl, {
      width: 260,
      margin: 2,
      color: {
        dark: '#34D399',
        light: '#18181B'
      },
      errorCorrectionLevel: 'M'
    })
      .then((url) => {
        setQrDataUrl(url);
      })
      .catch((err) => {
        console.error('QR code generation error:', err);
      });
  }, [isOpen, activeUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeUrl);
    onShowToast(`URL copied: ${activeUrl}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-[#18181B] border border-[#34D399]/60 rounded-xl p-6 shadow-2xl shadow-[#34D399]/15">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#F4F4F5]/50 hover:text-[#F4F4F5] transition-colors p-1.5 rounded-lg hover:bg-[#F4F4F5]/10 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-[#34D399]/10 border border-[#34D399]/30 flex items-center justify-center text-[#34D399]">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-mono font-bold text-base text-[#F4F4F5] tracking-tight">Buka di HP / Mobile Access</h3>
            <p className="text-xs text-[#F4F4F5]/60 font-sans">Scan QR code pakai kamera HP dalam jaringan Wi-Fi yang sama</p>
          </div>
        </div>

        {/* QR Code Canvas Display */}
        <div className="flex flex-col items-center justify-center p-5 bg-[#27272A] border border-[#F4F4F5]/10 rounded-xl mb-5">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="Scan for Mobile Access"
              className="w-56 h-56 rounded-lg border border-[#34D399]/40 p-2 bg-[#18181B]"
            />
          ) : (
            <div className="w-56 h-56 flex items-center justify-center text-xs font-mono text-[#F4F4F5]/40">
              <RefreshCw className="w-5 h-5 animate-spin text-[#34D399] mr-2" />
              Generating QR...
            </div>
          )}
          <div className="mt-3 flex items-center gap-2 text-xs font-mono text-[#34D399]">
            <span className="w-2 h-2 rounded-full bg-[#34D399] animate-ping" />
            Live Network URL
          </div>
        </div>

        {/* Connection Details & URL input */}
        <div className="space-y-3 font-mono text-xs">
          <div>
            <label className="text-[#F4F4F5]/60 mb-1 block">LAN Direct URL</label>
            <div className="flex items-center gap-2 bg-[#27272A] border border-[#F4F4F5]/15 rounded-lg p-2.5">
              <span className="text-[#34D399] font-semibold truncate flex-1">{activeUrl}</span>
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 rounded bg-[#F4F4F5]/10 hover:bg-[#34D399] hover:text-[#18181B] text-[#F4F4F5] transition-all flex items-center gap-1 font-sans font-medium cursor-pointer"
                title="Copy URL"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy
              </button>
              <a
                href={activeUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1 rounded text-[#F4F4F5]/60 hover:text-[#F4F4F5] transition-colors cursor-pointer"
                title="Open in new tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <label className="text-[#F4F4F5]/50 text-[11px] mb-1 block">Host IP (LAN)</label>
              <input
                type="text"
                value={networkIp}
                onChange={(e) => setNetworkIp(e.target.value)}
                className="w-full bg-[#27272A] border border-[#F4F4F5]/15 rounded-lg px-2.5 py-1.5 text-[#F4F4F5] text-xs focus:border-[#34D399] focus:outline-none"
                placeholder="192.168.1.x"
              />
            </div>
            <div>
              <label className="text-[#F4F4F5]/50 text-[11px] mb-1 block">Port</label>
              <input
                type="text"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                className="w-full bg-[#27272A] border border-[#F4F4F5]/15 rounded-lg px-2.5 py-1.5 text-[#F4F4F5] text-xs focus:border-[#34D399] focus:outline-none"
                placeholder="5173"
              />
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-5 pt-4 border-t border-[#F4F4F5]/10 flex items-center justify-between text-xs text-[#F4F4F5]/50 font-mono">
          <span>Vite (`--host 0.0.0.0`)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#F4F4F5]/10 hover:bg-[#F4F4F5]/20 text-[#F4F4F5] font-medium transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
