import { useEffect, useState } from "react";
import { getArchivedJobs, archiveJob, deleteJob } from "../services/jobs";

export default function ArchivedJobs() {
  const [jobs, setJobs] = useState([]);

  const fetchArchived = async () => {
    const data = await getArchivedJobs();
    setJobs(data);
  };

  useEffect(() => {
    fetchArchived();
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Archived Jobs</h1>

      {jobs.length === 0 && (
        <p className="text-gray-500">No archived jobs</p>
      )}

      <div className="grid gap-3">
        {jobs.map((job) => (
          <div key={job.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <h3 className="font-semibold text-gray-900">{job.company}</h3>
            <p className="text-sm text-gray-600">{job.role}</p>

            <div className="mt-3 flex gap-3 text-xs">
              <button
                onClick={() => archiveJob(job.id, false).then(fetchArchived)}
                className="text-emerald-600 hover:text-emerald-800 font-medium"
              >
                Restore
              </button>

              <button
                onClick={() => deleteJob(job.id).then(fetchArchived)}
                className="text-red-500 hover:text-red-700 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
