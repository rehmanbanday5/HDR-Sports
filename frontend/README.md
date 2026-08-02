# HDR Cricket — Frontend

React (Vite) + Tailwind CSS storefront and admin panel. See the root `README.md` (one level up) for full
project setup instructions.

## Quick start

```bash
npm install
cp .env.example .env   # set VITE_API_URL if your backend isn't on localhost:5000
npm run dev             # http://localhost:5173
```

## Build for production

```bash
npm run build   # outputs to dist/
npm run preview # preview the production build locally
```

## Structure

- `src/api/client.js` — Axios instance (attaches JWT + guest cart ID to every request)
- `src/context/` — Auth and Cart React context providers
- `src/components/` — shared UI (Navbar, Footer, ProductCard, route guards, etc.)
- `src/pages/` — customer-facing pages
- `src/pages/admin/` — admin dashboard, product/category/order/customer management
