import axios from "axios";

const API_BASE = "http://127.0.0.1:8001";

export const resumeMatchGroq = async (jobId, resumeFile) => {
  const formData = new FormData();
  formData.append("resume", resumeFile);

  const response = await axios.post(
    `${API_BASE}/ai/resume-match-groq?job_id=${jobId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return response.data;
};
