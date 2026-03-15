export default function GrowthGauge({ score, label, confidence }: { score: number, label: string, confidence: number }) {
  // Map score (0-1) to rotation (-90 to 90 deg)
  const rotation = -90 + (score * 180);
  
  const getColor = () => {
    if (label === 'Growth') return 'text-emerald-400 bg-emerald-400/20';
    if (label === 'Saturation') return 'text-amber-400 bg-amber-400/20';
    return 'text-rose-400 bg-rose-400/20';
  };

  return (
    <div className="glass-card p-6 flex flex-col items-center justify-center relative overflow-hidden h-full min-h-[320px]">
      <h3 className="text-lg font-medium text-slate-300 mb-6 w-full object-top absolute top-6 left-6">ML Prediction</h3>
      
      {/* Semi-Circle Target Gauge */}
      <div className="relative w-48 h-24 overflow-hidden mt-6">
        <div className="w-48 h-48 border-[20px] border-slate-700 rounded-full border-b-transparent border-r-transparent transform -rotate-45 absolute" />
        <div 
          className="w-48 h-48 border-[20px] border-emerald-500 rounded-full border-b-transparent border-r-transparent absolute origin-center transition-all duration-1000 ease-out" 
          style={{ transform: `rotate(${rotation}deg)` }}
        />
        <div className="absolute font-bold text-center w-full bottom-0 text-3xl">
          {(score ?? 0).toFixed(2)}
        </div>
      </div>
      
      <div className={`mt-6 px-4 py-2 rounded-full font-bold ${getColor()}`}>
        {label} ({((confidence ?? 0) * 100).toFixed(0)}% Conf.)
      </div>
    </div>
  );
}
