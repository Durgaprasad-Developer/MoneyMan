import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useApi } from '../../hooks/useApi';
import { formatCurrency, formatCompact } from '../../utils/formatters';
import { CATEGORY_COLORS, PORTFOLIO_COLORS } from '../../utils/constants';
import './Dashboard.css';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

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
    <motion.div 
      className="page-content bento-grid"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants} className="bento-col-span-full section-title">
        <span className="material-symbols-rounded icon">dashboard</span> Dashboard
      </motion.div>

      {/* Summary Cards in Bento style */}
      <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="bento-card card-blue dash-stat-card bento-col-span-full">
        <div className="dash-stat-icon" style={{ background: 'rgba(79, 70, 229, 0.1)' }}>
          <span className="material-symbols-rounded icon">account_balance_wallet</span>
        </div>
        <div>
          <div className="stat-value-lg">{formatCompact(totalPortfolioValue)}</div>
          <div className="stat-label text-muted">Total Portfolio</div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="bento-card card-green dash-stat-card">
        <div className="dash-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
          <span className="material-symbols-rounded icon">trending_up</span>
        </div>
        <div>
          <div className="stat-value">{formatCompact(customer.monthlyIncome)}</div>
          <div className="stat-label text-muted">Monthly Income</div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="bento-card card-yellow dash-stat-card">
        <div className="dash-stat-icon" style={{ background: 'rgba(253, 224, 71, 0.1)' }}>
          <span className="material-symbols-rounded icon">shield</span>
        </div>
        <div>
          <div className="stat-value">{customer.riskProfile.riskScore}</div>
          <div className="stat-label text-muted">Risk Score</div>
        </div>
      </motion.div>

      {/* Spending Trend Chart - Takes full width (2 columns) */}
      <motion.div variants={itemVariants} whileHover={{ scale: 1.01 }} className="bento-card dash-chart-card bento-col-span-full">
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
      </motion.div>

      {/* Portfolio Allocation - Takes full width */}
      <motion.div variants={itemVariants} whileHover={{ scale: 1.01 }} className="bento-card dash-chart-card bento-col-span-full">
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
      </motion.div>

      {/* Spending Breakdown Bar - Takes full width */}
      <motion.div variants={itemVariants} whileHover={{ scale: 1.01 }} className="bento-card dash-chart-card bento-col-span-full">
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
      </motion.div>

      {/* Goals Progress - Takes full width */}
      <motion.div variants={itemVariants} whileHover={{ scale: 1.01 }} className="bento-card dash-chart-card bento-col-span-full">
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
      </motion.div>
    </motion.div>
  );
}
