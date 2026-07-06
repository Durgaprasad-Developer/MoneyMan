/**
 * Behavioural Profiling Engine
 * Layer 1 — Automatically generates a risk profile and spending pattern 
 * summary from transaction data. No questionnaire needed.
 */

const CATEGORIES = ['Dining', 'Shopping', 'Bills', 'Transport', 'Entertainment', 'Investment', 'Savings', 'Income'];

function categorizeTransactions(transactions) {
  const monthly = {};
  transactions.forEach(tx => {
    const month = tx.date.substring(0, 7); // YYYY-MM
    if (!monthly[month]) {
      monthly[month] = {};
      CATEGORIES.forEach(c => monthly[month][c] = 0);
    }
    if (monthly[month][tx.category] !== undefined) {
      monthly[month][tx.category] += tx.amount;
    }
  });
  return monthly;
}

function computeTrends(monthlyData) {
  const months = Object.keys(monthlyData).sort();
  if (months.length < 2) return {};

  const trends = {};
  CATEGORIES.forEach(cat => {
    const values = months.map(m => monthlyData[m][cat] || 0);
    const recent = values.slice(-3);
    const older = values.slice(0, -3).length > 0 ? values.slice(0, -3) : values.slice(0, 1);
    
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
    
    const changePercent = olderAvg === 0 ? 0 : Math.round(((recentAvg - olderAvg) / olderAvg) * 100);
    
    trends[cat] = {
      direction: changePercent > 10 ? 'rising' : changePercent < -10 ? 'falling' : 'stable',
      changePercent,
      recentAvg: Math.round(recentAvg),
      olderAvg: Math.round(olderAvg),
      monthlyValues: months.map((m, i) => ({ month: m, amount: values[i] }))
    };
  });
  return trends;
}

function computeRiskProfile(monthlyData, trends) {
  const months = Object.keys(monthlyData).sort();
  const latestMonths = months.slice(-3);
  
  // Calculate key ratios
  let totalIncome = 0, totalInvestment = 0, totalSavings = 0, totalSpending = 0;
  latestMonths.forEach(m => {
    totalIncome += monthlyData[m].Income || 0;
    totalInvestment += monthlyData[m].Investment || 0;
    totalSavings += monthlyData[m].Savings || 0;
    const spending = ['Dining', 'Shopping', 'Bills', 'Transport', 'Entertainment']
      .reduce((sum, cat) => sum + (monthlyData[m][cat] || 0), 0);
    totalSpending += spending;
  });

  const investmentRatio = totalIncome > 0 ? totalInvestment / totalIncome : 0;
  const savingsRatio = totalIncome > 0 ? totalSavings / totalIncome : 0;
  const spendingRatio = totalIncome > 0 ? totalSpending / totalIncome : 0;
  
  // Spending volatility (coefficient of variation)
  const spendingValues = months.map(m => 
    ['Dining', 'Shopping', 'Bills', 'Transport', 'Entertainment']
      .reduce((sum, cat) => sum + (monthlyData[m][cat] || 0), 0)
  );
  const avgSpending = spendingValues.reduce((a, b) => a + b, 0) / spendingValues.length;
  const variance = spendingValues.reduce((sum, v) => sum + Math.pow(v - avgSpending, 2), 0) / spendingValues.length;
  const volatility = avgSpending > 0 ? Math.sqrt(variance) / avgSpending : 0;

  // Risk score: 0-100 (0 = very conservative, 100 = very aggressive)
  let riskScore = 50;
  riskScore += (investmentRatio - 0.15) * 100; // More investment = more aggressive
  riskScore -= (savingsRatio - 0.1) * 50;       // More savings = more conservative
  riskScore += volatility * 30;                  // More volatile = more aggressive
  riskScore -= (trends.Investment?.direction === 'falling' ? 10 : 0);
  riskScore += (trends.Investment?.direction === 'rising' ? 10 : 0);
  
  riskScore = Math.max(0, Math.min(100, Math.round(riskScore)));

  let riskCategory;
  if (riskScore <= 33) riskCategory = 'Conservative';
  else if (riskScore <= 66) riskCategory = 'Moderate';
  else riskCategory = 'Aggressive';

  // Build behaviour insights
  const insights = [];
  
  if (trends.Dining?.direction === 'rising') {
    insights.push({
      type: 'warning',
      category: 'Dining',
      text: `Dining spend is up ${Math.abs(trends.Dining.changePercent)}% over recent months`,
      detail: `From ₹${trends.Dining.olderAvg.toLocaleString('en-IN')}/mo to ₹${trends.Dining.recentAvg.toLocaleString('en-IN')}/mo`
    });
  }
  
  if (trends.Investment?.direction === 'falling') {
    insights.push({
      type: 'critical',
      category: 'Investment',
      text: `Investment contributions have dropped ${Math.abs(trends.Investment.changePercent)}%`,
      detail: `SIP reduced from ₹${trends.Investment.olderAvg.toLocaleString('en-IN')}/mo to ₹${trends.Investment.recentAvg.toLocaleString('en-IN')}/mo`
    });
  }

  if (trends.Savings?.direction === 'falling') {
    insights.push({
      type: 'critical',
      category: 'Savings',
      text: `Savings rate has declined ${Math.abs(trends.Savings.changePercent)}%`,
      detail: `From ₹${trends.Savings.olderAvg.toLocaleString('en-IN')}/mo to ₹${trends.Savings.recentAvg.toLocaleString('en-IN')}/mo`
    });
  }

  if (trends.Shopping?.direction === 'rising') {
    insights.push({
      type: 'warning',
      category: 'Shopping',
      text: `Shopping spend is up ${Math.abs(trends.Shopping.changePercent)}%`,
      detail: `From ₹${trends.Shopping.olderAvg.toLocaleString('en-IN')}/mo to ₹${trends.Shopping.recentAvg.toLocaleString('en-IN')}/mo`
    });
  }

  if (trends.Entertainment?.direction === 'rising') {
    insights.push({
      type: 'info',
      category: 'Entertainment',
      text: `Entertainment spending trending up ${Math.abs(trends.Entertainment.changePercent)}%`,
      detail: `Consider setting a monthly entertainment budget`
    });
  }

  if (spendingRatio > 0.6) {
    insights.push({
      type: 'warning',
      category: 'Overall',
      text: `${Math.round(spendingRatio * 100)}% of income goes to discretionary spending`,
      detail: 'Financial advisors recommend keeping this below 50%'
    });
  }

  return {
    riskScore,
    riskCategory,
    investmentRatio: Math.round(investmentRatio * 100),
    savingsRatio: Math.round(savingsRatio * 100),
    spendingRatio: Math.round(spendingRatio * 100),
    volatility: Math.round(volatility * 100),
    insights
  };
}

function generateSpendingBreakdown(monthlyData) {
  const months = Object.keys(monthlyData).sort();
  const latestMonth = months[months.length - 1];
  const data = monthlyData[latestMonth];
  
  const spendCategories = ['Dining', 'Shopping', 'Bills', 'Transport', 'Entertainment'];
  const total = spendCategories.reduce((sum, cat) => sum + (data[cat] || 0), 0);
  
  return spendCategories.map(cat => ({
    category: cat,
    amount: data[cat] || 0,
    percentage: total > 0 ? Math.round(((data[cat] || 0) / total) * 100) : 0
  })).sort((a, b) => b.amount - a.amount);
}

function buildProfile(transactions, customer) {
  const monthlyData = categorizeTransactions(transactions);
  const trends = computeTrends(monthlyData);
  const riskProfile = computeRiskProfile(monthlyData, trends);
  const spendingBreakdown = generateSpendingBreakdown(monthlyData);

  return {
    customerId: customer.id,
    customerName: customer.name,
    generatedAt: new Date().toISOString(),
    monthlyIncome: customer.monthlyIncome,
    riskProfile,
    trends,
    spendingBreakdown,
    monthlyData,
    portfolio: customer.portfolio,
    goals: customer.goals
  };
}

module.exports = { buildProfile, categorizeTransactions, computeTrends, computeRiskProfile };
