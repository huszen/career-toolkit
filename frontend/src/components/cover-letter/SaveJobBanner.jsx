import { CheckCircle2, AlertTriangle, Bookmark, Loader2 } from 'lucide-react';

export default function SaveJobBanner({
  currentUser,
  result,
  onSave,
  saving,
  saveStatus, // 'idle' | 'saved' | 'duplicate'
}) {
  return (
    <div className="p-5 bg-card-bg border border-border rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-text-main shadow-md transition-all">
      <div className="flex items-start gap-3">
        {/* Dynamic Icon Container */}
        <div
          className={`p-2.5 rounded-xl border shrink-0 ${
            saveStatus === 'duplicate' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : saveStatus === 'saved' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-primary/10 border-primary/20 text-primary'
          }`}
        >
          {saveStatus === 'duplicate' ? <AlertTriangle className="w-5 h-5" /> : saveStatus === 'saved' ? <CheckCircle2 className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
        </div>

        <div>
          <h4 className="text-sm font-semibold">{saveStatus === 'duplicate' ? 'Already in Dashboard' : saveStatus === 'saved' ? 'Successfully Saved' : currentUser ? 'Save application to dashboard?' : 'Track this application'}</h4>

          <p className="text-xs text-text-muted mt-0.5">
            {saveStatus === 'duplicate'
              ? `"${result.job_title}" at ${result.company} is already present in your tracking list.`
              : saveStatus === 'saved'
                ? `Saved "${result.job_title}" at ${result.company} to your dashboard.`
                : currentUser
                  ? `Save "${result.job_title}" at ${result.company} to your dashboard.`
                  : 'Log in or create a free account to track this application on your dashboard.'}
          </p>
        </div>
      </div>

      {/* Action Buttons & Status Badges */}
      <div className="w-full sm:w-auto shrink-0 flex items-center justify-end">
        {saveStatus === 'duplicate' ? (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold rounded-xl">
            <AlertTriangle className="w-3.5 h-3.5" />
            Already Saved
          </span>
        ) : saveStatus === 'saved' ? (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-xl">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Saved to Dashboard
          </span>
        ) : (
          <button
            onClick={onSave}
            disabled={saving}
            className="w-full sm:w-auto px-4 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-50 text-text-main text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Saving...
              </>
            ) : currentUser ? (
              'Save to Dashboard'
            ) : (
              'Log in to Save'
            )}
          </button>
        )}
      </div>
    </div>
  );
}
