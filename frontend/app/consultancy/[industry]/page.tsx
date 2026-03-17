'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { 
  Activity, 
  BrainCircuit, 
  ShieldCheck,
  TrendingUp,
  Settings,
  Database,
  X,
  ArrowUpRight,
  TrendingDown,
  BarChart3,
  Zap
} from 'lucide-react';

interface PanelData {
  short: string;
  inference: string;
  trends: number[];
  raw: any[];
}

interface IntelligenceData {
  financial: PanelData;
  regulatory: PanelData;
  digital: PanelData;
  growth: PanelData;
  operational: PanelData;
}

const MiniChart = ({ data, color }: { data: number[], color: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - ((v - min) / range) * 80}`).join(' ');

  return (
    <svg className="w-full h-32 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`M 0,100 L 0,${100 - ((data[0] - min) / range) * 80} L ${points} L 100,100 Z`}
        fill={`url(#grad-${color})`}
      />
      <motion.polyline
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={points}
      />
    </svg>
  );
};

export default function ConsultancyIntelligencePage({ params }: { params: { industry: string } }) {
  const searchParams = useSearchParams();
  const capability = searchParams.get('capability');
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<IntelligenceData | null>(null);
  const [activePanel, setActivePanel] = useState<number | null>(null);

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
        <h2 className="text-white text-2xl font-black uppercase tracking-[0.2em]">Synthesizing AI Inferences...</h2>
        <p className="text-emerald-500/60 mt-4 animate-pulse uppercase tracking-widest text-xs font-bold">Querying GROQ Llama-3 & Live API nodes</p>
      </div>
    );
  }

  const panels = [
    { title: "Financial Advisory", icon: <TrendingUp />, data: report?.financial, color: "from-blue-600/20 to-transparent", stroke: "#3b82f6", border: "border-blue-500/30", src: "CMS-PROVIDER" },
    { title: "Regulatory Compliance", icon: <ShieldCheck />, data: report?.regulatory, color: "from-amber-600/20 to-transparent", stroke: "#f59e0b", border: "border-amber-500/30", src: "OPEN_FDA" },
    { title: "Digital Transformation", icon: <Database />, data: report?.digital, color: "from-emerald-600/20 to-transparent", stroke: "#10b981", border: "border-emerald-500/30", src: "HL7-FHIR" },
    { title: "Strategic Growth", icon: <TrendingUp />, data: report?.growth, color: "from-purple-600/20 to-transparent", stroke: "#a855f7", border: "border-purple-500/30", src: "FMP-LIVE" },
    { title: "Operational Efficiency", icon: <Settings />, data: report?.operational, color: "from-cyan-600/20 to-transparent", stroke: "#06b6d4", border: "border-cyan-500/30", src: "ENGINE-CORE" }
  ];

  return (
    <main className="min-h-screen bg-[#020617] text-white p-6 lg:p-12 overflow-x-hidden relative">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 border-b border-white/5 pb-8 relative">
            <div className="absolute top-0 right-0 opacity-10 blur-3xl w-64 h-64 bg-emerald-500 rounded-full -mr-32 -mt-32"></div>
          <div>
            <div className="flex items-center gap-3 text-emerald-400 text-xs font-black uppercase tracking-[0.4em] mb-4">
              <Activity className="w-4 h-4" /> Live Intelligence Dashboard
            </div>
            <h1 className="text-4xl lg:text-6xl font-black tracking-tighter leading-none">
              STRATEGIC <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-white italic uppercase">{params.industry.replace('-',' ')} CORE.</span>
            </h1>
          </div>
          <div className="bg-white/5 backdrop-blur-3xl rounded-2xl p-4 border border-white/10 max-w-sm">
             <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block mb-1">Primary Selection</span>
             <p className="text-base font-bold text-white leading-tight">{capability}</p>
          </div>
        </header>

        {/* Master Synthesis Banner */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-12 py-4 relative group"
        >
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Zap className="w-16 h-16 text-emerald-400" />
           </div>
           <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 mb-4 flex items-center gap-2">
             <div className="w-1 h-3 bg-emerald-500 rounded-full"></div>
             Master Strategic Synthesis
           </h3>
           <p className="text-lg lg:text-xl font-bold italic leading-tight text-white/90 max-w-6xl whitespace-pre-line line-clamp-2">
              {report?.master_inference || "Aggregating cross-pillar intelligence for global optimization..."}
           </p>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-6 grid-rows-2 gap-6 h-auto md:h-[750px] mb-6">
          {panels.slice(0, 4).map((panel, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setActivePanel(idx)}
              className={`md:col-span-3 md:row-span-1 bg-gradient-to-br ${panel.color} rounded-[32px] p-8 border ${panel.border} relative overflow-hidden group cursor-pointer hover:border-white/20 transition-all`}
            >
               <div className="relative z-10 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                       <div className={`w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border ${panel.border}`}>
                          {React.cloneElement(panel.icon as React.ReactElement, { className: "w-6 h-6", style: { color: panel.stroke } })}
                       </div>
                       <h3 className="text-xl font-black italic tracking-tighter uppercase">{panel.title}</h3>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 p-2 rounded-full">
                       <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-base font-bold leading-snug mb-8 opacity-80">{panel.data?.short}</p>
                  
                  <div className="mt-auto">
                    <div className="h-16 opacity-30 group-hover:opacity-60 transition-opacity">
                       <MiniChart data={panel.data?.trends || [1,2,3]} color={panel.stroke} />
                    </div>
                    <div className="pt-4 border-t border-white/5 flex justify-between items-center opacity-60 text-[10px] font-mono uppercase tracking-widest">
                       <span>SOURCE // {panel.src}</span>
                       <span className="text-emerald-400">ACTIVE_FEED</span>
                    </div>
                  </div>
               </div>
            </motion.div>
          ))}
        </div>

        {/* Panel 5: Operational Efficiency */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => setActivePanel(4)}
          className={`bg-gradient-to-r ${panels[4].color} rounded-[32px] p-8 border ${panels[4].border} relative overflow-hidden cursor-pointer group hover:border-white/20 transition-all`}
        >
           <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="w-16 h-16 bg-cyan-500 rounded-3xl flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20">
                 {React.cloneElement(panels[4].icon as React.ReactElement, { className: "text-white w-8 h-8" })}
              </div>
              <div className="flex-1">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400 mb-1">Operational Efficiency Engine</h3>
                 <p className="text-xl font-bold italic leading-tight">{panels[4].data?.short}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 hidden lg:block min-w-[200px]">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] uppercase opacity-40">System_Health</span>
                    <span className="text-[10px] text-emerald-400 font-bold">OPTIMAL</span>
                 </div>
                 <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: "82%" }} className="h-full bg-cyan-500" />
                 </div>
              </div>
           </div>
        </motion.div>

        {/* Detail Overlay */}
        <AnimatePresence>
          {activePanel !== null && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#020617]/90 backdrop-blur-xl flex items-start justify-center overflow-y-auto p-4 md:p-12 lg:p-24"
            >
               <motion.div 
                  initial={{ scale: 0.9, opacity: 0, y: 40 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 40 }}
                  className="bg-[#0f172a] border border-white/10 rounded-[40px] w-full max-w-5xl overflow-hidden relative shadow-2xl my-auto"
               >
                  <button 
                    onClick={() => setActivePanel(null)}
                    className="absolute top-6 right-6 lg:top-8 lg:right-8 bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors z-20"
                  >
                    <X className="w-6 h-6" />
                  </button>

                  <div className="grid grid-cols-1 lg:grid-cols-2 h-auto">
                     <div className="p-8 lg:p-16 border-r border-white/5 bg-gradient-to-b from-white/5 to-transparent">
                        <div className={`w-16 h-16 rounded-3xl mb-12 flex items-center justify-center bg-white/5 border ${panels[activePanel].border}`}>
                           {React.cloneElement(panels[activePanel].icon as React.ReactElement, { className: "w-8 h-8", style: { color: panels[activePanel].stroke } })}
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-black italic tracking-tighter mb-4 leading-none">{panels[activePanel].title}</h2>
                        <p className="text-emerald-400 text-[9px] font-mono tracking-widest uppercase mb-12">DATA INTEGRITY // 100% SECURE</p>
                        
                        <div className="space-y-8">
                           <div>
                              <h4 className="text-[9px] uppercase tracking-widest text-white/40 mb-3">AI Strategic Outlook</h4>
                              <p className="text-lg italic font-bold leading-relaxed text-white/90">
                                 {panels[activePanel].data?.inference}
                              </p>
                           </div>
                           <div className="pt-8 border-t border-white/5">
                              <h4 className="text-[10px] uppercase tracking-widest text-white/40 mb-4">Signal Breakdown</h4>
                              <p className="text-base font-medium leading-relaxed opacity-70">
                                 {panels[activePanel].data?.short}
                              </p>
                           </div>
                        </div>
                     </div>

                     <div className="p-8 lg:p-16 flex flex-col justify-between h-full bg-black/20">
                        <div>
                           <div className="flex justify-between items-end mb-8">
                             <div>
                               <h4 className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Market Sentiment</h4>
                               <div className="flex items-center gap-2">
                                  <span className="text-3xl font-black italic">BULLISH</span>
                                  <ArrowUpRight className="text-emerald-400 w-6 h-6" />
                               </div>
                             </div>
                             <div className="text-right">
                               <span className="text-xs font-mono opacity-40">TICKER: {panels[activePanel].src}</span>
                             </div>
                           </div>
                           
                           <div className="bg-[#020617] rounded-3xl p-8 mb-12 border border-white/5 shadow-inner">
                              <div className="flex justify-between items-center mb-6">
                                 <span className="text-[10px] uppercase tracking-widest opacity-40">Real-time Flux</span>
                                 <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <span className="text-[9px] font-bold">STREAMING</span>
                                 </div>
                              </div>
                              <MiniChart data={panels[activePanel].data?.trends || []} color={panels[activePanel].stroke} />
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div className="bg-white/5 rounded-2xl p-6 border border-white/5 group hover:bg-white/10 transition-colors">
                              <span className="text-[9px] uppercase opacity-40 block mb-1">Volatility Index</span>
                              <span className="text-xl font-black italic">2.4%</span>
                           </div>
                           <div className="bg-white/5 rounded-2xl p-6 border border-white/5 group hover:bg-white/10 transition-colors">
                              <span className="text-[9px] uppercase opacity-40 block mb-1">Signal Velocity</span>
                              <span className="text-xl font-black italic">ULTRA-HIGH</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Footer */}
        <footer className="mt-16 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-30 font-mono text-[10px] tracking-widest pb-12">
           <div className="flex gap-8">
              <span>ENGINE // llama-3.3-70b-versatile</span>
              <span>INFERENCE_SRC // GROQ-CLOUD</span>
           </div>
           <div>ENGINEERED BY ANKUSH KUMAR SINGH</div>
        </footer>
      </div>
    </main>
  );
}
