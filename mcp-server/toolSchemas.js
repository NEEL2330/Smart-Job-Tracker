export const toolSchemas = [
  {
    name: "get_jobs_by_status",
    description: "Get jobs filtered by status",
    inputSchema: {
      type: "object",
      properties: { status: { type: "string" } },
      required: ["status"],
    },
  },
  {
    name: "update_job_status",
    description: "Update job status",
    inputSchema: {
      type: "object",
      properties: {
        job_id: { type: "number" },
        status: { type: "string" },
      },
      required: ["job_id", "status"],
    },
  },
  {
    name: "get_job_stats",
    description: "Get job statistics",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_recent_jobs",
    description: "Get jobs applied in last N days",
    inputSchema: {
      type: "object",
      properties: { days: { type: "number" } },
      required: ["days"],
    },
  },
  {
    name: "get_archived_jobs",
    description: "Get archived jobs",
    inputSchema: { type: "object", properties: {} },
  },
];
