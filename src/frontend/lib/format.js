import { getCountryMeta } from "./constants.js";

const currencyLocales = {
  INR: "en-IN",
  USD: "en-US",
  GBP: "en-GB"
};

export const formatCurrency = (amount, currency = "USD") => {
  try {
    return new Intl.NumberFormat(currencyLocales[currency] || "en-US", {
      style: "currency",
      currency
    }).format(Number(amount || 0));
  } catch (_error) {
    return `${currency} ${Number(amount || 0).toFixed(2)}`;
  }
};

export const formatCountryAmount = (amount, countryCode) => {
  const country = getCountryMeta(countryCode);
  return formatCurrency(amount, country.currency);
};

export const formatDateTime = (value) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));

export const gatewayLabel = (gateway) =>
  gateway === "stripe" ? "Stripe" : "Manual";

export const statusLabel = (status) =>
  status.charAt(0).toUpperCase() + status.slice(1);

export const currencyLabel = (countryCode) => {
  const country = getCountryMeta(countryCode);
  return `${country.symbol} ${country.currency}`;
};
