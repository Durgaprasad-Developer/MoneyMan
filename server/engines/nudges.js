/**
 * Proactive Nudge Engine
 * Layer 3 — Avatar-initiated check-ins based on detected behaviour changes.
 */

function generateNudges(profile) {
  const nudges = [];
  const { trends, riskProfile, goals } = profile;

  // Dining spike nudge
  if (trends.Dining?.direction === 'rising' && Math.abs(trends.Dining.changePercent) > 20) {
    nudges.push({
      id: 'NUDGE001',
      type: 'spending_alert',
      severity: 'warning',
      avatar_message: `Hey Rahul! I noticed your dining expenses have jumped ${Math.abs(trends.Dining.changePercent)}% this month. That's ₹${(trends.Dining.recentAvg - trends.Dining.olderAvg).toLocaleString('en-IN')} more than your usual. Want me to suggest a dining budget that keeps your savings on track?`,
      short_message: `Dining spend up ${Math.abs(trends.Dining.changePercent)}%`,
      action_prompt: 'Set a dining budget',
      timestamp: new Date().toISOString(),
      dismissed: false
    });
  }

  // Investment drop nudge
  if (trends.Investment?.direction === 'falling') {
    nudges.push({
      id: 'NUDGE002',
      type: 'investment_alert',
      severity: 'critical',
      avatar_message: `Rahul, I've been tracking your SIP contributions and they've decreased from ₹${trends.Investment.olderAvg.toLocaleString('en-IN')} to ₹${trends.Investment.recentAvg.toLocaleString('en-IN')} per month. This could delay your home down payment goal by over a year. Shall we look at adjusting your budget to restore your SIP?`,
      short_message: 'SIP contributions declining',
      action_prompt: 'Review SIP plan',
      timestamp: new Date().toISOString(),
      dismissed: false
    });
  }

  // Savings decline nudge
  if (trends.Savings?.direction === 'falling') {
    nudges.push({
      id: 'NUDGE003',
      type: 'savings_alert',
      severity: 'warning',
      avatar_message: `I noticed your monthly savings have dropped to ₹${trends.Savings.recentAvg.toLocaleString('en-IN')}. Your emergency fund is still building — would you like me to set up an automatic savings transfer on your salary day so it happens before you spend?`,
      short_message: 'Savings rate declining',
      action_prompt: 'Auto-save setup',
      timestamp: new Date().toISOString(),
      dismissed: false
    });
  }

  // Goal progress nudge
  if (goals) {
    goals.forEach(goal => {
      const progress = (goal.current / goal.target) * 100;
      const deadline = new Date(goal.deadline);
      const now = new Date();
      const monthsLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24 * 30));
      const monthlyNeeded = Math.round((goal.target - goal.current) / Math.max(monthsLeft, 1));
      
      if (progress < 40 && monthsLeft < 12) {
        nudges.push({
          id: `NUDGE_GOAL_${goal.name.replace(/\s/g, '_')}`,
          type: 'goal_alert',
          severity: 'critical',
          avatar_message: `Your "${goal.name}" goal is ${Math.round(progress)}% complete with only ${monthsLeft} months left. You'd need ₹${monthlyNeeded.toLocaleString('en-IN')}/month to reach it on time. Want to explore some options to accelerate this?`,
          short_message: `${goal.name}: ${Math.round(progress)}% with ${monthsLeft}mo left`,
          action_prompt: 'Explore options',
          timestamp: new Date().toISOString(),
          dismissed: false
        });
      }
    });
  }

  // Overall health check nudge
  if (riskProfile.spendingRatio > 55) {
    nudges.push({
      id: 'NUDGE_HEALTH',
      type: 'health_check',
      severity: 'info',
      avatar_message: `Hi Rahul! Time for your monthly financial health check. You're currently spending ${riskProfile.spendingRatio}% of your income on discretionary items. I have ${nudges.length} suggestions that could help you optimize. Want to take a look?`,
      short_message: 'Monthly health check ready',
      action_prompt: 'View suggestions',
      timestamp: new Date().toISOString(),
      dismissed: false
    });
  }

  return nudges;
}

/**
 * Goal simulator — calculates what-if scenarios for investment changes
 */
function simulateGoal(goal, monthlyInvestment, expectedReturn = 12) {
  const remaining = goal.target - goal.current;
  const monthlyRate = expectedReturn / 100 / 12;
  
  // Calculate months to goal with compound interest
  // FV = PMT * ((1 + r)^n - 1) / r
  // Solving for n: n = log(1 + remaining * r / PMT) / log(1 + r)
  
  let monthsToGoal;
  if (monthlyRate === 0) {
    monthsToGoal = Math.ceil(remaining / monthlyInvestment);
  } else {
    monthsToGoal = Math.ceil(
      Math.log(1 + (remaining * monthlyRate) / monthlyInvestment) / Math.log(1 + monthlyRate)
    );
  }

  // Generate projection data points
  const projections = [];
  let accumulated = goal.current;
  for (let month = 0; month <= Math.min(monthsToGoal + 6, 120); month++) {
    projections.push({
      month,
      value: Math.round(accumulated),
      target: goal.target
    });
    accumulated = accumulated * (1 + monthlyRate) + monthlyInvestment;
    if (accumulated >= goal.target * 1.2) break;
  }

  const deadline = new Date(goal.deadline);
  const now = new Date();
  const originalMonthsLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24 * 30));

  return {
    goalName: goal.name,
    target: goal.target,
    current: goal.current,
    monthlyInvestment,
    monthsToGoal,
    yearsToGoal: (monthsToGoal / 12).toFixed(1),
    onTrack: monthsToGoal <= originalMonthsLeft,
    monthsAheadOrBehind: originalMonthsLeft - monthsToGoal,
    projections,
    totalInvested: monthlyInvestment * monthsToGoal,
    wealthGained: Math.round(accumulated - goal.current - (monthlyInvestment * monthsToGoal))
  };
}

module.exports = { generateNudges, simulateGoal };
