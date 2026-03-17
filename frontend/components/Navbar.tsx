"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { 
  LayoutDashboard, 
  FileText, 
  TrendingUp,
  Database,
  Layers,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

const navItems = [
  { name: "Home", icon: LayoutDashboard, href: "/" },
  { name: "Market Signals", icon: TrendingUp, href: "/signals" },
  { name: "Intelligence RAG", icon: Database, href: "/rag" },
  { name: "Reports", icon: FileText, href: "/reports" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    
    // Hide when scrolling down and past a small threshold
    if (latest > previous && latest > 100) {
      setHidden(true);
    } 
    // Show ONLY when near the very top
    else if (latest < 10) {
      setHidden(false);
    }
    // Otherwise (scrolling up but not at top), remain hidden
  });

  return (
    <>
      {/* Floating Island Navbar */}
      <motion.div 
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: -120, opacity: 0 },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 md:px-6"
      >
        <div className="max-w-7xl w-full flex justify-between items-center bg-white/80 dark:bg-[#143D2C]/90 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl rounded-[32px] px-4 md:px-6 py-3 h-20 overflow-hidden">
          
          {/* Left: Logo & Menu Toggle */}
          <div className="flex items-center gap-4 shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-10 w-10 bg-[#A1F28B] rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:rotate-12">
                <Layers className="text-[#143D2C] w-5 h-5" />
              </div>
              <div className="flex flex-col -gap-0.5">
                <span className="text-base font-black tracking-tighter dark:text-white uppercase leading-none">Vantage <span className="text-[#A1F28B]">AI</span></span>
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-300 tracking-[0.15em] uppercase">Intelligence</span>
              </div>
            </Link>

            <div className="hidden xl:block h-6 w-px bg-slate-200 dark:bg-white/10 mx-1" />

            {/* Desktop Nav Items */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = item.href === "/" 
                  ? pathname === "/" 
                  : pathname.startsWith(item.href);
                  
                return (
                  <Link key={item.name} href={item.href}>
                    <div className={`
                      flex items-center gap-1.5 px-3 py-2 rounded-full transition-all relative group
                      ${isActive ? 'dark:text-[#A1F28B] text-[#143D2C]' : 'text-slate-500 dark:text-slate-300 hover:text-black dark:hover:text-white'}
                    `}>
                      {isActive && (
                        <motion.div 
                          layoutId="navbar-active"
                          className="absolute inset-0 bg-slate-100 dark:bg-white/5 rounded-full"
                        />
                      )}
                      <item.icon className={`w-3.5 h-3.5 shrink-0 transition-colors ${isActive ? 'text-[#143D2C] dark:text-[#A1F28B]' : 'group-hover:text-[#143D2C] dark:group-hover:text-[#A1F28B]'}`} />
                      <span className="font-bold text-[10px] uppercase tracking-widest whitespace-nowrap z-10">{item.name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-black/20 px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/5">
              <div className="h-1.5 w-1.5 bg-[#A1F28B] rounded-full animate-pulse shadow-[0_0_8px_rgba(161,242,139,0.8)]" />
              <span className="text-[9px] font-black text-slate-500 dark:text-white/60 uppercase tracking-[0.1em] whitespace-nowrap">Core Active</span>
            </div>

            <button
              className="lg:hidden p-2.5 rounded-full bg-slate-100 dark:bg-white/5 text-[#143D2C] dark:text-white hover:bg-[#A1F28B] hover:text-[#143D2C] transition-all duration-300"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            <button className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-[#A1F28B] text-[#143D2C] rounded-full font-bold text-[10px] uppercase tracking-widest transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(161,242,139,0.4)] active:scale-95">
              Connect <TrendingUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-28 left-4 right-4 z-40 bg-white/95 dark:bg-[#143D2C]/95 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-[32px] p-6 lg:hidden shadow-2xl"
          >
            <div className="flex flex-col gap-3">
              {navItems.map((item) => {
                const isActive = item.href === "/" 
                  ? pathname === "/" 
                  : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                  >
                    <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${
                      isActive 
                        ? 'bg-[#A1F28B] text-[#143D2C]' 
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}>
                      <item.icon className="w-5 h-5" />
                      <span className="font-bold text-sm uppercase tracking-widest">{item.name}</span>
                    </div>
                  </Link>
                );
              })}
              <div className="h-px bg-slate-200 dark:bg-white/10 my-2" />
              <button className="w-full flex justify-center items-center gap-2 px-6 py-4 bg-[#A1F28B] text-[#143D2C] rounded-2xl font-black text-sm uppercase tracking-widest">
                Contact Strategy Team
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
