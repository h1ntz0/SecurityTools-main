import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { MITRE_PORT_DATABASE } from '../data/mitrePorts';
import { RiskLevel, PortRecord } from '../types';

export const PortRiskDb: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel>('ALL');

  const filteredPorts = useMemo(() => {
    return MITRE_PORT_DATABASE.filter((item) => {
      const matchesRisk = selectedRisk === 'ALL' || item.risk === selectedRisk;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        item.port.toString().includes(q) ||
        item.service.toLowerCase().includes(q) ||
        item.proto.toLowerCase().includes(q) ||
        item.vector.toLowerCase().includes(q);

      return matchesRisk && matchesQuery;
    });
  }, [searchQuery, selectedRisk]);

  const riskCounts = useMemo(() => {
    return {
      ALL: MITRE_PORT_DATABASE.length,
      CRITICAL: MITRE_PORT_DATABASE.filter((p) => p.risk === 'CRITICAL').length,
      HIGH: MITRE_PORT_DATABASE.filter((p) => p.risk === 'HIGH').length,
      MEDIUM: MITRE_PORT_DATABASE.filter((p) => p.risk === 'MEDIUM').length,
      LOW: MITRE_PORT_DATABASE.filter((p) => p.risk === 'LOW').length
    };
  }, []);

  const getRiskBadge = (risk: PortRecord['risk']) => {
    switch (risk) {
      case 'CRITICAL':
        return 'bg-red-500/15 text-red-400 border-red-500/30';
      case 'HIGH':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'MEDIUM':
        return 'bg-[#F4F4F5]/10 text-[#A1A1AA] border-[#F4F4F5]/10';
      case 'LOW':
        return 'bg-[#34D399]/15 text-[#34D399] border-[#34D399]/30';
    }
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-[#A1A1AA] absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search port or service (e.g. 445, SSH, Redis)..."
            className="w-full bg-[#18181B] border border-[#F4F4F5]/10 focus:border-[#34D399] rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-[#F4F4F5] placeholder:text-[#A1A1AA]/40 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as RiskLevel[]).map((level) => (
            <button
              key={level}
              onClick={() => setSelectedRisk(level)}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                selectedRisk === level
                  ? 'bg-[#34D399] text-[#18181B]'
                  : 'bg-[#18181B] text-[#A1A1AA] hover:text-[#F4F4F5]'
              }`}
            >
              <span>{level}</span>
              <span className="text-[10px] opacity-70">({riskCounts[level]})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#18181B] border border-[#F4F4F5]/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[550px]">
            <thead>
              <tr className="bg-[#27272A] border-b border-[#F4F4F5]/10 text-[#A1A1AA] text-[11px]">
                <th className="py-2.5 px-3 font-medium w-20">Port</th>
                <th className="py-2.5 px-3 font-medium w-32">Service</th>
                <th className="py-2.5 px-3 font-medium w-20">Proto</th>
                <th className="py-2.5 px-3 font-medium w-24">Risk</th>
                <th className="py-2.5 px-3 font-medium">Common Vector / Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredPorts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-[#A1A1AA]/50">
                    No ports match your search.
                  </td>
                </tr>
              ) : (
                filteredPorts.map((item) => (
                  <tr key={`${item.port}-${item.proto}`} className="hover:bg-[#F4F4F5]/[0.02]">
                    <td className="py-2.5 px-3 font-semibold text-[#34D399]">{item.port}</td>
                    <td className="py-2.5 px-3 text-[#F4F4F5]">{item.service}</td>
                    <td className="py-2.5 px-3 text-[#A1A1AA] text-[11px]">{item.proto}</td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-block px-1.5 py-0.2 rounded border text-[10px] uppercase font-semibold ${getRiskBadge(item.risk)}`}>
                        {item.risk}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[#A1A1AA] font-sans text-xs">{item.vector}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
