# HODL Routing Guide

## New Routing Structure

### Public Routes (No Authentication Required)

| Route | Description | File Location |
|-------|-------------|---------------|
| `/` | Landing page with 3D robot | `app/page.tsx` |
| `/sign-in` | Sign in page | `app/(auth)/sign-in/page.tsx` |
| `/sign-up` | Sign up page | `app/(auth)/sign-up/page.tsx` |

### Protected Routes (Authentication Required)

All routes under `/dashboard` require authentication. Unauthenticated users are automatically redirected to `/sign-in`.

| Route | Description | File Location |
|-------|-------------|---------------|
| `/dashboard` | Main dashboard (stocks, crypto, widgets) | `app/dashboard/page.tsx` |
| `/dashboard/watchlist` | User watchlist | `app/dashboard/watchlist/page.tsx` |
| `/dashboard/base` | Base chain integration & swaps | `app/dashboard/base/page.tsx` |
| `/dashboard/gamification` | Gamification features | `app/dashboard/gamification/page.tsx` |
| `/dashboard/stocks/[symbol]` | Individual stock details | `app/dashboard/stocks/[symbol]/page.tsx` |

### User Flow

```
┌─────────────────┐
│   Visit "/"     │
│  (Landing Page) │
└────────┬────────┘
         │
    User clicks
  "Get Started" or
    "Sign Up"
         │
         ▼
┌─────────────────┐
│   "/sign-up"    │
│  (Create Account)│
└────────┬────────┘
         │
    Successful
   Registration
         │
         ▼
┌─────────────────┐
│   "/sign-in"    │
│  (if not auto-  │
│   logged in)    │
└────────┬────────┘
         │
    Successful
      Login
         │
         ▼
┌─────────────────┐
│  "/dashboard"   │
│  (Main App)     │
└─────────────────┘
         │
         ├──────────────────────┬──────────────────────┬────────────────────┐
         │                      │                      │                    │
         ▼                      ▼                      ▼                    ▼
  "/dashboard/          "/dashboard/          "/dashboard/        "/dashboard/
   watchlist"            base"                gamification"        stocks/AAPL"
```

### Authentication Redirects

#### For Unauthenticated Users:
- ✅ Can access: `/`, `/sign-in`, `/sign-up`
- ❌ Trying to access `/dashboard/*` → Redirects to `/sign-in`

#### For Authenticated Users:
- ✅ Can access: `/`, `/dashboard/*`
- ❌ Trying to access `/sign-in` or `/sign-up` → Redirects to `/dashboard`

### Middleware Logic

```typescript
// Location: middleware/index.ts

if (pathname === '/') {
  // Landing page is public for everyone
  return NextResponse.next();
}

if ((pathname === '/sign-in' || pathname === '/sign-up') && sessionCookie) {
  // Logged-in users can't access auth pages
  return NextResponse.redirect("/dashboard");
}

if (pathname.startsWith('/dashboard') && !sessionCookie) {
  // Dashboard requires authentication
  return NextResponse.redirect("/sign-in");
}
```

### Navigation Constants

```typescript
// Location: lib/constants.ts

export const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/search', label: 'Search' },
  { href: '/dashboard/watchlist', label: 'Watchlist' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/consultation', label: 'AI Advisor' },
  { href: '/dashboard/base', label: 'Base Chain' },
  { href: '/dashboard/gamification', label: 'Gamification' },
];
```

### Landing Page Sections

The landing page (`/`) includes these sections accessible via hash links:

| Hash Link | Section | Component |
|-----------|---------|-----------|
| `#why-hodl` | Why HODL? | `WhyHODLSection` |
| `#how-it-works` | How It Works | `HowItWorksSection` |
| `#transparency` | Transparency & Proof of Reserves | `TransparencySection` |
| `#features` | Features | `FeaturesSection` |

### Common Navigation Patterns

#### Landing Page Header
- "Log In" button → `/sign-in`
- "Sign Up" button → `/sign-up`
- "Why HODL?" link → `#why-hodl` (smooth scroll on same page)
- "Transparency" link → `#transparency` (smooth scroll on same page)

#### Dashboard Header
- Logo → `/` (back to landing, allowed for authenticated users)
- Navigation items → Various `/dashboard/*` routes
- "Logout" → Calls `signOut()` → redirects to `/sign-in`

### Logo Behavior

| Location | Logo Link | After Click |
|----------|-----------|-------------|
| Landing Page Header | `/` | Scrolls to top of landing page |
| Dashboard Header | `/` | Returns to landing page (still authenticated) |

**Note**: Clicking the logo from the dashboard takes you back to the landing page, but you remain logged in. You can access the dashboard again via the header navigation or by visiting `/dashboard` directly.

### Testing URLs

```bash
# Start dev server
npm run dev

# Test routes:
http://localhost:3000/                    # Landing page
http://localhost:3000/sign-up             # Sign up form
http://localhost:3000/sign-in             # Sign in form
http://localhost:3000/dashboard           # Main dashboard (requires auth)
http://localhost:3000/dashboard/watchlist # Watchlist (requires auth)
http://localhost:3000/dashboard/base      # Base integration (requires auth)
```

### Quick Reference

**Want to add a new public page?**
1. Create page in `app/your-page/page.tsx`
2. Update middleware matcher to exclude it: `matcher: ['/((?!api|_next|your-page).*']`

**Want to add a new protected page?**
1. Create page in `app/dashboard/your-feature/page.tsx`
2. Add to `NAV_ITEMS` in `lib/constants.ts` as `/dashboard/your-feature`

**Want to change what happens after login?**
1. Update `router.push('/dashboard')` in:
   - `app/(auth)/sign-in/page.tsx`
   - `app/(auth)/sign-up/page.tsx`

---

**Last Updated**: October 22, 2025  
**Branch**: `landing-page-redesign`

