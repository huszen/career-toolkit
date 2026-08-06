import {
  ArrowRight,
  FileText,
  SearchCheck,
  FolderKanban,
  Sparkles,
} from "lucide-react";

export default function Landing({ onGetStarted }) {
  const features = [
    {
      icon: FileText,
      title: "AI Cover Letters",
      description:
        "Generate personalized cover letters tailored to every job posting.",
    },
    {
      icon: SearchCheck,
      title: "Gap Analysis",
      description:
        "Compare your CV against job requirements and identify missing skills.",
    },
    {
      icon: FolderKanban,
      title: "Job Tracker",
      description:
        "Organize every application and keep track of your progress.",
    },
  ];

  return (
    <main className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* HERO */}
      <section className="mx-auto flex min-h-[90vh] max-w-7xl flex-col items-center justify-center px-6 text-center">

        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card-bg px-4 py-2 text-sm text-text-muted shadow-sm">
          <Sparkles size={16} className="text-primary" />
          AI-Powered Career Toolkit
        </div>

        <h1 className="max-w-5xl text-5xl font-black leading-tight tracking-tight text-text-main md:text-7xl">
          Land Your Next Job{" "}
          <span className="bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
            Faster
          </span>
        </h1>

        <p className="mt-8 max-w-3xl text-lg leading-8 text-text-muted md:text-xl">
          Career Toolkit helps you generate tailored cover letters, analyze your
          CV against job requirements, and organize every application—all in one
          intelligent workspace.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onGetStarted}
            className="group flex items-center gap-2 rounded-xl bg-primary px-7 py-4 font-semibold text-white transition hover:-translate-y-1 hover:bg-primary-hover"
          >
            Get Started
            <ArrowRight
              size={18}
              className="transition group-hover:translate-x-1"
            />
          </button>

          <button className="rounded-xl border border-border bg-card-bg px-7 py-4 font-medium text-text-main transition hover:bg-input-bg">
            Explore Features
          </button>
        </div>

        {/* Stats */}

        <div className="mt-14 flex flex-wrap items-center justify-center gap-10 text-sm text-text-muted">

          <div>
            <p className="text-2xl font-bold text-text-main">&lt;10s</p>
            <span>Cover Letter</span>
          </div>

          <div>
            <p className="text-2xl font-bold text-text-main">AI</p>
            <span>Gap Analysis</span>
          </div>

          <div>
            <p className="text-2xl font-bold text-text-main">PDF</p>
            <span>Ready Export</span>
          </div>

        </div>
      </section>

      {/* FEATURES */}

      <section className="mx-auto max-w-7xl px-6 pb-20">

        <div className="grid gap-6 md:grid-cols-3">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-border bg-card-bg p-8 transition hover:-translate-y-2 hover:border-primary/50"
              >
                <div className="mb-5 inline-flex rounded-xl bg-primary/10 p-3 text-primary">
                  <Icon size={26} />
                </div>

                <h3 className="mb-3 text-xl font-semibold text-text-main">
                  {feature.title}
                </h3>

                <p className="leading-7 text-text-muted">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* DASHBOARD MOCKUP */}

      <section className="mx-auto max-w-7xl px-6 pb-28">

        <div className="rounded-3xl border border-border bg-card-bg p-8 shadow-2xl">

          <div className="mb-8 flex items-center justify-between">

            <div>
              <h2 className="text-2xl font-bold text-text-main">
                Your Career Dashboard
              </h2>

              <p className="mt-2 text-text-muted">
                Manage everything from one place.
              </p>
            </div>

            <div className="rounded-full bg-success/10 px-4 py-2 text-sm text-success">
              AI Ready
            </div>

          </div>

          <div className="grid gap-6 lg:grid-cols-3">

            <div className="rounded-2xl border border-border bg-input-bg p-6">
              <p className="text-sm text-text-muted">CV Match Score</p>
              <h3 className="mt-3 text-5xl font-bold text-primary">89%</h3>
            </div>

            <div className="rounded-2xl border border-border bg-input-bg p-6">
              <p className="text-sm text-text-muted">Applications</p>
              <h3 className="mt-3 text-5xl font-bold text-text-main">14</h3>
            </div>

            <div className="rounded-2xl border border-border bg-input-bg p-6">
              <p className="text-sm text-text-muted">Interviews</p>
              <h3 className="mt-3 text-5xl font-bold text-text-main">3</h3>
            </div>

          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-border">

            <table className="w-full">

              <thead className="bg-input-bg">

                <tr className="text-left text-sm text-text-muted">

                  <th className="px-6 py-4">Company</th>
                  <th>Status</th>
                  <th>Updated</th>

                </tr>

              </thead>

              <tbody>

                {[
                  ["Google", "Interview", "Today"],
                  ["Tokopedia", "Applied", "Yesterday"],
                  ["Shopee", "Draft", "2 days ago"],
                ].map((row) => (
                  <tr
                    key={row[0]}
                    className="border-t border-border text-text-main"
                  >
                    <td className="px-6 py-4">{row[0]}</td>
                    <td>{row[1]}</td>
                    <td>{row[2]}</td>
                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

      </section>
    </main>
  );
}