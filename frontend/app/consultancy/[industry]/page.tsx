'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { 
  Activity, 
  Search, 
  Cpu, 
  Zap, 
  BrainCircuit, 
  LineChart, 
  Globe, 
  ShieldCheck,
  TrendingUp,
  Scale,
  Settings,
  Database
} from 'lucide-react';

interface IntelligenceData {
  financial: string;
  regulatory: string;
  digital: string;
  growth: string;
  operational: string;
}

export default function ConsultancyIntelligencePage({ params }: { params: { industry: string } }) {
  const searchParams = useSearchParams();
  const capability = searchParams.get('capability');
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<IntelligenceData | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/intelligence/full-report');
        const data = await response.json();
        setReport(data);
      } catch (error) {
        console.error("Error fetching report:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [params.industry]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mb-8"
        >
          <BrainCircuit className="w-16 h-16 text-emerald-400" />
        </motion.div>
        <h2 className="text-white text-2xl font-black uppercase tracking-[0.2em]">Synchronizing Intelligence Nodes...</h2>
        <p className="text-emerald-500/60 mt-4 animate-pulse uppercase tracking-widest text-xs font-bold">Aggregating Global Multi-Source Data</p>
      </div>
    );
  }

  const panels = [
    { title: "Financial Advisory", icon: <TrendingUp />, data: report?.financial, color: "from-blue-600/20 to-transparent", border: "border-blue-500/30" },
    { title: "Regulatory Compliance", icon: <ShieldCheck />, data: report?.regulatory, color: "from-amber-600/20 to-transparent", border: "border-amber-500/30" },
    { title: "Digital Transformation", icon: <Database />, data: report?.digital, color: "from-emerald-600/20 to-transparent", border: "border-emerald-500/30" },
    { title: "Strategic Growth", icon: <TrendingUp />, data: report?.growth, color: "from-purple-600/20 to-transparent", border: "border-purple-500/30" },
    { title: "Operational Efficiency", icon: <Settings />, data: report?.operational, color: "from-cyan-600/20 to-transparent", border: "border-cyan-500/30" }
  ];

  return (
    <main className="min-h-screen bg-[#020617] text-white p-6 lg:p-12 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 border-b border-white/5 pb-8 relative">
            <div className="absolute top-0 right-0 opacity-10 blur-3xl w-64 h-64 bg-emerald-500 rounded-full -mr-32 -mt-32"></div>
          <div>
            <div className="flex items-center gap-3 text-emerald-400 text-xs font-black uppercase tracking-[0.4em] mb-4">
              <Activity className="w-4 h-4" /> Comprehensive Multi-Panel Report
            </div>
            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-none">
              STRATEGIC <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-white italic uppercase">{params.industry.replace('-',' ')} CORE.</span>
            </h1>
          </div>
          <div className="bg-white/5 backdrop-blur-3xl rounded-2xl p-4 border border-white/10 max-w-sm">
             <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block mb-1">Primary Selection</span>
             <p className="text-base font-bold text-white leading-tight">{capability}</p>
          </div>
        </header>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-6 grid-rows-2 gap-4 h-auto md:h-[650px]">
          {/* Panel 1: Financial (Large) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`md:col-span-3 md:row-span-1 bg-gradient-to-br ${panels[0].color} rounded-[32px] p-6 border ${panels[0].border} relative overflow-hidden group`}
          >
             <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/40">
                      {React.cloneElement(panels[0].icon as React.ReactElement, { className: "text-blue-400 w-5 h-5" })}
                   </div>
                   <h3 className="text-lg font-black italic tracking-tighter">FINANCIAL ADVISORY</h3>
                </div>
                <p className="text-base lg:text-lg font-bold leading-snug mb-6">{panels[0].data}</p>
                <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center opacity-60 text-[9px] font-mono uppercase tracking-widest">
                   <span>DATA_SRC // CMS-PROVIDER</span>
                   <span>CONFIDENCE // 98%</span>
                </div>
             </div>
          </motion.div>

          {/* Panel 2: Regulatory */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`md:col-span-3 md:row-span-1 bg-gradient-to-br ${panels[1].color} rounded-[32px] p-6 border ${panels[1].border} relative overflow-hidden`}
          >
             <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center border border-amber-500/40">
                      {React.cloneElement(panels[1].icon as React.ReactElement, { className: "text-amber-400 w-5 h-5" })}
                   </div>
                   <h3 className="text-lg font-black italic tracking-tighter">REGULATORY COMPLIANCE</h3>
                </div>
                <p className="text-base lg:text-lg font-bold leading-snug mb-6">{panels[1].data}</p>
                <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center opacity-60 text-[9px] font-mono uppercase tracking-widest">
                   <span>DATA_SRC // OPEN_FDA</span>
                   <span>RISK // MINIMAL</span>
                </div>
             </div>
          </motion.div>

          {/* Panel 3: Digital Transformation (Now symmetric with 3 spans) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`md:col-span-3 md:row-span-1 bg-gradient-to-br ${panels[2].color} rounded-[32px] p-8 border ${panels[2].border} relative overflow-hidden`}
          >
              <div className="absolute right-0 bottom-0 p-6 opacity-10">
                 <BrainCircuit className="w-32 h-32 text-emerald-400" />
              </div>
             <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/40">
                      {React.cloneElement(panels[2].icon as React.ReactElement, { className: "text-emerald-400 w-5 h-5" })}
                   </div>
                   <h3 className="text-xl font-black italic tracking-tighter">DIGITAL TRANSFORMATION</h3>
                </div>
                <p className="text-lg lg:text-xl font-bold leading-tight max-w-2xl mb-6">{panels[2].data}</p>
                <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center opacity-60 text-[9px] font-mono uppercase tracking-widest">
                   <span>INFRASTRUCTURE // HL7-FHIR</span>
                   <span>LATENCY // 420MS</span>
                </div>
             </div>
          </motion.div>

          {/* Panel 4: Strategic Growth (Now symmetric with 3 spans) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`md:col-span-3 md:row-span-1 bg-gradient-to-br ${panels[3].color} rounded-[32px] p-6 border ${panels[3].border} relative overflow-hidden`}
          >
             <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center border border-purple-500/40">
                      {React.cloneElement(panels[3].icon as React.ReactElement, { className: "text-purple-400 w-5 h-5" })}
                   </div>
                   <h3 className="text-lg font-black italic tracking-tighter uppercase">Strategic Growth</h3>
                </div>
                <p className="text-base font-bold leading-relaxed mb-6">{panels[3].data}</p>
                <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center opacity-60 text-[9px] font-mono uppercase tracking-widest">
                   <span>DATA_SRC // FMP</span>
                   <span>M&A // HIGH</span>
                </div>
             </div>
          </motion.div>
        </div>

        {/* Panel 5: Operational Efficiency (Full width bar) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`mt-4 bg-gradient-to-r ${panels[4].color} rounded-[32px] p-6 border ${panels[4].border} relative overflow-hidden`}
        >
           <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
              <div className="w-12 h-12 bg-cyan-500 rounded-2xl flex items-center justify-center shrink-0">
                 {React.cloneElement(panels[4].icon as React.ReactElement, { className: "text-white w-6 h-6" })}
              </div>
              <div className="flex-1">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400 mb-1">Operational Efficiency Engine</h3>
                 <p className="text-lg font-bold italic leading-tight">{panels[4].data}</p>
              </div>
           </div>
        </motion.div>

        {/* Dashboard Footer */}
        <footer className="mt-16 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-30 font-mono text-[10px] tracking-widest">
           <div className="flex gap-8">
              <span>REPORT_ID // STRAT-INT-2026-X</span>
              <span>ENGINE // GEMINI-RAG-V2</span>
           </div>
           <div>ENGINEERED BY ANKUSH KUMAR SINGH</div>
        </footer>
      </div>
    </main>
  );
}
