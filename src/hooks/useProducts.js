import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Read current filters from the active URL string
  const query = searchParams.get('q') || '';
  const currentCategory = searchParams.get('category') || 'all';
  const sortingMetric = searchParams.get('sort') || 'default';
  const pageIndex = parseInt(searchParams.get('page') || '1', 10);

  // Fetch initial raw baseline data array
  useEffect(() => {
    const loadInventoryData = async () => {
      try {
        setLoading(true);
        const dynamicResponse = await fetch('https://dummyjson.com/products?limit=100');
        if (!dynamicResponse.ok) throw new Error('Data sync stream failed.');
        const parsedPayload = await dynamicResponse.json();
        setProducts(parsedPayload.products || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadInventoryData();
  }, []);

  // Isolate distinct categories for dropdown lists
  const extractedCategories = useMemo(() => {
    const rawDistinctTags = new Set(products.map(item => item.category));
    return ['all', ...Array.from(rawDistinctTags)];
  }, [products]);

  // Compute filtering and sorting conditions
  const computedProducts = useMemo(() => {
    let processStream = [...products];

    if (query.trim() !== '') {
      const standardKeyword = query.toLowerCase().trim();
      processStream = processStream.filter(prod => 
        prod.title.toLowerCase().includes(standardKeyword) ||
        prod.description.toLowerCase().includes(standardKeyword)
      );
    }

    if (currentCategory !== 'all') {
      processStream = processStream.filter(prod => prod.category === currentCategory);
    }

    if (sortingMetric === 'alpha') {
      processStream.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortingMetric === 'price-asc') {
      processStream.sort((a, b) => a.price - b.price);
    } else if (sortingMetric === 'rating-desc') {
      processStream.sort((a, b) => b.rating - a.rating);
    }

    return processStream;
  }, [products, query, currentCategory, sortingMetric]);

  // CRITICAL FIX: Overwrite URL parameters explicitly by instantiating a fresh map object
  const alterUrlState = useCallback((property, incomingValue) => {
    const workingMap = new URLSearchParams(window.location.search);
    
    if (incomingValue && incomingValue !== 'all' && incomingValue !== 'default' && incomingValue !== '') {
      workingMap.set(property, String(incomingValue));
    } else {
      workingMap.delete(property);
    }
    
    // Safety Reset: Reset pagination to page 1 ONLY if changing search queries or categories
    if (property === 'q' || property === 'category') {
      workingMap.delete('page'); 
    }
    
    setSearchParams(workingMap);
  }, [setSearchParams]);

  return {
    products,
    computedProducts,
    extractedCategories,
    loading,
    error,
    activeFilters: {
      query,
      currentCategory,
      sortingMetric,
      pageIndex
    },
    alterUrlState
  };
}