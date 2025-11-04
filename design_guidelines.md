# EmpowerSoft Design Guidelines

## Design Approach

**Glassmorphism/Liquid Glass Aesthetic** - A futuristic SaaS platform featuring frosted glass surfaces, luminous gradients, and depth through transparency. Drawing inspiration from modern fintech and SaaS platforms like Stripe and Vercel, combined with the ethereal glass aesthetic popularized by Apple's design language.

## Core Design Principles

1. **Layered Transparency**: Create depth through overlapping translucent surfaces
2. **Luminous Interactions**: Subtle glow effects on hover and active states
3. **Fluid Motion**: Soft transitions and gentle animations throughout
4. **Premium Feel**: High-end aesthetic befitting enterprise software platform

## Typography

**Primary Font**: Inter or Poppins (via Google Fonts)

- **Hero Headings**: 4xl to 6xl, font-weight 700-800, letter-spacing tight
- **Section Headings**: 2xl to 3xl, font-weight 600-700
- **Card Titles**: xl, font-weight 600
- **Body Text**: base to lg, font-weight 400-500
- **Metadata/Labels**: sm to base, font-weight 500, text opacity 70-80%
- **Buttons**: base, font-weight 600, uppercase tracking-wide for primary CTAs

## Color System

**Brand Palette** (all with transparency variations):
- **Primary Cyan**: cyan-400 to cyan-500 (for accents, buttons, highlights)
- **Secondary Purple**: purple-400 to purple-600 (for gradients, secondary elements)
- **Tertiary Blue**: blue-400 to blue-500 (for links, info states)
- **Success Green**: emerald-400 (Running status)
- **Warning Orange**: amber-400 (Paused status)
- **Danger Red**: red-400 (Delete actions)

**Background Layers**:
- **Base**: Dark gradient (slate-900 to indigo-950)
- **Glass Surfaces**: white/10 to white/20 with backdrop-blur-xl
- **Elevated Cards**: white/15 with backdrop-blur-2xl
- **Borders**: white/20 to white/30 for subtle definition

**Gradient Applications**:
- Hero background: Animated gradient from cyan-500/30 via purple-500/20 to blue-600/30
- Button gradients: cyan-500 to blue-600 for primary actions
- Card hover effects: Subtle gradient overlays with increased opacity

## Layout System

**Spacing Units**: Primarily use Tailwind units 4, 6, 8, 12, 16, 24 for consistent rhythm

**Container Widths**:
- Landing sections: max-w-7xl
- Dashboard content: max-w-6xl
- Form cards: max-w-md to max-w-lg
- Modal dialogs: max-w-2xl

**Section Padding**:
- Desktop: py-20 to py-24
- Mobile: py-12 to py-16
- Card internal padding: p-6 to p-8

## Component Library

### Landing Page Components

**Hero Section**:
- Full viewport height (min-h-screen) with animated gradient background
- Large glassmorphic card (max-w-4xl) with backdrop-blur-2xl
- Logo placement: top-center or left-aligned, 48-64px height
- Headline: Ultra-bold, 5xl-6xl, with gradient text effect (cyan to purple)
- Subheadline: lg-xl, text-white/80, max-w-2xl
- CTA buttons: Large rounded-full buttons with glass effect and glow hover
- Floating glass particles/orbs in background for depth

**Feature Cards** (3-column grid on desktop):
- Frosted glass cards with border-white/20
- Icon placement: top-left or centered, with gradient background circle
- Rounded-3xl corners
- Hover: Lift effect (transform scale-105) with increased glow

### Authentication Pages

**Login/Signup Cards**:
- Centered glassmorphic card (max-w-md)
- Background: Simplified gradient similar to hero
- Form inputs: Glass-style with border-white/30, backdrop-blur-md
- Input focus state: border-cyan-400 with subtle glow
- Submit button: Full-width gradient button with glass effect
- Link elements: text-cyan-400 with hover-brightness

### Dashboard Components

**App Table/Cards** (Choose card grid over table for better glass aesthetic):
- Grid layout: 1 column mobile, 2 columns tablet, 3 columns desktop
- Each card features:
  - Top section: App icon/logo (64x64) + app name (text-xl font-semibold)
  - Status badge: Rounded-full pill with color-coded glass background (green/20 for Running, amber/20 for Paused)
  - Metrics section: 3-column mini-grid showing "Used Hours | Remaining Active | Retention Days"
  - Cost display: Large text-2xl with gradient effect
  - Action buttons row: Glass icon buttons with hover glow (Launch, Pause, Delete)
- Floating "+ Get New App" FAB: Fixed bottom-right, large rounded-full button with gradient and shadow-2xl

**Metric Display Pattern**:
- Label: text-sm uppercase tracking-wide text-white/60
- Value: text-2xl font-bold with gradient or colored text
- Icon integration: Small 16x16 icons next to labels

### Catalog Components

**Category Sections**:
- Category headers: text-2xl font-bold with gradient underline effect
- App grid: 4 columns desktop, 2 columns tablet, 1 column mobile
- Card design: Square aspect ratio with app icon, glassmorphic overlay

**App Purchase Modal**:
- Large centered dialog (max-w-2xl) with heavy backdrop blur
- Header: App icon + name + close button
- Configuration section with glass input containers:
  - CPU/Memory tier dropdown: Custom glass select with gradient hover
  - Active hours slider or input: Glass-styled with cyan track
  - Real-time cost calculator: Prominently displayed (text-3xl) with animation on change
- Tier visualization: 3 glass cards (Low/Medium/High) with radio selection
- Summary panel: Frosted glass box showing breakdown
- Action buttons: Cancel (ghost glass) + Get App (gradient solid)

### Workspace Page

**Active Session Display**:
- Full-screen layout with header bar
- Large centered area: Deep glass panel with app name + status
- Control strip: Bottom-aligned glass bar with Pause/Terminate buttons
- Session timer: Large countdown display with gradient text
- Status indicators: Pulsing glow effects for active state

### Help & Documentation

**FAQ Accordion**:
- Glass cards with smooth expand/collapse
- Question: text-lg font-semibold
- Answer: text-white/70 with increased padding

**Contact Form**:
- Similar to login card but wider (max-w-2xl)
- Textarea: Glass-styled with minimum height
- Submit button: Gradient with send icon

## Visual Effects

**Glassmorphism Properties** (apply consistently):
- Background: bg-white/10 to bg-white/20
- Backdrop filter: backdrop-blur-xl to backdrop-blur-2xl
- Border: border border-white/20 to border-white/30
- Shadow: shadow-xl to shadow-2xl with colored shadows (shadow-cyan-500/20)

**Hover States**:
- Cards: Scale-102 transform with increased glow (shadow-cyan-500/40)
- Buttons: Brightness-110 with scale-105
- Glass surfaces: Increase opacity by 5% (bg-white/15 to bg-white/20)

**Glow Effects**:
- Primary elements: box-shadow with cyan-500 color
- Active states: Animated pulsing glow
- Status indicators: Colored glow matching status (green for running, amber for paused)

**Animations**:
- Page transitions: Fade-in with slight slide-up (300ms)
- Modal entry: Scale from 95% to 100% with fade
- Background gradient: Subtle continuous animation (15-20s loop)
- Metric updates: Number count-up animation
- Loading states: Shimmer effect across glass surfaces

## Responsive Behavior

**Breakpoint Strategy**:
- Mobile (<768px): Single column, full-width glass cards, stacked navigation
- Tablet (768-1024px): 2-column grids, condensed spacing
- Desktop (>1024px): Full multi-column layouts, generous spacing

**Mobile Adaptations**:
- Reduce glass blur intensity slightly for performance
- Simplify gradient animations
- Stack dashboard metrics vertically
- Bottom navigation bar for main actions

## Images

**Hero Section Image**: Large abstract background image showing futuristic digital workspace or holographic interface - placed as full-screen background layer beneath gradient overlay, opacity 20-30% for subtle texture

**App Icons**: Use official software logos (64x64 to 128x128) placed prominently on catalog cards and dashboard cards - sourced from logo CDNs or placeholder icon service

**Empty States**: Illustration of floating glass panels or abstract 3D workspace when no apps purchased - centered in dashboard with max-w-md

**Category Headers**: Optional subtle iconography (256x256) as watermark behind category titles with very low opacity (10%)