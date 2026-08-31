import { Upload, Loader2, Sparkles, CheckCircle } from 'lucide-react';

export default function ProfileBanner({ cvData, isRefined, uploading, refining, onRefineClick, onFileChange }) {
  return (
    <div className="p-8 bg-gradient-to-br from-card-bg via-card-bg to-input-bg border border-border rounded-2xl shadow-sm flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
      <div className="space-y-2.5">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-bold text-text-main tracking-tight">{cvData ? 'Active Profile Resume' : 'No Resume Profile Connected'}</h3>
          {cvData && (
            <span className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium border ${isRefined ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' : 'text-success bg-success/10 border-success/20'}`}>
              <CheckCircle className="w-3.5 h-3.5" /> {isRefined ? 'AI Refined Profile' : 'Ready for AI'}
            </span>
          )}
        </div>
        <p className="text-sm text-text-muted max-w-2xl leading-relaxed">
          {cvData
            ? isRefined
              ? 'Your profile is beautifully structured for high-precision matching. You can update your resume PDF or re-refine at any time.'
              : 'Your baseline CV text is loaded. Refine your profile to organize your experience, projects, and skills into clean UI cards.'
            : 'Upload your CV PDF once to automatically populate your baseline profile and enable single-click cover letters and analysis.'}
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0 w-full xl:w-auto">
        {/* Refine Profile Button */}
        {cvData && !isRefined && (
          <button
            onClick={onRefineClick}
            disabled={refining || uploading}
            className="px-5 py-3 flex-1 xl:flex-none bg-input-bg hover:bg-border/60 text-primary border border-primary/30 text-sm font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-60"
          >
            {refining ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Refining...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-primary" />
                Refine Profile
              </>
            )}
          </button>
        )}

        {/* Upload Button */}
        <label className="px-5 py-3 flex-1 xl:flex-none bg-primary hover:bg-primary-hover disabled:opacity-60 text-text-main text-sm font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95">
          <input type="file" accept=".pdf" onChange={onFileChange} disabled={uploading || refining} className="hidden" />
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Parsing...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              {cvData ? 'Update Resume PDF' : 'Upload Resume PDF'}
            </>
          )}
        </label>
      </div>
    </div>
  );
}
