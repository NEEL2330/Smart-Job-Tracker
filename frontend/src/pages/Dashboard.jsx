import { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    APPLIED: 0,
    INTERVIEW: 0,
    OFFER: 0,
    REJECTED: 0,
  });

  const [selectedJob, setSelectedJob] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const [filterInputs, setFilterInputs] = useState({
    search: "",
    status: "",
  });

  const debouncedSearch = useDebounce(filterInputs.search, 400);
  const debouncedStatus = useDebounce(filterInputs.status, 300);

  const fetchJobs = async () => {
    setLoading(true);
    const data = await getMyJobs({
      company: debouncedSearch,
      role: debouncedSearch,
      status: debouncedStatus,
    });
    setJobs(data);
    setLoading(false);
  };

  const fetchStats = async () => {
    const data = await getJobStats();
    setStats(data);
  };

  useEffect(() => {
    fetchJobs();
    fetchStats();
  }, [debouncedSearch, debouncedStatus]);

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

  // Filter jobs locally for search
  const filteredJobs = jobs.filter((job) => {
    const searchLower = filterInputs.search.toLowerCase();
    const matchesSearch =
      !searchLower ||
      job.company?.toLowerCase().includes(searchLower) ||
      job.role?.toLowerCase().includes(searchLower) ||
      job.location?.toLowerCase().includes(searchLower);

    const matchesStatus = !filterInputs.status || job.status?.toUpperCase() === filterInputs.status;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-5">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl shadow-sm p-5 sm:p-7 animate-fade-up">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              My Job Tracker
            </h1>
            <p className="text-gray-500 text-sm sm:text-base">
              Track applications with clarity and focus.
            </p>
          </div>

          <button
            className="btn-primary text-sm sm:text-base w-full sm:w-auto shrink-0"
            onClick={() => navigate("/ai-analyzer")}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Analyze Resume
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <StatCard
            title="Total Jobs"
            value={stats.total}
            color="blue"
            icon={<IconBriefcase />}
            delay="stagger-1"
          />
          <StatCard
            title="Interviews"
            value={stats.INTERVIEW}
            color="indigo"
            icon={<IconCalendar />}
            delay="stagger-2"
          />
          <StatCard
            title="Offers"
            value={stats.OFFER}
            color="emerald"
            icon={<IconCheck />}
            delay="stagger-3"
          />
          <StatCard
            title="Rejections"
            value={stats.REJECTED}
            color="rose"
            icon={<IconX />}
            delay="stagger-4"
          />
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl shadow-sm p-4 animate-fade-up">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by company, role, or location..."
              value={filterInputs.search}
              onChange={(e) => setFilterInputs({ ...filterInputs, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white/80 text-gray-800 placeholder:text-gray-400 outline-none transition-all hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
            {filterInputs.search && (
              <button
                onClick={() => setFilterInputs({ ...filterInputs, search: "" })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Status Filter */}
          <select
            value={filterInputs.status}
            onChange={(e) => setFilterInputs({ ...filterInputs, status: e.target.value })}
            className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 outline-none cursor-pointer hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 min-w-[140px]"
          >
            <option value="">All Status</option>
            <option value="APPLIED">Applied</option>
            <option value="INTERVIEW">Interview</option>
            <option value="OFFER">Offer</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {/* Results count */}
        {filterInputs.search || filterInputs.status ? (
          <div className="mt-3 text-sm text-gray-500">
            Showing {filteredJobs.length} of {jobs.length} jobs
            {filterInputs.search && <span> matching "<strong>{filterInputs.search}</strong>"</span>}
            {filterInputs.status && <span> with status <strong>{filterInputs.status}</strong></span>}
          </div>
        ) : null}
      </div>

      {/* Jobs List */}
      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/60 rounded-2xl p-5 animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-200"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center animate-fade-up">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
              {filterInputs.search || filterInputs.status ? (
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              ) : (
                <IconBriefcase className="w-8 h-8 text-blue-500" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {filterInputs.search || filterInputs.status ? "No matching jobs" : "No jobs yet"}
            </h3>
            <p className="text-gray-500 mb-4">
              {filterInputs.search || filterInputs.status
                ? "Try adjusting your search or filters"
                : "Start tracking your job applications"}
            </p>
            {!(filterInputs.search || filterInputs.status) && (
              <button
                onClick={() => navigate("/create-job")}
                className="btn-primary"
              >
                Add Your First Job
              </button>
            )}
          </div>
        ) : (
          filteredJobs.map((job, index) => (
            <div
              key={job.id}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <JobCard
                job={job}
                onDelete={handleDelete}
                onStatus={handleStatusChange}
                onArchive={handleArchive}
                onView={setSelectedJob}
              />
            </div>
          ))
        )}
      </div>

      <JobDescriptionDrawer
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
      />
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, color, icon, delay }) {
  const colorClasses = {
    blue: "bg-gradient-to-br from-blue-50 to-sky-50 border-blue-100 text-blue-600",
    indigo: "bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100 text-indigo-600",
    emerald: "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100 text-emerald-600",
    rose: "bg-gradient-to-br from-rose-50 to-pink-50 border-rose-100 text-rose-600",
  };

  return (
    <div className={`stat-card border ${colorClasses[color] || colorClasses.blue} animate-fade-up ${delay}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase font-semibold tracking-wide opacity-70">{title}</span>
        <span className="opacity-50">{icon}</span>
      </div>
      <div className="text-3xl font-bold tracking-tight">{value}</div>
    </div>
  );
}

// Icons
function IconBriefcase({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function IconCalendar({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function IconCheck({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconX({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
