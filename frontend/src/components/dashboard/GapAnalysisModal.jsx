import { useEffect } from 'react';
import { X, Sparkles, CheckCircle2, AlertCircle, Lightbulb, Building2, ExternalLink } from 'lucide-react';

export default function GapAnalysisModal({ isOpen, job, onClose }) {
  // close on 'Escape' key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !job) return null;

  const gapAnalysis = job.gap_analysis;
  if (!gapAnalysis) return null;

  const matchScore = job.match_score ?? gapAnalysis.match_score ?? null;

  const getScoreBadge = (score) => {
    if (score >= 80) {
      return {
        style: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
        label: 'Strong Alignment',
      };
    }
    if (score >= 65) {
      return {
        style: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
        label: 'Moderate Alignment',
      };
    }
    return {
      style: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
      label: 'Skill Gap Identified',
    };
  };

  const scoreBadge = matchScore !== null ? getScoreBadge(matchScore) : null;

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
      {/* Modal Container */}
      <div onClick={(e) => e.stopPropagation()} className="bg-card-bg border border-border rounded-2xl max-w-2xl w-full shadow-2xl text-text-main flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 border-b border-border/80 flex items-start justify-between gap-4 shrink-0 bg-gradient-to-r from-card-bg to-input-bg">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">AI Gap Analysis</span>
            </div>

            <h3 className="text-lg font-bold text-text-main truncate">{job.job_title}</h3>

            <div className="flex items-center gap-2 text-xs text-text-muted">
              <div className="flex items-center gap-1 font-medium text-text-main/90">
                <Building2 className="w-3.5 h-3.5" />
                <span>{job.company}</span>
              </div>
              {job.job_url && (
                <>
                  <span className="text-border">•</span>
                  <a href={job.job_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline">
                    <span>Job Post</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {matchScore !== null && (
              <div className={`flex flex-col items-end px-3.5 py-1.5 rounded-xl border ${scoreBadge.style}`}>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black">{matchScore}%</span>
                  <span className="text-[10px] uppercase font-bold opacity-80">Match</span>
                </div>
                <span className="text-[9px] font-medium opacity-75">{scoreBadge.label}</span>
              </div>
            )}

            <button onClick={onClose} className="p-2 text-text-muted hover:text-text-main hover:bg-input-bg rounded-xl border border-transparent hover:border-border transition cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Section 1: Advantages & Gaps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Key Advantages */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Key Advantages</h4>
              </div>

              <div className="space-y-2">
                {gapAnalysis.advantages?.length > 0 ? (
                  gapAnalysis.advantages.map((adv, idx) => (
                    <div key={idx} className="p-3 bg-input-bg/60 border border-border/60 rounded-xl text-xs text-text-main leading-relaxed flex items-start gap-2.5">
                      <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
                      <span>{adv}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-text-muted italic">No specific advantages listed.</p>
                )}
              </div>
            </div>

            {/* Identified Gaps */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-rose-400">
                <AlertCircle className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Identified Gaps</h4>
              </div>

              <div className="space-y-2">
                {gapAnalysis.disadvantages?.length > 0 ? (
                  gapAnalysis.disadvantages.map((dis, idx) => (
                    <div key={idx} className="p-3 bg-input-bg/60 border border-border/60 rounded-xl text-xs text-text-main leading-relaxed flex items-start gap-2.5">
                      <span className="text-rose-400 font-bold shrink-0 mt-0.5">•</span>
                      <span>{dis}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-text-muted italic">No critical skill gaps identified.</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Recommendations */}
          {gapAnalysis.recommendations?.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-border/70">
              <div className="flex items-center gap-1.5 text-primary">
                <Lightbulb className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Strategic Recommendations</h4>
              </div>

              <div className="space-y-2.5">
                {gapAnalysis.recommendations.map((rec, idx) => (
                  <div key={idx} className="p-3.5 bg-input-bg/70 border border-border/70 rounded-xl text-xs text-text-main leading-relaxed flex items-start gap-3">
                    <span className="flex items-center justify-center w-4 h-4 rounded-full bg-primary/20 text-primary text-[10px] font-bold shrink-0 mt-0.5">{idx + 1}</span>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-border/80 flex items-center justify-end bg-card-bg shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold bg-input-bg hover:bg-border text-text-main border border-border rounded-xl transition cursor-pointer">
            Close Breakdown
          </button>
        </div>
      </div>
    </div>
  );
}
