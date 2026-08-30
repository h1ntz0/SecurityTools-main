import React, { useState, useEffect } from 'react';
import { Network, RotateCcw } from 'lucide-react';
import { calculateCidr } from '../../utils/cidr';
import { SubnetResult } from '../../types';

const SAMPLE_CIDR = '192.168.1.0/24';

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
    <div className="space-y-4 font-mono text-xs">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[#A1A1AA]">IPv4 CIDR Block</label>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-[#A1A1AA]/60">Presets:</span>
              <button onClick={() => handleLoadSample('10.0.0.0/8')} className="text-[#34D399] hover:underline cursor-pointer">/8</button>
              <button onClick={() => handleLoadSample('172.16.0.0/16')} className="text-[#34D399] hover:underline cursor-pointer">/16</button>
              <button onClick={() => handleLoadSample('192.168.1.0/24')} className="text-[#34D399] hover:underline cursor-pointer">/24</button>
              <button onClick={() => handleLoadSample('192.168.1.0/28')} className="text-[#34D399] hover:underline cursor-pointer">/28</button>
            </div>
            {cidrInput && (
              <button
                onClick={handleClear}
                className="text-[#A1A1AA] hover:text-[#F4F4F5] flex items-center gap-1 text-[11px] cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Clear
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 bg-[#18181B] border border-[#F4F4F5]/10 focus-within:border-[#34D399] rounded-lg p-2.5">
          <Network className="w-4 h-4 text-[#34D399] shrink-0" />
          <input
            type="text"
            value={cidrInput}
            onChange={(e) => setCidrInput(e.target.value)}
            placeholder="192.168.1.0/24..."
            className="w-full bg-transparent text-xs text-[#F4F4F5] placeholder:text-[#A1A1AA]/40 focus:outline-none"
          />
        </div>
      </div>

      {subnet ? (
        <div className="space-y-3.5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 bg-[#18181B] border border-[#F4F4F5]/10 rounded-lg text-xs">
            <div>
              <div className="text-[#A1A1AA] text-[10px]">Usable Hosts</div>
              <div className="text-[#34D399] font-bold text-sm">
                {subnet.usableHosts.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-[#A1A1AA] text-[10px]">Total IPs</div>
              <div className="text-[#F4F4F5] font-bold text-sm">
                {subnet.totalHosts.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-[#A1A1AA] text-[10px]">Prefix</div>
              <div className="text-[#F4F4F5] font-bold text-sm">/{subnet.prefix}</div>
            </div>
            <div>
              <div className="text-[#A1A1AA] text-[10px]">Class</div>
              <div className="text-[#F4F4F5] font-medium">{subnet.ipClass}</div>
            </div>
          </div>

          <div className="bg-[#18181B] border border-[#F4F4F5]/10 rounded-lg overflow-hidden text-xs">
            <div className="divide-y divide-white/5">
              <div className="grid grid-cols-1 sm:grid-cols-4 p-2.5 gap-1">
                <span className="text-[#A1A1AA]">Network Address:</span>
                <span className="sm:col-span-3 text-[#34D399] font-medium">{subnet.network}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 p-2.5 gap-1">
                <span className="text-[#A1A1AA]">Netmask:</span>
                <span className="sm:col-span-3 text-[#F4F4F5] font-medium">{subnet.netmask}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 p-2.5 gap-1">
                <span className="text-[#A1A1AA]">Broadcast:</span>
                <span className="sm:col-span-3 text-[#F4F4F5]">{subnet.broadcast}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 p-2.5 gap-1">
                <span className="text-[#A1A1AA]">First Usable Host:</span>
                <span className="sm:col-span-3 text-[#F4F4F5]">{subnet.firstHost}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 p-2.5 gap-1">
                <span className="text-[#A1A1AA]">Last Usable Host:</span>
                <span className="sm:col-span-3 text-[#F4F4F5]">{subnet.lastHost}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 p-2.5 gap-1">
                <span className="text-[#A1A1AA]">Wildcard Mask:</span>
                <span className="sm:col-span-3 text-[#A1A1AA]">{subnet.wildcard}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 p-2.5 gap-1">
                <span className="text-[#A1A1AA]">Binary Netmask:</span>
                <span className="sm:col-span-3 text-[#A1A1AA]">{subnet.binaryMask}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 text-center bg-[#18181B] border border-[#F4F4F5]/10 rounded-lg text-xs text-[#A1A1AA]">
          Enter an IPv4 CIDR string (e.g. 192.168.1.0/24) to calculate subnet values.
        </div>
      )}
    </div>
  );
};
