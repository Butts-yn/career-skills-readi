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
