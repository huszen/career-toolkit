const API_BASE_URL = 'http://127.0.0.1:8000/api';

//////////////////////////////////////
///// Cover Letter Genration API /////
//////////////////////////////////////

export async function generateCoverLetter({ jobUrl, cvFile, runGapAnalysis }) {
  const formData = new FormData();
  formData.append('job_url', jobUrl);
  formData.append('cv_file', cvFile);
  formData.append('run_gap_analysis', runGapAnalysis);

  const response = await fetch(`${API_BASE_URL}/generate-cover-letter`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to complete the operation pipeline.');
  }
  return response.json();
}

export async function saveJobToDashboard(payload, token) {
  const response = await fetch(`${API_BASE_URL}/jobs/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to save job to dashboard.');
  }
  return response.json();
}

//////////////////////////
///// Dashboard API //////
//////////////////////////

export async function checkFileExists(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('File avalibility check failed', error);
    return false;
  }
}

export async function fetchUserJobs(token) {
  const response = await fetch(`${API_BASE_URL}/jobs`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error('Failed to load saved Jobs');
  }

  return response.json();
}

export async function updateJobStatus(jobId, newStatus, token) {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status: newStatus }),
  });

  if (!response.ok) {
    throw new Error('Failed to update job status')
  }
  return response.json()
}

export async function deleteJobFromDashboard(jobId, token) {
  const response = await fetch(`http://127.0.0.1:8000/api/jobs/${jobId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new error('Failed to delete job application');
  }

  return response.json();
}
