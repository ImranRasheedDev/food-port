# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Food Port is a React 19 food delivery web application built with Vite. It connects customers to restaurants and food trucks with features including cart management, Stripe payments, Google Maps location services, and Firebase push notifications.

## Development Commands

```bash
npm run dev        # Start Vite dev server with HMR
npm run build      # Production build
npm run build:prod # Production build with explicit production mode
npm run lint       # Run ESLint
npm run preview    # Preview production build
```

## Environment Variables

Required in `.env`:
- `VITE_API_BASE_URL` - Backend API URL (defaults to https://myfoodport.com/api)
- `VITE_GOOGLE_API_KEY` - Google Maps API key
- `VITE_STRIPE_PUBLIC_KEY` - Stripe publishable key
- `VITE_STRIPE_SECRET_KEY` - Stripe secret key (for payment intents)
- `VITE_BASE_URL` - Base path for deployment (optional, defaults to "/")

## Architecture

### Global State Pattern

The app uses a bootstrap pattern that initializes window globals before React mounts:

- `window.user` - Current authenticated user (from encrypted localStorage)
- `window.constants` - Environment config (`src/config/constants.js`)
- `window.helper` - Encryption/storage helpers (`src/helpers/index.js`)
  - `getStorageData(key)` / `setStorageData(key, value)` - Encrypted localStorage
  - `sweetAlert(type, title, msg, callback)` - SweetAlert2 wrapper
  - `getLocationDetails(lat, lng, destLat, destLng)` - Google Maps geocoding + distance
- `window.lodash` - Lodash utility library

Authentication token is accessed via `window.user?.access_token` throughout the app.

### API Layer (`src/hooks/api/useApi.js`)

Centralized HTTP client with TanStack React Query hooks:

- `httpClient(url, options)` - Base fetch wrapper with auth headers
- `useApiQuery(queryKey, endpoint, params, options)` - GET requests with caching
- `useApiMutation(endpoint, options)` - POST requests
- `useApiUpdateMutation(endpoint, method, options)` - PUT/PATCH requests
- `useApiDeleteMutation(endpoint, options)` - DELETE requests
- `useApiForm(mutation, form)` - React Hook Form integration with server-side validation

Query caching: 5min stale time, 10min cache time, 2 retries.

**File uploads**: Pass `FormData` directly to mutations - the client auto-removes `Content-Type` header for proper multipart handling.

### Context Providers

Provider wrapping order (outer to inner): `BrowserRouter` → `QueryProvider` → `GoogleMapsProvider` → `NotificationProvider` → `LoaderProvider` → `CartProvider`

- `CartProvider` - Shopping cart state with localStorage persistence (`food-port-cart`, `food-port-restaurant`), handles multi-restaurant conflicts with confirmation modal
- `LoaderProvider` - Global loading state with `useLoader()` hook (`showLoader(msg)`, `hideLoader()`)
- `NotificationProvider` - Firebase push notifications, manages FCM token storage and notification permissions
- `QueryProvider` - TanStack React Query client with default settings
- `GoogleMapsProvider` - Google Maps API loader with Places library

### Routing Structure

Two route groups in `src/App.jsx`:
1. **Main routes** (with `Layout` wrapper): `/`, `/all-resturants`, `/cart`, `/pay`, etc.
2. **Auth routes** (no layout): `/auth/login`, `/auth/signup`, `/auth/otp`, etc.

### Component Organization

```
src/components/
├── ui/           # Shadcn/Radix base components
├── Cards/        # Product, restaurant, cart item cards
├── auth/         # Login/signup form components
├── home/         # Home page sections
├── InnerPages/   # Shared inner page components
└── Layout.jsx    # Main layout with header/footer
```

### Path Alias

Use `@/` for imports from `src/`:
```javascript
import { Button } from "@/components/ui/button";
```

### UI Stack

- Tailwind CSS 4 with shadcn/ui components (new-york style)
- Lucide React for icons
- React Toastify for notifications
- SweetAlert2 for modals
- Swiper for carousels

### Image Handling

Use `processImageUrl()` from `@/lib/utils.js` - handles API images, static assets, and absolute URLs with fallback support.

### Dev Server Proxy

Vite proxies `/api` requests to `VITE_API_BASE_URL` in development, stripping the `/api` prefix. Production builds make direct API calls.
