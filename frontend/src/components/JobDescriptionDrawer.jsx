export default function JobDescriptionDrawer({ job, onClose }) {
  if (!job) return null;

  return (
    <>
      {/* BACKDROP */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* DRAWER */}
      <div
        className="
          fixed top-0 right-0 z-50 h-full w-full sm:w-[480px]
          bg-slate-900/95 backdrop-blur-xl
          border-l border-white/10
          shadow-2xl
          flex flex-col
          animate-slide-in
        "
      >
        {/* HEADER */}
        <div className="p-5 border-b border-white/10 flex justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              {job.company}
            </h2>
            <p className="text-sm text-slate-400">{job.role}</p>
            {job.location && (
              <p className="text-xs text-slate-500 mt-1">{job.location}</p>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h3 className="text-xs uppercase tracking-wide text-slate-400 mb-2">
              Job Description
            </h3>

            <div className="
              text-slate-200 text-sm
              whitespace-pre-line
              leading-relaxed
            ">
              {job.description || "No description provided."}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
