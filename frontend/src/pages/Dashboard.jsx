import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";


export default function Dashboard() {
  const {getToken, currentUser} = useAuth();
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const STATUS_OPTIONS = [
    "Saved",
    "Applied",
    "Interviewing",
    "Offer",
    "Rejected"
  ];

  // Fetch saved job from FastAPI
  const fetchSavedJobs = async () => {
    try{
      setLoading(true)
      const token = await getToken()

      const response = await fetch("http://127.0.0.1:8000/api/jobs", {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load saved jobs.");
      }

      const data = await response.json();
      setJobs(data.jobs || [] )


    } catch (err) {
      console.error(err)
      setError("Could not retrieve dashboard data. Make sure backend is running")
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);  

  // Update job status manually
  const handleStatusChange = async (jobId, newStatus) => {
    try {
      const token = await getToken();

      const response = await fetch(`http://127.0.0.1:8000/api/jobs/${jobId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update Status");

      // Optimistically update UI state
      setJobs((prevJobs) => 
        prevJobs.map((j) => (j.id === jobId ? { ...j, status: newStatus} : j))
      ); 
    } catch (err) {
      console.error("Status update error", err);
      alert("Failed to update status. Please try again");
    }
  };


  const getBadgeColor = (status) => {
    switch (status) {
      case "Applied": return "bg-blue-950/60 text-blue-400 border-blue-800";
      case "Interviewing": return "bg-amber-950/60 text-amber-400 border-amber-800";
      case "Offer": return "bg-emerald-950/60 text-emerald-400 border-emerald-800";
      case "Rejected": return "bg-rose-950/60 text-rose-400 border-rose-800";
      default: return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4 text-white space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold">Application Tracking Dashboard</h1>
          <p className="text-sm text-slate-400">
            Welcome back, <span className="text-blue-400">{currentUser?.email}</span>
          </p>
        </div>
        <button
          onClick={fetchSavedJobs}
          className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition"
        >
          Refresh Data
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-950/50 border border-red-900 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-10 text-slate-400 text-sm">Loading saved applications...</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12 bg-slate-900 rounded-xl border border-slate-800 p-6 space-y-2">
          <p className="text-slate-300 font-medium">No saved jobs found.</p>
          <p className="text-xs text-slate-500">
            Generate cover letters or analyze job descriptions and save them to track them here!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="p-5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
            >
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-slate-100">{job.job_title}</h3>
                <p className="text-sm text-slate-400">{job.company}</p>
                {job.job_url && (
                  <a
                    href={job.job_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-400 hover:underline inline-block mt-1"
                  >
                    View Original Job Post ↗
                  </a>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {job.cover_letter_url && (
                  <a
                    href={job.cover_letter_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 text-xs bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-800 rounded-lg transition"
                  >
                    View PDF
                  </a>
                )}

                {/* Manual Status Dropdown Selector */}
                <select
                  value={job.status || "Saved"}
                  onChange={(e) => handleStatusChange(job.id, e.target.value)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border focus:outline-none cursor-pointer ${getBadgeColor(
                    job.status
                  )}`}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status} className="bg-slate-900 text-white">
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );



}
