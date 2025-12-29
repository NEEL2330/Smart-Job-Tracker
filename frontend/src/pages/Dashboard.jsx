import { useEffect, useMemo, useRef, useState } from "react";
import { getMyJobs, deleteJob, updateJobStatus } from "../services/jobs";
import JobCard from "../components/JobCard.jsx";
import useDebounce from "../hooks/useDebounce";

const pageSize = 5;
const MIN_OVERLAY_TIME = 400;

// SAME STATUS CONFIG AS JOBCARD
const statusOptions = [
  { value: "", label: "All Status", classes: "text-slate-200 bg-white/5 border-white/10" },
  { value: "APPLIED", label: "Applied", classes: "text-slate-100 bg-white/5 border-white/10" },
  { value: "INTERVIEW", label: "Interview", classes: "text-indigo-100 bg-indigo-500/15 border-indigo-400/40" },
  { value: "OFFER", label: "Offer", classes: "text-emerald-100 bg-emerald-500/15 border-emerald-400/40" },
  { value: "REJECTED", label: "Rejected", classes: "text-rose-100 bg-rose-500/15 border-rose-400/40" },
];

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");

  const [initialLoading, setInitialLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const overlayStartRef = useRef(0);

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
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to load jobs.");
    } finally {
      if (isFilter) {
        const elapsed = Date.now() - overlayStartRef.current;
        const remaining = Math.max(MIN_OVERLAY_TIME - elapsed, 0);
        setTimeout(() => setIsFiltering(false), remaining);
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
    fetchJobs(page, false);
  }, [page]);

  const handleDelete = async (id) => {
    await deleteJob(id);
    fetchJobs(page);
  };

  const handleStatus = async (id, status) => {
    await updateJobStatus(id, status);
    fetchJobs(page);
  };

  const stats = useMemo(() => {
    const counts = { total: 0 };
    jobs.forEach((job) => {
      counts.total += 1;
      const key = job.status || "APPLIED";
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [jobs]);

  const selectedStatusStyle =
    statusOptions.find((s) => s.value === filterInputs.status)?.classes ||
    statusOptions[0].classes;

  return (
    <div className="flex flex-col gap-4">

      {/* HEADER */}
      <div className="glass p-5 space-y-5">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold">My Job Tracker</h1>
            <p className="text-slate-400">Monitor applications smoothly.</p>
          </div>
          <div className="pill">Page {page}</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Stat title="Total" value={stats.total || 0} />
          <Stat title="Interviews" value={stats.INTERVIEW || 0} />
          <Stat title="Offers" value={stats.OFFER || 0} />
          <Stat title="Rejections" value={stats.REJECTED || 0} />
        </div>
      </div>

      {/* APPLICATIONS */}
      <div className="glass p-5 space-y-4">
        <div>
          <div className="text-lg font-semibold">Applications</div>
          <div className="text-sm text-slate-400">Live filtering without flicker.</div>
        </div>

        {/* FILTER BAR */}
        <div className="flex flex-wrap gap-3 items-center">
          <input
            className="input sm:w-48"
            placeholder="Company"
            value={filterInputs.company}
            onChange={(e) => setFilterInputs({ ...filterInputs, company: e.target.value })}
          />

          <input
            className="input sm:w-48"
            placeholder="Role"
            value={filterInputs.role}
            onChange={(e) => setFilterInputs({ ...filterInputs, role: e.target.value })}
          />

          {/* STATUS DROPDOWN (MATCHES JOBCARD) */}
          <div className="relative">
            <select
              className={`pill pr-8 border cursor-pointer ${selectedStatusStyle}`}
              value={filterInputs.status}
              onChange={(e) =>
                setFilterInputs({ ...filterInputs, status: e.target.value })
              }
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <button
            className="text-sm text-slate-400 hover:text-slate-200"
            onClick={() => {
              setFilterInputs({ company: "", role: "", status: "" });
              setPage(1);
            }}
          >
            Clear
          </button>
        </div>

        {error && (
          <div className="pill border-amber-400/50 bg-amber-500/10 text-amber-100">
            {error}
          </div>
        )}

        {/* JOB LIST */}
        <div className="relative">
          {initialLoading && (
            <div className="text-center text-slate-400 py-8">
              Loading applications…
            </div>
          )}

          {!initialLoading && jobs.length === 0 && (
            <div className="text-center text-slate-400 py-8">
              No jobs match your filters.
            </div>
          )}

          <div
            className={`grid gap-3 transition-opacity duration-300 ${
              isFiltering ? "opacity-70" : "opacity-100"
            }`}
          >
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onDelete={handleDelete}
                onStatus={handleStatus}
              />
            ))}
          </div>

          {isFiltering && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[2px] rounded-xl">
              <div className="text-sm text-slate-300 animate-pulse">
                Updating results…
              </div>
            </div>
          )}
        </div>

        {/* PAGINATION */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            className="btn-ghost"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>
          <button
            className="btn-primary"
            disabled={jobs.length < pageSize}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
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
