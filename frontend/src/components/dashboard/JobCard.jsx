import { ExternalLink, FileText, Trash2, Building2, Layers } from 'lucide-react';

export default function JobCard({ job, onViewPdf, onStatusChange, onDelete, isVerifying, isDeleting }) {
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

  const currentStatusConfig = STATUS_CONFIG[job.status] || STATUS_CONFIG.Saved;

  return (
    <div className="group p-5 bg-card-bg hover:bg-card-bg/90 border border-border hover:border-border-focus/50 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all duration-200 shadow-sm hover:shadow-md">
      {/* Job Details */}
      <div className="space-y-2 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-bold text-base text-text-main tracking-tight group-hover:text-primary transition-colors">{job.job_title}</h3>
          {job.platform && <span className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded-md bg-input-bg border border-border/80 text-text-muted">{job.platform}</span>}
        </div>

        <div className="flex items-center gap-2 text-xs text-text-muted">
          <div className="flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-text-muted/80" />
            <span className="font-medium text-text-main/90">{job.company}</span>
          </div>

          {job.gap_analysis && (
            <>
              <span className="text-border">•</span>
              <span className="flex items-center gap-1 text-[11px] text-primary">
                <Layers className="w-3 h-3" />
                Gap Analysis Ready
              </span>
            </>
          )}
        </div>

        {job.job_url && (
          <a href={job.job_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] text-text-muted hover:text-primary transition-colors">
            <span>Original Listing</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      {/* Action Controls */}
      <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border/60">
        {job.cover_letter_url && (
          <button
            onClick={() => onViewPdf(job.id, job.cover_letter_url)}
            disabled={isVerifying}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-success/10 hover:bg-success/20 text-success border border-success/30 rounded-xl transition disabled:opacity-50 cursor-pointer shadow-sm"
          >
            <FileText className="w-3.5 h-3.5" />
            {isVerifying ? 'Verifying...' : 'Cover Letter'}
          </button>
        )}

        {/* Status Dropdown */}
        <div className="relative inline-block">
          <select
            value={job.status || 'Saved'}
            onChange={(e) => onStatusChange(job.id, e.target.value)}
            className={`text-xs font-semibold pl-3 pr-7 py-1.5 rounded-xl border appearance-none cursor-pointer focus:outline-none transition ${currentStatusConfig.color}`}
          >
            {Object.keys(STATUS_CONFIG).map((status) => (
              <option key={status} value={status} className="bg-card-bg text-text-main">
                {status}
              </option>
            ))}
          </select>
          <span className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full pointer-events-none ${currentStatusConfig.dot}`} />
        </div>

        {/* Delete Trigger */}
        <button
          onClick={() => onDelete(job.id, job.job_title)}
          disabled={isDeleting}
          title="Delete Application"
          className="p-2 text-text-muted hover:text-danger hover:bg-danger/10 border border-transparent hover:border-danger/30 rounded-xl transition disabled:opacity-50 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
