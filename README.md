# Ethara Task Manager

A complete production-ready full-stack collaborative task management SaaS application featuring a visually exceptional, futuristic, premium red and black design.

## Features

- **Authentication**: JWT-based login and registration with Role-Based Access Control (Admin/Member).
- **Dashboard Command Center**: Real-time analytics, task completion charts, and weekly productivity metrics.
- **Project Hub**: Create, edit, and track projects with a visually stunning glassmorphism grid.
- **Kanban Task Board**: Drag-and-drop interface for task progression using `@hello-pangea/dnd`.
- **Squad Directory**: Interactive 3D tilt cards displaying team member statistics and live status.
- **User Profiles**: Editable profiles with circular progress trackers, timeline activity, and skill tags.
- **Cinematic Portfolio**: Integrated owner portfolio with 3D backgrounds, typing effects, and scroll animations.

## Tech Stack

**Frontend**
- Next.js 15+ (App Router)
- TypeScript
- Tailwind CSS v4
- Framer Motion
- React Three Fiber / Drei
- ShadCN-inspired Custom UI
- Zustand
- React Hook Form & Zod
- Recharts

**Backend**
- Node.js & Express.js
- TypeScript
- Prisma ORM
- PostgreSQL (SQLite for local dev)
- JWT Authentication & bcrypt
- Helmet & Express Rate Limit

## Architecture

The application uses a Monorepo-style structure split into two directories:
- `/frontend`: Next.js web client.
- `/backend`: Express.js API server.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm or yarn

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (`.env`):
   ```env
   DATABASE_URL="file:./dev.db" # For local development
   PORT=5000
   JWT_SECRET="your_super_secret_key"
   JWT_EXPIRES_IN="7d"
   CLIENT_URL="http://localhost:3000"
   ```
4. Initialize the database and run migrations:
   ```bash
   npx prisma migrate dev --name init
   ```
5. Seed the database with demo accounts:
   ```bash
   npm run seed
   ```
   **Demo Credentials:**
   - Admin: `admin@ethara.com` / `Admin@123`
   - Member: `member@ethara.com` / `Member@123`

6. Start the backend development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (`.env.local`):
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:5000/api"
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Backend (Railway)
1. Push your code to GitHub.
2. Create a new project on [Railway](https://railway.app/).
3. Add a PostgreSQL database service.
4. Add a Node.js service pointing to the `backend` folder in your repository.
5. In the Node.js service settings, add the following environment variables:
   - `DATABASE_URL` (Connection string from the PostgreSQL service)
   - `PORT` (e.g., 5000)
   - `JWT_SECRET`
   - `CLIENT_URL` (Your Vercel frontend URL)
6. Add a custom start command if necessary: `npm run start` (make sure to build `tsc` first in your build step or use `ts-node`).

### Frontend (Vercel)
1. Import your GitHub repository to [Vercel](https://vercel.com/).
2. Set the Framework Preset to Next.js.
3. Set the Root Directory to `frontend`.
4. Add the following environment variable:
   - `NEXT_PUBLIC_API_URL` (Your Railway backend URL, e.g., `https://ethara-api.up.railway.app/api`)
5. Click Deploy.

## Future Improvements
- Implement WebSocket/Socket.io for live real-time updates across the Kanban board.
- Integrate Cloudinary or AWS S3 for profile avatar uploads.
- Add comprehensive E2E testing with Cypress or Playwright.
