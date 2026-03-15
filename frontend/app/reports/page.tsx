"use client";

import { useEffect, useState } from "react";
import { 
  FileText, 
  Download, 
  ExternalLink, 
  Clock, 
  ChevronRight,
  Search,
  Filter,
  ArrowDownToLine,
  BarChart3,
  ShieldAlert
} from "lucide-react";
import { motion } from "framer-motion";

interface Report {
  id: string;
  company_name: string;
  industry: string;
  generated_at: string;
  status: "ready" | "processing";
  risk_level: "low" | "medium" | "high";
}

const mockReports: Report[] = [
  { id: "REP-001", company_name: "Heidelberg Materials", industry: "Printing", generated_at: "2024-03-15", status: "ready", risk_level: "medium" },
  { id: "REP-002", company_name: "Pfizer Inc", industry: "Pharma", generated_at: "2024-03-14", status: "ready", risk_level: "low" },
  { id: "REP-003", company_name: "Nvidia", industry: "Tech", generated_at: "2024-03-12", status: "ready", risk_level: "high" },
  { id: "REP-004", company_name: "L'Oreal", industry: "Cosmetics", generated_at: "2024-03-10", status: "ready", risk_level: "medium" },
];

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [searchQuery, setSearchQuery] = useState("");

  const handleDownload = (report: Report) => {
    const params = new URLSearchParams({
      company: report.company_name,
      industry: report.industry.toLowerCase(),
      region: "Global",
      quarter: "Q4"
    });
    window.open(`http://localhost:8000/api/report/download/${report.id}?${params.toString()}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-[--navbar-height] px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 py-8 border-b border-slate-800/50">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                <FileText className="text-emerald-400 w-5 h-5" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Intelligence Assets</h1>
            </div>
            <p className="text-slate-400 text-sm max-w-xl">
              Access generated strategic reports, financial deep-dives, and consultancy verdicts 
              synthesized by the Vantage AI engine.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
              <input 
                type="text"
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-900/50 border border-slate-800/80 rounded-full py-2.5 pl-11 pr-6 text-sm focus:outline-none focus:border-emerald-500/50 transition-all w-64"
              />
            </div>
          </div>
        </header>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800/50 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-2 text-slate-500">
               <ArrowDownToLine className="w-4 h-4" />
               <span className="text-[10px] uppercase font-bold tracking-widest">Total Downloads</span>
            </div>
            <div className="text-2xl font-bold">1,284</div>
          </div>
          <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800/50 backdrop-blur-xl">
             <div className="flex items-center gap-3 mb-2 text-slate-500">
               <ShieldAlert className="w-4 h-4 text-amber-500" />
               <span className="text-[10px] uppercase font-bold tracking-widest">High Risk Alerts</span>
            </div>
            <div className="text-2xl font-bold">12 Active</div>
          </div>
           <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800/50 backdrop-blur-xl">
             <div className="flex items-center gap-3 mb-2 text-slate-500">
               <BarChart3 className="w-4 h-4 text-emerald-500" />
               <span className="text-[10px] uppercase font-bold tracking-widest">Sector Coverage</span>
            </div>
            <div className="text-2xl font-bold">4 Industries</div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 gap-4">
          {reports
            .filter(r => r.company_name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((report) => (
            <motion.div 
              key={report.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="group bg-slate-900/30 hover:bg-slate-900/60 border border-slate-800/50 hover:border-emerald-500/30 p-5 rounded-2xl transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-6">
                <div className="h-14 w-14 bg-slate-950 rounded-xl flex items-center justify-center border border-slate-800 group-hover:border-emerald-500/20 transition-colors">
                  <FileText className="text-slate-500 group-hover:text-emerald-400 w-6 h-6" />
                </div>
                
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-slate-200 group-hover:text-white transition-colors">
                      {report.company_name} - Strategic Analysis
                    </h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter
                      ${report.risk_level === 'high' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                        report.risk_level === 'medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                        'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}
                    `}>
                      {report.risk_level} Risk
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {report.generated_at}</span>
                    <span className="flex items-center gap-1.5 uppercase tracking-widest font-bold text-[9px] text-slate-600">{report.industry} Sector</span>
                    <span className="text-slate-700">|</span>
                    <span className="text-slate-600 font-mono">{report.id}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDownload(report)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-950 hover:bg-emerald-500 text-slate-300 hover:text-white border border-slate-800 hover:border-emerald-600 rounded-xl transition-all font-medium text-sm group/btn"
                >
                  <Download className="w-4 h-4 group-hover/btn:animate-bounce" />
                  Download PDF
                </button>
                <button className="p-2 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors text-slate-500 hover:text-white">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {reports.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-slate-600">
            <Filter className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-lg">No reports matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
