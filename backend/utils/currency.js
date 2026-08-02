export const formatPrice = (price, currencyData) => {
  const converted = price * currencyData.rate;

  return `${currencyData.symbol} ${converted.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}`;
};
