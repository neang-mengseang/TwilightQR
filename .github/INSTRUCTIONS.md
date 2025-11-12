# QRMagic - Complete Project Documentation

## Project Overview
**QRMagic** is a modern React-based QR code generator with 37 different QR code types organized in a landing page + subpage architecture. Built with TypeScript, Tailwind CSS, and Vite.

## Architecture Overview

### Navigation Flow
1. **Landing Page** (`/`) - Main page with QR type selection, search, and filtering
2. **Subpages** (`#qr-type=<type>`) - Individual QR generation pages for each type
3. **Hash-based routing** - Uses URL hash parameters for navigation

### Core Components Structure

#### 1. App.tsx (Main Router)
- **Purpose**: Central routing logic and state management
- **Key Functions**:
  - `renderCurrentPage()` - Determines which page to show based on URL hash
  - `handleQRTypeSelection(type: QRType)` - Navigates to QR generator subpage
  - `handleBackToLanding()` - Returns to landing page
- **State Management**:
  - `currentPage: 'landing' | 'generator'`
  - `selectedQRType: QRType | null`
  - `qrData: QRData`
  - `qrOptions: QRCodeOptions`
- **Hash Monitoring**: Listens for hash changes to update page state

#### 2. LandingPage.tsx (Main Selection Page)
- **Purpose**: Display all 37 QR types with search, filter, and category organization
- **Features**:
  - **Search**: Real-time search across QR type names and descriptions
  - **Category Filter**: 14 categories (Basic, Contact, Social Media, etc.)
  - **Responsive Grid**: Auto-adjusting grid layout for QR type cards
  - **Internationalization**: Support for English and Khmer
- **Categories**:
  ```typescript
  - basic: text, url, custom
  - contact: email, phone, sms, contact, business-card
  - social: whatsapp, telegram, messenger, discord, instagram, twitter, tiktok, youtube, linkedin, facebook, snapchat
  - communication: skype, zoom
  - entertainment: spotify
  - connectivity: wifi
  - location: location
  - events: event
  - payment: paypal, venmo
  - crypto: bitcoin, ethereum
  - apps: app-store, play-store
  - business: rating, review, coupon, menu
  - documents: pdf
  ```

#### 3. QRGeneratorPage.tsx (Individual QR Creation)
- **Purpose**: Complete QR generation interface for specific QR types
- **Layout**: 3-column responsive layout
  - **Left**: Form fields for QR data input
  - **Center**: QR customization options
  - **Right**: QR preview and export (sticky)
- **Components Used**:
  - `QRForm` - Dynamic form based on QR type
  - `QRCustomization` - Visual customization options
  - `QRPreview` - Live QR code preview
- **Features**:
  - Back button navigation
  - Real-time QR generation
  - Export functionality
  - Validation and error handling

## QR Types Configuration (37 Total)

### File: src/utils/qrTypes.ts
**Purpose**: Defines form fields, validation, and generation logic for each QR type

### Current QR Types:
1. **text** - Plain text content
2. **url** - Website or web link  
3. **email** - Email address or message
4. **phone** - Phone number for calling
5. **sms** - SMS text message
6. **contact** - Contact information (vCard)
7. **business-card** - Professional business card
8. **whatsapp** - WhatsApp message
9. **telegram** - Telegram message
10. **messenger** - Facebook Messenger
11. **discord** - Discord server/user
12. **instagram** - Instagram profile
13. **twitter** - Twitter/X profile
14. **tiktok** - TikTok profile
15. **youtube** - YouTube channel
16. **linkedin** - LinkedIn profile
17. **facebook** - Facebook profile
18. **snapchat** - Snapchat profile
19. **skype** - Skype contact
20. **zoom** - Zoom meeting link
21. **spotify** - Spotify track/playlist
22. **wifi** - WiFi network credentials
23. **location** - Geographic coordinates
24. **event** - Calendar event details
25. **paypal** - PayPal payment
26. **venmo** - Venmo payment
27. **bitcoin** - Bitcoin wallet address
28. **ethereum** - Ethereum wallet address
29. **app-store** - App Store app
30. **play-store** - Google Play Store app
31. **rating** - Business rating/review
32. **review** - Review platform link
33. **coupon** - Discount coupon code
34. **menu** - Restaurant menu
35. **pdf** - PDF document link
36. **custom** - Custom data format

### QR Type Configuration Structure:
```typescript
export const qrTypeConfigs: Record<QRType, QRTypeConfig> = {
  [type]: {
    id: string,
    name: string,
    description: string,
    icon: string,
    fields: FormField[],
    generate: (data: any) => string
  }
}
```

## Type System (src/types/index.ts)

### QR Data Interfaces
Each QR type has its own data interface that extends `BaseQRData`:
- **BaseQRData**: `{ type: QRType }`
- **TextQRData**: `{ type: 'text'; text: string }`
- **URLQRData**: `{ type: 'url'; url: string }`
- **EmailQRData**: `{ type: 'email'; email: string; subject?: string; body?: string }`
- etc.

### Union Types
- **QRType**: Union of all 37 QR type strings
- **QRData**: Union of all QR data interfaces
- **Language**: `'en' | 'km'`
- **ExportFormat**: `'png' | 'svg' | 'jpeg' | 'webp'`

## Key Utilities

### 1. src/utils/urlHash.ts
**Purpose**: URL hash management for routing
- `encodeQRToHash(qrData: QRData): string` - Encode QR data to URL hash
- `decodeHashToQR(hash: string)` - Decode URL hash to QR data
- `updateUrlHash(qrData: QRData)` - Update browser URL without navigation

### 2. src/utils/qrGenerators.ts
**Purpose**: QR code generation logic
- `generateQRString(data: any): string` - Core QR string generation

### 3. src/utils/i18n.ts
**Purpose**: Internationalization
- `t(key: string, language: Language): string` - Translation function

## Component Architecture

### Reusable Components:
- **FormField.tsx** - Dynamic form input component
- **QRCustomization.tsx** - QR visual customization
- **QRPreview.tsx** - Live QR code preview with export
- **Toast.tsx** - Notification system
- **Header.tsx** - App header
- **Footer.tsx** - App footer

### Legacy Components (Not Used in Current Architecture):
- **QRTypeSelector.tsx** - Old vertical QR type selector
- **HorizontalQRTypeSelector.tsx** - Old horizontal QR type selector
- **QRForm.tsx** - QR form component (used in QRGeneratorPage)
- **ModernUI.tsx** - Old single-page interface

## Styling System

### Tailwind CSS Configuration
- **File**: `tailwind.config.js`
- **CSS**: `src/index.css` - Global styles and Tailwind imports

### Design Tokens:
- **Colors**: Gradient-based color scheme for QR type cards
- **Typography**: Modern font stack with proper hierarchy
- **Spacing**: Consistent spacing scale
- **Responsive**: Mobile-first responsive design

## State Management

### App-Level State:
```typescript
- currentPage: 'landing' | 'generator'
- selectedQRType: QRType | null
- qrData: QRData
- qrOptions: QRCodeOptions
- language: Language
- theme: 'light' | 'dark'
```

### Local Component State:
- Form validation errors
- Search terms and filters
- UI interaction states

## Build & Development

### Scripts:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Key Dependencies:
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## File Structure
```
src/
├── components/           # React components
│   ├── LandingPage.tsx      # Main landing page
│   ├── QRGeneratorPage.tsx  # QR generation subpage
│   ├── QRForm.tsx          # Dynamic QR form
│   ├── QRCustomization.tsx # QR styling options
│   ├── QRPreview.tsx       # QR preview & export
│   ├── FormField.tsx       # Reusable form input
│   ├── Toast.tsx           # Notifications
│   ├── Header.tsx          # App header
│   └── Footer.tsx          # App footer
├── types/
│   └── index.ts            # TypeScript definitions
├── utils/
│   ├── qrTypes.ts          # QR type configurations
│   ├── qrGenerators.ts     # QR generation logic
│   ├── urlHash.ts          # URL routing utilities
│   ├── export.ts           # Export functionality
│   └── i18n.ts             # Internationalization
├── i18n/
│   └── translations.ts     # Translation data
├── App.tsx                 # Main app router
├── main.tsx               # App entry point
└── index.css              # Global styles
```

## Critical Implementation Details

### 1. Hash-Based Routing
- Format: `#qr-type=text&param1=value1&param2=value2`
- Monitored via `hashchange` event in App.tsx
- Allows direct linking to specific QR configurations

### 2. QR Type Configuration
- Each QR type MUST have configuration in `qrTypes.ts`
- Configuration includes form fields, validation, and generation logic
- All 37 types are currently configured

### 3. Type Safety
- Strict TypeScript configuration
- All QR types must be in the QRType union
- All data interfaces must be in the QRData union
- urlHash.ts uses flexible typing for parsing

### 4. Responsive Design
- Mobile-first approach
- Landing page: 1-4 column grid based on screen size
- Generator page: Stacked mobile, 3-column desktop
- All components are fully responsive

### 5. Search & Filtering
- Real-time search across type names and descriptions
- Category-based filtering
- Supports internationalization
- Maintains state during navigation

## Error Handling

### Common Issues & Solutions:
1. **TypeScript Errors**: Ensure all QR types are in unions and have configurations
2. **Missing QR Configs**: Add to `qrTypeConfigs` in qrTypes.ts
3. **Hash Parsing**: Use flexible typing in urlHash.ts
4. **Form Validation**: Defined per field in QR type configuration

## Internationalization Support

### Languages: English (en), Khmer (km)
- Translation keys in `src/i18n/translations.ts`
- Used via `t(key, language)` function
- Applied to QR type names and descriptions

## Export Functionality
- Formats: PNG, SVG, JPEG, WebP
- Customizable quality and size
- Handled in QRPreview component

## Development Guidelines

### Adding New QR Types:
1. Add type to QRType union in `types/index.ts`
2. Create data interface extending BaseQRData
3. Add interface to QRData union
4. Add configuration to `qrTypeConfigs` in `qrTypes.ts`
5. Add to landing page QR types array
6. Add translations if needed

### Modifying Components:
1. **LandingPage.tsx**: For search, filtering, or QR type display
2. **QRGeneratorPage.tsx**: For generation page layout
3. **App.tsx**: For routing logic
4. Always maintain TypeScript strict mode compliance

### Testing Changes:
1. `npm run build` - Verify TypeScript compilation
2. `npm run dev` - Test functionality
3. Test both landing page and subpage navigation
4. Verify all QR types are accessible and functional

## Performance Considerations
- Components use useMemo for expensive computations
- Search filtering is optimized
- QR generation is real-time but debounced
- Images and assets are optimized for web

This documentation should be referenced for every change to maintain consistency and proper implementation of the landing + subpage architecture.