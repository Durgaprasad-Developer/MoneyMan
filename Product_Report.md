# IDBI Innovate 2026: Product Report
**Project Name:** MoneyMan - AI-Powered Digital Wealth Advisory Avatar
**Track:** 01 (Digital Wealth Advisory)

---

## 1. Product Overview: What It Is & Why We Built It

**The Problem:** Current wealth advisory solutions are fragmented, largely inaccessible to average users, and lack comprehensive integration of customer investment behavior and daily spending habits. Most banks rely on static, 20-question risk forms that fail to capture a user's true financial reality.

**The Solution:** We built **MoneyMan**, an AI-powered Digital Wealth Advisory Avatar. However, MoneyMan is not just a chatbot that answers FAQs. It is built on a **"Financial Behaviour Twin"**—a living, breathing data model that infers a user's risk profile and financial habits directly from their transaction data. 

**Why We Built It:** We designed this specifically for integration into IDBI's existing mobile and web platforms. By focusing on behavioral inference, explainability (the "why" behind every piece of advice), and proactive nudging, we provide a solution that is compliance-friendly, highly scalable, and truly personalized.

---

## 2. The "Wow Factor": The Financial Behaviour Twin

Our core differentiator is the three-layered architecture of the Financial Behaviour Twin:

1. **Layer 1: Behavioural Profiling Engine**
   Instead of asking the user static questions, our engine silently analyzes 6 months of transaction data to auto-generate a dynamic risk profile (e.g., Risk Score: 41) and a spending pattern summary. This is the foundation of our AI claim.
2. **Layer 2: Explainable Recommendations**
   Financial advice without explainability is a compliance non-starter for a bank. Every suggestion MoneyMan makes comes with a direct, data-driven "why" (e.g., *"We recommend rebalancing because your SIP contributions have dropped 53% while dining spend increased."*).
3. **Layer 3: Proactive Nudges & Goal Simulation**
   MoneyMan doesn't wait to be asked. It proactively nudges the user when it detects behavioral anomalies and provides a highly interactive "what-if" goal simulator to show how small adjustments change long-term outcomes.

---

## 3. Feature Breakdown & Proof of Execution

Below is the detailed breakdown of the features requested in the build plan, alongside explanations of how they are implemented in our application.

> [!NOTE]
> *(Insert your actual application screenshots in the placeholder image tags below before submitting your final PPT/Report!)*

### Feature 1: Auto Risk/Behaviour Profile from Transaction Data
**Status:** ✅ Implemented (Must-Have)
**Explanation:** On the Profile tab, the user's risk score, investment-to-savings ratios, and spending breakdown are automatically visualized. We use a Neo-Bento grid to display this data cleanly. It clearly states: *"Auto-generated from 6 months of transaction data — no questionnaire needed."*
**Screenshot Proof:**
![Behaviour Profile Screenshot](./screenshots/profile_view.png)

### Feature 2: Conversational Avatar (Browser-Native Voice In/Out)
**Status:** ✅ Implemented (Must-Have)
**Explanation:** Located in the **Advisor** tab, MoneyMan acts as a conversational AI. We utilized the browser's native `SpeechRecognition` and `SpeechSynthesis` APIs to achieve zero-cost, real-time voice interactions. The avatar features dynamic mouth-states (idle, listening, speaking, thinking) and the UI is built with premium, floating Neo-Brutalist chat bubbles.
**Screenshot Proof:**
![Conversational Avatar Screenshot](./screenshots/advisor_view.png)

### Feature 3: Explainable "Why" on Every Recommendation
**Status:** ✅ Implemented (Must-Have)
**Explanation:** Throughout the dashboard and profile, Insights and Recommendations are paired with raw data triggers. For example, in the Behavioural Insights card, a warning explicitly states: *"Investment contributions have dropped 53% (SIP reduced from ₹11,333/mo to ₹5,333/mo)."* This ensures total transparency.
**Screenshot Proof:**
![Explainable Insights Screenshot](./screenshots/insights_view.png)

### Feature 4: Portfolio/Allocation Dashboard
**Status:** ✅ Implemented (Must-Have)
**Explanation:** The **Home/Dashboard** features a premium Neo-Bento UI displaying Total Portfolio value, Monthly Income, Risk Score, and a beautiful Recharts-powered area chart tracking spending vs. investment trends over a 6-month period.
**Screenshot Proof:**
![Dashboard Overview Screenshot](./screenshots/dashboard_view.png)

### Feature 5: Proactive Nudge Notifications
**Status:** ✅ Implemented (Should-Have)
**Explanation:** We built **MoneyMan Alerts** as a dedicated Nudge Panel. These alerts are heavily rounded, color-coded solid blocks (Red for Critical, Yellow for Warning, Blue for Info). They proactively warn the user about things like "Emergency Fund: 30% with 6mo left" or "Dining spend up 132%," allowing the user to expand the alert to hear directly from the AI.
**Screenshot Proof:**
![MoneyMan Alerts Screenshot](./screenshots/nudges_view.png)

### Feature 6: Goal-Based What-If Simulator
**Status:** ✅ Implemented (Should-Have)
**Explanation:** In the **Goals** tab, users can interact with a fluid slider to adjust their "Monthly Investment." As they drag the slider, the projected growth chart and the "Months to Goal" metrics update in real-time. It actively warns the user if they are behind schedule based on their current trajectory.
**Screenshot Proof:**
![Goal Simulator Screenshot](./screenshots/goals_view.png)

### Feature 7: Premium UI/UX (Neo-Bento Aesthetic)
**Status:** ✅ Implemented (Stretch/Polish)
**Explanation:** To ensure our application looks better than standard bank apps (Visa/Mastercard standard), we implemented a **Neo-Bento** design system. It features extreme border radii (40px), high-contrast solid color blocks, massive typography (font-weight 900), and a seamless global Light/Dark mode toggle.
**Screenshot Proof:**
![Light/Dark Theme Screenshot](./screenshots/theme_toggle.png)

---

## 4. Architecture & Bank Feasibility

We architected this solution specifically to prove to IDBI judges that it is not a hackathon toy, but a deployable module:

1. **Frontend (React/Vite):** Mobile-first, responsive Neo-Bento UI. It acts as a lightweight wrapper that can easily be embedded as a webview inside IDBI's existing mobile banking app.
2. **API & Data Layer:** Currently running on mock synthetic data designed to perfectly match the shape of standard banking transaction APIs. Once IDBI sandbox APIs are provided, swapping the data source is a one-line configuration change.
3. **AI Engine:** The conversational logic and explainability template engine operate efficiently to parse transaction data into readable insights without requiring expensive, heavy LLM calls for every single UI render. Voice synthesis is handled entirely on the client side, resulting in **near-zero marginal cost per user**.

**Conclusion:** MoneyMan delivers exactly what the track demands—a deep integration of AI and financial data, a highly transparent and compliant advisory model, and a stunning, bank-ready user interface.
