import API from "./api";

export const getMyJobs = async (page = 1, limit = 5, filters = {}) => {
  const params = new URLSearchParams();

  params.append("page", page);
  params.append("limit", limit);

  if (filters.company) params.append("company", filters.company);
  if (filters.role) params.append("role", filters.role);
  if (filters.status) params.append("status", filters.status);

  const res = await API.get(`/jobs?${params.toString()}`);
  return res.data;
};

export const updateJobStatus = async (jobId, status) => {
  await API.patch(`/jobs/${jobId}/status`, { status });
};

export const updateJob = async (jobId, jobData) => {
  await API.put(`/jobs/${jobId}`, jobData);
};

export const deleteJob = async (jobId) => {
  await API.delete(`/jobs/${jobId}`);
};
