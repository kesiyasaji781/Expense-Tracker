import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import api from '../services/api';

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    amount: '', source: 'Salary', description: '', date: new Date().toISOString().split('T')[0]
  });

  const fetchIncomes = async () => {
    try {
      const res = await api.get('/income/');
      setIncomes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/income/', { ...formData, amount: parseFloat(formData.amount) });
      setShowForm(false);
      setFormData({ amount: '', source: 'Salary', description: '', date: new Date().toISOString().split('T')[0] });
      fetchIncomes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this income?')) {
      try {
        await api.delete(`/income/${id}`);
        fetchIncomes();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <div className="text-white">Loading income...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-white/20 pb-4">
        <h1 className="text-2xl font-bold text-white tracking-wide">Income</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center bg-green-500/80 backdrop-blur-md text-white border border-white/20 px-4 py-2 rounded-xl hover:bg-green-500 transition-colors shadow-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Income
        </button>
      </div>

      {showForm && (
        <div className="glass-card p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-4">New Income</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200">Amount (₹)</label>
              <input type="number" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="mt-1 block w-full rounded-xl bg-white/10 border-white/20 text-white shadow-sm focus:border-green-400 focus:ring-green-400 p-2.5 backdrop-blur-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200">Source</label>
              <select value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})} className="mt-1 block w-full rounded-xl bg-white/10 border-white/20 text-white shadow-sm focus:border-green-400 focus:ring-green-400 p-2.5 backdrop-blur-sm [&>option]:text-gray-900">
                <option>Salary</option>
                <option>Freelance</option>
                <option>Business</option>
                <option>Investment</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200">Description</label>
              <input type="text" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="mt-1 block w-full rounded-xl bg-white/10 border-white/20 text-white shadow-sm focus:border-green-400 focus:ring-green-400 p-2.5 backdrop-blur-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200">Date</label>
              <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="mt-1 block w-full rounded-xl bg-white/10 border-white/20 text-white shadow-sm focus:border-green-400 focus:ring-green-400 p-2.5 backdrop-blur-sm [&::-webkit-calendar-picker-indicator]:filter-invert" />
            </div>
            <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-white/20 rounded-xl text-gray-200 hover:bg-white/10 backdrop-blur-sm transition-colors">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-green-500/80 backdrop-blur-sm text-white rounded-xl hover:bg-green-500 transition-colors shadow-lg border border-white/20">Save Income</button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/20">
            <thead className="bg-white/10 backdrop-blur-md">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-200 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-200 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-200 uppercase tracking-wider">Source</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-200 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-200 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 bg-white/5">
              {incomes.map((income) => (
                <tr key={income.id} className="hover:bg-white/20 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">{income.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">{income.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white border border-white/30 shadow-sm">
                      {income.source}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-green-400">+₹{income.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <button onClick={() => handleDelete(income.id)} className="text-gray-400 hover:text-pink-500 transition-colors bg-white/10 p-2 rounded-lg"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
              {incomes.length === 0 && (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-400 font-medium bg-white/5">No income found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Income;
