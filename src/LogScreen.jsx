import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db';
import { ChevronLeft, ChevronRight, Activity, CheckCircle2, Sun, Moon } from 'lucide-react';

export default function LogScreen() {
  const [view, setView] = useState('Week'); 
  const logs = useLiveQuery(() => db.logs.orderBy('date').reverse().toArray());

  // --- 🧠 DYNAMIC LOGIC ENGINE FOR STATS ---
  const today = new Date();
  
  // Is hafte ke logs nikalna
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday se start
  startOfWeek.setHours(0,0,0,0);
  
  const weekLogs = logs?.filter(log => new Date(log.date) >= startOfWeek) || [];
  
  // Stats Calculate karna (Assuming 7 doses a week target)
  const takenCount = weekLogs.length;
  const pendingCount = Math.max(0, 7 - takenCount);
  const adherence = Math.round((takenCount / 7) * 100) || 0;

  // Bar Chart Data
  const days = ['M','T','W','T','F','S','S'];
  const activeBars = [false, false, false, false, false, false, false];
  
  weekLogs.forEach(log => {
    let dayIndex = new Date(log.date).getDay() - 1;
    if (dayIndex === -1) dayIndex = 6; // Sunday ki adjustment
    activeBars[dayIndex] = true;
  });

  // Logs ko Date ke hisaab se group karna
  const groupedLogs = logs?.reduce((acc, log) => {
    const dateObj = new Date(log.date);
    const dateKey = dateObj.toDateString(); 
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(log);
    return acc;
  }, {});

  return (
    // MAIN CONTAINER: Added dark mode background and text classes
    <div className="space-y-6 relative pb-28 px-6 pt-8 font-sans bg-slate-50 dark:bg-slate-900 min-h-screen transition-colors duration-300">
      
      {/* Top Header & View Toggles */}
      <div className="flex flex-col gap-4">
        <h2 className="text-[28px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">Week Overview</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">May 19 – May 25 • Log Details</p>
        
        <div className="bg-slate-100/70 dark:bg-slate-800 p-1 rounded-xl flex gap-1 inline-flex w-fit border border-slate-200/60 dark:border-slate-700 mt-2 transition-colors duration-300">
          {['Day', 'Week', 'Month'].map(v => (
            <button 
              key={v}
              onClick={() => setView(v)}
              className={`px-6 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                view === v 
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-600' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Date Navigator */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 shadow-sm border border-slate-100 dark:border-slate-700/50 flex items-center justify-between transition-colors duration-300">
        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400 transition-colors"><ChevronLeft size={20}/></button>
        <div className="text-center">
          <h3 className="font-bold text-slate-900 dark:text-white text-[15px]">May 19 – May 25</h3>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold tracking-widest uppercase mt-0.5">2026</p>
        </div>
        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400 transition-colors"><ChevronRight size={20}/></button>
      </div>

      {/* DYNAMIC Adherence / Stats Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50 transition-colors duration-300">
        <div className="flex gap-8 items-center border-b border-slate-50 dark:border-slate-700/50 pb-6 mb-6">
          <div className="flex items-baseline gap-1 text-[#3A6DF0] dark:text-[#5CB2F5]">
            <span className="text-6xl font-black tracking-tighter">{adherence}</span>
            <span className="text-2xl font-bold text-slate-400 dark:text-slate-500">%</span>
          </div>
          <div className="space-y-2 w-full">
            <div className="flex justify-between items-center text-sm">
              <span className="font-black text-slate-800 dark:text-white text-lg">{takenCount}</span> 
              <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold tracking-widest uppercase">Taken</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-black text-slate-800 dark:text-white text-lg">{pendingCount}</span> 
              <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold tracking-widest uppercase">Pending</span>
            </div>
          </div>
        </div>

        {/* DYNAMIC Weekly Bar Graph */}
        <div className="flex justify-between items-end h-16 px-1">
          {days.map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-2.5">
              <div className={`w-3.5 rounded-full transition-all duration-500 ${activeBars[i] ? 'bg-[#3A6DF0] h-14' : 'bg-slate-100 dark:bg-slate-700 h-6'}`}></div>
              <span className={`text-[10px] font-bold ${activeBars[i] ? 'text-slate-800 dark:text-slate-200' : 'text-slate-300 dark:text-slate-600'}`}>{day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grouped Daily Logs List */}
      <div className="space-y-5">
        {!groupedLogs || Object.keys(groupedLogs).length === 0 ? (
           <div className="text-center p-10 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm mt-4 transition-colors duration-300">
             <Activity size={36} className="mx-auto text-slate-200 dark:text-slate-600 mb-4" />
             <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">No activity found for this week.</p>
           </div>
        ) : (
          Object.keys(groupedLogs).map(dateKey => {
            const dateObj = new Date(dateKey);
            const dayName = dateObj.toLocaleDateString(undefined, { weekday: 'long' });
            const dayNum = dateObj.getDate();
            const monthYear = dateObj.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
            const dayLogs = groupedLogs[dateKey];

            return (
              <div key={dateKey} className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/50 overflow-hidden transition-colors duration-300">
                
                <div className="p-4 border-b border-slate-50 dark:border-slate-700/50 flex justify-between items-center bg-slate-50/30 dark:bg-slate-800/50">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 dark:bg-blue-900/30 text-[#3A6DF0] dark:text-[#5CB2F5] font-bold rounded-2xl w-11 h-11 flex items-center justify-center text-lg">
                      {dayNum}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white text-sm">{dayName}</h4>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">{monthYear}</p>
                    </div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-100 dark:border-transparent text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                    {dayLogs.length} Doses
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  {dayLogs.map(log => {
                    const logHour = new Date(log.date).getHours();
                    const isMorning = logHour < 12;
                    const timeStr = new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    return (
                      <div key={log.id} className="border border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl p-4 relative overflow-hidden transition-colors duration-300">
                        
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isMorning ? 'bg-orange-300 dark:bg-orange-500' : 'bg-indigo-300 dark:bg-indigo-500'}`}></div>
                        
                        <div className="flex justify-between items-center mb-3 ml-2">
                          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            {isMorning ? <Sun size={14} className="text-orange-400 dark:text-orange-500"/> : <Moon size={14} className="text-indigo-400 dark:text-indigo-500"/>}
                            {isMorning ? 'Morning' : 'Evening'}
                          </div>
                          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg">
                            {timeStr}
                          </span>
                        </div>

                        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-xl p-3.5 shadow-sm ml-2 transition-colors duration-300">
                          <div className="flex justify-between items-center mb-1">
                            <h5 className="font-bold text-slate-800 dark:text-white text-sm">{log.peptideName}</h5>
                            <CheckCircle2 size={16} className="text-green-500 dark:text-green-400" />
                          </div>
                          <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-xl font-black text-slate-800 dark:text-white">{log.amount}</span>
                            <span className="text-xs font-bold text-[#3A6DF0] dark:text-[#5CB2F5]">{log.unit}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}