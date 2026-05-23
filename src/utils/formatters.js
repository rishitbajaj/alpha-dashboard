export const formatCurrency = (value) => {
  if (typeof value !== 'number') return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(value);
};

export const getStockStatusDetails = (quantity) => {
  if (!quantity || quantity === 0) {
    return { text: 'Out of Stock', statusClass: 'bg-rose-50 text-rose-700 border-rose-100' };
  }
  if (quantity < 10) {
    return { text: `Low Inventory (${quantity})`, statusClass: 'bg-amber-50 text-amber-700 border-amber-100' };
  }
  return { text: 'In Stock', statusClass: 'bg-emerald-50 text-emerald-700 border-emerald-100' };
};