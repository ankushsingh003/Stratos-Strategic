"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Send,
  User,
  Bot,
  Loader2,
  Zap,
  TrendingUp,
  BarChart3,
  Building2,
  Globe,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const SUGGESTED_QUESTIONS = [
  "What is ExxonMobil's market share in the oil industry?",
  "Compare JPMorgan Chase vs Goldman Sachs financials",
  "What are the top risks in the pharmaceutical sector?",
  "Give me a competitive analysis of the aviation industry",
  "What is Heidelberg's position in the printing market?",
  "Forecast the renewable energy sector for 2025",
];

function MarkdownText({ text }: { text: string }) {
  // Simple inline markdown renderer
  const lines = text.split("\n");
  return (
    <div className="space-y-1.5 leading-relaxed">
      {lines.map((line, i) => {
        if (line.startsWith("## ")) return <h3 key={i} className="font-bold text-slate-100 text-base mt-3 mb-1">{line.slice(3)}</h3>;
        if (line.startsWith("# ")) return <h2 key={i} className="font-bold text-white text-lg mt-4 mb-1">{line.slice(2)}</h2>;
        if (line.startsWith("- ") || line.startsWith("• ")) {
          return (
            <div key={i} className="flex gap-2 text-slate-300">
              <span className="text-emerald-400 mt-1 flex-shrink-0">•</span>
              <span>{line.slice(2).replace(/\*\*(.*?)\*\*/g, "$1")}</span>
            </div>
          );
        }
        if (line.match(/^\d+\. /)) {
          return (
            <div key={i} className="flex gap-2 text-slate-300">
              <span className="text-blue-400 font-bold flex-shrink-0">{line.match(/^\d+/)?.[0]}.</span>
              <span>{line.replace(/^\d+\. /, "").replace(/\*\*(.*?)\*\*/g, "$1")}</span>
            </div>
          );
        }
        if (!line.trim()) return <div key={i} className="h-1" />;
        // Bold text inline
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={i} className="text-slate-300">
            {parts.map((part, j) =>
              j % 2 === 1 ? <strong key={j} className="text-slate-100 font-semibold">{part}</strong> : part
            )}
          </p>
        );
      })}
    </div>
  );
}

export default function ChatPage() {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hello! I'm **Vantage AI** — your elite market intelligence consultant.\n\nI can answer questions about any industry, company financials, competitive landscapes, risks, and strategic opportunities.\n\n**Try asking:**\n- What is ExxonMobil's market position?\n- Compare pharma giants: Pfizer vs Roche\n- Top investment risks in the finance sector",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = messages.slice(-6); // Send last 6 messages as context
      const res = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `**Connection Error**: Unable to reach the analysis engine. Please ensure the backend is running.\n\n_Error: ${err.message}_`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 rounded-xl hover:bg-slate-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Bot className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="font-bold text-slate-100">Vantage AI Consultant</h1>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Zap className="w-3 h-3 text-emerald-400" /> Powered by Gemini 1.5 Flash · Universal Industry RAG
              </p>
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
          <Globe className="w-3.5 h-3.5" /> 16 Industries · Real-time Intelligence
        </div>
      </header>

      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Suggested questions (only show when just greeting visible) */}
        {messages.length === 1 && (
          <div className="px-4 pt-6 pb-2">
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-3 font-bold">Quick Questions</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-left p-3 rounded-xl bg-slate-900/60 border border-slate-800/50 hover:border-emerald-500/30 hover:bg-slate-800/60 transition-all text-sm text-slate-400 hover:text-slate-200"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    msg.role === "user"
                      ? "bg-blue-600"
                      : "bg-emerald-500/10 border border-emerald-500/20"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-emerald-400" />
                  )}
                </div>

                <div
                  className={`max-w-[80%] px-5 py-4 rounded-2xl text-sm ${
                    msg.role === "user"
                      ? "bg-blue-600/20 border border-blue-500/20 text-blue-100 rounded-tr-sm"
                      : "bg-slate-900/60 border border-slate-800/50 rounded-tl-sm"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <MarkdownText text={msg.text} />
                  ) : (
                    <p>{msg.text}</p>
                  )}
                </div>
              </motion.div>
            ))}

            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20">
                  <Bot className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="bg-slate-900/60 border border-slate-800/50 rounded-2xl rounded-tl-sm px-5 py-4">
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                    Analyzing market intelligence...
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Capability pills */}
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto">
          {[
            { icon: <BarChart3 className="w-3 h-3" />, label: "Market Share" },
            { icon: <Building2 className="w-3 h-3" />, label: "Balance Sheets" },
            { icon: <TrendingUp className="w-3 h-3" />, label: "Forecasts" },
            { icon: <Globe className="w-3 h-3" />, label: "16 Industries" },
          ].map((p) => (
            <div
              key={p.label}
              className="flex items-center gap-1.5 text-[10px] text-slate-500 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full whitespace-nowrap"
            >
              {p.icon} {p.label}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="px-4 pb-6">
          <div className="flex gap-3 bg-slate-900 border border-slate-700 rounded-2xl p-2 focus-within:border-emerald-500/50 transition-colors">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
              placeholder="Ask about any industry, company, or market trend..."
              className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none"
              disabled={loading}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors text-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
