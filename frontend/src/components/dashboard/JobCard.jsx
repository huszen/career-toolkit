// src/components/dashboard/JobCard.jsx
export default function JobCard({
  job,
  onViewPdf,
  onStatusChange,
  onDelete,
  isVerifying,
  isDeleting,
}) {
  const STATUS_OPTIONS = ['Saved', 'Applied', 'Interviewing', 'Offer', 'Rejected'];

  const getBadgeColor = (status) => {
    switch (status) {
      case 'Applied':
        return 'bg-primary/10 text-primary border-primary/30';
      case 'Interviewing':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Offer':
        return 'bg-success/10 text-success border-success/30';
      case 'Rejected':
        return 'bg-danger/10 text-danger border-danger/30';
      default:
        return 'bg-card-bg text-text-muted border-border';
    }
  };

  return (
    <div className="p-5 bg-card-bg border border-border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
      <div className="space-y-1">
        <h3 className="font-bold text-lg">{job.job_title}</h3>
        <p className="text-sm text-text-muted">{job.company}</p>
        {job.job_url && (
          <a
            href={job.job_url}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-primary hover:underline inline-block mt-1"
          >
            View Original Job Post ↗
          </a>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {job.cover_letter_url && (
          <button
            onClick={() => onViewPdf(job.id, job.cover_letter_url)}
            disabled={isVerifying}
            className="px-3 py-1.5 text-xs bg-success/10 hover:bg-success/20 text-success border border-success/30 rounded-lg transition disabled:opacity-50 cursor-pointer"
          >
            {isVerifying ? 'Checking...' : 'View PDF'}
          </button>
        )}

        <select
          value={job.status || 'Saved'}
          onChange={(e) => onStatusChange(job.id, e.target.value)}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg border cursor-pointer ${getBadgeColor(job.status)}`}
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status} className="bg-card-bg text-text-main">
              {status}
            </option>
          ))}
        </select>

        <button
          onClick={() => onDelete(job.id, job.job_title)}
          disabled={isDeleting}
          title="Delete Job Application"
          className="p-2 text-text-muted hover:text-danger hover:bg-danger/10 border border-transparent hover:border-danger/30 rounded-lg transition disabled:opacity-50 cursor-pointer"
        >
          {isDeleting ? (
            <span className="text-xs">Deleting...</span>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}