import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useApi } from '../../hooks/useApi';
import { formatCurrency } from '../../utils/formatters';
import { CATEGORY_COLORS, RISK_COLORS } from '../../utils/constants';
import './BehaviourProfile.css';

function RiskGauge({ score, category }) {
  const angle = (score / 100) * 180;
  const color = RISK_COLORS[category] || '#4361ee';
  
  // Arc path calculation
  const cx = 80, cy = 75, r = 55;
  const startAngle = Math.PI;
  const endAngle = Math.PI - (angle * Math.PI / 180);
  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);
  const largeArc = angle > 180 ? 1 : 0;

  return (
    <div className="risk-gauge">
      <svg viewBox="0 0 160 95" className="gauge-svg">
        {/* Background arc */}
        <path
          d={`M 25 75 A 55 55 0 0 1 135 75`}
          fill="none"
          stroke="rgba(99,110,180,0.15)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* Value arc */}
        <path
          d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 8px ${color}60)` }}
        />
        {/* Needle dot */}
        <circle cx={x2} cy={y2} r="5" fill={color} stroke="var(--bg-secondary)" strokeWidth="2" />
      </svg>
      <div className="gauge-label">
        <div className="gauge-value" style={{ color }}>{score}</div>
        <div className="gauge-text">{category}</div>
      </div>
    </div>
  );
}

export default function BehaviourProfile() {
  const { data, loading } = useApi('/api/profile');

  if (loading) {
    return (
      <div className="page-content page-enter">
        <div className="section-title"><span className="material-symbols-rounded icon">person_search</span> Behaviour Profile</div>
        <div className="skeleton" style={{ height: 200, marginBottom: 16 }} />
        <div className="skeleton" style={{ height: 150 }} />
      </div>
    );
  }

  if (!data) return null;

  const { riskProfile, trends, spendingBreakdown } = data;

  const spendingPieData = spendingBreakdown.map(s => ({
    name: s.category,
    value: s.amount
  }));

  return (
    <div className="page-content page-enter">
      <div className="section-title">
        <span className="material-symbols-rounded icon">person_search</span> Behaviour Profile
      </div>

      <div className="profile-subtitle animate-fade-in-up">
        <span className="material-symbols-rounded icon-sm" style={{ color: 'var(--accent-teal)' }}>auto_awesome</span>
        Auto-generated from 6 months of transaction data — no questionnaire needed
      </div>

      {/* Risk Gauge */}
      <div className="glass-card profile-risk-card animate-fade-in-up delay-1">
        <h3 className="profile-card-title">Risk Profile</h3>
        <RiskGauge score={riskProfile.riskScore} category={riskProfile.riskCategory} />
        <div className="profile-ratios">
          <div className="profile-ratio">
            <div className="profile-ratio-bar">
              <div className="profile-ratio-fill" style={{ width: `${riskProfile.investmentRatio}%`, background: 'var(--accent-blue)' }} />
            </div>
            <span className="profile-ratio-label">Investment {riskProfile.investmentRatio}%</span>
          </div>
          <div className="profile-ratio">
            <div className="profile-ratio-bar">
              <div className="profile-ratio-fill" style={{ width: `${riskProfile.savingsRatio}%`, background: 'var(--accent-teal)' }} />
            </div>
            <span className="profile-ratio-label">Savings {riskProfile.savingsRatio}%</span>
          </div>
          <div className="profile-ratio">
            <div className="profile-ratio-bar">
              <div className="profile-ratio-fill" style={{ width: `${Math.min(riskProfile.spendingRatio, 100)}%`, background: 'var(--accent-red)' }} />
            </div>
            <span className="profile-ratio-label">Spending {riskProfile.spendingRatio}%</span>
          </div>
        </div>
      </div>

      {/* Spending Breakdown */}
      <div className="glass-card-static profile-spending-card animate-fade-in-up delay-2">
        <h3 className="profile-card-title">Spending Breakdown</h3>
        <div className="profile-spending-row">
          <ResponsiveContainer width="45%" height={140}>
            <PieChart>
              <Pie data={spendingPieData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={2} dataKey="value" stroke="none">
                {spendingPieData.map((entry, i) => (
                  <Cell key={i} fill={CATEGORY_COLORS[entry.name] || '#4361ee'} />
                ))}
              </Pie>
              <Tooltip formatter={(val) => formatCurrency(val)} />
            </PieChart>
          </ResponsiveContainer>
          <div className="profile-spending-legend">
            {spendingBreakdown.map((item, i) => (
              <div key={i} className="profile-spending-item">
                <span className="legend-dot" style={{ background: CATEGORY_COLORS[item.category] }} />
                <span className="profile-spending-name">{item.category}</span>
                <span className="profile-spending-amt">{formatCurrency(item.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Behavioural Insights */}
      <div className="glass-card-static profile-insights-card animate-fade-in-up delay-3">
        <h3 className="profile-card-title">
          <span className="material-symbols-rounded icon-sm" style={{ color: 'var(--accent-yellow)' }}>lightbulb</span>
          Behavioural Insights
        </h3>
        <div className="profile-insights-list">
          {riskProfile.insights.map((insight, i) => (
            <div key={i} className={`profile-insight profile-insight-${insight.type}`}>
              <div className="profile-insight-header">
                <span className={`badge badge-${insight.type}`}>
                  <span className="material-symbols-rounded icon-sm">
                    {insight.type === 'critical' ? 'error' : insight.type === 'warning' ? 'warning' : 'info'}
                  </span>
                  {insight.category}
                </span>
              </div>
              <div className="profile-insight-text">{insight.text}</div>
              <div className="profile-insight-detail">{insight.detail}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Trend Indicators */}
      <div className="glass-card-static profile-trends-card animate-fade-in-up delay-4">
        <h3 className="profile-card-title">Category Trends (6 Month)</h3>
        <div className="profile-trends-grid">
          {Object.entries(trends).filter(([cat]) => cat !== 'Income').map(([cat, trend]) => {
            const isGoodCategory = cat === 'Investment' || cat === 'Savings';
            const arrowColor = trend.direction === 'rising'
              ? (isGoodCategory ? 'var(--accent-teal)' : 'var(--accent-red)')
              : trend.direction === 'falling'
                ? (isGoodCategory ? 'var(--accent-red)' : 'var(--accent-teal)')
                : 'var(--text-muted)';
            const arrow = trend.direction === 'rising' ? '↑' : trend.direction === 'falling' ? '↓' : '→';
            
            return (
              <div key={cat} className="profile-trend-item">
                <span className="profile-trend-cat" style={{ color: CATEGORY_COLORS[cat] }}>{cat}</span>
                <span className="profile-trend-change" style={{ color: arrowColor }}>
                  {arrow} {Math.abs(trend.changePercent)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
