import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { generateCoverLetter, saveJobToDashboard, fetchUserCv } from '../services/api';

export function useCoverLetter() {
  const { currentUser, getToken } = useAuth();

  const [savedCv, setSavedCv] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [currentJobUrl, setCurrentJobUrl] = useState('');
  const [cvFileName, setCvFileName] = useState('');

  const [isFormCollapsed, setIsFormCollapsed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle');

  // Fetch saved CV on page mount or when user state changes
  useEffect(() => {
    async function loadSavedCvProfile() {
      if (currentUser) {
        try {
          const token = await getToken();
          const res = await fetchUserCv(token);
          if (res?.cv_data) {
            setSavedCv(res.cv_data);
          }
        } catch (err) {
          console.error('Failed to load user CV Profile', err);
        }
      } else {
        setSavedCv(null);
      }
    }
    loadSavedCvProfile();
  }, [currentUser, getToken]);

  const handleGenerate = async ({ jobUrl, cvFile, runGapAnalysis }) => {
    setLoading(true);
    setError('');
    setResult(null);
    setSaveSuccess(false);
    setCurrentJobUrl(jobUrl);
    setCvFileName(cvFile ? cvFile.name : `Saved Profile (${savedCv?.identity?.name || 'Default'})`);
    setSaveStatus('idle');

    try {
      const token = currentUser ? await getToken() : null;
      const data = await generateCoverLetter({ jobUrl, cvFile, runGapAnalysis }, token);
      setResult(data);
      setIsFormCollapsed(true);
    } catch (err) {
      console.error('Pipeline Error:', err);
      setError(err.message || 'Something went wrong while executing the pipeline');
    } finally {
      setLoading(false);
    }
  };

  const executeSaveJob = async () => {
    try {
      setSaving(true);
      const token = await getToken();

      const payload = {
        job_url: currentJobUrl,
        job_title: result.job_title || 'Unknown Title',
        company: result.company || 'Unknown Company',
        platform: result.platform || null,
        location: result.location || null,
        status: 'Saved',
        match_score: result.gap_analysis?.match_score ?? result.match_score ?? null,
        cover_letter_url: result.cover_letter_url || null,
        gap_analysis: result.gap_analysis || null,
      };

      const response = await saveJobToDashboard(payload, token);

      if (response.is_duplicate) {
        setSaveStatus('duplicate');
      } else if (response.success) {
        setSaveStatus('saved');
      }
    } catch (err) {
      console.error('Save Job Error:', err);
      setError('Failed to save job to dashboard. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveJob = async () => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    await executeSaveJob();
  };

  const handleAuthSuccess = async () => {
    await executeSaveJob();
  };

  const handleResetForm = () => {
    setResult(null);
    setIsFormCollapsed(false);
    setSaveSuccess(false);
  };

  const handleEditForm = () => {
    setIsFormCollapsed(false);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return {
    state: {
      currentUser,
      savedCv,
      loading,
      error,
      result,
      currentJobUrl,
      cvFileName,
      isFormCollapsed,
      saving,
      saveSuccess,
      isAuthModalOpen,
      saveStatus,
    },
    actions: {
      handleGenerate,
      handleSaveJob,
      handleAuthSuccess,
      handleResetForm,
      handleEditForm,
      closeAuthModal,
    },
  };
}
