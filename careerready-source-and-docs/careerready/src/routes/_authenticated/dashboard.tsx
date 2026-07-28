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
