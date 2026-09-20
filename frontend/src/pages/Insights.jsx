import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Lightbulb } from 'lucide-react';

const Insights = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await api.get('/insights/');
        setInsights(res.data.insights || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  if (loading) return <div className="text-white">Loading insights...</div>;

  return (
    <div className="space-y-6">
      <div className="border-b border-white/20 pb-4">
        <h1 className="text-2xl font-bold text-white tracking-wide">Smart Insights</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insights.map((insight, idx) => (
          <div key={idx} className="glass-card p-6 flex items-start group hover:bg-white/10 transition-colors relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-l-xl"></div>
            <div className="bg-white/10 p-3 rounded-xl mr-4 border border-white/20 shadow-md group-hover:scale-110 transition-transform">
              <Lightbulb className="h-6 w-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-white font-medium leading-relaxed tracking-wide">{insight}</p>
            </div>
          </div>
        ))}
        {insights.length === 0 && (
          <div className="col-span-full p-8 text-center text-gray-400 font-medium glass-card">
            No insights available right now. Keep adding expenses!
          </div>
        )}
      </div>
    </div>
  );
};

export default Insights;
