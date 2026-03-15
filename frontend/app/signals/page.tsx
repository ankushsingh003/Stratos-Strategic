"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  Users, 
  Zap, 
  AlertCircle, 
  ChevronRight, 
  Search,
  ArrowUpRight,
  Target
} from "lucide-react";
import Link from "next/link";

export default function MarketSignalsPage() {
  const [industry, setIndustry] = useState("printing");
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [signals, setSignals] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const industries = [
    "printing", "pharma", "tech", "cosmetics",
    "oil", "coal", "finance", "retail",
    "real_estate", "energy", "aviation", "logistics",
    "agriculture", "media", "healthcare", "insurance"
  ];

  useEffect(() => {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

    const fetchData = async () => {
      setLoading(true);
      try {
        const [compRes, sigRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/market/competitors/${industry}`).then(res => res.json()),
          fetch(`${BACKEND_URL}/api/market/signals/${industry}`).then(res => res.json())
        ]);
        setCompetitors(compRes.competitors);
        setSignals(sigRes);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [industry]);

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 text-emerald-500 text-sm font-semibold uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4" /> Market Intelligence
          </div>
          <h1 className="text-4xl font-bold tracking-tight select-none">
            Market <span className="text-slate-500 font-light">Signals</span>
          </h1>
        </div>

        <div className="flex gap-2 bg-slate-900/50 p-1.5 rounded-xl border border-slate-800 backdrop-blur-md">
          {industries.map((ind) => (
            <button
              key={ind}
              onClick={() => setIndustry(ind)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                industry === ind 
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20" 
                : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {ind.charAt(0).toUpperCase() + ind.slice(1)}
            </button>
          ))}
        </div>
      </header>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex h-[600px] items-center justify-center"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
              <p className="text-slate-500 font-mono text-sm">Aggregating Global Signals...</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={industry}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-12 gap-6"
          >
            {/* Competitor Ranking */}
            <div className="col-span-12 lg:col-span-7 glass-card p-6 flex flex-col h-full">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" /> Competitor Power Ranking
                  </h3>
                  <p className="text-sm text-slate-500 italic">Market dominance based on share and execution</p>
                </div>
              </div>

              <div className="space-y-3 flex-grow">
                {competitors.map((comp, i) => (
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    key={comp.name}
                    className="group bg-slate-900/40 hover:bg-slate-800/60 p-4 rounded-xl border border-slate-800/50 flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-400 group-hover:text-emerald-400">
                        {i + 1}
                      </div>
                      <div>
                        <div className="font-bold text-slate-200">{comp.name}</div>
                        <div className="text-xs text-slate-500">{comp.core_strength}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <div className="text-sm font-bold text-emerald-400">{comp.market_share}%</div>
                        <div className="text-[10px] text-slate-500 uppercase">Share</div>
                      </div>
                      <div className="text-right w-24">
                        <div className={`text-sm font-bold ${comp.growth_yoy > 0 ? 'text-blue-400' : 'text-rose-400'}`}>
                          {comp.growth_yoy > 0 ? '+' : ''}{comp.growth_yoy}%
                        </div>
                        <div className="text-[10px] text-slate-500 uppercase">YoY Growth</div>
                      </div>
                      <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                        comp.status === 'Dominant' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                        comp.status === 'Strong' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                        'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                      }`}>
                        {comp.status}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Success factors */}
            <div className="col-span-12 lg:col-span-5 space-y-6">
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" /> Success Factor Map
                </h3>
                <div className="space-y-6">
                  {signals?.success_factors.map((factor: any) => (
                    <div key={factor.name} className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium text-slate-200">{factor.name}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          factor.industry_impact === 'High' ? 'bg-rose-500/10 text-rose-500' : 'bg-blue-500/10 text-blue-500'
                        }`}>
                          {factor.industry_impact} IMPACT
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${factor.weight * 100}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full ${factor.industry_impact === 'High' ? 'bg-emerald-500' : 'bg-blue-500'}`}
                        />
                      </div>
                      <p className="text-[11px] text-slate-500">{factor.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Signals */}
              <div className="glass-card p-6 bg-emerald-500/5 border-emerald-500/10">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-emerald-400" /> Intelligence Stream
                </h3>
                <div className="space-y-4">
                  {signals?.live_signals.map((sig: any, i: number) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.2 }}
                      className="flex gap-3 text-sm"
                    >
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 animate-pulse" />
                      <div>
                        <span className="text-emerald-500 font-bold uppercase text-[10px] mr-2">[{sig.type}]</span>
                        <span className="text-slate-300">{sig.msg}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <button className="w-full mt-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 transition-colors text-sm font-semibold flex items-center justify-center gap-2">
                  View Full Industry Audit <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
