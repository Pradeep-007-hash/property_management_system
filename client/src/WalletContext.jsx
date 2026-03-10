import { createContext, useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';

export const WalletContext = createContext({
  provider: null,
  signer: null,
  account: null,
  connect: async () => {},
});

export function WalletProvider({ children }) {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);

  const connect = useCallback(async () => {
    if (!window.ethereum) throw new Error('MetaMask not installed');
    const p = new ethers.BrowserProvider(window.ethereum);
    await p.send('eth_requestAccounts', []);
    const s = await p.getSigner();
    const a = await s.getAddress();
    setProvider(p);
    setSigner(s);
    setAccount(a);
    return { provider: p, signer: s, account: a };
  }, []);

  // keep track of account changes
  useEffect(() => {
    if (!window.ethereum) return;
    const handleAccounts = (accounts) => {
      if (accounts.length === 0) {
        setAccount(null);
        setSigner(null);
      } else {
        setAccount(accounts[0]);
      }
    };
    window.ethereum.on('accountsChanged', handleAccounts);
    return () => window.ethereum.removeListener('accountsChanged', handleAccounts);
  }, []);

  return (
    <WalletContext.Provider value={{ provider, signer, account, connect }}>
      {children}
    </WalletContext.Provider>
  );
}
