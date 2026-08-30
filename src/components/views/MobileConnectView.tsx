import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Wifi, Copy, ExternalLink, Check, Server, RefreshCw, AlertCircle } from 'lucide-react';

interface MobileConnectViewProps {
  onShowToast: (msg: string) => void;
}

export const MobileConnectView: React.FC<MobileConnectViewProps> = ({ onShowToast }) => {
  const [hostIp, setHostIp] = useState('192.168.1.16');
  const [port, setPort] = useState('7777');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const activeUrl = `http://${hostIp}:${port}`;

  useEffect(() => {
    QRCode.toDataURL(activeUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: '#00FF94',
        light: '#0A0F1A'
      },
      errorCorrectionLevel: 'M'
    })
      .then((url) => {
        setQrDataUrl(url);
      })
      .catch((err) => {
        console.error('QR generation error:', err);
      });
  }, [activeUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeUrl);
    setCopied(true);
    onShowToast(`URL copied: ${activeUrl}`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-mono text-xs">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-[#00FF94] text-xs font-semibold uppercase tracking-wider mb-1">
          <Wifi className="w-4 h-4" />
          Wi-Fi & LAN Mobile Synchronization
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white">Mobile Access & Nginx Wi-Fi Gateway</h2>
        <p className="text-xs text-white/60 font-sans mt-1">
          Access the security suite on your smartphone over local Wi-Fi without cloud reliance or external traffic egress.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* QR Code Column */}
        <div className="lg:col-span-5 bg-[#111827] border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-xl">
          <div className="p-3 bg-[#0A0F1A] border border-[#00FF94]/40 rounded-xl mb-4 shadow-inner">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Scan with mobile camera"
                className="w-64 h-64 rounded-lg bg-[#0A0F1A]"
              />
            ) : (
              <div className="w-64 h-64 flex items-center justify-center text-white/40">
                <RefreshCw className="w-6 h-6 animate-spin text-[#00FF94] mr-2" />
                Generating QR...
              </div>
            )}
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00FF94]/10 border border-[#00FF94]/30 text-[#00FF94] font-semibold text-[11px] mb-2">
            <span className="w-2 h-2 rounded-full bg-[#00FF94] animate-ping" />
            Live Nginx Wi-Fi Gateway Active
          </div>

          <p className="text-white/50 text-[11px] font-sans">
            Arahkan kamera HP ke QR Code di atas untuk membuka aplikasi secara instan.
          </p>
        </div>

        {/* Configuration & Troubleshooting Column */}
        <div className="lg:col-span-7 space-y-4">
          {/* Active URL Card */}
          <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span>Target Wi-Fi URL</span>
              <span className="text-[#00FF94] flex items-center gap-1 text-[11px]">
                <Server className="w-3.5 h-3.5" /> Nginx :7777
              </span>
            </div>

            <div className="flex items-center gap-2 bg-[#0A0F1A] border border-[#00FF94]/30 rounded-xl p-3">
              <span className="text-[#00FF94] font-bold text-sm truncate flex-1">{activeUrl}</span>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-[#00FF94]/15 hover:bg-[#00FF94] text-[#00FF94] hover:text-[#0A0F1A] font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <a
                href={activeUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg text-white/60 hover:text-white transition-colors"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Quick IP Presets */}
            <div className="pt-2">
              <span className="text-white/50 text-[11px] block mb-2">Pilih IP Sesuai Jaringan:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setHostIp('192.168.1.16')}
                  className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold transition-all cursor-pointer ${
                    hostIp === '192.168.1.16'
                      ? 'bg-[#00FF94] text-[#0A0F1A] border-[#00FF94]'
                      : 'bg-[#0A0F1A] text-white/70 border-white/10 hover:border-white/20'
                  }`}
                >
                  Wi-Fi LAN IP (192.168.1.16)
                </button>
                <button
                  onClick={() => setHostIp('172.26.152.83')}
                  className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold transition-all cursor-pointer ${
                    hostIp === '172.26.152.83'
                      ? 'bg-[#00FF94] text-[#0A0F1A] border-[#00FF94]'
                      : 'bg-[#0A0F1A] text-white/70 border-white/10 hover:border-white/20'
                  }`}
                >
                  WSL2 Internal (172.26.152.83)
                </button>
              </div>
            </div>

            {/* Port selector */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-white/50 text-[11px] mb-1 block">Custom Host IP</label>
                <input
                  type="text"
                  value={hostIp}
                  onChange={(e) => setHostIp(e.target.value)}
                  className="w-full bg-[#0A0F1A] border border-white/15 focus:border-[#00FF94] rounded-lg p-2 text-white focus:outline-none text-xs"
                />
              </div>
              <div>
                <label className="text-white/50 text-[11px] mb-1 block">Port</label>
                <input
                  type="text"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  className="w-full bg-[#0A0F1A] border border-white/15 focus:border-[#00FF94] rounded-lg p-2 text-white focus:outline-none text-xs"
                />
              </div>
            </div>
          </div>

          {/* Quick Troubleshooting Guide */}
          <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 space-y-3 font-sans">
            <div className="flex items-center gap-2 font-mono font-bold text-white text-xs">
              <AlertCircle className="w-4 h-4 text-[#00FF94]" />
              Panduan Akses HP via Wi-Fi:
            </div>
            <ol className="list-decimal list-inside space-y-2 text-xs text-white/70 leading-relaxed">
              <li>Pastikan HP terhubung ke <strong>Wi-Fi yang sama</strong> dengan laptop/PC.</li>
              <li>
                Jika menggunakan Windows WSL2, buka <strong>PowerShell as Administrator</strong> dan jalankan perintah port forwarding ini jika belum aktif:
                <pre className="mt-1.5 p-2.5 bg-[#0A0F1A] border border-white/10 rounded-lg text-[#00FF94] font-mono text-[11px] overflow-x-auto select-all">
                  netsh interface portproxy add v4tov4 listenport=7777 listenaddress=0.0.0.0 connectport=7777 connectaddress=172.26.152.83
                </pre>
              </li>
              <li>Buka kamera bawaan di HP atau browser Chrome/Safari, arahkan ke QR Code di sebelah kiri.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
