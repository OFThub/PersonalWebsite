'use client';

import { useEffect, useState } from 'react';
import { BarChart3, Eye, Users, TrendingUp, ExternalLink } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(30);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics?days=${period}`);
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Analytics fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center text-gray-400 py-12">
        Analytics verisi yüklenemedi
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex gap-2">
        {[7, 30, 90, 365].map(days => (
          <button
            key={days}
            onClick={() => setPeriod(days)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              period === days
                ? 'bg-linear-to-r from-cyan-500 to-blue-600 text-white'
                : 'bg-white/5 hover:bg-white/10 text-gray-300'
            }`}
          >
            Son {days} Gün
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Toplam Görüntülenme"
          value={analytics.totalViews.toLocaleString()}
          icon={<Eye size={24} />}
          color="cyan"
        />
        <StatCard
          title="Benzersiz Ziyaretçi"
          value={analytics.uniqueViews.toLocaleString()}
          icon={<Users size={24} />}
          color="blue"
        />
        <StatCard
          title="Ortalama Günlük"
          value={Math.round(analytics.totalViews / period).toLocaleString()}
          icon={<TrendingUp size={24} />}
          color="purple"
        />
        <StatCard
          title="En Popüler"
          value={analytics.topPages[0]?._id || 'N/A'}
          icon={<BarChart3 size={24} />}
          color="pink"
          truncate
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Daily Views Line Chart */}
        <div className="bg-white/5 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4">Günlük Görüntülenme</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.dailyViews}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="_id" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #06b6d4',
                  borderRadius: '8px'
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={{ fill: '#06b6d4', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Views by Type Pie Chart */}
        <div className="bg-white/5 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4">Görüntülenme Türü</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.viewsByType}
                dataKey="count"
                nameKey="_id"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent = 0 }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {analytics.viewsByType.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #06b6d4',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Pages */}
      <div className="bg-white/5 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold mb-4">En Popüler Sayfalar</h3>
        <div className="space-y-3">
          {analytics.topPages.map((page: any, index: number) => (
            <div key={index} className="flex items-center gap-4">
              <div className="text-2xl font-bold text-cyan-400 w-8">
                #{index + 1}
              </div>
              <div className="flex-1 bg-white/5 rounded-lg p-3">
                <div className="text-sm text-gray-400">Sayfa</div>
                <div className="font-medium">{page._id}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Görüntülenme</div>
                <div className="text-xl font-bold text-cyan-400">
                  {page.count.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Referrers */}
      {analytics.topReferrers.length > 0 && (
        <div className="bg-white/5 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4">Trafik Kaynakları</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.topReferrers}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="_id" stroke="#94a3b8" angle={-45} textAnchor="end" height={100} />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #06b6d4',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="count" fill="#06b6d4" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color, truncate }: any) {
  const colorClasses = {
    cyan: 'text-cyan-400',
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    pink: 'text-pink-400'
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={colorClasses[color as keyof typeof colorClasses]}>
          {icon}
        </div>
      </div>
      <h3 className="text-sm text-gray-400 mb-1">{title}</h3>
      <p className={`text-3xl font-bold ${truncate ? 'truncate' : ''}`}>
        {value}
      </p>
    </div>
  );
}