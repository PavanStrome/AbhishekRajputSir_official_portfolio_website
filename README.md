# 🎓 Academic Portfolio & Faculty CMS

> **Official Personal Academic Portfolio and Self-Manageable Faculty CMS**  
> Engineered for **Dr. Abhishek Rajput** (Department of Mechanical Engineering, Indian Institute of Technology Indore).

---

## 📑 Table of Contents

1. [Project Overview & Handover Notes](#-project-overview--handover-notes)
2. [Key Highlights & Architecture](#-key-highlights--architecture)
3. [Prerequisites](#-prerequisites)
4. [Environment Variables Guide (.env)](#-environment-variables-guide-env)
5. [Step-by-Step Setup Guide](#-step-by-step-setup-guide)
6. [Production Deployment Options](#-production-deployment-options)
   - [Option A: Cloud Serverless (Vercel + Supabase / Neon)](#option-a-cloud-serverless-vercel--supabase--neon)
   - [Option B: Institutional Campus Server (Ubuntu / Linux VM with PM2 & NGINX)](#option-b-institutional-campus-server-ubuntu--linux-vm-with-pm2--nginx)
   - [Option C: Docker Container](#option-c-docker-container)
7. [Faculty Admin CMS & Login](#-faculty-admin-cms--login)
8. [🎨 Academic Design Architecture (900 Combinations)](#-academic-design-architecture-900-combinations)
9. [Troubleshooting & Frequently Asked Questions (FAQ)](#-troubleshooting--frequently-asked-questions-faq)

---

## 🏛️ Project Overview & Handover Notes

This repository contains the complete personal academic portal and administrative **Content Management System (CMS)** for **Dr. Abhishek Rajput**, Associate Professor at **IIT Indore**.

### For the IIT Indore Academic Office / IT Administration:
- **Zero Ongoing Code Changes Required**: The professor and department coordinators can update all content (biography, research projects, publications, sponsored grants, student scholars, teaching schedules, awards, news, and CV PDF) directly via a web-based CMS interface.
- **Independent Design Engine**: The website features a built-in appearance system with **30 academic color themes** and **30 typography font pairings** (900 unique combinations) that can be previewed live and activated with **1 click**.
- **Secure Transactional Authentication**: Password resets are strictly dispatched via email (SMTP) with single-use, 15-minute cryptographically signed tokens. No reset links or sensitive credentials are ever exposed on the public web.
- **Authentic Seed Data Included**: The project includes complete authentic data (7 international journal papers, 4 research themes, ₹1.45+ Cr sponsored grants from DST-SERB/ARDB/ISRO, 4 courses, and 7 lab students) ready to deploy out-of-the-box.

---

## 🌟 Key Highlights & Architecture

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, React 19, Server Components & Streaming)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with dynamic CSS variable injection for themes
- **Database**: PostgreSQL (Prisma ORM 6.19 with 12 relational models)
- **Authentication**: Stateless, cryptographically signed JWT cookies via `jose` and `bcryptjs`
- **Email Delivery**: Transactional SMTP integration via `nodemailer` (Google Workspace / Gmail / Campus SMTP)
- **Typography**: Google Fonts CDN with high-performance CSS variable binding (`--font-heading`, `--font-body`)

---

## 💻 Prerequisites

Before running or deploying the application, ensure the host machine has:

| Requirement | Minimum Version | Recommended | Notes |
| :--- | :--- | :--- | :--- |
| **Node.js** | `v18.17.0+` | `v20.x` or `v22.x` (LTS) | Download from [nodejs.org](https://nodejs.org/) |
| **npm** | `v9.x+` | `v10.x+` | Bundled with Node.js |
| **PostgreSQL** | `v14+` | `v16+` | Local database or cloud-hosted (Supabase, Neon, etc.) |
| **Git** | `v2.x+` | Latest | For cloning and version control |

To check your installed versions, open a terminal and run:
```bash
node -v
npm -v
git -v
```

---

## 📋 Environment Variables Guide (.env)

The application requires a `.env` file in the project root directory. An annotated `.env.example` file is provided in this repository.

### Quick Copy:
```bash
# On Linux / macOS / Git Bash:
cp .env.example .env

# On Windows PowerShell:
Copy-Item .env.example .env
```

### Complete Variable Reference Table

| Variable Name | Required? | Example / Default Value | Purpose & Detailed Explanation |
| :--- | :---: | :--- | :--- |
| `DATABASE_URL` | **Yes** | `postgresql://user:pass@localhost:5432/portfolio?schema=public` | Connection URL for your PostgreSQL database. Supports local PostgreSQL, Supabase, Neon, or campus databases. |
| `AUTH_SECRET` | **Yes** | `c8f7a9e1d2b3c4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9` | Secret encryption key used to sign session cookies. Must be a secure string of at least 32 characters. |
| `NEXT_PUBLIC_APP_URL` | **Yes** | `http://localhost:3000` *(Local)*<br>`https://dr-abhishek-rajput.iiti.ac.in` *(Prod)* | The root URL where your website is hosted. Used to generate absolute URLs in password reset emails and SEO meta tags. Do not add a trailing slash. |
| `SMTP_HOST` | **Recommended** | `smtp.gmail.com` | Outgoing email server hostname for sending transactional password reset emails. |
| `SMTP_PORT` | **Recommended** | `465` (SSL) or `587` (TLS) | Network port for your SMTP server. Use `465` for SSL, or `587` for TLS/STARTTLS. |
| `SMTP_SECURE` | **Recommended** | `true` (for port 465) or `false` (for port 587) | Set to `true` if connecting over port 465; set to `false` for port 587. |
| `SMTP_USER` | **Recommended** | `faculty.email@gmail.com` | Email address used to authenticate with your SMTP email provider. |
| `SMTP_PASS` | **Recommended** | `xxxx xxxx xxxx xxxx` | 16-character Google App Password (for Gmail) or SMTP password (see instructions below). |
| `SMTP_FROM` | **Recommended** | `"Dr. Abhishek Rajput Academic Portal" <no-reply@iiti.ac.in>` | The sender identity displayed in the recipient's inbox. |
| `STORAGE_TYPE` | Optional | `local` | Where uploaded files (e.g. CV PDF, research figures) are saved. Defaults to `local` (`public/uploads/`). |
| `ADMIN_RECOVERY_KEY` | Optional | `rajput-academic-recovery-master-key-2026` | Emergency administrative recovery key for institutional disaster recovery. |

---

### 🔑 How to Configure Sensitive Keys

#### 1. Generating a Secure `AUTH_SECRET`
Run this one-liner command in your terminal to generate a random 32-character secret:

- **Linux / macOS / Git Bash:**
  ```bash
  openssl rand -base64 32
  ```
- **Windows PowerShell:**
  ```powershell
  [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
  ```
Copy the generated string and paste it as `AUTH_SECRET="your-generated-string"` in `.env`.

---

#### 2. Generating a Google App Password for Email (Gmail SMTP)
> [!IMPORTANT]
> If using Gmail for `SMTP_USER`, Google **does not allow** your standard account password for automated server scripts. You must generate a dedicated **16-character Google App Password**.

1. Log into your Google Account and navigate to **Security**: [myaccount.google.com/security](https://myaccount.google.com/security).
2. Ensure **2-Step Verification** is turned **ON**.
3. Go directly to **App Passwords**: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).
4. Enter an application name (e.g., `Academic Portfolio CMS`) and click **Create**.
5. Google will display a 16-character code (e.g., `abcd efgh ijkl mnop`).
6. Copy this code and paste it into your `.env` file as `SMTP_PASS="abcd efgh ijkl mnop"`.

---

#### 3. Database URL Formats (`DATABASE_URL`)
- **Local PostgreSQL:**
  ```env
  DATABASE_URL="postgresql://postgres:your_password@localhost:5432/professor_portfolio?schema=public"
  ```
- **Supabase (Free Cloud PostgreSQL):**
  ```env
  DATABASE_URL="postgresql://postgres.yourprojectref:yourpassword@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
  ```
- **Neon (Free Serverless PostgreSQL):**
  ```env
  DATABASE_URL="postgresql://neondb_owner:yourpassword@ep-sample-123456.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
  ```

---

## ⚡ Step-by-Step Setup Guide

Follow these 5 simple steps to get the portal running locally or on a test server:

### Step 1: Clone the Repository
```bash
git clone https://github.com/PavanStrome/AbhishekRajputSir_official_portfolio_website.git
cd AbhishekRajputSir_official_portfolio_website
```

### Step 2: Install Project Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Copy `.env.example` to `.env` and fill in your database connection string and secret keys:
```bash
cp .env.example .env
```

### Step 4: Synchronize Database & Seed Authentic Data
Run Prisma to create all required database tables and populate authentic academic data (bio, 7 publications, grants, courses, students, awards, and default admin account):
```bash
# Push database schema to PostgreSQL
npx prisma db push

# Seed initial authentic IIT Indore faculty data
npx tsx prisma/seed.ts
```

### Step 5: Start the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser:
- **Public Portal**: [http://localhost:3000](http://localhost:3000)
- **Faculty Admin CMS**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Design Explorer**: [http://localhost:3000/design-preview](http://localhost:3000/design-preview)

---

## 🚢 Production Deployment Options

### Option A: Cloud Serverless (Vercel + Supabase / Neon)
*Recommended for zero server maintenance, automatic SSL, and instant global CDN.*

1. **Database Setup**:
   - Create a free PostgreSQL instance on [Supabase](https://supabase.com) or [Neon](https://neon.tech).
   - Copy the connection string.
2. **Deploy to Vercel**:
   - Push your repository to GitHub or GitLab.
   - Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
   - Import your repository.
3. **Add Environment Variables**:
   In the Vercel project settings, configure:
   - `DATABASE_URL` (your Supabase/Neon connection string)
   - `AUTH_SECRET` (generated 32+ character key)
   - `NEXT_PUBLIC_APP_URL` (`https://your-custom-domain.com` or Vercel URL)
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `SMTP_SECURE`
4. **Initialize Database Tables**:
   From your local terminal with your production `DATABASE_URL` set in `.env`:
   ```bash
   npx prisma db push
   npx tsx prisma/seed.ts
   ```
5. Click **Deploy** in Vercel. Your site is live!

---

### Option B: Institutional Campus Server (Ubuntu / Linux VM with PM2 & NGINX)
*Recommended for hosting directly on IIT Indore campus infrastructure under an institutional domain like `https://dr-abhishek-rajput.iiti.ac.in`.*

#### 1. Server Prerequisites
On your Ubuntu/Debian server:
```bash
sudo apt update && sudo apt install -y nodejs npm postgresql postgresql-contrib nginx
sudo npm install -g pm2
```

#### 2. Setup Project & Build
```bash
git clone https://github.com/PavanStrome/AbhishekRajputSir_official_portfolio_website.git /var/www/faculty-portfolio
cd /var/www/faculty-portfolio

npm install
cp .env.example .env
nano .env  # Enter your production campus DATABASE_URL, AUTH_SECRET, SMTP, etc.

npx prisma db push
npx tsx prisma/seed.ts

npm run build
```

#### 3. Run with PM2 Process Manager
```bash
pm2 start npm --name "faculty-portfolio" -- start
pm2 save
pm2 startup
```

#### 4. Configure NGINX Reverse Proxy
Create `/etc/nginx/sites-available/faculty-portfolio`:
```nginx
server {
    listen 80;
    server_name dr-abhishek-rajput.iiti.ac.in;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
Enable the configuration and reload NGINX:
```bash
sudo ln -s /etc/nginx/sites-available/faculty-portfolio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 5. Install Free SSL Certificate (Certbot / Let's Encrypt)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d dr-abhishek-rajput.iiti.ac.in
```

---

### Option C: Docker Container
Build and run via Docker:
```bash
# Build the production Docker image
docker build -t academic-portfolio:latest .

# Run the container mapping port 3000
docker run -d --name faculty-cms -p 3000:3000 --env-file .env academic-portfolio:latest
```

---

## 🔐 Faculty Admin CMS & Login

### Default Credentials
Upon running `npx tsx prisma/seed.ts`, the default administrator account is initialized:

- **Login URL**: `https://your-domain/admin/login`
- **Default Email**: `admin@iiti.ac.in`
- **Default Password**: `Admin@12345`

> [!TIP]
> **Recommended First Action:**  
> Log into the Admin CMS at `/admin/login`, navigate to **"3. Website Info & Text"** (or `/admin/settings?tab=general`), and update your **Admin Display Name**, **Login Email**, and **Password** to your personal credentials.

---

### Secure Password Reset Flow (`/admin/forgot-password`)
If the professor forgets their password:
1. Visit `/admin/forgot-password`.
2. Click **"Send Reset Link to Registered Email"**.
3. A secure, single-use reset link valid for **15 minutes** is dispatched strictly to the administrator's email inbox via SMTP.
4. **Security Guarantee:** The reset link is **never** displayed on the screen or sent back in network requests. Only the authorized owner of the email inbox can reset the password.

---

### Admin CMS Modules Overview
The CMS sidebar provides dedicated sections for all aspects of faculty academic life:

```
OVERVIEW
  📊 Dashboard               - Live analytics, citation stats, visitor counts, and quick shortcuts

CONTENT MANAGEMENT
  👤 Profile & Bio           - Designation, department, affiliations, education history, appointments
  🔬 Research Areas          - 4 research themes, descriptions, icon badges, and methodologies
  📚 Publications            - 7 indexed journal publications with DOI, BibTeX exporter, and citations
  💼 Projects & Grants       - ₹1.45+ Cr sponsored grants (DST-SERB, ARDB, ISRO) with funding badges
  🎓 Teaching & Courses      - UG and PG courses, syllabi, credits, office hours, and classroom portals
  👥 Research Group          - PhD scholars, MTech researchers, undergraduate interns, and alumni
  🎖️ Awards & Honors         - National/international awards, academy fellowships, and recognitions
  🔔 News & Alerts           - Conference announcements, group updates, and lab openings
  📄 Curriculum Vitae        - Upload and manage official downloadable PDF CV

PREFERENCES & APPEARANCE
  🎨 Color & Themes (30)     - Interactive preview & 1-click apply across 30 academic color palettes
  🔤 Typography & Fonts (30)  - Interactive preview & 1-click apply across 30 typography font styles
  ⚙️ Website Info & Text     - General branding, SEO meta tags, public contact email, and admin security
```

---

## 🎨 Academic Design Architecture (900 Combinations)

The website features an independent, modular design system where any **color palette** and any **font pairing** can be mixed and matched (30 × 30 = **900 unique combinations**) and activated with **1 click**.

### Pinned Favorites:
1. 📌 **Warm Cream & Terracotta** (`cream-terracotta`): Classic archival book paper canvas (`#faf7f2`) with warm terracotta bronze accents (`#8a4b2d`).
2. 📌 **Muted Sand & Forest Olive** (`sand-forest`): Organic sand canvas (`#f7f5f0`) with distinguished British racing green accents (`#2d4a3e`).

### Palette Categories:
- **Archival & Editorial (5)**: Warm book papers, parchment, tuscan clay, vellum.
- **Prestigious Universities (6)**: Oxford Navy, Harvard Crimson, Cambridge Cobalt, Imperial Purple, Prussian Blue, Vienna Bordeaux.
- **Modern Minimalist (5)**: Nordic Snow, Notion Sage, Cashmere Noir, Pure Zinc, Alabaster Slate.
- **Earth & Nature (6)**: Kyoto Matcha, Pacific Teal, Autumn Ochre, Desert Agave, Forest Mist, Aegean Sand.
- **Scholarly Night / Dark Mode (8)**: Midnight Emerald, Dark Obsidian Gold, Deep Navy Champagne, Charcoal Copper, Forest Nocturne.

### Typography Categories:
- **Classical & Heritage Serif (8)**: Playfair Display, EB Garamond, Cormorant Garamond, Cinzel, Baskervville.
- **Contemporary & Scientific Serif (8)**: Lora, Merriweather, Spectral, Alegreya, Bitter, Literata, Newsreader.
- **Modern Technical & STEM Sans (8)**: Plus Jakarta Sans, Space Grotesk, Inter, DM Sans, Outfit, Fira Sans.
- **Monospace & Architectural Hybrids (6)**: Space Mono, JetBrains Mono, IBM Plex Sans, Syne, Epilogue.

---

## 🛠️ Troubleshooting & Frequently Asked Questions (FAQ)

### Q1: When running `npm run dev`, it says "Port 3000 is in use".
**Solution:** Another process is using port 3000.  
- **On Windows:** Run `netstat -ano | findstr :3000` to find the Process ID (PID), then run `taskkill /PID <PID> /F`.
- **On Linux / macOS:** Run `lsof -i :3000` and `kill -9 <PID>`.
- Alternatively, run on a different port: `npx next dev -p 3001`.

---

### Q2: Password reset email fails with "SMTP error 535" or "BadCredentials".
**Solution:**  
If using Gmail (`smtp.gmail.com`), Google rejects standard account passwords. You must generate and use a **16-character Google App Password** as described in [How to Configure Sensitive Keys](#2-generating-a-google-app-password-for-email-gmail-smtp).

---

### Q3: How do I backup or export the database?
**Solution:** Use standard PostgreSQL tools:
```bash
# Export complete database backup
pg_dump -U postgres -d professor_portfolio -F c -b -v -f "academic_portfolio_backup.dump"

# Restore database from backup
pg_restore -U postgres -d professor_portfolio -v "academic_portfolio_backup.dump"
```

---

### Q4: How do I re-seed or reset initial academic data?
**Solution:**
```bash
# Push schema and reset
npx prisma db push --force-reset

# Re-seed authentic IIT Indore data
npx tsx prisma/seed.ts
```

---

## 📜 Handover Checklist for Academic Office

- [ ] Node.js 18+ and PostgreSQL installed on the deployment machine.
- [ ] `.env` file created from `.env.example`.
- [ ] Production database connection string specified in `DATABASE_URL`.
- [ ] Secure `AUTH_SECRET` generated and saved.
- [ ] `NEXT_PUBLIC_APP_URL` set to the official institutional URL (`https://dr-abhishek-rajput.iiti.ac.in`).
- [ ] SMTP email credentials configured for automated password resets.
- [ ] `npx prisma db push` and `npx tsx prisma/seed.ts` executed.
- [ ] Initial sign-in completed at `/admin/login`.
- [ ] Default password updated in `/admin/settings?tab=general`.

---

## 📄 License & Attribution

Developed for institutional academic portfolio and faculty management use at the **Indian Institute of Technology Indore**.  
All rights reserved © 2026 Dr. Abhishek Rajput.
