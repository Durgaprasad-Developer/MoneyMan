import React, { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import AvatarFace from '../Avatar/AvatarFace';
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
        {activeNudges.map((nudge, i) => {
          const severityColors = {
            critical: 'var(--accent-red)',
            warning: 'var(--accent-yellow)',
            info: 'var(--accent-blue)'
          };
          const color = severityColors[nudge.severity] || 'var(--accent-blue)';

          return (
            <div
              key={nudge.id}
              className={`nudge-card animate-slide-right delay-${Math.min(i + 1, 3)}`}
              style={{ borderLeftColor: color }}
            >
              <div className="nudge-card-top">
                <div className="nudge-avatar-mini">
                  <AvatarFace state="speaking" size={36} />
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

              {expanded[nudge.id] && (
                <div className="nudge-expanded animate-fade-in">
                  <p className="nudge-message">{nudge.avatar_message}</p>
                  <button className="btn btn-secondary nudge-action-btn">
                    <span className="material-symbols-rounded icon-sm">arrow_forward</span>
                    {nudge.action_prompt}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
