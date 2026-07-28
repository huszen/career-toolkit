import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

import { generateCoverLetter, saveJobToDashboard } from '../services/api';

import CoverLetterForm from '../components/cover-letter/CoverLetterForm';
import SaveJobBanner from '../components/cover-letter/SaveJobBanner';
import GapAnalysisReport from '../components/cover-letter/GapAnalysisReport';

export default function CoverLetterGenerationPage() {
  const { currentUser, getToken } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [currentJobUrl, setCurrentJobUrl] = useState('');

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Hanldle pipeline generation
  const handleGenerate = async ({ jobUrl, cvFile, runGapAnalysis }) => {
    setLoading(true);
    setError('');
    setResult(null);
    setSaveSuccess(false);
    setCurrentJobUrl(jobUrl);

    try {
      const data = await generateCoverLetter({ jobUrl, cvFile, runGapAnalysis });
      setResult(data);
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

  return (
    <div className="max-w-3xl mx-auto space-y-6 mt-10 p-4">
      <CoverLetterForm onSubmit={handleGenerate} loading={loading} error={error} />

      {result && (
        <div className="space-y-6">
          <SaveJobBanner currentUser={currentUser} result={result} onSave={handleSaveJob} saving={saving} saveSuccess={saveSuccess} />

          {result.cover_letter_url && (
            <div className="p-5 bg-card-bg border border-emerald-900/40 rounded-xl flex items-center justify-between text-text-main shadow-md">
              <div>
                <h3 className="font-semibold text-emerald-400 text-base">Cover Letter Generated Successfully!</h3>
                <p className="text-xs text-text-muted mt-1">Your document has been styled and stored on the server.</p>
              </div>
              <a href={result.cover_letter_url} target="_blank" rel="noreferrer" download className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 font-medium text-sm rounded-lg transition-colors cursor-pointer">
                Download PDF File
              </a>
            </div>
          )}

          <GapAnalysisReport gapAnalysis={result.gap_analysis} />
        </div>
      )}
    </div>
  );
}
