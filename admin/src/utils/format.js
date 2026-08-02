export const formatPrice = (amount, currency = 'PKR') => {
  if (amount === null || amount === undefined) return '';
  return `${currency} ${Number(amount).toLocaleString('en-PK')}`;
};

export const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const primaryImage = (product) =>
  product?.images?.find((i) => i.isPrimary)?.url || product?.images?.[0]?.url || 'https://placehold.co/800x800/1B4332/F7F5F0?text=HDR';

export const displayPrice = (product) => {
  if (product?.hasVariants && product.variants?.length) {
    const prices = product.variants.map((v) => v.salePrice || v.price);
    return Math.min(...prices);
  }
  return product?.baseSalePrice || product?.basePrice;
};

export const originalPrice = (product) => {
  if (product?.hasVariants && product.variants?.length) {
    const anyOnSale = product.variants.some((v) => v.salePrice);
    if (!anyOnSale) return null;
    const prices = product.variants.map((v) => v.price);
    return Math.min(...prices);
  }
  return product?.baseSalePrice ? product.basePrice : null;
};
