import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatCurrency, getStockStatusDetails } from '../utils/formatters';

export default function ProductDetail() {
  const { id } = useParams();
  const routerNavigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchSingleItem = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://dummyjson.com/products/${id}`);
        if (!response.ok) throw new Error('Requested inventory record could not be fetched.');
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSingleItem();
  }, [id]);

  if (loading) {
    return <div className="p-12 text-center text-xs text-slate-400 font-medium tracking-wide">Syncing dedicated single line asset logs...</div>;
  }

  if (error || !product) {
    return (
      <div className="p-12 text-center bg-white border border-slate-200 rounded-xl max-w-md mx-auto">
        <p className="text-xs font-semibold text-rose-600">Inspection Failure</p>
        <p className="text-xs text-slate-500 mt-1">{error || 'Asset record target unavailable.'}</p>
        <button onClick={() => routerNavigate('/')} className="mt-4 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-xs transition-colors cursor-pointer">
          Return to Ledger
        </button>
      </div>
    );
  }

  const badge = getStockStatusDetails(product.stock);
  const secondaryImages = product.images && product.images.length > 0 ? product.images : [product.thumbnail];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => routerNavigate(-1)} 
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1.5 group cursor-pointer"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span> Back to System Inventory
        </button>
        <div className="text-[11px] text-slate-400 font-medium capitalize">
          SKU-{product.sku || 'UNKNOWN'} / {product.category}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200/70 shadow-2xs flex items-center justify-center aspect-square overflow-hidden group">
            <img 
              src={secondaryImages[activeImageIndex]} 
              alt={product.title} 
              className="max-h-72 object-contain group-hover:scale-102 transition-transform duration-300" 
            />
          </div>
          
          {secondaryImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {secondaryImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-14 p-1 bg-white border rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                    idx === activeImageIndex 
                      ? 'border-indigo-600 ring-2 ring-indigo-50' 
                      : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <img src={imgUrl} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200/70 shadow-2xs space-y-5">
          <div>
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold border capitalize bg-slate-50 text-slate-500 border-slate-100 mb-2">
              {product.brand || 'Generic Brand Link'}
            </span>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">{product.title}</h2>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{product.description}</p>
          </div>

          <div className="border-t border-b border-slate-100 py-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">Ledger Value Price</p>

              <p className="text-xl font-extrabold text-slate-900 mt-0.5">{formatCurrency(product.price * 84)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">Status Rating</p>
              <div className="flex items-center gap-1 mt-1 justify-end text-xs font-bold">
                <span className="text-amber-500">★</span>
                <span className="text-slate-800">{product.rating}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-[11px]">
            <div>
              <span className="text-slate-400 font-medium block">Current Stock</span>
              <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold border mt-0.5 ${badge.statusClass}`}>
                {badge.text}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Warranty Terms</span>
              <span className="text-slate-700 font-semibold block mt-0.5">{product.warrantyInformation || 'No Warranty Provided'}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Shipping Protocol</span>
              <span className="text-slate-700 font-semibold block mt-0.5">{product.shippingInformation || 'Standard Cargo Delivery'}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Return Shield Policy</span>
              <span className="text-slate-700 font-semibold block mt-0.5">{product.returnPolicy || 'Final Sale Registry'}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}