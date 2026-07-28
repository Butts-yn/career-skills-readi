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

