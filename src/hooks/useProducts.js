import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const currentCategory = searchParams.get('category') || 'all';
  const sortingMetric = searchParams.get('sort') || 'default';
  const pageIndex = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    let activeCall = true;
    
    const loadInventoryData = async () => {
      try {
        setLoading(true);
        const dynamicResponse = await fetch('https://dummyjson.com/products?limit=100');
        if (!dynamicResponse.ok) throw new Error('Data sync failure with storage service endpoints.');
        
        const content = await dynamicResponse.json();
        if (activeCall) setProducts(content.products || []);
      } catch (err) {
        if (activeCall) setError(err.message);
      } finally {
        if (activeCall) setLoading(false);
      }
    };

    loadInventoryData();
    return () => { activeCall = false; };
  }, []);
  const filteredOutput = useMemo(() => {
    let operationalArray = [...products];

    if (query.trim()) {
      operationalArray = operationalArray.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (currentCategory !== 'all') {
      operationalArray = operationalArray.filter(item => 
        item.category.toLowerCase() === currentCategory.toLowerCase()
      );
    }

    if (sortingMetric === 'price-asc') operationalArray.sort((a, b) => a.price - b.price);
    if (sortingMetric === 'rating-desc') operationalArray.sort((a, b) => b.rating - a.rating);
    if (sortingMetric === 'alpha') operationalArray.sort((a, b) => a.title.localeCompare(b.title));

    return operationalArray;
  }, [products, query, currentCategory, sortingMetric]);

  const alterUrlState = useCallback((property, incomingValue) => {
    setSearchParams(currentParams => {
      const workingMap = new URLSearchParams(currentParams);
      if (incomingValue && incomingValue !== 'all' && incomingValue !== 'default') {
        workingMap.set(property, incomingValue);
      } else {
        workingMap.delete(property);
      }
      
      if (property !== 'page') workingMap.delete('page'); 
      return workingMap;
    });
  }, [setSearchParams]);

  const extractedCategories = useMemo(() => {
    return ['all', ...new Set(products.map(p => p.category))];
  }, [products]);

  return {
    rawCollection: products,
    computedProducts: filteredOutput,
    extractedCategories,
    loading,
    error,
    activeFilters: { query, currentCategory, sortingMetric, pageIndex },
    alterUrlState
  };
}