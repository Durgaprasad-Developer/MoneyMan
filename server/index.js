if (typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile();
  } catch (e) {}
}

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const { buildProfile } = require('./engines/profiling');
const { generateRecommendations } = require('./engines/recommendations');
const { generateNudges, simulateGoal } = require('./engines/nudges');

const app = express();
app.use(cors());
app.use(express.json());

// Load mock data
const transactions = require('./data/transactions.json');
const customers = require('./data/customers.json');

// Cache profile to avoid recomputation
let cachedProfile = null;

function getProfile() {
  if (!cachedProfile) {
    cachedProfile = buildProfile(transactions, customers[0]);
  }
  return cachedProfile;
}

// ===== API ROUTES =====

// GET /api/profile — Full behavioural profile
app.get('/api/profile', (req, res) => {
  try {
    const profile = getProfile();
    res.json({ success: true, data: profile });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/recommendations — Explainable recommendations
app.get('/api/recommendations', (req, res) => {
  try {
    const profile = getProfile();
    const recommendations = generateRecommendations(profile);
    res.json({ success: true, data: recommendations });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/nudges — Proactive nudge notifications
app.get('/api/nudges', (req, res) => {
  try {
    const profile = getProfile();
    const nudges = generateNudges(profile);
    res.json({ success: true, data: nudges });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/simulate — Goal simulator
app.post('/api/simulate', (req, res) => {
  try {
    const { goalName, monthlyInvestment, expectedReturn } = req.body;
    const profile = getProfile();
    const goal = profile.goals?.find(g => g.name === goalName) || profile.goals?.[0];
    if (!goal) {
      return res.status(404).json({ success: false, error: 'Goal not found' });
    }
    const simulation = simulateGoal(goal, monthlyInvestment || 10000, expectedReturn || 12);
    res.json({ success: true, data: simulation });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/chat — AI chat (integrating Groq API)
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const profile = getProfile();
    const recommendations = generateRecommendations(profile);
    
    const contextStr = JSON.stringify({
      riskProfile: profile.riskProfile,
      spendingTrends: profile.trends,
      recommendations: recommendations.slice(0, 3)
    });

    const systemPrompt = `You are MoneyMan, an AI wealth advisor for IDBI Bank.
    Keep responses extremely concise (max 2-3 sentences). Do not use markdown.
    User's financial context:
    ${contextStr}
    `;

    try {
      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          max_tokens: 150,
          temperature: 0.5
        })
      });
      
      const groqData = await groqResponse.json();
      const aiResponse = groqData.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that.";
      
      res.json({
        success: true,
        data: {
          message: aiResponse,
          relatedData: null,
          timestamp: new Date().toISOString()
        }
      });
    } catch (apiError) {
      console.error('Groq API Error:', apiError);
      res.json({
        success: true,
        data: {
          message: "I'm having trouble reaching my brain right now, but I can see your profile is looking healthy.",
          relatedData: null,
          timestamp: new Date().toISOString()
        }
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/dashboard — Aggregated dashboard data
app.get('/api/dashboard', (req, res) => {
  try {
    const profile = getProfile();
    const recommendations = generateRecommendations(profile);
    const nudges = generateNudges(profile);

    // Build monthly spending trend for charts
    const months = Object.keys(profile.monthlyData).sort();
    const spendingTrend = months.map(m => {
      const data = profile.monthlyData[m];
      return {
        month: m,
        label: new Date(m + '-01').toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
        Dining: data.Dining || 0,
        Shopping: data.Shopping || 0,
        Bills: data.Bills || 0,
        Transport: data.Transport || 0,
        Entertainment: data.Entertainment || 0,
        Investment: data.Investment || 0,
        Savings: data.Savings || 0,
        totalSpending: ['Dining', 'Shopping', 'Bills', 'Transport', 'Entertainment']
          .reduce((sum, cat) => sum + (data[cat] || 0), 0)
      };
    });

    // Portfolio allocation for pie chart
    const portfolioData = Object.entries(profile.portfolio).map(([key, val]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
      value: val.value || 0,
      allocation: val.allocation || 0
    }));

    res.json({
      success: true,
      data: {
        customer: {
          name: profile.customerName,
          monthlyIncome: profile.monthlyIncome,
          riskProfile: profile.riskProfile
        },
        spendingTrend,
        spendingBreakdown: profile.spendingBreakdown,
        portfolioData,
        goals: profile.goals,
        recommendationCount: recommendations.length,
        nudgeCount: nudges.length,
        totalPortfolioValue: portfolioData.reduce((sum, p) => sum + p.value, 0)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Serve static assets in production
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`MoneyMan API server running on port ${PORT}`);
});
