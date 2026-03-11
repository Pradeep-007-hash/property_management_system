import { useState, useContext, useEffect } from 'react';
import Header from './Header';
import { ThemeContext } from './ThemeContext';
import { WalletContext } from './WalletContext';
import { ethers } from 'ethers';
import { getPropertyContract } from './contract';
import PropertyCard from './PropertyCard';

export default function ViewProperty() {
  const { theme } = useContext(ThemeContext);
  const { signer, account } = useContext(WalletContext);
  const [showModal, setShowModal] = useState(false);
  const [listings, setListings] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!signer) return;
      try {
        const contract = getPropertyContract(signer);
        let cnt = await contract.propertyCount();
        if (typeof cnt !== 'number') {
          try { cnt = Number(cnt); } catch { cnt = cnt.toNumber ? cnt.toNumber() : 0; }
        }
        const items = [];
        for (let i = 0; i < cnt; i++) {
          const p = await contract.properties(i);
          // normalize tuple-style result into named object
          const normalized = {
            propertyId: p.propertyId ?? p[0],
            owner: p.owner ?? p[1],
            name: p.name ?? p[2],
            location: p.location ?? p[3],
            ipfsHash: p.ipfsHash ?? p[4],
            price: p.price ?? p[5],
            isForSale: p.isForSale ?? p[6],
          };
          if (normalized.isForSale) items.push(normalized);
        }
        // attach metadata from IPFS where available
        const gateway = 'https://gateway.pinata.cloud/ipfs';
        const enriched = await Promise.all(
          items.map(async (p) => {
            if (p.ipfsHash && typeof p.ipfsHash === 'string' && /^[A-Za-z0-9]+$/.test(p.ipfsHash)) {
              const url = `${gateway}/${p.ipfsHash}`;
              console.debug('fetch listing metadata', url);
              try {
                const r = await fetch(url);
                if (r.ok) {
                  try {
                    const md = await r.json();
                    return { ...p, metadata: md };
                  } catch (jsonErr) {
                    console.warn('invalid JSON from IPFS metadata', p.ipfsHash, jsonErr);
                  }
                } else if (r.status === 422) {
                  // skip
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
          }),
        );
        if (mounted) setListings(enriched);
      } catch (e) {
        console.error('unable to load listings', e);
      }
    }

    load();
    const handler = () => load();
    window.addEventListener('propertiesUpdated', handler);
    return () => {
      mounted = false;
      window.removeEventListener('propertiesUpdated', handler);
    };
  }, [signer]);

  const handleBuy = async (prop) => {
    if (!signer) {
      alert('connect wallet');
      return;
    }
    try {
      const contract = getPropertyContract(signer);
      const tx = await contract.buyProperty(prop.propertyId, { value: prop.price });
      await tx.wait();
      alert('purchase complete');
      setShowModal(false);
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
  };

  return (
    <>
      <Header />
      <main className={`min-h-screen transition-colors duration-300 ${
        theme === 'dark'
          ? 'dark bg-slate-950 text-slate-100'
          : 'bg-slate-50 text-slate-900'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
          {/* Hero Section */}
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
              Blockchain Property Marketplace
            </h2>
            <p className={`text-lg max-w-2xl ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Explore properties securely registered on the Ethereum blockchain. Immutable ownership, transparent transactions.
            </p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {[
              { label: 'Total Registered Properties', value: '1,284', pct: '+12.5%', color: 'green' },
              { label: 'Available for Sale', value: '432', pct: '+5.2%', color: 'primary' },
              { label: 'Total Transactions', value: '892', pct: '+18.0%', color: 'green' },
              { label: 'Total ETH Volume', value: '4,520 ETH', pct: '+24.1%', color: 'green' },
            ].map((stat, i) => (
              <div key={i} className={`p-6 rounded-2xl backdrop-filter backdrop-blur-md border ${
                theme === 'dark'
                  ? 'bg-white/5 border-white/10'
                  : 'bg-white/50 border-white/20'
              }`}>
                <p className={`text-sm mb-1 ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                }`}>{stat.label}</p>
                <div className="flex items-end justify-between">
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                  <span className={`text-xs font-bold ${
                    stat.color === 'green' ? 'text-green-500' : 'text-orange-500'
                  }`}>{stat.pct}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Filter Bar */}
          <div className={`p-4 rounded-2xl mb-8 flex flex-wrap gap-4 items-center justify-between backdrop-filter backdrop-blur-md border ${
            theme === 'dark'
              ? 'bg-white/5 border-white/10'
              : 'bg-white/50 border-white/20'
          }`}>
            <div className="flex flex-wrap gap-4 flex-1">
              <div className="relative flex-1 min-w-[240px]">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">🔍</span>
                <input
                  className={`w-full rounded-xl pl-10 pr-4 py-2 text-sm border focus:ring-2 focus:ring-orange-500/50 transition-all outline-none ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/10 text-white placeholder-slate-400'
                      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500'
                  }`}
                  placeholder="Search by name or ID..."
                  type="text"
                />
              </div>
              <select className={`rounded-xl px-4 py-2 text-sm border focus:ring-2 focus:ring-orange-500/50 outline-none ${
                theme === 'dark'
                  ? 'bg-white/5 border-white/10 text-white'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}>
                <option>Location (All)</option>
                <option>New York</option>
                <option>London</option>
                <option>Dubai</option>
              </select>
              <div className="flex items-center gap-2">
                <input
                  className={`w-24 rounded-xl px-3 py-2 text-sm border focus:ring-2 focus:ring-orange-500/50 outline-none ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/10 text-white placeholder-slate-400'
                      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500'
                  }`}
                  placeholder="Min ETH"
                  type="number"
                />
                <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-400'}>-</span>
                <input
                  className={`w-24 rounded-xl px-3 py-2 text-sm border focus:ring-2 focus:ring-orange-500/50 outline-none ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/10 text-white placeholder-slate-400'
                      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500'
                  }`}
                  placeholder="Max ETH"
                  type="number"
                />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium uppercase tracking-wider">Show Only For Sale</span>
                <button className="w-10 h-5 bg-orange-500 rounded-full relative transition-colors">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                </button>
              </div>
              <select className={`rounded-xl px-4 py-2 text-sm border focus:ring-2 focus:ring-orange-500/50 outline-none ${
                theme === 'dark'
                  ? 'bg-white/5 border-white/10 text-white'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}>
                <option>Recently Registered</option>
                <option>Price L-H</option>
                <option>Price H-L</option>
              </select>
            </div>
          </div>

          {/* Property Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings
              .filter(p => p && p.propertyId != null)
              .map((p, idx) => (
              <PropertyCard
                key={idx}
                theme={theme}
                id={p.propertyId?.toString() ?? ''}
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
                onBuyClick={() => {
                  setSelected(p);
                  setShowModal(true);
                }}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-3xl p-8 relative overflow-hidden border ${
            theme === 'dark'
              ? 'bg-slate-900 border-white/10'
              : 'bg-white border-slate-200'
          }`}>
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl"></div>

            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-black">Confirm Purchase</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  Review your transaction before signing
                </p>
              </div>
              <button onClick={() => setShowModal(false)} className={`${
                theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-900'
              }`}>
                ✕
              </button>
            </div>

            <div className="space-y-4 mb-8">
              <div className={`flex items-center gap-4 p-4 rounded-2xl border backdrop-filter backdrop-blur-md ${
                theme === 'dark'
                  ? 'bg-white/5 border-white/10'
                  : 'bg-white/50 border-white/20'
              }`}>
                <img
                  className="w-16 h-16 rounded-xl object-cover"
                  src={
                    selected?.metadata?.files && selected.metadata.files.length > 0
                      ? `https://ipfs.io/ipfs/${selected.metadata.files[0]}`
                      : selected?.ipfsHash
                      ? `https://ipfs.io/ipfs/${selected.ipfsHash}`
                      : 'https://via.placeholder.com/64'
                  }
                  alt={selected?.name || ''}
                />
                <div>
                  <h4 className="font-bold">{selected?.name}</h4>
                  <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    #{selected?.propertyId?.toString()} • {selected?.location}
                  </p>
                </div>
              </div>

              <div className="space-y-3 px-1">
                <div className="flex justify-between text-sm">
                  <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>Property Price</span>
                  <span className="font-bold font-mono">
                    {selected ? ethers.formatEther(selected.price) : '--'} ETH
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>Estimated Gas Fee</span>
                  <span className="font-bold font-mono">0.012 ETH</span>
                </div>
                <div className={`pt-3 flex justify-between items-center border-t ${
                  theme === 'dark' ? 'border-white/10' : 'border-slate-200'
                }`}>
                  <span className="font-bold">Total Amount</span>
                  <span className="text-orange-500 text-2xl font-black font-mono">42.512 ETH</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button onClick={() => handleBuy(selected)} className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-orange-500/30 flex items-center justify-center gap-2">
                🔒 Confirm Transaction
              </button>
              <p className="text-center text-[10px] uppercase tracking-widest font-bold text-slate-500">
                Signing will interact with the property smart contract
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

