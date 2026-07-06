import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { useApi } from '../../hooks/useApi';
import { postApi } from '../../hooks/useApi';
import { formatCurrency, formatCompact } from '../../utils/formatters';
import './GoalSimulator.css';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function GoalSimulator() {
  const { data: profileData } = useApi('/api/profile');
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [monthlyAmount, setMonthlyAmount] = useState(10000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [simulation, setSimulation] = useState(null);
  const [simLoading, setSimLoading] = useState(false);

  useEffect(() => {
    if (profileData?.goals?.length > 0 && !selectedGoal) {
      setSelectedGoal(profileData.goals[0].name);
    }
  }, [profileData, selectedGoal]);

  useEffect(() => {
    if (!selectedGoal) return;
    const runSim = async () => {
      setSimLoading(true);
      const res = await postApi('/api/simulate', {
        goalName: selectedGoal,
        monthlyInvestment: monthlyAmount,
        expectedReturn
      });
      if (res.success) setSimulation(res.data);
      setSimLoading(false);
    };
    const debounce = setTimeout(runSim, 300);
    return () => clearTimeout(debounce);
  }, [selectedGoal, monthlyAmount, expectedReturn]);

  if (!profileData) return null;

  const goals = profileData.goals || [];

  return (
    <motion.div 
      className="page-content"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants} className="section-title">
        <span className="material-symbols-rounded icon">target</span> Goal Simulator
      </motion.div>
      <motion.p variants={itemVariants} className="sim-subtitle">
        Drag the slider to see how changing your monthly investment affects your goal timeline.
      </motion.p>

      {/* Goal selector */}
      <motion.div variants={itemVariants} className="sim-goal-selector">
        {goals.map(goal => (
          <button
            key={goal.name}
            className={`sim-goal-btn ${selectedGoal === goal.name ? 'active' : ''}`}
            onClick={() => setSelectedGoal(goal.name)}
          >
            <span className="material-symbols-rounded icon-sm">
              {goal.name.includes('Emergency') ? 'shield' : goal.name.includes('Car') ? 'directions_car' : 'home'}
            </span>
            {goal.name}
          </button>
        ))}
      </motion.div>

      {/* Sliders */}
      <motion.div variants={itemVariants} className="glass-card-static sim-controls">
        <div className="sim-slider-group">
          <div className="sim-slider-header">
            <label>Monthly Investment</label>
            <span className="sim-slider-value gradient-text">{formatCurrency(monthlyAmount)}</span>
          </div>
          <input
            type="range"
            min="1000"
            max="50000"
            step="500"
            value={monthlyAmount}
            onChange={(e) => setMonthlyAmount(Number(e.target.value))}
            className="sim-slider"
            id="monthly-investment-slider"
          />
          <div className="sim-slider-range">
            <span>₹1,000</span>
            <span>₹50,000</span>
          </div>
        </div>

        <div className="sim-slider-group">
          <div className="sim-slider-header">
            <label>Expected Annual Return</label>
            <span className="sim-slider-value" style={{ color: 'var(--accent-teal)' }}>{expectedReturn}%</span>
          </div>
          <input
            type="range"
            min="6"
            max="18"
            step="0.5"
            value={expectedReturn}
            onChange={(e) => setExpectedReturn(Number(e.target.value))}
            className="sim-slider sim-slider-teal"
            id="return-rate-slider"
          />
          <div className="sim-slider-range">
            <span>6% (FD)</span>
            <span>18% (Equity)</span>
          </div>
        </div>
      </motion.div>

      {/* Simulation Results */}
      <AnimatePresence mode="wait">
        {simulation && !simLoading && (
          <motion.div 
            className="sim-results bento-grid" 
            style={{ marginTop: 'var(--space-md)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Key metrics */}
            <motion.div whileHover={{ scale: 1.02 }} className="glass-card sim-metric bento-col-span-2">
              <div className="sim-metric-icon">
                <span className="material-symbols-rounded" style={{ color: 'var(--accent-blue)' }}>calendar_month</span>
              </div>
              <div className="stat-value gradient-text">{simulation.monthsToGoal}</div>
              <div className="stat-label">Months to Goal</div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="glass-card sim-metric bento-col-span-2">
              <div className="sim-metric-icon">
                <span className="material-symbols-rounded" style={{ color: simulation.onTrack ? 'var(--accent-teal)' : 'var(--accent-red)' }}>
                  {simulation.onTrack ? 'check_circle' : 'warning'}
                </span>
              </div>
              <div className="stat-value" style={{ color: simulation.onTrack ? 'var(--accent-teal)' : 'var(--accent-red)' }}>
                {simulation.onTrack ? `${simulation.monthsAheadOrBehind}mo early` : `${Math.abs(simulation.monthsAheadOrBehind)}mo late`}
              </div>
              <div className="stat-label">{simulation.onTrack ? 'Ahead of Schedule' : 'Behind Schedule'}</div>
            </motion.div>

            {/* Projection chart */}
            <motion.div whileHover={{ scale: 1.01 }} className="glass-card-static sim-chart-card bento-col-span-2" style={{ gridColumn: 'span 2' }}>
            <h3 className="sim-chart-title">Projected Growth</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={simulation.projections} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4361ee" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4361ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,110,180,0.1)" />
                <XAxis dataKey="month" tick={{ fill: '#5c6196', fontSize: 10 }} axisLine={false} tickLine={false} label={{ value: 'Months', position: 'insideBottom', offset: -5, fill: '#5c6196', fontSize: 10 }} />
                <YAxis tick={{ fill: '#5c6196', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => formatCompact(v)} />
                <Tooltip formatter={(val) => formatCurrency(val)} labelFormatter={(v) => `Month ${v}`} />
                <ReferenceLine y={simulation.target} stroke="var(--accent-teal)" strokeDasharray="5 5" label={{ value: `Target: ${formatCompact(simulation.target)}`, fill: 'var(--accent-teal)', fontSize: 10, position: 'right' }} />
                <Area type="monotone" dataKey="value" name="Portfolio Value" stroke="#4361ee" fill="url(#projGrad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Summary message */}
          <motion.div whileHover={{ scale: 1.01 }} className="sim-summary glass-card bento-col-span-2">
            <div className="sim-summary-avatar">
              <span className="material-symbols-rounded" style={{ color: 'white', fontSize: 18 }}>psychology</span>
            </div>
            <p className="sim-summary-text">
              {simulation.onTrack
                ? `Great news! By investing ${formatCurrency(monthlyAmount)}/month at ${expectedReturn}% returns, you'll reach your ${simulation.goalName} goal ${simulation.monthsAheadOrBehind} months ahead of schedule.`
                : `At ${formatCurrency(monthlyAmount)}/month, you'll need ${simulation.monthsToGoal} months to reach your ${simulation.goalName} goal — that's ${Math.abs(simulation.monthsAheadOrBehind)} months past your deadline. Try increasing your monthly amount.`
              }
            </p>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>

      {simLoading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="sim-loading">
          <div className="skeleton" style={{ height: 60, marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 200 }} />
        </motion.div>
      )}
    </motion.div>
  );
}
