'use client';

import { motion, AnimatePresence } from 'framer-motion';
import 'boxicons/css/boxicons.min.css';
import { useState } from 'react';

interface Feature {
  title: string;
  description: string;
  icon: string;
  details: string[];
}

interface Tier {
  name: string;
  price: string;
  priceDetails?: {
    monthly: number;
    yearly: number;
    savings?: string;
  };
  description: string;
  color: string;
  gradient: string;
  features: Feature[];
  premiumFeatures?: {
    performance: Feature[];
    security: Feature[];
    support: Feature[];
  };
}

const BusinessModelSection = () => {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showContactForm, setShowContactForm] = useState(false);

  const tiers: Tier[] = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for getting started with cross-asset portfolio tracking',
      color: 'cyan',
      gradient: 'from-cyan-500/20 to-cyan-500/5',
      features: [
        {
          title: 'Portfolio Tracking',
          description: 'Track your investments up to $100K',
          icon: 'bx-line-chart',
          details: [
            'Real-time portfolio updates',
            'Basic performance metrics',
            'Market value tracking',
            'Simple profit/loss calculation'
          ]
        },
        {
          title: 'Market Analysis',
          description: 'Basic stock & crypto correlations',
          icon: 'bx-analyse',
          details: [
            'Basic correlation metrics',
            'Simple market trends',
            'Price movement alerts',
            'Basic technical indicators'
          ]
        },
        {
          title: 'Paper Trading',
          description: 'Practice with $100K virtual portfolio',
          icon: 'bx-money',
          details: [
            'Virtual trading environment',
            'Basic order types',
            'Portfolio simulation',
            'Performance tracking'
          ]
        }
      ]
    },
    {
      name: 'Pro',
      price: billingCycle === 'monthly' ? '$19/mo' : '$190/yr',
      priceDetails: {
        monthly: 19,
        yearly: 190,
        savings: 'Save $38/year'
      },
      description: 'Advanced features for active traders and serious investors',
      color: 'purple',
      gradient: 'from-purple-500/20 to-purple-500/5',
      features: [
        {
          title: 'Advanced Analytics',
          description: 'Comprehensive market analysis tools',
          icon: 'bx-brain',
          details: [
            'AI-powered market insights',
            'Advanced correlation metrics',
            'Custom technical indicators',
            'Portfolio optimization tools'
          ]
        },
        {
          title: 'Premium Alerts',
          description: 'Customizable alert system',
          icon: 'bx-bell',
          details: [
            'Multi-condition alerts',
            'SMS and email notifications',
            'Custom alert rules',
            'Price movement predictions'
          ]
        },
        {
          title: 'Trading Automation',
          description: 'Automated trading strategies',
          icon: 'bx-bot',
          details: [
            'Strategy builder',
            'Automated trade execution',
            'Risk management rules',
            'Performance analytics'
          ]
        }
      ]
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'Full-suite solution for professional trading firms',
      color: 'yellow',
      gradient: 'from-yellow-500/20 to-yellow-500/5',
      features: [
        {
          title: 'Custom Integration',
          description: 'Tailored solutions for your business',
          icon: 'bx-cube',
          details: [
            'API customization',
            'Custom data feeds',
            'Integration support',
            'White-label options'
          ]
        },
        {
          title: 'Advanced Security',
          description: 'Enterprise-grade security features',
          icon: 'bx-shield',
          details: [
            'SSO integration',
            'Advanced encryption',
            'Audit logging',
            'Custom security policies'
          ]
        },
        {
          title: 'Dedicated Support',
          description: '24/7 priority assistance',
          icon: 'bx-support',
          details: [
            'Dedicated account manager',
            'Custom SLA',
            'Training sessions',
            'Priority support'
          ]
        }
      ]
    }
  ];

  return (
    <section id="pricing" className="py-20 px-4 lg:px-20 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block bg-gradient-to-r from-yellow-500/20 to-purple-500/20 px-6 py-3 rounded-full mb-4 border border-yellow-500/20">
            <h3 className="text-yellow-400 font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-purple-400">
              Business Model & Premium Features
            </h3>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-purple-400 to-cyan-400">
            Unlock Your Trading Potential
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Choose the plan that matches your ambition. Scale seamlessly as you grow.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm ${billingCycle === 'monthly' ? 'text-yellow-500' : 'text-gray-400'}`}>Monthly</span>
            <motion.button
              onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-16 h-8 bg-gray-700 rounded-full p-1 transition-colors"
              animate={{ backgroundColor: billingCycle === 'yearly' ? '#EAB308' : '#374151' }}
            >
              <motion.div
                className="w-6 h-6 bg-white rounded-full shadow-md"
                animate={{ x: billingCycle === 'yearly' ? 32 : 0 }}
              />
            </motion.button>
            <span className={`text-sm ${billingCycle === 'yearly' ? 'text-yellow-500' : 'text-gray-400'}`}>
              Yearly <span className="text-green-400 text-xs">(Save 20%)</span>
            </span>
          </div>
        </motion.div>

        {/* Pricing Tiers */}
        <div className="flex flex-col md:flex-row gap-8">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              className={`flex-1 rounded-xl bg-gradient-to-b ${tier.gradient} backdrop-blur-xl border border-${tier.color}-500/20`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {/* Tier Card */}
              <div 
                className={`p-8 cursor-pointer transition-all rounded-t-xl ${
                  selectedTier === tier.name ? `bg-${tier.color}-500/10` : ''
                }`}
                onClick={() => {
                  if (tier.name === 'Enterprise') {
                    setShowContactForm(true);
                  } else {
                    setSelectedTier(selectedTier === tier.name ? null : tier.name);
                  }
                }}
              >
                {/* Tier Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-100 mb-2">
                    {tier.name}
                  </h3>
                  <div className="flex items-center justify-center mb-4">
                    <span className="text-4xl font-bold text-yellow-500">
                      {tier.price}
                    </span>
                    {tier.price !== 'Custom' && (
                      <span className="text-gray-400 ml-2">
                        /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                      </span>
                    )}
                  </div>
                  {tier.priceDetails?.savings && billingCycle === 'yearly' && (
                    <span className="inline-block bg-green-500/20 text-green-400 text-sm px-3 py-1 rounded-full mb-4">
                      {tier.priceDetails.savings}
                    </span>
                  )}
                  <p className="text-gray-300">{tier.description}</p>
                </div>

                {/* Core Features List */}
                              {/* Features List */}
              <div className="space-y-4 mb-8">
                {tier.features.map((feature) => (
                  <motion.div
                    key={feature.title}
                    className={`p-4 rounded-lg cursor-pointer bg-gray-800/30 hover:bg-${tier.color}-500/10 transition-all border border-${tier.color}-500/10`}
                    onClick={() => setSelectedFeature(selectedFeature === feature.title ? null : feature.title)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <i className={`bx ${feature.icon} text-${tier.color}-400 text-xl mr-3`} />
                        <div>
                          <h4 className="font-medium text-gray-100">{feature.title}</h4>
                          <p className="text-sm text-gray-400">{feature.description}</p>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: selectedFeature === feature.title ? 180 : 0 }}
                        className={`text-${tier.color}-400`}
                      >
                        <i className="bx bx-chevron-down text-xl" />
                      </motion.div>
                    </div>
                    
                    <AnimatePresence>
                      {selectedFeature === feature.title && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <ul className="mt-4 space-y-2 pl-8">
                            {feature.details.map((detail) => (
                              <li
                                key={detail}
                                className="text-gray-300 text-sm flex items-center"
                              >
                                <div className={`w-1.5 h-1.5 rounded-full bg-${tier.color}-400 mr-2`} />
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>

                {/* Expand/Collapse Button */}
                {tier.premiumFeatures && (
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: selectedTier === tier.name ? 180 : 0 }}
                      className="inline-block text-yellow-500"
                    >
                      <i className="bx bx-chevron-down text-2xl" />
                    </motion.div>
                  </div>
                )}
              </div>

              {/* Premium Features Dropdown */}
              <AnimatePresence>
                {selectedTier === tier.name && tier.premiumFeatures && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden border-t border-gray-700"
                  >
                    <div className="p-8 bg-gray-800/50">
                      <h4 className="text-lg font-semibold text-yellow-500 mb-6">Premium Features</h4>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div>
                          <h5 className="text-gray-100 font-medium mb-4">
                            <i className="bx bx-line-chart text-yellow-500 mr-2" />
                            Performance
                          </h5>
                          <ul className="space-y-3">
                            {tier.premiumFeatures.performance.map((feature) => (
                              <li key={feature} className="text-gray-300 text-sm">
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-gray-100 font-medium mb-4">
                            <i className="bx bx-shield text-yellow-500 mr-2" />
                            Security
                          </h5>
                          <ul className="space-y-3">
                            {tier.premiumFeatures.security.map((feature) => (
                              <li key={feature} className="text-gray-300 text-sm">
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-gray-100 font-medium mb-4">
                            <i className="bx bx-support text-yellow-500 mr-2" />
                            Support
                          </h5>
                          <ul className="space-y-3">
                            {tier.premiumFeatures.support.map((feature) => (
                              <li key={feature} className="text-gray-300 text-sm">
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* CTA Button */}
              <div className="p-8 pt-0">
                <motion.button
                  className={`w-full py-3 px-8 rounded-full font-medium transition-all duration-500 ${
                    index === 1
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
                      : 'border border-gray-600 hover:bg-gray-700 text-gray-100'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {index === 1 ? 'Get Started Pro' : 'Choose Plan'}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enterprise Contact */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="text-gray-400">
            Need a custom solution?{' '}
            <a
              href="mailto:enterprise@hodl.com"
              className="text-yellow-500 hover:underline"
            >
              Contact our enterprise team
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default BusinessModelSection;