import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { getToken, currentUser } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const STATUS_OPTIONS = ['Saved', 'Applied', 'Interviewing', 'Offer', 'Rejected'];

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      setError('');

      const token = await getToken();

      const response = await fetch('http://127.0.0.1:8000/api/jobs', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load saved jobs.');
      }

      const data = await response.json();
      setJobs(data.jobs || []);
    } catch (err) {
      console.error(err);
      setError('Could not retrieve dashboard data. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      const token = await getToken();

      const response = await fetch(`http://127.0.0.1:8000/api/jobs/${jobId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status.');
      }

      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === jobId
            ? {
                ...job,
                status: newStatus,
              }
            : job,
        ),
      );
    } catch (err) {
      console.error(err);
      alert('Failed to update status.');
    }
  };

  const getBadgeColor = (status) => {
    switch (status) {
      case 'Applied':
        return 'bg-primary/10 text-primary border-primary/30';

      case 'Interviewing':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';

      case 'Offer':
        return 'bg-success/10 text-success border-success/30';

      case 'Rejected':
        return 'bg-danger/10 text-danger border-danger/30';

      default:
        return 'bg-card-bg text-text-muted border-border';
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4 text-text-main space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold">Application Tracking Dashboard</h1>

          <p className="text-sm text-text-muted">
            Welcome back, <span className="text-primary">{currentUser?.email}</span>
          </p>
        </div>

        <button onClick={fetchSavedJobs} className="px-3 py-1.5 text-xs bg-card-bg hover:bg-input-bg rounded-lg border border-border transition">
          Refresh Data
        </button>
      </div>

      {/* Error */}
      {error && <div className="p-3 bg-danger/10 border border-danger/30 rounded-lg text-danger text-sm">{error}</div>}

      {/* Loading */}
      {loading && <div className="text-center py-10 text-text-muted text-sm">Loading saved applications...</div>}

      {/* Empty State */}
      {!loading && jobs.length === 0 && (
        <div className="text-center py-12 bg-card-bg rounded-xl border border-border p-6 space-y-2">
          <p className="text-text-main font-medium">No saved jobs found.</p>

          <p className="text-xs text-text-muted">Generate cover letters or analyze job descriptions and save them to track them here!</p>
        </div>
      )}

      {/* Job Cards */}
      {!loading &&
        jobs.map((job) => (
          <div key={job.id} className="p-5 bg-card-bg border border-border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <h3 className="font-bold text-lg">{job.job_title}</h3>

              <p className="text-sm text-text-muted">{job.company}</p>

              {job.job_url && (
                <a href={job.job_url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline inline-block mt-1">
                  View Original Job Post ↗
                </a>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {job.cover_letter_url && (
                <a href={job.cover_letter_url} target="_blank" rel="noreferrer" className="px-3 py-1.5 text-xs bg-success/10 hover:bg-success/20 text-success border border-success/30 rounded-lg transition">
                  View PDF
                </a>
              )}

              <select value={job.status || 'Saved'} onChange={(e) => handleStatusChange(job.id, e.target.value)} className={`text-xs font-semibold px-3 py-1.5 rounded-lg border cursor-pointer ${getBadgeColor(job.status)}`}>
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status} className="bg-card-bg text-text-main">
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
    </div>
  );
}
