import { useEffect, useState } from 'react';

import { useAuth } from '../context/AuthContext';

import { fetchUserJobs, updateJobStatus, deleteJobFromDashboard, checkFileExists, fetchUserCv, uploadUserCv } from '../services/api';

import { UserCircle, Briefcase, Search, PlusCircle, BarChart3 } from 'lucide-react';
// import { Link } from 'react-router-dom';

import DashboardHeader from '../components/dashboard/DashboardHeader';
import JobCard from '../components/dashboard/JobCard';
import DeleteConfirmModal from '../components/dashboard/DeleteConfirmModal';
import ToastNotification from '../components/common/ToastNofitication';
import IdentityTab from '../components/dashboard/IdentityTab';
import GapAnalysisModal from '../components/dashboard/GapAnalysisModal';
import AnalyticsTab from '../components/dashboard/AnalyticsTab';

export default function Dashboard() {
  const { currentUser, getToken } = useAuth();

  // Active Tab State
  const [activeTab, setActiveTab] = useState('tracker');

  const [jobs, setJobs] = useState([]);
  const [cvData, setCvData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [loading, setLoading] = useState(true);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [error, setError] = useState('');

  const [verifyingId, setVerifyingId] = useState(null);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [selectedGapJob, setSelectedGapJob] = useState(null);

  const loadSavedJobs = async () => {
    try {
      setLoading(true);
      setError('');
      const token = await getToken();
      const data = await fetchUserJobs(token);
      setJobs(data.jobs || []);
    } catch (err) {
      console.error(err);
      setError('Could not retrieve dashboard data. Make sure backend is running');
    } finally {
      setLoading(false);
    }
  };

  // Load Dashboard Data (both Jobs & CV Profile)
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const token = await getToken();

      const [jobsResponse, cvResponse] = await Promise.all([fetchUserJobs(token).catch(() => ({ jobs: [] })), fetchUserCv(token).catch(() => ({ cv_data: null }))]);

      setJobs(jobsResponse.jobs || []);
      setCvData(cvResponse.cv_data || null);
    } catch (err) {
      console.error(err);
      setError('Could not retrieve dashboard data. Make sure backend is running');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Upload CV Handler
  const handleUploadCv = async (file) => {
    try {
      setUploadingCv(true);
      const token = await getToken();
      const res = await uploadUserCv(file, token);

      if (res.success) {
        setCvData(res.cv_data);
        setToastMessage('CV Profile saved Successfully');
        setShowToast(true);
      }
    } catch (err) {
      console.error('Failed to upload CV:', err);
      alert('Failed to parse and save CV. Please try again');
    } finally {
      setLoading(false);
    }
  };

  const handleViewPdf = async (jobId, pdfUrl) => {
    setVerifyingId(jobId);
    const exists = await checkFileExists(pdfUrl);
    setVerifyingId(null);

    if (exists) {
      window.open(pdfUrl, '_blank', 'noopener,noreferrer');
    } else {
      alert('Unable to open PDF.\n\nThe file was either removed from local storage or the backend server is unreachable.');
    }
  };

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      const token = await getToken();
      await updateJobStatus(jobId, newStatus, token);

      setJobs((prevJobs) => prevJobs.map((job) => (job.id === jobId ? { ...job, status: newStatus } : job)));
    } catch (err) {
      console.error(err);
      alert('Failed to update status.');
    }
  };

  // Called when trash icon on JobCard is clicked
  const handleOpenDeleteModal = (jobId, jobTitle) => {
    setJobToDelete({ id: jobId, title: jobTitle });
  };

  // Called when user clicks "Delete Application" inside the modal
  const handleConfirmDelete = async () => {
    if (!jobToDelete) return;

    try {
      setIsDeleting(true);
      const token = await getToken();

      await deleteJobFromDashboard(jobToDelete.id, token);

      // save deleted job title for toast message before resetting the state
      const deletedTitle = jobToDelete.title;

      // Optimistically update list & close modal
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobToDelete.id));
      setJobToDelete(null);

      // Toast notification trigger
      setToastMessage(`"${deletedTitle}" deleted successfully.`);
      setShowToast(true);
    } catch (err) {
      console.error(err);
      alert('Failed to delete job application. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };
  // Filter jobs by search query
  const filteredJobs = jobs.filter((job) => job.job_title?.toLowerCase().includes(searchQuery.toLowerCase()) || job.company?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="max-w-5xl mx-auto mt-8 p-4 text-text-main space-y-6">
      {/* Top Header with Global Analytics */}
      <DashboardHeader userEmail={currentUser?.email} onRefresh={loadDashboardData} jobs={jobs} hasCv={Boolean(cvData)} />

      {error && <div className="p-3.5 bg-danger/10 border border-danger/30 rounded-xl text-danger text-xs font-medium">{error}</div>}

      {/* Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-border/80 pb-2">
        <div className="flex items-center gap-2">
          {/* Tab 1: Tracker */}
          <button
            onClick={() => setActiveTab('tracker')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'tracker' ? 'bg-primary text-text-main shadow-sm' : 'text-text-muted hover:text-text-main hover:bg-input-bg'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            Job Tracker ({jobs.length})
          </button>

          {/* Tab 2: Analytics */}
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'analytics' ? 'bg-primary text-text-main shadow-sm' : 'text-text-muted hover:text-text-main hover:bg-input-bg'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Analytics
          </button>

          {/* Tab 3: CV & Profile */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'profile' ? 'bg-primary text-text-main shadow-sm' : 'text-text-muted hover:text-text-main hover:bg-input-bg'
            }`}
          >
            <UserCircle className="w-3.5 h-3.5" />
            CV & Profile
          </button>
        </div>

        {activeTab === 'tracker' && jobs.length > 0 && (
          <div className="relative hidden sm:block">
            <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-input-bg border border-border rounded-xl text-xs text-text-main placeholder:text-text-muted focus:outline-none focus:border-border-focus transition w-56"
            />
          </div>
        )}
      </div>

      {loading && <div className="text-center py-16 text-text-muted text-xs">Loading dashboard content...</div>}

      {/* TAB 1: JOB TRACKER */}
      {!loading && activeTab === 'tracker' && (
        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-14 bg-card-bg rounded-2xl border border-border p-6 space-y-3">
              <p className="text-sm font-semibold text-text-main">{jobs.length === 0 ? 'No tracked jobs yet' : 'No matching jobs found'}</p>
              <p className="text-xs text-text-muted max-w-sm mx-auto">{jobs.length === 0 ? 'Analyze job posts or generate cover letters to track your applications here.' : 'Try adjusting your search query.'}</p>
              {jobs.length === 0 && (
                <a href="/cover-letter" className="inline-flex items-center gap-1.5 px-4 py-2 bg-input-bg hover:bg-border text-xs font-semibold text-primary rounded-xl border border-border transition-colors mt-2">
                  <PlusCircle className="w-3.5 h-3.5" />
                  Analyze New Job Post
                </a>
              )}
            </div>
          ) : (
            filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onViewPdf={handleViewPdf}
                onStatusChange={handleStatusChange}
                onDelete={handleOpenDeleteModal}
                onOpenGapAnalysis={(jobWithGap) => {
                  setSelectedGapJob(jobWithGap);
                }}
                isVerifying={verifyingId === job.id}
              />
            ))
          )}
        </div>
      )}

      {/* TAB 2: ANALYTICS */}
      {!loading && activeTab === 'analytics' && <AnalyticsTab jobs={jobs} />}

      {/* TAB 3: CV & PROFILE */}
      {!loading && activeTab === 'profile' && <IdentityTab cvData={cvData} onUploadCv={handleUploadCv} uploading={uploadingCv} />}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal isOpen={Boolean(jobToDelete)} jobTitle={jobToDelete?.title || ''} onConfirm={handleConfirmDelete} onCancel={() => setJobToDelete(null)} isDeleting={isDeleting} />

      {/* Gap Analysis Modal */}
      <GapAnalysisModal isOpen={Boolean(selectedGapJob)} job={selectedGapJob} onClose={() => setSelectedGapJob(null)} />
      {/* Toast Feedback */}
      <ToastNotification show={showToast} message={toastMessage} onClose={() => setShowToast(false)} duration={2500} />
    </div>
  );
}
