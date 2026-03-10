import Header from './Header'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { ThemeContext } from './ThemeContext'

export default function Landing() {
  const { theme } = useContext(ThemeContext);

  return (
    <>
      <Header />
      <main className={`gradient-bg min-h-screen pt-24 ${
          theme === 'dark' ? 'dark' : ''
        }`}>
        {/* BEGIN: HeroSection */}
        <section className="container mx-auto px-6 py-20 text-center" data-purpose="hero-content">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest animate-pulse">
            Decentralized Real Estate
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight tracking-tight">
            <span className="text-gradient">Secure Property Management</span><br />
            <span className="text-white">on Blockchain</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl mb-12 leading-relaxed">
            Eliminate fraud and paperwork. Our smart contract ecosystem ensures transparent ownership, 
            instant transfers, and immutable property records secured by Ethereum.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="w-full sm:w-auto px-10 py-4 bg-primary text-white font-bold rounded-custom hover:scale-105 transition-transform shadow-xl shadow-primary/25">
              Get Started
            </button>
            <Link to="/marketplace" className="w-full sm:w-auto px-10 py-4 border border-border bg-white/5 hover:bg-white/10 text-white font-bold rounded-custom transition-all text-center">
              Explore Marketplace
            </Link>
          </div>
          {/* Abstract Graphic Element */}
          <div className="mt-20 relative flex justify-center">
            <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full w-2/3 h-64 mx-auto -z-10"></div>
            <div className="glass-card w-full max-w-4xl h-80 rounded-2xl overflow-hidden p-1">
              <div className="bg-midnight/50 h-full w-full rounded-xl flex items-center justify-center border border-white/10">
                <p className="text-slate-500 italic text-sm">Property Data Visualization & Smart Contract Dashboard Preview</p>
              </div>
            </div>
          </div>
        </section>
        {/* END: HeroSection */}
        {/* BEGIN: FeaturesGrid */}
        <section className="container mx-auto px-6 py-24" data-purpose="features">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Core Ecosystem Features</h2>
            <p className="text-slate-400">Streamlining real estate through high-end cryptographic solutions.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div className="glass-card p-8 rounded-custom">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6 border border-primary/40">
                <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Ownership Verification</h3>
              <p className="text-slate-400 text-sm leading-relaxed">NFT-based title deeds verify property rights instantly without intermediaries.</p>
            </div>
            {/* Card 2 */}
            <div className="glass-card p-8 rounded-custom">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6 border border-primary/40">
                <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">IPFS Storage</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Securely store blueprints and legal documents on decentralized file systems.</p>
            </div>
            {/* Card 3 */}
            <div className="glass-card p-8 rounded-custom">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6 border border-primary/40">
                <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Instant Transfers</h3>
              <p className="text-slate-400 text-sm leading-relaxed">P2P property sales with automated escrow through verified smart contracts.</p>
            </div>
            {/* Card 4 */}
            <div className="glass-card p-8 rounded-custom">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6 border border-primary/40">
                <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Crypto Payments</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Support for ETH, USDC, and native utility tokens for all global transactions.</p>
            </div>
          </div>
        </section>
        {/* END: FeaturesGrid */}
        {/* BEGIN: HowItWorks */}
        <section className="container mx-auto px-6 py-24 border-t border-border/50" data-purpose="process-timeline">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-slate-400">Your journey from wallet connection to property ownership in 4 steps.</p>
          </div>
          <div className="relative flex flex-col md:flex-row justify-between items-start gap-12">
            {/* Connecting Line (Desktop Only) */}
            <div className="hidden md:block absolute top-6 left-0 w-full h-0.5 bg-gradient-to-right from-transparent via-primary/30 to-transparent -z-10"></div>
            {/* Step 1 */}
            <div className="flex-1 flex flex-col items-center text-center group">
              <div className="w-12 h-12 rounded-full bg-midnight border-2 border-primary flex items-center justify-center text-primary font-bold mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-500">1</div>
              <h4 className="text-lg font-semibold text-white mb-2">Connect Wallet</h4>
              <p className="text-slate-400 text-sm px-4">Link your MetaMask or Coinbase wallet to access the decentralized dashboard.</p>
            </div>
            {/* Step 2 */}
            <div className="flex-1 flex flex-col items-center text-center group">
              <div className="w-12 h-12 rounded-full bg-midnight border-2 border-primary flex items-center justify-center text-primary font-bold mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-500">2</div>
              <h4 className="text-lg font-semibold text-white mb-2">Register Asset</h4>
              <p className="text-slate-400 text-sm px-4">Upload property details and documents to mint a unique digital twin on-chain.</p>
            </div>
            {/* Step 3 */}
            <div className="flex-1 flex flex-col items-center text-center group">
              <div className="w-12 h-12 rounded-full bg-midnight border-2 border-primary flex items-center justify-center text-primary font-bold mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-500">3</div>
              <h4 className="text-lg font-semibold text-white mb-2">Verification</h4>
              <p className="text-slate-400 text-sm px-4">Automated smart contracts and validators verify the authenticity of the listing.</p>
            </div>
            {/* Step 4 */}
            <div className="flex-1 flex flex-col items-center text-center group">
              <div className="w-12 h-12 rounded-full bg-midnight border-2 border-primary flex items-center justify-center text-primary font-bold mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-500">4</div>
              <h4 className="text-lg font-semibold text-white mb-2">List or Transfer</h4>
              <p className="text-slate-400 text-sm px-4">Sell your property or transfer ownership instantly with minimal gas fees.</p>
            </div>
          </div>
        </section>
        {/* END: HowItWorks */}
        {/* BEGIN: StatsSection */}
        <section className="container mx-auto px-6 py-24" data-purpose="on-chain-metrics">
          <div className="glass-card rounded-2xl p-12 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <p className="text-slate-400 text-sm uppercase tracking-widest font-semibold mb-2">Total Value Locked</p>
              <p className="text-4xl font-extrabold text-white">$2.4B+</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm uppercase tracking-widest font-semibold mb-2">Properties Minted</p>
              <p className="text-4xl font-extrabold text-white">48,291</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm uppercase tracking-widest font-semibold mb-2">Transactions Settled</p>
              <p className="text-4xl font-extrabold text-white">125K+</p>
            </div>
          </div>
        </section>
        {/* END: StatsSection */}
        {/* BEGIN: CTAFooter */}
        <section className="container mx-auto px-6 py-24" data-purpose="final-cta">
          <div className="bg-gradient-to-r from-primary/20 to-indigo-600/20 rounded-3xl p-12 text-center border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
            <h2 className="text-4xl font-bold text-white mb-6">Ready to tokenise your assets?</h2>
            <p className="text-slate-300 mb-10 max-w-xl mx-auto">Join thousands of property owners and investors using the most secure real estate protocol in the Web3 space.</p>
            <Link to="/register" className="inline-block px-12 py-4 bg-primary text-white font-bold rounded-custom hover:shadow-[0_0_20px_rgba(141,40,230,0.6)] transition-all">
              Get Started
            </Link>
          </div>
        </section>
      </main>
      <footer className="border-t border-border bg-midnight py-12" data-purpose="site-footer">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-custom flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
            </div>
            <span className="font-bold text-white">PropertyChain</span>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-[10px] font-bold uppercase border border-yellow-500/20">
                <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                Not Connected
              </span>
              <code className="text-xs text-slate-500 bg-surface px-2 py-1 rounded-custom">0x0000...0000</code>
            </div>
            <p className="text-xs text-slate-500">© 2024 PropertyChain. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
      {/* END: CTAFooter */}
    </>
  )
}
