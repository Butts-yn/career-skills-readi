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
