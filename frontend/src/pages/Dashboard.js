import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Users, DollarSign, Target, AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await axios.get(`${API}/dashboard/metrics`);
      setMetrics(response.data);
    } catch (error) {
      toast.error('Failed to load metrics');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        </div>
      </div>
    );
  }

  const MetricCard = ({ title, value, change, icon: Icon, format = 'number' }) => {
    const isPositive = change > 0;
    const isNegative = change < 0;
    
    const formatValue = () => {
      if (format === 'currency') return `$${value.toLocaleString()}`;
      if (format === 'percent') return `${value}%`;
      return value.toLocaleString();
    };

    return (
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200" data-testid="metric-card">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2 bg-slate-100 rounded-lg">
            <Icon className="w-5 h-5 text-slate-900" />
          </div>
          <div className={`flex items-center space-x-1 text-sm font-medium ${isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-slate-600'}`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : isNegative ? <TrendingDown className="w-4 h-4" /> : null}
            <span>{isPositive ? '+' : ''}{change}%</span>
          </div>
        </div>
        <h3 className="text-sm font-medium text-slate-600 mb-1">{title}</h3>
        <p className="text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">{formatValue()}</p>
      </div>
    );
  };

  const getAnomalyIcon = (type) => {
    if (type === 'critical') return <AlertCircle className="w-5 h-5 text-red-600" />;
    if (type === 'warning') return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    return <CheckCircle className="w-5 h-5 text-green-600" />;
  };

  const getAnomalyBorder = (type) => {
    if (type === 'critical') return 'border-l-4 border-l-red-600';
    if (type === 'warning') return 'border-l-4 border-l-yellow-600';
    return 'border-l-4 border-l-green-600';
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 mb-2" data-testid="dashboard-title">
              Dashboard
            </h1>
            <p className="text-base text-slate-600">Your business metrics at a glance</p>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <MetricCard
              title="Monthly Recurring Revenue"
              value={metrics.mrr}
              change={metrics.mrr_change}
              icon={DollarSign}
              format="currency"
            />
            <MetricCard
              title="Active Users"
              value={metrics.active_users}
              change={metrics.active_users_change}
              icon={Users}
            />
            <MetricCard
              title="Conversions"
              value={metrics.conversions}
              change={metrics.conversions_change}
              icon={Target}
            />
            <MetricCard
              title="Churn Rate"
              value={metrics.churn_rate}
              change={metrics.churn_rate_change}
              icon={TrendingDown}
              format="percent"
            />
          </div>

          {/* Revenue Chart */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm mb-6" data-testid="revenue-chart">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 mb-6">30-Day Revenue Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics.chart_data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
                  }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Anomaly Alerts */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm" data-testid="anomaly-alerts">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 mb-6">Anomaly Alerts</h2>
            <div className="space-y-4">
              {metrics.anomalies.map((anomaly) => (
                <div
                  key={anomaly.id}
                  className={`bg-slate-50 rounded-lg p-4 ${getAnomalyBorder(anomaly.type)}`}
                  data-testid={`anomaly-${anomaly.type}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getAnomalyIcon(anomaly.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-slate-900 mb-1">{anomaly.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed mb-2">{anomaly.description}</p>
                      <span className="text-xs text-slate-500">{anomaly.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
