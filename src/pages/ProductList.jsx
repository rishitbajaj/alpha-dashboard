import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useDebounce } from '../hooks/useDebounce';
import { formatCurrency, getStockStatusDetails } from '../utils/formatters';

const SEGMENT_SIZE = 7;

export default function ProductList() {
  const routerNavigate = useNavigate();
  const { computedProducts, extractedCategories, loading, activeFilters, alterUrlState } = useProducts();

  const [inputTerm, setInputTerm] = useState(activeFilters.query);
  const debouncedSearch = useDebounce(inputTerm, 300);

  const [activeColumns, setActiveColumns] = useState({
    thumbnail: true, 
    title: true, 
    category: true, 
    price: true, 
    stock: true, 
    rating: true
  });

  useEffect(() => {
    alterUrlState('q', debouncedSearch);
  }, [debouncedSearch, alterUrlState]);

  const paginatedRows = useMemo(() => {
    const offsetStart = (activeFilters.pageIndex - 1) * SEGMENT_SIZE;
    return computedProducts.slice(offsetStart, offsetStart + SEGMENT_SIZE);
  }, [computedProducts, activeFilters.pageIndex]);

  const maxPages = Math.max(1, Math.ceil(computedProducts.length / SEGMENT_SIZE));

  return (
    <div className="space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">System Stock Ledger</h1>
          <p className="text-xs text-slate-500 mt-0.5">Filter, search, inspect, and toggle internal inventory records metrics.</p>
        </div>
        
        <div className="flex flex-wrap gap-1.5 p-1 bg-white border border-slate-200 rounded-lg text-[11px] font-medium text-slate-500 shadow-2xs">
          <span className="self-center px-1.5 text-slate-400 font-semibold">Columns:</span>
          {Object.keys(activeColumns).map(col => (
            <button 
              key={col} 
              onClick={() => setActiveColumns(prev => ({ ...prev, [col]: !prev[col] }))}
              className={`px-2 py-0.5 rounded capitalize transition-colors ${
                activeColumns[col] 
                  ? 'bg-indigo-50 text-indigo-600 font-semibold' 
                  : 'hover:bg-slate-50 text-slate-400'
              }`}
            >
              {col}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white p-3.5 rounded-xl border border-slate-200/60 shadow-2xs">
        <input 
          type="text" 
          placeholder="Search items by keyword..." 
          value={inputTerm} 
          onChange={e => setInputTerm(e.target.value)} 
          className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-indigo-500 focus:bg-white transition-all w-full"
        />
        
        <select 
          value={activeFilters.currentCategory} 
          onChange={e => alterUrlState('category', e.target.value)}
          className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md capitalize focus:outline-none focus:bg-white transition-all w-full cursor-pointer"
        >
          {extractedCategories.map(cat => (
            <option key={cat} value={cat}>{cat === 'all' ? 'All Product Categories' : cat}</option>
          ))}
        </select>
        
        <select 
          value={activeFilters.sortingMetric} 
          onChange={e => alterUrlState('sort', e.target.value)}
          className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:bg-white transition-all w-full cursor-pointer"
        >
          <option value="default">Sort Parameters (Default)</option>
          <option value="alpha">Alphabetical Order (A-Z)</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="rating-desc">Rating: Exceptional First</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 font-medium tracking-wide">Reading baseline registry values...</div>
        ) : paginatedRows.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 font-medium">No inventory elements match your active selection parameters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {activeColumns.thumbnail && <th className="p-3 pl-4 w-12 text-center">Thumb</th>}
                  {activeColumns.title && <th className="p-3">Product Name</th>}
                  {activeColumns.category && <th className="p-3">Category</th>}
                  {activeColumns.price && <th className="p-3">Price Point</th>}
                  {activeColumns.stock && <th className="p-3">Ledger Status</th>}
                  {activeColumns.rating && <th className="p-3">Rating Score</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {paginatedRows.map(prod => {
                  const badge = getStockStatusDetails(prod.stock);
                  return (
                    <tr 
                      key={prod.id} 
                      onClick={() => routerNavigate(`/product/${prod.id}`)} 
                      className="hover:bg-indigo-50/20 cursor-pointer transition-colors group"
                    >
                      {activeColumns.thumbnail && (
                        <td className="p-3 pl-4 text-center">
                          <img src={prod.thumbnail} alt="" className="w-8 h-8 rounded bg-slate-50 object-cover border border-slate-100 mx-auto group-hover:scale-105 transition-transform" />
                        </td>
                      )}
                      {activeColumns.title && (
                        <td className="p-3 font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{prod.title}</td>
                      )}
                      {activeColumns.category && <td className="p-3 text-slate-500 capitalize">{prod.category}</td>}
                      {activeColumns.price && <td className="p-3 font-bold text-slate-800">{formatCurrency(prod.price)}</td>}
                      {activeColumns.stock && (
                        <td className="p-3">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${badge.statusClass}`}>{badge.text}</span>
                        </td>
                      )}
                      {activeColumns.rating && <td className="p-3 font-semibold text-amber-600">★ {prod.rating}</td>}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!loading && computedProducts.length > 0 && (
          <div className="px-4 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium">
            <span className="text-slate-400">Page <strong className="text-slate-700 font-bold">{activeFilters.pageIndex}</strong> of <strong className="text-slate-700 font-bold">{maxPages}</strong></span>
            <div className="flex gap-1">
              <button 
                disabled={activeFilters.pageIndex === 1} 
                onClick={() => alterUrlState('page', String(activeFilters.pageIndex - 1))} 
                className="px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-600 font-semibold disabled:opacity-40 hover:bg-slate-50 cursor-pointer transition-colors disabled:cursor-not-allowed"
              >
                Prev
              </button>
              <button 
                disabled={activeFilters.pageIndex === maxPages} 
                onClick={() => alterUrlState('page', String(activeFilters.pageIndex + 1))} 
                className="px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-600 font-semibold disabled:opacity-40 hover:bg-slate-50 cursor-pointer transition-colors disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}