# CareerReady — Code Documentation

> Career Skills & Readiness Portal built with TanStack Start v1, React 19, Tailwind CSS v4, and Lovable Cloud (Supabase).

## Project Overview

CareerReady bundles four modules into one portal:

1. **Skills Assessment** — nine-competency self-assessment with instant scoring and focus-area recommendations.
2. **Learning Resources** — curated, searchable library mapped to each competency.
3. **Resume Builder** — live-preview resume editor with print/PDF export.
4. **Jobs & Internships** — filterable listings with one-click apply tracking.

Auth is handled by Lovable Cloud (email + password and Google OAuth). All user data is persisted in a Supabase backend via TanStack Start `createServerFn` server functions.

## Published URLs

- **Preview:** https://id-preview--3e0c146f-56a0-4fc1-b2ef-a8fc55e50dcb.lovable.app
- **Published:** https://lone-maker.lovable.app

## Tech Stack

- **Framework:** TanStack Start v1 (React 19 + Vite 7)
- **Routing:** TanStack Router (file-based)
- **Styling:** Tailwind CSS v4 (`src/styles.css` with `@theme` tokens)
- **Data & Auth:** Lovable Cloud / Supabase (`@supabase/supabase-js`, `@lovable.dev/cloud-auth-js`)
- **Server RPC:** TanStack `createServerFn`
- **State:** React Context for auth, TanStack Query for server state
- **Icons:** `lucide-react`
- **Validation:** `zod`

## File Structure

```
src/
  styles.css                 # Tailwind v4 design tokens
  router.tsx                 # TanStack Router bootstrap
  start.ts                   # TanStack Start config + middleware
  server.ts                  # Server entry
  lib/
    auth-context.tsx         # AuthProvider + useAuth
    assessment.functions.ts  # Server functions for assessments
    jobs.functions.ts        # Server functions for job applications
    learning.functions.ts    # Server functions for learning progress
    profile.functions.ts     # Server functions for profiles
    resume.functions.ts      # Server functions for resumes
  routes/
    __root.tsx               # Root layout, head metadata, providers
    _app.tsx                 # Main app shell (nav + footer)
    _app.index.tsx           # Landing page
    _app.assessment.tsx      # Assessment page
    _app.learning-resources.tsx
    _app.resume-builder.tsx
    _app.jobs.tsx
    auth.tsx                 # Sign-in / sign-up page
    reset-password.tsx
    _authenticated/
      route.tsx              # Auth-guarded layout
      dashboard.tsx          # Protected dashboard
integrations/
  supabase/
    client.ts                # Auto-generated browser client
    auth-attacher.ts         # Bearer-token middleware for server functions
  lovable/index.ts           # Lovable Cloud helpers
supabase/migrations/
  20260721114659_*.sql       # Schema + RLS policies + triggers
  20260721114733_*.sql       # Function privilege revocations
```

## Dependencies

See `package.json` for the full list. Key dependencies:

- `@tanstack/react-start` — full-stack React framework
- `@tanstack/react-router` — type-safe routing
- `@tanstack/react-query` — server-state caching
- `@supabase/supabase-js` — Supabase client
- `@lovable.dev/cloud-auth-js` — Lovable Cloud auth helpers
- `tailwindcss` v4 — CSS framework
- `lucide-react` — icons
- `zod` — schema validation

---

## Source Files

### `src/styles.css`

Tailwind v4 entry point. Defines the CareerReady color palette, typography, and theme tokens using CSS variables.

```css
@import "tailwindcss" source(none);
@source "../src";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --font-display: "Sora", system-ui, sans-serif;
  --font-sans: "Inter", system-ui, sans-serif;
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) + 8px);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-brand: var(--brand);
  --color-brand-foreground: var(--brand-foreground);
  --color-brand-soft: var(--brand-soft);
  --color-ink: var(--ink);
  --gradient-hero: var(--gradient-hero);
  --gradient-card: var(--gradient-card);
  --shadow-elev: var(--shadow-elev);
  --shadow-soft: var(--shadow-soft);
}

:root {
  --radius: 0.875rem;
  --background: oklch(0.99 0.005 95);
  --foreground: oklch(0.18 0.02 250);
  --ink: oklch(0.14 0.03 250);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.18 0.02 250);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.18 0.02 250);
  --primary: oklch(0.22 0.05 255);
  --primary-foreground: oklch(0.98 0.005 95);
  --secondary: oklch(0.96 0.01 250);
  --secondary-foreground: oklch(0.22 0.05 255);
  --muted: oklch(0.96 0.01 250);
  --muted-foreground: oklch(0.5 0.02 255);
  --accent: oklch(0.94 0.04 85);
  --accent-foreground: oklch(0.22 0.05 255);
  --destructive: oklch(0.6 0.22 27);
  --destructive-foreground: oklch(0.98 0 0);
  --border: oklch(0.92 0.01 250);
  --input: oklch(0.92 0.01 250);
  --ring: oklch(0.65 0.14 190);

  --brand: oklch(0.62 0.14 190);
  --brand-foreground: oklch(0.99 0.005 95);
  --brand-soft: oklch(0.94 0.05 190);

  --gradient-hero: linear-gradient(135deg, oklch(0.62 0.14 190) 0%, oklch(0.42 0.15 260) 100%);
  --gradient-card: linear-gradient(160deg, oklch(1 0 0) 0%, oklch(0.97 0.02 190) 100%);
  --shadow-elev: 0 20px 40px -20px oklch(0.22 0.05 255 / 0.25);
  --shadow-soft: 0 8px 24px -12px oklch(0.22 0.05 255 / 0.15);
}

.dark {
  --background: oklch(0.14 0.02 255);
  --foreground: oklch(0.97 0.005 95);
  --card: oklch(0.19 0.03 255);
  --card-foreground: oklch(0.97 0.005 95);
  --popover: oklch(0.19 0.03 255);
  --popover-foreground: oklch(0.97 0.005 95);
  --primary: oklch(0.97 0.005 95);
  --primary-foreground: oklch(0.19 0.03 255);
  --secondary: oklch(0.26 0.03 255);
  --secondary-foreground: oklch(0.97 0.005 95);
  --muted: oklch(0.26 0.03 255);
  --muted-foreground: oklch(0.72 0.02 250);
  --accent: oklch(0.3 0.06 85);
  --accent-foreground: oklch(0.97 0.005 95);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 12%);
  --ring: oklch(0.65 0.14 190);
  --brand: oklch(0.72 0.15 190);
  --brand-soft: oklch(0.28 0.06 190);
  --gradient-hero: linear-gradient(135deg, oklch(0.35 0.12 190) 0%, oklch(0.25 0.12 260) 100%);
  --gradient-card: linear-gradient(160deg, oklch(0.19 0.03 255) 0%, oklch(0.22 0.05 200) 100%);
}

@layer base {
  * { border-color: var(--color-border); }
  html { font-family: var(--font-sans); }
  body {
    background-color: var(--color-background);
    color: var(--color-foreground);
    font-feature-settings: "ss01", "cv11";
  }
  h1, h2, h3, h4 { font-family: var(--font-display); letter-spacing: -0.02em; }
}
```

---

### `src/router.tsx`

Bootstraps the TanStack Router with a per-request `QueryClient`.

```tsx
import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
```

---

### `src/start.ts`

TanStack Start configuration. Registers the Supabase auth bearer middleware so protected server functions receive the user's token.

```tsx
import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [errorMiddleware],
}));
```

---

### `src/lib/auth-context.tsx`

React Context that provides the current Supabase user and sign-out helper.

```tsx
import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (mounted) setUser(data.user ?? null);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
```

---

### `src/routes/__root.tsx`

Root route. Provides the HTML shell, global `<head>` metadata, fonts, and wraps the app in `QueryClientProvider` and `AuthProvider`.

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AuthProvider } from "../lib/auth-context";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "CareerReady — Career Skills & Readiness Portal" },
      {
        name: "description",
        content:
          "Assessments, learning resources, resume builder and a jobs board — one portal for career-ready students.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Sora:wght@500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </AuthProvider>
    </QueryClientProvider>
  );
}
```

---

### `src/routes/_app.tsx`

Main layout used by the marketing/module pages. Includes the sticky nav and footer. `AuthHeader` shows Dashboard/Sign-out for signed-in users or Sign-in for guests.

```tsx
import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { User, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import type { ReactNode } from "react";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

const nav = [
  { to: "/", label: "Home" },
  { to: "/assessment", label: "Assessment" },
  { to: "/learning-resources", label: "Resources" },
  { to: "/resume-builder", label: "Resume" },
  { to: "/jobs", label: "Jobs" },
  { to: "/dashboard", label: "Dashboard" },
] as const;

function AppLayout(): ReactNode {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display font-semibold text-lg">
            <span className="h-8 w-8 rounded-lg bg-[image:var(--gradient-hero)] shadow-[var(--shadow-soft)] grid place-items-center text-brand-foreground text-sm">
              CR
            </span>
            <span>CareerReady</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                activeProps={{ className: "px-3 py-1.5 rounded-md text-sm text-foreground bg-secondary" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <AuthHeader />
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border py-8 mt-16">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2026 CareerReady Portal — Career Skills & Readiness for Students</p>
          <div className="flex gap-4">
            <Link to="/assessment" className="hover:text-foreground">Assessment</Link>
            <Link to="/jobs" className="hover:text-foreground">Jobs</Link>
            <Link to="/resume-builder" className="hover:text-foreground">Resume</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function AuthHeader() {
  const { user, signOut } = useAuth();

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          to="/dashboard"
          className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition"
        >
          <User className="h-4 w-4" />
          Dashboard
        </Link>
        <button
          onClick={() => signOut()}
          className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border border-border bg-background hover:bg-accent transition"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    );
  }

  return (
    <Link
      to="/auth"
      className="text-sm font-medium px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
    >
      Sign in
    </Link>
  );
}
```

---

### `src/routes/_app.index.tsx`

Landing page with hero, module overview, and competency showcase.

```tsx
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Sparkles,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/_app/")({
  head: () => ({
    meta: [
      { title: "CareerReady — Career Skills & Readiness Portal" },
      {
        name: "description",
        content:
          "One place for students to assess skills, learn, build a resume, and land internships & jobs.",
      },
      { property: "og:title", content: "CareerReady — Career Skills & Readiness Portal" },
      {
        property: "og:description",
        content:
          "Assessments, learning resources, resume builder, and a jobs board for career-ready graduates.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const modules = [
  {
    to: "/assessment",
    icon: ClipboardCheck,
    title: "Skills Assessment",
    desc: "Nine-competency self-assessment with instant scoring and personalized recommendations.",
  },
  {
    to: "/learning-resources",
    icon: BookOpen,
    title: "Learning Resources",
    desc: "Curated guides, videos and articles surfaced against your weakest competencies.",
  },
  {
    to: "/resume-builder",
    icon: FileText,
    title: "Resume Builder",
    desc: "Multi-step form, live preview, one-click PDF export — attached to any job application.",
  },
  {
    to: "/jobs",
    icon: Briefcase,
    title: "Jobs & Internships",
    desc: "Filter listings, apply with your saved resume, and track application status.",
  },
] as const;

const competencies = [
  "Communication",
  "Teamwork",
  "Problem-solving",
  "Critical thinking",
  "Time management",
  "Adaptability",
  "Leadership",
  "Digital literacy",
  "Professional ethics",
];

function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[image:var(--gradient-hero)] opacity-95" />
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,white_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32 text-brand-foreground">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-medium border border-white/20">
              <Sparkles className="h-3.5 w-3.5" /> For students, advisors & employers
            </span>
            <h1 className="mt-6 text-5xl md:text-7xl font-semibold leading-[1.05]">
              Turn coursework into a{" "}
              <span className="italic text-accent">career-ready</span> portfolio.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/85 max-w-2xl">
              CareerReady bundles skills assessment, learning, resume building and a jobs board
              into one portal — so students graduate hire-ready and advisors see progress at a
              glance.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/assessment"
                className="inline-flex items-center gap-2 rounded-lg bg-white text-primary px-5 py-3 font-medium shadow-[var(--shadow-elev)] hover:translate-y-[-1px] transition"
              >
                Start the assessment <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 backdrop-blur px-5 py-3 font-medium hover:bg-white/15 transition"
              >
                Browse jobs
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
          <div>
            <p className="text-sm font-medium text-brand uppercase tracking-wider">The portal</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold">Four modules, one journey</h2>
          </div>
          <p className="text-muted-foreground max-w-md">
            Each module works on its own and gets sharper as you complete the others.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {modules.map((m) => (
            <Link
              key={m.to}
              to={m.to}
              className="group rounded-2xl border border-border bg-[image:var(--gradient-card)] p-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-elev)] hover:-translate-y-1 transition"
            >
              <div className="h-11 w-11 rounded-xl bg-brand-soft text-brand grid place-items-center mb-5">
                <m.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">{m.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{m.desc}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-brand">
                Open <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-secondary/40 border-y border-border">
        <div className="mx-auto max-w-7xl px-6 py-20 grid gap-12 md:grid-cols-2 items-center">
          <div>
            <p className="text-sm font-medium text-brand uppercase tracking-wider">
              Nine competencies
            </p>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold">
              Measure what employers actually hire for.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Our assessment maps every question to a competency, then routes you to targeted
              learning until each score climbs.
            </p>
            <Link
              to="/assessment"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-5 py-3 font-medium hover:opacity-90 transition"
            >
              Take the assessment <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ul className="grid grid-cols-2 gap-3">
            {competencies.map((c) => (
              <li
                key={c}
                className="rounded-lg bg-card border border-border px-4 py-3 text-sm font-medium"
              >
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { icon: GraduationCap, title: "Students", body: "Assess, learn, build, apply." },
            { icon: Users, title: "Career Advisors", body: "Track cohort progress and curate resources." },
            { icon: Briefcase, title: "Employers", body: "Post roles and review applicants with attached resumes." },
          ].map((r) => (
            <div key={r.title} className="rounded-2xl border border-border p-6 bg-card">
              <r.icon className="h-6 w-6 text-brand" />
              <h3 className="mt-4 text-lg font-semibold">{r.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{r.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
```

---

### `src/routes/_app.assessment.tsx`

Self-assessment page. Loads the latest saved scores for signed-in users and lets them save new results via `saveAssessment`.

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Save } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useServerFn } from "@tanstack/react-start";
import { getLatestAssessment, saveAssessment } from "@/lib/assessment.functions";

export const Route = createFileRoute("/_app/assessment")({
  head: () => ({
    meta: [
      { title: "Skills Assessment — CareerReady" },
      { name: "description", content: "Rate yourself across nine career competencies and get instant recommendations." },
    ],
  }),
  component: Assessment,
});

const competencies = [
  "Communication",
  "Teamwork",
  "Problem-solving",
  "Critical thinking",
  "Time management",
  "Adaptability",
  "Leadership",
  "Digital literacy",
  "Professional ethics",
];

function Assessment() {
  const { user } = useAuth();
  const saveFn = useServerFn(saveAssessment);
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(competencies.map((c) => [c, 3])),
  );
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    getLatestAssessment()
      .then((data) => {
        if (data?.scores && typeof data.scores === "object") {
          const loaded = data.scores as Record<string, number>;
          setScores((s) => ({ ...s, ...loaded }));
        }
      })
      .catch(() => {});
  }, [user]);

  const weakest = useMemo(
    () =>
      Object.entries(scores)
        .sort((a, b) => a[1] - b[1])
        .slice(0, 3)
        .map(([k]) => k),
    [scores],
  );

  const avg = useMemo(
    () => Object.values(scores).reduce((a, b) => a + b, 0) / competencies.length,
    [scores],
  );

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setSaveMessage(null);
    try {
      await saveFn({
        data: { scores, average: Number(avg.toFixed(2)), focus_areas: weakest },
      });
      setSaveMessage("Saved to your profile.");
    } catch (err) {
      setSaveMessage(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-sm font-medium text-brand uppercase tracking-wider">Self-assessment</p>
      <h1 className="mt-2 text-4xl font-semibold">Rate your competencies</h1>
      <p className="mt-3 text-muted-foreground">
        Score 1 (needs work) → 5 (confident). Takes about two minutes.
      </p>

      <div className="mt-10 space-y-5">
        {competencies.map((c) => (
          <div key={c} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <label className="font-medium">{c}</label>
              <span className="text-sm text-muted-foreground">{scores[c]} / 5</span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              value={scores[c]}
              onChange={(e) => setScores((s) => ({ ...s, [c]: Number(e.target.value) }))}
              className="w-full accent-[color:var(--brand)]"
            />
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          onClick={() => setSubmitted(true)}
          className="rounded-lg bg-primary text-primary-foreground px-6 py-3 font-medium hover:opacity-90 transition"
        >
          See my recommendations
        </button>
        {user ? (
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 font-medium hover:bg-accent transition disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving…" : "Save to profile"}
          </button>
        ) : (
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 font-medium hover:bg-accent transition"
          >
            Sign in to save
          </Link>
        )}
      </div>

      {saveMessage && (
        <p className="mt-3 text-sm text-muted-foreground">{saveMessage}</p>
      )}

      {submitted && (
        <div className="mt-10 rounded-2xl border border-border bg-[image:var(--gradient-card)] p-8">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-brand" />
            <h2 className="text-2xl font-semibold">Your snapshot</h2>
          </div>
          <p className="mt-2 text-muted-foreground">
            Overall score: <span className="font-semibold text-foreground">{avg.toFixed(1)} / 5</span>
          </p>
          <h3 className="mt-6 font-semibold">Focus areas</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-3">
            {weakest.map((w) => (
              <li key={w} className="rounded-lg bg-brand-soft text-brand px-4 py-3 text-sm font-medium">
                {w}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            Head to Learning Resources for curated material tied to these competencies.
          </p>
        </div>
      )}
    </div>
  );
}
```

---

### `src/lib/assessment.functions.ts`

Server functions for the assessment module. Uses `requireSupabaseAuth` so only signed-in users can read/write their own scores.

```tsx
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const scoreSchema = z.record(z.number().min(1).max(5));

export const getLatestAssessment = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("assessment_scores")
      .select("*")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  });

export const saveAssessment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        scores: scoreSchema,
        average: z.number(),
        focus_areas: z.array(z.string()),
      })
      .parse(input)
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("assessment_scores").insert({
      user_id: context.userId,
      scores: data.scores,
      average: data.average,
      focus_areas: data.focus_areas,
    });

    if (error) throw error;
    return { ok: true };
  });
```

---

### `src/routes/_app.learning-resources.tsx`

Learning resources library. Filters by category, searches by title, and tracks completion for signed-in users.

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, ExternalLink, CheckCircle2, BookOpen } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useServerFn } from "@tanstack/react-start";
import { getCompletedResources, markResourceComplete } from "@/lib/learning.functions";

export const Route = createFileRoute("/_app/learning-resources")({
  head: () => ({
    meta: [
      { title: "Learning Resources — CareerReady" },
      { name: "description", content: "Curated guides, videos and articles across nine career competencies." },
    ],
  }),
  component: Resources,
});

const resources = [
  { id: "comm-star", title: "Structured communication with the STAR method", category: "Communication", type: "Article", mins: 8 },
  { id: "team-standup", title: "Running a productive stand-up", category: "Teamwork", type: "Video", mins: 12 },
  { id: "debug-craft", title: "Debugging as a problem-solving craft", category: "Problem-solving", type: "Guide", mins: 15 },
  { id: "weekly-review", title: "Weekly review template", category: "Time management", type: "Template", mins: 5 },
  { id: "lead-authority", title: "Leading without authority", category: "Leadership", type: "Article", mins: 10 },
  { id: "digital-lit", title: "Digital literacy for the modern workplace", category: "Digital literacy", type: "Course", mins: 45 },
  { id: "ethics-cases", title: "Ethics case studies for early careers", category: "Professional ethics", type: "Article", mins: 9 },
  { id: "feedback-playbook", title: "Adapting to feedback: a playbook", category: "Adaptability", type: "Guide", mins: 7 },
  { id: "weak-arguments", title: "Critical thinking: spotting weak arguments", category: "Critical thinking", type: "Video", mins: 18 },
];

const categories = ["All", ...Array.from(new Set(resources.map((r) => r.category)))];

function Resources() {
  const { user } = useAuth();
  const markCompleteFn = useServerFn(markResourceComplete);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    getCompletedResources()
      .then((set) => setCompleted(new Set(set)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const filtered = resources.filter(
    (r) =>
      (cat === "All" || r.category === cat) &&
      r.title.toLowerCase().includes(q.toLowerCase()),
  );

  const handleMark = async (id: string) => {
    if (!user) return;
    setMarking(id);
    try {
      await markCompleteFn({ data: { resourceId: id } });
      setCompleted((s) => new Set(s).add(id));
    } finally {
      setMarking(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-sm font-medium text-brand uppercase tracking-wider">Library</p>
      <h1 className="mt-2 text-4xl font-semibold">Learning resources</h1>
      <p className="mt-3 text-muted-foreground max-w-2xl">
        Advisor-curated material mapped to each competency. Filter by category or search by title.
      </p>

      <div className="mt-8 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search resources…"
            className="w-full rounded-lg border border-input bg-card pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-3 py-1.5 rounded-full text-sm border transition ${
                cat === c
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <p className="mt-6 text-sm text-muted-foreground">Loading progress…</p>
      )}

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((r) => (
          <article
            key={r.id}
            className="rounded-2xl border border-border bg-card p-6 hover:shadow-[var(--shadow-soft)] transition"
          >
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="px-2 py-0.5 rounded-full bg-brand-soft text-brand font-medium">
                {r.category}
              </span>
              <span>{r.type} · {r.mins} min</span>
            </div>
            <h3 className="mt-3 font-semibold leading-snug">{r.title}</h3>
            <div className="mt-4 flex items-center gap-2">
              <button className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline">
                Open <ExternalLink className="h-3.5 w-3.5" />
              </button>
              {user ? (
                <button
                  onClick={() => handleMark(r.id)}
                  disabled={completed.has(r.id) || marking === r.id}
                  className={`ml-auto inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md transition ${
                    completed.has(r.id)
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-secondary text-secondary-foreground hover:bg-accent"
                  } disabled:opacity-70`}
                >
                  {completed.has(r.id) ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" /> Done
                    </>
                  ) : marking === r.id ? (
                    "…"
                  ) : (
                    <>
                      <BookOpen className="h-3.5 w-3.5" /> Mark done
                    </>
                  )}
                </button>
              ) : (
                <Link
                  to="/auth"
                  className="ml-auto inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground hover:bg-accent transition"
                >
                  Sign in to track
                </Link>
              )}
            </div>
          </article>
        ))}
        {filtered.length === 0 && (
          <p className="text-muted-foreground">No resources match your filters.</p>
        )}
      </div>
    </div>
  );
}
```

---

### `src/lib/learning.functions.ts`

Server functions for learning resource completion tracking.

```tsx
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export const getCompletedResources = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("learning_progress")
      .select("resource_id")
      .eq("user_id", context.userId);

    if (error) throw error;
    return new Set(data?.map((r) => r.resource_id) ?? []);
  });

export const markResourceComplete = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        resourceId: z.string().min(1),
      })
      .parse(input)
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("learning_progress").upsert(
      {
        user_id: context.userId,
        resource_id: data.resourceId,
      },
      { onConflict: "user_id, resource_id" }
    );

    if (error) throw error;
    return { ok: true };
  });
```

---

### `src/routes/_app.resume-builder.tsx`

Resume builder with editable form on the left and live preview on the right. Saves to the `resumes` table for signed-in users. Print styling uses the browser's print dialog for PDF export.

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { Download, Mail, MapPin, Phone, Save } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useServerFn } from "@tanstack/react-start";
import { getResume, saveResume } from "@/lib/resume.functions";

export const Route = createFileRoute("/_app/resume-builder")({
  head: () => ({
    meta: [
      { title: "Resume Builder — CareerReady" },
      { name: "description", content: "Build a professional resume with live preview and PDF export." },
    ],
  }),
  component: ResumeBuilder,
});

type ResumeData = {
  full_name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  education: string;
  experience: string;
  skills: string;
};

const defaultResume: ResumeData = {
  full_name: "",
  role: "",
  email: "",
  phone: "",
  location: "",
  summary: "",
  education: "",
  experience: "",
  skills: "",
};

const fieldKeyMap: Record<string, keyof ResumeData> = {
  name: "full_name",
  role: "role",
  email: "email",
  phone: "phone",
  location: "location",
  summary: "summary",
  education: "education",
  experience: "experience",
  skills: "skills",
};

function ResumeBuilder() {
  const { user } = useAuth();
  const saveFn = useServerFn(saveResume);
  const [data, setData] = useState<ResumeData>(defaultResume);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    getResume()
      .then((r) => {
        if (r) {
          setData((d) => ({
            ...d,
            full_name: r.full_name ?? "",
            role: r.role ?? "",
            email: r.email ?? "",
            phone: r.phone ?? "",
            location: r.location ?? "",
            summary: r.summary ?? "",
            education: r.education ?? "",
            experience: r.experience ?? "",
            skills: r.skills ?? "",
          }));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const update = (k: keyof ResumeData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setData((d) => ({ ...d, [k]: e.target.value }));

  const handleSave = useCallback(async () => {
    if (!user) return;
    setSaving(true);
    setSaveMessage(null);
    try {
      await saveFn({ data });
      setSaveMessage("Resume saved.");
    } catch (err) {
      setSaveMessage(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }, [user, data, saveFn]);

  const field = "w-full rounded-lg border border-input bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <p className="text-sm font-medium text-brand uppercase tracking-wider">Resume</p>
          <h1 className="mt-2 text-4xl font-semibold">Build your resume</h1>
          <p className="mt-2 text-muted-foreground">Edit on the left. Preview updates live on the right.</p>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <button
              onClick={handleSave}
              disabled={saving || loading}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 font-medium hover:bg-accent transition disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving…" : "Save"}
            </button>
          ) : (
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 font-medium hover:bg-accent transition"
            >
              Sign in to save
            </Link>
          )}
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2.5 font-medium hover:opacity-90 transition"
          >
            <Download className="h-4 w-4" /> Export PDF
          </button>
        </div>
      </div>

      {saveMessage && (
        <p className="mb-4 text-sm text-muted-foreground">{saveMessage}</p>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading resume…</p>
      ) : (
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-5">
            {[
              { k: "full_name", label: "Full name" },
              { k: "role", label: "Headline" },
              { k: "email", label: "Email" },
              { k: "phone", label: "Phone" },
              { k: "location", label: "Location" },
            ].map((f) => (
              <div key={f.k}>
                <label className="text-sm font-medium">{f.label}</label>
                <input className={`mt-1 ${field}`} value={data[f.k as keyof ResumeData]} onChange={update(f.k as keyof ResumeData)} />
              </div>
            ))}
            {[
              { k: "summary", label: "Summary" },
              { k: "education", label: "Education" },
              { k: "experience", label: "Experience" },
              { k: "skills", label: "Skills" },
            ].map((f) => (
              <div key={f.k}>
                <label className="text-sm font-medium">{f.label}</label>
                <textarea
                  rows={f.k === "experience" ? 5 : 3}
                  className={`mt-1 ${field} font-sans`}
                  value={data[f.k as keyof ResumeData]}
                  onChange={update(f.k as keyof ResumeData)}
                />
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-soft)] print:shadow-none">
            <h2 className="text-3xl font-semibold text-ink">{data.full_name || "Your name"}</h2>
            <p className="text-brand font-medium">{data.role || "Headline"}</p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{data.email || "email"}</span>
              <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{data.phone || "phone"}</span>
              <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{data.location || "location"}</span>
            </div>

            {[
              { label: "Summary", v: data.summary },
              { label: "Education", v: data.education },
              { label: "Experience", v: data.experience },
              { label: "Skills", v: data.skills },
            ].map((s) => (
              <section key={s.label} className="mt-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-brand border-b border-border pb-1">
                  {s.label}
                </h3>
                <p className="mt-2 text-sm whitespace-pre-line text-foreground">{s.v || <span className="text-muted-foreground">Add {s.label.toLowerCase()}…</span>}</p>
              </section>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

### `src/lib/resume.functions.ts`

Server functions for the resume module. Upserts the user's latest resume row.

```tsx
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const resumeSchema = z.object({
  full_name: z.string().optional(),
  role: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  summary: z.string().optional(),
  education: z.string().optional(),
  experience: z.string().optional(),
  skills: z.string().optional(),
});

export const getResume = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("resumes")
      .select("*")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  });

export const saveResume = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => resumeSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: existing, error: findError } = await context.supabase
      .from("resumes")
      .select("id")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (findError) throw findError;

    if (existing) {
      const { error } = await context.supabase
        .from("resumes")
        .update(data)
        .eq("id", existing.id);
      if (error) throw error;
    } else {
      const { error } = await context.supabase.from("resumes").insert({
        user_id: context.userId,
        ...data,
      });
      if (error) throw error;
    }

    return { ok: true };
  });
```

---

### `src/routes/_app.jobs.tsx`

Jobs board with search and type filtering. Signed-in users can apply, which inserts a `job_applications` row and shows an "Applied" state.

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, Calendar, CheckCircle2, MapPin, Search } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useServerFn } from "@tanstack/react-start";
import { applyToJob } from "@/lib/jobs.functions";

export const Route = createFileRoute("/_app/jobs")({
  head: () => ({
    meta: [
      { title: "Jobs & Internships — CareerReady" },
      { name: "description", content: "Browse internships and graduate roles. Apply with your saved resume." },
    ],
  }),
  component: Jobs,
});

const jobs = [
  { id: "1", title: "Software Engineer Intern", company: "Northwind Labs", location: "Remote", type: "Internship", deadline: "Aug 15", tags: ["React", "TypeScript"] },
  { id: "2", title: "Junior Data Analyst", company: "Helix Health", location: "Boston, MA", type: "Full-time", deadline: "Sep 01", tags: ["SQL", "Python"] },
  { id: "3", title: "UX Research Intern", company: "Fable Studio", location: "Hybrid — NYC", type: "Internship", deadline: "Jul 30", tags: ["Figma", "Interviews"] },
  { id: "4", title: "Marketing Associate", company: "BrightPath", location: "Chicago, IL", type: "Full-time", deadline: "Aug 22", tags: ["Content", "SEO"] },
  { id: "5", title: "Backend Engineer Grad Scheme", company: "Ledgerly", location: "Remote", type: "Full-time", deadline: "Sep 15", tags: ["Node", "Postgres"] },
  { id: "6", title: "Product Design Intern", company: "Aurora", location: "Austin, TX", type: "Internship", deadline: "Aug 08", tags: ["Figma", "Prototyping"] },
];

const types = ["All", "Internship", "Full-time"];

function Jobs() {
  const { user } = useAuth();
  const applyFn = useServerFn(applyToJob);
  const [q, setQ] = useState("");
  const [t, setT] = useState("All");
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [applying, setApplying] = useState<string | null>(null);

  const filtered = jobs.filter(
    (j) =>
      (t === "All" || j.type === t) &&
      (j.title.toLowerCase().includes(q.toLowerCase()) || j.company.toLowerCase().includes(q.toLowerCase())),
  );

  const handleApply = async (j: typeof jobs[number]) => {
    if (!user) return;
    setApplying(j.id);
    try {
      await applyFn({ data: { role: j.title, company: j.company, notes: j.type } });
      setAppliedIds((s) => new Set(s).add(j.id));
    } finally {
      setApplying(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-sm font-medium text-brand uppercase tracking-wider">Openings</p>
      <h1 className="mt-2 text-4xl font-semibold">Jobs & internships</h1>
      <p className="mt-3 text-muted-foreground max-w-2xl">
        Apply in one click with your saved resume. Track status from your dashboard.
      </p>

      <div className="mt-8 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search role or company…"
            className="w-full rounded-lg border border-input bg-card pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex gap-2">
          {types.map((x) => (
            <button
              key={x}
              onClick={() => setT(x)}
              className={`px-3 py-1.5 rounded-full text-sm border transition ${
                t === x
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {x}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4">
        {filtered.map((j) => (
          <article
            key={j.id}
            className="rounded-2xl border border-border bg-card p-6 flex flex-col md:flex-row md:items-center gap-4 hover:shadow-[var(--shadow-soft)] transition"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="px-2 py-0.5 rounded-full bg-brand-soft text-brand font-medium">{j.type}</span>
                {j.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
              <h3 className="mt-2 text-lg font-semibold">{j.title}</h3>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{j.company}</span>
                <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{j.location}</span>
                <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />Deadline {j.deadline}</span>
              </div>
            </div>
            {user ? (
              <button
                onClick={() => handleApply(j)}
                disabled={applying === j.id || appliedIds.has(j.id)}
                className={`rounded-lg px-4 py-2.5 font-medium transition inline-flex items-center gap-2 ${
                  appliedIds.has(j.id)
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-primary text-primary-foreground hover:opacity-90"
                } disabled:opacity-70`}
              >
                {appliedIds.has(j.id) ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" /> Applied
                  </>
                ) : applying === j.id ? (
                  "Applying…"
                ) : (
                  "Apply"
                )}
              </button>
            ) : (
              <Link
                to="/auth"
                className="rounded-lg bg-primary text-primary-foreground px-4 py-2.5 font-medium hover:opacity-90 transition"
              >
                Sign in to apply
              </Link>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
```

---

### `src/lib/jobs.functions.ts`

Server functions for job applications. Provides listing, creation, and status update capabilities.

```tsx
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export const listJobApplications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("job_applications")
      .select("*")
      .eq("user_id", context.userId)
      .order("applied_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  });

export const applyToJob = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        role: z.string().min(1),
        company: z.string().min(1),
        notes: z.string().optional(),
      })
      .parse(input)
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("job_applications").insert({
      user_id: context.userId,
      role: data.role,
      company: data.company,
      notes: data.notes ?? null,
    });

    if (error) throw error;
    return { ok: true };
  });

export const updateApplicationStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.string().min(1),
      })
      .parse(input)
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("job_applications")
      .update({ status: data.status })
      .eq("id", data.id)
      .eq("user_id", context.userId);

    if (error) throw error;
    return { ok: true };
  });
```

---

### `src/routes/auth.tsx`

Sign-in / sign-up page. Supports email + password and Google OAuth via Lovable Cloud helpers.

```tsx
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Mail, Lock, ArrowRight, Chrome } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — CareerReady" },
      { name: "description", content: "Sign in or create a CareerReady account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });
        if (signUpError) throw signUpError;
        setMessage("Check your email to confirm your account.");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        navigate({ to: "/dashboard" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setError(result.error.message ?? "Google sign-in failed");
    }
    // If not redirected and no error, session is set; navigate home.
    if (!result.error && !result.redirected) {
      navigate({ to: "/dashboard" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display font-semibold text-lg">
            <span className="h-8 w-8 rounded-lg bg-[image:var(--gradient-hero)] shadow-[var(--shadow-soft)] grid place-items-center text-brand-foreground text-sm">
              CR
            </span>
            <span>CareerReady</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
          <h1 className="text-2xl font-semibold text-center">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "Sign in to save your progress" : "Get career-ready in minutes"}
          </p>

          {error && (
            <div className="mt-4 rounded-lg bg-destructive/10 text-destructive text-sm px-4 py-3">
              {error}
            </div>
          )}
          {message && (
            <div className="mt-4 rounded-lg bg-brand-soft text-brand text-sm px-4 py-3">
              {message}
            </div>
          )}

          <button
            onClick={handleGoogle}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium hover:bg-accent transition"
          >
            <Chrome className="h-4 w-4" />
            Continue with Google
          </button>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground uppercase">or use email</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleEmail} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="you@school.edu"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2.5 font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Working…" : mode === "signin" ? "Sign in" : "Create account"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            {mode === "signin" ? (
              <>
                <span className="text-muted-foreground">No account yet? </span>
                <button
                  onClick={() => setMode("signup")}
                  className="font-medium text-brand hover:underline"
                >
                  Sign up
                </button>
                <p className="mt-2">
                  <Link to="/reset-password" className="text-muted-foreground hover:text-foreground">
                    Forgot password?
                  </Link>
                </p>
              </>
            ) : (
              <>
                <span className="text-muted-foreground">Already have an account? </span>
                <button
                  onClick={() => setMode("signin")}
                  className="font-medium text-brand hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
```

---

### `src/routes/reset-password.tsx`

Password reset flow. Handles both sending the reset email and setting a new password from the recovery hash.

```tsx
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Lock, ArrowRight, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password — CareerReady" },
      { name: "description", content: "Set a new password for your CareerReady account." },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"request" | "reset">("request");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setMode("reset");
    }
  }, []);

  const sendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (resetError) throw resetError;
      setMessage("Check your email for a password reset link.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const setNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setSuccess(true);
      setTimeout(() => navigate({ to: "/dashboard" }), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display font-semibold text-lg">
            <span className="h-8 w-8 rounded-lg bg-[image:var(--gradient-hero)] shadow-[var(--shadow-soft)] grid place-items-center text-brand-foreground text-sm">
              CR
            </span>
            <span>CareerReady</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
          <h1 className="text-2xl font-semibold text-center">
            {mode === "reset" ? "Set new password" : "Reset password"}
          </h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {mode === "reset"
              ? "Enter a new password for your account"
              : "We’ll send you a link to reset it"}
          </p>

          {error && (
            <div className="mt-4 rounded-lg bg-destructive/10 text-destructive text-sm px-4 py-3">
              {error}
            </div>
          )}
          {message && (
            <div className="mt-4 rounded-lg bg-brand-soft text-brand text-sm px-4 py-3">
              {message}
            </div>
          )}
          {success && (
            <div className="mt-4 rounded-lg bg-brand-soft text-brand text-sm px-4 py-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Password updated. Redirecting…
            </div>
          )}

          {mode === "request" ? (
            <form onSubmit={sendResetEmail} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="you@school.edu"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2.5 font-medium hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? "Sending…" : "Send reset link"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={setNewPassword} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium">New password</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Confirm password</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || success}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2.5 font-medium hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? "Updating…" : "Update password"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
```

---

### `src/routes/_authenticated/route.tsx`

Auth-guarded layout. Redirects unauthenticated users to `/auth`.

```tsx
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/auth" });
    }
    return { user: data.user };
  },
  component: () => <Outlet />,
});
```

---

### `src/routes/_authenticated/dashboard.tsx`

Protected dashboard. Preloads the latest assessment, resume, and job applications in the TanStack Router loader, then reads them with `useSuspenseQuery`.

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Briefcase, ClipboardCheck, FileText, TrendingUp } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getLatestAssessment } from "@/lib/assessment.functions";
import { getResume } from "@/lib/resume.functions";
import { listJobApplications } from "@/lib/jobs.functions";
import { queryOptions } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — CareerReady" },
      { name: "description", content: "Track your assessments, resume completeness and applications." },
    ],
  }),
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(
        queryOptions({ queryKey: ["assessment"], queryFn: () => getLatestAssessment() })
      ),
      context.queryClient.ensureQueryData(
        queryOptions({ queryKey: ["resume"], queryFn: () => getResume() })
      ),
      context.queryClient.ensureQueryData(
        queryOptions({ queryKey: ["applications"], queryFn: () => listJobApplications() })
      ),
    ]),
  component: Dashboard,
});

const statusColor: Record<string, string> = {
  Submitted: "bg-secondary text-secondary-foreground",
  "Under review": "bg-accent text-accent-foreground",
  Accepted: "bg-brand-soft text-brand",
  Rejected: "bg-destructive/10 text-destructive",
};

function Dashboard() {
  const { user } = useAuth();
  const { data: assessment } = useSuspenseQuery(
    queryOptions({ queryKey: ["assessment"], queryFn: () => getLatestAssessment() })
  );
  const { data: resume } = useSuspenseQuery(
    queryOptions({ queryKey: ["resume"], queryFn: () => getResume() })
  );
  const { data: applications } = useSuspenseQuery(
    queryOptions({ queryKey: ["applications"], queryFn: () => listJobApplications() })
  );

  const resumeFields = ["full_name", "role", "email", "summary", "education", "experience", "skills"];
  const resumeFilled = resumeFields.filter((f) => !!resume?.[f as keyof typeof resume]).length;
  const resumeCompleteness = Math.round((resumeFilled / resumeFields.length) * 100);

  const avgScore = assessment?.average ?? 0;
  const focus = assessment?.focus_areas ?? [];

  const stats = [
    { icon: ClipboardCheck, label: "Assessment score", value: `${avgScore.toFixed(1)} / 5`, to: "/assessment" },
    { icon: FileText, label: "Resume completeness", value: `${resumeCompleteness}%`, to: "/resume-builder" },
    { icon: Briefcase, label: "Applications", value: `${applications?.length ?? 0} active`, to: "/jobs" },
    { icon: TrendingUp, label: "Resume fields", value: `${resumeFilled}/${resumeFields.length}`, to: "/resume-builder" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <p className="text-sm font-medium text-brand uppercase tracking-wider">Welcome back</p>
      <h1 className="mt-2 text-4xl font-semibold">
        {user?.email ? `Your career dashboard` : "Your career dashboard"}
      </h1>

      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            to={s.to}
            className="rounded-2xl border border-border bg-[image:var(--gradient-card)] p-6 hover:shadow-[var(--shadow-elev)] hover:-translate-y-1 transition"
          >
            <s.icon className="h-5 w-5 text-brand" />
            <p className="mt-3 text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-2xl font-semibold">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold">Applications</h2>
          {applications && applications.length > 0 ? (
            <div className="mt-4 divide-y divide-border">
              {applications.map((a) => (
                <div key={a.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">{a.role}</p>
                    <p className="text-sm text-muted-foreground">{a.company}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor[a.status] ?? "bg-secondary text-secondary-foreground"}`}>
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              No applications yet. Head to{" "}
              <Link to="/jobs" className="text-brand hover:underline">
                Jobs
              </Link>{" "}
              to start tracking.
            </p>
          )}
        </section>
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold">Next steps</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {focus.length > 0 && (
              <li className="flex gap-2">
                <span className="text-brand">•</span>
                Practice a focus area: {focus[0]}
              </li>
            )}
            <li className="flex gap-2">
              <span className="text-brand">•</span>
              {resumeCompleteness < 100
                ? `Fill in ${resumeFields.length - resumeFilled} more resume fields`
                : "Your resume is complete — go apply!"}
            </li>
            <li className="flex gap-2">
              <span className="text-brand">•</span>
              {applications?.length === 0
                ? "Apply to your first role"
                : "Follow up on your latest application"}
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
```

---

### `src/lib/profile.functions.ts`

Server functions for profile management (currently available for future profile-page use).

```tsx
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const profileSchema = z.object({
  full_name: z.string().optional(),
  school: z.string().optional(),
  major: z.string().optional(),
  graduation_year: z.string().optional(),
  avatar_url: z.string().optional(),
});

export const getProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("profiles")
      .select("*")
      .eq("id", context.userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  });

export const updateProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => profileSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("profiles")
      .update(data)
      .eq("id", context.userId);

    if (error) throw error;
    return { ok: true };
  });
```

---

## Database Schema

### `supabase/migrations/20260721114659_306a6f15-6212-4352-8b75-e16df3f94b69.sql`

Creates five public tables, applies GRANTs, enables RLS, and adds `updated_at` triggers. A trigger function auto-creates a `profiles` row whenever a new `auth.users` row is inserted.

```sql
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  school text,
  major text,
  graduation_year text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own profile"
  ON public.profiles
  FOR ALL
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE TABLE public.assessment_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scores jsonb NOT NULL,
  average numeric(3,2) NOT NULL,
  focus_areas text[] NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.assessment_scores TO authenticated;
GRANT ALL ON public.assessment_scores TO service_role;

ALTER TABLE public.assessment_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own assessment scores"
  ON public.assessment_scores
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  role text,
  email text,
  phone text,
  location text,
  summary text,
  education text,
  experience text,
  skills text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.resumes TO authenticated;
GRANT ALL ON public.resumes TO service_role;

ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own resume"
  ON public.resumes
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL,
  company text NOT NULL,
  status text NOT NULL DEFAULT 'Submitted',
  notes text,
  applied_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_applications TO authenticated;
GRANT ALL ON public.job_applications TO service_role;

ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own job applications"
  ON public.job_applications
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.learning_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_id text NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, resource_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.learning_progress TO authenticated;
GRANT ALL ON public.learning_progress TO service_role;

ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own learning progress"
  ON public.learning_progress
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assessment_scores_updated_at
  BEFORE UPDATE ON public.assessment_scores
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_resumes_updated_at
  BEFORE UPDATE ON public.resumes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at
  BEFORE UPDATE ON public.job_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_learning_progress_updated_at
  BEFORE UPDATE ON public.learning_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
```

### `supabase/migrations/20260721114733_94d67d1e-9db9-4753-8229-7dca029f6548.sql`

Revokes public execution privileges on the trigger helper functions to reduce exposure.

```sql
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;

REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon;
```

---

## Key Implementation Notes

- **Server functions** are defined with `createServerFn` from `@tanstack/react-start` and protected with `requireSupabaseAuth`. They run in the Lovable Cloud serverless runtime.
- **Client-side calls** use `useServerFn()` from `@tanstack/react-start` for mutations, or call the server function directly inside loaders / effects for reads.
- **Row Level Security (RLS)** ensures each user can only read/write their own rows across all five data tables.
- **Auto profile creation** is handled by a trigger on `auth.users`, so every new user gets a `profiles` row automatically.
- **Password reset** uses Supabase's `resetPasswordForEmail` and `updateUser` flows. The recovery link points back to `/reset-password` with a `type=recovery` hash.
- **Google OAuth** uses `lovable.auth.signInWithOAuth("google", ...)` with `redirect_uri: window.location.origin`.
- **Print / PDF export** on the resume page is implemented with `window.print()` and Tailwind's `print:` modifier.

---

## Build & Scripts

From `package.json`:

- `bun run dev` — local development server
- `bun run build` — production build
- `bun run preview` — preview production build
- `bun run lint` — ESLint
- `bun run format` — Prettier
