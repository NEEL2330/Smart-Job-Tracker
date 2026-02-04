import API from "./api";

// Active jobs (dashboard)
export const getMyJobs = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.company) params.append("company", filters.company);
  if (filters.role) params.append("role", filters.role);
  if (filters.status) params.append("status", filters.status);

  const queryString = params.toString();
  const res = await API.get(`/jobs${queryString ? `?${queryString}` : ""}`);
  return res.data;
};

// Archived jobs
export const getArchivedJobs = async () => {
  const res = await API.get("/jobs/archived");
  return res.data;
};

// Stats (active + archived)
export const getJobStats = async () => {
  const res = await API.get("/jobs/stats");
  return res.data;
};

export const updateJobStatus = async (jobId, status) => {
  await API.patch(`/jobs/${jobId}/status`, { status });
};

export const archiveJob = async (jobId, archive = true) => {
  await API.patch(`/jobs/${jobId}/archive?archive=${archive}`);
};

export const deleteJob = async (jobId) => {
  await API.delete(`/jobs/${jobId}`);
};

export const updateJob = async (jobId, payload) => {
  const res = await API.put(`/jobs/${jobId}`, payload);
  return res.data;
};
