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

  const normalizedCapability = capability?.trim().toLowerCase();
  const focusedPanelIdx = panels.findIndex(p => p.focus.toLowerCase() === normalizedCapability);
  const activeSpecialized = focusedPanelIdx !== -1 ? panels[focusedPanelIdx].data?.specialized : null;

  return (
    <main className="min-h-screen bg-[#020617] text-white p-4 lg:p-6 overflow-x-hidden relative font-sans">
      <div className="fixed top-0 right-0 opacity-10 blur-[120px] w-[500px] h-[500px] bg-emerald-500 rounded-full -mr-64 -mt-64 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-white/5 pb-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 text-emerald-400 text-[10px] font-black uppercase tracking-[0.5em] mb-2">
              <Activity className="w-4 h-4" /> Live Institutional Alpha
            </div>
            <h1 className="text-4xl lg:text-6xl font-black tracking-tighter leading-[0.9] uppercase">
              STRATEGIC <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-200 to-white italic">{params.industry.replace('-',' ')} Intelligence.</span>
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
          className="mb-12 p-8 relative group border-l-[6px] border-emerald-500 bg-gradient-to-r from-emerald-500/10 to-transparent rounded-r-[32px] shadow-xl"
        >
           <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-emerald-400 mb-4 flex items-center gap-3">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
             Global Strategic Synthesis
           </h3>
           <p className="text-xl lg:text-3xl font-black leading-[1.1] text-white/95 max-w-5xl italic tracking-tight">
              {report?.master_inference || "Aggregating cross-pillar intelligence for global optimization..."}
           </p>
        </motion.div>

        {activeSpecialized ? (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-8 mb-20"
          >
             {/* 1. Executive Summary */}
             <div className="bg-gradient-to-br from-emerald-500/20 via-[#0f172a] to-[#010617] border border-emerald-500/30 rounded-[48px] p-12 lg:p-16 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-16 opacity-5">
                   <Zap className="w-48 h-48 text-emerald-500" />
                </div>
                <h4 className="text-[12px] uppercase tracking-[0.6em] text-white/40 font-black mb-12">01. Executive Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10">
                   <div className="space-y-4">
                      <span className="text-[11px] text-emerald-500/50 uppercase block tracking-[0.3em] font-black">Institutional Friction // Why</span>
                      <p className="text-2xl font-black italic text-white leading-[1.2]">"{activeSpecialized.executive_summary.why}"</p>
                   </div>
                   <div className="md:border-l border-white/10 md:pl-16 space-y-4">
                      <span className="text-[11px] text-white/30 uppercase block tracking-[0.3em] font-black">Mitigation Logic // What</span>
                      <p className="text-2xl font-black text-white/90 leading-[1.2]">{activeSpecialized.executive_summary.what}</p>
                   </div>
                   <div className="md:border-l border-white/10 md:pl-16 space-y-4">
                      <span className="text-[11px] text-emerald-400 uppercase block tracking-[0.3em] font-black">Quantified Alpha // Impact</span>
                      <p className="text-5xl lg:text-6xl font-black text-emerald-400 leading-none tracking-tighter">
                        {activeSpecialized.executive_summary.impact}
                      </p>
                   </div>
                </div>
             </div>

             {/* 2 & 3 Assessment / Audit */}
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-[#0f172a] border border-white/10 rounded-[48px] p-12 flex flex-col justify-between shadow-2xl relative">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                      <div className="space-y-10">
                         <div>
                            <h4 className="text-[11px] uppercase tracking-[0.5em] text-white/40 mb-10 font-black">02. Current State</h4>
                            <span className="text-[10px] text-red-500/50 uppercase block mb-5 font-black tracking-widest">Identified Inefficiencies</span>
                            <div className="flex flex-wrap gap-3">
                               {activeSpecialized.current_state.bottlenecks.map((b, i) => (
                                  <span key={i} className="text-[11px] bg-red-500/10 border border-red-500/30 text-red-500 px-5 py-2 rounded-2xl font-black uppercase tracking-tight">{b}</span>
                               ))}
                            </div>
                         </div>
                         <div>
                            <span className="text-[10px] text-white/30 uppercase block mb-3 font-black tracking-widest">Dynamic Signal Analysis</span>
                            <p className="text-lg font-bold text-white/70 leading-relaxed italic border-l-2 border-white/10 pl-6">{activeSpecialized.current_state.data_analysis}</p>
                         </div>
                      </div>
                      <div className="md:border-l border-white/10 md:pl-16 space-y-10">
                         <div>
                            <h4 className="text-[11px] uppercase tracking-[0.5em] text-white/40 mb-10 font-black">03. ARCHITECTURAL Audit</h4>
                            <div className="p-8 bg-white/5 rounded-[32px] border border-white/5 shadow-inner mb-10">
                               <span className="text-[10px] text-white/40 uppercase block mb-3 font-black tracking-widest">ECOSYSTEM READINESS</span>
                               <p className="text-xl font-black text-emerald-400 leading-tight uppercase leading-[1.1]">{activeSpecialized.tech_audit.ehr_integration}</p>
                            </div>
                            <span className="text-[10px] text-white/30 uppercase block mb-6 font-black tracking-widest">Agentic Opportunities</span>
                            <div className="space-y-5">
                               {activeSpecialized.tech_audit.automation_opportunities.map((opp, i) => (
                                  <div key={i} className="flex gap-5 items-center group/item">
                                     <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 group-hover/item:bg-emerald-500 transition-all"></div>
                                     <span className="text-[15px] font-bold text-white/60 group-hover/item:text-white transition-colors">{opp}</span>
                                  </div>
                               ))}
                            </div>
                         </div>
                      </div>
                   </div>
                   <div className="pt-10 border-t border-white/5 mt-16 flex justify-between items-center">
                      <span className="text-sm font-mono text-emerald-500 font-black uppercase tracking-[0.3em] italic">{activeSpecialized.current_state.regulatory_status}</span>
                      <div className="flex items-center gap-3">
                         <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                         <span className="text-[10px] text-white/30 font-black uppercase tracking-widest">Node Node ACTIVE</span>
                      </div>
                   </div>
                </div>

                <div className="bg-[#0b1120] border border-white/10 rounded-[48px] p-12 flex flex-col shadow-2xl">
                   <h4 className="text-[11px] uppercase tracking-[0.5em] text-white/40 mb-12 font-black font-mono">04. GAP Analysis</h4>
                   <div className="space-y-12 flex-1">
                      <div className="relative pl-10 border-l-[3px] border-amber-500/30">
                         <span className="text-[11px] text-amber-500/60 uppercase block mb-6 font-black tracking-[0.4em] flex items-center gap-3">
                            <Activity className="w-4 h-4" /> Talent Delta
                         </span>
                         <ul className="space-y-5">
                            {activeSpecialized.gap_analysis.resource_gaps.map((g, i) => (
                               <li key={i} className="text-base font-bold text-white/80 leading-tight flex items-start gap-4">
                                  <span className="text-amber-500/60 mt-2.5 min-w-[7px] h-[7px] bg-amber-500 rounded-full"></span> {g}
                               </li>
                            ))}
                         </ul>
                      </div>
                      <div className="relative pl-10 border-l-[3px] border-purple-500/30">
                         <span className="text-[11px] text-purple-500/60 uppercase block mb-6 font-black tracking-[0.4em] flex items-center gap-3">
                            <Database className="w-4 h-4" /> Infra Delta
                         </span>
                         <ul className="space-y-5">
                            {activeSpecialized.gap_analysis.infrastructure_gaps.map((g, i) => (
                               <li key={i} className="text-base font-bold text-white/80 leading-tight flex items-start gap-4">
                                  <span className="text-purple-500/60 mt-2.5 min-w-[7px] h-[7px] bg-purple-500 rounded-full"></span> {g}
                               </li>
                            ))}
                         </ul>
                      </div>
                   </div>
                </div>
             </div>

             {/* 5 Recommendation & Roadmap */}
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 bg-emerald-500/5 border border-emerald-500/20 rounded-[56px] p-16 relative overflow-hidden shadow-2xl group">
                   <div className="absolute top-0 right-0 p-16 opacity-5">
                      <BrainCircuit className="w-80 h-80 text-emerald-500" />
                   </div>
                   <h4 className="text-[11px] uppercase tracking-[0.6em] text-emerald-400 mb-12 font-black">05. STRATEGIC RECOMMENDATIONS (TO-BE)</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-20 relative z-10">
                      <div className="space-y-16">
                         <div>
                            <span className="text-[10px] text-white/40 uppercase block mb-5 tracking-[0.4em] font-black">Workflow Modernization</span>
                            <p className="text-4xl font-black italic text-white leading-[1.1] uppercase tracking-tighter">
                               {activeSpecialized.strategic_recommendations.process_redesign}
                            </p>
                         </div>
                         <div className="p-10 bg-emerald-500/10 border border-emerald-500/20 rounded-[32px] backdrop-blur-3xl shadow-2xl">
                            <span className="text-[11px] text-emerald-500 uppercase block mb-5 font-black tracking-[0.4em]">Risk Mitigation Engine</span>
                            <p className="text-base font-bold text-emerald-200/90 leading-relaxed italic border-l-[3px] border-emerald-500 pl-8 py-2">
                               {activeSpecialized.strategic_recommendations.risk_mitigation}
                            </p>
                         </div>
                      </div>
                      <div className="space-y-10">
                         <span className="text-[10px] text-white/40 uppercase block mb-8 tracking-[0.4em] font-black">Institutional Tech Deployment</span>
                         <div className="grid grid-cols-1 gap-5">
                            {activeSpecialized.strategic_recommendations.tech_stack.map((tech, i) => (
                               <div key={i} className="flex items-center gap-6 p-6 rounded-[24px] bg-white/5 border border-white/5 hover:border-emerald-500/50 hover:bg-white/10 transition-all cursor-default">
                                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                     <Zap className="w-6 h-6" />
                                  </div>
                                  <span className="text-sm font-black uppercase tracking-[0.1em] text-white/90">{tech}</span>
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>

                <div className="lg:col-span-4 bg-[#0f172a] border border-white/10 rounded-[56px] p-12 flex flex-col shadow-2xl relative overflow-hidden">
                   <h4 className="text-[11px] uppercase tracking-[0.6em] text-white/40 mb-12 font-black">06. EVOLUTIONARY ROADMAP</h4>
                   <div className="space-y-16 relative flex-1 pr-8">
                      <div className="absolute left-[27px] top-12 bottom-12 w-px bg-white/10"></div>
                      
                      {[
                        { id: 'P1', color: 'bg-emerald-500', title: 'Tactical Wins', label: 'phase1' },
                        { id: 'P2', color: 'bg-blue-500', title: 'Strategic Scale', label: 'phase2' },
                        { id: 'P3', color: 'bg-purple-500', title: 'Optimization', label: 'phase3' }
                      ].map((p, idx) => (
                        <div key={idx} className="relative pl-20 group">
                           <div className={`absolute left-0 top-0 w-14 h-14 ${p.color} rounded-[20px] flex items-center justify-center text-[15px] font-black text-[#020617] z-10 shadow-2xl group-hover:scale-110 transition-transform`}>
                              {p.id}
                           </div>
                           <h5 className="text-[11px] font-black opacity-20 uppercase tracking-[0.4em] mb-2">{p.title}</h5>
                           <p className="text-lg font-black text-white/90 leading-tight uppercase leading-[1.2]">{activeSpecialized.roadmap[p.label as keyof typeof activeSpecialized.roadmap]}</p>
                        </div>
                      ))}
                   </div>
                </div>
             </div>

             {/* 7 FINANCIAL ROI */}
             <div className="bg-gradient-to-r from-[#010617] via-[#1e293b] to-[#010617] border border-white/10 rounded-[64px] p-16 mt-8 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-emerald-500/5 opacity-50 blur-[150px] pointer-events-none"></div>
                <div className="flex flex-col lg:flex-row justify-between items-center gap-20 relative z-10">
                   <div className="flex-1 text-center lg:text-left">
                      <h4 className="text-[15px] uppercase tracking-[1em] text-white/20 mb-6 font-black">07. FISCAL PROJECTIONS</h4>
                      <div className="flex items-center gap-5 justify-center lg:justify-start">
                         <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.8)]"></div>
                         <p className="text-[13px] font-black text-emerald-500/60 uppercase tracking-[0.6em] font-mono italic">Institutional Validation System: ACTIVE</p>
                      </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-24 md:gap-48 shrink-0 px-16 lg:px-24 border-l border-white/10 ml-0 lg:ml-20">
                      <div className="space-y-4 text-center lg:text-left">
                         <span className="text-[13px] text-red-500 uppercase block font-black tracking-[0.4em] opacity-60">Operational Waste reduction</span>
                         <span className="text-7xl lg:text-8xl font-black italic text-red-500 tracking-tighter drop-shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                            {activeSpecialized.financial_roi.cost_savings}
                         </span>
                      </div>
                      <div className="space-y-4 text-center lg:text-left">
                         <span className="text-[13px] text-emerald-500 uppercase block font-black tracking-[0.4em] opacity-60">Net Margin Acceleration</span>
                         <span className="text-7xl lg:text-8xl font-black italic text-emerald-400 tracking-tighter drop-shadow-[0_0_20px_rgba(52,211,153,0.4)]">
                            {activeSpecialized.financial_roi.revenue_growth}
                         </span>
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>
        ) : (
          <>
            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-6 grid-rows-2 gap-4 h-auto md:min-h-[700px] mb-12">
              {panels.slice(0, 4).map((panel, idx) => (
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

            {/* Panel 5: Operational Efficiency */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={() => setActivePanel(4)}
              className={`bg-gradient-to-r ${panels[4].color} rounded-[40px] p-10 border ${panels[4].focus.toLowerCase() === normalizedCapability ? 'border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.15)] scale-[1.01]' : 'border-white/10'} relative overflow-hidden cursor-pointer group hover:border-cyan-400/50 transition-all duration-500 mb-20 shadow-xl`}
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
