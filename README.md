# QR Magic — QR Code Generator

A full-featured, client-side QR code generator. Pick a QR type, fill in the content, customize the appearance, then preview, download, copy, or share via a link. Works offline as an installable PWA.

Live: https://qr-magic.vercel.app/

## Features

### 36 QR types across 13 categories

- **Basic:** Text, Website URL, Custom data
- **Contact & Communication:** Email, Phone, SMS, Contact (vCard), Business Card
- **Social Media:** WhatsApp, Telegram, Messenger, Discord, Instagram, Twitter/X, TikTok, YouTube, LinkedIn, Facebook, Snapchat
- **Communication:** Skype, Zoom
- **Entertainment:** Spotify
- **Connectivity:** Wi-Fi (WPA/WPA2, WEP, open, hidden networks)
- **Location & Events:** Geographic coordinates (geo:), Calendar events (vEvent)
- **Payment:** PayPal, Venmo
- **Cryptocurrency:** Bitcoin, Ethereum
- **Apps & Stores:** App Store, Google Play Store
- **Business & Marketing:** Rating, Review, Coupon, Restaurant Menu
- **Documents:** PDF link

### Customization

- Foreground and background color pickers, with transparent background option
- Dot pattern (rounded, dots, classy, classy-rounded, square, extra-rounded)
- Corner square and corner dot styles
- Error correction level (L / M / Q / H)
- Margin control
- Logo upload (PNG/JPG/etc.) with adjustable logo size
- Visual templates: default, bordered, rounded border, drop shadow, gradient border
- Live preview that updates as you type

### Export & share

- Download as PNG, SVG, JPEG, or WebP at multiple sizes
- Copy QR image (PNG/SVG/JPEG/WebP) or raw QR data to clipboard
- Native Web Share API for mobile sharing
- Shareable URL: QR content is encoded into the URL hash so the same QR can be reopened anywhere
- Social share shortcuts (Facebook, Twitter, LinkedIn, WhatsApp, Telegram, email)
- Dedicated `/shared` view for a clean, scan-friendly display of a shared QR (with fullscreen and theme toggle)

### UX

- Light / dark theme with system preference detection, persisted to localStorage
- Searchable, category-filtered landing page for picking a QR type
- Bilingual UI: English and Khmer (ខ្មែរ)
- Form validation with inline error messages per QR type
- Toast notifications for actions (save, copy, share, errors)
- Responsive layout (mobile through desktop)
- Installable PWA with offline support via service worker

## Tech stack

- React 18 + TypeScript
- Vite 4 (build tooling, dev server)
- Tailwind CSS 3
- `qr-code-styling` for QR rendering and styling
- `html-to-image` for PNG/JPEG/WebP/SVG export (lazy-loaded)
- `lucide-react` for icons
- `vite-plugin-pwa` for service worker and manifest

## Getting started

```bash
npm install
npm run dev      # start dev server
npm run build    # type-check + production build to dist/
npm run preview  # preview the production build
npm run lint     # eslint (note: config currently broken, see known issues)
```

## Project structure

```
src/
  App.tsx                  # Root component, state, hash-based routing
  main.tsx                 # Entry, theme bootstrap
  index.css                # Tailwind + global styles
  components/
    Header.tsx             # Top bar: theme + language toggles
    Footer.tsx
    LandingPage.tsx        # (duplicate of pages/LandingPage.tsx — dead code)
    QRGeneratorPage.tsx    # (duplicate of pages/QRGeneratorPage.tsx — dead code)
    SharedPage.tsx         # (duplicate of pages/SharedPage.tsx — dead code)
    QRForm.tsx             # Dynamic form rendered from qrTypeConfigs
    QRCustomization.tsx    # Color, dots, corners, logo, templates, ECC
    QRPreview.tsx          # Live QR render + save/copy/share actions
    QRModals.tsx           # Save / Copy / Share modals
    ModernUI.tsx           # Shared button primitives
    FormField.tsx          # Single form field renderer
    SocialPreview.tsx      # Social card preview for /qr-preview route
    Toast.tsx
  pages/
    LandingPage.tsx        # QR type picker with search + categories
    QRGeneratorPage.tsx    # Form + customization + preview layout
    SharedPage.tsx         # Minimal scan-friendly shared QR view
  utils/
    qrGenerators.ts        # Per-type QR string generators + validation
    qrTypes.ts             # Form field configs for every QR type
    urlHash.ts             # Encode/decode QR data to/from URL hash
    export.ts              # PNG/SVG/JPEG/WebP export, clipboard, Web Share
    i18n.ts                # Translation helpers
  i18n/
    translations.ts        # English + Khmer strings
  types/
    index.ts               # QRData union, options, form field types
public/
  manifest.json            # PWA manifest (note: vite-plugin-pwa also generates one)
  qr-icon.svg, logo/       # Icons and OG banner
```

## How sharing works

QR content is serialized into the URL hash (e.g. `#qr-type=wifi&ssid=...&password=...`). Opening that URL rehydrates the QR on any device. The `/shared` path renders a minimal scan-friendly view; the `/qr-preview` path renders a social card preview.

## Known issues

- `npm run lint` fails: `.eslintrc.cjs` extends `@typescript-eslint/recommended` but should extend `plugin:@typescript-eslint/recommended` for plugin v6.
- `src/components/{LandingPage,QRGeneratorPage,SharedPage}.tsx` are unused duplicates of the `src/pages/` versions.
- Several QR types (instagram, youtube, spotify, paypal, bitcoin, pdf, menu, business-card, etc.) have form configs and generators but no validation in `validateQRData`, so empty input can produce broken QRs.
- PWA icons referenced in `vite.config.ts` and `index.html` (`pwa-192x192.png`, `pwa-512x512.png`, `apple-touch-icon.png`, `favicon.ico`) are missing from `public/`.
- Two manifests exist: `public/manifest.json` (linked in `index.html`) and the one generated by `vite-plugin-pwa`. Only the static one is used.
- `react-hook-form` is listed as a dependency but is not used.

## License

None specified.
