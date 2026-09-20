import React, { useState, useEffect } from 'react';
import { Wallet, ArrowUpRight, ArrowDownRight, Target, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from 'recharts';

const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#3b82f6', '#10b981', '#f43f5e'];

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [summaryRes, categoryRes, expenseRes, insightsRes] = await Promise.all([
          api.get('/analytics/summary/'),
          api.get('/analytics/categories/'),
          api.get('/expenses/?limit=5'),
          api.get('/insights/')
        ]);
        
        setSummary(summaryRes.data);
        setCategories(categoryRes.data);
        setRecentTransactions(expenseRes.data);
        setInsights(insightsRes.data.insights || []);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64 text-gray-700 font-medium">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-card overflow-hidden">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-white/40 border border-white/50 backdrop-blur-md rounded-xl p-3 shadow-sm">
                <Wallet className="h-6 w-6 text-purple-700" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-700 truncate">Total Balance</dt>
                  <dd className="text-2xl font-bold text-gray-900">₹{summary?.total_balance?.toLocaleString() || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-white/40 border border-white/50 backdrop-blur-md rounded-xl p-3 shadow-sm">
                <ArrowUpRight className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-700 truncate">Total Income</dt>
                  <dd className="text-2xl font-bold text-gray-900">₹{summary?.total_income?.toLocaleString() || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-white/40 border border-white/50 backdrop-blur-md rounded-xl p-3 shadow-sm">
                <ArrowDownRight className="h-6 w-6 text-pink-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-700 truncate">Total Expenses</dt>
                  <dd className="text-2xl font-bold text-gray-900">₹{summary?.total_expense?.toLocaleString() || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-white/40 border border-white/50 backdrop-blur-md rounded-xl p-3 shadow-sm">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-700 truncate">Remaining Budget</dt>
                  <dd className="text-2xl font-bold text-gray-900">₹{summary?.remaining_budget?.toLocaleString() || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Chart */}
        <div className="glass-card p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Expense Categories</h3>
          {categories.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categories}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="amount"
                    nameKey="category"
                    stroke="rgba(255,255,255,0.5)"
                    strokeWidth={2}
                  >
                    {categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `₹${value}`} 
                    contentStyle={{ borderRadius: '12px', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.5)' }} 
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center text-gray-600 bg-white/20 rounded-xl border border-white/30">
              No expense data for this month
            </div>
          )}
        </div>

        {/* Smart Insights */}
        <div className="glass-card p-6 flex flex-col">
          <div className="flex items-center mb-6 border-b border-white/20 pb-4">
            <div className="bg-yellow-100/60 p-2 rounded-xl mr-3 border border-white/40">
              <Lightbulb className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Smart Insights</h3>
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2">
            {insights.map((insight, index) => (
              <div key={index} className="p-4 bg-white/40 backdrop-blur-md rounded-xl text-sm border border-white/50 text-gray-800 font-medium shadow-sm leading-relaxed relative overflow-hidden group hover:bg-white/50 transition-colors">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 to-pink-400"></div>
                {insight}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="glass-card overflow-hidden">
        <div className="px-6 py-5 border-b border-white/20 flex justify-between items-center bg-white/10">
          <h3 className="text-lg font-bold text-gray-900">Recent Transactions</h3>
          <Link to="/transactions" className="text-sm font-bold text-purple-700 hover:text-purple-800 bg-white/40 px-4 py-2 rounded-lg transition-colors border border-white/40">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          {recentTransactions.length > 0 ? (
            <table className="min-w-full divide-y divide-white/20">
              <thead className="bg-white/20 backdrop-blur-md">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-white/10">
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-white/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                      {transaction.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/50 text-gray-800 border border-white/60 shadow-sm">
                        {transaction.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-pink-600">
                      -₹{transaction.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-gray-600 font-medium bg-white/10">
              You haven't added any expenses yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
