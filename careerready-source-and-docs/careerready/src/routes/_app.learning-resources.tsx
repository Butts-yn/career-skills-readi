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
