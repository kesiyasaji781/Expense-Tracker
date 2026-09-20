import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Analytics = () => {
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics/daily/');
        setDailyData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="text-white">Loading analytics...</div>;

  return (
    <div className="space-y-6">
      <div className="border-b border-white/20 pb-4">
        <h1 className="text-2xl font-bold text-white tracking-wide">Analytics</h1>
      </div>
      
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-white mb-6 tracking-wide">Daily Income vs Expenses (This Month)</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" vertical={false} />
              <XAxis 
                dataKey="date" 
                tickFormatter={(tick) => tick.split('-')[2]} 
                stroke="rgba(255,255,255,0.7)"
              />
              <YAxis stroke="rgba(255,255,255,0.7)" />
              <Tooltip 
                formatter={(value) => `₹${value}`}
                contentStyle={{ borderRadius: '12px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }} 
                itemStyle={{ color: '#fff' }}
              />
              <Legend wrapperStyle={{ color: '#fff' }} />
              <Line type="monotone" dataKey="expense" name="Expenses" stroke="#f472b6" strokeWidth={3} dot={{ r: 4, fill: '#f472b6' }} activeDot={{ r: 6, fill: '#f472b6' }} />
              <Line type="monotone" dataKey="income" name="Income" stroke="#4ade80" strokeWidth={3} dot={{ r: 4, fill: '#4ade80' }} activeDot={{ r: 6, fill: '#4ade80' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
