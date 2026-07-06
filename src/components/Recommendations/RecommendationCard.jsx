import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApi } from '../../hooks/useApi';
import './Recommendations.css';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

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
    <motion.div 
      className="page-content bento-grid"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants} className="bento-col-span-full section-title">
        <span className="material-symbols-rounded icon">tips_and_updates</span> Recommendations
      </motion.div>
      <motion.p variants={itemVariants} className="rec-subtitle bento-col-span-full text-muted">
        Personalized insights based on your financial behaviour. Every recommendation explains <strong>why</strong> it matters.
      </motion.p>

      {recommendations.map((rec, i) => {
        const cardColors = {
          high: 'card-red',
          medium: 'card-yellow',
          low: 'card-blue'
        };
        const colorClass = cardColors[rec.priority] || 'card-blue';
        return (
          <motion.div
            key={rec.id}
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            className={`bento-card ${colorClass} rec-card bento-col-span-full`}
            onClick={() => toggleExpand(rec.id)}
            layout
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
                <span className="material-symbols-rounded icon-sm">psychology</span>
                <span>Why this matters</span>
                <span className="material-symbols-rounded icon-sm rec-chevron">expand_more</span>
              </div>
              <AnimatePresence>
                {expanded[rec.id] && (
                  <motion.div 
                    className="rec-why-content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                  <div className="rec-why-text">
                    <span className="rec-why-label">Data Signal:</span>
                    {rec.why}
                  </div>
                  <div className="rec-impact">
                    <span className="material-symbols-rounded icon-sm" style={{ color: 'var(--accent-blue)' }}>trending_up</span>
                    <span><strong>Impact:</strong> {rec.impact}</span>
                  </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
