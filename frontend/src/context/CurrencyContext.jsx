import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CurrencyContext = createContext();

export const CURRENCY_DATA = {
  PKR: {
    label: "Pakistani Rupee",
    symbol: "Rs.",
    locale: "en-PK",
    rate: 1,
    fractionDigits: 0,
  },
  USD: {
    label: "United States Dollar",
    symbol: "$",
    locale: "en-US",
    rate: 0.00357,
    fractionDigits: 2,
  },
  EUR: {
    label: "Euro",
    symbol: "€",
    locale: "de-DE",
    rate: 0.00325,
    fractionDigits: 2,
  },
  GBP: {
    label: "British Pound Sterling",
    symbol: "£",
    locale: "en-GB",
    rate: 0.00278,
    fractionDigits: 2,
  },
  AED: {
    label: "United Arab Emirates Dirham",
    symbol: "د.إ",
    locale: "ar-AE",
    rate: 0.0134,
    fractionDigits: 2,
  },
  SAR: {
    label: "Saudi Riyal",
    symbol: "﷼",
    locale: "ar-SA",
    rate: 0.0132,
    fractionDigits: 2,
  },
  CAD: {
    label: "Canadian Dollar",
    symbol: "C$",
    locale: "en-CA",
    rate: 0.00475,
    fractionDigits: 2,
  },
  AUD: {
    label: "Australian Dollar",
    symbol: "A$",
    locale: "en-AU",
    rate: 0.0052,
    fractionDigits: 2,
  },
  NZD: {
    label: "New Zealand Dollar",
    symbol: "NZ$",
    locale: "en-NZ",
    rate: 0.0059,
    fractionDigits: 2,
  },
  JPY: {
    label: "Japanese Yen",
    symbol: "¥",
    locale: "ja-JP",
    rate: 0.52,
    fractionDigits: 0,
  },
  CNY: {
    label: "Chinese Yuan",
    symbol: "¥",
    locale: "zh-CN",
    rate: 0.026,
    fractionDigits: 2,
  },
  INR: {
    label: "Indian Rupee",
    symbol: "₹",
    locale: "en-IN",
    rate: 0.29,
    fractionDigits: 2,
  },
  SGD: {
    label: "Singapore Dollar",
    symbol: "S$",
    locale: "en-SG",
    rate: 0.0046,
    fractionDigits: 2,
  },
  HKD: {
    label: "Hong Kong Dollar",
    symbol: "HK$",
    locale: "en-HK",
    rate: 0.028,
    fractionDigits: 2,
  },
  MYR: {
    label: "Malaysian Ringgit",
    symbol: "RM",
    locale: "ms-MY",
    rate: 0.017,
    fractionDigits: 2,
  },
  NOK: {
    label: "Norwegian Krone",
    symbol: "kr",
    locale: "nb-NO",
    rate: 0.034,
    fractionDigits: 2,
  },
  SEK: {
    label: "Swedish Krona",
    symbol: "kr",
    locale: "sv-SE",
    rate: 0.032,
    fractionDigits: 2,
  },
  DKK: {
    label: "Danish Krone",
    symbol: "kr",
    locale: "da-DK",
    rate: 0.024,
    fractionDigits: 2,
  },
  CHF: {
    label: "Swiss Franc",
    symbol: "CHF",
    locale: "de-CH",
    rate: 0.0034,
    fractionDigits: 2,
  },
  TRY: {
    label: "Turkish Lira",
    symbol: "₺",
    locale: "tr-TR",
    rate: 0.15,
    fractionDigits: 2,
  },
  RUB: {
    label: "Russian Ruble",
    symbol: "₽",
    locale: "ru-RU",
    rate: 0.29,
    fractionDigits: 2,
  },
  ZAR: {
    label: "South African Rand",
    symbol: "R",
    locale: "en-ZA",
    rate: 0.065,
    fractionDigits: 2,
  },
  BRL: {
    label: "Brazilian Real",
    symbol: "R$",
    locale: "pt-BR",
    rate: 0.014,
    fractionDigits: 2,
  },
  MXN: {
    label: "Mexican Peso",
    symbol: "$",
    locale: "es-MX",
    rate: 0.057,
    fractionDigits: 2,
  },
  ARS: {
    label: "Argentine Peso",
    symbol: "$",
    locale: "es-AR",
    rate: 0.036,
    fractionDigits: 2,
  },
  CLP: {
    label: "Chilean Peso",
    symbol: "$",
    locale: "es-CL",
    rate: 0.0028,
    fractionDigits: 0,
  },
  COP: {
    label: "Colombian Peso",
    symbol: "COL$",
    locale: "es-CO",
    rate: 0.011,
    fractionDigits: 0,
  },
  PEN: {
    label: "Peruvian Sol",
    symbol: "S/",
    locale: "es-PE",
    rate: 0.011,
    fractionDigits: 2,
  },
  THB: {
    label: "Thai Baht",
    symbol: "฿",
    locale: "th-TH",
    rate: 0.11,
    fractionDigits: 2,
  },
  IDR: {
    label: "Indonesian Rupiah",
    symbol: "Rp",
    locale: "id-ID",
    rate: 47.5,
    fractionDigits: 0,
  },
  PHP: {
    label: "Philippine Peso",
    symbol: "₱",
    locale: "en-PH",
    rate: 0.16,
    fractionDigits: 2,
  },
  VND: {
    label: "Vietnamese Dong",
    symbol: "₫",
    locale: "vi-VN",
    rate: 82.5,
    fractionDigits: 0,
  },
  ILS: {
    label: "Israeli Shekel",
    symbol: "₪",
    locale: "he-IL",
    rate: 0.011,
    fractionDigits: 2,
  },
  EGP: {
    label: "Egyptian Pound",
    symbol: "E£",
    locale: "ar-EG",
    rate: 0.098,
    fractionDigits: 2,
  },
  NGN: {
    label: "Nigerian Naira",
    symbol: "₦",
    locale: "en-NG",
    rate: 1.04,
    fractionDigits: 2,
  },
  KES: {
    label: "Kenyan Shilling",
    symbol: "KSh",
    locale: "en-KE",
    rate: 0.35,
    fractionDigits: 2,
  },
  KWD: {
    label: "Kuwaiti Dinar",
    symbol: "د.ك",
    locale: "ar-KW",
    rate: 0.00108,
    fractionDigits: 3,
  },
  BHD: {
    label: "Bahraini Dinar",
    symbol: "ب.د",
    locale: "ar-BH",
    rate: 0.00106,
    fractionDigits: 3,
  },
  OMR: {
    label: "Omani Rial",
    symbol: "ر.ع.",
    locale: "ar-OM",
    rate: 0.0011,
    fractionDigits: 3,
  },
  QAR: {
    label: "Qatari Riyal",
    symbol: "﷼",
    locale: "ar-QA",
    rate: 0.0134,
    fractionDigits: 2,
  },
  BDT: {
    label: "Bangladeshi Taka",
    symbol: "৳",
    locale: "bn-BD",
    rate: 0.44,
    fractionDigits: 2,
  },
  NPR: {
    label: "Nepalese Rupee",
    symbol: "रू",
    locale: "ne-NP",
    rate: 0.48,
    fractionDigits: 2,
  },
  LKR: {
    label: "Sri Lankan Rupee",
    symbol: "Rs",
    locale: "en-LK",
    rate: 1.08,
    fractionDigits: 2,
  },
};

const INITIAL_RATES = Object.fromEntries(
  Object.entries(CURRENCY_DATA).map(([code, data]) => [code, data.rate]),
);

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrencyState] = useState(() => {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem("hdr_currency") || "PKR";
    }
    return "PKR";
  });
  const [rates, setRates] = useState(INITIAL_RATES);

  const currencyOptions = useMemo(
    () =>
      Object.entries(CURRENCY_DATA).map(([code, data]) => ({
        code,
        label: data.label,
      })),
    [],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const controller = new AbortController();
    fetch("https://api.exchangerate.host/latest?base=PKR", {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.rates) return;
        const supported = Object.keys(CURRENCY_DATA);
        const updatedRates = supported.reduce((acc, code) => {
          if (data.rates[code]) acc[code] = data.rates[code];
          return acc;
        }, {});
        setRates((prev) => ({ ...prev, ...updatedRates }));
      })
      .catch(() => {
        /* keep static rates when the fetch fails */
      });

    return () => controller.abort();
  }, []);

  const setCurrency = (value) => {
    if (!CURRENCY_DATA[value]) return;
    setCurrencyState(value);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("hdr_currency", value);
    }
  };

  const convertPrice = (amount, targetCurrency = currency) => {
    if (amount === null || amount === undefined) return 0;
    const numeric = Number(amount);
    if (!Number.isFinite(numeric)) return 0;
    return numeric * (rates[targetCurrency] ?? 1);
  };

  const formatCurrency = (amount, targetCurrency = currency) => {
    const numeric = convertPrice(amount, targetCurrency);
    const currencyInfo = CURRENCY_DATA[targetCurrency] || CURRENCY_DATA.PKR;
    const formatter = new Intl.NumberFormat(currencyInfo.locale, {
      style: "currency",
      currency: targetCurrency,
      currencyDisplay: "symbol",
      minimumFractionDigits: currencyInfo.fractionDigits,
      maximumFractionDigits: currencyInfo.fractionDigits,
    });
    let formatted = formatter.format(numeric);
    if (targetCurrency === "PKR") {
      formatted = formatted.replace("Rs", "Rs.");
    }
    return formatted;
  };

  const symbol = CURRENCY_DATA[currency]?.symbol || "Rs.";

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        convertPrice,
        formatCurrency,
        symbol,
        currencyOptions,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
