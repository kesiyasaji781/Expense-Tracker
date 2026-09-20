import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Repeat } from 'lucide-react';

const Recurring = () => {
  const [recurring, setRecurring] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/recurring/');
        setRecurring(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-white">Loading recurring expenses...</div>;

  return (
    <div className="space-y-6">
      <div className="border-b border-white/20 pb-4">
        <h1 className="text-2xl font-bold text-white tracking-wide">Recurring Expenses</h1>
      </div>
      
      <div className="glass-card overflow-hidden">
        {recurring.length > 0 ? (
          <table className="min-w-full divide-y divide-white/20">
            <thead className="bg-white/10 backdrop-blur-md">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-200 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-200 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-200 uppercase tracking-wider">Frequency</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-200 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 bg-white/5">
              {recurring.map((item) => (
                <tr key={item.id} className="hover:bg-white/20 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white border border-white/30 shadow-sm">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.frequency}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-pink-400">-₹{item.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center flex flex-col items-center bg-white/5">
            <div className="bg-white/10 p-4 rounded-full mb-4 border border-white/20 shadow-lg">
              <Repeat className="h-10 w-10 text-white opacity-70" />
            </div>
            <p className="text-gray-300 font-medium text-lg">You haven't added any recurring expenses yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recurring;
