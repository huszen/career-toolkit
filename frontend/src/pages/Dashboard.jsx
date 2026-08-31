import { Search, PlusCircle, Briefcase, BarChart3, UserCircle } from 'lucide-react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import JobCard from '../components/dashboard/JobCard';
import DeleteConfirmModal from '../components/dashboard/DeleteConfirmModal';
import ToastNotification from '../components/common/ToastNofitication';
import IdentityTab from '../components/dashboard/IdentityTab';
import GapAnalysisModal from '../components/dashboard/GapAnalysisModal';
import AnalyticsTab from '../components/dashboard/AnalyticsTab';
import { useDashboard } from '../hooks/useDashboard';

export default function Dashboard() {
  const { state, actions } = useDashboard();

  return (
    <div className="max-w-5xl mx-auto mt-8 p-4 text-text-main space-y-6">
      <DashboardHeader userEmail={state.currentUser?.email} onRefresh={actions.loadDashboardData} jobs={state.jobs} hasCv={Boolean(state.cvData)} />

      {state.error && <div className="p-3.5 bg-danger/10 border border-danger/30 rounded-xl text-danger text-xs font-medium">{state.error}</div>}

      {/* Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-border/80 pb-2">
        <div className="flex items-center gap-2">
          {/* Tab Buttons */}
          <button
            onClick={() => actions.setActiveTab('tracker')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${state.activeTab === 'tracker' ? 'bg-primary text-text-main shadow-sm' : 'text-text-muted hover:text-text-main hover:bg-input-bg'}`}
          >
            <Briefcase className="w-3.5 h-3.5" /> Job Tracker ({state.jobs.length})
          </button>
          <button
            onClick={() => actions.setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${state.activeTab === 'analytics' ? 'bg-primary text-text-main shadow-sm' : 'text-text-muted hover:text-text-main hover:bg-input-bg'}`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Analytics
          </button>
          <button
            onClick={() => actions.setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${state.activeTab === 'profile' ? 'bg-primary text-text-main shadow-sm' : 'text-text-muted hover:text-text-main hover:bg-input-bg'}`}
          >
            <UserCircle className="w-3.5 h-3.5" /> CV & Profile
          </button>
        </div>

        {state.activeTab === 'tracker' && state.jobs.length > 0 && (
          <div className="relative hidden sm:block">
            <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title or company..."
              value={state.searchQuery}
              onChange={(e) => actions.setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-input-bg border border-border rounded-xl text-xs text-text-main placeholder:text-text-muted focus:outline-none focus:border-border-focus transition w-56"
            />
          </div>
        )}
      </div>

      {state.loading && <div className="text-center py-16 text-text-muted text-xs">Loading dashboard content...</div>}

      {/* TAB 1: JOB TRACKER */}
      {!state.loading && state.activeTab === 'tracker' && (
        <div className="space-y-4">
          {state.filteredJobs.length === 0 ? (
            <div className="text-center py-14 bg-card-bg rounded-2xl border border-border p-6 space-y-3">
              <p className="text-sm font-semibold text-text-main">{state.jobs.length === 0 ? 'No tracked jobs yet' : 'No matching jobs found'}</p>
              <p className="text-xs text-text-muted max-w-sm mx-auto">{state.jobs.length === 0 ? 'Analyze job posts or generate cover letters to track your applications here.' : 'Try adjusting your search query.'}</p>
              {state.jobs.length === 0 && (
                <a href="/cover-letter" className="inline-flex items-center gap-1.5 px-4 py-2 bg-input-bg hover:bg-border text-xs font-semibold text-primary rounded-xl border border-border transition-colors mt-2">
                  <PlusCircle className="w-3.5 h-3.5" /> Analyze New Job Post
                </a>
              )}
            </div>
          ) : (
            state.filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onViewPdf={actions.handleViewPdf}
                onStatusChange={actions.handleStatusChange}
                onDelete={actions.handleOpenDeleteModal}
                onOpenGapAnalysis={actions.setSelectedGapJob}
                isVerifying={state.verifyingId === job.id}
              />
            ))
          )}
        </div>
      )}

      {/* TAB 2: ANALYTICS */}
      {!state.loading && state.activeTab === 'analytics' && <AnalyticsTab jobs={state.jobs} />}

      {/* TAB 3: CV & PROFILE */}
      {!state.loading && state.activeTab === 'profile' && <IdentityTab cvData={state.cvData} onUploadCv={actions.handleUploadCv} uploading={state.uploadingCv} onRefineCv={actions.handleRefineCv} refining={state.refiningCv} />}

      {/* Modals & Toasts */}
      <DeleteConfirmModal isOpen={Boolean(state.jobToDelete)} jobTitle={state.jobToDelete?.title || ''} onConfirm={actions.handleConfirmDelete} onCancel={() => actions.setJobToDelete(null)} isDeleting={state.isDeleting} />
      <GapAnalysisModal isOpen={Boolean(state.selectedGapJob)} job={state.selectedGapJob} onClose={() => actions.setSelectedGapJob(null)} />
      <ToastNotification show={state.showToast} message={state.toastMessage} onClose={() => actions.setShowToast(false)} duration={2500} />
    </div>
  );
}
