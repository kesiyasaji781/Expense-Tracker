import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const [expenseRes, incomeRes] = await Promise.all([
          api.get('/expenses/'),
          api.get('/income/')
        ]);
        
        const combined = [
          ...expenseRes.data.map(e => ({ ...e, type: 'expense' })),
          ...incomeRes.data.map(i => ({ ...i, category: i.source, type: 'income' }))
        ];
        
        combined.sort((a, b) => new Date(b.date) - new Date(a.date));
        setTransactions(combined);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactions();
  }, []);

  if (loading) return <div className="text-white">Loading transactions...</div>;

  return (
    <div className="space-y-6">
      <div className="border-b border-white/20 pb-4">
        <h1 className="text-2xl font-bold text-white tracking-wide">All Transactions</h1>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/20">
            <thead className="bg-white/10 backdrop-blur-md">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-200 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-200 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-200 uppercase tracking-wider">Category/Source</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-200 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-200 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 bg-white/5">
              {transactions.map((t, idx) => (
                <tr key={`${t.type}-${t.id}-${idx}`} className="hover:bg-white/20 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">{t.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${t.type === 'income' ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-pink-500/20 text-pink-300 border-pink-500/30'}`}>
                      {t.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{t.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">{t.description}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-bold ${t.type === 'income' ? 'text-green-400' : 'text-pink-400'}`}>
                    {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-400 font-medium bg-white/5">No transactions found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
