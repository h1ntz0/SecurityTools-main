import React, { useState } from 'react';
import { Lock, Unlock, Copy, Check, Key, ShieldCheck, AlertCircle } from 'lucide-react';
import { encryptAesGcm, decryptAesGcm } from '../../utils/aes';

interface AesVaultProps {
  onShowToast: (msg: string) => void;
  onLogEvent: (tool: string, action: string, details?: string) => void;
}

export const AesVault: React.FC<AesVaultProps> = ({ onShowToast, onLogEvent }) => {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [plaintext, setPlaintext] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleProcess = async () => {
    setErrorMsg('');
    if (!passphrase) {
      setErrorMsg('Secret passphrase is required for key derivation.');
      return;
    }

    try {
      if (mode === 'encrypt') {
        if (!plaintext) {
          setErrorMsg('Plaintext payload cannot be empty.');
          return;
        }
        const encrypted = await encryptAesGcm(plaintext, passphrase);
        setCiphertext(encrypted);
        onShowToast('Encrypted with AES-GCM-256 (100k PBKDF2 iterations)');
        onLogEvent('AES Vault', 'Encrypted Payload', 'AES-GCM 256-bit');
      } else {
        if (!ciphertext) {
          setErrorMsg('Ciphertext envelope JSON cannot be empty.');
          return;
        }
        const decrypted = await decryptAesGcm(ciphertext, passphrase);
        setPlaintext(decrypted);
        onShowToast('Ciphertext successfully authenticated & decrypted');
        onLogEvent('AES Vault', 'Decrypted Payload', 'AES-GCM Authentication verified');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Decryption failed. Check passphrase or data integrity.';
      setErrorMsg(msg);
      onShowToast('Operation failed');
    }
  };

  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Mode Switcher */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setMode('encrypt')}
          className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
            mode === 'encrypt'
              ? 'bg-[#F59E0B] text-[#0B0F17] shadow-md shadow-[#F59E0B]/20'
              : 'bg-[#131924] text-[#E2E8F0]/70 hover:text-[#E2E8F0] border border-[#E2E8F0]/10'
          }`}
        >
          <Lock className="w-4 h-4" />
          Encrypt (AES-GCM-256)
        </button>
        <button
          onClick={() => setMode('decrypt')}
          className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
            mode === 'decrypt'
              ? 'bg-[#F59E0B] text-[#0B0F17] shadow-md shadow-[#F59E0B]/20'
              : 'bg-[#131924] text-[#E2E8F0]/70 hover:text-[#E2E8F0] border border-[#E2E8F0]/10'
          }`}
        >
          <Unlock className="w-4 h-4" />
          Decrypt & Authenticate
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Work Area */}
        <div className="lg:col-span-8 space-y-4">
          {/* Passphrase Input */}
          <div className="space-y-1.5">
            <label className="text-[#E2E8F0]/60 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-[#F59E0B]" />
              Master Encryption Passphrase (PBKDF2 SHA-256 derived)
            </label>
            <input
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="Enter strong passphrase..."
              className="w-full bg-[#131924] border border-[#E2E8F0]/15 focus:border-[#F59E0B] rounded-xl p-3 text-[#E2E8F0] placeholder:text-[#E2E8F0]/30 focus:outline-none"
            />
          </div>

          {/* Plaintext / Ciphertext Inputs */}
          {mode === 'encrypt' ? (
            <>
              <div className="space-y-1.5">
                <label className="text-[#E2E8F0]/60">Plaintext Secret Payload</label>
                <textarea
                  rows={4}
                  value={plaintext}
                  onChange={(e) => setPlaintext(e.target.value)}
                  placeholder="Enter private message, API keys, credentials, or config JSON..."
                  className="w-full bg-[#131924] border border-[#E2E8F0]/15 focus:border-[#F59E0B] rounded-xl p-3 text-[#E2E8F0] placeholder:text-[#E2E8F0]/30 focus:outline-none resize-y"
                />
              </div>

              <button
                onClick={handleProcess}
                className="w-full py-2.5 rounded-lg bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-[#0B0F17] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer shadow-md shadow-[#F59E0B]/15"
              >
                <Lock className="w-4 h-4" />
                Encrypt to Sealed Envelope
              </button>

              {ciphertext && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[#E2E8F0]/60">Encrypted Envelope JSON</label>
                    <button
                      onClick={() => handleCopy(ciphertext)}
                      className="text-[#F59E0B] hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-[#F59E0B]" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied' : 'Copy Envelope'}
                    </button>
                  </div>
                  <pre className="p-3 bg-[#131924] border border-[#F59E0B]/30 rounded-xl text-[#F59E0B] text-[11px] overflow-x-auto max-h-56 select-all">
                    {ciphertext}
                  </pre>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="space-y-1.5">
                <label className="text-[#E2E8F0]/60">Encrypted Envelope JSON Input</label>
                <textarea
                  rows={4}
                  value={ciphertext}
                  onChange={(e) => setCiphertext(e.target.value)}
                  placeholder='Paste {"version":"1.0","algorithm":"AES-GCM-256",...} envelope JSON here...'
                  className="w-full bg-[#131924] border border-[#E2E8F0]/15 focus:border-[#F59E0B] rounded-xl p-3 text-[#E2E8F0] placeholder:text-[#E2E8F0]/30 focus:outline-none resize-y text-[11px]"
                />
              </div>

              <button
                onClick={handleProcess}
                className="w-full py-2.5 rounded-lg bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-[#0B0F17] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer shadow-md shadow-[#F59E0B]/15"
              >
                <Unlock className="w-4 h-4" />
                Decrypt & Verify Tag
              </button>

              {plaintext && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[#E2E8F0]/60">Authenticated Decrypted Plaintext</label>
                    <button
                      onClick={() => handleCopy(plaintext)}
                      className="text-[#F59E0B] hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-[#F59E0B]" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <div className="p-3.5 bg-[#131924] border border-[#F59E0B]/40 rounded-xl text-[#E2E8F0] text-xs select-all break-all whitespace-pre-wrap">
                    {plaintext}
                  </div>
                </div>
              )}
            </>
          )}

          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/40 rounded-xl text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Security Info Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#131924] border border-[#E2E8F0]/10 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E2E8F0]/10 text-[#E2E8F0] font-bold">
              <ShieldCheck className="w-4 h-4 text-[#F59E0B]" />
              Cryptographic Specs
            </div>
            <div className="space-y-2 text-[11px] text-[#E2E8F0]/70">
              <div className="flex justify-between">
                <span className="text-[#E2E8F0]/40">Cipher:</span>
                <span className="text-[#F59E0B] font-semibold">AES-GCM 256-bit</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#E2E8F0]/40">Auth Tag:</span>
                <span className="text-[#E2E8F0]">128-bit GMAC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#E2E8F0]/40">KDF:</span>
                <span className="text-[#E2E8F0]">PBKDF2-HMAC-SHA256</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#E2E8F0]/40">KDF Rounds:</span>
                <span className="text-[#E2E8F0]">100,000 iterations</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#E2E8F0]/40">Salt & IV:</span>
                <span className="text-[#E2E8F0]">16B Salt / 12B IV (CSPRNG)</span>
              </div>
            </div>
            <div className="pt-2 border-t border-[#E2E8F0]/10 text-[11px] text-[#E2E8F0]/50 leading-relaxed font-sans">
              Authenticates ciphertext integrity before releasing decrypted plaintext, preventing bit-flipping attacks.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
