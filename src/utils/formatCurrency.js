const formatCurrency = (amount, currency = 'IDR', locale = 'id-ID') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
};

export default formatCurrency;
