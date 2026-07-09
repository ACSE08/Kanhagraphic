# Kanha Graphics Website

A full-featured, responsive website for **Kanha Graphics** — printing and design services in Vadodara, Gujarat.

## Features

- **Home** — Hero, services showcase, instant price calculator, flyer images
- **Services** — Detailed printing & design service pages
- **Place Order** — Service selection, quantity, file upload (Corel Draw), instant blister pricing
- **Login / Sign Up** — Customer accounts with secure JWT authentication
- **Dashboard** — Track all orders with status progress
- **Order Details** — Full order info, WhatsApp integration, file download
- **Contact** — Contact form, map, phone/email/WhatsApp links
- **SEO** — Meta tags, Open Graph, sitemap, robots.txt, JSON-LD structured data

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- Prisma + SQLite
- JWT authentication (jose + bcrypt)

## Getting Started

```bash
cd kanha-graphics
npm install
npm run db:push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Copy `.env` and update for production:

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secure-secret-here"
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"

# Owner notifications (new orders)
NOTIFY_OWNER_ON_NEW_ORDER="true"
OWNER_NOTIFICATION_EMAIL="info.kanhagraphic0701@gmail.com"

# SMTP provider (required for email alerts)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="Kanha Graphics <your-email@gmail.com>"

# Optional: webhook alert (Slack/Make/Zapier/custom endpoint)
ADMIN_WEBHOOK_URL=""
```

## Production Build

```bash
npm run build
npm start
```

## Business Contact

- **Karan Suthar** — +91 966 233 0701
- **Email** — info.kanhagraphic0701@gmail.com
- **GSTN** — 24DFRPS6567D1ZV
