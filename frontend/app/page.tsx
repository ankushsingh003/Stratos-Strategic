"use client";

import Link from "next/link";
import {
  Activity,
  Beaker,
  Printer,
  Cpu,
  Fuel,
  Landmark,
  ShoppingCart,
  Building2,
  Zap,
  Plane,
  Truck,
  Factory,
  Leaf,
  Film,
  HeartPulse,
  BadgeDollarSign,
} from "lucide-react";
import { motion, Variants } from "framer-motion";

export default function Home() {
  const industries = [
    { id: "cosmetics",    name: "Cosmetics & Beauty",    icon: <Beaker className="w-7 h-7" />,          color: "text-pink-400",   bg: "bg-pink-500/10 border-pink-500/20" },
    { id: "pharma",       name: "Pharmaceuticals",        icon: <Activity className="w-7 h-7" />,         color: "text-blue-400",   bg: "bg-blue-500/10 border-blue-500/20" },
    { id: "tech",         name: "Technology & IT",         icon: <Cpu className="w-7 h-7" />,              color: "text-cyan-400",   bg: "bg-cyan-500/10 border-cyan-500/20" },
    { id: "printing",     name: "Commercial Printing",     icon: <Printer className="w-7 h-7" />,          color: "text-slate-400",  bg: "bg-slate-500/10 border-slate-500/20" },
    { id: "oil",          name: "Oil & Gas",               icon: <Fuel className="w-7 h-7" />,             color: "text-amber-400",  bg: "bg-amber-500/10 border-amber-500/20" },
    { id: "coal",         name: "Coal & Mining",           icon: <Factory className="w-7 h-7" />,          color: "text-stone-400",  bg: "bg-stone-500/10 border-stone-500/20" },
    { id: "finance",      name: "Finance & Banking",       icon: <Landmark className="w-7 h-7" />,         color: "text-emerald-400",bg: "bg-emerald-500/10 border-emerald-500/20" },
    { id: "retail",       name: "Retail & E-commerce",     icon: <ShoppingCart className="w-7 h-7" />,     color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
    { id: "real_estate",  name: "Real Estate",             icon: <Building2 className="w-7 h-7" />,        color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
    { id: "energy",       name: "Renewable Energy",        icon: <Zap className="w-7 h-7" />,              color: "text-lime-400",   bg: "bg-lime-500/10 border-lime-500/20" },
    { id: "aviation",     name: "Aviation & Aerospace",    icon: <Plane className="w-7 h-7" />,            color: "text-sky-400",    bg: "bg-sky-500/10 border-sky-500/20" },
    { id: "logistics",    name: "Logistics & Supply Chain",icon: <Truck className="w-7 h-7" />,            color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
    { id: "agriculture",  name: "Agriculture & Food",      icon: <Leaf className="w-7 h-7" />,             color: "text-green-400",  bg: "bg-green-500/10 border-green-500/20" },
    { id: "media",        name: "Media & Entertainment",   icon: <Film className="w-7 h-7" />,             color: "text-rose-400",   bg: "bg-rose-500/10 border-rose-500/20" },
    { id: "healthcare",   name: "Healthcare Services",     icon: <HeartPulse className="w-7 h-7" />,       color: "text-red-400",    bg: "bg-red-500/10 border-red-500/20" },
    { id: "insurance",    name: "Insurance & FinTech",     icon: <BadgeDollarSign className="w-7 h-7" />,  color: "text-teal-400",   bg: "bg-teal-500/10 border-teal-500/20" },
  ];

  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 22 } },
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white px-8 py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full mb-6">
          <Zap className="w-3 h-3" /> Vantage AI — Market Intelligence Engine
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-4 bg-gradient-to-br from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
          Select an Industry
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Run real-time predictive ML models, competitive intelligence, and generate board-ready
          consultancy reports for any sector.
        </p>
      </motion.div>

      {/* Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto"
      >
        {industries.map((ind) => (
          <motion.div key={ind.id} variants={item}>
            <Link
              href={`/dashboard/${ind.id}`}
              className="group flex items-center gap-5 p-5 rounded-2xl bg-slate-900/40 border border-slate-800/50 hover:border-slate-700 hover:bg-slate-900/80 transition-all duration-300 hover:scale-[1.03] cursor-pointer"
            >
              <div className={`p-3 rounded-xl border flex-shrink-0 ${ind.bg}`}>
                <span className={ind.color}>{ind.icon}</span>
              </div>
              <div className="min-w-0">
                <h2 className="font-semibold text-slate-100 group-hover:text-white truncate text-sm">{ind.name}</h2>
                <p className="text-xs text-slate-500 mt-0.5">AI-driven analysis</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <p className="text-center text-slate-700 text-xs mt-16 font-mono uppercase tracking-widest">
        Powered by Gemini 1.5 Flash · 4-Model ML Ensemble · Live RAG Context
      </p>
    </main>
  );
}
