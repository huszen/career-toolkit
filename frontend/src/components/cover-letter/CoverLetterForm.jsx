import { useState } from 'react';

export default function CoverLetterForm({ onSubmit, loading, error }) {
  const [jobUrl, setJobUrl] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [runGapAnalysis, setRunGapAnalysis] = useState(false);
  const [formError, setFormError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!jobUrl || !cvFile) {
      setFormError('Please provide both a job URL and your CV PDF');
      return;
    }
    setFormError('');
    onSubmit({ jobUrl, cvFile, runGapAnalysis });
  };

  const activeError = error || formError;

  return (
    <div className="p-6 bg-card-bg rounded-xl shadow-md border border-border text-text-main">
      <h2 className="text-2xl font-bold mb-2">Cover Letter Generator</h2>
      <p className="text-text-muted mb-6 text-sm text-balance">
        Upload your profile resume and paste your target Jobstreet opening to auto-generate a tailored professional PDF.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold mb-2 text-text-muted">Jobstreet Opportunity Link</label>
          <input
            type="url"
            placeholder="https://id.jobstreet.com/id/job/..."
            value={jobUrl}
            onChange={(e) => setJobUrl(e.target.value)}
            className="w-full px-4 py-2.5 bg-input-bg border border-border rounded-lg text-text-main focus:outline-none focus:border-primary transition-colors text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-text-muted">Your Profile CV (PDF)</label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-text-main hover:file:bg-primary-hover file:cursor-pointer cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-3 p-3 bg-input-bg/40 rounded-lg border border-border">
          <input
            type="checkbox"
            id="gapAnalysisToggle"
            checked={runGapAnalysis}
            onChange={(e) => setRunGapAnalysis(e.target.checked)}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-input-bg border-slate-700 cursor-pointer"
          />
          <label htmlFor="gapAnalysisToggle" className="text-sm font-medium text-text-muted cursor-pointer select-none">
            Initialize downstream Gap Analysis (Evaluates match criteria via Gemini)
          </label>
        </div>

        {activeError && (
          <div className="p-3 bg-red-950/50 border border-red-900 rounded-lg text-red-400 text-sm">
            {activeError}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-primary hover:bg-primary-hover disabled:opacity-60 text-text-main font-medium rounded-lg shadow-sm transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-text-main" fill="none" viewBox="0 0 24 24">
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
  );
}
