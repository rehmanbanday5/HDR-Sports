const Order = require('../models/Order');

// Generates a human-friendly, sortable order number, e.g. GLY-20260726-0007
const generateOrderNumber = async () => {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const countToday = await Order.countDocuments({ createdAt: { $gte: startOfDay } });
  const seq = String(countToday + 1).padStart(4, '0');
  return `GLY-${datePart}-${seq}`;
};

// Shipping configuration — kept centralized so admin-configurable rates can replace this later.
const SHIPPING_RATES = {
  local: [
    { id: 'local_standard', name: 'Standard Local (3-5 days)', cost: 250, estimatedDays: '3-5 business days' },
    { id: 'local_express', name: 'Express Local (1-2 days)', cost: 500, estimatedDays: '1-2 business days' },
  ],
  international: [
    { id: 'intl_standard', name: 'International Standard (7-14 days)', cost: 4500, estimatedDays: '7-14 business days' },
    { id: 'intl_express', name: 'International Express (3-5 days)', cost: 9500, estimatedDays: '3-5 business days' },
  ],
};

const FREE_SHIPPING_THRESHOLD_LOCAL = 15000; // PKR

const getShippingOptions = (isInternational, subtotal = 0) => {
  const options = isInternational ? SHIPPING_RATES.international : SHIPPING_RATES.local;
  if (!isInternational && subtotal >= FREE_SHIPPING_THRESHOLD_LOCAL) {
    return options.map((o) => (o.id === 'local_standard' ? { ...o, cost: 0, name: `${o.name} — Free` } : o));
  }
  return options;
};

const findShippingOption = (isInternational, methodId, subtotal = 0) => {
  const options = getShippingOptions(isInternational, subtotal);
  return options.find((o) => o.id === methodId) || options[0];
};

module.exports = { generateOrderNumber, getShippingOptions, findShippingOption, SHIPPING_RATES };
