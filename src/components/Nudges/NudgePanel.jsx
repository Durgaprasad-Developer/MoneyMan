import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApi } from '../../hooks/useApi';
import './NudgePanel.css';

export default function NudgePanel() {
  const { data: nudges, loading } = useApi('/api/nudges');
  const [dismissed, setDismissed] = useState({});
  const [expanded, setExpanded] = useState({});

  if (loading) return null;
  if (!nudges || nudges.length === 0) return null;

  const activeNudges = nudges.filter(n => !dismissed[n.id]);

  if (activeNudges.length === 0) return null;

  return (
    <div className="nudge-panel">
      <div className="nudge-header">
        <span className="material-symbols-rounded icon" style={{ color: 'var(--accent-orange)' }}>notifications_active</span>
        <span className="nudge-header-text">MoneyMan Alerts</span>
        <span className="badge badge-warning">{activeNudges.length}</span>
      </div>
      <div className="nudge-list">
        <AnimatePresence>
        {activeNudges.map((nudge, i) => {
          const severityColors = {
            critical: 'var(--accent-red)',
            warning: 'var(--accent-yellow)',
            info: 'var(--accent-blue)'
          };
          const iconMap = {
            critical: 'error',
            warning: 'warning',
            info: 'info'
          };
          const nudgeIcon = iconMap[nudge.severity] || 'info';

          return (
            <motion.div
              key={nudge.id}
              className={`nudge-card neo-card-${nudge.severity}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24, delay: i * 0.1 }}
              layout
            >
              <div className="nudge-card-top">
                <div className="nudge-icon-wrap">
                  <span className="material-symbols-rounded">{nudgeIcon}</span>
                </div>
                <div className="nudge-content">
                  <div className="nudge-short">{nudge.short_message}</div>
                  <button
                    className="nudge-expand-btn"
                    onClick={() => setExpanded(prev => ({ ...prev, [nudge.id]: !prev[nudge.id] }))}
                  >
                    {expanded[nudge.id] ? 'Show less' : 'Hear from MoneyMan'}
                  </button>
                </div>
                <button
                  className="nudge-dismiss"
                  onClick={(e) => { e.stopPropagation(); setDismissed(prev => ({ ...prev, [nudge.id]: true })); }}
                >
                  <span className="material-symbols-rounded icon-sm">close</span>
                </button>
              </div>

              <AnimatePresence>
                {expanded[nudge.id] && (
                  <motion.div 
                    className="nudge-expanded"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="nudge-message">{nudge.avatar_message}</p>
                    <button className="btn btn-secondary nudge-action-btn">
                      <span className="material-symbols-rounded icon-sm">arrow_forward</span>
                      {nudge.action_prompt}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
        </AnimatePresence>
      </div>
    </div>
  );
}
