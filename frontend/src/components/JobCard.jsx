import { useNavigate } from "react-router-dom";
import { useState } from "react";

const STATUS_OPTIONS = ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"];

const STATUS_STYLES = {
  APPLIED: "border-sky-400/40 text-sky-300 bg-sky-500/10",
  INTERVIEW: "border-indigo-400/40 text-indigo-300 bg-indigo-500/10",
  OFFER: "border-emerald-400/40 text-emerald-300 bg-emerald-500/10",
  REJECTED: "border-rose-400/40 text-rose-300 bg-rose-500/10",
};

export default function JobCard({ job, onDelete, onStatus }) {
  const navigate = useNavigate();
  const [showDescription, setShowDescription] = useState(false);

  const status = (job.status || "APPLIED").toUpperCase();
  const statusStyle = STATUS_STYLES[status];

  return (
    <>
      {/* CARD */}
      <div className="relative rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-xl p-5 shadow-lg">
        {/* ACTIONS */}
        <div className="absolute top-4 right-4 flex gap-4 text-xs">
          <button
            onClick={() => navigate(`/jobs/${job.id}/edit`, { state: job })}
            className="text-indigo-400 hover:text-indigo-300"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(job.id)}
            className="text-rose-400 hover:text-rose-300"
          >
            Delete
          </button>
        </div>

        {/* CONTENT */}
        <h3 className="text-xl font-semibold text-white">{job.company}</h3>
        <p className="text-sm text-slate-300 mt-1">{job.role}</p>

        {job.location && (
          <p className="text-xs text-slate-400 mt-1">{job.location}</p>
        )}

        <button
          onClick={() => setShowDescription(true)}
          className="mt-3 text-xs text-indigo-400 hover:underline"
        >
          View description
        </button>

        {/* STATUS */}
        <div className="mt-4 flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full border text-xs ${statusStyle}`}
          >
            {status}
          </span>

          <select
            value={status}
            onChange={(e) => onStatus(job.id, e.target.value)}
            className={`rounded-full px-3 py-1 text-xs border bg-slate-900 outline-none ${statusStyle}`}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s} className="bg-slate-900 text-slate-200">
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* DESCRIPTION MODAL */}
      {showDescription && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative w-full max-w-md rounded-2xl 
                      bg-slate-900/90 
                      border border-white/15 
                      backdrop-blur-lg 
                      p-6 shadow-2xl">

          <h3 className="text-lg font-semibold text-white mb-3">
            Job Description
          </h3>

          <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
            {job.description || "No description added."}
          </p>

          <button
            onClick={() => setShowDescription(false)}
            className="mt-5 text-sm text-indigo-400 hover:text-indigo-300 transition"
          >
            Close
          </button>
      </div>
    </div>
)}

    </>
  );
}
