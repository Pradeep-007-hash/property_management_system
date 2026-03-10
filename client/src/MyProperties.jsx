import React, { useContext, useEffect, useState } from 'react'
import Header from './Header'
import { ThemeContext } from './ThemeContext'
import { WalletContext } from './WalletContext'
import { ethers } from 'ethers'
import { getPropertyContract } from './contract'
import PropertyCard from './PropertyCard'

export default function MyProperties() {
  const { theme } = useContext(ThemeContext)
  const { account, signer } = useContext(WalletContext)
  const [props, setProps] = useState([])

  useEffect(() => {
    async function load() {
      if (!signer || !account) return;
      try {
        const contract = getPropertyContract(signer);
        const count = await contract.propertyCount();
        const results = [];
        for (let i = 0; i < count; i++) {
          const p = await contract.properties(i);
          if (p.owner.toLowerCase() === account.toLowerCase()) {
            results.push(p);
          }
        }
        // fetch metadata for each property
        const gateway = 'https://gateway.pinata.cloud/ipfs';
        const enriched = await Promise.all(results.map(async (p) => {
          if (p.ipfsHash && typeof p.ipfsHash === 'string' && /^[A-Za-z0-9]+$/.test(p.ipfsHash)) {
            const url = `${gateway}/${p.ipfsHash}`;
            console.debug('fetching IPFS metadata', url);
            try {
              const r = await fetch(url);
              if (r.ok) {
                try {
                  const md = await r.json();
                  console.debug('got metadata', p.ipfsHash, md);
                  return { ...p, metadata: md };
                } catch (jsonErr) {
                  console.warn('invalid JSON from IPFS metadata', p.ipfsHash, jsonErr);
                }
              } else if (r.status === 422) {
                // skip silently
              } else {
                console.warn('ipfs metadata fetch failed', p.ipfsHash, r.status, r.statusText);
              }
            } catch (err) {
              console.warn('error fetching ipfs metadata', p.ipfsHash, err);
            }
          } else {
            console.debug('skipping invalid ipfsHash', p.ipfsHash);
          }
          return p;
        }));
        setProps(enriched);
      } catch (e) {
        console.error('failed to load props', e);
      }
    }
    load();
  }, [signer, account]);

  const handleToggleSale = async (prop) => {
    if (!signer) {
      alert('connect wallet');
      return;
    }
    try {
      const contract = getPropertyContract(signer);
      if (prop.isForSale) {
        // cancelSale might not be available on the deployed contract
        if (typeof contract.cancelSale !== 'function') {
          alert('Canceling listings requires a newer contract version with cancelSale.');
          return;
        }
        const tx = await contract.cancelSale(prop.propertyId);
        await tx.wait();
        setProps(props.map(p =>
          p.propertyId === prop.propertyId ? { ...p, isForSale: false } : p
        ));
        document.dispatchEvent(new Event('propertiesUpdated'));
      } else {
        const input = prompt('Enter sale price in ETH', ethers.formatEther(prop.price));
        if (!input) return;
        const priceWei = ethers.parseEther(input);
        const tx = await contract.putPropertyForSale(prop.propertyId, priceWei);
        await tx.wait();
        setProps(props.map(p =>
          p.propertyId === prop.propertyId ? { ...p, isForSale: true, price: priceWei } : p
        ));
        document.dispatchEvent(new Event('propertiesUpdated'));
      }
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
  };

  return (
    <>
      <Header />
      <main className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-background-dark text-slate-100' : 'bg-background-light text-slate-900'}`}>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="fixed inset-0 gradient-bg pointer-events-none" aria-hidden />
          <div className="fixed inset-0 blockchain-pattern pointer-events-none" aria-hidden />

          <section className="space-y-2">
            <h2 className="text-4xl font-black tracking-tight">My Properties</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl">Manage your real estate portfolio secured by the Ethereum blockchain. View ownership details, list items for sale, or update pricing in real-time.</p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-white/50 border border-white/20'}`}>
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Properties Owned</span>
              <div className="flex items-end justify-between mt-3">
                <span className="text-3xl font-black">{props.length}</span>
                <span className="material-symbols-outlined text-primary">inventory_2</span>
              </div>
            </div>
            <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-white/50 border border-white/20'}`}>
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Properties For Sale</span>
              <div className="flex items-end justify-between mt-3">
                <span className="text-3xl font-black">{props.filter(p => p.isForSale).length}</span>
                <span className="material-symbols-outlined text-crypto-blue">sell</span>
              </div>
            </div>
            <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-white/50 border border-white/20'}`}>
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Portfolio Value</span>
              <div className="flex items-end justify-between mt-3">
                <span className="text-3xl font-black">{ethers.formatEther(
                  props.reduce((acc,p)=>acc + (p.price ?? 0n), 0n)
                )} <span className="text-lg font-medium text-slate-500">ETH</span></span>
                <span className="material-symbols-outlined text-primary">payments</span>
              </div>
            </div>
            <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-white/50 border border-white/20'}`}>
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Transactions</span>
              <div className="flex items-end justify-between mt-3">
                <span className="text-3xl font-black">28</span>
                <span className="material-symbols-outlined text-crypto-purple">history</span>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {props.map((p, idx) => (
              <PropertyCard
                key={idx}
                theme={theme}
                id={p.propertyId.toString()}
                title={p.metadata?.name || p.name}
                price={ethers.formatEther(p.price)}
                location={p.metadata?.location || p.location}
                owner={p.owner}
                image={
                  p.metadata?.files && p.metadata.files.length > 0
                    ? `https://ipfs.io/ipfs/${p.metadata.files[0]}`
                    : p.ipfsHash
                    ? `https://ipfs.io/ipfs/${p.ipfsHash}`
                    : 'https://via.placeholder.com/400x225'
                }
                description={p.metadata?.description}
                forSale={p.isForSale}
                showActions={true}
                onSaleToggle={() => handleToggleSale(p)}
              />
            ))}
          </section>

        </div>
      </main>
    </>
  )
}
