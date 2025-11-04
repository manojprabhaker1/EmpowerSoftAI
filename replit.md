# EmpowerSoft - On-Demand Software Access Platform

## Overview

EmpowerSoft is a SaaS platform MVP that provides on-demand access to professional software applications. Users can browse software by category (Mechanical, Visual Media, IT Tools, Design, Development, Data Science), purchase active hours with configurable CPU/Memory tiers, and manage running applications through a dashboard interface. The platform features a glassmorphism/liquid glass design aesthetic with frosted surfaces, luminous gradients, and fluid animations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling**
- **React 18** with **Vite** as the build tool for fast development and optimized production builds
- **TypeScript** for type safety across the application
- **Wouter** for lightweight client-side routing (replaces React Router)
- **TanStack Query (React Query)** for server state management, caching, and data synchronization

**UI Component System**
- **shadcn/ui** component library built on Radix UI primitives for accessible, unstyled components
- **TailwindCSS** for utility-first styling with custom design tokens
- **class-variance-authority (CVA)** for managing component variants
- Custom **GlassCard** component implementing the glassmorphism aesthetic

**Styling Approach**
- Glassmorphism/liquid glass design system with layered transparency
- Custom color palette using CSS variables (HSL format) for theme flexibility
- Gradient backgrounds with animated effects
- Custom border radius tokens (9px, 6px, 3px)
- Poppins font family from Google Fonts
- Tailwind configuration extends base theme with custom colors, spacing, and effects

**State Management Strategy**
- **localStorage** for client-side user authentication (mock implementation)
- Local state management for purchased apps stored in browser storage
- React Query handles server state caching and synchronization
- Component-level state using React hooks (useState, useEffect)

### Backend Architecture

**Server Framework**
- **Express.js** on Node.js for RESTful API endpoints
- **ESM modules** (type: "module") for modern JavaScript syntax
- Custom middleware for request logging with timing information
- Request body parsing with JSON verification support

**Development Setup**
- **Vite middleware mode** for HMR (Hot Module Replacement) in development
- Custom logger with formatted timestamps
- Development-only plugins: cartographer (code mapping) and dev banner
- Production build uses esbuild for server bundling

**API Structure**
- `/api/auth/signup` - User registration endpoint (mock implementation)
- `/api/auth/login` - User authentication endpoint (mock implementation)
- `/api/apps/purchased` - Retrieve user's purchased applications
- `/api/apps/purchase` - Purchase new application access
- `/api/apps/:id` - Update application status (pause/resume)
- `/api/apps/:id/delete` - Remove purchased application

**Authentication & Sessions**
- Mock authentication using localStorage on client side
- Session management prepared for **connect-pg-simple** (PostgreSQL session store)
- User validation with Zod schemas from shared types

### Data Storage Solutions

**Database Configuration**
- **Drizzle ORM** configured for PostgreSQL with schema-first approach
- **Neon Database** serverless PostgreSQL (@neondatabase/serverless driver)
- Schema defined in `shared/schema.ts` for type safety across client/server
- Migration files output to `./migrations` directory
- Database URL configured via environment variable

**Data Models**

**Users Table**
- id (UUID primary key, auto-generated)
- username (unique text field)
- password (text field - mock implementation stores plaintext for demo)

**PurchasedApp Interface** (currently in-memory, prepared for database)
- Tracks user's software purchases with tier selection
- Manages active hours, used hours, retention periods
- Status tracking (Running, Paused, Stopped)
- Timestamps for purchase and last activity

**Storage Implementation**
- Current: In-memory storage using Map data structures (MemStorage class)
- Interface-based design (IStorage) allows easy swap to database persistence
- Prepared for Drizzle ORM integration with PostgreSQL

### External Dependencies

**UI Component Libraries**
- **Radix UI** (@radix-ui/*) - 20+ accessible component primitives (dialog, dropdown, popover, etc.)
- **Lucide React** - Icon library for consistent iconography
- **cmdk** - Command palette component
- **embla-carousel-react** - Touch-friendly carousel component
- **react-day-picker** - Date picker functionality

**Form & Validation**
- **react-hook-form** - Performant form state management
- **@hookform/resolvers** - Integration with validation schemas
- **Zod** - TypeScript-first schema validation
- **drizzle-zod** - Auto-generate Zod schemas from Drizzle tables

**Utility Libraries**
- **clsx** & **tailwind-merge** - Conditional CSS class composition
- **date-fns** - Date manipulation and formatting
- **nanoid** - Unique ID generation

**Development Tools**
- **@replit/vite-plugin-runtime-error-modal** - Error overlay for Replit environment
- **@replit/vite-plugin-cartographer** - Code navigation assistance
- **@replit/vite-plugin-dev-banner** - Development mode indicator
- **tsx** - TypeScript execution for development server
- **esbuild** - Fast JavaScript bundler for production builds

**Database & ORM**
- **drizzle-orm** - TypeScript ORM with zero runtime overhead
- **drizzle-kit** - Schema management and migration tools
- **@neondatabase/serverless** - Serverless PostgreSQL driver for edge environments

**Session Management** (prepared but not yet implemented)
- **connect-pg-simple** - PostgreSQL session store for Express

**Build Considerations**
- Application uses path aliases (@/, @shared/, @assets/) requiring proper resolution
- Server and client build separately with different output directories
- Static assets served from dist/public in production
- Environment variable DATABASE_URL required for database operations