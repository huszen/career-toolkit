import { useCoverLetter } from '../hooks/useCoverLetter';

import CoverLetterForm from '../components/cover-letter/CoverLetterForm';
import CollapsedFormSummary from '../components/cover-letter/CollapsedFormSummary';
import SaveJobBanner from '../components/cover-letter/SaveJobBanner';
import GapAnalysisReport from '../components/cover-letter/GapAnalysisReport';
import DownloadCard from '../components/cover-letter/DownloadCard';
import AuthModal from '../components/auth/AuthModal';

export default function CoverLetterGenerationPage() {
  const { state, actions } = useCoverLetter();

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4">
      {/* Form Section */}
      {state.isFormCollapsed && state.result ? (
        <CollapsedFormSummary cvFileName={state.cvFileName} currentJobUrl={state.currentJobUrl} onEdit={actions.handleEditForm} onReset={actions.handleResetForm} />
      ) : (
        <CoverLetterForm onSubmit={actions.handleGenerate} loading={state.loading} error={state.error} savedCv={state.savedCv} />
      )}

      {/* Results Section */}
      {state.result && (
        <div className="space-y-6 animate-in fade-in-50 duration-500">
          <SaveJobBanner currentUser={state.currentUser} result={state.result} onSave={actions.handleSaveJob} saving={state.saving} saveStatus={state.saveStatus} />

          <DownloadCard url={state.result.cover_letter_url} />

          <GapAnalysisReport gapAnalysis={state.result.gap_analysis} />
        </div>
      )}

      <AuthModal isOpen={state.isAuthModalOpen} onClose={actions.closeAuthModal} onSuccess={actions.handleAuthSuccess} />
    </div>
  );
}
