import { apiRequest } from "./apiClient.js";

export const toolHandlers = {
  get_jobs_by_status: ({ status }) =>
    apiRequest("GET", `/ai-tools/jobs/by-status?status=${status}`),

  update_job_status: ({ job_id, status }) =>
    apiRequest("PATCH", `/ai-tools/jobs/${job_id}/status`, { status }),

  get_job_stats: () =>
    apiRequest("GET", "/ai-tools/jobs/stats"),

  get_recent_jobs: ({ days }) =>
    apiRequest("GET", `/ai-tools/jobs/recent?days=${days}`),

  get_archived_jobs: () =>
    apiRequest("GET", "/ai-tools/jobs/archived"),
};
