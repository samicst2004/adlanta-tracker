import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db';
import { Plus, Droplets, Trash2, PackageOpen, X } from 'lucide-react';

export default function PlansScreen() {
  const vials = useLiveQuery(() => db.vials.toArray());
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Naya vial add karne ki state
  const [formData, setFormData] = useState({
    peptideName: '',
    totalAmount: '',
    unit: 'mg',
    status: 'Sealed' // Sealed ya In Use
  });

  const handleAddVial = async (e) => {
    e.preventDefault();
    if (!formData.peptideName || !formData.totalAmount) return;

    try {
      await db.vials.add({
        peptideName: formData.peptideName,
        totalAmount: parseFloat(formData.totalAmount),
        remainingAmount: parseFloat(formData.totalAmount),
        unit: formData.unit,
        status: formData.status,
        dateAdded: new Date().toISOString()
      });
      setFormData({ peptideName: '', totalAmount: '', unit: 'mg', status: 'Sealed' });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding vial:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this vial?")) {
      await db.vials.delete(id);
    }
  };

  return (
    // MAIN CONTAINER: Added dark mode classes
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 px-6 pt-10 pb-32 font-sans relative transition-colors duration-300">
      
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-[28px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-none mb-1">Inventory</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Track vials and remaining stock.</p>
        </div>
        
        {/* Premium Add Button */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-[#3A6DF0] to-[#5CB2F5] text-white p-3.5 rounded-2xl shadow-lg shadow-blue-500/30 transition-transform active:scale-95"
        >
          <Plus size={24} strokeWidth={2.5} />
        </button>
      </div>

      {/* Inventory List */}
      <div className="space-y-5">
        {!vials || vials.length === 0 ? (
           <div className="text-center p-12 bg-white dark:bg-slate-800 rounded-[32px] border border-slate-100 dark:border-slate-700/50 shadow-sm mt-4 transition-colors duration-300">
             <div className="bg-slate-50 dark:bg-slate-700/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
               <PackageOpen size={36} className="text-slate-300 dark:text-slate-500" />
             </div>
             <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-1">Stock is Empty</h3>
             <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">Click the + button above to add your first vial.</p>
           </div>
        ) : (
          vials.map(vial => {
            // Progress Bar ki percentage calculation
            const progressPercent = Math.max(0, Math.min(100, (vial.remainingAmount / vial.totalAmount) * 100));
            const isLow = progressPercent < 20; // Agar 20% se kam ho tou red color

            return (
              <div key={vial.id} className="bg-white dark:bg-slate-800 rounded-[32px] p-5 shadow-sm border border-slate-100 dark:border-slate-700/50 relative overflow-hidden group transition-colors duration-300">
                
                {/* Decorative Blur Element */}
                <div className="absolute -right-6 -top-6 w-32 h-32 bg-blue-50 dark:bg-blue-900/20 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

                <div className="flex justify-between items-start mb-5 relative z-10">
                  <div className="flex items-center gap-3.5">
                    <div className={`p-3 rounded-2xl ${vial.status === 'In Use' ? 'bg-blue-50 dark:bg-blue-900/30 text-[#3A6DF0] dark:text-[#5CB2F5]' : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 dark:text-emerald-400'}`}>
                       <Droplets size={24} />
                    </div>
                    <div>
                      <h3 className="text-[17px] font-bold text-slate-800 dark:text-white mb-0.5">{vial.peptideName}</h3>
                      <span className={`text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest ${vial.status === 'In Use' ? 'bg-blue-100/50 dark:bg-blue-900/40 text-[#3A6DF0] dark:text-[#5CB2F5]' : 'bg-emerald-100/50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'}`}>
                        {vial.status}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end">
                    <p className="text-2xl font-black text-slate-800 dark:text-white">
                      {vial.remainingAmount} <span className="text-sm font-bold text-slate-400 dark:text-slate-500 ml-0.5">{vial.unit}</span>
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-0.5">Remaining</p>
                  </div>
                </div>

                {/* Sleek Progress Bar */}
                <div className="relative z-10">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wider">
                     <span>0</span>
                     <span>Total: {vial.totalAmount} {vial.unit}</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${isLow ? 'bg-red-500 dark:bg-red-600' : 'bg-gradient-to-r from-[#5CB2F5] to-[#3A6DF0]'}`} 
                      style={{width: `${progressPercent}%`}}
                    ></div>
                  </div>
                </div>

                {/* Delete Button */}
                <button 
                  onClick={() => handleDelete(vial.id)}
                  className="absolute top-5 right-5 p-2 bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Delete Vial"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* --- ADD NEW VIAL MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-[32px] w-full max-w-sm p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <PackageOpen size={22} className="text-[#3A6DF0]" /> Add to Inventory
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 dark:text-slate-300 hover:text-slate-600 dark:hover:text-slate-100 bg-slate-100 dark:bg-slate-700 p-2 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddVial} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Peptide Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., BPC-157"
                  value={formData.peptideName}
                  onChange={(e) => setFormData({...formData, peptideName: e.target.value})}
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 bg-slate-50/50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3A6DF0]/20 focus:border-[#3A6DF0] transition-all font-medium text-slate-800 dark:text-white"
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Total Amount</label>
                  <input 
                    type="number" 
                    step="any"
                    required
                    placeholder="e.g., 5"
                    value={formData.totalAmount}
                    onChange={(e) => setFormData({...formData, totalAmount: e.target.value})}
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 bg-slate-50/50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3A6DF0]/20 focus:border-[#3A6DF0] transition-all font-medium text-slate-800 dark:text-white"
                  />
                </div>
                <div className="w-[100px]">
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Unit</label>
                  <select 
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 bg-slate-50/50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3A6DF0]/20 focus:border-[#3A6DF0] transition-all appearance-none font-bold text-slate-800 dark:text-white"
                  >
                    <option value="mg">mg</option>
                    <option value="mcg">mcg</option>
                    <option value="IU">IU</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Status</label>
                <div className="flex gap-2">
                  {['Sealed', 'In Use'].map(status => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFormData({...formData, status})}
                      className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all ${
                        formData.status === status 
                        ? 'bg-blue-50 dark:bg-blue-900/30 border-2 border-[#3A6DF0] text-[#3A6DF0] dark:text-[#5CB2F5]' 
                        : 'bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-slate-200 dark:hover:border-slate-600'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-[#3A6DF0] to-[#5CB2F5] text-white font-bold rounded-2xl p-4 mt-4 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all active:scale-95"
              >
                Add to Inventory
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}