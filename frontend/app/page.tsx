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
  Database,
  TrendingUp,
  Layers,
} from "lucide-react";
import { motion, Variants } from "framer-motion";

export default function Home() {
  const industries = [
    { id: "cosmetics",    name: "Cosmetics & Beauty",      icon: <Beaker strokeWidth={2.5} className="w-8 h-8" />,          color: "text-[#143D2C] group-hover:text-white", image: "/images/industries/cosmetics_layout.png" },
    { id: "pharma",       name: "Pharmaceuticals",         icon: <Activity strokeWidth={2.5} className="w-8 h-8" />,         color: "text-[#143D2C] group-hover:text-white", image: "/images/industries/pharma_shelf.png" },
    { id: "tech",         name: "Technology & IT",         icon: <Cpu strokeWidth={2.5} className="w-8 h-8" />,              color: "text-[#143D2C] group-hover:text-white", image: "/images/industries/it_infrastructure.png" },
    { id: "printing",     name: "Commercial Printing",     icon: <Printer strokeWidth={2.5} className="w-8 h-8" />,          color: "text-[#143D2C] group-hover:text-white", image: "/images/industries/large_format_printer.png" },
    { id: "oil",          name: "Oil & Gas",               icon: <Fuel strokeWidth={2.5} className="w-8 h-8" />,             color: "text-[#143D2C] group-hover:text-white", image: "/images/industries/oil_refinery.png" },
    { id: "coal",         name: "Coal & Mining",           icon: <Factory strokeWidth={2.5} className="w-8 h-8" />,          color: "text-[#143D2C] group-hover:text-white", image: "/images/industries/mining_operation.png" },
    { id: "finance",      name: "Finance & Banking",       icon: <Landmark strokeWidth={2.5} className="w-8 h-8" />,         color: "text-[#143D2C] group-hover:text-white", image: "/images/industries/banking_collage.png" },
    { id: "retail",       name: "Retail & E-commerce",     icon: <ShoppingCart strokeWidth={2.5} className="w-8 h-8" />,     color: "text-[#143D2C] group-hover:text-white", image: "/images/industries/retail_layout.png" },
    { id: "real_estate",  name: "Real Estate",             icon: <Building2 strokeWidth={2.5} className="w-8 h-8" />,        color: "text-[#143D2C] group-hover:text-white", image: "/images/industries/real_estate_towers.png" },
    { id: "energy",       name: "Renewable Energy",        icon: <Zap strokeWidth={2.5} className="w-8 h-8" />,              color: "text-[#143D2C] group-hover:text-white", image: "/images/industries/renewable_energy_site.png" },
    { id: "aviation",     name: "Aviation & Aerospace",    icon: <Plane strokeWidth={2.5} className="w-8 h-8" />,            color: "text-[#143D2C] group-hover:text-white", image: "/images/industries/aviation_aerospace.png" },
    { id: "logistics",    name: "Logistics & Supply Chain",icon: <Truck strokeWidth={2.5} className="w-8 h-8" />,            color: "text-[#143D2C] group-hover:text-white", image: "/images/industries/logistics_supply_chain.png" },
    { id: "agriculture",  name: "Agriculture & Food",      icon: <Leaf strokeWidth={2.5} className="w-8 h-8" />,             color: "text-[#143D2C] group-hover:text-white" },
    { id: "media",        name: "Media & Entertainment",   icon: <Film strokeWidth={2.5} className="w-8 h-8" />,             color: "text-[#143D2C] group-hover:text-white", image: "/images/industries/media_entertainment.png" },
    { id: "healthcare",   name: "Healthcare Services",     icon: <HeartPulse strokeWidth={2.5} className="w-8 h-8" />,       color: "text-[#143D2C] group-hover:text-white", image: "/images/industries/healthcare_tech.png" },
    { id: "insurance",    name: "Insurance & FinTech",     icon: <BadgeDollarSign strokeWidth={2.5} className="w-8 h-8" />,  color: "text-[#143D2C] group-hover:text-white", image: "/images/industries/fintech_strategy.png" },
  ];

  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.03 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#020617] text-[#143D2C] dark:text-white overflow-hidden pb-16 pt-32">
      
      {/* BCG Style Split Hero Section */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-12 items-center py-12 lg:py-24">
        <div className="relative z-10 flex flex-col items-start gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-[#143D2C] dark:text-[#A1F28B] text-xs font-black uppercase tracking-[0.3em]"
          >
            <div className="w-12 h-[2px] bg-[#A1F28B]" />
            Market Intelligence Platform
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] text-[#143D2C] dark:text-white"
          >
            STRATEGIC <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#143D2C] to-slate-500 dark:from-[#A1F28B] dark:to-white">CLARITY.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 dark:text-slate-400 text-xl max-w-xl leading-relaxed font-medium"
          >
            Harness the power of AI-driven market analysis. We transform complex data signals into high-impact strategic insights for global enterprises.
          </motion.p>
          
          <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.3 }}
             className="flex flex-wrap gap-4"
          >
            <Link 
              href="#industries"
              className="group flex items-center gap-4 bg-[#A1F28B] text-[#143D2C] px-8 py-4 rounded-full font-black uppercase tracking-widest text-sm transition-all hover:scale-105 hover:shadow-2xl"
            >
              Explore Our Expertise
              <div className="w-8 h-8 bg-[#143D2C] text-[#A1F28B] rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1">
                <TrendingUp className="w-4 h-4" />
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Refined Hero Visual Column - Neural Intelligence Console */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative h-[400px] lg:h-[550px] w-full bg-slate-100 dark:bg-slate-900 rounded-[40px] overflow-hidden group shadow-2xl border border-white/10"
        >
          {/* Background Technical Grid */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none" 
               style={{ backgroundImage: `radial-gradient(#A1F28B 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />
          
          <div className="absolute inset-0 flex items-center justify-center p-8 sm:p-12">
            <div className="w-full h-full bg-[#143D2C]/5 dark:bg-white/5 rounded-[40px] border border-white/10 flex flex-col items-center justify-center relative overflow-hidden">
               
               {/* Neural Intelligence Pulse */}
               <div className="relative z-10 flex flex-col items-center animate-float">
                  <div className="relative">
                    <motion.div 
                       animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                       transition={{ repeat: Infinity, duration: 3 }}
                       className="absolute inset-[-30px] bg-[#A1F28B] rounded-full blur-2xl" 
                    />
                    <div className="h-24 w-24 bg-[#A1F28B] rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(161,242,139,0.4)] relative border-[3px] border-white/20">
                       <Zap className="w-12 h-12 text-[#143D2C]" />
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <div className="text-lg font-black text-[#143D2C] dark:text-white tracking-widest uppercase mb-1">Neural Engine</div>
                    <div className="text-[9px] font-bold text-[#A1F28B] uppercase tracking-[0.4em] animate-pulse">Core Unit Active</div>
                  </div>
               </div>

               {/* Simulated Data Stream Overlays */}
               <div className="absolute top-12 left-12 right-12 flex justify-between opacity-40 font-mono text-[9px] dark:text-[#A1F28B] text-[#143D2C]">
                  <div className="flex flex-col gap-1">
                    <span>SYS_ARCH: VECTOR_RAG_V2</span>
                    <span>LATENCY: 42ms</span>
                    <span>THROUGHPUT: 1.2M/s</span>
                  </div>
                  <div className="text-right flex flex-col gap-1">
                    <span>CLUSTER: SEC_FILINGS_DB</span>
                    <span>SYNC: 100%</span>
                    <span>TRACING: LANGFUSE_ENABLED</span>
                  </div>
               </div>

               {/* Central Knowledge Graph Skeleton (SVG) */}
               <svg className="absolute inset-0 w-full h-full opacity-10 dark:opacity-20 pointer-events-none p-12" viewBox="0 0 400 400">
                  <circle cx="200" cy="200" r="100" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5 5" />
                  <circle cx="200" cy="200" r="150" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="10 10" />
                  <line x1="100" y1="100" x2="300" y2="300" stroke="currentColor" strokeWidth="0.5" />
                  <line x1="300" y1="100" x2="100" y2="300" stroke="currentColor" strokeWidth="0.5" />
                  <circle cx="100" cy="100" r="3" fill="#A1F28B" />
                  <circle cx="300" cy="300" r="3" fill="#A1F28B" />
                  <circle cx="300" cy="100" r="3" fill="#A1F28B" />
                  <circle cx="100" cy="300" r="3" fill="#A1F28B" />
               </svg>

               {/* Bottom Data Stream Snippet */}
               <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[80%] bg-black/40 backdrop-blur-md rounded-xl p-3 border border-white/5 font-mono text-[8px] text-slate-400 overflow-hidden h-12">
                  <motion.div 
                    animate={{ y: [-100, 0] }}
                    transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                    className="flex flex-col gap-1"
                  >
                    <span className="text-[#A1F28B]">[INFO] Synthesizing Q4 SEC filings for Banking sector...</span>
                    <span>[DATA] Ingesting real-time market signals via Kafka...</span>
                    <span className="text-blue-400">[RAG] Vector similarity search complete. Precision: 0.98</span>
                    <span>[ML] Running 4-model ensemble prediction...</span>
                    <span className="text-amber-400">[WARN] High volatility detected in Energy signals.</span>
                    <span>[INFO] Generating strategic consultancy report...</span>
                    <span className="text-[#A1F28B]">[SUCCESS] Output ready for client review.</span>
                  </motion.div>
               </div>
            </div>
          </div>
          
          {/* Floating Data Badge - Repositioned to avoid overlap */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-12 right-8 bg-white/95 dark:bg-[#143D2C]/95 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-2xl z-30"
          >
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 bg-[#A1F28B] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(161,242,139,0.3)]">
                  <Activity className="w-6 h-6 text-[#143D2C]" />
               </div>
               <div>
                  <div className="text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-[0.2em] mb-0.5">Live Intelligence</div>
                  <div className="text-2xl font-black text-[#143D2C] dark:text-white tabular-nums">12.8M <span className="text-xs text-[#A1F28B] ml-1">+24.5%</span></div>
               </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Select an Industry Section */}
      <section id="industries" className="bg-[#FBF9F4] dark:bg-[#0a0f1e] py-32 mt-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
              <div className="max-w-2xl">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="text-[#A1F28B] font-black text-xs uppercase tracking-[0.4em] mb-4"
                >
                  Global Sectors
                </motion.div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-[#143D2C] dark:text-white leading-[0.9]">
                  INDUSTRIES WE <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-600 dark:from-slate-500 dark:to-white">TRANSFORM.</span>
                </h2>
              </div>
              <p className="text-slate-500 font-medium max-w-sm">Select a sector to deploy our proprietary ML diagnostics and strategic RAG context.</p>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 no-scrollbar scroll-smooth"
          >
            {industries.map((ind) => (
              <motion.div 
                key={ind.id} 
                variants={item}
                className="flex-shrink-0 w-[280px] md:w-[320px] snap-center"
              >
                <Link
                  href={`/dashboard/${ind.id}`}
                  className="group relative flex flex-col justify-between p-8 h-64 rounded-[28px] bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 hover:bg-[#143D2C] dark:hover:bg-[#A1F28B] transition-all duration-500 hover:scale-[1.02] cursor-pointer overflow-hidden shadow-sm hover:shadow-2xl"
                >
                  {/* Industry Image Background (if exists) */}
                  {ind.image && (
                    <div className="absolute inset-0 z-0 overflow-hidden">
                       <img 
                        src={ind.image} 
                        alt={ind.name}
                        className="w-full h-full object-cover opacity-[0.15] dark:opacity-[0.25] group-hover:opacity-40 group-hover:scale-110 transition-all duration-700" 
                       />
                       <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/50 to-white dark:via-transparent dark:to-slate-950/80" />
                    </div>
                  )}

                  <div className="relative z-10 w-full h-full flex flex-col justify-between">
                    <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
                      <TrendingUp className="w-10 h-10 text-[#A1F28B] dark:text-[#143D2C]" />
                    </div>

                    <div className={`p-3 rounded-xl w-fit transition-colors duration-500 ${ind.color} group-hover:bg-white/10`}>
                      {ind.icon}
                    </div>
                    
                    <div>
                      <h2 className="text-xl font-black text-[#143D2C] dark:text-white group-hover:text-white dark:group-hover:text-[#143D2C] transition-colors duration-500 tracking-tight leading-none mb-2">
                        {ind.name}
                      </h2>
                      <div className="flex items-center gap-2 group-hover:gap-4 transition-all duration-500 text-[10px] font-black uppercase tracking-widest text-[#A1F28B] group-hover:text-white/80 dark:group-hover:text-[#143D2C]/80">
                        View Insights <div className="w-6 h-[1px] bg-current" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Corporate Footer Callout */}
      <footer className="max-w-7xl mx-auto px-6 lg:px-8 py-20 text-center">
         <div className="h-px bg-slate-200 dark:bg-white/10 mb-20" />
         <div className="flex flex-col items-center gap-8">
            <span className="text-[10px] font-black text-slate-400 dark:text-white/30 uppercase tracking-[0.5em]">
              Vantage AI · Global Strategic Intelligence
            </span>
            <p className="text-[#143D2C] dark:text-white font-bold text-sm max-w-2xl opacity-60">
              Powered by Gemini 1.5 Flash Enterprise · 4-Model ML Ensemble · Proprietary RAG Vector Engine
            </p>
         </div>
      </footer>
    </main>
  );
}
