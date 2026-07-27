# ClientGateway

A production-ready SaaS platform for managing invoices, payments, and financial operations.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion 12
- **Database:** SQLite via Prisma 7 + LibSQL adapter
- **Auth:** Custom JWT (jose) + Google OAuth
- **Validation:** Zod v4
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env` and fill in your values:

```bash
DATABASE_URL="file:./dev.db"
SESSION_SECRET="<random-32-byte-base64-string>"
GOOGLE_CLIENT_ID="<your-google-client-id>"
GOOGLE_CLIENT_SECRET="<your-google-client-secret>"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/google/callback"
```

Generate a secure session secret:

```bash
openssl rand -base64 32
```

### Database Setup

```bash
npx prisma db push
npx prisma generate
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build & Production

```bash
npm run build
npm start
```

## Features

- **Authentication:** Email/password + Google OAuth with secure JWT sessions
- **Dashboard:** Real-time financial overview with revenue, invoices, payments, clients
- **Invoices:** Create, manage, and track invoices with line items and tax rates
- **Clients:** Manage client relationships with contact details
- **Payments:** Record and track payments with auto-invoice status updates
- **Settings:** Profile management and account settings
- **Search:** Cmd+K search across all pages
- **Responsive:** Fully responsive on desktop, tablet, and mobile

## Security

- JWT sessions with httpOnly, Secure, SameSite cookies
- Server-side session validation in middleware + DAL
- Input validation with Zod on all server actions
- Rate limiting on login and signup
- Ownership checks on all data operations
- Content-Security-Policy and security headers
- CSRF protection via OAuth state parameter
- No SQL injection risk (Prisma ORM parameterized queries)

## Project Structure

```
src/
├── app/
│   ├── actions/          # Server Actions (auth, clients, invoices, payments)
│   ├── api/              # API routes (search, Google OAuth)
│   ├── dashboard/        # Protected dashboard pages
│   ├── login/            # Login page
│   ├── signup/           # Signup page
│   ├── error.tsx         # Global error boundary
│   └── not-found.tsx     # 404 page
├── components/
│   ├── hero/             # Landing page hero section
│   ├── navbar/           # Navigation bar with auth awareness
│   ├── search/           # Cmd+K search modal
│   └── ui/               # Reusable UI components (Select, GlowEffect)
├── hooks/                # Custom React hooks
├── lib/                  # Utilities, auth, database, validations
└── middleware.ts         # Route protection
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in Vercel dashboard
3. Set environment variables
4. Deploy

### Production Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (switch from SQLite for production) |
| `SESSION_SECRET` | Cryptographically random 32-byte string |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GOOGLE_REDIRECT_URI` | `https://yourdomain.com/api/auth/google/callback` |

## License

Private — ClientGateway

