import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BarChart3, Brain, Zap, TrendingUp, Shield, Clock, Check } from 'lucide-react';

export default function Landing() {
  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'Agentic AI Analysis',
      description: 'Ask questions in plain English. Get multi-step reasoning that explains not just what happened, but why.'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Real-time Anomaly Detection',
      description: 'Automatic alerts when metrics deviate. Know about problems before they become crises.'
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Unified Dashboard',
      description: 'MRR, churn, conversions, and active users in one clean view. No spreadsheet juggling.'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure Integrations',
      description: 'Connect Stripe, QuickBooks, HubSpot, and more. Your data stays encrypted and private.'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Automated Reports',
      description: 'Daily or weekly summaries delivered to your inbox. Stay informed without logging in.'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Predictive Insights',
      description: 'Spot trends before they fully emerge. Make decisions with confidence, not guesswork.'
    }
  ];

  const pricingTiers = [
    {
      name: 'Free',
      price: '$0',
      description: 'For early-stage founders exploring their data',
      features: [
        'Up to 100 AI queries/month',
        'Basic dashboard metrics',
        '1 data source integration',
        'Weekly email reports',
        'Community support'
      ]
    },
    {
      name: 'Pro',
      price: '$49',
      description: 'For growing businesses that need deeper insights',
      features: [
        'Unlimited AI queries',
        'Advanced analytics dashboard',
        'Unlimited integrations',
        'Daily email reports',
        'Anomaly alerts via Slack',
        'Priority support'
      ],
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For teams that need dedicated infrastructure',
      features: [
        'Everything in Pro',
        'Custom AI model training',
        'Dedicated account manager',
        'SLA guarantees',
        'Advanced security controls',
        'On-premise deployment option'
      ]
    }
  ];

  const testimonials = [
    {
      quote: 'Datalyn caught a churn spike two days before I would have noticed it manually. Saved us three enterprise deals.',
      author: 'Sarah Chen',
      role: 'CEO, CloudMetrics',
      image: 'https://images.unsplash.com/photo-1659353221237-6a1cfb73fd90?crop=entropy&cs=srgb&fm=jpg&q=85'
    },
    {
      quote: 'I ask it questions like I would ask my analyst — except it responds in 10 seconds instead of 2 days.',
      author: 'Marcus Rodriguez',
      role: 'VP Growth, Streamly',
      image: 'https://images.unsplash.com/photo-1659353219150-377222056797?crop=entropy&cs=srgb&fm=jpg&q=85'
    },
    {
      quote: 'Finally, a tool that explains why our numbers moved. No more guessing games in Monday meetings.',
      author: 'Emily Watson',
      role: 'Head of Product, Finly',
      image: 'https://images.unsplash.com/photo-1633768230053-5ad67c4e1ff5?crop=entropy&cs=srgb&fm=jpg&q=85'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-semibold tracking-tight text-slate-900">Datalyn</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">How it Works</a>
              <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Pricing</a>
              <a href="#integrations" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Integrations</a>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" size="sm" data-testid="nav-login-btn">Login</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800 shadow-sm" data-testid="nav-signup-btn">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-8">
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight leading-[1.1] text-slate-900">
              Stop guessing.
              <br />
              <span className="text-slate-600">Start knowing.</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Datalyn is the AI-powered business analyst that connects to your data sources, 
              detects what's wrong, and explains why—like a junior analyst you can interrogate 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-slate-900 text-white hover:bg-slate-800 shadow-sm h-12 px-8" data-testid="hero-get-started-btn">
                  Get Started Free
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-12 px-8 border-slate-200 hover:bg-slate-50" data-testid="hero-demo-btn">
                See Demo
              </Button>
            </div>
            <div className="pt-4 flex items-center justify-center space-x-6 text-sm text-slate-500">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>5-minute setup</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 mb-4">
              Your data, finally explained
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Stop staring at charts wondering what they mean. Get instant answers in plain English.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                data-testid={`feature-card-${index}`}
              >
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-900 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold tracking-tight text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-base text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 mb-4">
              Three steps to clarity
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center text-2xl font-semibold mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold tracking-tight text-slate-900">Connect your data</h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Link Stripe, QuickBooks, HubSpot, or Google Sheets. Takes 2 minutes.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center text-2xl font-semibold mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold tracking-tight text-slate-900">Ask questions</h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Type naturally: "Why did churn spike last week?" or "What's my biggest revenue risk?"
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center text-2xl font-semibold mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold tracking-tight text-slate-900">Get clear answers</h3>
              <p className="text-base text-slate-600 leading-relaxed">
                See the AI's reasoning process. Understand not just what changed, but why.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 mb-4">
              Pricing that scales with you
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Start free. Upgrade when you need more power.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingTiers.map((tier, index) => (
              <div
                key={index}
                className={`bg-white rounded-lg p-8 ${
                  tier.highlighted
                    ? 'border-2 border-slate-900 shadow-lg relative'
                    : 'border border-slate-200 shadow-sm'
                }`}
                data-testid={`pricing-tier-${tier.name.toLowerCase()}`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-slate-900 text-white text-xs font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold tracking-tight text-slate-900 mb-2">{tier.name}</h3>
                  <div className="flex items-baseline mb-2">
                    <span className="text-4xl font-semibold tracking-tight text-slate-900">{tier.price}</span>
                    {tier.price !== 'Custom' && <span className="text-slate-600 ml-2">/month</span>}
                  </div>
                  <p className="text-sm text-slate-600">{tier.description}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/signup">
                  <Button
                    className={`w-full ${
                      tier.highlighted
                        ? 'bg-slate-900 text-white hover:bg-slate-800'
                        : 'bg-white border border-slate-200 text-slate-900 hover:bg-slate-50'
                    }`}
                    data-testid={`pricing-cta-${tier.name.toLowerCase()}`}
                  >
                    {tier.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 mb-4">
              Trusted by data-driven founders
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm" data-testid={`testimonial-${index}`}>
                <p className="text-base text-slate-600 leading-relaxed mb-6">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center space-x-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{testimonial.author}</div>
                    <div className="text-xs text-slate-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white">
            Ready to stop guessing?
          </h2>
          <p className="text-lg text-slate-300 leading-relaxed">
            Join hundreds of founders who use Datalyn to understand their business.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 h-12 px-8 shadow-sm" data-testid="final-cta-btn">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#integrations" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Guides</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <BarChart3 className="w-5 h-5 text-slate-400" />
              <span className="text-sm font-medium text-slate-400">© 2026 Datalyn. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
