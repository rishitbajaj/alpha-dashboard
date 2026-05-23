import React, { useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import { formatCurrency } from '../utils/formatters';

export default function Analytics() {
  const { computedProducts, loading } = useProducts();

  const analyticsSummary = useMemo(() => {
    if (!computedProducts.length) {
      return { totalCount: 0, averageRating: 0, totalLedgerValue: 0, categorySplits: [] };
    }

    const totalCount = computedProducts.length;

    const totalLedgerValue = computedProducts.reduce((accum, item) => {
  
      return accum + ((item.price * 84) * item.stock);
    }, 0);

    const accumulatedRating = computedProducts.reduce((accum, item) => accum + item.rating, 0);

    const frequencyDistribution = computedProducts.reduce((accum, item) => {
      accum[item.category] = (accum[item.category] || 0) + 1;
      return accum;
    }, {});

    const categorySplits = Object.entries(frequencyDistribution).map(([name, occurrences]) => ({
      name,
      occurrences,
      ratio: Math.round((occurrences / totalCount) * 100)
    })).sort((a, b) => b.occurrences - a.occurrences);

    return {
      totalCount,
      averageRating: (accumulatedRating / totalCount).toFixed(2),
      totalLedgerValue,
      categorySplits
    };
  }, [computedProducts]);

  if (loading) {
    return <div className="p-12 text-center text-xs text-slate-400 font-medium tracking-wide">Processing analytical summary matrix indices...</div>;
  }

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Performance Matrix Suite</h1>
        <p className="text-xs text-slate-500 mt-0.5">Calculated ledger stats mapped across the current matching catalog selection.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Tracked Catalog Scale</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{analyticsSummary.totalCount} Products</p>
        </div>
        
        <div className="p-4 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Mean Score Rank</p>
          <p className="text-xl font-bold text-amber-600 mt-1">★ {analyticsSummary.averageRating}</p>
        </div>
        
        <div className="p-4 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Gross Inventory Valuation</p>
          <p className="text-xl font-bold text-emerald-600 mt-1">{formatCurrency(analyticsSummary.totalLedgerValue)}</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200/70 shadow-2xs">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-5">Volume Category Distribution</h3>
        
        {analyticsSummary.categorySplits.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">No segment splits available for processing.</p>
        ) : (
          <div className="space-y-4">
            {analyticsSummary.categorySplits.slice(0, 6).map(group => (
              <div key={group.name} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-700 font-semibold capitalize">{group.name}</span>
                  <span className="text-slate-400 text-[11px]">{group.occurrences} items ({group.ratio}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${group.ratio}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}