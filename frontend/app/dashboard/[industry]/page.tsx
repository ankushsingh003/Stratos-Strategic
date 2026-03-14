"use client";

import { useState, useEffect } from "react";
import GrowthGauge from "@/components/GrowthGauge";
import FactorBreakdown from "@/components/FactorBreakdown";
import PredictionChart from "@/components/PredictionChart";
import LiveSignalFeed from "@/components/LiveSignalFeed";
import ShapExplainer from "@/components/ShapExplainer";
import { ArrowLeft, Loader2, FileText, MessageSquare, TrendingUp, Layers } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Dashboard({ params }: { params: { industry: string } }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            company_name: "Strategy Engine",
            industry: params.industry,
            region: "Global"
          })
        });
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [params.industry]);

  if (loading || !data) {
    return (
      <div className="flex h-screen flex-col items-center justify-center space-y-6">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        >
          <Loader2 className="h-16 w-16 text-emerald-500" />
        </motion.div>
        <motion.h2 
          className="text-2xl text-slate-200 font-semibold"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          Running Orchestrator Pipeline...
        </motion.h2>
        <p className="text-slate-500 text-sm max-w-sm text-center font-mono">
          Querying Pinecone RAG ➔ Executing 4-Model ML Ensemble (TabNet, XGBoost, LSTM, Prophet) ➔ Calling Claude 3.5...
        </p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 max-w-[1600px] mx-auto space-y-8"
    >
      {/* Top Header Information Belt */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 text-emerald-500 text-sm font-semibold uppercase tracking-wider mb-1">
            <Link href="/" className="hover:underline flex items-center gap-1">
              <Layers className="w-3 h-3" /> Industries
            </Link> 
            <span>/</span>
            <span className="flex items-center gap-1"><TrendingUp className="w-4 h-4" /> Live Market Intelligence</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight capitalize select-none flex items-center gap-3">
            {params.industry.replace('-', ' ')} <span className="text-slate-500 font-light">Analysis</span>
          </h1>
        </div>
        
        <div className="flex gap-3">
          <Link href="/" className="glass-card px-5 py-2.5 flex items-center gap-2 hover:bg-slate-800 transition-all font-medium text-sm">
             Switch Industry
          </Link>
          <Link href={data.pdf_url} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl transition-all font-semibold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20">
            <FileText className="w-4 h-4" /> Strategic Report
          </Link>
        </div>
      </header>

      <div className="bento-grid !grid-rows-[repeat(4,minmax(200px,auto))]">
        
        {/* ML Verdict - Main KPI */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="col-span-12 lg:col-span-4 row-span-2 h-full"
        >
          <GrowthGauge 
            score={data.ml_verdict.score} 
            label={data.ml_verdict.label} 
            confidence={data.ml_verdict.confidence} 
          />
        </motion.div>

        {/* Prediction Chart - Large Insight */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="col-span-12 lg:col-span-8 row-span-2 h-full"
        >
          <PredictionChart 
            data={data.ml_verdict.forecast_data || []} 
            summary={data.ml_verdict.forecast_summary}
          /> 
        </motion.div>

        {/* Drivers - Secondary Row */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="col-span-12 md:col-span-6 lg:col-span-3 h-full"
        >
          <FactorBreakdown title="Sector Drivers" factors={data.ml_verdict.feature_contributions || []} />
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="col-span-12 md:col-span-6 lg:col-span-3 h-full"
        >
          <FactorBreakdown title="Sentiment Analysis" factors={[
            { name: "News Sentiment", val: data.ml_verdict.social_sentiment_score || 0.65, suffix: "/1" }
          ]} />
        </motion.div>

        {/* Live Feed - Dynamic Content */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="col-span-12 lg:col-span-6 h-full"
        >
          <LiveSignalFeed industry={params.industry} company="Strategy Engine" />
        </motion.div>

        {/* Explainer - Deep Dive */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="col-span-12 h-full"
        >
          <ShapExplainer 
            method={data.explainability.shap.method}
            summary={data.explainability.shap.summary}
            factors={data.explainability.shap.top_features.map((f: any) => ({
              feature: f.feature.replace(/_/g, ' '),
              importance_pct: f.importance_pct,
              raw_shap: f.raw_shap
            }))}
          />
        </motion.div>
      </div>
    </motion.div>
iv>
      </div>
    </motion.div>
  );
}
