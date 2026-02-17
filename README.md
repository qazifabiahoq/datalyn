# Datalyn — AI-Powered Agentic Business Analyst

> Stop guessing. Start knowing your business.

---
Live Demo:
https://smart-metrics-hub-3.preview.emergentagent.com/

## What is Datalyn?

Most businesses are drowning in data they can't understand. Revenue lives in one tool, customers in another, marketing in a third — and nobody has time to stitch it all together. By the time someone notices a problem, it's already too late.

**Datalyn is an AI-powered agentic business analyst** that connects to your data sources, monitors your business health automatically, and lets you have a natural language conversation with your data — like having a senior analyst available 24/7.

Instead of logging into five dashboards and building manual reports, you ask Datalyn: *"What's my biggest revenue risk this month?"* — and it investigates, reasons through the data, and comes back with a diagnosis and a recommended action. Autonomously. No prompting required.

---

## Who Is It For?

- **Startup founders** who need to understand their metrics without hiring a data team
- **Operations managers** drowning in spreadsheets and disconnected tools
- **Small and mid-size businesses** that can't afford a full-time business analyst
- **Investors and board members** who want a real-time pulse on portfolio companies

---

## The Problem It Solves

| Before Datalyn | With Datalyn |
|---|---|
| 2+ hours every Monday pulling reports manually | Automated weekly business health summary delivered to you |
| Data living in 10 disconnected tools | Single intelligent dashboard connected to all sources |
| Finding out about problems after they've hurt the business | Proactive anomaly detection flags issues before they escalate |
| Needing a data analyst to interpret numbers | Ask questions in plain English, get analyst-grade answers |

---

## Key Features

### Agentic AI Analyst
The core of Datalyn is not a chatbot — it's an agent. When you ask a business question, it doesn't just respond with generic text. It decides what data to examine, runs multi-step analysis across your metrics, identifies patterns and anomalies, and delivers a structured reasoning chain showing exactly how it reached its conclusion.

### Intelligent Dashboard
Real-time overview of your most critical SaaS metrics — MRR, Active Users, Conversion Rate, and Churn Rate — with week-over-week comparisons and a 30-day trend chart.

### Proactive Anomaly Detection
Datalyn monitors your data continuously. When something unusual happens — a revenue drop, a traffic spike, an abnormal churn pattern — it flags it automatically in plain English before you even knew to look.

### Integrations
Connect your existing tools: Google Sheets, QuickBooks, Notion, Slack, HubSpot, and Stripe. Datalyn pulls data from where it already lives — no migration required.

### Scheduled Reporting
Set a daily or weekly report schedule. Datalyn compiles a business health summary and delivers it automatically — zero manual work.

---

## How Agentic AI Works in Datalyn

Traditional AI tools answer questions and stop. Datalyn uses an **agentic architecture** — meaning the AI takes a sequence of autonomous actions to complete a goal, not just a single response.

Here's what happens when you ask *"Which user segment has the highest churn?"*:

```
Step 1: Segmentation Analysis
→ Agent retrieves churn data and segments by company size, industry, plan tier, and region
→ Identifies small business segment (1-50 employees) at 34% annual churn vs. company average of 22%

Step 2: Behavioral Pattern Identification  
→ Agent cross-references usage data for churning users
→ Finds 58% never completed onboarding, avg feature adoption only 3.2 of 12 core features
→ Pinpoints critical churn window: months 3-6 of subscription lifecycle

Step 3: Root Cause Assessment
→ Agent analyzes exit surveys and support ticket language
→ Primary drivers: perceived complexity (42%), lack of ROI (31%), insufficient team adoption (27%)

Recommendation:
→ Launch white-glove onboarding for small business tier
→ Build 90-day milestone program with automated check-ins
→ Projected outcome: reduce small business churn by 40-50% within 6 months
```

Each reasoning step is visible to the user — full transparency into how the AI reached its conclusion. This is what separates Datalyn from a generic chatbot.

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | React, Tailwind CSS, Shadcn UI, Recharts | Fast, modern, component-driven UI |
| Backend | Python, FastAPI | High-performance async API layer |
| Database | MongoDB | Flexible schema for varied business data structures |
| AI Engine | Claude Sonnet 4.5 (Anthropic) | Best-in-class reasoning for multi-step analysis |
| Authentication | JWT (JSON Web Tokens) | Secure, stateless auth |
| Charts | Recharts | Lightweight, composable data visualization |
| Deployment | Vercel (frontend) + Railway (backend) | Zero-config free deployment |

---

## Architecture Overview

```
User Query (natural language)
        ↓
FastAPI Backend receives request
        ↓
Context Builder — retrieves relevant business metrics from MongoDB
        ↓
Claude Sonnet 4.5 — reasons through data with structured prompt
        ↓
Agent returns: summary + reasoning steps + recommendation
        ↓
React frontend renders reasoning chain as visual accordion cards
        ↓
User sees analyst-grade insight in seconds
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- MongoDB (local or Atlas free tier)
- Anthropic API key (free tier available)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/datalyn.git
cd datalyn

# Backend setup
cd backend
pip install -r requirements.txt
cp .env.example .env
# Add your Anthropic API key to .env

# Start backend
uvicorn main:app --reload

# Frontend setup
cd ../frontend
npm install
npm start
```

### Environment Variables

```env
ANTHROPIC_API_KEY=your_key_here
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

---


## Roadmap

- Real OAuth integrations (Google Sheets, Stripe, HubSpot)
- Email delivery for anomaly alerts
- Multi-agent workflow — specialist agents per data domain
- Historical chat session persistence
- PDF report export
- Slack bot integration for inline querying
- Custom metric definitions per business type

---

## Why This Matters in 2026

The shift from passive dashboards to active AI agents is the most significant change happening in business software right now. Tools that show you data are being replaced by agents that understand your data and tell you what to do about it.

Datalyn is built on this principle from the ground up — not a dashboard with AI bolted on, but an agent-first product where autonomous reasoning is the core experience.

---

## Built By

**Qazi Fabia Hoq**

Connect: [LinkedIn](https://www.linkedin.com/in/qazifabiahoq/) · [GitHub](https://github.com/qazifabiahoq)

---

## License

MIT License — free to use, modify, and distribute.
