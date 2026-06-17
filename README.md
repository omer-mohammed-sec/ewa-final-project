# Agaseke Heritage Market (E-Commerce Platform)

An advanced e-commerce web application designed to connect Rwandan handicraft artisans and women weavers' cooperatives directly with domestic and international buyers. Built as a decoupled multi-service project for the course **EWA408510 – E-Commerce and Web Application** at the **University of Lay Adventists of Kigali (UNILAK)**.

---

## 🚀 Decoupled System Architecture

The project is structured into separate frontend and backend directories for clean modularity, security, and independent scalability:

```text
/
├── backend/                  # REST API Server & Database ORM (Port 5000)
│   ├── prisma/               # PostgreSQL schema & initial data seed
│   ├── server.js             # Express application endpoints
│   └── Dockerfile            # Container definition for backend
│
├── frontend/                 # Client UI Web App (Port 3000)
│   ├── src/                  # Next.js pages, CSS, layouts, context
│   ├── public/               # Product image photographs and icons
│   └── Dockerfile            # Container definition for frontend
│
├── docker-compose.yml        # Multi-service container orchestrator
└── .github/workflows/ci-cd.yml # Continuous Integration build pipeline
```

---

## ✨ Core Features & Grading Items

### 1. User Interface (UI/UX)
- **Rwandan Nature Palette**: Beautiful, customized styling system using a forest green, ochre gold, volcanic terracotta, and cream linen design theme.
- **Mobile-Responsive**: Fluid grid layouts, interactive sidebar drawer menus, and mobile-friendly navigations tailored for screens of all sizes.

### 2. Product Management
- **Artisan Catalog**: Dynamic search and filtering by categories (*Baskets, Art, Coffee, Accessories*).
- **Product Details View**: Individual pages for products detailing description, seller cooperatives, and real-time stock limits.

### 3. Shopping Cart System
- **Calculations**: Live updates of subtotals, standard 18% Rwandan VAT tax additions, and final grand totals.
- **Cart Persistence**: Automatically synchronizes items with browser `localStorage`, keeping items in the cart even if the customer refreshes the page.

### 4. Checkout & Order Processing
- **Delivery Form**: Form gathering name, phone, email, district, and shipping address.
- **Atomic Database Transactions**: Submitting order data executes a multi-table database transaction that registers the customer, commits the order, adds order line items, and decrements product inventory. If one step fails, the database safely rolls back.

### 5. Localized Payment Integration (Innovation Item)
- **USSD MoMo Simulator**: An interactive mobile carrier USSD simulation overlay mimics a physical phone prompt, prompting for a 4-digit PIN (demo: `1234`) to authorize the Mobile Money (MTN MoMo/Airtel) transactions.

### 6. Admin Analytics Portal
- **Business Dashboard**: Displays aggregate metrics (Total revenue, completed orders, average order ticket size).
- **Geographical Distribution**: Visual progress indicators demonstrating order density by Rwandan provinces.
- **Category Sales Volume**: Renders custom SVG bar charts showing sales volume per category.
- **Order Pipeline Manager**: Managers can update order states (Pending, Paid, Shipped, Delivered) using interactive dropdown elements.

### 7. AI Recommendation Engine (Innovation Item)
- **Text-Similarity Calculations**: Runs a Jaccard text similarity calculation on Server Components, comparing descriptions and category matching weights to recommend the top 3 similar products to cross-sell to customers.

---

## 🛠️ Installation & Local Setup

### Prerequisites
- Node.js (v20+)
- PostgreSQL Database

### Option A: Running Locally (Standalone)

#### 1. Setup Backend
1. Navigate to backend: `cd backend`
2. Install packages: `npm install`
3. Configure database url in `.env` file:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/agaseke?schema=public"
   PORT=5000
   ```
4. Push database schema and seed products:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```
5. Run server: `npm start`

#### 2. Setup Frontend
1. Navigate to frontend: `cd ../frontend`
2. Install packages: `npm install`
3. Configure environment variables in `.env`:
   ```env
   BACKEND_API_URL="http://localhost:5000/api"
   NEXT_PUBLIC_API_URL="http://localhost:5000/api"
   ```
4. Run frontend: `npm run dev` (Runs on `http://localhost:3000`)

---

### Option B: Running with Docker Compose (Orchestrated)

Ensure Docker Desktop is open and running, then execute from the root directory:

1. Build and boot services:
   ```bash
   docker compose up --build
   ```
2. This automatically sets up:
   - PostgreSQL Database (`agaseke-db` on port 5432)
   - Express REST API (`agaseke-backend` on port 5000)
   - Next.js Web App (`agaseke-web` on port 3000)
   - Auto-runs Prisma database schema pushes and product seeds.

---

## ⚙️ DevOps: CI/CD Pipeline

The repository utilizes **GitHub Actions** (`.github/workflows/ci-cd.yml`) to validate every commit:
1. Installs node dependencies for both services independently.
2. Checks syntax quality utilizing ESLint on frontend modules.
3. Generates Prisma clients inside backend compiler contexts.
4. Performs mock Next.js production builds.
5. Verifies container compilation integrity by running dry builds of both backend and frontend Dockerfiles.
