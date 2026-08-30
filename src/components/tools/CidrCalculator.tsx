import React, { useState, useEffect } from 'react';
import { Network, RotateCcw } from 'lucide-react';
import { calculateCidr } from '../../utils/cidr';
import { SubnetResult } from '../../types';

const SAMPLE_CIDR = '192.168.10.0/24';

interface CidrCalculatorProps {
  onShowToast: (msg: string) => void;
  onLogEvent: (tool: string, action: string, details?: string) => void;
}

export const CidrCalculator: React.FC<CidrCalculatorProps> = ({ onShowToast, onLogEvent }) => {
  const [cidrInput, setCidrInput] = useState<string>(SAMPLE_CIDR);
  const [subnet, setSubnet] = useState<SubnetResult | null>(null);

  useEffect(() => {
    if (!cidrInput.trim()) {
      setSubnet(null);
      return;
    }
    const res = calculateCidr(cidrInput);
    setSubnet(res);
  }, [cidrInput]);

  const handleLoadSample = (sample: string) => {
    setCidrInput(sample);
    onShowToast(`Subnet ${sample} loaded`);
    onLogEvent('CIDR', `Evaluated CIDR block ${sample}`);
  };

  const handleClear = () => {
    setCidrInput('');
    setSubnet(null);
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Input Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label className="text-[#E2E8F0]/60">IPv4 CIDR Block Notation</label>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-[#E2E8F0]/40">Presets:</span>
              <button
                onClick={() => handleLoadSample('10.0.0.0/8')}
                className="text-[#F59E0B] hover:underline cursor-pointer"
              >
                /8
              </button>
              <button
                onClick={() => handleLoadSample('172.16.0.0/16')}
                className="text-[#F59E0B] hover:underline cursor-pointer"
              >
                /16
              </button>
              <button
                onClick={() => handleLoadSample('192.168.1.0/24')}
                className="text-[#F59E0B] hover:underline cursor-pointer"
              >
                /24
              </button>
              <button
                onClick={() => handleLoadSample('192.168.10.128/28')}
                className="text-[#F59E0B] hover:underline cursor-pointer"
              >
                /28
              </button>
            </div>
            {cidrInput && (
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
          <Network className="w-5 h-5 text-[#F59E0B] shrink-0" />
          <input
            type="text"
            value={cidrInput}
            onChange={(e) => setCidrInput(e.target.value)}
            placeholder="192.168.1.0/24..."
            className="w-full bg-transparent text-xs sm:text-sm text-[#E2E8F0] placeholder:text-[#E2E8F0]/30 focus:outline-none"
          />
        </div>
      </div>

      {/* Subnet Calculation Matrix */}
      {subnet ? (
        <div className="space-y-5">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#131924] border border-[#E2E8F0]/10 rounded-xl text-xs">
            <div className="space-y-1">
              <div className="text-[#E2E8F0]/50 text-[10px]">Usable Host IPs</div>
              <div className="text-[#F59E0B] font-bold text-sm sm:text-base">
                {subnet.usableHosts.toLocaleString()}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-[#E2E8F0]/50 text-[10px]">Total IP Capacity</div>
              <div className="text-[#E2E8F0] font-bold text-sm sm:text-base">
                {subnet.totalHosts.toLocaleString()}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-[#E2E8F0]/50 text-[10px]">Prefix Mask</div>
              <div className="text-[#E2E8F0] font-bold text-sm sm:text-base">/{subnet.prefix}</div>
            </div>
            <div className="space-y-1">
              <div className="text-[#E2E8F0]/50 text-[10px]">Address Class</div>
              <div className="text-[#E2E8F0] truncate font-medium">{subnet.ipClass}</div>
            </div>
          </div>

          {/* Subnet Details Table */}
          <div className="bg-[#131924] border border-[#E2E8F0]/10 rounded-xl overflow-hidden text-xs">
            <div className="px-4 py-3 border-b border-[#E2E8F0]/10 font-bold text-[#E2E8F0] uppercase tracking-wider text-[11px] bg-[#0B0F17]">
              Subnet Boundary Allocation
            </div>
            <div className="divide-y divide-white/5">
              <div className="grid grid-cols-1 sm:grid-cols-4 p-3 gap-2">
                <span className="text-[#E2E8F0]/50">Network Address:</span>
                <span className="sm:col-span-3 text-[#F59E0B] font-semibold">{subnet.network}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 p-3 gap-2">
                <span className="text-[#E2E8F0]/50">Subnet Netmask:</span>
                <span className="sm:col-span-3 text-[#E2E8F0] font-semibold">{subnet.netmask}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 p-3 gap-2">
                <span className="text-[#E2E8F0]/50">Broadcast Address:</span>
                <span className="sm:col-span-3 text-[#E2E8F0]">{subnet.broadcast}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 p-3 gap-2">
                <span className="text-[#E2E8F0]/50">First Usable Host:</span>
                <span className="sm:col-span-3 text-[#E2E8F0]">{subnet.firstHost}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 p-3 gap-2">
                <span className="text-[#E2E8F0]/50">Last Usable Host:</span>
                <span className="sm:col-span-3 text-[#E2E8F0]">{subnet.lastHost}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 p-3 gap-2">
                <span className="text-[#E2E8F0]/50">Wildcard Mask:</span>
                <span className="sm:col-span-3 text-[#E2E8F0]/80">{subnet.wildcard}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 p-3 gap-2">
                <span className="text-[#E2E8F0]/50">Binary Netmask:</span>
                <span className="sm:col-span-3 text-[#E2E8F0]/70 font-mono tracking-wider">{subnet.binaryMask}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-[#131924] border border-[#E2E8F0]/10 rounded-xl text-xs text-[#E2E8F0]/40">
          Enter an IPv4 CIDR string (e.g. 192.168.1.0/24) to calculate network boundaries.
        </div>
      )}
    </div>
  );
};
