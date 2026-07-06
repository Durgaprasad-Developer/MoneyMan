import React, { useState } from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import ChatPanel from './components/Chat/ChatPanel';
import BehaviourProfile from './components/Profile/BehaviourProfile';
import RecommendationsList from './components/Recommendations/RecommendationCard';
import GoalSimulator from './components/GoalSimulator/GoalSimulator';
import NudgePanel from './components/Nudges/NudgePanel';
import { PAGES } from './utils/constants';

function HomePage({ setCurrentPage }) {
  return (
    <div className="page-content page-enter">
      {/* Welcome section */}
      <div className="home-welcome animate-fade-in-up">
        <div className="home-greeting">
          <span className="home-greeting-text">Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'},</span>
          <h1 className="home-name gradient-text">Rahul</h1>
        </div>
        <div className="home-avatar-badge">
          <span className="material-symbols-rounded" style={{ color: 'white', fontSize: 20 }}>psychology</span>
        </div>
      </div>

      {/* Nudges (proactive alerts) */}
      <NudgePanel />

      {/* Quick Stats */}
      <div className="home-stats animate-fade-in-up delay-1">
        <div className="glass-card home-stat">
          <span className="material-symbols-rounded icon" style={{ color: 'var(--accent-blue)' }}>account_balance_wallet</span>
          <div>
            <div className="stat-value gradient-text" style={{ fontSize: '1.1rem' }}>₹5.0L</div>
            <div className="stat-label">Portfolio</div>
          </div>
        </div>
        <div className="glass-card home-stat">
          <span className="material-symbols-rounded icon" style={{ color: 'var(--accent-teal)' }}>speed</span>
          <div>
            <div className="stat-value" style={{ fontSize: '1.1rem', color: 'var(--accent-teal)' }}>42</div>
            <div className="stat-label">Risk Score</div>
          </div>
        </div>
      </div>

      {/* Feature cards */}
      <div className="home-features animate-fade-in-up delay-2">
        <div className="home-feature-card" style={{ background: 'linear-gradient(135deg, rgba(67, 97, 238, 0.12), rgba(123, 47, 247, 0.08))' }}>
          <div className="home-feature-icon" style={{ background: 'rgba(67, 97, 238, 0.2)' }}>
            <span className="material-symbols-rounded" style={{ color: 'var(--accent-blue)' }}>auto_awesome</span>
          </div>
          <div className="home-feature-info">
            <h3>AI Behaviour Analysis</h3>
            <p>Your spending & investment patterns auto-analyzed from 6 months of transactions</p>
          </div>
        </div>
        <div className="home-feature-card" style={{ background: 'linear-gradient(135deg, rgba(6, 214, 160, 0.12), rgba(4, 179, 129, 0.08))' }}>
          <div className="home-feature-icon" style={{ background: 'rgba(6, 214, 160, 0.2)' }}>
            <span className="material-symbols-rounded" style={{ color: 'var(--accent-teal)' }}>psychology</span>
          </div>
          <div className="home-feature-info">
            <h3>Explainable Advice</h3>
            <p>Every recommendation comes with a data-driven "why" — transparent and auditable</p>
          </div>
        </div>
        <div className="home-feature-card" style={{ background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.12), rgba(255, 209, 102, 0.08))' }}>
          <div className="home-feature-icon" style={{ background: 'rgba(255, 107, 53, 0.2)' }}>
            <span className="material-symbols-rounded" style={{ color: 'var(--accent-orange)' }}>notifications_active</span>
          </div>
          <div className="home-feature-info">
            <h3>Proactive Nudges</h3>
            <p>MoneyMan reaches out when it spots changes — no need to ask</p>
          </div>
        </div>
      </div>

      {/* IDBI integration callout */}
      <div className="glass-card home-integration animate-fade-in-up delay-3">
        <div className="home-integration-badge">
          <span className="material-symbols-rounded" style={{ color: 'var(--accent-teal)', fontSize: 16 }}>verified</span>
          <span>IDBI Bank Integration Ready</span>
        </div>
        <p className="home-integration-text">
          MoneyMan is designed as a module that plugs directly into IDBI's mobile banking app via APIs. It uses sandbox banking APIs and works with synthetic datasets.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState(PAGES.HOME);

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
          <button className="btn-ghost notification-dot" onClick={() => setCurrentPage(PAGES.PROFILE)}>
            <span className="material-symbols-rounded icon">notifications</span>
          </button>
          <button className="btn-ghost" onClick={() => setCurrentPage(PAGES.PROFILE)}>
            <span className="material-symbols-rounded icon">account_circle</span>
          </button>
        </div>
      </nav>

      {/* Page Content */}
      <main key={currentPage}>
        {renderPage()}
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
      </nav>
    </div>
  );
}
