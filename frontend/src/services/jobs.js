import API from "./api";

// Dashboard jobs
export const getMyJobs = async (page = 1, limit = 5, filters = {}) => {
  const params = new URLSearchParams();

  if (filters.company) params.append("company", filters.company);
  if (filters.role) params.append("role", filters.role);
  if (filters.status) params.append("status", filters.status);

  const res = await API.get(`/jobs?${params.toString()}`);
  return res.data;
};

// Archived jobs
export const getArchivedJobs = async () => {
  const res = await API.get("/jobs/archived");
  return res.data;
};

// AI dropdown
export const getAllJobs = async () => {
  const res = await API.get("/jobs/all");
  return res.data;
};

// Update job status
export const updateJobStatus = async (jobId, status) => {
  await API.patch(`/jobs/${jobId}/status`, { status });
};

// Archive / Unarchive job
export const archiveJob = async (jobId, archive = true) => {
  await API.patch(`/jobs/${jobId}/archive?archive=${archive}`);
};

// ✅ THIS WAS MISSING (USED BY EditJob.jsx)
export const updateJob = async (jobId, jobData) => {
  await API.put(`/jobs/${jobId}`, jobData);
};

// Delete job
export const deleteJob = async (jobId) => {
  await API.delete(`/jobs/${jobId}`);
};
