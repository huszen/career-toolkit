import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchUserJobs, updateJobStatus, deleteJobFromDashboard, checkFileExists, fetchUserCv, uploadUserCv, refineUserCv } from '../services/api';

export function useDashboard() {
  const { currentUser, getToken } = useAuth();

  // State Management
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
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedGapJob, setSelectedGapJob] = useState(null);
  const [refiningCv, setRefiningCv] = useState(false);

  // Load Dashboard Data
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

  // Action Handlers
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
      console.error(err);
      alert('Failed to parse and save CV. Please try again');
    } finally {
      setLoading(false); // Wait, should this be setUploadingCv(false)? Fixed below.
      setUploadingCv(false);
    }
  };

  const handleViewPdf = async (jobId, pdfUrl) => {
    setVerifyingId(jobId);
    const exists = await checkFileExists(pdfUrl);
    setVerifyingId(null);
    if (exists) {
      window.open(pdfUrl, '_blank', 'noopener,noreferrer');
    } else {
      alert('Unable to open PDF.\n\nThe file was either removed or the server is unreachable.');
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

  const handleOpenDeleteModal = (jobId, jobTitle) => setJobToDelete({ id: jobId, title: jobTitle });

  const handleConfirmDelete = async () => {
    if (!jobToDelete) return;
    try {
      setIsDeleting(true);
      const token = await getToken();
      await deleteJobFromDashboard(jobToDelete.id, token);
      const deletedTitle = jobToDelete.title;
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobToDelete.id));
      setJobToDelete(null);
      setToastMessage(`"${deletedTitle}" deleted successfully.`);
      setShowToast(true);
    } catch (err) {
      console.error(err);
      alert('Failed to delete job application. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRefineCv = async () => {
    try {
      setRefiningCv(true);
      const token = await getToken();
      const res = await refineUserCv(token);
      if (res.success) {
        setCvData(res.cv_data);
        setToastMessage('Profile refined and structured successfully');
        setShowToast(true);
      }
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to refine profile. Please try again');
    } finally {
      setRefiningCv(false);
    }
  };

  const filteredJobs = jobs.filter((job) => job.job_title?.toLowerCase().includes(searchQuery.toLowerCase()) || job.company?.toLowerCase().includes(searchQuery.toLowerCase()));

  return {
    state: {
      currentUser,
      activeTab,
      jobs,
      filteredJobs,
      cvData,
      searchQuery,
      loading,
      uploadingCv,
      error,
      verifyingId,
      jobToDelete,
      isDeleting,
      showToast,
      toastMessage,
      selectedGapJob,
      refiningCv,
    },
    actions: {
      setActiveTab,
      setSearchQuery,
      setJobToDelete,
      setShowToast,
      setSelectedGapJob,
      loadDashboardData,
      handleUploadCv,
      handleViewPdf,
      handleStatusChange,
      handleOpenDeleteModal,
      handleConfirmDelete,
      handleRefineCv,
    },
  };
}
