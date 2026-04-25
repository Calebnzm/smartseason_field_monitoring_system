# SmartSeason Design System

## Overview

A minimal, clean design system inspired by agricultural platforms and Shamba Connect. Uses CSS variables for theming and Tailwind CSS for layout.

## Design Principles

1. **Clarity**: Clean layouts, no visual clutter
2. **Agricultural Feel**: Natural green colors, earthy aesthetic
3. **Accessibility**: High contrast, semantic HTML
4. **Responsive**: Mobile-first design
5. **Minimal**: No unnecessary decorations

## Color System

### CSS Variables (in `app/globals.css`)

```css
:root {
  --color-primary: #2d5016;        /* Dark green - main brand */
  --color-secondary: #7cb342;      /* Light green - accents */
  --color-accent: #f57c00;         /* Orange - CTAs */
  --color-success: #388e3c;        /* Green - success states */
  --color-warning: #f57f17;        /* Orange - warnings */
  --color-danger: #d32f2f;         /* Red - errors */
  --color-background: #fafaf9;     /* Off-white - page background */
  --color-surface: #ffffff;        /* White - card backgrounds */
  --color-text: #1a1a1a;           /* Near-black - body text */
  --color-text-secondary: #666666; /* Gray - secondary text */
  --color-border: #e0e0e0;         /* Light gray - borders */
}
```

### Color Usage Guide

| Use Case | Color | CSS Variable |
|----------|-------|--------------|
| Main navigation, headers | Primary | `--color-primary` |
| Secondary buttons, accents | Secondary | `--color-secondary` |
| Primary buttons, links | Accent | `--color-accent` |
| Body text | Text | `--color-text` |
| Helper text, labels | Text Secondary | `--color-text-secondary` |
| Card/input borders | Border | `--color-border` |
| Page background | Background | `--color-background` |
| Cards, surfaces | Surface | `--color-surface` |

### Status Colors (Fixed)

```css
.status-active {
  background: #dcfce7;    /* Light green */
  color: #15803d;         /* Dark green text */
}

.status-at-risk {
  background: #fef3c7;    /* Light yellow */
  color: #b45309;         /* Dark yellow text */
}

.status-completed {
  background: #f3f4f6;    /* Light gray */
  color: #4b5563;         /* Dark gray text */
}

.status-unknown {
  background: #dbeafe;    /* Light blue */
  color: #1e40af;         /* Dark blue text */
}
```

## Typography

### Font Family
- **Family**: Geist (from Next.js default)
- **Fallback**: System sans-serif
- **Category**: Humanist sans-serif (modern, friendly)

### Font Sizes (Using Tailwind)
```
text-xs   = 12px   (labels, badges)
text-sm   = 14px   (secondary text)
text-base = 16px   (body text)
text-lg   = 18px   (headings)
text-xl   = 20px   (section headings)
text-2xl  = 24px   (page titles)
text-3xl  = 30px   (main headings)
```

### Font Weights
```
font-normal   = 400  (body text)
font-medium   = 500  (labels, emphasis)
font-semibold = 600  (card titles)
font-bold     = 700  (main headings)
```

### Line Heights
```
leading-relaxed = 1.625 (body text)
leading-6       = 1.5   (content)
tight           = 1.25  (headings)
```

## Spacing System

### Base Unit: 4px (Tailwind default)

```
p-1   = 4px    p-3  = 12px   p-6  = 24px
p-2   = 8px    p-4  = 16px   p-8  = 32px
```

### Common Patterns
```
Card padding:     p-6   (24px)
Form spacing:     gap-4 (16px)
Button padding:   px-4 py-2 (16px horizontal, 8px vertical)
Section margin:   my-8 (32px)
Component gap:    gap-4 (16px)
```

## Component Styling

### Buttons

#### Primary Button
```tsx
className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
```
- Background: Primary color
- Text: White
- Hover: Slight opacity reduction
- Radius: 8px

#### Secondary Button
```tsx
className="bg-[var(--color-secondary)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
```
- Background: Secondary color
- Text: White
- Hover: Opacity reduction

#### Outline Button
```tsx
className="border border-[var(--color-border)] text-[var(--color-text)] px-4 py-2 rounded-lg hover:bg-[var(--color-background)] transition"
```
- Border: 1px light gray
- Text: Body color
- Hover: Light background
- No fill

### Cards
```tsx
className="bg-[var(--color-surface)] rounded-lg shadow-sm border border-[var(--color-border)] p-6"
```
- Background: White surface
- Border: 1px light gray
- Shadow: Subtle (shadow-sm)
- Radius: 8px
- Padding: 24px

### Badges/Status
```tsx
className="px-3 py-1 rounded-full text-sm font-medium [bg-color] [text-color]"
```
- Horizontal padding: 12px
- Vertical padding: 4px
- Border radius: 9999px (fully rounded)
- Font size: 14px
- Font weight: 500

### Input Fields
```tsx
className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
```
- Full width
- Padding: 16px horizontal, 8px vertical
- Border: 1px light gray
- Focus: 2px primary color ring
- Radius: 8px

## Layout Patterns

### Container
```tsx
<div className="max-w-7xl mx-auto px-6">
  {/* Content */}
</div>
```
- Max width: 1280px
- Padding: 24px sides (smaller on mobile)
- Centered

### Grid Layout
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>
```
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns
- Gap: 24px

### Flex with Space Between
```tsx
<div className="flex justify-between items-center">
  {/* Left content */}
  {/* Right content */}
</div>
```
- Horizontal spacing
- Vertically centered
- Ends pushed to edges

### Header/Footer
```tsx
<header className="bg-[var(--color-primary)] text-white shadow-md">
  {/* Content */}
</header>
```
- Full width background
- White text
- Subtle shadow

## Shadow System

```
shadow-sm   = subtle, cards                    (0 1px 2px 0 rgba(0,0,0,0.05))
shadow      = medium, hover states
shadow-md   = noticeable, modals
shadow-lg   = prominent, dropdowns
```

## Border Radius

```
rounded      = 0.25rem (4px)   - small elements
rounded-lg   = 0.5rem  (8px)   - buttons, cards
rounded-full = 9999px          - badges, pills
```

## Responsive Breakpoints

```
No prefix  = Mobile   (< 640px)
sm:        = Small    (640px+)
md:        = Medium   (768px+)   - Tablets
lg:        = Large    (1024px+)  - Desktops
xl:        = X-Large  (1280px+)
2xl:       = 2X-Large (1536px+)
```

### Usage Example
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* 1 column on mobile, 2 on tablet, 3 on desktop */}
</div>
```

## Custom Utility Classes

Defined in `app/globals.css`:

### `.card`
Card container with shadow and border

### `.btn-primary`
Primary button with hover effect

### `.btn-secondary`
Secondary button with hover effect

### `.btn-outline`
Outlined button with border

### `.status-active`, `.status-at-risk`, `.status-completed`, `.status-unknown`
Status badges with semantic colors

### `.stage-badge`
Field stage indicator

## Animation & Transitions

### Hover Effects
- Buttons: `hover:opacity-90 transition`
- Cards: `hover:shadow-md transition` (optional)

### Loading States
```tsx
<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
```

### Transitions
```
transition         = all 150ms
transition-colors  = colors only
transition-shadow  = shadow only
```

## Customization Guide

### Change Primary Color
Edit `app/globals.css`:
```css
:root {
  --color-primary: #2d5016;  /* Change this */
}
```
All primary-dependent elements update automatically.

### Change Font
Edit `app/layout.tsx`:
```tsx
const yourFont = YourFont({
  variable: '--font-custom',
  subsets: ['latin'],
});
```

### Add New Color
Edit `app/globals.css` and `tailwind.config.ts`:
```css
/* globals.css */
--color-new: #yourcolor;
```

```typescript
// tailwind.config.ts
colors: {
  new: 'var(--color-new)',
}
```

### Create New Utility Class
Edit `app/globals.css` under `@layer components`:
```css
@layer components {
  .my-new-class {
    /* styles */
  }
}
```

## Dark Mode (Future Enhancement)

To add dark mode, update CSS variables:
```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-primary: #4ade80;
    --color-background: #0f172a;
    /* etc */
  }
}
```

## Accessibility

### Color Contrast
- All text meets WCAG AA standards (4.5:1 ratio)
- Status colors have distinct backgrounds
- No color alone conveys meaning (text + color)

### Focus States
- Interactive elements have visible focus rings
- Focus ring color: Primary color
- Ring width: 2px

### Semantic HTML
- Headings use `<h1>`, `<h2>`, etc. hierarchically
- Lists use `<ul>`, `<ol>`, `<li>`
- Forms use `<label>` with `htmlFor`
- Images have descriptive `alt` text

## Icons (None Used)

Design uses semantic HTML and Tailwind classes instead of icon libraries.

## Example Component

```tsx
export function MyComponent() {
  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">
        Title
      </h2>
      <p className="text-[var(--color-text-secondary)] mb-6">
        Description
      </p>
      <button className="btn-primary">
        Action
      </button>
    </div>
  );
}
```

## Design File Structure

```
frontend/app/
├── globals.css         ← All colors and utility classes
├── layout.tsx          ← Typography settings
└── tailwind.config.ts  ← Tailwind theme extension
```

## Color Palette Visualization

```
GREENS (Agricultural Theme):
  Dark Green (#2d5016)    ███ Primary brand
  Light Green (#7cb342)   ███ Secondary accent
  
NEUTRALS:
  Off-white (#fafaf9)     ███ Background
  White (#ffffff)         ███ Surface/Cards
  Gray (#666666)          ███ Secondary text
  Near-black (#1a1a1a)    ███ Body text
  
ACCENTS:
  Orange (#f57c00)        ███ Call-to-action
  Green (#388e3c)         ███ Success/Active
  Orange (#f57f17)        ███ Warning
  Red (#d32f2f)           ███ Danger
```

## Print Styles (Not Configured)

For future: Add `@media print` rules to hide navigation, adjust colors for black-and-white.

## Performance Notes

- CSS variables: No runtime overhead, compile-time
- Tailwind: Generates only used styles
- Fonts: System font fallback for fast load
- Images: Optimized via next/image (future)

---

**Design System Version**: 1.0  
**Last Updated**: April 2026  
**Framework**: Tailwind CSS 4 + CSS Variables  
**Status**: Production-ready
