# GULLY Cricket — Full-Stack E-Commerce Platform

A production-grade MERN e-commerce platform for a cricket sports equipment business, built to serve customers
across Pakistan and internationally.

**Brand:** GULLY — named after the cricket fielding position and Pakistan's beloved "gully cricket" (street
cricket) culture. Palette: pitch green, willow tan, leather red, chalk, gold. Typeset in Fraunces (display) and
Inter (body).

---

## What's included

- **Backend** (`/backend`): Node.js + Express + MongoDB/Mongoose REST API — auth, products, categories, cart,
  orders, admin dashboard, email notifications, image uploads.
- **Frontend** (`/frontend`): React (Vite) + Tailwind CSS — full storefront, cart, checkout, customer accounts,
  and a complete admin panel.

Every core flow is real, working code — not a mockup: browsing → cart → checkout → order creation in MongoDB →
admin sees the order → admin updates status → customer sees the update. Stock decrements atomically at checkout.

### What requires your own credentials to go fully live

These integrations are wired up correctly (env-var driven, no hardcoded secrets) but need real accounts:

| Service | Used for | Get it at |
|---|---|---|
| MongoDB | Database | Local install or [MongoDB Atlas](https://www.mongodb.com/atlas) free tier |
| Cloudinary | Product/category image storage | [cloudinary.com](https://cloudinary.com) free tier |
| SMTP (Gmail/SendGrid/etc.) | Order confirmation & status emails | Any SMTP provider |
| Stripe | International card payments | [dashboard.stripe.com](https://dashboard.stripe.com) |
| JazzCash / EasyPaisa | Local Pakistani mobile wallet payments | Merchant onboarding with the provider |

**Without these configured**, the site still runs fully: images fall back to placeholders, order emails are
logged to the console instead of sent, and Stripe/JazzCash payment methods are structured but would need the
gateway's checkout redirect wired in before going live (see `backend/utils/email.js` and
`backend/controllers/orderController.js` for where to plug in real gateway calls).

---

## Quick start

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env — at minimum set MONGO_URI and JWT_SECRET
npm run seed     # creates categories, sample products, and test accounts
npm run dev      # starts on http://localhost:5000
```

Seeded accounts:
- **Admin:** `admin@gullycricket.com` / `Admin@12345`
- **Customer:** `customer@example.com` / `Customer@123`

If you don't have MongoDB installed locally, the fastest option is a free
[MongoDB Atlas](https://www.mongodb.com/atlas) cluster — copy its connection string into `MONGO_URI`.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # defaults to http://localhost:5000/api, adjust if needed
npm run dev             # starts on http://localhost:5173
```

Visit `http://localhost:5173`. Log in with the admin account and go to `/admin` for the dashboard.

### 3. Production build

```bash
cd frontend && npm run build   # outputs to frontend/dist — deploy to Vercel/Netlify/S3/etc.
cd backend && npm start        # deploy to Render/Railway/EC2/etc., point MONGO_URI at production DB
```

---

## Project structure

```
gully-cricket/
├── backend/
│   ├── config/          # db.js, cloudinary.js
│   ├── controllers/      # auth, products, categories, cart, orders, users, dashboard
│   ├── middleware/       # auth (JWT), error handling, upload (multer), validators
│   ├── models/           # User, Product, Category, Cart, Order
│   ├── routes/
│   ├── utils/             # email service, order helpers, JWT, seed script
│   ├── .env.example
│   └── server.js
└── frontend/
    ├── src/
    │   ├── api/           # axios client
    │   ├── context/       # AuthContext, CartContext
    │   ├── components/    # Navbar, Footer, ProductCard, RouteGuards, etc.
    │   ├── pages/          # Home, Shop, ProductDetail, Cart, Checkout, Profile, Orders...
    │   └── pages/admin/    # AdminLayout, Dashboard, Products, Categories, Orders, Customers
    └── .env.example
```

## Key features by area

**Customers:** browse/search/filter/sort products, variant selection (size/weight/color), guest or logged-in
cart, full checkout with local + international shipping options, COD/bank transfer/card/wallet payment methods,
order tracking by number+email (no login required), account with saved addresses and order history, product
reviews.

**Admin:** dashboard with live sales chart, order/customer/product counts, low-stock alerts, top sellers;
full product CRUD with multi-image upload and variant builder; category management; order management with
status + payment lifecycle and email notifications on change; customer management with per-customer order
history and account activation toggle.

**Security:** bcrypt password hashing, JWT auth with httpOnly cookie option, role-based route protection,
input validation (express-validator), rate limiting, helmet, mongo-sanitize, XSS protection, no secrets in
frontend code.

## Notes on this build environment

This project was built and validated in a sandboxed environment without outbound access to MongoDB's
download servers, so the backend was verified via full syntax checks and a complete module-load smoke test
(every model/controller/route requires cleanly) rather than a live database run. The frontend was verified
with a real production build (`npm run build`) that completed successfully. Run the quick-start steps above
against your own MongoDB instance to see it fully live — the code itself has not been simplified or stubbed
out for any core feature.
