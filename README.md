# BIZHIVE - Marketing Agency Website

A modern, professional company website for BIZHIVE - an e-commerce marketing agency specializing in Shopee and TikTok Shop.

## Tech Stack

- **Frontend**: Next.js 14 (App Router) with TypeScript
- **Backend**: Supabase (PostgreSQL)
- **Styling**: CSS Modules (vanilla CSS)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   - Copy `.env.local` and update with your Supabase credentials if needed

3. Set up Supabase database:
   - Open your Supabase project
   - Go to SQL Editor
   - Run the queries in `supabase-setup.sql`

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
bizhive/
├── app/
│   ├── layout.tsx          # Root layout with fonts & SEO
│   ├── page.tsx             # Homepage
│   ├── globals.css          # Global styles & design tokens
│   └── news/
│       ├── page.tsx         # News listing
│       └── [slug]/
│           └── page.tsx     # News detail
├── components/
│   ├── Header.tsx           # Navigation header
│   ├── Footer.tsx           # Site footer
│   ├── Hero.tsx             # Hero section
│   ├── WhyBizhive.tsx       # About section
│   ├── Services.tsx         # Services grid
│   ├── Studios.tsx          # Studios showcase
│   ├── Clients.tsx          # Client logos
│   ├── Metrics.tsx          # Key metrics
│   ├── NewsPreview.tsx      # News preview for homepage
│   └── FinalCTA.tsx         # Final call-to-action
├── lib/
│   └── supabase.ts          # Supabase client
└── public/
    └── images/              # Static images
```

## Deployment to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

## Customization

### Contact Information
Update the WhatsApp number and email addresses in:
- `components/Hero.tsx`
- `components/FinalCTA.tsx`
- `components/Footer.tsx`

### Client Logos
Replace the placeholder logos in `components/Clients.tsx` with actual client logo images.

### Studio Images
Add studio images to `public/images/` and update `components/Studios.tsx`.

## License

Private - BIZHIVE
