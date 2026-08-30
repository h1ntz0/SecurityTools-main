import React, { useState, useMemo } from 'react';
import { Search, Database } from 'lucide-react';
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
        return 'bg-red-500/15 text-red-400 border-red-500/40';
      case 'HIGH':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/40';
      case 'MEDIUM':
        return 'bg-[#E2E8F0]/10 text-[#E2E8F0]/80 border-[#E2E8F0]/20';
      case 'LOW':
        return 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/40';
    }
  };

  return (
    <section id="portdb" className="py-12 border-b border-[#E2E8F0]/10 scroll-mt-14 font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-[#F59E0B] text-xs font-semibold uppercase tracking-wider mb-1">
              <Database className="w-4 h-4" />
              MITRE ATT&CK Matrix
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#E2E8F0]">Port & Attack Vector Database</h2>
            <p className="text-xs text-[#E2E8F0]/60 font-sans mt-1">
              Threat vector intelligence mapping standard service ports to common adversary tactics and techniques.
            </p>
          </div>
        </div>

        {/* Controls: Search & Filters */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-6">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#E2E8F0]/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search port number, service (e.g. SMB, Redis, 445)..."
              className="w-full bg-[#131924] border border-[#E2E8F0]/15 focus:border-[#F59E0B] rounded-xl pl-9 pr-3 py-2 text-xs text-[#E2E8F0] placeholder:text-[#E2E8F0]/30 focus:outline-none"
            />
          </div>

          {/* Risk Level Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[#E2E8F0]/40 text-[11px] mr-1 hidden sm:inline">Filter:</span>
            {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as RiskLevel[]).map((level) => (
              <button
                key={level}
                onClick={() => setSelectedRisk(level)}
                className={`px-3 py-1.5 rounded-lg border text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedRisk === level
                    ? 'bg-[#F59E0B] text-[#0B0F17] border-[#F59E0B] font-bold shadow-sm shadow-[#F59E0B]/20'
                    : 'bg-[#131924] text-[#E2E8F0]/70 border-[#E2E8F0]/10 hover:border-[#E2E8F0]/20'
                }`}
              >
                <span>{level}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedRisk === level ? 'bg-[#0B0F17]/20 text-[#0B0F17]' : 'bg-[#E2E8F0]/10 text-[#E2E8F0]/50'
                  }`}
                >
                  {riskCounts[level]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-[#131924] border border-[#E2E8F0]/10 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[640px]">
              <thead>
                <tr className="bg-[#0B0F17] border-b border-[#E2E8F0]/10 text-[#E2E8F0]/50 text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold w-24">Port</th>
                  <th className="py-3 px-4 font-semibold w-36">Service</th>
                  <th className="py-3 px-4 font-semibold w-24">Proto</th>
                  <th className="py-3 px-4 font-semibold w-28">Risk Level</th>
                  <th className="py-3 px-4 font-semibold">MITRE ATT&CK Threat Vector</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredPorts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[#E2E8F0]/40">
                      No port records match your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredPorts.map((item) => (
                    <tr
                      key={`${item.port}-${item.proto}`}
                      className="hover:bg-[#E2E8F0]/[0.03] transition-colors"
                    >
                      <td className="py-3 px-4 font-bold text-[#F59E0B]">{item.port}</td>
                      <td className="py-3 px-4 font-semibold text-[#E2E8F0]">{item.service}</td>
                      <td className="py-3 px-4 text-[#E2E8F0]/60 text-[11px]">{item.proto}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded border text-[10px] font-bold tracking-wider uppercase ${getRiskBadge(
                            item.risk
                          )}`}
                        >
                          {item.risk}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#E2E8F0]/80 font-sans text-xs">{item.vector}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
