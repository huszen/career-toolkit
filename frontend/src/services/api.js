const API_BASE_URL = 'http://127.0.0.1:8000/api';

//////////////////////////////////////
///// Cover Letter Genration API /////
//////////////////////////////////////

export async function generateCoverLetter({ jobUrl, cvFile, runGapAnalysis }, token = null) {
  const formData = new FormData();
  formData.append('job_url', jobUrl);
  if (cvFile) {
    formData.append('cv_file', cvFile);
  }
  formData.append('run_gap_analysis', runGapAnalysis);

  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/generate-cover-letter`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.detail || 'Failed to complete the operation pipeline.');
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
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status: newStatus }),
  });

  if (!response.ok) {
    throw new Error('Failed to update job status');
  }
  return response.json();
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

//////////////////////////
///// CV Profile API /////
//////////////////////////
export async function uploadUserCv(cvFile, token) {
  const formData = new FormData();
  formData.append('cv_file', cvFile);

  const response = await fetch(`${API_BASE_URL}/cv/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload and parse CV');
  }

  return response.json();
}

export async function fetchUserCv(token) {
  const response = await fetch(`${API_BASE_URL}/cv`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user CV profile');
  }

  return response.json();
}

export async function refineUserCv(token) {
  const response = await fetch(`${API_BASE_URL}/cv/refine`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.detail || 'Failed to refine CV profile');
  }

  return response.json();
}
