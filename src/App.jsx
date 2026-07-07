import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './context/ThemeContext';
import Dashboard from './components/Dashboard/Dashboard';
import ChatPanel from './components/Chat/ChatPanel';
import BehaviourProfile from './components/Profile/BehaviourProfile';
import RecommendationsList from './components/Recommendations/RecommendationCard';
import GoalSimulator from './components/GoalSimulator/GoalSimulator';
import NudgePanel from './components/Nudges/NudgePanel';
import { PAGES } from './utils/constants';

// Framer Motion variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  },
  exit: { opacity: 0, transition: { duration: 0.15 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 340, damping: 28 } }
};

function HomePage({ setCurrentPage }) {
  return (
    <motion.div
      className="page-content bento-grid"
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      {/* Welcome section spanning full width */}
      <motion.div variants={itemVariants} className="bento-col-span-full home-welcome">
        <div className="home-greeting">
          <span className="home-greeting-text">Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'},</span>
          <h1 className="home-name">Rahul</h1>
        </div>
        <div className="home-avatar-badge animate-float">
          <span className="material-symbols-rounded" style={{ color: 'white', fontSize: 24 }}>psychology</span>
        </div>
      </motion.div>

      {/* Quick Stats side by side */}
      <motion.div variants={itemVariants} whileHover={{ scale: 1.02, y: -2 }} className="bento-card card-teal home-stat">
        <span className="material-symbols-rounded icon">account_balance_wallet</span>
        <div>
          <div className="stat-value-sm">₹5.0L</div>
          <div className="stat-label text-muted">Portfolio</div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} whileHover={{ scale: 1.02, y: -2 }} className="bento-card card-amber home-stat">
        <span className="material-symbols-rounded icon">speed</span>
        <div>
          <div className="stat-value-sm">42</div>
          <div className="stat-label text-muted">Risk Score</div>
        </div>
      </motion.div>

      {/* Feature cards spanning full width */}
      <motion.div variants={itemVariants} whileHover={{ scale: 1.01 }} className="bento-card card-ai bento-col-span-full bento-feature">
        <div className="home-feature-icon" style={{ background: 'rgba(255,255,255,0.15)' }}>
          <span className="material-symbols-rounded icon">auto_awesome</span>
        </div>
        <div className="home-feature-info">
          <h3>AI Behaviour Analysis</h3>
          <p style={{ color: 'rgba(255,255,255,0.88)' }}>Your spending &amp; investment patterns auto-analyzed from 6 months of transactions</p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} whileHover={{ scale: 1.01 }} className="bento-card card-teal-soft bento-col-span-full bento-feature">
        <div className="home-feature-icon" style={{ background: 'rgba(13,148,136,0.15)', borderRadius: 12 }}>
          <span className="material-symbols-rounded icon" style={{ color: 'var(--brand-primary)' }}>psychology</span>
        </div>
        <div className="home-feature-info">
          <h3>Explainable Advice</h3>
          <p>Every recommendation comes with a data-driven "why" — transparent and auditable</p>
        </div>
      </motion.div>

      {/* Nudges taking full width */}
      <motion.div variants={itemVariants} className="bento-col-span-full">
        <NudgePanel />
      </motion.div>
    </motion.div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState(PAGES.HOME);
  const { theme, toggleTheme } = useTheme();

  const renderPage = () => {
    switch (currentPage) {
      case PAGES.HOME:      return <HomePage setCurrentPage={setCurrentPage} />;
      case PAGES.ADVISOR:   return <ChatPanel />;
      case PAGES.PROFILE:   return <BehaviourProfile />;
      case PAGES.DASHBOARD: return <Dashboard />;
      case PAGES.GOALS:     return <GoalSimulator />;
      default:              return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  const navItems = [
    { page: PAGES.HOME,      icon: 'home',         label: 'Home' },
    { page: PAGES.DASHBOARD, icon: 'bar_chart',    label: 'Dashboard' },
    { page: PAGES.PROFILE,   icon: 'person_search',label: 'Profile' },
    { page: PAGES.GOALS,     icon: 'target',        label: 'Goals' },
  ];

  return (
    <div className="app-container">
      {/* Top Navigation (mobile only) */}
      <nav className="top-nav">
        <div className="top-nav-brand">
          <div className="top-nav-logo">M</div>
          <div>
            <div className="top-nav-title">MoneyMan</div>
            <div className="top-nav-subtitle">AI Wealth Advisor · IDBI Bank</div>
          </div>
        </div>
        <div className="top-nav-actions">
          <motion.button whileTap={{ scale: 0.88 }} className="btn-ghost" onClick={toggleTheme} title="Toggle theme">
            <span className="material-symbols-rounded icon">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
          </motion.button>
          <motion.button whileTap={{ scale: 0.88 }} className="btn-ghost notification-dot" onClick={() => setCurrentPage(PAGES.PROFILE)} title="Notifications">
            <span className="material-symbols-rounded icon">notifications</span>
          </motion.button>
        </div>
      </nav>

      {/* Page Content with AnimatePresence */}
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Nav (mobile) / Sidebar (desktop) */}
      <nav className="bottom-nav">
        {/* Sidebar brand block — visible only on desktop via CSS */}
        <div className="sidebar-brand">
          <div className="sidebar-logo">M</div>
          <div className="sidebar-logo-text">
            <div className="sidebar-logo-title">MoneyMan</div>
            <div className="sidebar-logo-sub">IDBI · AI Wealth Advisor</div>
          </div>
        </div>

        {/* Advisor center avatar button (mobile only layout) */}
        <button
          className={`bottom-nav-item ${currentPage === PAGES.ADVISOR ? 'active' : ''}`}
          onClick={() => setCurrentPage(PAGES.ADVISOR)}
          id="nav-advisor"
          style={{ order: 2 }}
        >
          <div className="bottom-nav-avatar">
            <span className="material-symbols-rounded">psychology</span>
          </div>
          <span style={{ marginTop: 2, fontSize: '0.625rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Advisor</span>
        </button>

        {/* Regular nav items */}
        {navItems.map((item, idx) => (
          <button
            key={item.page}
            className={`bottom-nav-item ${currentPage === item.page ? 'active' : ''}`}
            onClick={() => setCurrentPage(item.page)}
            id={`nav-${item.label.toLowerCase()}`}
            style={{ order: idx < 2 ? idx : idx + 1 }}
          >
            <span className="material-symbols-rounded icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}

        {/* Theme toggle */}
        <button
          className="bottom-nav-item bottom-nav-theme-toggle"
          onClick={toggleTheme}
          title="Toggle Theme"
          style={{ order: 10 }}
        >
          <span className="material-symbols-rounded icon">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
          <span>Theme</span>
        </button>
      </nav>
    </div>
  );
}
