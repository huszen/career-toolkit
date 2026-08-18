import { ExternalLink, FileText, Trash2, Building2, Sparkles, MapPin, Clock, ChevronRight } from 'lucide-react';

export default function JobCard({ job, onViewPdf, onStatusChange, onDelete, onOpenGapAnalysis, isVerifying, isDeleting }) {
  const STATUS_CONFIG = {
    Saved: {
      color: 'bg-card-bg text-text-muted border-border',
      dot: 'bg-text-muted',
    },
    Applied: {
      color: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      dot: 'bg-blue-400',
    },
    Interviewing: {
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      dot: 'bg-amber-400',
    },
    Offer: {
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      dot: 'bg-emerald-400',
    },
    Rejected: {
      color: 'bg-danger/10 text-danger border-danger/30',
      dot: 'bg-danger',
    },
  };

  const PLATFORM_CONFIG = {
    LinkedIn: 'bg-[#0A66C2]/10 text-[#70B5F9] border-[#0A66C2]/30',
    JobStreet: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    Other: 'bg-input-bg text-text-muted border-border/80',
  };

  const currentStatusConfig = STATUS_CONFIG[job.status] || STATUS_CONFIG.Saved;
  const platformStyle = PLATFORM_CONFIG[job.platform] || PLATFORM_CONFIG.Other;

  const getElapsedDays = (dateString) => {
    if (!dateString) return null;
    const created = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1d ago';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return `${Math.floor(diffDays / 30)}mo ago`;
  };

  const timeAgo = getElapsedDays(job.applied_at || job.created_at);
  const matchScore = job.match_score ?? job.gap_analysis?.match_score ?? null;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 65) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  return (
    <div className="group relative p-6 bg-card-bg hover:bg-card-bg/90 border border-border hover:border-border-focus/40 rounded-2xl flex flex-col xl:flex-row xl:items-center justify-between gap-6 transition-all duration-200 shadow-sm hover:shadow-md">
      {/* Left Column: Job Info & Context */}
      <div className="space-y-3 min-w-0 flex-1">
        {/* Row 1: Eyebrow Meta (Platform + Time) */}
        <div className="flex items-center gap-3">
          {job.platform && <span className={`px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded border ${platformStyle}`}>{job.platform}</span>}
          {timeAgo && (
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-text-muted">
              <Clock className="w-3.5 h-3.5 opacity-70" />
              {timeAgo}
            </span>
          )}
        </div>

        {/* Row 2: Job Title */}
        <h3 className="font-bold text-lg text-text-main tracking-tight group-hover:text-primary transition-colors truncate">{job.job_title}</h3>

        {/* Row 3: Company + Location + Links (Cleanly Spaced) */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-text-muted">
          <div className="flex items-center gap-2 font-medium text-text-main/90">
            <Building2 className="w-4 h-4 text-text-muted" />
            <span className="truncate max-w-[180px]">{job.company}</span>
          </div>

          {job.location && (
            <div className="flex items-center gap-2 text-text-muted">
              <MapPin className="w-4 h-4 opacity-70" />
              <span className="truncate max-w-[150px]">{job.location}</span>
            </div>
          )}

          {job.job_url && (
            <a href={job.job_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-primary/80 hover:text-primary transition-colors hover:underline">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Post</span>
            </a>
          )}
        </div>
      </div>

      {/* Right Column: Divided Actions */}
      <div className="flex flex-wrap items-center gap-4 shrink-0 pt-4 xl:pt-0 border-t xl:border-t-0 border-border/60">
        {/* Action Group 1: AI Tools */}
        <div className="flex items-center gap-2.5">
          {job.gap_analysis && (
            <button
              onClick={() => onOpenGapAnalysis?.(job)}
              title="View full AI Gap Analysis breakdown"
              className={`group/btn flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border transition-all duration-200 cursor-pointer shadow-sm hover:-translate-y-0.5 active:translate-y-0 ${
                matchScore ? getScoreColor(matchScore) : 'bg-primary/10 text-primary border-primary/30'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{matchScore ? `${matchScore}% Match` : 'Gap Analysis'}</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          )}

          {job.cover_letter_url && (
            <button
              onClick={() => onViewPdf(job.id, job.cover_letter_url)}
              disabled={isVerifying}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-input-bg hover:bg-border/60 text-text-main border border-border rounded-xl transition-all hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer shadow-sm"
            >
              <FileText className="w-3.5 h-3.5 text-primary" />
              <span>{isVerifying ? 'Verifying...' : 'Cover Letter'}</span>
            </button>
          )}
        </div>

        {/* Divider (Only visible on larger screens) */}
        {(job.gap_analysis || job.cover_letter_url) && <div className="hidden sm:block w-px h-8 bg-border/80 mx-1"></div>}

        {/* Action Group 2: Tracking & Delete */}
        <div className="flex items-center gap-2.5">
          <div className="relative inline-block">
            <select
              value={job.status || 'Saved'}
              onChange={(e) => onStatusChange(job.id, e.target.value)}
              className={`text-xs font-bold pl-3.5 pr-8 py-2 rounded-xl border appearance-none cursor-pointer focus:outline-none transition-all shadow-sm ${currentStatusConfig.color}`}
            >
              {Object.keys(STATUS_CONFIG).map((status) => (
                <option key={status} value={status} className="bg-card-bg text-text-main">
                  {status}
                </option>
              ))}
            </select>
            <span className={`absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full pointer-events-none shadow-sm ${currentStatusConfig.dot}`} />
          </div>

          <button
            onClick={() => onDelete(job.id, job.job_title)}
            disabled={isDeleting}
            title="Delete Application"
            className="p-2 text-text-muted hover:text-danger hover:bg-danger/10 border border-transparent hover:border-danger/30 rounded-xl transition-all hover:scale-105 disabled:opacity-50 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
