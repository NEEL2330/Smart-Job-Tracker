import { useNavigate } from "react-router-dom";

const STATUS_OPTIONS = ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"];

const STATUS_STYLES = {
  APPLIED: "bg-sky-50 border-sky-200 text-sky-700",
  INTERVIEW: "bg-indigo-50 border-indigo-200 text-indigo-700",
  OFFER: "bg-emerald-50 border-emerald-200 text-emerald-700",
  REJECTED: "bg-rose-50 border-rose-200 text-rose-700",
};

export default function JobCard({
  job,
  onDelete,
  onStatus,
  onView,
  onArchive,
}) {
  const navigate = useNavigate();

  const status = (job.status || "APPLIED").toUpperCase();
  const statusStyle = STATUS_STYLES[status];

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const appliedDate = formatDate(job.applied_date);

  return (
    <div className="group relative bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-lg hover:border-gray-300/60 transition-all duration-300">

      {/* Desktop Actions - top right */}
      <div className="hidden sm:flex absolute top-4 right-4 gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {job.job_url && (
          <a
            href={job.job_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
            title="Open job posting"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
        <ActionButton
          onClick={() => navigate(`/jobs/${job.id}/edit`, { state: job })}
          color="blue"
        >
          Edit
        </ActionButton>
        <ActionButton
          onClick={() => onArchive(job.id, true)}
          color="amber"
        >
          Archive
        </ActionButton>
        <ActionButton
          onClick={() => onDelete(job.id)}
          color="red"
        >
          Delete
        </ActionButton>
      </div>

      {/* CONTENT */}
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20">
          {job.company?.charAt(0)?.toUpperCase() || "?"}
        </div>

        <div className="flex-1 min-w-0 pr-16 sm:pr-32">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{job.company}</h3>
            {job.job_url && (
              <a
                href={job.job_url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-gray-400 hover:text-blue-600 transition-colors sm:hidden"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
          <p className="text-sm text-gray-600 truncate">{job.role}</p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-400">
            {job.location && (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {job.location}
              </span>
            )}
            {appliedDate && (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Applied {appliedDate}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Notes Preview */}
      {job.notes && (
        <div className="mt-3 px-3 py-2 rounded-lg bg-amber-50 border border-amber-100 text-xs text-amber-700">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="line-clamp-2">{job.notes}</span>
          </div>
        </div>
      )}

      <button
        onClick={() => onView(job)}
        className="mt-3 text-xs text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1 transition-colors"
      >
        View details
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* STATUS */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className={`px-3 py-1.5 rounded-full border text-xs font-semibold ${statusStyle}`}>
          {status}
        </span>

        <select
          value={status}
          onChange={(e) => onStatus(job.id, e.target.value)}
          className="rounded-full px-3 py-1.5 text-xs border border-gray-200 bg-gray-50 font-medium outline-none cursor-pointer hover:bg-gray-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s} className="bg-white text-gray-800">
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Mobile Actions - bottom */}
      <div className="sm:hidden flex gap-4 mt-4 pt-3 border-t border-gray-100 text-xs">
        <ActionButton
          onClick={() => navigate(`/jobs/${job.id}/edit`, { state: job })}
          color="blue"
        >
          Edit
        </ActionButton>
        <ActionButton
          onClick={() => onArchive(job.id, true)}
          color="amber"
        >
          Archive
        </ActionButton>
        <ActionButton
          onClick={() => onDelete(job.id)}
          color="red"
        >
          Delete
        </ActionButton>
      </div>
    </div>
  );
}

function ActionButton({ onClick, color, children }) {
  const colors = {
    blue: "text-blue-600 hover:text-blue-800 hover:bg-blue-50",
    amber: "text-amber-600 hover:text-amber-800 hover:bg-amber-50",
    red: "text-red-500 hover:text-red-700 hover:bg-red-50",
  };

  return (
    <button
      onClick={onClick}
      className={`font-medium px-2 py-1 rounded-lg transition-all ${colors[color]}`}
    >
      {children}
    </button>
  );
}
