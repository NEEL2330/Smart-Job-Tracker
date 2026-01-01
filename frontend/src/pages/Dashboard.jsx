import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyJobs,
  deleteJob,
  updateJobStatus,
  archiveJob,
  getJobStats,
} from "../services/jobs";
import JobCard from "../components/JobCard.jsx";
import JobDescriptionDrawer from "../components/JobDescriptionDrawer.jsx";
import useDebounce from "../hooks/useDebounce";

export default function Dashboard() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    APPLIED: 0,
    INTERVIEW: 0,
    OFFER: 0,
    REJECTED: 0,
  });

  const [selectedJob, setSelectedJob] = useState(null);

  const [filterInputs, setFilterInputs] = useState({
    company: "",
    role: "",
    status: "",
  });

  const debouncedCompany = useDebounce(filterInputs.company, 500);
  const debouncedRole = useDebounce(filterInputs.role, 500);
  const debouncedStatus = useDebounce(filterInputs.status, 500);

  const filters = {
    company: debouncedCompany,
    role: debouncedRole,
    status: debouncedStatus,
  };

  const fetchJobs = async () => {
    const data = await getMyJobs(filters);
    setJobs(data);
  };

  const fetchStats = async () => {
    const data = await getJobStats();
    setStats(data);
  };

  useEffect(() => {
    fetchJobs();
    fetchStats();
  }, [filters.company, filters.role, filters.status]);

  const handleStatusChange = async (id, status) => {
    await updateJobStatus(id, status);
    fetchJobs();
    fetchStats();
  };

  const handleArchive = async (id) => {
    await archiveJob(id, true);
    fetchJobs();
    fetchStats();
  };

  const handleDelete = async (id) => {
    await deleteJob(id);
    fetchJobs();
    fetchStats();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="glass p-5 space-y-5">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold">My Job Tracker</h1>
            <p className="text-slate-400">Track applications with clarity.</p>
          </div>

          <button
            className="btn-primary"
            onClick={() => navigate("/ai-analyzer")}
          >
            Analyze Resume with AI
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <Stat title="Total" value={stats.total} />
          <Stat title="Interviews" value={stats.INTERVIEW} />
          <Stat title="Offers" value={stats.OFFER} />
          <Stat title="Rejections" value={stats.REJECTED} />
        </div>
      </div>

      <div className="grid gap-3">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onDelete={handleDelete}
            onStatus={handleStatusChange}
            onArchive={handleArchive}
            onView={setSelectedJob}
          />
        ))}
      </div>

      <JobDescriptionDrawer
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
      />
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="glass p-4">
      <div className="text-xs uppercase text-slate-400">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
