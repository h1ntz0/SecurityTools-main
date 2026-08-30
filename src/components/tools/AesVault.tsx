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
      setErrorMsg('Passphrase is required.');
      return;
    }

    try {
      if (mode === 'encrypt') {
        if (!plaintext) {
          setErrorMsg('Plaintext cannot be empty.');
          return;
        }
        const encrypted = await encryptAesGcm(plaintext, passphrase);
        setCiphertext(encrypted);
        onShowToast('Encrypted successfully');
        onLogEvent('AES-GCM', 'Encrypted text', 'AES-256-GCM');
      } else {
        if (!ciphertext) {
          setErrorMsg('Encrypted JSON input cannot be empty.');
          return;
        }
        const decrypted = await decryptAesGcm(ciphertext, passphrase);
        setPlaintext(decrypted);
        onShowToast('Decrypted successfully');
        onLogEvent('AES-GCM', 'Decrypted text', 'Verified tag');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Decryption failed. Incorrect passphrase or corrupted data.';
      setErrorMsg(msg);
      onShowToast('Failed to decrypt');
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
    <div className="space-y-4 font-mono text-xs">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setMode('encrypt')}
          className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
            mode === 'encrypt'
              ? 'bg-[#34D399] text-[#18181B]'
              : 'bg-[#18181B] text-[#A1A1AA] hover:text-[#F4F4F5]'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          Encrypt
        </button>
        <button
          onClick={() => setMode('decrypt')}
          className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
            mode === 'decrypt'
              ? 'bg-[#34D399] text-[#18181B]'
              : 'bg-[#18181B] text-[#A1A1AA] hover:text-[#F4F4F5]'
          }`}
        >
          <Unlock className="w-3.5 h-3.5" />
          Decrypt
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 space-y-3.5">
          <div className="space-y-1">
            <label className="text-[#A1A1AA] flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-[#34D399]" />
              Passphrase
            </label>
            <input
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="Enter secret passphrase..."
              className="w-full bg-[#18181B] border border-[#F4F4F5]/10 focus:border-[#34D399] rounded-lg p-2.5 text-[#F4F4F5] placeholder:text-[#A1A1AA]/40 focus:outline-none"
            />
          </div>

          {mode === 'encrypt' ? (
            <>
              <div className="space-y-1">
                <label className="text-[#A1A1AA]">Plaintext</label>
                <textarea
                  rows={4}
                  value={plaintext}
                  onChange={(e) => setPlaintext(e.target.value)}
                  placeholder="Enter text to encrypt..."
                  className="w-full bg-[#18181B] border border-[#F4F4F5]/10 focus:border-[#34D399] rounded-lg p-2.5 text-[#F4F4F5] placeholder:text-[#A1A1AA]/40 focus:outline-none resize-y"
                />
              </div>

              <button
                onClick={handleProcess}
                className="w-full py-2 rounded bg-[#34D399] hover:bg-[#34D399]/90 text-[#18181B] font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                Encrypt
              </button>

              {ciphertext && (
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[#A1A1AA]">Encrypted JSON Output</label>
                    <button
                      onClick={() => handleCopy(ciphertext)}
                      className="text-[#34D399] hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre className="p-3 bg-[#18181B] border border-[#F4F4F5]/10 rounded-lg text-[#34D399] text-[11px] overflow-x-auto max-h-48 select-all">
                    {ciphertext}
                  </pre>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="space-y-1">
                <label className="text-[#A1A1AA]">Encrypted JSON Input</label>
                <textarea
                  rows={4}
                  value={ciphertext}
                  onChange={(e) => setCiphertext(e.target.value)}
                  placeholder='Paste JSON output here...'
                  className="w-full bg-[#18181B] border border-[#F4F4F5]/10 focus:border-[#34D399] rounded-lg p-2.5 text-[#F4F4F5] placeholder:text-[#A1A1AA]/40 focus:outline-none resize-y text-[11px]"
                />
              </div>

              <button
                onClick={handleProcess}
                className="w-full py-2 rounded bg-[#34D399] hover:bg-[#34D399]/90 text-[#18181B] font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Unlock className="w-3.5 h-3.5" />
                Decrypt
              </button>

              {plaintext && (
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[#A1A1AA]">Decrypted Plaintext</label>
                    <button
                      onClick={() => handleCopy(plaintext)}
                      className="text-[#34D399] hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <div className="p-3 bg-[#18181B] border border-[#F4F4F5]/10 rounded-lg text-[#F4F4F5] text-xs select-all break-all whitespace-pre-wrap">
                    {plaintext}
                  </div>
                </div>
              )}
            </>
          )}

          {errorMsg && (
            <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-3">
          <div className="bg-[#18181B] border border-[#F4F4F5]/10 rounded-lg p-4 space-y-2.5">
            <div className="flex items-center gap-1.5 pb-2 border-b border-[#F4F4F5]/10 text-[#F4F4F5] font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#34D399]" />
              Details
            </div>
            <div className="space-y-1.5 text-[11px] text-[#A1A1AA]">
              <div className="flex justify-between">
                <span>Cipher:</span>
                <span className="text-[#34D399]">AES-GCM 256-bit</span>
              </div>
              <div className="flex justify-between">
                <span>Tag:</span>
                <span className="text-[#F4F4F5]">128-bit GMAC</span>
              </div>
              <div className="flex justify-between">
                <span>KDF:</span>
                <span className="text-[#F4F4F5]">PBKDF2-HMAC-SHA256</span>
              </div>
              <div className="flex justify-between">
                <span>Iterations:</span>
                <span className="text-[#F4F4F5]">100,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
