import React, { useState, useEffect, useMemo } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  LineChart, Line
} from 'recharts';
import { analyticsService } from '../services/api';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

const COLORS = ['#6366f1', '#ec4899', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await analyticsService.getDashboard();
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const pieData = useMemo(() => {
    if (!data?.categoryBreakdown) return [];
    return data.categoryBreakdown
      .filter(c => c.type === 'EXPENSE')
      .map(c => ({ name: c.category, value: c.amount }));
  }, [data]);

  if (loading) return (
    <div className="h-96 flex items-center justify-center text-slate-500 font-medium">
      Analyzing your finances...
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Stats Cards */}
      <div className="glass-card p-6 flex items-center gap-6">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
          <TrendingUp size={28} />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-500 mb-1">Monthly Income</p>
          <h3 className="text-3xl font-bold">${data?.monthlyStats?.income.toLocaleString()}</h3>
        </div>
      </div>

      <div className="glass-card p-6 flex items-center gap-6">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500">
          <TrendingDown size={28} />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-500 mb-1">Monthly Expense</p>
          <h3 className="text-3xl font-bold">${data?.monthlyStats?.expense.toLocaleString()}</h3>
        </div>
      </div>

      <div className="glass-card p-6 flex items-center gap-6 md:col-span-2 lg:col-span-1">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          <Wallet size={28} />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-500 mb-1">Net Savings</p>
          <h3 className="text-3xl font-bold">${(data?.monthlyStats?.income - data?.monthlyStats?.expense).toLocaleString()}</h3>
        </div>
      </div>

      {/* Charts */}
      <div className="lg:col-span-2 glass-card p-8">
        <h3 className="text-xl font-semibold mb-8">Income vs Expense Trends</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              />
              <Legend verticalAlign="top" align="right" iconType="circle" />
              <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={24} />
              <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card p-8">
        <h3 className="text-xl font-semibold mb-8">Expense by Category</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={8}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
              />
              <Legend verticalAlign="bottom" iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="lg:col-span-3 glass-card p-8">
        <h3 className="text-xl font-semibold mb-8">Savings Growth Trend</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data?.trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
              />
              <Line 
                type="monotone" 
                dataKey={(v) => v.income - v.expense} 
                name="Savings" 
                stroke="#8b5cf6" 
                strokeWidth={4} 
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }} 
                activeDot={{ r: 6, strokeWidth: 0 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
