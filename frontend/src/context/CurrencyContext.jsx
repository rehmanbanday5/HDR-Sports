import { createContext, useContext, useState } from "react";

const CurrencyContext = createContext();

export const RATES = {
  PKR: 1,
  USD: 0.0036,
  EUR: 0.0031,
  GBP: 0.0027,
  AED: 0.013,
  SAR: 0.014,
  CAD: 0.0049,
  AUD: 0.0055,
  NZD: 0.006,
  JPY: 0.53,
  CNY: 0.026,
  INR: 0.3,
  BDT: 0.44,
  NPR: 0.48,
  LKR: 1.08,
  TRY: 0.15,
  RUB: 0.29,
  ZAR: 0.066,
  MYR: 0.017,
  SGD: 0.0046,
  HKD: 0.028,
};

export const SYMBOLS = {
  PKR: "Rs",
  USD: "$",
  EUR: "€",
  GBP: "£",
  AED: "AED",
  SAR: "SAR",
  CAD: "C$",
  AUD: "A$",
  NZD: "NZ$",
  JPY: "¥",
  CNY: "¥",
  INR: "₹",
  BDT: "৳",
  NPR: "रू",
  LKR: "Rs",
  TRY: "₺",
  RUB: "₽",
  ZAR: "R",
  MYR: "RM",
  SGD: "S$",
  HKD: "HK$",
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState("PKR");

  const convertPrice = (amount) => {
    if (!amount) return 0;

    return Number(amount) * RATES[currency];
  };

  const symbol = SYMBOLS[currency];

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        convertPrice,
        symbol,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
