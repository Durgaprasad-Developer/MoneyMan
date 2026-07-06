import React from 'react';
import { PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useApi } from '../../hooks/useApi';
import { formatCurrency, formatCompact } from '../../utils/formatters';
import { CATEGORY_COLORS, PORTFOLIO_COLORS } from '../../utils/constants';
import './Dashboard.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-label">{label}</div>
      {payload.map((entry, i) => (
        <div key={i} className="chart-tooltip-row">
          <span className="chart-tooltip-dot" style={{ background: entry.color }} />
          <span>{entry.name}: {formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { data, loading } = useApi('/api/dashboard');

  if (loading) {
    return (
      <div className="page-content page-enter">
        <div className="section-title"><span className="material-symbols-rounded icon">dashboard</span> Dashboard</div>
        <div className="skeleton-grid">
          {[1,2,3,4].map(i => <div key={i} className="skeleton skeleton-card" />)}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { customer, spendingTrend, spendingBreakdown, portfolioData, goals, totalPortfolioValue, recommendationCount, nudgeCount } = data;

  return (
    <div className="page-content page-enter">
      <div className="section-title">
        <span className="material-symbols-rounded icon">dashboard</span> Dashboard
      </div>

      {/* Summary Cards */}
      <div className="dash-summary-grid animate-fade-in-up">
        <div className="glass-card dash-stat-card">
          <div className="dash-stat-icon" style={{ background: 'rgba(67, 97, 238, 0.15)' }}>
            <span className="material-symbols-rounded" style={{ color: 'var(--accent-blue)' }}>account_balance_wallet</span>
          </div>
          <div>
            <div className="stat-value gradient-text">{formatCompact(totalPortfolioValue)}</div>
            <div className="stat-label">Total Portfolio</div>
          </div>
        </div>

        <div className="glass-card dash-stat-card">
          <div className="dash-stat-icon" style={{ background: 'rgba(6, 214, 160, 0.15)' }}>
            <span className="material-symbols-rounded" style={{ color: 'var(--accent-teal)' }}>trending_up</span>
          </div>
          <div>
            <div className="stat-value" style={{ color: 'var(--accent-teal)' }}>{formatCompact(customer.monthlyIncome)}</div>
            <div className="stat-label">Monthly Income</div>
          </div>
        </div>

        <div className="glass-card dash-stat-card">
          <div className="dash-stat-icon" style={{ background: 'rgba(123, 47, 247, 0.15)' }}>
            <span className="material-symbols-rounded" style={{ color: 'var(--accent-purple)' }}>shield</span>
          </div>
          <div>
            <div className="stat-value" style={{ color: 'var(--accent-purple)' }}>{customer.riskProfile.riskScore}</div>
            <div className="stat-label">Risk Score</div>
          </div>
        </div>

        <div className="glass-card dash-stat-card">
          <div className="dash-stat-icon" style={{ background: 'rgba(255, 107, 53, 0.15)' }}>
            <span className="material-symbols-rounded" style={{ color: 'var(--accent-orange)' }}>notifications_active</span>
          </div>
          <div>
            <div className="stat-value" style={{ color: 'var(--accent-orange)' }}>{recommendationCount + nudgeCount}</div>
            <div className="stat-label">Insights Ready</div>
          </div>
        </div>
      </div>

      {/* Spending Trend Chart */}
      <div className="glass-card-static dash-chart-card animate-fade-in-up delay-1">
        <h3 className="dash-chart-title">
          <span className="material-symbols-rounded icon-sm">show_chart</span>
          Monthly Spending Trend
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={spendingTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef476f" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef476f" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="investGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4361ee" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4361ee" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,110,180,0.1)" />
            <XAxis dataKey="label" tick={{ fill: '#5c6196', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#5c6196', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="totalSpending" name="Spending" stroke="#ef476f" fill="url(#spendGrad)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="Investment" name="Investment" stroke="#4361ee" fill="url(#investGrad)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
        <div className="dash-chart-legend">
          <span className="legend-dot" style={{ background: '#ef476f' }} /> Spending
          <span className="legend-dot" style={{ background: '#4361ee', marginLeft: 12 }} /> Investment
        </div>
      </div>

      {/* Portfolio Allocation */}
      <div className="glass-card-static dash-chart-card animate-fade-in-up delay-2">
        <h3 className="dash-chart-title">
          <span className="material-symbols-rounded icon-sm">pie_chart</span>
          Portfolio Allocation
        </h3>
        <div className="dash-portfolio-row">
          <ResponsiveContainer width="50%" height={160}>
            <PieChart>
              <Pie
                data={portfolioData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={65}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {portfolioData.map((entry, i) => (
                  <Cell key={i} fill={PORTFOLIO_COLORS[i % PORTFOLIO_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(val) => formatCurrency(val)} />
            </PieChart>
          </ResponsiveContainer>
          <div className="dash-portfolio-legend">
            {portfolioData.map((item, i) => (
              <div key={i} className="portfolio-legend-item">
                <span className="legend-dot" style={{ background: PORTFOLIO_COLORS[i % PORTFOLIO_COLORS.length] }} />
                <span className="portfolio-legend-name">{item.name}</span>
                <span className="portfolio-legend-val">{item.allocation}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Spending Breakdown Bar */}
      <div className="glass-card-static dash-chart-card animate-fade-in-up delay-3">
        <h3 className="dash-chart-title">
          <span className="material-symbols-rounded icon-sm">bar_chart</span>
          Spending Breakdown (This Month)
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={spendingBreakdown} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,110,180,0.1)" horizontal={false} />
            <XAxis type="number" tick={{ fill: '#5c6196', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
            <YAxis dataKey="category" type="category" tick={{ fill: '#9fa8da', fontSize: 11 }} axisLine={false} tickLine={false} width={85} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="amount" name="Amount" radius={[0, 6, 6, 0]} barSize={16}>
              {spendingBreakdown.map((entry, i) => (
                <Cell key={i} fill={CATEGORY_COLORS[entry.category] || '#4361ee'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Goals Progress */}
      <div className="glass-card-static dash-chart-card animate-fade-in-up delay-4">
        <h3 className="dash-chart-title">
          <span className="material-symbols-rounded icon-sm">flag</span>
          Financial Goals
        </h3>
        <div className="dash-goals-list">
          {goals.map((goal, i) => {
            const progress = Math.round((goal.current / goal.target) * 100);
            const color = progress < 30 ? 'var(--accent-red)' : progress < 60 ? 'var(--accent-yellow)' : 'var(--accent-teal)';
            return (
              <div key={i} className="dash-goal-item">
                <div className="dash-goal-header">
                  <span className="dash-goal-name">{goal.name}</span>
                  <span className="dash-goal-pct" style={{ color }}>{progress}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${progress}%`, background: color }} />
                </div>
                <div className="dash-goal-amounts">
                  <span>{formatCompact(goal.current)}</span>
                  <span style={{ color: 'var(--text-muted)' }}>of {formatCompact(goal.target)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
