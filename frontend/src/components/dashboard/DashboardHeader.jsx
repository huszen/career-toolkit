import { Briefcase, CheckCircle2, AlertCircle, TrendingUp, Sparkles, RefreshCw } from 'lucide-react';

export default function DashboardHeader({ userEmail, onRefresh, jobs = [], hasCv = false }) {
  // Quick metrics calculations
  const totalJobs = jobs.length;
  const appliedCount = jobs.filter((j) => j.status === 'Applied').length;
  const interviewCount = jobs.filter((j) => j.status === 'Interviewing').length;
  const offerCount = jobs.filter((j) => j.status === 'Offer').length;

  return (
    <div className="space-y-6">
      {/* Top Welcome & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-text-main">Career Command Center</h1>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 rounded-full">Live</span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Welcome back, <span className="text-text-main font-medium">{userEmail}</span>
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-2 text-xs font-medium bg-card-bg hover:bg-input-bg text-text-muted hover:text-text-main rounded-xl border border-border transition-all duration-200 shadow-sm active:scale-95 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Global Analytics & Metric Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Metric 1: Total Saved */}
        <div className="p-4 bg-card-bg/70 border border-border hover:border-border-focus/40 rounded-2xl transition-all duration-200 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-text-muted">Tracked Jobs</span>
            <div className="p-2 bg-input-bg rounded-xl border border-border/60 text-primary">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-text-main">{totalJobs}</span>
            <span className="text-[10px] text-text-muted">positions</span>
          </div>
        </div>

        {/* Metric 2: Active Pipelines */}
        <div className="p-4 bg-card-bg/70 border border-border hover:border-border-focus/40 rounded-2xl transition-all duration-200 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-text-muted">In Review / Applied</span>
            <div className="p-2 bg-input-bg rounded-xl border border-border/60 text-primary">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-text-main">{appliedCount}</span>
            <span className="text-[10px] text-text-muted">pending</span>
          </div>
        </div>

        {/* Metric 3: Interviews & Offers */}
        <div className="p-4 bg-card-bg/70 border border-border hover:border-border-focus/40 rounded-2xl transition-all duration-200 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-text-muted">Interviews & Offers</span>
            <div className="p-2 bg-input-bg rounded-xl border border-border/60 text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-text-main">{interviewCount + offerCount}</span>
            <span className="text-[10px] text-emerald-400 font-medium">({offerCount} offer)</span>
          </div>
        </div>

        {/* Metric 4: CV Sync Status */}
        <div className="p-4 bg-card-bg/70 border border-border hover:border-border-focus/40 rounded-2xl transition-all duration-200 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-text-muted">CV Auto-Bridge</span>
            <div className={`p-2 rounded-xl border ${hasCv ? 'bg-success/10 border-success/30 text-success' : 'bg-danger/10 border-danger/30 text-danger'}`}>
              {hasCv ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-xs font-semibold text-text-main">{hasCv ? 'Synced & Ready' : 'Action Required'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
