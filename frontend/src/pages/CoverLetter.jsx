import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Download, CheckCircle2 } from 'lucide-react';

import { generateCoverLetter, saveJobToDashboard } from '../services/api';

import CoverLetterForm from '../components/cover-letter/CoverLetterForm';
import CollapsedFormSummary from '../components/cover-letter/CollapsedFormSummary';
import SaveJobBanner from '../components/cover-letter/SaveJobBanner';
import GapAnalysisReport from '../components/cover-letter/GapAnalysisReport';

export default function CoverLetterGenerationPage() {
  const { currentUser, getToken } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [currentJobUrl, setCurrentJobUrl] = useState('');
  const [cvFileName, setCvFileName] = useState('');

  const [isFormCollapsed, setIsFormCollapsed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Hanldle pipeline generation
  const handleGenerate = async ({ jobUrl, cvFile, runGapAnalysis }) => {
    setLoading(true);
    setError('');
    setResult(null);
    setSaveSuccess(false);
    setCurrentJobUrl(jobUrl);
    setCvFileName(cvFile?.name || 'Uploaded CV');

    try {
      const data = await generateCoverLetter({ jobUrl, cvFile, runGapAnalysis });
      setResult(data);
      setIsFormCollapsed(true);
    } catch (err) {
      console.error('Pipeline Error:', err);
      setError(err.message || 'Something went wrong while executing the pipeline');
    } finally {
      setLoading(false);
    }
  };

  // Handle saving to dashboard
  const handleSaveJob = async () => {
    if (!currentUser) {
      alert('Please log in to save jobs to your dashboard');
      return;
    }

    try {
      setSaving(true);
      const token = await getToken();

      const payload = {
        job_url: currentJobUrl,
        job_title: result.job_title || 'Unknown Title',
        company: result.company || 'Unknown Company',
        status: 'Saved',
        cover_letter_url: result.cover_letter_url || null,
        gap_analysis: result.gap_analysis || null,
      };

      await saveJobToDashboard(payload, token);
      setSaveSuccess(true);
    } catch (err) {
      console.error('Save Job Error:', err);
      alert('Failed to save job. Please try again');
    } finally {
      setSaving(false);
    }
  };

  const handleResetForm = () => {
    setResult(null);
    setIsFormCollapsed(false);
    setSaveSuccess(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 my-10 p-4">
      {/* Form Section */}
      {isFormCollapsed && result ? (
        <CollapsedFormSummary cvFileName={cvFileName} currentJobUrl={currentJobUrl} onEdit={() => setIsFormCollapsed(false)} onReset={handleResetForm} />
      ) : (
        <CoverLetterForm onSubmit={handleGenerate} loading={loading} error={error} />
      )}

      {/* Results Section */}
      {result && (
        <div className="space-y-6 animate-in fade-in-50 duration-500">
          <SaveJobBanner currentUser={currentUser} result={result} onSave={handleSaveJob} saving={saving} saveSuccess={saveSuccess} />

          {result.cover_letter_url && (
            <div className="p-6 bg-card-bg border border-emerald-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-text-main shadow-lg">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-400 text-base">Cover Letter Generated Successfully!</h3>
                  <p className="text-xs text-text-muted mt-0.5">Your styled PDF has been compiled and is ready for application submission.</p>
                </div>
              </div>

              <a
                href={result.cover_letter_url}
                target="_blank"
                rel="noreferrer"
                download
                className="w-full sm:w-auto py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </a>
            </div>
          )}

          <GapAnalysisReport gapAnalysis={result.gap_analysis} />
        </div>
      )}
    </div>
  );
}
