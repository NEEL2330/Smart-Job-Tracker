import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const resumeMatchGroq = async (jobId, resumeFile) => {
  const formData = new FormData();
  formData.append("resume", resumeFile);

  const response = await axios.post(
    `${API_BASE}/ai/resume-match/?job_id=${jobId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return response.data;
};
