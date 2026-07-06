export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompact(amount) {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount}`;
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function formatMonth(monthStr) {
  return new Date(monthStr + '-01').toLocaleDateString('en-IN', {
    month: 'short',
    year: '2-digit'
  });
}

export function getChangeIcon(direction) {
  switch (direction) {
    case 'rising': return '↑';
    case 'falling': return '↓';
    default: return '→';
  }
}

export function getChangeColor(direction, isGood) {
  if (direction === 'rising') return isGood ? 'var(--accent-teal)' : 'var(--accent-red)';
  if (direction === 'falling') return isGood ? 'var(--accent-red)' : 'var(--accent-teal)';
  return 'var(--text-muted)';
}
