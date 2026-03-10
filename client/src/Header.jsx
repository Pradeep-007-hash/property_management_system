import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { ethers } from 'ethers'
import { ThemeContext } from './ThemeContext'
import { WalletContext } from './WalletContext'

export default function Header() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // consume theme from context rather than local state
  const { theme, toggleTheme } = useContext(ThemeContext)

  // wallet data comes from context now
  const { account, connect } = useContext(WalletContext)

  const connectWallet = async () => {
    setIsConnecting(true)
    setError(null)
    try {
      await connect()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    // simply clear local error; account is managed by WalletContext
    setError(null)
  }

  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0,6)}...${address.slice(-4)}`
  }

  return (
    <header className="fixed top-0 w-full z-50 border-b border-border glass-card backdrop-blur-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300" data-purpose="main-navigation">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-custom flex items-center justify-center shadow-[0_0_15px_rgba(141,40,230,0.5)]">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
            </svg>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">PropertyChain</span>
        </div>
        <nav className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex absolute md:relative top-full md:top-auto left-0 md:left-auto right-0 md:right-auto w-full md:w-auto flex-col md:flex-row items-center md:space-x-8 bg-midnight/95 md:bg-transparent border-b md:border-0 border-border/30 p-4 md:p-0 space-y-4 md:space-y-0 z-40`}>
          <Link className="nav-link text-sm font-medium text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-white transition-colors w-full md:w-auto" to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link className="nav-link text-sm font-medium text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-white transition-colors w-full md:w-auto" to="/marketplace" onClick={() => setMobileMenuOpen(false)}>Marketplace</Link>
          <Link className="nav-link text-sm font-medium text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-white transition-colors w-full md:w-auto" to="/register" onClick={() => setMobileMenuOpen(false)}>Register Property</Link>
          <Link className="nav-link text-sm font-medium text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-white transition-colors w-full md:w-auto" to="/myproperties" onClick={() => setMobileMenuOpen(false)}>My Properties</Link>
        </nav>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-custom border border-border hover:bg-surface transition-colors" 
            title="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
            )}
          </button>
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-custom border border-border hover:bg-surface transition-colors" 
            title="Toggle Theme"
          >
            {theme === 'dark' ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
            )}
          </button>
          {account ? (
            <button 
              onClick={disconnectWallet}
              className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-custom transition-all shadow-lg shadow-green-600/20 flex items-center gap-2"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {formatAddress(account)}
            </button>
          ) : (
            <button 
              onClick={connectWallet}
              disabled={isConnecting}
              className="px-5 py-2.5 bg-primary hover:bg-opacity-90 text-white font-semibold rounded-custom transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              id="connectWallet"
            >
              {isConnecting ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connecting...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path clipRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm7 7a1 1 0 100-2 1 1 0 000 2z" fillRule="evenodd"></path>
                  </svg>
                  Connect Wallet
                </>
              )}
            </button>
          )}
        </div>
      </div>
      {error && (
        <div className="absolute top-full left-0 right-0 mx-4 mt-2 p-3 bg-red-500/20 border border-red-500/50 rounded-custom text-red-200 text-sm">
          {error}
        </div>
      )}
    </header>
  )
}
