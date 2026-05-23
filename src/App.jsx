import { useState } from 'react';
import { Home, CalendarCheck, ClipboardList, Calculator, MoreHorizontal } from 'lucide-react';
import PlansScreen from './PlansScreen';
import HomeScreen from './HomeScreen';
import CalcScreen from './CalcScreen';
import MoreScreen from './MoreScreen';
import LogScreen from './LogScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'log', icon: CalendarCheck, label: 'Log' },
    { id: 'plans', icon: ClipboardList, label: 'Plans' },
    { id: 'calc', icon: Calculator, label: 'Calc' },
    { id: 'more', icon: MoreHorizontal, label: 'More' }
  ];

  return (
    // Main container mein dark:bg-slate-900 add kiya hai
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-50 dark:bg-slate-900 relative shadow-2xl overflow-hidden transition-colors duration-300">
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'home' && <HomeScreen setActiveTab={setActiveTab} />}
        {activeTab === 'log' && <LogScreen />}
        {activeTab === 'plans' && <PlansScreen />}
        {activeTab === 'calc' && <CalcScreen />}
        {activeTab === 'more' && <MoreScreen />}
      </main>

      {/* Custom Curved Bottom Navigation Bar - Dark Mode Ready */}
      <nav className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700/50 absolute bottom-0 w-full z-20 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.03)] dark:shadow-black/20 transition-colors duration-300">
        <div className="flex justify-between items-center h-16 px-2 relative">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            // 🌟 Center Floating Button 🌟
            if (index === 2) {
              return (
                <div key={item.id} className="relative w-1/5 flex justify-center h-full">
                  {/* TRICK: border color dark mode mein bg-slate-900 se match karega */}
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`absolute -top-7 flex items-center justify-center w-[72px] h-[72px] rounded-full border-[8px] border-slate-50 dark:border-slate-900 shadow-sm transition-all hover:scale-105 active:scale-95 ${
                      isActive ? 'bg-blue-700 dark:bg-blue-600 text-white' : 'bg-blue-600 dark:bg-[#3A6DF0] text-white'
                    }`}
                  >
                    <Icon size={26} strokeWidth={2.5} />
                  </button>
                </div>
              );
            }

            // Regular Buttons
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center w-1/5 h-full space-y-1 transition-colors ${
                  isActive 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
      
    </div>
  );
}