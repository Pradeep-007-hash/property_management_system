import React from 'react';

export default function PropertyCard({
  theme,
  id,
  title,
  price,
  location,
  owner,
  image,
  description,
  forSale,
  onBuyClick,
  onSaleToggle = () => {},
  showActions = false, // show update/remove buttons
}) {
  return (
    <div
      className={`rounded-2xl overflow-hidden group hover:translate-y-[-4px] transition-all duration-300 border ${
        forSale
          ? theme === 'dark'
            ? 'border-green-500/30 dark:shadow-lg dark:shadow-green-500/20'
            : 'border-green-500/50'
          : theme === 'dark'
          ? 'border-white/10'
          : 'border-slate-200'
      } backdrop-filter backdrop-blur-md ${
        theme === 'dark' ? 'bg-white/5' : 'bg-white/50'
      }`}
    >
      <div className="aspect-video relative overflow-hidden">
        <img
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          src={image}
          alt={title}
        />
        {forSale && (
          <div className="absolute top-4 right-4 bg-green-500 text-white text-[10px] font-black uppercase px-2 py-1 rounded tracking-widest shadow-lg shadow-green-500/40">
            For Sale
          </div>
        )}
        {!forSale && (
          <div className="absolute top-4 right-4 bg-slate-500 text-white text-[10px] font-black uppercase px-2 py-1 rounded tracking-widest">
            Not For Sale
          </div>
        )}
        <div
          className={`absolute bottom-4 left-4 px-3 py-1 rounded-lg text-xs font-bold text-white backdrop-filter backdrop-blur-md border ${
            theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white/30 border-white/40'
          }`}
        >
          ID: #{id}
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-lg font-bold group-hover:text-orange-500 transition-colors">{title}</h4>
          <div className="text-right">
            <span
              className={`text-xl font-black ${
                forSale ? 'text-orange-500' : 'text-slate-400'
              }`}
            >
              {price} ETH
            </span>
          </div>
        </div>

        <div
          className={`flex items-center gap-2 text-sm mb-4 ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          📍 <span>{location}</span>
        </div>

        {description && (
          <p className="text-xs text-slate-400 italic mb-2">{description}</p>
        )}

        <div
          className={`flex items-center justify-between pt-4 border-t ${
            theme === 'dark' ? 'border-white/10' : 'border-slate-200'
          }`}
        >
          <div className="flex flex-col">
            <span
              className={`text-[10px] uppercase font-bold ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Current Owner
            </span>
            <span className="text-xs font-mono">{owner}</span>
          </div>
          <div className="flex gap-2">
            {showActions && (
              <>
                <button
                  onClick={onSaleToggle}
                  className="p-2 rounded-lg transition-colors border bg-blue-600 text-white text-xs"
                >
                  {forSale ? 'Remove from Sale' : 'List for Sale'}
                </button>
              </>
            )}
            {forSale && onBuyClick && (
              <button
                onClick={onBuyClick}
                className="p-2 rounded-lg bg-orange-500 text-white text-xs"
              >
                Buy
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
