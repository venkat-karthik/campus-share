# Campus Share - Architecture Overview

## 🏗️ Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    React App                          │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │          Error Boundary (Global)                │  │  │
│  │  │  ┌───────────────────────────────────────────┐  │  │  │
│  │  │  │      React Query Provider                 │  │  │  │
│  │  │  │  ┌─────────────────────────────────────┐  │  │  │  │
│  │  │  │  │        Auth Provider                │  │  │  │  │
│  │  │  │  │  ┌───────────────────────────────┐  │  │  │  │  │
│  │  │  │  │  │      Route Guard              │  │  │  │  │  │
│  │  │  │  │  │  ┌─────────────────────────┐  │  │  │  │  │  │
│  │  │  │  │  │  │   Lazy Loaded Routes    │  │  │  │  │  │  │
│  │  │  │  │  │  │   - Login               │  │  │  │  │  │  │
│  │  │  │  │  │  │   - Register            │  │  │  │  │  │  │
│  │  │  │  │  │  │   - Zones               │  │  │  │  │  │  │
│  │  │  │  │  │  │   - Share Zone          │  │  │  │  │  │  │
│  │  │  │  │  │  │   - Receive Zone        │  │  │  │  │  │  │
│  │  │  │  │  │  │   - Announcements       │  │  │  │  │  │  │
│  │  │  │  │  │  │   - Attendance          │  │  │  │  │  │  │
│  │  │  │  │  │  │   - Lost & Found        │  │  │  │  │  │  │
│  │  │  │  │  │  │   - Clubs               │  │  │  │  │  │  │
│  │  │  │  │  │  │   - Admin               │  │  │  │  │  │  │
│  │  │  │  │  │  └─────────────────────────┘  │  │  │  │  │  │
│  │  │  │  │  └───────────────────────────────┘  │  │  │  │  │
│  │  │  │  └─────────────────────────────────────┘  │  │  │  │
│  │  │  └───────────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/WebSocket
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Backend                          │
│  ┌───────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │  PostgreSQL   │  │     Auth     │  │     Storage     │  │
│  │   Database    │  │   Service    │  │    (Images)     │  │
│  │               │  │              │  │                 │  │
│  │  - profiles   │  │  - JWT       │  │  - Compression  │  │
│  │  - items      │  │  - Sessions  │  │  - Public URLs  │  │
│  │  - announce   │  │  - RLS       │  │                 │  │
│  │  - attendance │  │              │  │                 │  │
│  │  - lost_found │  │              │  │                 │  │
│  │  - clubs      │  │              │  │                 │  │
│  │  - events     │  │              │  │                 │  │
│  └───────────────┘  └──────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 📁 File Structure

```
app-8yy119savwg1/
├── public/                      # Static assets
│   ├── favicon.png
│   └── images/
│
├── src/
│   ├── components/
│   │   ├── common/              # Reusable components
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── FilterBar.tsx
│   │   │   ├── OptimizedImage.tsx
│   │   │   ├── RouteGuard.tsx
│   │   │   └── IntersectObserver.tsx
│   │   │
│   │   ├── layouts/             # Layout components
│   │   │   └── MainLayout.tsx
│   │   │
│   │   ├── ui/                  # Radix UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ... (30+ components)
│   │   │
│   │   ├── ItemCard.tsx         # Feature components
│   │   ├── ItemForm.tsx
│   │   ├── Navbar.tsx
│   │   └── dropzone.tsx
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx      # Authentication context
│   │
│   ├── db/
│   │   ├── supabase.ts          # Supabase client
│   │   └── api.ts               # API functions
│   │
│   ├── hooks/
│   │   ├── use-shared-items.ts  # React Query hooks
│   │   ├── use-announcements.ts
│   │   ├── use-attendance.ts
│   │   ├── use-lost-found.ts
│   │   ├── use-clubs.ts
│   │   ├── use-admin.ts
│   │   ├── use-pagination.ts    # Utility hooks
│   │   ├── use-debounce.ts
│   │   ├── use-image-upload.ts
│   │   ├── use-mobile.ts
│   │   └── use-toast.tsx
│   │
│   ├── lib/
│   │   ├── logger.ts            # Logging utility
│   │   ├── api-client.ts        # API error handling
│   │   ├── validators.ts        # Zod schemas
│   │   ├── query-client.ts      # React Query config
│   │   └── utils.ts             # General utilities
│   │
│   ├── pages/
│   │   ├── LoginPage.tsx        # ✅ Updated
│   │   ├── RegisterPage.tsx     # ✅ Updated
│   │   ├── ZonesPage.tsx
│   │   ├── ShareZonePage.tsx    # ✅ Updated (React Query)
│   │   ├── ReceiveZonePage.tsx  # ✅ Updated (Full)
│   │   ├── AnnouncementsPage.tsx # ✅ Updated (Full)
│   │   ├── AttendancePage.tsx   # ⏳ Needs update
│   │   ├── LostFoundPage.tsx    # ⏳ Needs update
│   │   ├── ClubsPage.tsx        # ⏳ Needs update
│   │   ├── AdminPage.tsx        # ⏳ Needs update
│   │   └── NotFound.tsx
│   │
│   ├── services/                # Future: Additional services
│   │
│   ├── test/
│   │   └── setup.ts             # Test configuration
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── types.ts             # Type definitions
│   │   └── virtual-modules.d.ts
│   │
│   ├── App.tsx                  # ✅ Updated (Error boundary, React Query)
│   ├── main.tsx                 # Entry point
│   ├── routes.tsx               # Route configuration
│   ├── index.css                # Global styles
│   └── vite-env.d.ts
│
├── supabase/
│   ├── migrations/
│   │   ├── 00001_create_initial_schema.sql
│   │   └── 00002_create_auth_trigger_and_policies.sql
│   └── config.toml
│
├── .env.example                 # ✅ Environment template
├── .gitignore                   # ✅ Updated
├── biome.json                   # Linter config
├── components.json              # Shadcn config
├── index.html
├── package.json                 # ✅ Updated
├── pnpm-lock.yaml
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json                # ✅ Updated (Strict)
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts               # ✅ Updated (PWA, compression)
├── vitest.config.ts             # ✅ New (Testing)
│
├── IMPROVEMENTS.md              # ✅ Implementation guide
├── IMPLEMENTATION_SUMMARY.md    # ✅ What's done
├── QUICK_START.md               # ✅ Quick reference
├── UPGRADE_CHECKLIST.md         # ✅ Step-by-step guide
├── WHATS_DONE.md                # ✅ Summary
└── ARCHITECTURE.md              # ✅ This file
```

## 🔄 Data Flow

### 1. User Action → React Query → Supabase

```
User clicks "Create Item"
    ↓
Form submission
    ↓
useCreateSharedItem() mutation
    ↓
createSharedItem() API function
    ↓
Supabase client
    ↓
PostgreSQL database
    ↓
Response back to React Query
    ↓
Automatic cache invalidation
    ↓
UI updates automatically
```

### 2. Page Load → React Query → Cache

```
User navigates to Receive Zone
    ↓
useSharedItemsByZone(zone) hook
    ↓
Check React Query cache
    ↓
If cached: Return immediately
If not: Fetch from Supabase
    ↓
Store in cache (5 min stale time)
    ↓
Render with data
```

### 3. Search/Filter → Client-side

```
User types in search
    ↓
Debounce (300ms)
    ↓
useMemo filters data
    ↓
usePagination paginates filtered data
    ↓
Render paginated results
```

## 🎯 Component Hierarchy

```
App
├── ErrorBoundary
│   └── QueryClientProvider
│       └── Router
│           └── AuthProvider
│               └── RouteGuard
│                   ├── Public Routes
│                   │   ├── LoginPage
│                   │   └── RegisterPage
│                   │
│                   └── Protected Routes
│                       └── MainLayout
│                           ├── Navbar
│                           └── Outlet
│                               ├── ZonesPage
│                               ├── ShareZonePage
│                               │   ├── SearchBar
│                               │   ├── ItemCard[]
│                               │   └── Pagination
│                               │
│                               ├── ReceiveZonePage
│                               │   ├── SearchBar
│                               │   ├── FilterBar
│                               │   ├── ItemCard[]
│                               │   └── Pagination
│                               │
│                               ├── AnnouncementsPage
│                               │   ├── SearchBar
│                               │   ├── FilterBar
│                               │   ├── AnnouncementCard[]
│                               │   └── Pagination
│                               │
│                               └── ... (other pages)
```

## 🔌 Hook Dependencies

```
Page Component
    ↓
React Query Hook (e.g., useSharedItems)
    ↓
API Function (e.g., getSharedItems)
    ↓
Supabase Client
    ↓
Database

Utility Hooks:
- usePagination (data) → paginated data
- useDebounce (value, delay) → debounced value
- useToast () → toast function
```

## 🗄️ State Management

### Global State (React Context)
- **AuthContext**: User authentication state
  - user: Current user object
  - profile: User profile data
  - loading: Auth loading state
  - signIn, signUp, signOut functions

### Server State (React Query)
- **Shared Items**: Cached by user/zone
- **Announcements**: Cached globally
- **Attendance**: Cached by user
- **Lost & Found**: Cached globally
- **Clubs**: Cached globally
- **Events**: Cached by club
- **Profiles**: Cached globally (admin)

### Local State (useState)
- Search queries
- Filter selections
- Dialog open/close
- Form inputs

## 🔐 Security Layers

```
1. Client-side
   ├── RouteGuard (authentication check)
   ├── Role checks (admin features)
   └── Input validation (Zod schemas)

2. Supabase
   ├── JWT authentication
   ├── Row Level Security (RLS)
   └── API key restrictions

3. Database
   ├── Foreign key constraints
   ├── Unique constraints
   └── Check constraints
```

## 📊 Performance Optimizations

### Bundle Splitting
```
main.js (400KB)
├── react-vendor.js (150KB)
├── ui-vendor.js (100KB)
├── query-vendor.js (50KB)
├── supabase-vendor.js (50KB)
└── route chunks (lazy loaded)
    ├── LoginPage.js
    ├── ReceiveZonePage.js
    └── ... (other routes)
```

### Caching Strategy
```
React Query Cache
├── Stale time: 5 minutes
├── Cache time: 30 minutes
└── Refetch on:
    ├── Window focus: No
    ├── Reconnect: Yes
    └── Mount: Yes (if stale)

Service Worker Cache
├── Static assets: Cache first
├── API calls: Network first
└── Images: Cache first
```

## 🧪 Testing Strategy

```
Unit Tests (Vitest)
├── Utility functions
├── Custom hooks
└── Helper functions

Component Tests (React Testing Library)
├── Common components
├── Form components
└── Feature components

Integration Tests
├── Page components
├── User flows
└── API interactions

E2E Tests (Future: Playwright)
├── Critical user paths
├── Authentication flows
└── Data operations
```

## 🚀 Build Process

```
Development
├── Vite dev server
├── Hot module replacement
├── React Query DevTools
└── Source maps

Production
├── TypeScript compilation
├── Code splitting
├── Tree shaking
├── Minification
├── Gzip/Brotli compression
├── PWA generation
└── Bundle analysis
```

## 📈 Monitoring (Future)

```
Error Tracking (Sentry)
├── JavaScript errors
├── API errors
└── Performance issues

Analytics
├── Page views
├── User actions
└── Conversion tracking

Performance
├── Web Vitals
├── Bundle size
└── API response times
```

## 🔄 Deployment Flow

```
Local Development
    ↓
Git commit
    ↓
Push to repository
    ↓
CI/CD Pipeline
    ↓
Build & Test
    ↓
Deploy to hosting
    ↓
Production
```

---

This architecture provides:
- ✅ Scalability
- ✅ Maintainability
- ✅ Performance
- ✅ Security
- ✅ Developer experience
- ✅ User experience
