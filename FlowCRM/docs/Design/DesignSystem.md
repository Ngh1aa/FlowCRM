# FlowCRM - Design System

**Version:** 1.0
**Last Updated:** 2024

---

## 1. Design Philosophy

FlowCRM's design embodies **"Professional Clarity"** - a clean, organized aesthetic that mirrors the clarity businesses want in their CRM. The design balances:

- **Information density** vs **visual breathing room**
- **Familiar patterns** (spreadsheets, Kanban) vs **modern polish**
- **Quick actions** vs **deep navigation**

---

## 2. Color Palette

### Primary Colors (Blue)

| Token | Hex | Usage |
|-------|-----|-------|
| `--primary-50` | #eff6ff | Subtle backgrounds, hover states |
| `--primary-100` | #dbeafe | Focus rings, light badges |
| `--primary-200` | #bfdbfe | Borders, dividers |
| `--primary-300` | #93c5fd | Disabled states |
| `--primary-400` | #60a5fa | Icons, secondary elements |
| `--primary-500` | #3b82f6 | Primary actions |
| `--primary-600` | #2563eb | Primary buttons, links |
| `--primary-700` | #1d4ed8 | Hover states |
| `--primary-800` | #1e40af | Active states |
| `--primary-900` | #1e3a8a | Dark accents |

### Neutral Colors (Gray)

| Token | Hex | Usage |
|-------|-----|-------|
| `--gray-50` | #f9fafb | Page background |
| `--gray-100` | #f3f4f6 | Card backgrounds |
| `--gray-200` | #e5e7eb | Borders, dividers |
| `--gray-300` | #d1d5db | Disabled text |
| `--gray-400` | #9ca3af | Placeholder text |
| `--gray-500` | #6b7280 | Secondary text |
| `--gray-600` | #4b5563 | Body text |
| `--gray-700` | #374151 | Headings |
| `--gray-800` | #1f2937 | Sidebar background |
| `--gray-900` | #111827 | Primary text |

### Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--success-50` | #ecfdf5 | Success backgrounds |
| `--success-500` | #10b981 | Success icons |
| `--success-600` | #059669 | Success buttons |
| `--warning-50` | #fffbeb | Warning backgrounds |
| `--warning-500` | #f59e0b | Warning icons |
| `--warning-600` | #d97706 | Warning buttons |
| `--danger-50` | #fef2f2 | Danger backgrounds |
| `--danger-500` | #ef4444 | Danger icons |
| `--danger-600` | #dc2626 | Danger buttons |
| `--info-50` | #f0f9ff | Info backgrounds |
| `--info-500` | #0ea5e9 | Info icons |
| `--info-600` | #0284c7 | Info buttons |

---

## 3. Typography

### Font Family

**Primary:** Inter
- Clean, professional sans-serif
- Excellent for UI and data
- Fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif

**Monospace:** JetBrains Mono (for numbers/codes)
- Fallback: 'Fira Code', monospace

### Type Scale

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `--text-xs` | 0.75rem (12px) | 400-600 | 1.5 | Captions, badges |
| `--text-sm` | 0.875rem (14px) | 400-600 | 1.5 | Table content, buttons |
| `--text-base` | 1rem (16px) | 400 | 1.5 | Body text |
| `--text-lg` | 1.125rem (18px) | 500 | 1.25 | Modal titles |
| `--text-xl` | 1.25rem (20px) | 600 | 1.25 | Page titles |
| `--text-2xl` | 1.5rem (24px) | 700 | 1.25 | Section headers |
| `--text-3xl` | 1.875rem (30px) | 700 | 1 | KPI values |
| `--text-4xl` | 2.25rem (36px) | 700 | 1 | Hero text |

### Font Weights

| Token | Value | Usage |
|-------|-------|-------|
| `--font-normal` | 400 | Body text |
| `--font-medium` | 500 | Emphasis, labels |
| `--font-semibold` | 600 | Headings, buttons |
| `--font-bold` | 700 | KPI values, important text |

---

## 4. Spacing System

Base unit: **4px**

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 0.25rem (4px) | Tight gaps |
| `--space-2` | 0.5rem (8px) | Small gaps |
| `--space-3` | 0.75rem (12px) | Icon gaps |
| `--space-4` | 1rem (16px) | Standard gaps |
| `--space-5` | 1.25rem (20px) | Card padding |
| `--space-6` | 1.5rem (24px) | Section padding |
| `--space-8` | 2rem (32px) | Large gaps |
| `--space-10` | 2.5rem (40px) | Section margins |
| `--space-12` | 3rem (48px) | Page sections |
| `--space-16` | 4rem (64px) | Major divisions |

---

## 5. Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 0.25rem (4px) | Small elements |
| `--radius-md` | 0.375rem (6px) | Inputs, small buttons |
| `--radius-lg` | 0.5rem (8px) | Cards, nav items |
| `--radius-xl` | 0.75rem (12px) | Cards, modals |
| `--radius-2xl` | 1rem (16px) | Large cards |
| `--radius-full` | 9999px | Avatars, pills |

---

## 6. Shadows

| Token | Usage |
|-------|-------|
| `--shadow-sm` | Subtle elevation, hover states |
| `--shadow-md` | Cards, dropdowns |
| `--shadow-lg` | Modals, popovers |
| `--shadow-xl` | Large modals, dialogs |

### Shadow Formula

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
```

---

## 7. Components

### Buttons

**Primary Button**
- Background: `--primary-600`
- Text: white
- Hover: `--primary-700`
- Padding: 12px 16px
- Border-radius: `--radius-lg`
- Icon size: 18px

**Secondary Button**
- Background: `--gray-100`
- Text: `--gray-700`
- Hover: `--gray-200`

**Ghost Button**
- Background: transparent
- Text: `--gray-600`
- Hover: `--gray-100` background

**Danger Button**
- Background: `--danger-500`
- Text: white

**Sizes:**
- `.btn-sm`: 8px 12px padding, 12px font
- `.btn` (default): 12px 16px padding, 14px font
- `.btn-lg`: 16px 24px padding, 16px font

### Cards

**KPI Card**
- Background: white
- Border: 1px solid `--gray-100`
- Border-radius: `--radius-xl`
- Padding: 20px
- Shadow: `--shadow-sm`

**Chart Card**
- Same as KPI card
- Header with title + tabs

### Form Elements

**Text Input**
- Height: 44px
- Padding: 12px 16px
- Border: 1px solid `--gray-300`
- Border-radius: `--radius-lg`
- Focus: blue ring (3px `--primary-100`)

**Select**
- Same as text input
- Dropdown arrow icon
- Custom styled (no native)

### Badges & Tags

**Status Badge**
- Padding: 4px 10px
- Border-radius: `--radius-full`
- Font-size: 12px
- Dot indicator (6px) before text

**Tag Badge**
- Padding: 2px 8px
- Border-radius: `--radius-full`
- Font-size: 12px
- Font-weight: 500

### Modal

- Max-width: 560px
- Border-radius: `--radius-2xl`
- Shadow: `--shadow-xl`
- Header: 20px 24px padding, border-bottom
- Body: 24px padding, scrollable
- Footer: 16px 24px padding, border-top, right-aligned

---

## 8. Layout Specifications

### Bento Grid (Dashboard)

12-column grid, 16px gaps

| Component | Span | Rows |
|-----------|------|------|
| KPI Card | 3 columns | 1 row |
| Pipeline Chart | 8 columns | 1 row |
| Today's Tasks | 4 columns | 1 row |
| Activity Feed | 8 columns | 1 row |

### Kanban Board

5 columns, equal width, min 280px each

| Stage | Color Dot |
|-------|-----------|
| Qualification | Primary (blue) |
| Proposal | Warning (yellow) |
| Negotiation | Info (cyan) |
| Closed Won | Success (green) |
| Closed Lost | Gray |

### Customer Table

8 columns with fixed and flexible widths:
- Checkbox: 48px
- Name: flex (min 180px)
- Company: 140px
- Email: 180px
- Phone: 120px
- Status: 100px
- Latest Deal: 140px
- Actions: 100px

---

## 9. Animation & Transitions

### Timing

| Token | Value | Usage |
|-------|-------|-------|
| `--transition-fast` | 150ms | Hovers, small changes |
| `--transition-normal` | 250ms | Modals, panels |
| `--transition-slow` | 350ms | Page transitions |

### Easing

Default: `ease`

### Interactions

**Button Hover:** background-color transition
**Card Hover:** box-shadow transition, slight scale (1.02)
**Modal Open:** opacity + scale (0.95 → 1)
**Drag Active:** opacity 0.5, scale 1.02

---

## 10. Responsive Breakpoints

| Breakpoint | Width | Columns | Notes |
|------------|-------|---------|-------|
| Desktop | 1200px+ | Full 12 | Primary target |
| Tablet | 992px-1199px | 6 or 3 | Sidebar collapsible |
| Mobile | < 768px | 1 | Stacked layout |

---

## 11. Accessibility

### Color Contrast

- Text on white: 10.8:1 (passes AAA)
- Text on gray-500: 4.5:1 (passes AA)
- Interactive elements: minimum 3:1

### Focus States

- 2px blue ring
- Offset 2px from element
- Visible on all interactive elements

### Screen Reader

- ARIA labels on icons
- Semantic HTML structure
- Form labels properly associated