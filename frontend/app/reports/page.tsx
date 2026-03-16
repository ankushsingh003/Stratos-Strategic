"use client";

import { useEffect, useState, useRef } from "react";
import { 
  Send,
  User,
  Bot,
  Sparkles,
  Download,
  FileText,
  Globe,
  Zap,
  ShieldCheck,
  Briefcase,
  TrendingUp,
  Layers,
  Search,
  MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Industry {
  id: string;
  name: string;
  count: string;
  tagline: string;
  impact: "High" | "Medium" | "Stable";
  icon: any;
}

const INDUSTRIES: Record<string, Industry> = {
  oil: { id: "oil", name: "Oil & Gas", count: "115 Assets", tagline: "Energy transition and supply chain modeling.", impact: "High", icon: Globe },
  tech: { id: "tech", name: "Technology", count: "482 Assets", tagline: "SaaS growth, AI adoption, and hardware cycles.", impact: "High", icon: Zap },
  pharma: { id: "pharma", name: "Pharmaceuticals", count: "210 Assets", tagline: "R&D efficiency and regulatory sentinel.", impact: "High", icon: ShieldCheck },
  cosmetics: { id: "cosmetics", name: "Cosmetics", count: "95 Assets", tagline: "Brand equity and consumer sentiment analysis.", impact: "Medium", icon: Sparkles },
  finance: { id: "finance", name: "Finance", count: "340 Assets", tagline: "Global banking and fintech trajectory.", impact: "High", icon: Briefcase },
  retail: { id: "retail", name: "Retail", count: "128 Assets", tagline: "E-commerce and logistics intelligence.", impact: "Medium", icon: TrendingUp },
  real_estate: { id: "real_estate", name: "Real Estate", count: "156 Assets", tagline: "Commercial and residential yield trends.", impact: "Stable", icon: Layers },
  energy: { id: "energy", name: "Renewable Energy", count: "84 Assets", tagline: "Grid parity and clean-tech investment.", impact: "High", icon: Zap },
  aviation: { id: "aviation", name: "Aviation", count: "112 Assets", tagline: "Fleet optimization and fuel hedging.", impact: "Medium", icon: TrendingUp },
  logistics: { id: "logistics", name: "Logistics", count: "204 Assets", tagline: "Global supply chain resilience mapping.", impact: "High", icon: Briefcase },
  agriculture: { id: "agriculture", name: "Agriculture", count: "76 Assets", tagline: "Commodity pricing and agri-tech innovation.", impact: "Stable", icon: Globe },
  media: { id: "media", name: "Media & Ent.", count: "135 Assets", tagline: "Streaming wars and digital content growth.", impact: "Medium", icon: Sparkles },
  healthcare: { id: "healthcare", name: "Healthcare", count: "218 Assets", tagline: "MedTech adoption and patient outcomes.", impact: "High", icon: ShieldCheck },
  insurance: { id: "insurance", name: "Insurance", count: "142 Assets", tagline: "Risk actuary and insure-tech disruption.", impact: "Stable", icon: Layers },
  coal: { id: "coal", name: "Coal Mining", count: "64 Assets", tagline: "Resource management and ESG pressure.", impact: "Medium", icon: TrendingUp },
  printing: { id: "printing", name: "Industrial Printing", count: "42 Assets", tagline: "Digitization and packaging innovation.", impact: "Stable", icon: Layers },
};

interface Message {
  role: "user" | "assistant";
  text: string;
  industrySlug?: string;
}

export default function ConsultancyAgentPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Welcome to Vantage Strategic Chat. I am your agentic consultant. How can I assist your market intelligence research today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleDownload = async (slug: string) => {
    setLoadingId(slug);
    const params = new URLSearchParams({
      company: "Industry Overview",
      industry: slug,
      region: "Global",
      quarter: "Q4"
    });
    window.open(`${BACKEND_URL}/api/report/download/IND-${slug}?${params.toString()}`, "_blank");
    setTimeout(() => setLoadingId(null), 3000);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          history: messages.map(m => ({ role: m.role, text: m.text }))
        })
      });

      const data = await response.json();
      let reply = data.reply;
      
      // Extract Industry Slug
      let industrySlug = undefined;
      const industryMatch = reply.match(/\[INDUSTRY:(.*?)\]/);
      if (industryMatch) {
         industrySlug = industryMatch[1].toLowerCase();
         reply = reply.replace(/\[INDUSTRY:.*?\]/, "").trim();
      }

      const assistantMsg: Message = { 
        role: "assistant", 
        text: reply,
        industrySlug
      };
      
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", text: "I apologize, but I encountered a failure in my intelligence neural-link. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-var(--navbar-height))] bg-slate-950 text-white overflow-hidden">
      {/* Sidebar / Instructions */}
      <div className="hidden lg:flex w-80 border-r border-slate-800/50 flex-col p-6 bg-slate-900/10">
        <div className="flex items-center gap-3 mb-8">
           <div className="h-10 w-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
              <Sparkles className="text-emerald-400 w-5 h-5" />
           </div>
           <h2 className="font-bold text-lg">Agentic Chat</h2>
        </div>
        
        <div className="space-y-6">
           <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Capabilities</h3>
              <ul className="text-xs text-slate-400 space-y-3">
                 <li className="flex gap-2"><div className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 shrink-0" /> Sectoral deep-dives</li>
                 <li className="flex gap-2"><div className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 shrink-0" /> Strategic Masterplans</li>
                 <li className="flex gap-2"><div className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 shrink-0" /> Macro/Micro analysis</li>
              </ul>
           </div>

           <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 px-2">Try Asking</h3>
              <div className="space-y-2">
                 {[
                   "How is the Oil & Gas industry performing?",
                   "Analyze the technology sector headwinds.",
                   "What are the growth drivers for cosmetics?",
                   "Provide an overview of healthcare volatility."
                 ].map((query, i) => (
                   <button 
                     key={i} 
                     onClick={() => setInput(query)}
                     className="w-full text-left p-3 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 text-[11px] text-slate-400 transition-all"
                   >
                     {query}
                   </button>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 custom-scrollbar">
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[80%] flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center border ${
                    msg.role === 'user' ? 'bg-slate-800 border-slate-700' : 'bg-emerald-500/10 border-emerald-500/20'
                  }`}>
                    {msg.role === 'user' ? <User className="w-5 h-5 text-slate-400" /> : <Bot className="w-5 h-5 text-emerald-400" />}
                  </div>
                  
                  <div className="space-y-4">
                    <div className={`p-5 rounded-3xl leading-relaxed text-sm ${
                      msg.role === 'user' 
                        ? 'bg-emerald-600 text-white rounded-tr-none shadow-lg shadow-emerald-900/20' 
                        : 'bg-slate-900/60 text-slate-200 border border-slate-800/50 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>

                    {msg.industrySlug && INDUSTRIES[msg.industrySlug] && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="group bg-slate-900/80 border border-emerald-500/30 rounded-3xl p-6 transition-all backdrop-blur-xl relative overflow-hidden max-w-sm"
                      >
                        <div className="absolute -right-8 -top-8 w-24 h-24 bg-emerald-500/5 rounded-full blur-[40px]" />
                        
                        <div className="flex items-start justify-between mb-6">
                           <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400">
                             {(() => {
                               const Icon = INDUSTRIES[msg.industrySlug].icon;
                               return <Icon className="w-5 h-5" />;
                             })()}
                           </div>
                           <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-[8px] font-black uppercase tracking-widest">
                             {INDUSTRIES[msg.industrySlug].impact} Volatility
                           </span>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-1">{INDUSTRIES[msg.industrySlug].name}</h3>
                        <p className="text-slate-400 text-[11px] mb-6 leading-relaxed">
                          {INDUSTRIES[msg.industrySlug].tagline}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                          <span className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                            <FileText className="w-3 h-3" /> {INDUSTRIES[msg.industrySlug].count}
                          </span>
                          <button
                            onClick={() => handleDownload(msg.industrySlug!)}
                            disabled={loadingId === msg.industrySlug}
                            className="flex items-center gap-2 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 disabled:opacity-50 transition-colors"
                          >
                            {loadingId === msg.industrySlug ? "Synthesizing..." : "Get Verdict"}
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                 <div className="flex gap-4 items-center pl-14">
                    <div className="flex gap-1.5">
                       <span className="w-1.5 h-1.5 bg-emerald-500/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                       <span className="w-1.5 h-1.5 bg-emerald-500/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                       <span className="w-1.5 h-1.5 bg-emerald-500/80 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={scrollRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-slate-800/50 bg-slate-950/50 backdrop-blur-xl">
           <div className="max-w-4xl mx-auto flex gap-4">
              <div className="flex-1 relative group">
                 <input 
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                   placeholder="Ask about an industry or company..."
                   className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-emerald-500/50 transition-all pr-14"
                 />
                 <button 
                   onClick={handleSendMessage}
                   disabled={!input.trim() || isTyping}
                   className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-emerald-500 rounded-xl text-white hover:bg-emerald-400 disabled:opacity-20 transition-all shadow-lg shadow-emerald-500/20"
                 >
                   <Send className="w-4 h-4" />
                 </button>
              </div>
           </div>
           <p className="text-center text-[10px] text-slate-600 mt-4 uppercase tracking-widest font-bold">
             AI Agentic Consultant • Powered by Gemini 1.5 Flash • Contextual RAG Enabled
           </p>
        </div>
      </div>
    </div>
  );
}
