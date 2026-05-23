import React, { useState } from 'react';
import { FlaskConical, Droplets, Syringe, RotateCcw } from 'lucide-react';

export default function CalcScreen() {
  const [vialMg, setVialMg] = useState(5);
  const [waterMl, setWaterMl] = useState(2);
  const [doseMcg, setDoseMcg] = useState(250);

  // --- Calculator Logic ---
  const mcgPerMl = (vialMg * 1000) / (waterMl || 1); 
  const unitsToDraw = (doseMcg / (mcgPerMl || 1)) * 100;

  return (
    // MAIN CONTAINER: Dark mode compatible
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 px-6 pt-10 pb-32 font-sans transition-colors duration-300">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-[28px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-none mb-1">Calculator</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Reconstitution & Syringe Math.</p>
        </div>
        
        {/* Reset Button */}
        <button 
          onClick={() => { setVialMg(5); setWaterMl(2); setDoseMcg(250); }}
          className="bg-white dark:bg-slate-800 text-[#3A6DF0] dark:text-[#5CB2F5] p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-transform active:scale-95 hover:bg-blue-50 dark:hover:bg-slate-700"
          title="Reset Calculator"
        >
          <RotateCcw size={22} strokeWidth={2.5} />
        </button>
      </div>

      {/* Premium Result Card */}
      <div className="bg-gradient-to-br from-[#3A6DF0] to-[#5CB2F5] dark:from-blue-900 dark:to-blue-800 p-8 rounded-[32px] shadow-xl shadow-blue-500/20 text-white text-center relative overflow-hidden mb-6 transition-colors duration-300">
        
        <div className="absolute -top-6 -right-6 text-white/10 transform rotate-12 pointer-events-none">
          <Syringe size={140} strokeWidth={1} />
        </div>
        
        <p className="text-blue-100 text-[11px] font-bold uppercase tracking-widest mb-1 relative z-10">Draw to</p>
        
        <div className="flex items-end justify-center gap-1.5 relative z-10">
          <span className="text-7xl font-black tracking-tighter leading-none">{unitsToDraw.toFixed(1) || 0}</span>
          <span className="text-xl font-bold mb-2 text-blue-100">units</span>
        </div>
        
        <p className="text-blue-100 text-xs font-medium mt-3 relative z-10 bg-black/10 inline-block px-3 py-1 rounded-lg">
          = {(doseMcg / mcgPerMl || 0).toFixed(3)} ml on a standard U-100 syringe
        </p>
        
        <div className="mt-6 pt-5 border-t border-white/20 flex justify-between text-sm relative z-10">
          <span className="font-medium text-blue-50"><strong className="text-white font-black text-lg">{(mcgPerMl / 100).toFixed(0)}</strong> mcg/unit</span>
          <span className="font-medium text-blue-50"><strong className="text-white font-black text-lg">{mcgPerMl.toFixed(0)}</strong> mcg/ml</span>
        </div>
      </div>

      {/* Premium Input Form */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-700/50 space-y-6 transition-colors duration-300">
        
        {/* Vial Size */}
        <div>
          <label className="flex items-center gap-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wider">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-1.5 rounded-lg text-[#3A6DF0] dark:text-[#5CB2F5]">
              <FlaskConical size={16} strokeWidth={2.5} />
            </div>
            Peptide Vial Size (mg)
          </label>
          <input 
            type="number" 
            value={vialMg === 0 ? '' : vialMg}
            onChange={(e) => setVialMg(Number(e.target.value))}
            className="w-full border border-slate-200 dark:border-slate-700 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3A6DF0]/20 focus:border-[#3A6DF0] transition-all text-xl font-black text-slate-800"
          />
        </div>

        {/* Water */}
        <div>
          <label className="flex items-center gap-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wider">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-1.5 rounded-lg text-[#3A6DF0] dark:text-[#5CB2F5]">
              <Droplets size={16} strokeWidth={2.5} />
            </div>
            Water Added (ml)
          </label>
          <input 
            type="number" 
            step="any"
            value={waterMl === 0 ? '' : waterMl}
            onChange={(e) => setWaterMl(Number(e.target.value))}
            className="w-full border border-slate-200 dark:border-slate-700 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3A6DF0]/20 focus:border-[#3A6DF0] transition-all text-xl font-black text-slate-800"
          />
        </div>

        {/* Dose */}
        <div>
          <label className="flex items-center gap-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wider">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-1.5 rounded-lg text-[#3A6DF0] dark:text-[#5CB2F5]">
              <Syringe size={16} strokeWidth={2.5} />
            </div>
            Desired Dose (mcg)
          </label>
          <input 
            type="number" 
            value={doseMcg === 0 ? '' : doseMcg}
            onChange={(e) => setDoseMcg(Number(e.target.value))}
            className="w-full border-2 border-blue-100 dark:border-slate-700 rounded-2xl p-4 bg-blue-50/30 dark:bg-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-[#3A6DF0] transition-all text-2xl font-black text-[#3A6DF0] dark:text-[#5CB2F5]"
          />
        </div>

      </div>

    </div>
  );
}