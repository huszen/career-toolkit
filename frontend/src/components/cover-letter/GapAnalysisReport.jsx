export default function GapAnalysisReport({ gapAnalysis }) {
  if (!gapAnalysis) return null;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success border-success/30 bg-success/10';
    if (score >= 60) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-danger border-danger/30 bg-danger/10';
  };

  return (
    <div className="p-6 bg-card-bg border border-border rounded-xl text-text-main space-y-6 shadow-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h3 className="text-xl font-bold text-text-main">Gemini AI Gap Analysis Report</h3>
          <p className="text-xs text-text-muted mt-1">Real-time vector alignment metrics comparing CV semantics against operational JD targets</p>
        </div>

        {gapAnalysis.match_score !== undefined && (
          <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${getScoreColor(gapAnalysis.match_score)}`}>
            <span className="text-xs font-semibold tracking-wider uppercase opacity-80">Match Score</span>
            <span className="text-2xl font-black">{gapAnalysis.match_score}%</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Advantages */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Key Advantages
          </h4>
          <ul className="space-y-2.5">
            {gapAnalysis.advantages?.map((adv, idx) => (
              <li key={idx} className="text-sm text-text-muted bg-input-bg/40 p-3 rounded-lg border border-border/60 leading-relaxed flex items-start gap-2.5">
                <span className="text-emerald-500 shrink-0 mt-0.5">•</span>
                <span>{adv}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Identified Gaps */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Identified Gaps
          </h4>
          <ul className="space-y-2.5">
            {gapAnalysis.disadvantages?.map((dis, idx) => (
              <li key={idx} className="text-sm text-text-muted bg-input-bg/40 p-3 rounded-lg border border-border/60 leading-relaxed flex items-start gap-2.5">
                <span className="text-rose-500 shrink-0 mt-0.5">•</span>
                <span>{dis}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Strategic Recommendations */}
      {gapAnalysis.recommendations?.length > 0 && (
        <div className="pt-4 border-t border-border space-y-3">
          <h4 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            Strategic Recommendations
          </h4>
          <div className="bg-input-bg/60 border border-border rounded-xl p-4 divide-y divide-slate-800/60">
            {gapAnalysis.recommendations.map((rec, idx) => (
              <div key={idx} className="py-2.5 first:pt-0 last:pb-0 text-sm text-text-muted flex items-start gap-3">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary text-xs font-bold shrink-0 mt-0.5">{idx + 1}</span>
                <p className="leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
