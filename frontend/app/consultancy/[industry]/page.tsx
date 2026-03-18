'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Activity, 
  BrainCircuit, 
  ShieldCheck,
  TrendingUp,
  Settings,
  Database,
  X,
  ArrowLeft,
  ArrowUpRight,
  Zap
} from 'lucide-react';

interface IntelligenceInference {
  key_points: string[];
  action_plan: string[];
  mechanics: string[];
}

interface SpecializedReport {
  executive_summary: { why: string; what: string; impact: string };
  current_state: { bottlenecks: string[]; data_analysis: string; regulatory_status: string };
  tech_audit: { ehr_integration: string; automation_opportunities: string[] };
  gap_analysis: { resource_gaps: string[]; infrastructure_gaps: string[] };
  strategic_recommendations: { process_redesign: string; tech_stack: string[]; risk_mitigation: string };
  roadmap: { phase1: string; phase2: string; phase3: string };
  financial_roi: { cost_savings: string; revenue_growth: string };
}

interface PanelData {
  short: string;
  inference: IntelligenceInference;
  trends: number[];
  raw: any[];
  specialized?: SpecializedReport;
}

interface IntelligenceData {
  financial: PanelData;
  regulatory: PanelData;
  digital: PanelData;
  growth: PanelData;
  operational: PanelData;
  master_inference?: string;
}

const MiniChart = ({ data, color }: { data: number[], color: string }) => {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - ((v - min) / range) * 80}`).join(' ');

  return (
    <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`M 0,100 L 0,${100 - ((data[0] - min) / range) * 80} L ${points} L 100,100 Z`}
        fill={`url(#grad-${color.replace('#','')})`}
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
  const router = useRouter();
  const capability = searchParams.get('capability');
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<IntelligenceData | null>(null);
  const [activePanel, setActivePanel] = useState<number | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/intelligence/full-report?industry=${params.industry}`);
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
          <BrainCircuit className="w-20 h-20 text-emerald-400 opacity-40" />
        </motion.div>
        <h2 className="text-white text-3xl font-black uppercase tracking-[0.4em]">Synthesizing Intelligence...</h2>
        <p className="text-emerald-500/60 mt-6 animate-pulse uppercase tracking-[0.3em] text-xs font-black">Establishing parallel Groq processing nodes</p>
      </div>
    );
  }

  const panels = [
    { title: "Financial Advisory", icon: <TrendingUp />, data: report?.financial, color: "from-blue-600/20 to-transparent", stroke: "#3b82f6", border: "border-blue-500/30", src: "CMS-PROVIDER", focus: "Financial Advisory" },
    { title: "Regulatory Compliance", icon: <ShieldCheck />, data: report?.regulatory, color: "from-amber-600/20 to-transparent", stroke: "#f59e0b", border: "border-amber-500/30", src: "OPEN_FDA", focus: "Regulatory Compliance & Risk Management" },
    { title: "Digital Transformation", icon: <Database />, data: report?.digital, color: "from-emerald-600/20 to-transparent", stroke: "#10b981", border: "border-emerald-500/30", src: "HL7-FHIR", focus: "Digital Transformation & Health Tech" },
    { title: "Strategic Growth", icon: <TrendingUp />, data: report?.growth, color: "from-purple-600/20 to-transparent", stroke: "#a855f7", border: "border-purple-500/30", src: "FMP-LIVE", focus: "Strategic Growth & Market Entry" },
    { title: "Operational Efficiency", icon: <Settings />, data: report?.operational, color: "from-cyan-600/20 to-transparent", stroke: "#06b6d4", border: "border-cyan-500/30", src: "ENGINE-CORE", focus: "Operational Efficiency & Optimization" }
  ];

  const normalizedCapability = capability?.trim().toLowerCase() || "";
  
  // Fuzzy matching: check if capability matches title or focus
  const filteredPanels = normalizedCapability 
    ? panels.filter(p => {
        const pTitle = p.title.toLowerCase();
        const pFocus = p.focus.toLowerCase();
        return pTitle.includes(normalizedCapability) || 
               pFocus.includes(normalizedCapability) ||
               normalizedCapability.includes(pTitle.split(' ')[0].toLowerCase().slice(0, 5)) ||
               pTitle.includes(normalizedCapability.slice(0, 5));
      })
    : panels;

  const focusedPanelIdx = panels.findIndex(p => 
    p.focus.toLowerCase().includes(normalizedCapability) || 
    p.title.toLowerCase().includes(normalizedCapability)
  );
  const activeSpecialized = (focusedPanelIdx !== -1 && normalizedCapability) ? panels[focusedPanelIdx].data?.specialized : null;

  return (
    <main className="min-h-screen bg-[#020617] text-white p-4 lg:p-6 overflow-x-hidden relative font-sans">
      <div className="fixed top-0 right-0 opacity-10 blur-[120px] w-[500px] h-[500px] bg-emerald-500 rounded-full -mr-64 -mt-64 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-white/5 pb-8">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              <button 
                onClick={() => router.back()}
                className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 text-emerald-400 group-hover:-translate-x-1 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-wider text-white/70 group-hover:text-emerald-400">Back</span>
              </button>
              <div className="flex items-center gap-3 text-emerald-400 text-[10px] font-black uppercase tracking-[0.5em]">
                <Activity className="w-4 h-4" /> Live Institutional Alpha
              </div>
            </div>
            <h1 className="text-3xl lg:text-5xl font-black tracking-tighter leading-[0.9] uppercase">
              STRATEGIC <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-200 to-white italic">
                {params.industry.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} Intelligence.
              </span>
            </h1>
          </div>
          
          {normalizedCapability && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-emerald-500/5 backdrop-blur-3xl rounded-[32px] p-6 border border-emerald-500/20 max-w-sm flex items-start gap-5 shadow-2xl shadow-emerald-500/10"
            >
               <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shrink-0">
                  <Zap className="text-[#020617] w-6 h-6" />
               </div>
               <div>
                  <span className="text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.3em] block mb-1.5">Primary Focus Node</span>
                  <p className="text-lg font-black text-white leading-tight italic tracking-tight uppercase">{capability}</p>
               </div>
            </motion.div>
          )}
        </header>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 p-6 relative group border-l-[4px] border-emerald-500 bg-gradient-to-r from-emerald-500/10 to-transparent rounded-r-[24px] shadow-lg"
        >
           <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-400 mb-3 flex items-center gap-3">
             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
             Global Strategic Synthesis
           </h3>
           <p className="text-sm lg:text-base font-bold leading-relaxed text-white/90 max-w-4xl italic tracking-tight">
              {report?.master_inference || "Aggregating cross-pillar intelligence for global optimization..."}
           </p>
        </motion.div>

        {activeSpecialized ? (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6 mb-16"
          >
             {/* 1. Executive Summary - COMPACTED */}
             <div className="bg-gradient-to-br from-emerald-500/10 via-[#0f172a] to-[#010617] border border-emerald-500/20 rounded-[32px] p-8 lg:p-10 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5">
                   <Zap className="w-32 h-32 text-emerald-500" />
                </div>
                <h4 className="text-[10px] uppercase tracking-[0.6em] text-white/30 font-black mb-8">01. Executive Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                    <div className="space-y-2">
                       <span className="text-[9px] text-emerald-500/50 uppercase block tracking-[0.3em] font-black">Friction // Why</span>
                       <p className="text-lg font-black italic text-white leading-tight">"{activeSpecialized.executive_summary.why}"</p>
                    </div>
                    <div className="md:border-l border-white/10 md:pl-8 space-y-2">
                       <span className="text-[9px] text-white/30 uppercase block tracking-[0.3em] font-black">Logic // What</span>
                       <p className="text-lg font-black text-white/90 leading-tight">{activeSpecialized.executive_summary.what}</p>
                    </div>
                   <div className="md:border-l border-white/10 md:pl-8 space-y-2">
                      <span className="text-[9px] text-emerald-400 uppercase block tracking-[0.3em] font-black">Alpha // Impact</span>
                      <p className="text-3xl lg:text-4xl font-black text-emerald-400 leading-none tracking-tighter">
                        {activeSpecialized.executive_summary.impact}
                      </p>
                   </div>
                </div>
             </div>

             {/* 2, 3 & 4 Assessment / Audit / Gap - COMPACTED */}
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#0f172a] border border-white/10 rounded-[32px] p-8 flex flex-col justify-between shadow-xl relative">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-6">
                         <div>
                            <h4 className="text-[10px] uppercase tracking-[0.5em] text-white/30 mb-6 font-black">02. Current State</h4>
                            <div className="flex flex-wrap gap-2 mb-4">
                               {activeSpecialized.current_state.bottlenecks.map((b, i) => (
                                  <span key={i} className="text-[9px] bg-red-500/10 border border-red-500/20 text-red-500 px-3 py-1 rounded-xl font-black uppercase">{b}</span>
                               ))}
                            </div>
                            <p className="text-base font-bold text-white/60 leading-tight italic border-l-2 border-white/10 pl-4">{activeSpecialized.current_state.data_analysis}</p>
                         </div>
                      </div>
                      <div className="md:border-l border-white/10 md:pl-10 space-y-6">
                         <div>
                            <h4 className="text-[10px] uppercase tracking-[0.5em] text-white/30 mb-6 font-black">03. ARCHITECTURAL Audit</h4>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 mb-4">
                               <span className="text-[9px] text-white/40 uppercase block mb-1 font-black">READINESS</span>
                               <p className="text-lg font-black text-emerald-400 leading-none uppercase">{activeSpecialized.tech_audit.ehr_integration}</p>
                            </div>
                            <div className="space-y-2">
                               {activeSpecialized.tech_audit.automation_opportunities.map((opp, i) => (
                                  <div key={i} className="flex gap-3 items-center">
                                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40"></div>
                                     <span className="text-[13px] font-bold text-white/60 uppercase">{opp}</span>
                                  </div>
                               ))}
                            </div>
                         </div>
                      </div>
                   </div>
                   <div className="pt-6 border-t border-white/5 mt-8 flex justify-between items-center">
                      <span className="text-[11px] font-mono text-emerald-500 font-black uppercase tracking-widest">{activeSpecialized.current_state.regulatory_status}</span>
                      <span className="text-[9px] text-white/20 font-black uppercase">GRID_SECURE</span>
                   </div>
                </div>

                <div className="bg-[#0b1120] border border-white/10 rounded-[32px] p-8 flex flex-col shadow-xl">
                   <h4 className="text-[10px] uppercase tracking-[0.5em] text-white/30 mb-8 font-black">04. GAP Analysis</h4>
                   <div className="space-y-8 flex-1">
                      <div className="pl-6 border-l-2 border-amber-500/20">
                         <span className="text-[9px] text-amber-500/60 uppercase block mb-4 font-black">Talent Delta</span>
                         <ul className="space-y-2">
                            {activeSpecialized.gap_analysis.resource_gaps.map((g, i) => (
                               <li key={i} className="text-sm font-bold text-white/70 leading-none flex items-center gap-3">
                                  <div className="w-1 h-1 bg-amber-500 rounded-full"></div> {g}
                               </li>
                            ))}
                         </ul>
                      </div>
                      <div className="pl-6 border-l-2 border-purple-500/20">
                         <span className="text-[9px] text-purple-500/60 uppercase block mb-4 font-black">Infra Delta</span>
                         <ul className="space-y-2">
                            {activeSpecialized.gap_analysis.infrastructure_gaps.map((g, i) => (
                               <li key={i} className="text-sm font-bold text-white/70 leading-none flex items-center gap-3">
                                  <div className="w-1 h-1 bg-purple-500 rounded-full"></div> {g}
                               </li>
                            ))}
                         </ul>
                      </div>
                   </div>
                </div>
             </div>

             {/* 5 Recommendation & Roadmap - COMPACTED */}
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 bg-emerald-500/5 border border-emerald-500/10 rounded-[40px] p-10 relative overflow-hidden shadow-xl group">
                   <div className="absolute top-0 right-0 p-10 opacity-5">
                      <BrainCircuit className="w-48 h-48 text-emerald-500" />
                   </div>
                   <h4 className="text-[10px] uppercase tracking-[0.6em] text-emerald-400 mb-8 font-black">05. STRATEGIC RECOMMENDATIONS</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                      <div className="space-y-8">
                         <div>
                            <span className="text-[9px] text-white/40 uppercase block mb-3 font-black">Workflow Modernization</span>
                            <p className="text-lg font-black italic text-white leading-tight uppercase tracking-tighter">
                               {activeSpecialized.strategic_recommendations.process_redesign}
                            </p>
                         </div>
                         <div className="p-6 bg-emerald-500/10 border border-emerald-500/10 rounded-2xl">
                            <span className="text-[9px] text-emerald-500 uppercase block mb-3 font-black">Risk Mitigation</span>
                            <p className="text-sm font-bold text-emerald-200/80 leading-tight italic">
                               {activeSpecialized.strategic_recommendations.risk_mitigation}
                            </p>
                         </div>
                      </div>
                      <div className="space-y-4">
                         <span className="text-[9px] text-white/40 uppercase block mb-4 font-black">Tech Deployment</span>
                         <div className="grid grid-cols-1 gap-3">
                            {activeSpecialized.strategic_recommendations.tech_stack.map((tech, i) => (
                               <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                     <Zap className="w-4 h-4" />
                                  </div>
                                  <span className="text-[12px] font-black uppercase text-white/80">{tech}</span>
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>

                <div className="lg:col-span-5 bg-[#0f172a] border border-white/10 rounded-[40px] p-10 flex flex-col shadow-xl">
                   <h4 className="text-[10px] uppercase tracking-[0.6em] text-white/40 mb-8 font-black">06. EVOLUTIONARY ROADMAP</h4>
                   <div className="space-y-8 relative flex-1">
                      <div className="absolute left-[19px] top-8 bottom-8 w-px bg-white/10"></div>
                      
                      {[
                        { id: 'P1', color: 'bg-emerald-500', title: 'Tactical', label: 'phase1' },
                        { id: 'P2', color: 'bg-blue-500', title: 'Scale', label: 'phase2' },
                        { id: 'P3', color: 'bg-purple-500', title: 'Optimization', label: 'phase3' }
                      ].map((p, idx) => (
                        <div key={idx} className="relative pl-12">
                           <div className={`absolute left-0 top-0 w-10 h-10 ${p.color} rounded-xl flex items-center justify-center text-xs font-black text-[#020617] z-10`}>
                              {p.id}
                           </div>
                           <h5 className="text-[9px] font-black opacity-30 uppercase tracking-widest mb-1">{p.title}</h5>
                           <p className="text-base font-black text-white/90 leading-tight uppercase">{activeSpecialized.roadmap[p.label as keyof typeof activeSpecialized.roadmap]}</p>
                        </div>
                      ))}
                   </div>
                </div>
             </div>

             {/* 7 FINANCIAL ROI - COMPACTED */}
             <div className="bg-gradient-to-r from-[#010617] via-[#1e293b] to-[#010617] border border-white/10 rounded-[48px] p-10 mt-4 shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-emerald-500/5 opacity-30 blur-[100px] pointer-events-none"></div>
                <div className="flex flex-col lg:flex-row justify-between items-center gap-10 relative z-10">
                   <div className="text-center lg:text-left">
                      <h4 className="text-[12px] uppercase tracking-[0.8em] text-white/20 mb-3 font-black">07. FISCAL PROJECTIONS</h4>
                      <p className="text-[10px] font-black text-emerald-500/40 uppercase tracking-widest italic">Institutional Engine: ACTIVE</p>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 shrink-0 px-10 border-l border-white/10 ml-0 lg:ml-12">
                      <div className="space-y-2 text-center lg:text-left">
                         <span className="text-[11px] text-red-500 uppercase block font-black opacity-60">Waste reduction</span>
                         <span className="text-4xl lg:text-5xl font-black italic text-red-500 tracking-tighter">
                            {activeSpecialized.financial_roi.cost_savings}
                         </span>
                      </div>
                      <div className="space-y-2 text-center lg:text-left">
                         <span className="text-[11px] text-emerald-500 uppercase block font-black opacity-60">Margin Acceleration</span>
                         <span className="text-4xl lg:text-5xl font-black italic text-emerald-400 tracking-tighter">
                            {activeSpecialized.financial_roi.revenue_growth}
                         </span>
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>
        ) : (
          <>
            {/* Bento Grid Layout - Filtered */}
            <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-6 grid-rows-2 gap-4 h-auto md:min-h-[700px] mb-12">
              {filteredPanels.filter(p => p.title !== "Operational Efficiency").map((panel, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setActivePanel(idx)}
                  className={`md:col-span-3 md:row-span-1 bg-gradient-to-br ${panel.color} rounded-[40px] p-8 border ${panel.focus.toLowerCase() === normalizedCapability ? 'border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.15)] scale-[1.02]' : 'border-white/10'} relative overflow-hidden group cursor-pointer hover:border-emerald-500/50 transition-all duration-500 shadow-xl`}
                >
                   {panel.focus.toLowerCase() === normalizedCapability && (
                     <div className="absolute top-0 right-0 bg-emerald-500 text-[#020617] text-[10px] font-black uppercase tracking-widest py-1.5 px-5 rounded-bl-[20px] z-20 shadow-lg">
                       ACTIVE FOCUS NODE
                     </div>
                   )}
                   <div className="relative z-10 h-full flex flex-col">
                      <div className="flex justify-between items-start mb-8">
                        <div className="flex items-center gap-5">
                           <div className={`w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-lg group-hover:scale-110 transition-transform`}>
                              {React.cloneElement(panel.icon as React.ReactElement, { className: "w-8 h-8", style: { color: panel.stroke } })}
                           </div>
                           <h3 className="text-2xl lg:text-3xl font-black italic tracking-tighter uppercase leading-none">{panel.title}</h3>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/10 p-3 rounded-full hover:scale-110">
                           <ArrowUpRight className="w-5 h-5" />
                        </div>
                      </div>
                      <p className="text-lg font-bold leading-tight mb-4 opacity-80 group-hover:opacity-100 transition-opacity line-clamp-2 uppercase italic">{panel.data?.short || "Analyzing live institutional signals..."}</p>
                      
                      <div className="mt-auto">
                        <div className="h-20 opacity-40 group-hover:opacity-100 transition-all duration-500">
                           <MiniChart data={panel.data?.trends || [1,2,3]} color={panel.stroke} />
                        </div>
                         <div className="pt-5 border-t border-white/5 flex justify-between items-center opacity-40 text-[11px] font-mono uppercase tracking-[0.2em] group-hover:opacity-80 transition-opacity">
                            <span>GRID_NODE // SECURE</span>
                            <span className="text-emerald-400 font-black animate-pulse">LIVE_FEED</span>
                         </div>
                      </div>
                   </div>
                </motion.div>
              ))}
            </div>

            {/* Panel 5: Operational Efficiency - Only show if no filter or if it matches */}
            {(filteredPanels.some(p => p.title === "Operational Efficiency")) && (
            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               onClick={() => setActivePanel(4)}
               className={`bg-gradient-to-r ${panels[4].color} rounded-[40px] p-10 border ${panels[4].focus.toLowerCase().includes(normalizedCapability) ? 'border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.15)] scale-[1.01]' : 'border-white/10'} relative overflow-hidden cursor-pointer group hover:border-cyan-400/50 transition-all duration-500 mb-20 shadow-xl`}
            >
               <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                  <div className="w-20 h-20 bg-cyan-500 rounded-3xl flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(6,182,212,0.3)] group-hover:rotate-6 transition-transform">
                     {React.cloneElement(panels[4].icon as React.ReactElement, { className: "text-white w-10 h-10" })}
                  </div>
                  <div className="flex-1">
                     <h3 className="text-[12px] font-black uppercase tracking-[0.5em] text-cyan-400 mb-2">Institutional Efficiency Core</h3>
                     <p className="text-3xl font-black italic leading-[1.1] uppercase tracking-tighter">{panels[4].data?.short || "Orchestrating operational alpha..."}</p>
                  </div>
                  <div className="bg-white/5 p-8 rounded-[32px] border border-white/5 hidden lg:block min-w-[300px] shadow-inner">
                     <div className="flex justify-between items-center mb-4">
                        <span className="text-[11px] uppercase tracking-widest opacity-40 font-black">System_Optimization</span>
                        <span className="text-[12px] text-emerald-400 font-black tracking-widest">98.4%</span>
                     </div>
                     <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: "98%" }} className="h-full bg-cyan-500" transition={{ duration: 2 }} />
                     </div>
                  </div>
               </div>
               <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Settings className="w-32 h-32 animate-spin-slow" />
               </div>
            </motion.div>
            )}
           </>
        )}

        {/* Detail Overlay */}
        <AnimatePresence>
          {activePanel !== null && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#020617]/95 backdrop-blur-[20px] flex items-center justify-center overflow-y-auto p-4 md:p-10"
            >
               <motion.div 
                  initial={{ scale: 0.95, opacity: 0, y: 50 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: 50 }}
                  className="bg-[#0f172a] border border-white/10 rounded-[64px] w-full max-w-6xl overflow-hidden relative shadow-[0_0_100px_rgba(0,0,0,0.8)]"
               >
                  <button 
                    onClick={() => setActivePanel(null)}
                    className="absolute top-10 right-10 bg-white/5 p-4 rounded-full hover:bg-white/10 hover:rotate-90 transition-all z-20 border border-white/10"
                  >
                    <X className="w-8 h-8" />
                  </button>

                  <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
                     <div className="p-12 lg:p-16 border-r border-white/5 bg-gradient-to-b from-white/5 to-transparent flex flex-col justify-between">
                        <div>
                           <div className={`w-20 h-20 rounded-[32px] mb-8 flex items-center justify-center bg-white/5 border border-white/10 shadow-xl`}>
                              {React.cloneElement(panels[activePanel].icon as React.ReactElement, { className: "w-10 h-10", style: { color: panels[activePanel].stroke } })}
                           </div>
                           <h2 className="text-5xl lg:text-7xl font-black italic tracking-tighter mb-4 leading-[0.85] uppercase">{panels[activePanel].title}</h2>
                           <p className="text-emerald-400 text-[11px] font-mono tracking-[0.5em] uppercase mb-12 flex items-center gap-3">
                              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                              Alpha Integrity Node // VERIFIED
                           </p>
                           
                           <div className="space-y-10">
                              <div>
                                 <h4 className="text-[11px] uppercase tracking-[0.5em] text-emerald-400 mb-6 font-black flex items-center gap-3">
                                    Analytical Insights
                                 </h4>
                                 <div className="space-y-5">
                                    {panels[activePanel].data?.inference?.key_points?.map((point: string, i: number) => (
                                       <motion.div 
                                          key={i}
                                          initial={{ opacity: 0, x: -20 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ delay: i * 0.1 }}
                                          className="flex items-start gap-5 group/point"
                                       >
                                          <div className="mt-2.5 w-2 h-2 rounded-full border-2 border-emerald-500/50 group-hover/point:bg-emerald-500 group-hover/point:scale-125 transition-all"></div>
                                          <p className="text-xl font-bold text-white/80 leading-snug group-hover:text-white transition-colors uppercase tracking-tight italic">{point}</p>
                                       </motion.div>
                                    ))}
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="pt-10 border-t border-white/10 mt-16 flex items-center justify-between opacity-30 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] font-mono uppercase tracking-widest">Signal_Strength: 98.2%</span>
                            <span className="text-[10px] font-mono uppercase tracking-widest">Origin: {panels[activePanel].src}</span>
                        </div>
                     </div>

                     <div className="p-12 lg:p-16 flex flex-col justify-between bg-black/40">
                        <div className="space-y-12">
                           <div className="flex justify-between items-end">
                              <div>
                                 <h4 className="text-[11px] uppercase tracking-[0.5em] text-white/30 mb-2 font-black">Market Sentiment</h4>
                                 <div className="flex items-center gap-4">
                                    <span className="text-5xl font-black italic tracking-tighter uppercase text-white shadow-sm">Bullish Alpha</span>
                                    <ArrowUpRight className="text-emerald-400 w-10 h-10 animate-bounce" />
                                 </div>
                              </div>
                              <div className="text-right pb-1">
                                 <span className="text-sm font-mono opacity-20 font-black">ID_STREAM_{activePanel + 9000}</span>
                              </div>
                           </div>
                           
                           <div className="bg-[#020617] rounded-[48px] p-8 border border-white/10 shadow-inner group">
                              <div className="flex justify-between items-center mb-6">
                                 <span className="text-[11px] uppercase tracking-[0.5em] opacity-30 font-black">Institutional Flux Stream</span>
                                 <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <span className="text-[10px] font-black tracking-widest text-[#A1F28B]">HIGH PREDICTIVE ACCURACY</span>
                                 </div>
                              </div>
                              <div className="h-32 mb-4">
                                 <MiniChart data={panels[activePanel].data?.trends || []} color={panels[activePanel].stroke} />
                              </div>
                           </div>

                           <div className="bg-emerald-500/10 rounded-[48px] p-10 border border-emerald-500/20 shadow-2xl relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-10 opacity-5">
                                 <Zap className="w-24 h-24 text-emerald-500" />
                              </div>
                              <h4 className="text-[11px] uppercase tracking-[0.5em] text-emerald-400 mb-8 font-black">Institutional Roadmap</h4>
                              <div className="space-y-6">
                                 {panels[activePanel].data?.inference?.action_plan?.map((step: string, i: number) => (
                                    <div key={i} className="flex items-start gap-6 group/step">
                                       <div className="w-10 h-10 shrink-0 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-sm font-black text-emerald-400 group-hover:scale-110 transition-transform shadow-lg">
                                          0{i + 1}
                                       </div>
                                       <p className="text-lg font-black text-white/90 leading-tight group-hover:text-white transition-opacity uppercase italic tracking-tight">{step}</p>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </div>

                        <div className="flex gap-6 mt-12">
                            <div className="flex-1 bg-white/5 rounded-3xl p-6 border border-white/5 flex flex-col gap-1">
                                <span className="text-[11px] uppercase opacity-30 font-black tracking-widest">Signal Rate</span>
                                <span className="text-2xl font-black italic uppercase">Real-Time</span>
                            </div>
                            <div className="flex-1 bg-emerald-500/5 rounded-3xl p-6 border border-emerald-500/10 flex flex-col gap-1">
                                <span className="text-[11px] uppercase opacity-30 font-black tracking-widest text-emerald-400/60">Node Integrity</span>
                                <span className="text-2xl font-black italic uppercase text-emerald-400">99.9%</span>
                            </div>
                        </div>
                     </div>
                  </div>
               </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-20 font-mono text-[10px] tracking-[0.5em] pb-10 uppercase font-black">
           <div className="flex gap-10">
              <span className="hover:opacity-100 transition-opacity cursor-default">STRATEGIC_INTELLIGENCE_LAYER_v4.2</span>
              <span className="hover:opacity-100 transition-opacity cursor-default">LATENCY // 14ms</span>
           </div>
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span>PROPRIETARY SYSTEMS // {new Date().getFullYear()}</span>
           </div>
        </footer>
      </div>
    </main>
  );
}
