import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db';
import { Bell, Activity, Droplets, ChevronRight, X, Moon, Sun } from 'lucide-react';

export default function HomeScreen({ setActiveTab }) {
  const vials = useLiveQuery(() => db.vials.toArray());
  const logs = useLiveQuery(() => db.logs.toArray());

  const [userName, setUserName] = useState('Muhammad');
  const [avatarSeed, setAvatarSeed] = useState('Felix');
  const [showNotif, setShowNotif] = useState(false); 
  
  // --- DARK MODE STATE ---
  const [isDark, setIsDark] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ vialId: '', amount: '', unit: 'mcg' });

  useEffect(() => {
    const savedName = localStorage.getItem('user_name');
    if (savedName) setUserName(savedName);

    const savedAvatar = localStorage.getItem('user_avatar');
    if (savedAvatar) setAvatarSeed(savedAvatar);

    // --- DARK MODE CHECKER ---
    // Check karna ke user ne pehle se dark mode on kiya hua hai ya nahi
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  // --- DARK MODE TOGGLE FUNCTION ---
  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const sortedLogs = logs?.slice().sort((a, b) => new Date(b.date) - new Date(a.date)) || [];
  const recentLog = sortedLogs[0];
  const nextDoseName = recentLog ? recentLog.peptideName : (vials?.[0]?.peptideName || "Add Inventory");

  const activeVial = vials?.find(v => v.peptideName === nextDoseName) || vials?.[0];
  const remainingAmt = activeVial ? activeVial.remainingAmount : 0;
  const totalAmt = activeVial ? activeVial.totalAmount : 0;
  const unit = activeVial ? activeVial.unit : '';

  const progressPercent = totalAmt > 0 ? (remainingAmt / totalAmt) : 0;
  const dashOffset = 301.59 - (301.59 * progressPercent);

  const toggleNotifications = () => setShowNotif(!showNotif);

  const handleLogDose = async (e) => {
    e.preventDefault();
    if (!formData.vialId || !formData.amount) return;

    try {
      const vial = await db.vials.get(Number(formData.vialId));
      if (!vial) return;

      let deductAmount = parseFloat(formData.amount);
      if (vial.unit === 'mg' && formData.unit === 'mcg') {
        deductAmount = deductAmount / 1000;
      } else if (vial.unit === 'mcg' && formData.unit === 'mg') {
        deductAmount = deductAmount * 1000;
      }

      const newRemaining = vial.remainingAmount - deductAmount;
      if (newRemaining < 0) {
        alert("Not enough amount in the vial!");
        return;
      }

      await db.vials.update(vial.id, { remainingAmount: newRemaining });
      await db.logs.add({
        vialId: vial.id,
        peptideName: vial.peptideName,
        amount: parseFloat(formData.amount),
        unit: formData.unit,
        date: new Date().toISOString(),
        status: 'Taken'
      });

      setFormData({ vialId: '', amount: '', unit: 'mcg' });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error logging dose:", error);
    }
  };

  return (
    // 'dark:bg-slate-900' se poora background dark ho jayega
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 mt-0 mx-0 pb-20 font-sans transition-colors duration-300">
      
      {/* 1. Gradient Header */}
      <div className="bg-gradient-to-br from-[#4A88F8] via-[#5CB2F5] to-[#A3E5AC] dark:from-blue-900 dark:via-blue-800 dark:to-emerald-900 pt-14 pb-24 px-6 relative rounded-b-[40px] shadow-sm transition-colors duration-300">
        
        <div className="flex justify-between items-center mb-6">
          <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/30 text-white">
             <span className="text-xs font-medium">Status</span>
             <span className="text-xs opacity-80 uppercase tracking-wider font-bold text-emerald-100">• Active</span>
          </div>
          
          <div className="flex items-center gap-4 relative">
            
            {/* --- DARK MODE TOGGLE BUTTON --- */}
            <button 
              onClick={toggleDarkMode} 
              className="text-white bg-white/10 p-2 rounded-full border border-white/30 backdrop-blur-md transition-transform active:scale-95"
            >
              {isDark ? <Sun size={18} fill="currentColor" /> : <Moon size={18} fill="currentColor" />}
            </button>

            <button onClick={toggleNotifications} className="text-white relative transition-transform active:scale-95">
              <Bell size={22} fill="currentColor" />
              <div className="absolute top-0 right-0 w-2 h-2 bg-white rounded-full"></div>
            </button>
            
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/50 bg-white">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`} alt="Profile" className="w-full h-full object-cover bg-slate-100 dark:bg-slate-800" />
            </div>

            {showNotif && (
              <div className="absolute top-10 right-0 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 p-3 z-50 animate-in fade-in zoom-in-95 duration-200">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">Notifications</p>
                {logs?.length === 0 ? (
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">No recent activity.</p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[10px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 p-2 rounded-lg border border-slate-100 dark:border-slate-600">
                      Last log: {recentLog?.peptideName} ({recentLog?.amount}{recentLog?.unit})
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="text-white mb-2">
          <h2 className="text-xl font-medium opacity-90">Hi {userName},</h2>
          <h1 className="text-[26px] leading-tight font-semibold mt-1">this is your recent usage</h1>
        </div>

        {/* Floating Card - Added dark mode classes */}
        <div className="absolute -bottom-8 left-6 right-6 bg-white dark:bg-slate-800 rounded-3xl p-4 shadow-xl shadow-blue-900/10 dark:shadow-black/40 flex justify-between items-center transition-colors duration-300">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900/50 p-2.5 rounded-xl text-blue-600 dark:text-blue-400">
               <Activity size={22} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 dark:text-slate-400 font-medium">Next Dose</p>
              <p className="text-lg font-bold text-slate-800 dark:text-white">{nextDoseName}</p>
            </div>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="bg-[#3A6DF0] text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md active:scale-95 transition-transform"
          >
            + Log Now
          </button>
        </div>
      </div>

      <div className="h-14"></div>

      {/* 2. DYNAMIC Progress Card */}
      <div className="px-6">
        <div className="bg-white dark:bg-slate-800 rounded-[32px] p-5 shadow-sm border border-slate-100 dark:border-slate-700/50 flex items-center justify-between transition-colors duration-300">
          <div className="flex flex-col h-full justify-between gap-4">
            <div className="flex gap-2">
              <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase">In Use</span>
              <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase">Weekly</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-green-100 dark:bg-green-900/30 text-green-500 dark:text-green-400 p-2 rounded-xl">
                <Droplets size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white leading-tight">Vial Progress</h3>
                <p className="text-[11px] text-slate-400 dark:text-slate-400 font-medium">Remaining Amount</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 dark:text-slate-400 font-medium">Active Status</p>
              <p className="text-sm font-bold text-slate-800 dark:text-white">{activeVial?.status || 'No Active Vial'}</p>
            </div>
          </div>

          <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
             <svg className="w-full h-full transform -rotate-90">
               <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-[#E2E8F0] dark:text-slate-700" />
               <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="10" fill="transparent" 
                       strokeDasharray={301.59} strokeDashoffset={dashOffset} 
                       className="text-[#3A6DF0] transition-all duration-1000" strokeLinecap="round" />
             </svg>
             <div className="absolute flex flex-col items-center justify-center">
               <span className="text-2xl font-black text-slate-800 dark:text-white">{remainingAmt}</span>
               <span className="text-[10px] font-bold text-slate-400">/ {totalAmt} {unit}</span>
             </div>
          </div>
        </div>
      </div>

      {/* 3. DYNAMIC Inventory Stock */}
      <div className="mt-6 px-6 pb-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Inventory Stock</h3>
          <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold cursor-pointer" onClick={() => setActiveTab('plans')}>See All</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {!vials || vials.length === 0 ? (
            <p className="text-slate-400 dark:text-slate-500 text-sm col-span-2">Your inventory is empty. Go to Library to add vials.</p>
          ) : (
            vials.slice(0, 2).map(vial => (
              <div key={vial.id} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-3xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[140px] transition-colors duration-300">
                 {vial.remainingAmount <= (vial.totalAmount * 0.2) && (
                   <div className="absolute top-0 left-0 w-full h-1 bg-red-400 dark:bg-red-500"></div>
                 )}
                 <div className="flex items-center gap-2 mb-2">
                   <div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded-lg text-green-500 dark:text-green-400">
                      <Droplets size={16} />
                   </div>
                   <div>
                     <h4 className="font-bold text-slate-800 dark:text-white text-sm truncate">{vial.peptideName}</h4>
                     <p className="text-[10px] text-slate-400 dark:text-slate-400">Stock Active</p>
                   </div>
                 </div>
                 <div className="mt-auto">
                   <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-0.5">Remaining</p>
                   <div className="flex justify-between items-center">
                     <span className="text-base font-black text-slate-800 dark:text-white">{vial.remainingAmount} {vial.unit}</span>
                     <ChevronRight size={14} className="text-slate-400 dark:text-slate-500" />
                   </div>
                 </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- ADD DOSE MODAL (POPUP) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity size={20} className="text-[#3A6DF0]" /> Log New Dose
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-700 p-1.5 rounded-full">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleLogDose} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Select Peptide</label>
                <select 
                  required
                  value={formData.vialId}
                  onChange={(e) => setFormData({...formData, vialId: e.target.value})}
                  className="w-full border border-slate-200 dark:border-slate-600 rounded-xl p-3 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3A6DF0]/50 transition-all appearance-none"
                >
                  <option value="" disabled>Select from inventory...</option>
                  {vials?.map(vial => (
                    <option key={vial.id} value={vial.id}>
                      {vial.peptideName} ({vial.remainingAmount}{vial.unit} left)
                    </option>
                  ))}
                </select>
                {vials?.length === 0 && <p className="text-xs text-red-500 mt-1">Please add a vial in Library first.</p>}
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Dose Amount</label>
                  <input 
                    type="number" 
                    step="any"
                    required
                    placeholder="e.g., 250"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="w-full border border-slate-200 dark:border-slate-600 rounded-xl p-3 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3A6DF0]/50 transition-all"
                  />
                </div>
                <div className="w-1/3">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Unit</label>
                  <select 
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    className="w-full border border-slate-200 dark:border-slate-600 rounded-xl p-3 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3A6DF0]/50 transition-all appearance-none"
                  >
                    <option value="mcg">mcg</option>
                    <option value="mg">mg</option>
                    <option value="IU">IU</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={vials?.length === 0}
                className="w-full bg-[#3A6DF0] text-white font-semibold rounded-xl p-3.5 mt-2 hover:bg-blue-700 transition active:scale-95 disabled:bg-slate-500 disabled:scale-100"
              >
                Confirm Log
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}