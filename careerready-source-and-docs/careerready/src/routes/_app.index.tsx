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
