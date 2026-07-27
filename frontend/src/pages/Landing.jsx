export default function Landing({ onGetStarted }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-text-main">
        Automate Your <span className="bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">Job Applications</span>
      </h1>

      <p className="text-lg text-text-muted max-w-2xl mb-10 leading-relaxed">An intelligent career suite designed to parse your CV, scrape active Jobstreet postings, and compose tailored cover letters instantly.</p>

      <button onClick={onGetStarted} className="bg-gradient-to-r from-primary to-primary-hover hover:opacity-90 text-text-main font-semibold px-8 py-4 rounded-xl shadow-lg shadow-primary/20 transition transform hover:-translate-y-0.5">
        Get Started Free
      </button>
    </div>
  );
}
