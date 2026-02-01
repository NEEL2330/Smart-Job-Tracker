import { useEffect, useState } from "react";
import { resumeMatchGroq } from "../services/aiService";
import { getMyJobs } from "../services/jobs";
import MatchResult from "../components/MatchResult";

const AIAnalyzer = () => {
  const [jobs, setJobs] = useState([]);
  const [jobId, setJobId] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyJobs(1, 100).then(setJobs);
  }, []);

  const analyze = async () => {
    if (!file || !jobId) {
      setError("Please upload resume and select a job");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await resumeMatchGroq(jobId, file);
      setResult(data);
    } catch {
      setError("AI analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">AI Resume Analyzer</h1>
        <p className="text-gray-500">
          Upload your resume and select a job to evaluate compatibility.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4">

        {/* Resume */}
        <input
          type="file"
          accept=".pdf,.docx"
          className="input w-full"
          onChange={(e) => setFile(e.target.files[0])}
        />

        {/* Job Select */}
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

        <button
          className="btn-primary w-full"
          onClick={analyze}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>

        {error && <p className="text-red-500 text-center">{error}</p>}
      </div>

      {result && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <MatchResult result={result} />
        </div>
      )}
    </div>
  );
};

export default AIAnalyzer;
