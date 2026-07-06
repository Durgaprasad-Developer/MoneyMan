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
    transition: { staggerChildren: 0.1 }
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
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
        <div className="home-avatar-badge">
          <span className="material-symbols-rounded" style={{ color: 'white', fontSize: 32 }}>psychology</span>
        </div>
      </motion.div>

      {/* Quick Stats side by side */}
      <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="bento-card card-blue home-stat">
        <span className="material-symbols-rounded icon">account_balance_wallet</span>
        <div>
          <div className="stat-value" style={{ fontSize: '1.2rem' }}>₹5.0L</div>
          <div className="stat-label text-muted">Portfolio</div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="bento-card card-yellow home-stat">
        <span className="material-symbols-rounded icon">speed</span>
        <div>
          <div className="stat-value">42</div>
          <div className="stat-label text-muted">Risk Score</div>
        </div>
      </motion.div>

      {/* Feature cards spanning full width */}
      <motion.div variants={itemVariants} whileHover={{ scale: 1.01 }} className="bento-card card-purple bento-col-span-full bento-feature">
        <div className="home-feature-icon" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
          <span className="material-symbols-rounded icon">auto_awesome</span>
        </div>
        <div className="home-feature-info">
          <h3>AI Behaviour Analysis</h3>
          <p className="text-muted">Your spending & investment patterns auto-analyzed from 6 months of transactions</p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} whileHover={{ scale: 1.01 }} className="bento-card card-green bento-col-span-full bento-feature">
        <div className="home-feature-icon" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
          <span className="material-symbols-rounded icon">psychology</span>
        </div>
        <div className="home-feature-info">
          <h3>Explainable Advice</h3>
          <p className="text-muted">Every recommendation comes with a data-driven "why" — transparent and auditable</p>
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
      case PAGES.HOME: return <HomePage setCurrentPage={setCurrentPage} />;
      case PAGES.ADVISOR: return <ChatPanel />;
      case PAGES.PROFILE: return <BehaviourProfile />;
      case PAGES.DASHBOARD: return <Dashboard />;
      case PAGES.GOALS: return <GoalSimulator />;
      default: return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <nav className="top-nav">
        <div className="top-nav-brand">
          <div className="top-nav-logo">M</div>
          <div>
            <div className="top-nav-title">MoneyMan</div>
            <div className="top-nav-subtitle">AI Wealth Advisor</div>
          </div>
        </div>
        <div className="top-nav-actions">
          <motion.button whileTap={{ scale: 0.9 }} className="btn-ghost" onClick={toggleTheme}>
            <span className="material-symbols-rounded icon">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
          </motion.button>
          <motion.button whileTap={{ scale: 0.9 }} className="btn-ghost notification-dot" onClick={() => setCurrentPage(PAGES.PROFILE)}>
            <span className="material-symbols-rounded icon">notifications</span>
          </motion.button>
        </div>
      </nav>

      {/* Page Content with AnimatePresence */}
      <main>
        <AnimatePresence mode="wait">
          <motion.div key={currentPage} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}>
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button
          className={`bottom-nav-item ${currentPage === PAGES.HOME ? 'active' : ''}`}
          onClick={() => setCurrentPage(PAGES.HOME)}
          id="nav-home"
        >
          <span className="material-symbols-rounded icon">home</span>
          <span>Home</span>
        </button>
        <button
          className={`bottom-nav-item ${currentPage === PAGES.DASHBOARD ? 'active' : ''}`}
          onClick={() => setCurrentPage(PAGES.DASHBOARD)}
          id="nav-dashboard"
        >
          <span className="material-symbols-rounded icon">bar_chart</span>
          <span>Dashboard</span>
        </button>

        {/* Center avatar button */}
        <button
          className={`bottom-nav-item ${currentPage === PAGES.ADVISOR ? 'active' : ''}`}
          onClick={() => setCurrentPage(PAGES.ADVISOR)}
          id="nav-advisor"
        >
          <div className="bottom-nav-avatar">
            <span className="material-symbols-rounded">psychology</span>
          </div>
          <span style={{ marginTop: 4 }}>Advisor</span>
        </button>

        <button
          className={`bottom-nav-item ${currentPage === PAGES.PROFILE ? 'active' : ''}`}
          onClick={() => setCurrentPage(PAGES.PROFILE)}
          id="nav-profile"
        >
          <span className="material-symbols-rounded icon">person_search</span>
          <span>Profile</span>
        </button>
        <button
          className={`bottom-nav-item ${currentPage === PAGES.GOALS ? 'active' : ''}`}
          onClick={() => setCurrentPage(PAGES.GOALS)}
          id="nav-goals"
        >
          <span className="material-symbols-rounded icon">target</span>
          <span>Goals</span>
        </button>

        <button
          className="bottom-nav-item bottom-nav-theme-toggle"
          onClick={toggleTheme}
          title="Toggle Theme"
        >
          <span className="material-symbols-rounded icon">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
        </button>
      </nav>
    </div>
  );
}
