# Unified Payment System

Frontend-only payment routing demo built with React and Vite.

## Overview

This project shows a simple payment operations dashboard with:

- country-based payment routing
- local demo authentication
- dashboard metrics and transaction history
- payment status inspection

The app is now frontend-only. It does not depend on a live backend API for login, dashboard data, or payment creation.

## Current Flow

- India uses a manual local flow
- US uses a Stripe routing preview
- UK uses a Stripe routing preview
- demo users and demo transactions are stored in browser local storage

## What Changed

- Razorpay integration has been removed
- API-backed auth and transaction calls were replaced with local demo state
- API and secret-like files are ignored through `.gitignore`

## Quick Start

```bash
npm install
npm run dev
```

Open the Vite app in your browser after the dev server starts.

## Demo Access

Use the seeded demo account:

- Email: `demo@ups.local`
- Password: `Demo@12345`

You can also create a new demo account from the register page.

## Project Structure

```text
src/frontend/
  components/    reusable UI pieces
  lib/           constants, formatting, local demo data
  pages/         route-level screens
  styles/        global styling
```

## Important Notes

- No Razorpay API calls are used anymore
- `.env` and `.env.docker` are ignored by Git
- do not force-add secret files with `git add -f`

## Repository Guide

For a quick repo walkthrough, see [PROJECT_GUIDE.md](/Users/ajmeerapavankumar/Desktop/Major%20Project/PROJECT_GUIDE.md).
# Unified-Payment-System
