import { useState } from 'react';
import { Sparkles, Link2, Upload, FileText, AlertCircle, Loader2, BadgeCheck, CheckCircle2, RefreshCw } from 'lucide-react';

export default function CoverLetterForm({ onSubmit, loading, error, savedCv }) {
  const [jobUrl, setJobUrl] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [useSavedCv, setUseSavedCv] = useState(Boolean(savedCv));
  const [runGapAnalysis, setRunGapAnalysis] = useState(false);
  const [formError, setFormError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!jobUrl) {
      setFormError('Please provide both a job URL and your CV PDF.');
      return;
    }

    if (!useSavedCv && !cvFile) {
      setFormError('Please upload your CV PDF or use your saved profile');
      return;
    }

    setFormError('');
    onSubmit({
      jobUrl,
      cvFile: useSavedCv ? null : cvFile,
      runGapAnalysis,
    });
  };

  const activeError = error || formError;

  return (
    <div className="rounded-2xl border border-border bg-card-bg shadow-lg p-7 text-text-main">
      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>

        <div>
          <h2 className="text-2xl font-semibold">Cover Letter Generator</h2>
          <p className="text-sm text-text-muted mt-1 max-w-lg">Generate an ATS-optimized cover letter from a job posting and your resume profile.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Job URL */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-text-muted">Job Posting</label>
            <div className="flex gap-2">
              <span className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[11px] font-medium">LinkedIn</span>
              <span className="px-2 py-1 rounded-full bg-purple-500/10 text-purple-400 text-[11px] font-medium">JobStreet</span>
            </div>
          </div>

          <div className="relative">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="url"
              placeholder="Paste a LinkedIn or JobStreet URL..."
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-input-bg border border-border focus:outline-none focus:border-primary transition-all text-sm"
            />
          </div>
        </div>

        {/* CV Input Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-text-muted">Resume / CV</label>
            {savedCv && (
              <button type="button" onClick={() => setUseSavedCv(!useSavedCv)} className="text-xs text-primary hover:underline flex items-center gap-1 cursor-pointer">
                <RefreshCw className="w-3 h-3" />
                {useSavedCv ? 'Upload different PDF' : 'Use saved CV profile'}
              </button>
            )}
          </div>

          {savedCv && useSavedCv ? (
            /* Saved CV Active Card */
            <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-main">
                    Using Saved CV Profile: <span className="text-primary">{savedCv.identity?.name || 'Default CV'}</span>
                  </p>
                  <p className="text-xs text-text-muted">{savedCv.identity?.email || 'Saved Profile'} • No upload needed</p>
                </div>
              </div>
            </div>
          ) : (
            /* Manual Upload Box */
            <label className="block cursor-pointer rounded-xl border-2 border-dashed border-border bg-input-bg hover:border-primary hover:bg-primary/5 transition-all p-8">
              <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
              <div className="flex flex-col items-center text-center">
                <Upload className="w-8 h-8 text-primary mb-3" />
                <p className="font-medium">Click to upload your resume</p>
                <p className="text-sm text-text-muted mt-1">PDF format only</p>
                {cvFile && (
                  <div className="mt-4 flex items-center gap-2 rounded-lg bg-primary/10 border border-primary/20 px-3 py-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{cvFile.name}</span>
                  </div>
                )}
              </div>
            </label>
          )}
        </div>

        {/* Gap Analysis Toggle */}
        <label className={`flex items-start gap-4 rounded-xl border p-4 cursor-pointer transition-all ${runGapAnalysis ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'}`}>
          <input type="checkbox" checked={runGapAnalysis} onChange={(e) => setRunGapAnalysis(e.target.checked)} className="mt-1 h-4 w-4 cursor-pointer" />
          <div>
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-primary" />
              <p className="font-medium">Include Gap Analysis</p>
            </div>
            <p className="text-sm text-text-muted mt-1">Compare your resume against the job requirements and receive an ATS match score.</p>
          </div>
        </label>

        {/* Error Message */}
        {activeError && (
          <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{activeError}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-60 transition-all py-3 font-medium flex items-center justify-center gap-2 cursor-pointer shadow-md text-text-main"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Cover Letter
            </>
          )}
        </button>
      </form>
    </div>
  );
}
