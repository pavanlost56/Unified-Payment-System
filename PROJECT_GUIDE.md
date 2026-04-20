# Project Guide

## What This Repo Is

This repository contains a frontend demo for a unified payment dashboard. It helps someone quickly understand how country-based routing, demo authentication, dashboard metrics, and payment status pages fit together.

## Main Idea

The UI changes payment behavior by country:

- `IN` maps to a manual local flow
- `US` maps to a Stripe preview flow
- `UK` maps to a Stripe preview flow

The current project is a demo experience, so data is stored in browser local storage instead of a live backend.

## Key Files

- [README.md](/Users/ajmeerapavankumar/Desktop/Major%20Project/README.md): quick setup and repo overview
- [src/frontend/App.jsx](/Users/ajmeerapavankumar/Desktop/Major%20Project/src/frontend/App.jsx): route definitions
- [src/frontend/pages/Home.jsx](/Users/ajmeerapavankumar/Desktop/Major%20Project/src/frontend/pages/Home.jsx): landing page
- [src/frontend/pages/Dashboard.jsx](/Users/ajmeerapavankumar/Desktop/Major%20Project/src/frontend/pages/Dashboard.jsx): metrics and transaction list
- [src/frontend/pages/Payment.jsx](/Users/ajmeerapavankumar/Desktop/Major%20Project/src/frontend/pages/Payment.jsx): payment creation flow
- [src/frontend/pages/Status.jsx](/Users/ajmeerapavankumar/Desktop/Major%20Project/src/frontend/pages/Status.jsx): transaction status view
- [src/frontend/components/SessionProvider.jsx](/Users/ajmeerapavankumar/Desktop/Major%20Project/src/frontend/components/SessionProvider.jsx): session state
- [src/frontend/lib/demoData.js](/Users/ajmeerapavankumar/Desktop/Major%20Project/src/frontend/lib/demoData.js): seeded users and transactions
- [src/frontend/lib/constants.js](/Users/ajmeerapavankumar/Desktop/Major%20Project/src/frontend/lib/constants.js): routing configuration

## How The App Works

1. A user lands on the home page.
2. They can register, log in, or enter demo mode.
3. Session state is stored locally in the browser.
4. The dashboard reads local transaction data and computes summary metrics.
5. The payment page creates a local transaction record based on country.
6. The status page loads a single transaction from local storage.

## Why There Is No API

The integrated Razorpay/API setup was removed from this repo. The app now demonstrates the flow without sending real payment or auth requests.

## Git Safety

Sensitive files such as `.env`, `.env.docker`, and Razorpay/API-specific env files are ignored through `.gitignore`.

Still avoid:

- `git add -f .env`
- committing copied secrets into source files
- pasting API keys into `README.md` or frontend code

## Best Way To Explore

- Start with [README.md](/Users/ajmeerapavankumar/Desktop/Major%20Project/README.md)
- Then open [src/frontend/App.jsx](/Users/ajmeerapavankumar/Desktop/Major%20Project/src/frontend/App.jsx)
- Follow the page files in `src/frontend/pages`
- Check [src/frontend/lib/demoData.js](/Users/ajmeerapavankumar/Desktop/Major%20Project/src/frontend/lib/demoData.js) to understand the data model
