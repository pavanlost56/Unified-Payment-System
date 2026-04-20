export const STRIPE_PLACEHOLDER_MESSAGE =
  "Stripe is initializing. Server is busy, please try again later.";

export const GUEST_PAYMENT_MESSAGE = "Please register or login to make a payment.";

export const COUNTRIES = [
  {
    code: "IN",
    name: "India",
    currency: "INR",
    symbol: "₹",
    gateway: "manual",
    availability: "demo"
  },
  {
    code: "US",
    name: "United States",
    currency: "USD",
    symbol: "$",
    gateway: "stripe",
    availability: "placeholder"
  },
  {
    code: "UK",
    name: "United Kingdom",
    currency: "GBP",
    symbol: "£",
    gateway: "stripe",
    availability: "placeholder"
  }
];

export const COUNTRY_BY_CODE = Object.fromEntries(
  COUNTRIES.map((country) => [country.code, country])
);

export const COUNTRY_GATEWAY_MAP = Object.fromEntries(
  COUNTRIES.map((country) => [country.code, country.gateway])
);

export const COUNTRY_CURRENCY_MAP = Object.fromEntries(
  COUNTRIES.map((country) => [country.code, country.currency])
);

export const COUNTRY_SYMBOL_MAP = Object.fromEntries(
  COUNTRIES.map((country) => [country.code, country.symbol])
);

export const getCountryMeta = (countryCode) => COUNTRY_BY_CODE[countryCode] || COUNTRY_BY_CODE.IN;
