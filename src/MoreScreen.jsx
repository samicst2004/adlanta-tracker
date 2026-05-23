import React, { useState, useEffect } from 'react';
import { db } from './db';
import { Trash2, FileSpreadsheet, User, Edit2, Check, Image as ImageIcon, ChevronRight } from 'lucide-react';

export default function MoreScreen() {
  const [userName, setUserName] = useState('Octavia');
  const [isEditingName, setIsEditingName] = useState(false);
  const [avatarSeed, setAvatarSeed] = useState('Felix');
  const avatarOptions = ['Felix', 'Aneka', 'Mimi', 'Oreo', 'Bella', 'Gizmo'];

  useEffect(() => {
    const savedName = localStorage.getItem('user_name');
    if (savedName) setUserName(savedName);
    
    const savedAvatar = localStorage.getItem('user_avatar');
    if (savedAvatar) setAvatarSeed(savedAvatar);
  }, []);

  const handleSaveName = () => {
    localStorage.setItem('user_name', userName);
    setIsEditingName(false);
  };

  const handleSaveAvatar = (seed) => {
    setAvatarSeed(seed);
    localStorage.setItem('user_avatar', seed);
  };

  const exportToCSV = async () => {
    try {
      const logs = await db.logs.orderBy('date').reverse().toArray();
      if (logs.length === 0) {
        alert("No logs available to export.");
        return;
      }
      let csvContent = "Date,Time,Peptide,Amount,Unit,Status\n";
      logs.forEach(log => {
        const dateObj = new Date(log.date);
        csvContent += `${dateObj.toLocaleDateString()},${dateObj.toLocaleTimeString()},${log.peptideName},${log.amount},${log.unit},${log.status}\n`;
      });
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Tracker_Backup.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const clearAllData = async () => {
    if (window.confirm("WARNING: This will permanently delete all your inventory and logs. Are you sure?")) {
      await db.logs.clear();
      await db.vials.clear();
      window.location.reload(); 
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 px-6 pt-10 pb-32 font-sans transition-colors duration-300">
      
      <div className="mb-8">
        <h2 className="text-[28px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-none mb-1">Settings</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Manage your profile and data.</p>
      </div>

      <div className="space-y-8">
        
        {/* Profile Section */}
        <div>
          <h3 className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 ml-2">Profile Details</h3>
          <div className="bg-white dark:bg-slate-800 rounded-[32px] p-5 shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col gap-6 transition-colors duration-300">
            
            {/* Name Editor */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-[#3A6DF0] to-[#5CB2F5] text-white p-3 rounded-2xl shadow-sm">
                  <User size={24} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Display Name</p>
                  {isEditingName ? (
                    <input 
                      type="text" 
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="border-b-2 border-[#3A6DF0] bg-transparent focus:outline-none text-lg font-bold text-slate-800 dark:text-white w-32 pb-1"
                      autoFocus
                    />
                  ) : (
                    <p className="text-lg font-bold text-slate-800 dark:text-white">{userName}</p>
                  )}
                </div>
              </div>
              
              {isEditingName ? (
                <button onClick={handleSaveName} className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-2.5 rounded-xl transition-transform active:scale-95">
                  <Check size={20} strokeWidth={2.5} />
                </button>
              ) : (
                <button onClick={() => setIsEditingName(true)} className="bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-300 hover:text-[#3A6DF0] p-2.5 rounded-xl transition-colors">
                  <Edit2 size={18} strokeWidth={2.5} />
                </button>
              )}
            </div>

            {/* Avatar Selector */}
            <div className="border-t border-slate-50 dark:border-slate-700/50 pt-4">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <ImageIcon size={12} /> Choose Avatar
              </p>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {avatarOptions.map(seed => (
                  <button 
                    key={seed}
                    onClick={() => handleSaveAvatar(seed)}
                    className={`shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
                      avatarSeed === seed ? 'border-[#3A6DF0] scale-110 shadow-md' : 'border-transparent hover:scale-105 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`} alt={seed} className="w-full h-full bg-slate-100 dark:bg-slate-700" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Data & Backup Section */}
        <div>
          <h3 className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 ml-2">Data & Backup</h3>
          <div className="bg-white dark:bg-slate-800 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-700/50 overflow-hidden transition-colors duration-300">
            <button onClick={exportToCSV} className="w-full flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors active:bg-slate-100 border-b border-slate-50 dark:border-slate-700/50 group">
              <div className="flex items-center gap-4">
                <div className="bg-green-50 dark:bg-green-900/30 text-green-500 dark:text-green-400 p-2.5 rounded-xl transition-colors">
                  <FileSpreadsheet size={22} strokeWidth={2} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-800 dark:text-white text-[15px]">Export Backup</p>
                  <p className="text-[11px] font-medium text-slate-400 mt-0.5">Download logs as CSV</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-slate-300 dark:text-slate-600" />
            </button>
            <button onClick={clearAllData} className="w-full flex items-center justify-between p-5 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors active:bg-red-100 group">
              <div className="flex items-center gap-4">
                <div className="bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 p-2.5 rounded-xl transition-colors">
                  <Trash2 size={22} strokeWidth={2} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-red-500 dark:text-red-400 text-[15px]">Erase All Data</p>
                  <p className="text-[11px] font-medium text-red-400 mt-0.5">Permanently delete logs</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-red-300 dark:text-red-700" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}