import { useEffect, useState } from "react";
import { getArchivedJobs, archiveJob, deleteJob } from "../services/jobs";
import JobCard from "../components/JobCard";

export default function ArchivedJobs() {
  const [jobs, setJobs] = useState([]);

  const loadJobs = async () => {
    const data = await getArchivedJobs();
    setJobs(data);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleRestore = async (id) => {
    await archiveJob(id, false);
    loadJobs();
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-semibold">Archived Jobs</h1>

      {jobs.length === 0 && (
        <p className="text-slate-400">No archived jobs.</p>
      )}

      <div className="grid gap-3">
        {jobs.map((job) => (
          <div key={job.id} className="relative">
            <JobCard
              job={job}
              onDelete={deleteJob}
              onArchive={handleRestore}
              onStatus={() => {}}
              onView={() => {}}
            />

            <button
              onClick={() => handleRestore(job.id)}
              className="absolute top-4 right-24 text-green-400 hover:text-green-300 text-xs"
            >
              Restore
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
