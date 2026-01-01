import { useState } from "react";
import { resumeMatchGroq } from "../services/aiService";
import MatchResult from "./MatchResult";

const ResumeMatcher = ({ jobs, onClose }) => {
  const [file, setFile] = useState(null);
  const [jobId, setJobId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!file || !jobId) {
      setError("Please upload a resume and select a job");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await resumeMatchGroq(jobId, file);
      setResult(data);
    } catch {
      setError("AI analysis failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="glass p-6 w-[420px] space-y-4 rounded-xl">

        <h3 className="text-lg font-semibold">AI Resume Matcher</h3>

        {/* RESUME UPLOAD */}
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => setFile(e.target.files[0])}
          className="input w-full"
        />

        {/* JOB SELECT */}
        <select
          className="input w-full"
          value={jobId}
          onChange={(e) => setJobId(e.target.value)}
        >
          <option value="">Select Job</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.role} @ {job.company}
            </option>
          ))}
        </select>

        {/* ACTIONS */}
        <div className="flex gap-2 justify-end">
          <button className="btn-ghost" onClick={onClose}>
            Cancel
          </button>

          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {error && (
          <div className="text-sm text-rose-400">{error}</div>
        )}

        {result && <MatchResult result={result} />}
      </div>
    </div>
  );
};

export default ResumeMatcher;
