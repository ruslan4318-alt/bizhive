# BIZHIVE — Internal Dashboard

Platform internal BIZHIVE untuk tracking project e-commerce, input metrik harian/bulanan, dan generate laporan performa klien.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: Tailwind CSS
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🚀 Setup Lokal (untuk Developer Baru)

### 1. Clone Repository
```bash
git clone https://github.com/ruslan4318-alt/bizhive.git
cd bizhive
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
```bash
# Copy template
cp .env.example .env.local
```
Lalu isi `.env.local` dengan credentials Supabase yang diberikan oleh owner project.

### 4. Setup Database (jika belum ada)
Buka [Supabase SQL Editor](https://supabase.com/dashboard) dan jalankan file:
- `supabase-setup.sql` — Schema website publik
- `supabase-dashboard-setup.sql` — Schema internal dashboard

### 5. Jalankan Dev Server
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000)

---

## 📁 Struktur Project

```
bizhive/
├── app/
│   ├── (publik)        # Website publik bizhiveid.com
│   │   ├── clients/
│   │   ├── news/
│   │   └── services/
│   ├── dashboard/      # Internal dashboard (login required)
│   │   ├── page.tsx           # Overview & stats
│   │   ├── projects/          # Manajemen project
│   │   ├── update/            # Input data Shopee & TikTok
│   │   ├── reports/           # Generate & export laporan
│   │   └── settings/          # Manajemen brand
│   └── admin/          # Admin CMS (website publik)
├── components/
│   ├── dashboard/      # Komponen dashboard
│   └── ...             # Komponen website publik
├── lib/
│   ├── auth.ts         # Helper autentikasi
│   ├── supabase/       # Supabase client
│   └── types/          # TypeScript types
├── supabase-setup.sql          # Schema DB publik
└── supabase-dashboard-setup.sql # Schema DB dashboard
```

---

## 🔑 Akses yang Dibutuhkan

Minta ke owner project:

| Akses | Keterangan |
|-------|-----------|
| `.env.local` credentials | Supabase URL & Anon Key |
| Supabase Dashboard | Invite via email di Settings → Team |
| Vercel | Invite via email di Project → Settings → Members |
| GitHub | Invite sebagai Collaborator di repo settings |

---

## 🌐 Deployment

Project di-deploy otomatis ke Vercel setiap kali ada push ke branch `main`.

```bash
git add .
git commit -m "feat: deskripsi perubahan"
git push origin main
```

Vercel akan auto-build dan deploy dalam ~2 menit.

**Live URL**: [bizhiveid.com](https://bizhiveid.com)

---

## 📊 Fitur Dashboard

- **Overview** — Stats project, deadline terdekat, workload PIC
- **Projects** — Buat & kelola project per brand + divisi (Ads, CC, Affiliate, KOL)
- **Update Data** — Input metrik Shopee Daily, Shopee Monthly, TikTok
- **Reports** — Filter & export data ke CSV
- **Settings** — Manajemen brand klien

---

## 🔐 Login Dashboard

Akses dashboard di `/dashboard`. Login menggunakan email & password yang terdaftar di Supabase Auth (dibuat oleh admin).
