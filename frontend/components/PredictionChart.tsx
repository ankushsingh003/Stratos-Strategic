"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function PredictionChart({ data, summary }: { data: any[], summary?: string }) {
  // Mock data for Phase 1 if none provided
  const chartData = data?.length ? data : [
    { period: 'Q1', revenue: 400, predicted: null },
    { period: 'Q2', revenue: 430, predicted: null },
    { period: 'Q3', revenue: 448, predicted: null },
    { period: 'Q4', revenue: 470, predicted: 470 },
    { period: 'Q1 (F)', revenue: null, predicted: 510 },
    { period: 'Q2 (F)', revenue: null, predicted: 540 },
  ];

  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold">Ensemble Forecast</h3>
          <p className="text-xs text-slate-500 font-mono italic">{summary || "LSTM + Prophet Fusion"}</p>
        </div>
        <div className="flex gap-2">
          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded border border-emerald-500/20 text-[10px] font-bold uppercase">LSTM</span>
          <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded border border-blue-500/20 text-[10px] font-bold uppercase">Prophet</span>
        </div>
      </div>
      <div className="flex-grow w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="period" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
              itemStyle={{ color: '#e2e8f0' }}
            />
            <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="predicted" stroke="#10b981" strokeWidth={3} strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
