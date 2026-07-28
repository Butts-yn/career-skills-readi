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
