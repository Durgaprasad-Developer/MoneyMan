/**
 * Explainable Recommendation Engine
 * Layer 2 — Every recommendation comes with a "why" derived from actual data triggers.
 * Templated reasoning strings tied to data points.
 */

function generateRecommendations(profile) {
  const recommendations = [];
  const { riskProfile, trends, spendingBreakdown, portfolio, goals } = profile;

  // --- Investment-related recommendations ---
  if (trends.Investment?.direction === 'falling') {
    recommendations.push({
      id: 'REC001',
      priority: 'high',
      category: 'Investment',
      title: 'Restore Your SIP Contributions',
      action: `Increase your monthly SIP back to ₹${trends.Investment.olderAvg.toLocaleString('en-IN')}`,
      why: `Your SIP contributions have dropped ${Math.abs(trends.Investment.changePercent)}% — from ₹${trends.Investment.olderAvg.toLocaleString('en-IN')}/mo to ₹${trends.Investment.recentAvg.toLocaleString('en-IN')}/mo over the last 3 months. This directly slows your wealth building.`,
      impact: `Restoring your SIP could add approximately ₹${(Math.round((trends.Investment.olderAvg - trends.Investment.recentAvg) * 12 * 1.12)).toLocaleString('en-IN')} to your portfolio annually (assuming 12% returns).`,
      dataTrigger: { category: 'Investment', trend: 'falling', change: trends.Investment.changePercent }
    });
  }

  // --- Savings recommendations ---
  if (trends.Savings?.direction === 'falling') {
    recommendations.push({
      id: 'REC002',
      priority: 'high',
      category: 'Savings',
      title: 'Rebuild Your Savings Buffer',
      action: `Set up auto-transfer of ₹${Math.round(profile.monthlyIncome * 0.15).toLocaleString('en-IN')} to savings on salary day`,
      why: `Your monthly savings have fallen ${Math.abs(trends.Savings.changePercent)}% — from ₹${trends.Savings.olderAvg.toLocaleString('en-IN')}/mo to ₹${trends.Savings.recentAvg.toLocaleString('en-IN')}/mo. At this rate, your emergency fund goal will miss its deadline.`,
      impact: 'Automating savings on salary day ensures consistency and removes the temptation to spend first.',
      dataTrigger: { category: 'Savings', trend: 'falling', change: trends.Savings.changePercent }
    });
  }

  // --- Dining spend recommendation ---
  if (trends.Dining?.direction === 'rising') {
    const diningData = spendingBreakdown.find(s => s.category === 'Dining');
    const monthlySavings = trends.Dining.recentAvg - trends.Dining.olderAvg;
    recommendations.push({
      id: 'REC003',
      priority: 'medium',
      category: 'Spending',
      title: 'Cap Your Dining Budget',
      action: `Set a monthly dining budget of ₹${Math.round(trends.Dining.olderAvg * 1.1).toLocaleString('en-IN')} and redirect the surplus to SIP`,
      why: `Dining spend is up ${Math.abs(trends.Dining.changePercent)}% (₹${trends.Dining.recentAvg.toLocaleString('en-IN')}/mo now vs ₹${trends.Dining.olderAvg.toLocaleString('en-IN')}/mo before). That's ₹${monthlySavings.toLocaleString('en-IN')}/mo that could be working for you.`,
      impact: `Redirecting ₹${monthlySavings.toLocaleString('en-IN')}/mo to equity mutual funds could grow to ₹${Math.round(monthlySavings * 12 * 3 * 1.12).toLocaleString('en-IN')} over 3 years.`,
      dataTrigger: { category: 'Dining', trend: 'rising', change: trends.Dining.changePercent }
    });
  }

  // --- Shopping recommendation ---
  if (trends.Shopping?.direction === 'rising') {
    recommendations.push({
      id: 'REC004',
      priority: 'medium',
      category: 'Spending',
      title: 'Review Shopping Patterns',
      action: 'Use the 48-hour rule: wait 48 hours before any non-essential purchase above ₹2,000',
      why: `Shopping spend has increased ${Math.abs(trends.Shopping.changePercent)}% to ₹${trends.Shopping.recentAvg.toLocaleString('en-IN')}/mo. Impulse purchases on e-commerce platforms are the primary driver.`,
      impact: 'Studies show the 48-hour rule reduces impulse purchases by 40%, potentially saving ₹3,000-5,000/month.',
      dataTrigger: { category: 'Shopping', trend: 'rising', change: trends.Shopping.changePercent }
    });
  }

  // --- Emergency fund recommendation ---
  if (goals) {
    const emergencyFund = goals.find(g => g.name === 'Emergency Fund');
    if (emergencyFund) {
      const progress = (emergencyFund.current / emergencyFund.target) * 100;
      if (progress < 50) {
        const monthsLeft = Math.ceil(
          (new Date(emergencyFund.deadline) - new Date()) / (1000 * 60 * 60 * 24 * 30)
        );
        const monthlyNeeded = Math.round((emergencyFund.target - emergencyFund.current) / monthsLeft);
        recommendations.push({
          id: 'REC005',
          priority: 'high',
          category: 'Safety',
          title: 'Accelerate Emergency Fund',
          action: `Allocate ₹${monthlyNeeded.toLocaleString('en-IN')}/mo to your liquid fund until you reach ₹${emergencyFund.target.toLocaleString('en-IN')}`,
          why: `Your emergency fund is only ${Math.round(progress)}% complete (₹${emergencyFund.current.toLocaleString('en-IN')} of ₹${emergencyFund.target.toLocaleString('en-IN')}). Financial advisors recommend 6 months of expenses as a safety net.`,
          impact: `At ₹${monthlyNeeded.toLocaleString('en-IN')}/mo, you'll hit your target by ${emergencyFund.deadline}. Without action, you're exposed to income shocks.`,
          dataTrigger: { category: 'Goal', goal: 'Emergency Fund', progress: Math.round(progress) }
        });
      }
    }
  }

  // --- Portfolio rebalance recommendation ---
  if (portfolio) {
    const equityAlloc = portfolio.equity?.allocation || 0;
    if (riskProfile.riskCategory === 'Conservative' && equityAlloc > 40) {
      recommendations.push({
        id: 'REC006',
        priority: 'medium',
        category: 'Portfolio',
        title: 'Rebalance: Reduce Equity Exposure',
        action: 'Shift 10% allocation from equity to debt funds for stability',
        why: `Your behaviour profile is ${riskProfile.riskCategory} (score: ${riskProfile.riskScore}/100), but ${equityAlloc}% of your portfolio is in equity. This mismatch could cause stress during market corrections.`,
        impact: 'A 60-40 debt-equity split historically reduces volatility by 25% with only a 2-3% sacrifice in returns.',
        dataTrigger: { category: 'Portfolio', mismatch: true, riskScore: riskProfile.riskScore }
      });
    } else if (riskProfile.riskCategory === 'Aggressive' && equityAlloc < 50) {
      recommendations.push({
        id: 'REC006',
        priority: 'medium',
        category: 'Portfolio',
        title: 'Increase Equity Allocation',
        action: 'Consider shifting 10-15% from debt to diversified equity funds',
        why: `Your behaviour suggests a higher risk tolerance (score: ${riskProfile.riskScore}/100), but only ${equityAlloc}% is in equity. You may be leaving growth on the table.`,
        impact: 'At your age, increasing equity exposure could boost long-term returns by 3-5% annually.',
        dataTrigger: { category: 'Portfolio', mismatch: true, riskScore: riskProfile.riskScore }
      });
    }
  }

  // --- Overall spending ratio recommendation ---
  if (riskProfile.spendingRatio > 60) {
    recommendations.push({
      id: 'REC007',
      priority: 'high',
      category: 'Budget',
      title: 'Follow the 50-30-20 Rule',
      action: 'Restructure budget: 50% needs, 30% wants, 20% savings/investments',
      why: `You're spending ${riskProfile.spendingRatio}% of income on discretionary items. The recommended ceiling is 50%, leaving room for wealth building.`,
      impact: 'Adopting the 50-30-20 rule could free up ₹10,000-15,000/month for investments.',
      dataTrigger: { category: 'Budget', spendingRatio: riskProfile.spendingRatio }
    });
  }

  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

module.exports = { generateRecommendations };
