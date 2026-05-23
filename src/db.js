import Dexie from 'dexie';

// 1. Database banayen
export const db = new Dexie('PEDTrackerPro');

// 2. Tables aur Indexes define karein
db.version(1).stores({
  // Vials: Medicines ka stock track karega
  vials: '++id, peptideName, totalAmount, remainingAmount, unit, status, openedDate',
  
  // Logs: Daily jo doses li hain
  logs: '++id, vialId, peptideName, amount, unit, date, status'
});

// 3. Default Data Dalna (Jab app pehli dafa chale)
db.on('populate', () => {
  db.vials.bulkAdd([
    { peptideName: 'BPC-157', totalAmount: 5, remainingAmount: 5, unit: 'mg', status: 'Sealed', openedDate: null },
    { peptideName: 'Ipamorelin', totalAmount: 10, remainingAmount: 10, unit: 'mg', status: 'Sealed', openedDate: null },
  ]);
});