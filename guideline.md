# Al-Andalus Insurance International — Website Design & Development Guideline

---

## 1. Project Overview

**Company:** Al-Andalus International Insurance Company (شركة الأندلس للتأمين الدولي)  
**Industry:** Insurance (General Insurance)  
**Website Type:** Bilingual corporate website (Arabic RTL + English LTR)  
**Design Reference:** [https://www.toyokoh.com/](https://www.toyokoh.com/)  
**Founded:** 2015, Baghdad, Iraq  
**Branches:** Baghdad (HQ), Basrah, Erbil, Mansour

---

## 2. Brand Identity

### 2.1 Color Palette

| Role | Hex Code | Usage |
|------|----------|-------|
| **Primary (Navy)** | `#0B223D` | Hero overlay, header, footer, dark sections, primary text |
| **Accent Red** | `#D4574E` | CTA buttons, active states, error states, highlights |
| **Accent Gold** | `#C1962D` | Section numbering, hover accents, premium indicators, borders |
| **Light Background** | `#DDE4EC` | Content section backgrounds, card backgrounds, subtle dividers |
| **White** | `#FFFFFF` | Text on dark backgrounds, clean section backgrounds |
| **Dark Text** | `#0B223D` | Body text on light backgrounds (reuse primary navy) |
| **Muted Text** | `#5A6B7D` | Secondary/supporting text, captions, metadata |

### 2.2 Extended Palette (Derived)

```
--navy-900:  #0B223D   (Primary)
--navy-800:  #122D4D
--navy-700:  #1A3A5C
--navy-600:  #234A6E
--red-500:   #D4574E   (Accent Red)
--red-400:   #E06B63
--red-600:   #B84A42
--gold-500:  #C1962D   (Accent Gold)
--gold-400:  #D4A83F
--gold-600:  #A67E24
--light-100: #DDE4EC   (Light Background)
--light-50:  #EEF1F5
--light-200: #CCD5E0
--gray-500:  #5A6B7D   (Muted Text)
--gray-400:  #7A8B9D
--gray-300:  #9CACBD
```

### 2.3 Typography

| Language | Font Family | Source | Usage |
|----------|------------|--------|-------|
| **English** | **Poppins** | [Google Fonts](https://fonts.google.com/specimen/Poppins) | All English text — headings, body, navigation, buttons |
| **Arabic** | **Cairo** | [Google Fonts](https://fonts.google.com/specimen/Cairo) | All Arabic text — headings, body, navigation, buttons |

#### Font Weights

| Weight | Name | Usage |
|--------|------|-------|
| 300 | Light | Captions, supporting text |
| 400 | Regular | Body text, paragraphs |
| 500 | Medium | Navigation links, buttons |
| 600 | SemiBold | Subheadings, card titles |
| 700 | Bold | Section headings, hero text |

#### Font Sizes (Responsive Scale)

```
--text-xs:    0.75rem   (12px)  — Metadata, tags
--text-sm:    0.875rem  (14px)  — Captions, footnotes
--text-base:  1rem      (16px)  — Body text
--text-lg:    1.125rem  (18px)  — Larger body text
--text-xl:    1.25rem   (20px)  — Card headings
--text-2xl:   1.5rem    (24px)  — Subheadings
--text-3xl:   1.875rem  (30px)  — Section titles
--text-4xl:   2.25rem   (36px)  — Major headings
--text-5xl:   3rem      (48px)  — Hero subtext
--text-hero:  4.5rem    (72px)  — Hero headline (desktop)
```

> **Note:** On mobile (< 768px), hero text scales down to `2.5rem` (40px) and section titles to `1.5rem` (24px).

### 2.4 Logo Assets

| Asset | File | Location |
|-------|------|----------|
| Primary Logo (Dark/Blue) | `logo-blue.png` | `/logo-blue.png` — for light backgrounds |
| White Logo | `white-logo.png` | `/white-logo.png` — for dark backgrounds (hero, header, footer) |
| Brand Logo (Small) | `brand-assets/logo.png` | `/brand-assets/logo.png` |

---

## 3. Design System — Inspired by Toyokoh.com

### 3.1 Overall Design Philosophy

The website should follow the **Toyokoh.com** visual and interactive approach:

- **Cinematic & Immersive:** Full-viewport hero with video background
- **Generous Whitespace:** Sections breathe with large vertical spacing between them
- **Scroll-Triggered Animations:** Content reveals on scroll — fade-in, slide-up, clip-reveal
- **Vertical Labels:** Section indicators appear vertically (e.g., `(About)`, `(Our Products)`)
- **Numbered Sections:** Products/services marked with `01`, `02`, `03`…
- **Minimal & Premium:** Clean layouts, restrained use of color, premium typography
- **Bilingual Support:** AR/EN language toggle in header and footer (mirrors Toyokoh's JP/EN toggle)

### 3.2 Layout Grid

```
Desktop (≥1200px):  12-column grid, 80px side margins, 24px gutter
Tablet (768-1199px): 8-column grid, 40px side margins, 20px gutter
Mobile (<768px):     4-column grid, 20px side margins, 16px gutter

Max content width: 1200px (centered)
```

### 3.3 Spacing Scale

```
--space-1:   0.25rem   (4px)
--space-2:   0.5rem    (8px)
--space-3:   0.75rem   (12px)
--space-4:   1rem      (16px)
--space-6:   1.5rem    (24px)
--space-8:   2rem      (32px)
--space-10:  2.5rem    (40px)
--space-12:  3rem      (48px)
--space-16:  4rem      (64px)
--space-20:  5rem      (80px)
--space-24:  6rem      (96px)
--space-32:  8rem      (128px)
--space-section: 10rem (160px) — Between major sections
```

---

## 4. Page Structure & Sections

The homepage follows the exact Toyokoh.com structure, adapted for Al-Andalus:

### 4.1 Loading Screen

Like Toyokoh's `TopLoader`:
- Full-screen overlay with the Al-Andalus logo centered
- Animated loading progress counter: `( 0% )` → `( 100% )`
- Glowing circle animation around the logo
- Once loaded, the overlay slides/fades away to reveal the hero
- Background: `#0B223D` (Primary Navy)
- Text/Logo: White

### 4.2 Header / Navigation

```
┌─────────────────────────────────────────────────────────────┐
│  [Nav Links]          [LOGO]           [AR/EN] [Contact ➜] │
└─────────────────────────────────────────────────────────────┘
```

**Behavior (mirroring Toyokoh):**
- **Fixed** at the top, overlays content
- **Transparent** on hero, becomes **solid `#0B223D`** on scroll
- Logo centered (white version on dark, blue version on light)
- Left: Navigation links — `Products`, `About Us`, `Branches`, `News`, `FAQ`
- Right: Language toggle (`AR` / `EN`) + CTA button (`Contact Us` / `تواصل معنا`)
- Mobile: Hamburger menu with slide-in panel (like Toyokoh's `Menu` component)

**Navigation Links (Arabic / English):**

| Arabic | English | Link |
|--------|---------|------|
| منتجاتنا | Products | `/products/` |
| من نحن | About Us | `/about/` |
| فروعنا | Branches | `/branches/` |
| الأخبار | News | `/news/` |
| الأسئلة الشائعة | FAQ | `/faq/` |

### 4.3 Hero Section (KV — Key Visual)

**Exactly like Toyokoh's hero:**
- **Full-viewport video background** (muted, autoplay, looping)
  - Desktop: `/assets/movies/pc/hero.mp4`
  - Mobile: `/assets/movies/sp/hero.mp4`
  - Fallback: Static image `/assets/images/hero-fallback.webp`
- **Dark overlay** with subtle gradient (`#0B223D` at 40-60% opacity)
- **Hero text** (left-aligned, large, white):
  ```
  EN: "Protecting What Matters Most,
       Al-Andalus Insurance International."
  
  AR: "نحمي ما يهمّك أكثر،
       الأندلس للتأمين الدولي."
  ```
- **Scroll indicator** at bottom: `( Scroll Down )` / `( مرر للأسفل )`
- Text animation: Letters/words reveal one by one (mask-text split animation)

### 4.4 Introduction Section

**Mirrors Toyokoh's "Next New Technology" section:**

```
                    "Trusted
                     Insurance
                     Solutions"

    ── Innovative insurance solutions ──
       for a secure future

    [Body paragraph about Al-Andalus mission
     and the importance of insurance in Iraq...]

    [ Read More → ]
```

- Large serif-style heading split across lines (like Toyokoh's `SectionLead`)
- Each line animates in on scroll
- Supporting paragraph clips in
- "Read More" button links to `/about/`
- Side images: 3 floating images with rounded corners showing:
  - Iraqi cityscape / infrastructure
  - Client consultation moment
  - Corporate meeting

### 4.5 Full-Width Parallax Image

**Between Introduction and About (like Toyokoh's `MainImage`):**
- Full-width image with parallax scrolling effect
- Image content: Panoramic view of Baghdad skyline or a symbolic insurance visual
- No text overlay — purely visual breather

### 4.6 About Section

**Mirrors Toyokoh's "Beautifully for the Future" section:**

```
    (About)

    "Building
     Security
     for Iraq"
    
    ── أمان يبني المستقبل ──

    [CEO quote / company vision paragraph]

    [ Read More → ]
```

- Vertical label `(About)` / `(من نحن)` on the side
- Background: Multiple floating images with rounded corners (like Toyokoh's `About-backgroundImage`)
- Shows: Office, team members, client interactions
- Large vertical title with clip-reveal animation
- CEO message preview
- "Read More" → `/about/`

### 4.7 Our Products Section (Our Business)

**Exactly mirrors Toyokoh's "Our Business" section with two highlighted products:**

```
    (Our Products)

    ┌─────────────────────────────────────┐
    │   [Visual/Video]    (01)            │
    │                     MOTOR INSURANCE │
    │                     تأمين السيارات  │
    │                     Coverage for    │
    │                     vehicles...     │
    │                     [READ MORE →]   │
    └─────────────────────────────────────┘

    ┌─────────────────────────────────────┐
    │   [Visual/Video]    (02)            │
    │                     HEALTH          │
    │                     INSURANCE       │
    │                     التأمين الصحي   │
    │                     Comprehensive   │
    │                     healthcare...   │
    │                     [READ MORE →]   │
    └─────────────────────────────────────┘
```

**Structure:**
- Vertical label `(Our Products)` / `(منتجاتنا)`
- Two featured products with:
  - Large visual/video thumbnail on one side
  - Product number `(01)`, `(02)` in gold (`#C1962D`)
  - Product title as a styled logo/text
  - Short description
  - "READ MORE" touch link on mobile
- Horizontal scroll or side-by-side layout on desktop
- Videos autoplay on hover (desktop) or on viewport enter (mobile)
- Dark background (`#0B223D`) with light text

**Featured Products:**
1. **Motor Insurance** (تأمين السيارات) — most popular
2. **Health Insurance** (التأمين الصحي) — high demand

### 4.8 All Products Grid (Additional Section)

Below the featured products, show a grid of all insurance products:

```
    ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
    │ 🔥 Fire  │  │ 🚢 Cargo │  │ 🏗 Eng.  │  │ 🔒 Theft │
    │ Insurance│  │ Insurance│  │ Insurance│  │ Insurance│
    └──────────┘  └──────────┘  └──────────┘  └──────────┘
    ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
    │ ✈️Travel │  │ 💳 Loan  │  │ ⚕️ Med.  │  │ 🛡 Cyber │
    │ Insurance│  │ Protect. │  │ Malpr.   │  │ Insurance│
    └──────────┘  └──────────┘  └──────────┘  └──────────┘
```

- Cards with icons, hover animations (scale up + shadow)
- Background: `#DDE4EC`
- Card background: `#FFFFFF`
- Icon color: `#C1962D` (gold)
- Each card links to a detailed product page

**Complete Product List:**
1. Cargo Insurance (Marine/Land/Air)
2. Engineering Insurance (Contractors' All Risks)
3. Glass Insurance
4. Burglary Insurance
5. Bankers Blanket Insurance *(Under Development)*
6. Cash in Transit & Safe Insurance
7. Public Liability Insurance
8. Fire Insurance
9. Fidelity Guarantee Insurance
10. Motor Insurance
11. Health Insurance
12. Loan Protection Insurance *(Under Development)*
13. Travel Insurance
14. Medical Malpractice Insurance
15. Hull Insurance
16. Cyber Insurance *(Under Development)*

### 4.9 Leadership Section (Recruit → Leadership)

**Mirrors Toyokoh's "Recruit" section, adapted for leadership messages:**

```
    (Leadership)

    "Leading
     with Vision"

    ── قيادة برؤية واضحة ──

    [Brief CEO and Managing Director messages]

    [ Read More → ]
```

- Dark background section
- Scrolling image marquee (like Toyokoh's `Recruit-line` image rows)
  - Images: Team photos, office photos, events
  - 3 rows scrolling at different speeds (infinite CSS animation)
- Overlay text: Leadership section title
- Brief previews of CEO and Managing Director messages
- "Read More" → `/about/#leadership`

### 4.10 News Section

**Mirrors Toyokoh's News section exactly:**

```
    (News)

    ┌─ 2025.01.15  │ Motor Insurance  │ New Motor Insurance Product Launched ─┐
    ├─ 2025.01.10  │ Company News     │ Al-Andalus Opens Erbil Branch        ─┤
    ├─ 2024.12.20  │ Health Insurance  │ Partnership with Major Hospital...   ─┤
    ├─ 2024.12.01  │ Company News     │ Annual General Meeting Results...     ─┤
    └─ 2024.11.15  │ Travel Insurance  │ New Travel Insurance Coverage...     ─┘

    [ View All → ]
```

- Vertical label `(News)` / `(الأخبار)`
- Each news item is a row with:
  - Date (formatted: `YYYY.MM.DD`)
  - Category tag(s) (pill badges)
  - Title
  - Hover: circle indicator + subtle background shift (like Toyokoh's `NewsItem-circle`)
- "View All" button at the bottom → `/news/`
- Show latest 5 items
- Background: White or `#DDE4EC`

### 4.11 Contact Us Section

**Mirrors Toyokoh's Contact section:**

```
    ┌─────────────────────────────────────────────────────────────┐
    │                                                             │
    │   "Contact Us"          Let's build security together.      │
    │   (تواصل معنا)          لنبنِ الأمان معاً.                  │
    │                                                             │
    │                         [ Go to form → ]                    │
    │                                                             │
    │   [Background: video/image of team or cityscape]            │
    │                                                             │
    └─────────────────────────────────────────────────────────────┘
```

- Large `Contact Us` title as background watermark (like Toyokoh's `Contact-lead -background`)
- Foreground `Contact Us` title with clip-reveal
- Arabic subtitle
- "Go to form" link with arrow icon
- Background: Looping video or image with parallax
- Dark overlay with text in white

### 4.12 Footer

**Mirrors Toyokoh's footer structure:**

```
┌─────────────────────────────────────────────────────────────┐
│  [AL-ANDALUS LOGO]                                          │
│                                                             │
│  Products          Information       Contact     Social     │
│  ─────────         ───────────       ───────     ──────     │
│  Motor Insurance   About Us          📞 7366     Facebook   │
│  Health Insurance  Branches          📱 +964...  Instagram  │
│  Fire Insurance    News              ✉️ info@..  LinkedIn   │
│  Travel Insurance  FAQ                           TikTok     │
│  All Products      Careers                       WhatsApp   │
│                                                             │
│─────────────────────────────────────────────────────────────│
│  © Al-Andalus Insurance International   Privacy Policy  AR/EN│
└─────────────────────────────────────────────────────────────┘
```

- Background: `#0B223D`
- Text: White
- Logo: White version
- Navigation columns
- Social media links with icons
- Contact shortcut number: **7366**
- Language toggle
- Privacy Policy link
- Copyright: `© Al-Andalus International Insurance Company`

---

## 5. Interaction & Animation Guidelines

### 5.1 Loading Animation
- Full-screen loader with logo + progress percentage
- Circle glow animation (SVG filter blur like Toyokoh's `TopLoader-light`)
- Duration: ~3 seconds
- Exit: Fade out + scale down

### 5.2 Scroll-Triggered Reveals (mask-text)
Following Toyokoh's `data-mask-text` system:

| Animation Type | CSS Class | Behavior |
|----------------|-----------|----------|
| **Split** | `mask-text-split` | Each character/word reveals sequentially |
| **Clip** | `mask-text-clip` | Block clips in from bottom (height reveal) |
| **Lines** | `mask-text-lines` | Line-by-line reveal |
| **Block** | `mask-text-block` | Entire block fades + slides up |

**Timing:**
- Trigger: Element enters viewport (IntersectionObserver, threshold: 0.2)
- Duration: 0.8s–1.2s per element
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo)
- Stagger: 0.1s between sequential elements

### 5.3 Parallax Scrolling
- Full-width images move at 50% scroll speed
- Uses `transform: translateY()` driven by scroll position
- Performance: Use `will-change: transform` and `requestAnimationFrame`

### 5.4 Video Background
- Muted, autoplay, loop, playsinline
- Separate sources for desktop (`/pc/`) and mobile (`/sp/`)
- Lazy-load non-hero videos
- Battery saver: Replace videos with static images on low-battery/low-power devices

### 5.5 Mouse Follower (Desktop Only)
Like Toyokoh's `MouseStalker`:
- Small custom cursor circle that follows the mouse
- Grows on interactive elements (links, buttons)
- Shows text labels on certain elements (e.g., "Read More" on product cards)
- Color: `#C1962D` (Gold) or `#D4574E` (Red)

### 5.6 Button Styles

#### Primary CTA (FillButton)
```css
.btn-primary {
  background: #D4574E;
  color: #FFFFFF;
  padding: 14px 32px;
  border: none;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transition: background 0.3s ease;
}
.btn-primary:hover {
  background: #B84A42;
}
```

#### Secondary CTA (Read More)
```css
.btn-secondary {
  background: transparent;
  color: currentColor;
  padding: 14px 32px;
  border: 1px solid currentColor;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  position: relative;
  overflow: hidden;
}
/* Animated fill on hover (like Toyokoh's FillButton-line) */
.btn-secondary::before {
  content: '';
  position: absolute;
  bottom: 0; left: 0;
  width: 100%; height: 0;
  background: #0B223D;
  transition: height 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.btn-secondary:hover::before {
  height: 100%;
}
```

#### Inverted Button (for dark backgrounds)
Same as secondary but with white text/border, fills with white on hover.

### 5.7 Page Transitions
- Vertical line overlay animation (like Toyokoh's `Transition-backgroundLine`)
- Multiple thin lines sweep across the viewport
- Duration: ~0.6s
- Background: `#0B223D`

---

## 6. Bilingual (RTL/LTR) Guidelines

### 6.1 Direction Switching
```css
html[dir="rtl"] {
  font-family: 'Cairo', sans-serif;
  direction: rtl;
  text-align: right;
}

html[dir="ltr"] {
  font-family: 'Poppins', sans-serif;
  direction: ltr;
  text-align: left;
}
```

### 6.2 Layout Mirroring
- All flexbox and grid layouts must flip for RTL
- Use `margin-inline-start` / `margin-inline-end` instead of `margin-left` / `margin-right`
- Icons with directional meaning (arrows) must flip
- Navigation order may remain the same or reverse based on design preference

### 6.3 Language Toggle
- Mirrors Toyokoh's `LanguageButton` component
- Appears in: Header (desktop), Mobile menu, Footer
- Style: Two options side by side `AR | EN` with active state highlight
- Active language: Bold + underline or filled background
- Clicking switches the entire page content and direction

### 6.4 Font Loading
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Cairo:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

---

## 7. Responsive Breakpoints

| Breakpoint | Name | Target |
|------------|------|--------|
| `< 480px` | **xs** | Small phones |
| `480px – 767px` | **sm** | Large phones |
| `768px – 1023px` | **md** | Tablets |
| `1024px – 1199px` | **lg** | Small desktops |
| `≥ 1200px` | **xl** | Standard desktops |
| `≥ 1440px` | **2xl** | Large screens |

### Mobile-First Approach
- Design mobile layouts first, then enhance for larger screens
- Touch targets: Minimum 44px × 44px
- Hamburger menu for mobile navigation
- Stacked layouts for product cards on mobile
- Simplified animations on mobile (reduce parallax, simplify reveals)

---

## 8. SEO & Meta Requirements

### 8.1 Per-Page Meta Tags
```html
<title>Al-Andalus Insurance International | شركة الأندلس للتأمين الدولي</title>
<meta name="description" content="Leading insurance company in Iraq offering motor, health, fire, travel, and comprehensive insurance solutions. شركة رائدة في التأمين بالعراق.">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta property="og:title" content="Al-Andalus Insurance International">
<meta property="og:description" content="Protecting what matters most. Innovative insurance solutions for Iraq.">
<meta property="og:type" content="website">
<meta property="og:image" content="/assets/ogp.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="canonical" href="https://www.alandalus-iq.com/">
```

### 8.2 Structured Data
Include Organization and InsuranceAgency schema markup.

### 8.3 Performance Targets
- Lighthouse Performance: ≥ 90
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- Image format: WebP with JPEG fallback
- Video format: MP4 (H.264)

---

## 9. Contact Information

| Channel | Value |
|---------|-------|
| **Short Number** | 7366 |
| **Mobile** | +964 771 000 6000 |
| **Email** | info@alandalus-iq.com |
| **Facebook** | [facebook.com/share/1E5Tu8V2BL](https://www.facebook.com/share/1E5Tu8V2BL/?mibextid=wwXIfr) |
| **Instagram** | [@alandalusinsurance](https://www.instagram.com/alandalusinsurance) |
| **WhatsApp** | [+964 771 000 6000](https://wa.me/9647710006000) / [+964 787 717 4626](https://wa.me/9647877174626) |
| **LinkedIn** | [Al-Andalus IQ](https://www.linkedin.com/company/alandalusiq) |
| **TikTok** | [@alandalus.insurance](https://www.tiktok.com/@alandalus.insurance) |

---

## 10. Sitemap / Page List

| Page | Route (EN) | Route (AR) |
|------|-----------|-----------|
| Home | `/` | `/ar/` |
| About Us | `/about/` | `/ar/about/` |
| Products (Overview) | `/products/` | `/ar/products/` |
| Product Detail (×16) | `/products/[slug]/` | `/ar/products/[slug]/` |
| Branches | `/branches/` | `/ar/branches/` |
| News | `/news/` | `/ar/news/` |
| News Article | `/news/[slug]/` | `/ar/news/[slug]/` |
| FAQ | `/faq/` | `/ar/faq/` |
| Contact Us | `/contact/` | `/ar/contact/` |
| Privacy Policy | `/privacy/` | `/ar/privacy/` |

---

## 11. Asset Checklist

### Videos Needed
- [ ] Hero background video (desktop + mobile versions)
- [ ] Product showcase videos (Motor Insurance, Health Insurance)
- [ ] Contact section background video
- [ ] Loading screen animation video (optional, can be CSS)

### Images Needed
- [ ] Hero fallback image
- [ ] Introduction section images (3 floating images)
- [ ] Full-width parallax image (cityscape/symbolic)
- [ ] About section background images (5 floating images)
- [ ] Product thumbnails (for featured products)
- [ ] Product icons (for grid cards)
- [ ] Leadership portraits (CEO, Managing Director)
- [ ] Team/office photos (for leadership section marquee)
- [ ] Contact section background image
- [ ] OG image for social sharing (1200×630)
- [ ] Favicon set (16×16, 32×32, 180×180, 192×192, 256×256)

### Fonts
- [x] Poppins (Google Fonts)
- [x] Cairo (Google Fonts)

### Logos
- [x] Logo dark/blue version (`logo-blue.png`)
- [x] Logo white version (`white-logo.png`)
- [x] Logo small (`brand-assets/logo.png`)

---

## 12. Technology Recommendations

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js (for SSR/SSG, routing, i18n) or Astro (like Toyokoh) |
| **Styling** | Vanilla CSS with CSS Custom Properties |
| **Animations** | GSAP (GreenSock) for scroll-triggered animations |
| **Smooth Scroll** | Lenis (like Toyokoh uses `data-lenis-prevent`) |
| **Video** | HTML5 `<video>` with lazy loading |
| **i18n** | next-intl or custom middleware for AR/EN |
| **Deployment** | Vercel, Netlify, or similar |
| **CMS** | Headless CMS for News articles (Strapi, Sanity, or similar) |

---

## 13. Accessibility (a11y)

- All images must have meaningful `alt` text
- Videos must have captions/transcripts available
- Color contrast ratio: ≥ 4.5:1 for body text, ≥ 3:1 for large text
- Keyboard navigation must be fully functional
- Skip-to-content link at page top
- ARIA labels on interactive elements
- Focus indicators visible on all interactive elements
- Reduced motion support: `@media (prefers-reduced-motion: reduce)` disables animations

---

*Document Version: 1.0*  
*Last Updated: June 30, 2026*  
*Reference Website: [https://www.toyokoh.com/](https://www.toyokoh.com/)*
