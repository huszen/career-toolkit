import { useState } from 'react';

export default function CoverLetter() {
  const [jobUrl, setJobUrl] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [runGapAnalysis, setRunGapAnalysis] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pipeline output states
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobUrl || !cvFile) {
      setError('Please provide both a job URL and your CV PDF');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('job_url', jobUrl);
    formData.append('cv_file', cvFile);
    formData.append('run_gap_analysis', runGapAnalysis); 

    try {
      const response = await fetch('http://127.0.0.1:8000/api/generate-cover-letter', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to complete the operation pipeline.');
      }

      const data = await response.json(); 
      setResult(data);
    } catch (error) {
      console.error('Detailed Fetch Error Block', error);
      setError(error.message || 'Something went wrong while executing the pipeline.');
    } finally {
      setLoading(false);
    }
  };

  // Helper component to color-code match thresholds dynamically
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20';
    if (score >= 60) return 'text-amber-400 border-amber-500/30 bg-amber-950/20';
    return 'text-rose-400 border-rose-500/30 bg-rose-950/20';
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 mt-10 p-4">
      <div className="p-6 bg-slate-900 rounded-xl shadow-md border border-slate-800 text-white">
        <h2 className="text-2xl font-bold mb-2">Cover Letter Generator</h2>
        <p className="text-slate-400 mb-6 text-sm text-balance">
          Upload your profile resume and paste your target Jobstreet opening to auto-generate a tailored professional PDF.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Job URL Input */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-300">Jobstreet Opportunity Link</label>
            <input
              type="url"
              placeholder="https://id.jobstreet.com/id/job/..."
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 transition-colors text-sm"
            />
          </div>

          {/* CV File Input */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-300">Your Profile CV (PDF)</label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer cursor-pointer"
            />
          </div>

          {/* Gap Analysis Toggle Control */}
          <div className="flex items-center gap-3 p-3 bg-slate-950/40 rounded-lg border border-slate-800">
            <input
              type="checkbox"
              id="gapAnalysisToggle"
              checked={runGapAnalysis}
              onChange={(e) => setRunGapAnalysis(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-950 border-slate-700 cursor-pointer"
            />
            <label htmlFor="gapAnalysisToggle" className="text-sm font-medium text-slate-300 cursor-pointer select-none">
              Initialize downstream Gap Analysis (Evaluates match criteria via Gemini)
            </label>
          </div>

          {/* Error Feedback */}
          {error && <div className="p-3 bg-red-950/50 border border-red-900 rounded-lg text-red-400 text-sm">{error}</div>}

          {/* Action Execution Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium rounded-lg shadow-sm transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing Application Context Pipelines...
              </>
            ) : (
              'Run Master Application Pipeline'
            )}
          </button>
        </form>
      </div>

      {/* Output Context Blocks */}
      {result && (
        <div className="space-y-6">
          {/* Action Success Card */}
          {result.cover_letter_url && (
            <div className="p-5 bg-slate-900 border border-emerald-900/40 rounded-xl flex items-center justify-between text-white shadow-md">
              <div>
                <h3 className="font-semibold text-emerald-400 text-base">Cover Letter Generated Successfully!</h3>
                <p className="text-xs text-slate-400 mt-1">Your document has been styled and stored on the server.</p>
              </div>
              <a href={result.cover_letter_url} target="_blank" rel="noreferrer" download className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 font-medium text-sm rounded-lg transition-colors cursor-pointer">
                Download PDF File
              </a>
            </div>
          )}

          {/* Beautiful Gap Analysis Layout UI Replacement */}
          {result.gap_analysis && (
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl text-white space-y-6 shadow-md">
              
              {/* Header block with interactive radial metrics */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <h3 className="text-xl font-bold text-slate-100">Gemini AI Gap Analysis Report</h3>
                  <p className="text-xs text-slate-400 mt-1">Real-time vector alignment metrics comparing CV semantics against operational JD targets</p>
                </div>
                
                {/* Match Score Badge */}
                {result.gap_analysis.match_score !== undefined && (
                  <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${getScoreColor(result.gap_analysis.match_score)}`}>
                    <span className="text-xs font-semibold tracking-wider uppercase opacity-80">Match Score</span>
                    <span className="text-2xl font-black">{result.gap_analysis.match_score}%</span>
                  </div>
                )}
              </div>

              {/* Two Column Grid for Structural Advantages vs Disadvantages */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Key Advantages */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Key Advantages
                  </h4>
                  <ul className="space-y-2.5">
                    {result.gap_analysis.advantages?.map((adv, idx) => (
                      <li key={idx} className="text-sm text-slate-300 bg-slate-950/40 p-3 rounded-lg border border-slate-800/60 leading-relaxed flex items-start gap-2.5">
                        <span className="text-emerald-500 shrink-0 mt-0.5">•</span>
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Detected Blindspots / Gaps */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Identified Gaps
                  </h4>
                  <ul className="space-y-2.5">
                    {result.gap_analysis.disadvantages?.map((dis, idx) => (
                      <li key={idx} className="text-sm text-slate-300 bg-slate-950/40 p-3 rounded-lg border border-slate-800/60 leading-relaxed flex items-start gap-2.5">
                        <span className="text-rose-500 shrink-0 mt-0.5">•</span>
                        <span>{dis}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actionable Strategic Recommendations Footer Section */}
              {result.gap_analysis.recommendations && (
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <h4 className="text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Strategic Recommendations
                  </h4>
                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 divide-y divide-slate-800/60">
                    {result.gap_analysis.recommendations.map((rec, idx) => (
                      <div key={idx} className="py-2.5 first:pt-0 last:pb-0 text-sm text-slate-300 flex items-start gap-3">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-950 text-blue-400 text-xs font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="leading-relaxed">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}