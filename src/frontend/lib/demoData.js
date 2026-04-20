import { COUNTRIES, getCountryMeta } from "./constants.js";

const USERS_KEY = "ups.demo.users";
const TRANSACTIONS_KEY = "ups.demo.transactions";

const createTimestamp = (daysAgo, hourOffset = 0) => {
  const value = new Date();
  value.setDate(value.getDate() - daysAgo);
  value.setHours(value.getHours() - hourOffset);
  return value.toISOString();
};

const seedTransactions = [
  {
    id: "txn_demo_001",
    amount: 499,
    currency: "INR",
    country: "IN",
    gateway: "manual",
    status: "verified",
    orderId: "order_demo_001",
    paymentId: "pay_demo_001",
    createdAt: createTimestamp(3, 2),
    updatedAt: createTimestamp(3, 1),
    ownerEmail: "demo@ups.local"
  },
  {
    id: "txn_demo_002",
    amount: 149,
    currency: "USD",
    country: "US",
    gateway: "stripe",
    status: "pending",
    orderId: "order_demo_002",
    paymentId: "",
    createdAt: createTimestamp(2, 5),
    updatedAt: createTimestamp(2, 5),
    ownerEmail: "demo@ups.local"
  },
  {
    id: "txn_demo_003",
    amount: 89,
    currency: "GBP",
    country: "UK",
    gateway: "stripe",
    status: "failed",
    orderId: "order_demo_003",
    paymentId: "",
    createdAt: createTimestamp(1, 7),
    updatedAt: createTimestamp(1, 6),
    ownerEmail: "demo@ups.local"
  }
];

const seedUsers = [
  {
    email: "demo@ups.local",
    password: "Demo@12345",
    role: "admin"
  }
];

const readStorage = (key, fallback) => {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (_error) {
    return fallback;
  }
};

const writeStorage = (key, value) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
};

export const ensureDemoState = () => {
  const users = readStorage(USERS_KEY, null);
  const transactions = readStorage(TRANSACTIONS_KEY, null);

  if (!users) {
    writeStorage(USERS_KEY, seedUsers);
  }

  if (!transactions) {
    writeStorage(TRANSACTIONS_KEY, seedTransactions);
  }
};

export const loginDemoUser = ({ email, password }) => {
  ensureDemoState();
  const users = readStorage(USERS_KEY, seedUsers);
  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find((item) => item.email === normalizedEmail && item.password === password);

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  return {
    mode: "authenticated",
    user: {
      email: user.email,
      role: user.role
    }
  };
};

export const registerDemoUser = ({ email, password }) => {
  ensureDemoState();
  const users = readStorage(USERS_KEY, seedUsers);
  const normalizedEmail = email.trim().toLowerCase();

  if (users.some((item) => item.email === normalizedEmail)) {
    throw new Error("An account with that email already exists.");
  }

  const nextUser = {
    email: normalizedEmail,
    password,
    role: "user"
  };

  writeStorage(USERS_KEY, [...users, nextUser]);

  return {
    mode: "authenticated",
    user: {
      email: nextUser.email,
      role: nextUser.role
    }
  };
};

const readTransactions = () => {
  ensureDemoState();
  return readStorage(TRANSACTIONS_KEY, seedTransactions);
};

const writeTransactions = (transactions) => {
  writeStorage(TRANSACTIONS_KEY, transactions);
};

const compareDesc = (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();

const filterTransactions = (transactions, { country = "", gateway = "" } = {}) =>
  transactions.filter((transaction) => {
    if (country && transaction.country !== country) {
      return false;
    }

    if (gateway && transaction.gateway !== gateway) {
      return false;
    }

    return true;
  });

export const getDashboardData = (filters = {}) => {
  const transactions = filterTransactions(readTransactions(), filters).sort(compareDesc);
  const summary = transactions.reduce(
    (accumulator, transaction) => {
      accumulator.totalTransactions += 1;
      accumulator.totalAmount += Number(transaction.amount) || 0;

      if (transaction.status === "verified") {
        accumulator.successCount += 1;
      } else {
        accumulator.issueCount += 1;
      }

      const currencyGroup = accumulator.currencyMap.get(transaction.currency) || 0;
      accumulator.currencyMap.set(transaction.currency, currencyGroup + Number(transaction.amount || 0));
      return accumulator;
    },
    {
      totalTransactions: 0,
      totalAmount: 0,
      successCount: 0,
      issueCount: 0,
      currencyMap: new Map()
    }
  );

  return {
    summary: {
      totalTransactions: summary.totalTransactions,
      totalAmount: summary.totalAmount,
      successCount: summary.successCount,
      issueCount: summary.issueCount,
      totalsByCurrency: Array.from(summary.currencyMap.entries()).map(([currency, total]) => ({
        currency,
        total
      }))
    },
    transactions
  };
};

export const getTransactionById = (transactionId) =>
  readTransactions().find((transaction) => transaction.id === transactionId) || null;

export const createDemoPayment = ({ country, amount, ownerEmail }) => {
  const countryMeta = getCountryMeta(country);
  const now = new Date().toISOString();
  const transaction = {
    id: `txn_${Date.now()}`,
    amount,
    currency: countryMeta.currency,
    country: countryMeta.code,
    gateway: countryMeta.gateway,
    status: countryMeta.gateway === "manual" ? "verified" : "pending",
    orderId: `order_${Date.now()}`,
    paymentId: countryMeta.gateway === "manual" ? `pay_${Date.now()}` : "",
    createdAt: now,
    updatedAt: now,
    ownerEmail
  };

  const transactions = [transaction, ...readTransactions()].sort(compareDesc);
  writeTransactions(transactions);
  return transaction;
};

export const getCountryOptions = () => COUNTRIES;
