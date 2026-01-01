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
    <div className="glass p-5 space-y-4">
      <h1 className="text-2xl font-semibold">Archived Jobs</h1>

      {jobs.length === 0 && (
        <p className="text-slate-400">No archived jobs</p>
      )}

      <div className="grid gap-3">
        {jobs.map((job) => (
          <div key={job.id} className="rounded-xl border border-white/10 p-4">
            <h3 className="font-semibold">{job.company}</h3>
            <p className="text-sm text-slate-400">{job.role}</p>

            <div className="mt-3 flex gap-3 text-xs">
              <button
                onClick={() => archiveJob(job.id, false).then(fetchArchived)}
                className="text-emerald-400 hover:text-emerald-300"
              >
                Restore
              </button>

              <button
                onClick={() => deleteJob(job.id).then(fetchArchived)}
                className="text-rose-400 hover:text-rose-300"
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
