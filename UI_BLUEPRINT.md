# BIZHIVE Website - Frontend / UI Blueprint v2.0

> **Tujuan:** Dokumentasi struktur UI + Navigasi halaman detail  
> **Tanggal:** 2026-02-01  
> **Versi:** 2.0

---

## 🗺️ SITE MAP & NAVIGATION FLOW

```
HOMEPAGE (/)
│
├─── HEADER NAV ──────────────────────────────────────────────────
│    ├── Services ────► /services ────► /services/[slug]
│    ├── Studios ─────► /#studios (scroll only)
│    ├── Clients ─────► /clients ─────► /clients/[slug]
│    └── News ────────► /news ────────► /news/[slug] ✓ EXISTS
│
├─── SERVICES SECTION ────────────────────────────────────────────
│    ├── Store Optimization ───► /services/store-optimization
│    ├── Content Production ───► /services/content-production
│    ├── Affiliate & KOL ──────► /services/affiliate-kol
│    └── Live Streaming ───────► /services/live-streaming
│
├─── CLIENTS SECTION ─────────────────────────────────────────────
│    ├── Brand 1 ──────────────► /clients/brand-1
│    ├── Brand 2 ──────────────► /clients/brand-2
│    └── ... (8 brands total)
│
├─── PERFORMANCE SECTION ─────────────────────────────────────────
│    ├── Case Study 1 ─────────► /case-studies/brand-a-shopee
│    ├── "View All" ───────────► /case-studies
│    └── (Future case studies)
│
└─── NEWS SECTION ────────────────────────────────────────────────
     ├── Article 1 ────────────► /news/[slug] ✓ EXISTS
     └── "View All News" ──────► /news ✓ EXISTS
```

---

## 📄 DAFTAR SEMUA HALAMAN

### Halaman yang SUDAH ADA

| Path           | Status | File                       |
| -------------- | ------ | -------------------------- |
| `/`            | ✅ Ada | `app/page.tsx`             |
| `/news`        | ✅ Ada | `app/news/page.tsx`        |
| `/news/[slug]` | ✅ Ada | `app/news/[slug]/page.tsx` |

### Halaman yang AKAN DIBUAT

| Path                   | Status  | Deskripsi                        |
| ---------------------- | ------- | -------------------------------- |
| `/services`            | 🔲 Baru | Listing semua services           |
| `/services/[slug]`     | 🔲 Baru | Detail per service               |
| `/clients`             | 🔲 Baru | Listing semua clients            |
| `/clients/[slug]`      | 🔲 Baru | Case study per client            |
| `/case-studies`        | 🔲 Baru | Listing performance case studies |
| `/case-studies/[slug]` | 🔲 Baru | Detail per case study            |

---

## BAGIAN 1: HOMEPAGE SECTIONS

---

### 1. HEADER

**File:** `components/Header.tsx`  
**Layout:** Horizontal flex (space-between)

```
<header>
  └── <container>
      ├── <logo> "BIZHIVE" → /
      ├── <nav>
      │   ├── "Services" → /services [NEW]
      │   ├── "Studios" → /#studios
      │   ├── "Clients" → /clients [NEW]
      │   └── "News" → /news
      ├── <CTA> "Contact Us"
      └── <mobileToggle>
```

**Perubahan:** Nav links ke halaman baru

---

### 2. HERO

**File:** `components/Hero.tsx`  
**Layout:** 1 kolom, centered

```
<section>
  ├── <background> + <overlay>
  └── <content>
      ├── <h1> "Marketing Agency for" + "E-Commerce Growth"
      ├── <p> Subheadline
      └── <cta>
          ├── Button: "Contact via WhatsApp"
          └── Button: "Send Email"
```

---

### 3. WHY BIZHIVE

**File:** `components/WhyBizhive.tsx`  
**Layout:** 2 kolom

```
<section>
  └── <container>
      ├── <content>
      │   ├── <h2> "Why BIZHIVE"
      │   ├── <p> Description
      │   └── <platforms> Shopee, TikTok Shop, Lazada, Blibli
      └── <visual>
          └── <badge> "Official MCN Agency"
```

---

### 4. SERVICES ⭐ CLICKABLE

**File:** `components/Services.tsx`  
**Layout:** Header + 4-column grid  
**Navigasi:** Setiap card → `/services/[slug]`

```
<section id="services">
  └── <container>
      ├── <header>
      │   ├── <h2> "Our Services"
      │   └── <p> Subtitle
      └── <grid>
          └── [4x ServiceCard] ← CLICKABLE
              ├── <icon>
              ├── <h3> Title
              ├── <features> List
              ├── <highlight> Number + Label
              └── <link> "Learn More →" → /services/[slug]
```

**Card Links:**
| Card | Link Target |
|------|-------------|
| Store Optimization | `/services/store-optimization` |
| Content Production | `/services/content-production` |
| Affiliate & KOL | `/services/affiliate-kol` |
| Live Streaming | `/services/live-streaming` |

---

### 5. JOIN PROGRAM

**File:** `components/JoinProgram.tsx`  
**Layout:** Header + 2 cards

```
<section id="join">
  └── <container>
      ├── <header>
      │   ├── <badge> "🚀 Get Started"
      │   ├── <h2> "Ready to Grow Together?"
      │   └── <p> Subtitle
      └── <cards>
          ├── [Collabs Card]
          │   └── Button → Google Form
          └── [Training Card] (featured)
              └── Button → Google Form
```

---

### 6. STUDIOS

**File:** `components/Studios.tsx`  
**Layout:** Header + 4-column grid + features

```
<section id="studios">
  └── <container>
      ├── <header>
      │   ├── <h2> "Our Studios"
      │   └── <p> Subtitle
      ├── <grid> [4x StudioCard]
      └── <features> 4 badges
```

**Note:** Tidak ada halaman detail (scroll only)

---

### 7. CLIENTS ⭐ CLICKABLE

**File:** `components/Clients.tsx`  
**Layout:** Header + logo grid  
**Navigasi:** Setiap logo → `/clients/[slug]`

```
<section id="clients">
  └── <container>
      ├── <header>
      │   ├── <h2> "Our Clients"
      │   ├── <p> Subtitle
      │   └── <link> "View All Clients →" → /clients [NEW]
      └── <logoGrid>
          └── [8x LogoCard] ← CLICKABLE
              └── <link> → /clients/[slug]
```

---

### 8. METRICS

**File:** `components/Metrics.tsx`  
**Layout:** Header + 8-item grid

```
<section>
  └── <container>
      ├── <header>
      │   ├── <h2> "Agency Profile"
      │   └── <p> Subtitle
      └── <grid> [8x MetricCard]
```

---

### 9. PERFORMANCE ⭐ CLICKABLE

**File:** `components/Performance.tsx`  
**Layout:** Header + Before/After cards + footer  
**Navigasi:** Case study → `/case-studies/[slug]`

```
<section id="performance">
  └── <container>
      ├── <header>
      │   ├── <badge> "📈 Proven Results"
      │   ├── <h2> "Real Impact, Real Growth"
      │   └── <p> Subtitle
      ├── <showcase>
      │   ├── [Before Card]
      │   ├── [Arrow]
      │   └── [After Card]
      └── <footer>
          ├── <categoryBadge>
          ├── <button> "View Full Report" → Modal
          └── <link> "View All Case Studies →" → /case-studies [NEW]
```

---

### 10. NEWS PREVIEW ⭐ CLICKABLE

**File:** `components/NewsPreview.tsx`  
**Layout:** Header + 3-column grid  
**Navigasi:** Sudah ada

```
<section>
  └── <container>
      ├── <header>
      │   ├── <h2> "News & Updates"
      │   └── <link> "View All News →" → /news
      └── <grid>
          └── [3x NewsCard] ← CLICKABLE
              └── <link> → /news/[slug]
```

---

### 11. FINAL CTA

**File:** `components/FinalCTA.tsx`  
**Layout:** 1 kolom, centered

```
<section>
  └── <container>
      └── <content>
          ├── <h2> Headline
          ├── <cta> 2 buttons
          └── <contactInfo>
```

---

### 12. FOOTER

**File:** `components/Footer.tsx`  
**Layout:** 4 kolom + bottom

```
<footer>
  └── <container>
      ├── <grid>
      │   ├── [Brand Column]
      │   ├── [Quick Links] ← UPDATE LINKS
      │   ├── [Services] ← UPDATE LINKS
      │   └── [Contact]
      └── <bottom> Copyright
```

**Link Updates:**
| Old Link | New Link |
|----------|----------|
| `/#services` | `/services` |
| `/#clients` | `/clients` |

---

## BAGIAN 2: HALAMAN DETAIL BARU

---

### A. SERVICES LISTING (`/services`)

**File:** `app/services/page.tsx`  
**Layout:** Header + grid 2 kolom

```
<main>
  ├── <header>
  │   ├── <badge> "Our Services"
  │   ├── <h1> "Comprehensive E-Commerce Solutions"
  │   └── <p> Description
  └── <grid> (2 kolom)
      └── [4x ServiceCard] ← CLICKABLE
          ├── <icon>
          ├── <badge> Category
          ├── <h2> Title
          ├── <p> Short description
          ├── <features> 3-4 bullet points
          └── <link> "Learn More →"
```

---

### B. SERVICE DETAIL (`/services/[slug]`)

**File:** `app/services/[slug]/page.tsx`  
**Layout:** Multi-section

```
<main>
  ├── [Hero Section]
  │   ├── <breadcrumb> Services > {name}
  │   ├── <h1> Service Title
  │   └── <p> Tagline
  │
  ├── [Overview Section]
  │   ├── <h2> "What We Offer"
  │   └── <p> Full description
  │
  ├── [Features Section]
  │   ├── <h2> "Key Features"
  │   └── <grid> [Feature cards]
  │
  ├── [Process Section]
  │   ├── <h2> "How It Works"
  │   └── <timeline> Step 1 → 2 → 3 → 4
  │
  ├── [Results Section]
  │   ├── <h2> "Expected Results"
  │   └── <metrics> Key numbers
  │
  └── [CTA Section]
      ├── <h2> "Ready to Start?"
      └── <buttons> Contact CTA
```

**Slug Mapping:**
| Slug | Service |
|------|---------|
| `store-optimization` | Store Optimization |
| `content-production` | Content Production |
| `affiliate-kol` | Affiliate & KOL Management |
| `live-streaming` | Live Streaming |

---

### C. CLIENTS LISTING (`/clients`)

**File:** `app/clients/page.tsx`  
**Layout:** Header + logo grid

```
<main>
  ├── <header>
  │   ├── <badge> "Our Clients"
  │   ├── <h1> "Trusted by Leading Brands"
  │   └── <p> Description
  └── <grid> (4 kolom)
      └── [8+ ClientCard] ← CLICKABLE
          ├── <logo>
          ├── <name>
          ├── <category> e.g. "Beauty", "Fashion"
          └── <link> → /clients/[slug]
```

---

### D. CLIENT DETAIL / CASE STUDY (`/clients/[slug]`)

**File:** `app/clients/[slug]/page.tsx`  
**Layout:** Case study format

```
<main>
  ├── [Hero Section]
  │   ├── <breadcrumb> Clients > {name}
  │   ├── <logo> Brand logo
  │   ├── <h1> Brand Name (or "Brand A")
  │   └── <tags> Category, Platform, Duration
  │
  ├── [Challenge Section]
  │   ├── <h2> "The Challenge"
  │   └── <p> Problem description
  │
  ├── [Solution Section]
  │   ├── <h2> "Our Solution"
  │   └── <list> Services provided
  │
  ├── [Results Section]
  │   ├── <h2> "The Results"
  │   ├── <metrics> Before/After comparison
  │   └── <chart> Performance graph
  │
  ├── [Testimonial Section] (optional)
  │   └── <quote> Client feedback
  │
  └── [CTA Section]
      ├── <h2> "Want Similar Results?"
      └── <buttons> Contact CTA
```

---

### E. CASE STUDIES LISTING (`/case-studies`)

**File:** `app/case-studies/page.tsx`  
**Layout:** Header + grid

```
<main>
  ├── <header>
  │   ├── <badge> "📈 Case Studies"
  │   ├── <h1> "Proven Results, Real Growth"
  │   └── <p> Description
  ├── <filters> Platform | Category | Service (optional)
  └── <grid>
      └── [CaseStudyCard] ← CLICKABLE
          ├── <thumbnail>
          ├── <tags> Platform, Category
          ├── <h3> Case study title
          ├── <metrics> Key result highlights
          └── <link> → /case-studies/[slug]
```

---

### F. CASE STUDY DETAIL (`/case-studies/[slug]`)

**File:** `app/case-studies/[slug]/page.tsx`  
**Layout:** Same as Client Detail

```
(Same structure as /clients/[slug])
```

**Note:** `/clients/[slug]` dan `/case-studies/[slug]` bisa share komponen yang sama

---

## BAGIAN 3: CONSTRAINTS & RULES

### URUTAN HOMEPAGE SECTIONS (FIXED)

```
Header → Hero → WhyBizhive → Services → JoinProgram → Studios →
Clients → Metrics → Performance → NewsPreview → FinalCTA → Footer
```

### CLICKABLE ELEMENTS SUMMARY

| Section     | Element         | Target             |
| ----------- | --------------- | ------------------ |
| Services    | Card            | `/services/[slug]` |
| Clients     | Logo            | `/clients/[slug]`  |
| Performance | "View All" link | `/case-studies`    |
| News        | Card            | `/news/[slug]`     |

### NAVIGATION UPDATES REQUIRED

| Component         | Change                                       |
| ----------------- | -------------------------------------------- |
| `Header.tsx`      | Services → `/services`, Clients → `/clients` |
| `Footer.tsx`      | Update nav links                             |
| `Services.tsx`    | Wrap cards with Link                         |
| `Clients.tsx`     | Wrap logos with Link, add "View All"         |
| `Performance.tsx` | Add "View All Case Studies" link             |

### RESPONSIVE RULES

- Desktop: Full layout
- Tablet (≤900px): 2 kolom
- Mobile (≤768px): 1 kolom

### COLOR REFERENCE

- Primary: #FFAA00
- Success: #10B981
- Background: #0a0a0a → #111827

---

## CATATAN UNTUK IMPLEMENTASI

1. **Prioritas:** Services > Performance/Case Studies > Clients > News (sudah ada)
2. **Data Source:** Bisa static dulu, nanti integrasi Supabase
3. **Reusable Components:** Case study layout bisa dipakai untuk Clients dan Performance
4. **SEO:** Setiap halaman detail perlu meta tags yang proper

---

_Blueprint v2.0 - Termasuk struktur halaman detail baru_
