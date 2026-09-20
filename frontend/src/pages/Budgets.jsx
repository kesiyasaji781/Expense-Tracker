import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Target, Plus, Trash2 } from 'lucide-react';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const today = new Date();
  const [formData, setFormData] = useState({
    category: 'Food', amount: '', month: today.getMonth() + 1, year: today.getFullYear()
  });

  const fetchData = async () => {
    try {
      const [budgetsRes, expensesRes] = await Promise.all([
        api.get(`/budgets/?month=${today.getMonth() + 1}&year=${today.getFullYear()}`),
        api.get('/expenses/')
      ]);
      
      setBudgets(budgetsRes.data);
      setExpenses(expensesRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/budgets/', { ...formData, amount: parseFloat(formData.amount) });
      setShowForm(false);
      setFormData({ category: 'Food', amount: '', month: today.getMonth() + 1, year: today.getFullYear() });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await api.delete(`/budgets/${id}`);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <div className="text-white">Loading budgets...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-white/20 pb-4">
        <h1 className="text-2xl font-bold text-white tracking-wide">Monthly Budgets</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center bg-blue-500/80 backdrop-blur-md text-white border border-white/20 px-4 py-2 rounded-xl hover:bg-blue-500 transition-colors shadow-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Budget
        </button>
      </div>

      {showForm && (
        <div className="glass-card p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-4">Set New Budget</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200">Category</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="mt-1 block w-full rounded-xl bg-white/10 border-white/20 text-white shadow-sm focus:border-blue-400 focus:ring-blue-400 p-2.5 backdrop-blur-sm [&>option]:text-gray-900">
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
              <label className="block text-sm font-medium text-gray-200">Amount (₹)</label>
              <input type="number" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="mt-1 block w-full rounded-xl bg-white/10 border-white/20 text-white shadow-sm focus:border-blue-400 focus:ring-blue-400 p-2.5 backdrop-blur-sm" />
            </div>
            <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-white/20 rounded-xl text-gray-200 hover:bg-white/10 backdrop-blur-sm transition-colors">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-500/80 backdrop-blur-sm text-white rounded-xl hover:bg-blue-500 transition-colors shadow-lg border border-white/20">Save Budget</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map(budget => {
          const spent = expenses
            .filter(e => e.category === budget.category)
            .reduce((acc, curr) => acc + curr.amount, 0);
          
          const percentage = Math.min((spent / budget.amount) * 100, 100);
          const isOver = spent > budget.amount;

          return (
            <div key={budget.id} className="glass-card p-6 relative group">
              <button 
                onClick={() => handleDelete(budget.id)}
                className="absolute top-4 right-4 text-gray-400 hover:text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 p-2 rounded-lg"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="bg-white/20 border border-white/30 p-2 rounded-xl mr-3 shadow-sm">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-white text-lg tracking-wide">{budget.category}</h3>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2 font-medium">
                  <span className="text-gray-300">Spent: ₹{spent.toLocaleString()}</span>
                  <span className="text-white">Total: ₹{budget.amount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3 border border-white/10 shadow-inner">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 shadow-md ${isOver ? 'bg-pink-500' : percentage > 80 ? 'bg-yellow-400' : 'bg-green-400'}`} 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="mt-3 text-xs text-right font-bold">
                  {isOver ? (
                    <span className="text-pink-400">Over budget by ₹{(spent - budget.amount).toLocaleString()}</span>
                  ) : (
                    <span className="text-green-300">₹{(budget.amount - spent).toLocaleString()} remaining</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {budgets.length === 0 && (
          <div className="col-span-full p-8 text-center text-gray-400 font-medium glass-card">
            No budgets set for this month.
          </div>
        )}
      </div>
    </div>
  );
};

export default Budgets;
