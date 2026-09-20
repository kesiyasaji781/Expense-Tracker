import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import api from '../services/api';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    amount: '', category: 'Food', description: '', date: new Date().toISOString().split('T')[0], payment_method: 'UPI'
  });

  const fetchExpenses = async () => {
    try {
      const res = await api.get('/expenses/');
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/expenses/', { ...formData, amount: parseFloat(formData.amount) });
      setShowForm(false);
      setFormData({ amount: '', category: 'Food', description: '', date: new Date().toISOString().split('T')[0], payment_method: 'UPI' });
      fetchExpenses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await api.delete(`/expenses/${id}`);
        fetchExpenses();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <div className="text-white">Loading expenses...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-white/20 pb-4">
        <h1 className="text-2xl font-bold text-white tracking-wide">Expenses</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center bg-purple-600/80 backdrop-blur-md text-white border border-white/20 px-4 py-2 rounded-xl hover:bg-purple-600 transition-colors shadow-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Expense
        </button>
      </div>

      {showForm && (
        <div className="glass-card p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-4">New Expense</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200">Amount (₹)</label>
              <input type="number" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="mt-1 block w-full rounded-xl bg-white/10 border-white/20 text-white shadow-sm focus:border-purple-400 focus:ring-purple-400 p-2.5 backdrop-blur-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200">Category</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="mt-1 block w-full rounded-xl bg-white/10 border-white/20 text-white shadow-sm focus:border-purple-400 focus:ring-purple-400 p-2.5 backdrop-blur-sm [&>option]:text-gray-900">
                <option>Food</option>
                <option>Transport</option>
                <option>Shopping</option>
                <option>Bills & Utilities</option>
                <option>Education</option>
                <option>Health</option>
                <option>Entertainment</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200">Description</label>
              <input type="text" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="mt-1 block w-full rounded-xl bg-white/10 border-white/20 text-white shadow-sm focus:border-purple-400 focus:ring-purple-400 p-2.5 backdrop-blur-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200">Date</label>
              <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="mt-1 block w-full rounded-xl bg-white/10 border-white/20 text-white shadow-sm focus:border-purple-400 focus:ring-purple-400 p-2.5 backdrop-blur-sm [&::-webkit-calendar-picker-indicator]:filter-invert" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200">Payment Method</label>
              <select value={formData.payment_method} onChange={e => setFormData({...formData, payment_method: e.target.value})} className="mt-1 block w-full rounded-xl bg-white/10 border-white/20 text-white shadow-sm focus:border-purple-400 focus:ring-purple-400 p-2.5 backdrop-blur-sm [&>option]:text-gray-900">
                <option>UPI</option>
                <option>Cash</option>
                <option>Debit Card</option>
                <option>Credit Card</option>
              </select>
            </div>
            <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-white/20 rounded-xl text-gray-200 hover:bg-white/10 backdrop-blur-sm transition-colors">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-purple-600/80 backdrop-blur-sm text-white rounded-xl hover:bg-purple-600 transition-colors shadow-lg border border-white/20">Save Expense</button>
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
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-200 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-200 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-200 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 bg-white/5">
              {expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-white/20 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">{expense.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">{expense.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white border border-white/30 shadow-sm">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-pink-400">-₹{expense.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <button onClick={() => handleDelete(expense.id)} className="text-gray-400 hover:text-pink-500 transition-colors bg-white/10 p-2 rounded-lg"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-400 font-medium bg-white/5">No expenses found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
