'use client''use client'



import { motion } from 'framer-motion'import { motion } from 'framer-motion'

import { DollarSign, TrendingUp, Globe, PieChart } from 'lucide-react'import { DollarSign, TrendingUp, Globe, PieChart } from 'lucide-react'

import 'boxicons/css/boxicons.min.css'import 'boxicons/css/boxicons.min.css'



const MarketOpportunitySection = () => {const MarketOpportunitySection = () => {

  const stats = [  const stats = [

    {    {

      icon: DollarSign,      icon: DollarSign,

      value: '$17.1T',      value: '$17.1T',

      label: 'Total Global Stock Market Volume (Daily)',      label: 'Total Global Stock Market Volume (Daily)',

      percentage: '67%',      percentage: '67%',

      description: 'Of global financial transactions'      description: 'Of global financial transactions'

    },    },

    {    {

      icon: TrendingUp,      icon: TrendingUp,

      value: '$278B',      value: '$278B',

      label: 'Total Crypto Market Volume (Daily)',      label: 'Total Crypto Market Volume (Daily)',

      percentage: '23%',      percentage: '23%',

      description: 'Year-over-year growth'      description: 'Year-over-year growth'

    },    },

    {    {

      icon: Globe,      icon: Globe,

      value: '392M',      value: '392M',

      label: 'Global Digital Asset Users',      label: 'Global Digital Asset Users',

      percentage: '115%',      percentage: '115%',

      description: 'Expected growth by 2025'      description: 'Expected growth by 2025'

    },    },

    {    {

      icon: PieChart,      icon: PieChart,

      value: '$4.2B',      value: '$4.2B',

      label: 'Cross-Asset Trading Volume',      label: 'Cross-Asset Trading Volume',

      percentage: '184%',      percentage: '184%',

      description: 'Annual increase in hybrid portfolios'      description: 'Annual increase in hybrid portfolios'

    }    }

  ]  ]



  const opportunities = [  const opportunities = [

    {    {

      title: 'Fragmented Investment Landscape',      title: 'Fragmented Investment Landscape',

      problem: 'Investors need 5+ apps to trade stocks, crypto, check analytics, and track portfolios',      problem: 'Investors need 5+ apps to trade stocks, crypto, check analytics, and track portfolios',

      solution: 'One unified platform for all financial assets',      solution: 'One unified platform for all financial assets',

      impact: 'Save 5 hours/week in portfolio management'      impact: 'Save 5 hours/week in portfolio management'

    },    },

    {    {

      title: 'High Cross-Asset Trading Costs',      title: 'High Cross-Asset Trading Costs',

      problem: 'Converting between stocks and crypto costs $40+ and takes 5-7 days',      problem: 'Converting between stocks and crypto costs $40+ and takes 5-7 days',

      solution: 'Instant swaps for $0.01 on Base L2',      solution: 'Instant swaps for $0.01 on Base L2',

      impact: '99.95% cost reduction & instant settlement'      impact: '99.95% cost reduction & instant settlement'

    },    },

    {    {

      title: 'Limited Correlation Insights',      title: 'Limited Correlation Insights',

      problem: 'No easy way to see how NVIDIA stock affects your GPU mining tokens',      problem: 'No easy way to see how NVIDIA stock affects your GPU mining tokens',

      solution: 'AI-powered cross-asset correlation engine',      solution: 'AI-powered cross-asset correlation engine',

      impact: 'Discover 2.3x more trading opportunities'      impact: 'Discover 2.3x more trading opportunities'

    }    }

  ]  ]



  return (  return (

    <section className="py-20 px-4 lg:px-20">    <section className="py-20 px-4 lg:px-20">

      <div className="max-w-7xl mx-auto">      <div className="max-w-7xl mx-auto">

        {/* Header */}        {/* Header */}

        <motion.div         <motion.div 

          className="text-center mb-16"          className="text-center mb-16"

          initial={{ opacity: 0, y: 20 }}          initial={{ opacity: 0, y: 20 }}

          animate={{ opacity: 1, y: 0 }}          animate={{ opacity: 1, y: 0 }}

          transition={{ duration: 0.6 }}          transition={{ duration: 0.6 }}

        >        >

          <h2 className="text-4xl md:text-5xl font-bold mb-4">          <h2 className="text-4xl md:text-5xl font-bold mb-4">

            The <span className="text-yellow-500">Market</span> Opportunity            The <span className="text-yellow-500">Market</span> Opportunity

          </h2>          </h2>

          <p className="text-xl text-gray-300 mb-6 max-w-3xl mx-auto">          <p className="text-xl text-gray-300 mb-6 max-w-3xl mx-auto">

            Traditional finance and crypto markets are converging. HODL bridges the gap.            Traditional finance and crypto markets are converging. HODL bridges the gap.

          </p>          </p>

        </motion.div>        </motion.div>



        {/* Market Stats */}        {/* Market Stats */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">

          {stats.map((stat, index) => (          {stats.map((stat, index) => (

            <motion.div             <motion.div 

              key={index}              key={index}

              className="bg-gray-800 rounded-lg p-6 border border-gray-700"              className="bg-gray-800 rounded-lg p-6 border border-gray-700"

              initial={{ opacity: 0, y: 20 }}              initial={{ opacity: 0, y: 20 }}

              animate={{ opacity: 1, y: 0 }}              animate={{ opacity: 1, y: 0 }}

              transition={{ duration: 0.6, delay: index * 0.1 }}              transition={{ duration: 0.6, delay: index * 0.1 }}

            >            >

              <div className="flex items-center mb-4">              <div className="flex items-center mb-4">

                <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mr-4">                <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mr-4">

                  <stat.icon className="w-6 h-6 text-yellow-500" />                  <stat.icon className="w-6 h-6 text-yellow-500" />

                </div>                </div>

                <span className="text-3xl font-bold text-gray-100">{stat.value}</span>                <span className="text-3xl font-bold text-gray-100">{stat.value}</span>

              </div>              </div>

              <p className="text-sm font-medium text-gray-300 mb-2">{stat.label}</p>              <p className="text-sm font-medium text-gray-300 mb-2">{stat.label}</p>

              <div className="flex items-center">              <div className="flex items-center">

                <span className="text-green-400 font-semibold">{stat.percentage} ↑</span>                <span className="text-green-400 font-semibold">{stat.percentage} ↑</span>

                <span className="text-gray-400 text-sm ml-2">{stat.description}</span>                <span className="text-gray-400 text-sm ml-2">{stat.description}</span>

              </div>              </div>

            </motion.div>            </motion.div>

          ))}          ))}

        </div>        </div>



        {/* Market Opportunities */}        {/* Market Opportunities */}

        <div className="grid md:grid-cols-3 gap-8">        <div className="grid md:grid-cols-3 gap-8">

          {opportunities.map((opportunity, index) => (          {opportunities.map((opportunity, index) => (

            <motion.div             <motion.div 

              key={index}              key={index}

              className="bg-gray-800 rounded-lg p-6 border border-gray-700"              className="bg-gray-800 rounded-lg p-6 border border-gray-700"

              initial={{ opacity: 0, y: 20 }}              initial={{ opacity: 0, y: 20 }}

              animate={{ opacity: 1, y: 0 }}              animate={{ opacity: 1, y: 0 }}

              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}

            >            >

              <h3 className="text-xl font-bold text-gray-100 mb-4">              <h3 className="text-xl font-bold text-gray-100 mb-4">

                {opportunity.title}                {opportunity.title}

              </h3>              </h3>



              {/* Problem */}              {/* Problem */}

              <div className="mb-4 p-3 bg-red-900/20 border-l-4 border-red-500 rounded">              <div className="mb-4 p-3 bg-red-900/20 border-l-4 border-red-500 rounded">

                <p className="text-sm text-gray-300">                <p className="text-sm text-gray-300">

                  <span className="font-semibold text-red-400">Problem:</span>{' '}                  <span className="font-semibold text-red-400">Problem:</span>{' '}

                  {opportunity.problem}                  {opportunity.problem}

                </p>                </p>

              </div>              </div>



              {/* Solution */}              {/* Solution */}

              <div className="mb-4 p-3 bg-green-900/20 border-l-4 border-green-500 rounded">              <div className="mb-4 p-3 bg-green-900/20 border-l-4 border-green-500 rounded">

                <p className="text-sm text-gray-300">                <p className="text-sm text-gray-300">

                  <span className="font-semibold text-green-400">Solution:</span>{' '}                  <span className="font-semibold text-green-400">Solution:</span>{' '}

                  {opportunity.solution}                  {opportunity.solution}

                </p>                </p>

              </div>              </div>



              {/* Impact */}              {/* Impact */}

              <div className="p-3 bg-purple-900/20 border-l-4 border-purple-500 rounded">              <div className="p-3 bg-purple-900/20 border-l-4 border-purple-500 rounded">

                <p className="text-sm text-gray-300">                <p className="text-sm text-gray-300">

                  <span className="font-semibold text-purple-400">Impact:</span>{' '}                  <span className="font-semibold text-purple-400">Impact:</span>{' '}

                  {opportunity.impact}                  {opportunity.impact}

                </p>                </p>

              </div>              </div>

            </motion.div>            </motion.div>

          ))}          ))}

        </div>        </div>

      </div>      </div>

    </section>    </section>

  )  )

}}



export default MarketOpportunitySectionexport default MarketOpportunitySection

  initial: { opacity: 0, y: 20 },  return (

  animate: { opacity: 1, y: 0 },    <section className="py-20 px-4 lg:px-20 bg-black relative">

  transition: { duration: 0.5 }      {/* Background gradients matching landing page style */}

} as const      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-yellow-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl opacity-50 -z-10" />

      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-purple-500/20 via-yellow-500/10 to-transparent rounded-full blur-3xl opacity-50 -z-10" />

const staggerContainerOnce = {      

  animate: {      <div className="max-w-7xl mx-auto">

    transition: {        <motion.h2

      staggerChildren: 0.1          initial="hidden"

    }          whileInView="visible"

  }          viewport={{ once: true }}

} as const          transition={{ duration: 0.6 }}

          variants={fadeInUp}

const MarketOpportunity: FC = () => {          className="text-4xl md:text-5xl font-bold text-center mb-4"

  const opportunities = [        >

    {          The <span className="text-yellow-500">Market Opportunity</span>

      title: 'Growing Hybrid Investment Market',        </motion.h2>

      stats: '$5.3T+',        

      description: 'Combined daily trading volume in stocks and crypto',        <motion.p

      color: 'purple'          initial="hidden"

    },          whileInView="visible"

    {          viewport={{ once: true }}

      title: 'Fragmented Tools',          transition={{ duration: 0.6, delay: 0.1 }}

      stats: '83%',          variants={fadeInUp}

      description: 'Investors use 3+ different apps to track investments',          className="text-xl text-gray-400 text-center mb-16 max-w-3xl mx-auto"

      color: 'yellow'        >

    },          At the intersection of two massive markets

    {        </motion.p>

      title: 'Rising Retail Interest',

      stats: '27M+',        {/* TAM/SAM/SOM */}

      description: 'New retail investors since 2020',        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">

      color: 'green'          {[

    },            {

    {              title: 'TAM',

      title: 'AI Adoption in Finance',              amount: '$120T',

      stats: '71%',              desc: 'Total Addressable Market',

      description: 'Investors want AI-powered insights',              detail: 'Global stock market ($109T) + Crypto market cap ($2.5T) + DeFi TVL ($85B)',

      color: 'blue'              gradient: 'from-purple-900/20 to-purple-800/20',

    }              border: 'border-purple-500/30',

  ]              textColor: 'purple'

            },

  return (            {

    <section className="py-20 px-4 lg:px-20">              title: 'SAM',

      <motion.div              amount: '$8.4T',

        className="max-w-7xl mx-auto"              desc: 'Serviceable Available Market',

        initial="initial"              detail: 'US retail investors ($7.2T) holding both stocks and crypto (est. 15% = $1.08T) + DeFi users ($40B)',

        whileInView="animate"              gradient: 'from-yellow-900/20 to-yellow-800/20',

        viewport={{ once: true }}              border: 'border-yellow-500/30',

        variants={staggerContainerOnce}              textColor: 'yellow'

      >            },

        <motion.h2            {

          className={`${inter.className} text-3xl md:text-4xl font-bold text-center mb-4`}              title: 'SOM',

          variants={fadeInUpOnce}              amount: '$420B',

        >              desc: 'Serviceable Obtainable Market',

          <span className="text-purple-500">Market</span> Opportunity              detail: '5% of hybrid investors seeking unified portfolio management (3-year target)',

        </motion.h2>              gradient: 'from-green-900/20 to-green-800/20',

        <motion.p              border: 'border-green-500/30',

          className="text-xl text-gray-400 text-center mb-16 max-w-3xl mx-auto"              textColor: 'green'

          variants={fadeInUpOnce}            }

        >          ].map((item, index) => (

          The future of investment tracking is unified and intelligent            <motion.div

        </motion.p>              key={item.title}

              initial="hidden"

        <motion.div              whileInView="visible"

          className="grid grid-cols-1 md:grid-cols-2 gap-8"              viewport={{ once: true }}

          variants={staggerContainerOnce}              transition={{ duration: 0.6, delay: index * 0.1 }}

        >              variants={fadeInUp}

          {opportunities.map((opp, index) => (              className={`bg-gradient-to-br ${item.gradient} rounded-lg p-8 border-2 ${item.border} hover:border-opacity-75 transition-all duration-300`}

            <motion.div            >

              key={index}              <div className="text-center">

              variants={fadeInUpOnce}                <p className={`text-sm text-${item.textColor}-300 mb-2 font-semibold`}>{item.title}</p>

              className="bg-gray-800/50 rounded-lg p-8 backdrop-blur-sm border border-gray-700/50"                <p className={`text-5xl font-bold text-${item.textColor}-400 mb-3`}>{item.amount}</p>

              whileHover={{ scale: 1.02 }}                <p className="text-sm text-gray-300 mb-4">{item.desc}</p>

            >                <p className="text-xs text-gray-400 leading-relaxed">{item.detail}</p>

              <h3 className={`${inter.className} text-2xl font-bold mb-2`}>              </div>

                {opp.title}            </motion.div>

              </h3>          ))}

              <p className={`text-4xl font-bold mb-4 text-${opp.color}-500`}>        </div>

                {opp.stats}

              </p>        {/* Key Market Trends */}

              <p className="text-gray-400">{opp.description}</p>        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">

            </motion.div>          {[

          ))}            {

        </motion.div>              icon: 'bx-trending-up',

      </motion.div>              title: 'Crypto Adoption Accelerating',

    </section>              desc: '52 million Americans now own crypto (16% of population). 67% of millennial investors hold both stocks and crypto.',

  )              source: 'Pew Research, 2024'

}            },

            {

export default MarketOpportunity              icon: 'bx-layer',
              title: 'L2 Infrastructure Maturity',
              desc: 'Base L2 processed 3.2M daily transactions in Q4 2024, proving scalability. Gas fees dropped 99.8% vs Ethereum mainnet.',
              source: 'L2Beat, Q4 2024'
            },
            {
              icon: 'bx-dollar',
              title: 'RWA Tokenization Growing',
              desc: 'Real-world asset tokenization market projected to reach $16T by 2030. Stocks are the natural starting point.',
              source: 'BCG Analysis, 2024'
            },
            {
              icon: 'bx-brain',
              title: 'AI-Powered Finance',
              desc: '73% of investors want AI tools for portfolio insights. Current solutions focus on single asset classes.',
              source: 'Deloitte Finance Survey, 2024'
            }
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              variants={fadeInUp}
              className="bg-black/40 rounded-lg p-6 border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className={`bx ${item.icon} text-2xl text-black`}></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-100 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400 mb-3">{item.desc}</p>
                  <p className="text-xs text-gray-500">Source: {item.source}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Why Now? */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          variants={fadeInUp}
          className="bg-gradient-to-r from-purple-900/30 to-yellow-900/30 rounded-lg p-8 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300"
        >
          <h3 className="text-2xl font-bold text-center mb-6 text-gray-100">
            Why Now? Our Unique Timing Advantage
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                emoji: '🏗️',
                title: 'Infrastructure Ready',
                desc: 'Base L2 makes $0.01 transactions viable'
              },
              {
                emoji: '👥',
                title: 'User Behavior Shift',
                desc: '52M Americans now bridge both markets'
              },
              {
                emoji: '⚡',
                title: 'First-Mover Position',
                desc: 'No competitor offers cross-asset swaps'
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="text-4xl mb-2">{item.emoji}</div>
                <p className="text-sm font-semibold text-gray-200 mb-1">{item.title}</p>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default MarketOpportunitySection