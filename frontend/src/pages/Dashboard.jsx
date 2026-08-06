import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchUserJobs, updateJobStatus, deleteJobFromDashboard, checkFileExists } from '../services/api';

import DashboardHeader from '../components/dashboard/DashboardHeader';
import JobCard from '../components/dashboard/JobCard';
import DeleteConfirmModal from '../components/dashboard/DeleteConfirmModal';
import ToastNotification from '../components/common/ToastNofitication';

export default function Dashboard() {
  const { currentUser, getToken } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [verifyingId, setVerifyingId] = useState(null);

  const [jobToDelete, setJobToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  useEffect(() => {
    loadSavedJobs();
  }, []);

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
      <DashboardHeader userEmail={currentUser?.email} onRefresh={loadSavedJobs} />

      {error && <div className="p-3 bg-danger/10 border border-danger/30 rounded-lg text-danger text-sm">{error}</div>}

      {loading && <div className="text-center py-10 text-text-muted text-sm">Loading saved applications...</div>}

      {!loading && jobs.length === 0 && (
        <div className="text-center py-12 bg-card-bg rounded-xl border border-border p-6 space-y-2">
          <p className="text-text-main font-medium">No saved jobs found.</p>
          <p className="text-xs text-text-muted">Generate cover letters or analyze job descriptions and save them to track them here!</p>
        </div>
      )}

      {!loading && jobs.map((job) => <JobCard key={job.id} job={job} onViewPdf={handleViewPdf} onStatusChange={handleStatusChange} onDelete={handleOpenDeleteModal} isVerifying={verifyingId === job.id} />)}

      {/* Confirmation Modal */}
      <DeleteConfirmModal isOpen={Boolean(jobToDelete)} jobTitle={jobToDelete?.title || ''} onConfirm={handleConfirmDelete} onCancel={() => setJobToDelete(null)} isDeleting={isDeleting} />

      {/* RENDER FLOATING TOAST NOTIFICATION */}
      <ToastNotification show={showToast} message={toastMessage} onClose={() => setShowToast(false)} duration={2000} />
    </div>
  );
}
