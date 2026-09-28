# 🎓 Academic Portfolio & Faculty CMS

> A production-grade, self-manageable personal academic portfolio website and administrative Content Management System (CMS) designed for university faculty and researchers. 
> 
> Originally engineered with authentic academic data for **Dr. Abhishek Rajput** (Assistant Professor, Department of Civil Engineering, Indian Institute of Technology Indore).

---

## 🌟 Key Highlights & Philosophy

- **100% Self-Manageable via CMS**: The professor can update bio, publications, research themes, grants, teaching schedule, research scholars, awards, news announcements, and downloadable CV without touching code or redeploying.
- **Strict Draft / Publish Data Isolation**: Content in draft state is never exposed to public API endpoints or client views.
- **True Academic Credibility & Aesthetic**: Built with refined typography (merging clean sans-serif interfaces with serif academic headings), institutional color palettes (emerald green, slate, dark navy), DOI citations, BibTeX export modal, and zero distracting gimmicks.
- **High Performance & Accessibility**: Next.js 16 App Router with Incremental Static Regeneration (`revalidate = 60`), SSR, and WCAG AA accessibility compliance.
- **Relational PostgreSQL & Prisma ORM**: Structured relational schema representing authentic academic entities with relational integrity.

---

## 🏗️ Architecture & Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Components & Client Boundaries)
- **Language**: TypeScript (Strict Mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database**: PostgreSQL 14+ (Local, Supabase, Neon, or Railway)
- **ORM**: [Prisma ORM 6.19](https://www.prisma.io/)
- **Authentication**: Stateless JWT session cookies via `jose` with `bcryptjs` password hashing and Edge Route Middleware (`src/middleware.ts`)
- **Validation**: [Zod](https://zod.dev/) schemas on all admin endpoints
- **Storage Layer**: Pluggable storage abstraction (`LocalStorageProvider` with extensible AWS S3 / Cloudinary adapters)

---

## 📂 Project Structure

```
porf_portfolio/
├── prisma/
│   ├── schema.prisma              # 12 relational models
│   └── seed.ts                    # Authentic IIT Indore faculty seed data
├── public/
│   └── uploads/                   # Local file storage for PDFs, CV, avatars
├── src/
│   ├── app/
│   │   ├── (public)/              # Public academic portal routes
│   │   │   ├── layout.tsx         # Shared academic navbar & footer
│   │   │   ├── page.tsx           # Academic Home & Overview
│   │   │   ├── about/page.tsx     # Biography, Education & Positions
│   │   │   ├── research/page.tsx  # Research Areas & Themes
│   │   │   ├── publications/page.tsx # Publications with dynamic filtering & BibTeX
│   │   │   ├── projects/page.tsx  # Sponsored Research & Industrial Projects
│   │   │   ├── teaching/page.tsx  # Current & Past Courses
│   │   │   ├── students/page.tsx  # Ph.D. Scholars, M.Tech, Interns & Alumni
│   │   │   ├── awards/page.tsx    # Honors, Awards, Fellowships
│   │   │   ├── news/page.tsx      # Announcements & Group Updates
│   │   │   ├── cv/page.tsx        # Curriculum Vitae view & download
│   │   │   └── contact/page.tsx   # Office hours, lab location, map info
│   │   ├── admin/                 # Faculty Admin CMS
│   │   │   ├── login/page.tsx     # Secure admin login
│   │   │   └── (cms)/             # Protected admin panel
│   │   │       ├── layout.tsx     # CMS sidebar & header
│   │   │       ├── dashboard/     # Quick metrics & action shortcuts
│   │   │       ├── profile/       # Edit bio, titles, links, education, positions
│   │   │       ├── publications/  # Add/edit journal papers, BibTeX, DOI
│   │   │       ├── research/      # Manage research themes & descriptions
│   │   │       ├── projects/      # Manage sponsored grants & funding agencies
│   │   │       ├── teaching/      # Manage courses, syllabi, office hours
│   │   │       ├── students/      # Manage student roster & alumni
│   │   │       ├── awards/        # Manage awards & recognitions
│   │   │       ├── news/          # Manage news & lab notices
│   │   │       ├── cv/            # Manage CV document & timestamps
│   │   │       └── settings/      # Site branding, footer, analytics
│   │   ├── api/
│   │   │   ├── auth/              # login, logout, me
│   │   │   ├── admin/             # 13 secure CMS CRUD API endpoints
│   │   │   └── public/            # Public search & filtering API
│   │   ├── robots.ts              # SEO search engine directives
│   │   └── sitemap.ts             # XML Sitemap generator
│   ├── components/
│   │   ├── admin/                 # Admin CMS reusable components
│   │   ├── icons/                 # Custom SVG icons (LinkedIn, GitHub, etc.)
│   │   └── public/                # Public academic cards, filters & headers
│   ├── lib/
│   │   ├── auth.ts                # Session management & JWT
│   │   ├── prisma.ts              # Prisma singleton instance
│   │   ├── storage.ts             # Storage provider abstraction
│   │   └── validators.ts          # Zod schemas
│   ├── middleware.ts              # Route protection middleware
│   └── services/
│       └── academic-service.ts    # Public data access layer (status: 'PUBLISHED')
└── scripts/
    └── verify-system.ts           # Automated end-to-end sanity verification
```

---

## ⚡ Quick Start

### 1. Prerequisites
- Node.js 18+ (Node.js 20+ recommended)
- PostgreSQL running locally or in the cloud (e.g. port 5432)

### 2. Environment Setup
Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/professor_portfolio?schema=public"
AUTH_SECRET="your-super-secret-random-jwt-key-min-32-chars-long"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
STORAGE_PROVIDER="local"
```

### 3. Initialize Database & Seed
```bash
# Push schema migrations to PostgreSQL
npx prisma db push

# Seed initial authentic academic data & admin account
npx tsx prisma/seed.ts
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Default Admin Credentials

To access the faculty administration dashboard:
- **URL**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Email**: `admin@iiti.ac.in`
- **Password**: `Admin@12345`

*(The professor can change these credentials directly in the CMS Settings or Profile page).*

---

## 🧪 Automated Verification Test

Run the comprehensive end-to-end verification script:
```bash
npx tsx scripts/verify-system.ts
```
This tests:
1. Database connectivity & initial record seeding
2. Authentication, password verification, and JWT encryption/decryption
3. Public data access isolation (only `status: 'PUBLISHED'` returned)
4. Dynamic draft isolation (draft creation -> public exclusion -> publish -> public inclusion -> clean deletion)
5. All 12 entity models and queries

---

## 🚢 Production Deployment

### Option A: Vercel + Supabase / Neon
1. Create a cloud PostgreSQL database on [Supabase](https://supabase.com) or [Neon](https://neon.tech).
2. Set the `DATABASE_URL` environment variable in Vercel to your cloud database connection string.
3. Add `AUTH_SECRET` and `NEXT_PUBLIC_SITE_URL`.
4. Run `npx prisma db push` and `npx tsx prisma/seed.ts` against your cloud database.
5. Deploy to Vercel via Git repository integration.

### Option B: Self-Hosted Docker / Node.js
```bash
npm run build
npm start
```
The application runs as a production HTTP server on port 3000.

---

## 📄 License
Released for academic and institutional portfolio use.
