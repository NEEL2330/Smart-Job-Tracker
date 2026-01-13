import fetch from "node-fetch";

const BASE_URL = process.env.BACKEND_BASE_URL;
const TEST_USER_ID = process.env.MCP_USER_ID;

export async function apiRequest(method, path, body = null) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-Test-User-ID": TEST_USER_ID.toString(),
    },
    body: body ? JSON.stringify(body) : null,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }

  return res.json();
}
