export default function SaveJobBanner( {currentUser, result, onSave, saving, saveSuccess}) {
    return (
    <div className="p-4 bg-card-bg border border-border rounded-xl flex items-center justify-between gap-4">
      <div>
        <h4 className="text-sm font-semibold text-text-main">
          {currentUser ? 'Save application to dashboard?' : 'Track this application'}
        </h4>
        <p className="text-xs text-text-muted mt-0.5">
          {currentUser
            ? `Save "${result.job_title}" at ${result.company} to your dashboard.`
            : 'Log in or create a free account to track this application on your dashboard.'}
        </p>
      </div>

      {saveSuccess ? (
        <span className="px-3 py-1.5 bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-xs font-semibold rounded-lg">
          ✓ Saved to Dashboard
        </span>
      ) : (
        <button
          onClick={onSave}
          disabled={saving}
          className="px-4 py-2 bg-primary hover:bg-primary-hover disabled:opacity-50 text-text-main text-xs font-semibold rounded-lg transition shrink-0 cursor-pointer"
        >
          {saving ? 'Saving...' : currentUser ? 'Save to Dashboard' : 'Log in to Save'}
        </button>
      )}
    </div>
  );
}