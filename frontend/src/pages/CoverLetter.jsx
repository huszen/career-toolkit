import { useState } from 'react';

export default function CoverLetter() {
  const [jobUrl, setJobUrl] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobUrl || !cvFile) {
      setError('Please provide both a job URL and your CV PDF.');
      return;
    }

    setLoading(true);
    setError('');

    // prepare multipart data payload
    const formData = new FormData();
    formData.append('job_url', jobUrl);
    formData.append('cv_file', cvFile);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/generate-cover-letter', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to compile pipeline on backend server');
      }

      // receive PDF as data blob and trigger browser download
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = downloadUrl;

      // attempt to catch filename from headers or fallback by default
      link.setAttribute('download', `Generated_Cover_Letter.pdf`);
      document.body.appendChild(link);

      link.click();
      link.remove();

      // window.URL.revokeObjectURL(downloadUrl);

    } catch (error) {
      console.error("Detailed Fetch Error Block:", error);

      console.error(error.stack);
      
      setError(error.message || 'Something went wrong while executing the pipeline');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-2xl mx-auto p-6 bg-slate-900 rounded-xl shadow-md border border-slate-800 text-white mt-10">
      <h2 className="text-2xl font-bold mb-2">Cover Letter Generator</h2>
      <p className="text-slate-400 mb-6 text-sm">Upload your profile resume and paste your target Jobstreet opening to auto-generate a tailored professional PDF.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Job URL Input */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-300">Jobstreet Opportunity Link</label>
          <input
            type="url"
            placeholder="https://id.jobstreet.com/id/job/..."
            value={jobUrl}
            onChange={(e) => setJobUrl(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 transition-colors text-sm"
          />
        </div>

        {/* CV File Input */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-300">Your Profile CV (PDF)</label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer cursor-pointer"
          />
        </div>

        {/* Error Feedback */}
        {error && <div className="p-3 bg-red-950/50 border border-red-900 rounded-lg text-red-400 text-sm">{error}</div>}

        {/* Action Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium rounded-lg shadow-sm transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Running Agentic Pipelines (Scraping & LLM)...
            </>
          ) : (
            'Generate & Download PDF'
          )}
        </button>
      </form>
    </div>
  );
}
