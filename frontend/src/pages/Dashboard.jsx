import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyJobs,
  deleteJob,
  updateJobStatus,
  archiveJob,
} from "../services/jobs";
import JobCard from "../components/JobCard.jsx";
import JobDescriptionDrawer from "../components/JobDescriptionDrawer.jsx";
import useDebounce from "../hooks/useDebounce";

const pageSize = 5;
const MIN_OVERLAY_TIME = 400;

const statusOptions = [
  { value: "", label: "All Status", classes: "text-slate-200 bg-white/5 border-white/10" },
  { value: "APPLIED", label: "Applied", classes: "text-sky-300 bg-sky-500/10 border-sky-400/40" },
  { value: "INTERVIEW", label: "Interview", classes: "text-indigo-300 bg-indigo-500/10 border-indigo-400/40" },
  { value: "OFFER", label: "Offer", classes: "text-emerald-300 bg-emerald-500/10 border-emerald-400/40" },
  { value: "REJECTED", label: "Rejected", classes: "text-rose-300 bg-rose-500/10 border-rose-400/40" },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const overlayStartRef = useRef(0);
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

  const fetchJobs = async (pageNumber, isFilter = false) => {
    if (isFilter) {
      overlayStartRef.current = Date.now();
      setIsFiltering(true);
    } else {
      setInitialLoading(true);
    }

    try {
      const data = await getMyJobs(pageNumber, pageSize, filters);
      setJobs(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load jobs.");
    } finally {
      if (isFilter) {
        const elapsed = Date.now() - overlayStartRef.current;
        setTimeout(() => setIsFiltering(false), Math.max(400 - elapsed, 0));
      } else {
        setInitialLoading(false);
      }
    }
  };

  useEffect(() => {
    setPage(1);
    fetchJobs(1, true);
  }, [filters.company, filters.role, filters.status]);

  useEffect(() => {
    fetchJobs(page);
  }, [page]);

  const handleArchive = async (id) => {
    await archiveJob(id, true);
    fetchJobs(page);
  };

  const stats = useMemo(() => {
    const counts = { total: 0 };
    jobs.forEach((job) => {
      counts.total += 1;
      counts[job.status] = (counts[job.status] || 0) + 1;
    });
    return counts;
  }, [jobs]);

  return (
    <div className="flex flex-col gap-4">

      {/* HEADER */}
      <div className="glass p-5 space-y-5">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold">My Job Tracker</h1>
            <p className="text-slate-400">Track applications with clarity.</p>
          </div>

          <button className="btn-primary" onClick={() => navigate("/ai-analyzer")}>
            Analyze Resume with AI
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <Stat title="Total" value={stats.total || 0} />
          <Stat title="Interviews" value={stats.INTERVIEW || 0} />
          <Stat title="Offers" value={stats.OFFER || 0} />
          <Stat title="Rejections" value={stats.REJECTED || 0} />
        </div>
      </div>

      <div className="grid gap-3">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onDelete={deleteJob}
            onStatus={updateJobStatus}
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
