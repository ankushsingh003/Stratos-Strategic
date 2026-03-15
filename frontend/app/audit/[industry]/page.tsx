"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  TrendingUp,
  TrendingDown,
  BarChart3,
  DollarSign,
  Loader2,
  Activity,
  ChevronDown,
  ChevronUp,
  FileBarChart2,
} from "lucide-react";

interface Company {
  name: string;
  quarterly_growth_yoy: number;
  balance_sheet: {
    total_assets: number;
    total_liabilities: number;
    equity: number;
  };
  income_statement: {
    revenue: number;
    net_income: number;
    operating_margin: number;
  };
}

interface AuditData {
  industry: string;
  quarter: string;
  market_conditions: { demand_index: number; supply_index: number; inflation_impact: number };
  industry_kpis: Record<string, number>;
  companies: Company[];
}

const fmt = (val: number, isPercent = false) => {
  if (isPercent) return `${(val * 100).toFixed(1)}%`;
  if (Math.abs(val) >= 1000) return `$${(val / 1000).toFixed(1)}B`;
  return `$${val.toFixed(0)}M`;
};

const quarters = ["Q1", "Q2", "Q3", "Q4"];

export default function IndustryAuditPage() {
  const params = useParams();
  const industry = (params?.industry as string) || "printing";
  const [data, setData] = useState<AuditData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedQuarter, setSelectedQuarter] = useState("Q4");
  const [expandedCompany, setExpandedCompany] = useState<string | null>(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  const fetchAudit = async (quarter: string) => {
    setLoading(true);
    setError("");
    setData(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/market/audit/${industry}?quarter=${quarter}`);
      if (!res.ok) throw new Error("Failed to fetch audit data");
      const json = await res.json();
      setData(json);
    } catch (e: any) {
      setError(e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudit(selectedQuarter);
  }, [industry, selectedQuarter]);

  const industryLabel = industry.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-[--navbar-height] px-6 pb-16">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="py-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/50 mb-10">
          <div className="flex items-center gap-4">
            <Link href="/signals" className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FileBarChart2 className="w-5 h-5 text-emerald-400" />
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Full Industry Audit</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">{industryLabel}</h1>
              <p className="text-slate-400 text-sm mt-1">LLM-extracted financial intelligence • Balance Sheets • Income Statements</p>
            </div>
          </div>

          {/* Quarter selector */}
          <div className="flex items-center gap-2 bg-slate-900/50 p-1.5 rounded-xl border border-slate-800">
            {quarters.map((q) => (
              <button
                key={q}
                onClick={() => setSelectedQuarter(q)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedQuarter === q
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
            <p className="text-slate-400 font-mono text-sm animate-pulse">
              Extracting {industryLabel} financial intelligence via Gemini AI...
            </p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="flex flex-col items-center py-20 gap-3 text-red-400">
            <Activity className="w-8 h-8" />
            <p>{error}</p>
            <button onClick={() => fetchAudit(selectedQuarter)} className="text-sm text-emerald-400 underline">Retry</button>
          </div>
        )}

        {/* Data */}
        {data && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

            {/* Market Conditions + KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-4">
                  <BarChart3 className="w-4 h-4 text-blue-400" /> Market Conditions · {data.quarter}
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{(data.market_conditions.demand_index * 100).toFixed(0)}</div>
                    <div className="text-[10px] text-slate-500 uppercase mt-1">Demand Index</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-400">{(data.market_conditions.supply_index * 100).toFixed(0)}</div>
                    <div className="text-[10px] text-slate-500 uppercase mt-1">Supply Index</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-400">{(data.market_conditions.inflation_impact * 100).toFixed(1)}%</div>
                    <div className="text-[10px] text-slate-500 uppercase mt-1">Inflation</div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-4">
                  <Activity className="w-4 h-4 text-emerald-400" /> Sector KPIs
                </h2>
                <div className="space-y-3">
                  {Object.entries(data.industry_kpis).map(([key, val]) => (
                    <div key={key} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-300 capitalize">{key.replace(/_/g, " ")}</span>
                          <span className="text-emerald-400 font-bold">{(Number(val) * 100).toFixed(0)}</span>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
                            style={{ width: `${Math.min(Number(val) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Company Financial Cards */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-violet-400" /> Company Financial Statements
              </h2>
              <div className="space-y-4">
                {data.companies.map((company, i) => {
                  const isExpanded = expandedCompany === company.name;
                  const growthPositive = company.quarterly_growth_yoy >= 0;
                  return (
                    <motion.div
                      key={company.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="bg-slate-900/40 border border-slate-800/50 hover:border-slate-700 rounded-2xl overflow-hidden transition-all"
                    >
                      {/* Header row */}
                      <button
                        onClick={() => setExpandedCompany(isExpanded ? null : company.name)}
                        className="w-full flex items-center justify-between p-5 text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-slate-300">
                            {i + 1}
                          </div>
                          <div>
                            <div className="font-bold text-slate-100">{company.name}</div>
                            <div className="text-xs text-slate-500 mt-0.5">Revenue: {fmt(company.income_statement.revenue)}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className={`text-lg font-bold flex items-center gap-1 justify-end ${growthPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                              {growthPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                              {growthPositive ? '+' : ''}{(company.quarterly_growth_yoy * 100).toFixed(1)}%
                            </div>
                            <div className="text-[10px] text-slate-500 uppercase">YoY Growth</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-blue-400">{fmt(company.income_statement.net_income)}</div>
                            <div className="text-[10px] text-slate-500 uppercase">Net Income</div>
                          </div>
                          {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
                        </div>
                      </button>

                      {/* Expanded financials */}
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="grid grid-cols-1 md:grid-cols-2 gap-6 px-5 pb-6 border-t border-slate-800/50 pt-5"
                        >
                          {/* Balance Sheet */}
                          <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                              <DollarSign className="w-3.5 h-3.5 text-blue-400" /> Balance Sheet
                            </h3>
                            <table className="w-full text-sm">
                              <tbody className="divide-y divide-slate-800/50">
                                <tr>
                                  <td className="py-2 text-slate-400">Total Assets</td>
                                  <td className="py-2 text-right font-bold text-blue-400">{fmt(company.balance_sheet.total_assets)}</td>
                                </tr>
                                <tr>
                                  <td className="py-2 text-slate-400">Total Liabilities</td>
                                  <td className="py-2 text-right font-bold text-red-400">{fmt(company.balance_sheet.total_liabilities)}</td>
                                </tr>
                                <tr>
                                  <td className="py-2 text-slate-400">Shareholders' Equity</td>
                                  <td className="py-2 text-right font-bold text-emerald-400">{fmt(company.balance_sheet.equity)}</td>
                                </tr>
                                <tr>
                                  <td className="py-2 text-slate-500 text-xs">Debt/Equity Ratio</td>
                                  <td className="py-2 text-right text-xs text-amber-400 font-bold">
                                    {(company.balance_sheet.total_liabilities / Math.max(company.balance_sheet.equity, 1)).toFixed(2)}x
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          {/* Income Statement */}
                          <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" /> Income Statement
                            </h3>
                            <table className="w-full text-sm">
                              <tbody className="divide-y divide-slate-800/50">
                                <tr>
                                  <td className="py-2 text-slate-400">Revenue</td>
                                  <td className="py-2 text-right font-bold text-slate-100">{fmt(company.income_statement.revenue)}</td>
                                </tr>
                                <tr>
                                  <td className="py-2 text-slate-400">Net Income</td>
                                  <td className="py-2 text-right font-bold text-emerald-400">{fmt(company.income_statement.net_income)}</td>
                                </tr>
                                <tr>
                                  <td className="py-2 text-slate-400">Operating Margin</td>
                                  <td className="py-2 text-right font-bold text-blue-400">{fmt(company.income_statement.operating_margin, true)}</td>
                                </tr>
                                <tr>
                                  <td className="py-2 text-slate-500 text-xs">YoY Growth</td>
                                  <td className={`py-2 text-right text-xs font-bold ${growthPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {growthPositive ? '+' : ''}{(company.quarterly_growth_yoy * 100).toFixed(1)}%
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
