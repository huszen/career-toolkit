import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchUserJobs, updateJobStatus, deleteJobFromDashboard, checkFileExists, fetchUserCv, uploadUserCv } from '../services/api';

import { User, Bookmark, Briefcase, ChartBar, BarChart } from 'lucide-react';

import DashboardHeader from '../components/dashboard/DashboardHeader';
import JobCard from '../components/dashboard/JobCard';
import DeleteConfirmModal from '../components/dashboard/DeleteConfirmModal';
import ToastNotification from '../components/common/ToastNofitication';
import IdentityTab from '../components/dashboard/IdentityTab';

export default function Dashboard() {
  const { currentUser, getToken } = useAuth();

  // Active Tab State
  const [activeTab, setActiveTab] = useState('saved_jobs');

  const [jobs, setJobs] = useState([]);
  const [cvData, setCvData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [error, setError] = useState('');

  const [verifyingId, setVerifyingId] = useState(null);

  const [jobToDelete, setJobToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

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

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4 text-text-main space-y-6">
      <DashboardHeader userEmail={currentUser?.email} onRefresh={loadDashboardData} />

      {error && <div className="p-3 bg-danger/10 border border-danger/30 rounded-lg text-danger text-sm">{error}</div>}

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-border pb-1">
        <button
          onClick={() => setActiveTab('identity')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
            activeTab === 'identity' ? 'bg-primary text-text-main shadow-sm' : 'text-text-muted hover:text-text-main hover:bg-input-bg'
          }`}
        >
          <User className="w-4 h-4" />
          Identity
        </button>

        <button
          onClick={() => setActiveTab('saved_jobs')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
            activeTab === 'saved_jobs' ? 'bg-primary text-text-main shadow-sm' : 'text-text-muted hover:text-text-main hover:bg-input-bg'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          Saved Jobs ({jobs.length})
        </button>

        <button
          onClick={() => setActiveTab('graph')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
            activeTab === 'graph' ? 'bg-primary text-text-main shadow-sm' : 'text-text-muted hover:text-text-main hover:bg-input-bg'
          }`}
        >
          <ChartBar className="w-4 h-4" />
          Graph
        </button>
      </div>

      {loading && <div className="text-center py-10 text-text-muted text-sm">Loading dashboard content...</div>}

      {/* TAB CONTENT: IDENTITY */}
      {!loading && activeTab === 'identity' && <IdentityTab cvData={cvData} onUploadCv={handleUploadCv} uploading={uploadingCv} />}

      {/* TAB CONTENT: SAVED JOBS */}
      {!loading && activeTab === 'saved_jobs' && (
        <div className="space-y-4">
          {jobs.length === 0 ? (
            <div className="text-center py-12 bg-card-bg rounded-2xl border border-border p-6 space-y-2">
              <p className="text-text-main font-medium">No saved jobs found.</p>
              <p className="text-xs text-text-muted">Generate cover letters or analyze job descriptions and save them to track them here!</p>
            </div>
          ) : (
            jobs.map((job) => <JobCard key={job.id} job={job} onViewPdf={handleViewPdf} onStatusChange={handleStatusChange} onDelete={handleOpenDeleteModal} isVerifying={verifyingId === job.id} />)
          )}
        </div>
      )}

      {/* TAB CONTENT: APPLICATION TRACKS */}
      {!loading && activeTab === 'graph' && (
        <div className="text-center py-12 bg-card-bg rounded-2xl border border-border p-6 space-y-2">
          <BarChart className="w-8 h-8 text-text-muted mx-auto mb-2" />
          <p className="text-text-main font-medium">No data available yet.</p>
          <p className="text-xs text-text-muted">Track your interview stages and response timelines here in upcoming updates.</p>
        </div>
      )}

      {/* Confirmation Modal */}
      <DeleteConfirmModal isOpen={Boolean(jobToDelete)} jobTitle={jobToDelete?.title || ''} onConfirm={handleConfirmDelete} onCancel={() => setJobToDelete(null)} isDeleting={isDeleting} />

      {/* Toast Notification */}
      <ToastNotification show={showToast} message={toastMessage} onClose={() => setShowToast(false)} duration={2500} />
    </div>
  );
}
