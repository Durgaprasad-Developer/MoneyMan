import React, { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import './Recommendations.css';

export default function RecommendationsList() {
  const { data: recommendations, loading } = useApi('/api/recommendations');
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return (
      <div className="page-content page-enter">
        <div className="section-title"><span className="material-symbols-rounded icon">tips_and_updates</span> Recommendations</div>
        {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 100, marginBottom: 12 }} />)}
      </div>
    );
  }

  if (!recommendations) return null;

  const priorityIcon = { high: 'priority_high', medium: 'remove', low: 'expand_more' };
  const priorityColor = { high: 'var(--accent-red)', medium: 'var(--accent-yellow)', low: 'var(--accent-blue)' };

  return (
    <div className="page-content page-enter">
      <div className="section-title">
        <span className="material-symbols-rounded icon">tips_and_updates</span> Recommendations
      </div>
      <p className="rec-subtitle">
        Personalized insights based on your financial behaviour. Every recommendation explains <strong>why</strong> it matters.
      </p>

      <div className="rec-list">
        {recommendations.map((rec, i) => (
          <div
            key={rec.id}
            className={`glass-card-static rec-card animate-fade-in-up delay-${Math.min(i + 1, 5)}`}
            onClick={() => toggleExpand(rec.id)}
          >
            <div className="rec-card-header">
              <div className="rec-priority" style={{ color: priorityColor[rec.priority] }}>
                <span className="material-symbols-rounded icon-sm">{priorityIcon[rec.priority]}</span>
                {rec.priority}
              </div>
              <span className={`badge badge-${rec.priority === 'high' ? 'critical' : rec.priority === 'medium' ? 'warning' : 'info'}`}>
                {rec.category}
              </span>
            </div>

            <h3 className="rec-title">{rec.title}</h3>
            <p className="rec-action">{rec.action}</p>

            {/* Explainable "WHY" — the core differentiator */}
            <div className={`rec-why-section ${expanded[rec.id] ? 'expanded' : ''}`}>
              <div className="rec-why-header">
                <span className="material-symbols-rounded icon-sm" style={{ color: 'var(--accent-teal)' }}>psychology</span>
                <span>Why this matters</span>
                <span className="material-symbols-rounded icon-sm rec-chevron">expand_more</span>
              </div>
              {expanded[rec.id] && (
                <div className="rec-why-content animate-fade-in">
                  <div className="rec-why-text">
                    <span className="rec-why-label">Data Signal:</span>
                    {rec.why}
                  </div>
                  <div className="rec-impact">
                    <span className="material-symbols-rounded icon-sm" style={{ color: 'var(--accent-blue)' }}>trending_up</span>
                    <span><strong>Impact:</strong> {rec.impact}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
