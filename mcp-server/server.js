import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fetch from "node-fetch";

/**
 * TEMP TEST USER (LOCAL DEV ONLY)
 */
const TEST_USER_ID = 6;

/**
 * Create MCP Server
 */
const server = new Server(
  {
    name: "smart-job-tracker-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * TOOL DISCOVERY
 * Claude calls this to know what tools exist
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_jobs_by_status",
        description: "Get jobs by status from Smart Job Tracker",
        inputSchema: {
          type: "object",
          properties: {
            status: {
              type: "string",
              description: "Job status (applied, interview, offer)",
            },
          },
          required: ["status"],
        },
      },
      {
        name: "update_job_status",
        description: "Update job status",
        inputSchema: {
          type: "object",
          properties: {
            job_id: {
              type: "number",
              description: "Job ID",
            },
            status: {
              type: "string",
              description: "New status",
            },
          },
          required: ["job_id", "status"],
        },
      },
    ],
  };
});

/**
 * TOOL EXECUTION
 * Claude calls this when user gives a command
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  // TOOL 1: GET JOBS BY STATUS
  if (name === "get_jobs_by_status") {
    const res = await fetch(
      `http://127.0.0.1:8001/ai-tools/jobs/by-status?status=${args.status}`,
      {
        headers: {
          "X-Test-User-ID": TEST_USER_ID.toString(),
        },
      }
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(await res.json(), null, 2),
        },
      ],
    };
  }

  // TOOL 2: UPDATE JOB STATUS
  if (name === "update_job_status") {
    const res = await fetch(
      `http://127.0.0.1:8001/ai-tools/jobs/${args.job_id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-Test-User-ID": TEST_USER_ID.toString(),
        },
        body: JSON.stringify({ status: args.status }),
      }
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(await res.json(), null, 2),
        },
      ],
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

/**
 * Connect via STDIO (Claude Desktop requirement)
 */
const transport = new StdioServerTransport();
server.connect(transport);
