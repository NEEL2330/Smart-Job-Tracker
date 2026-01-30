export default function JobDescriptionDrawer({ job, onClose }) {
  if (!job) return null;

  return (
    <>
      {/* BACKDROP */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* DRAWER */}
      <div
        className="
          fixed top-0 right-0 z-50 h-full w-full sm:w-[480px]
          bg-white
          border-l border-gray-200
          shadow-2xl
          flex flex-col
          animate-slide-in
        "
      >
        {/* HEADER */}
        <div className="p-5 border-b border-gray-200 flex justify-between bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {job.company}
            </h2>
            <p className="text-sm text-gray-600">{job.role}</p>
            {job.location && (
              <p className="text-xs text-gray-500 mt-1">{job.location}</p>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h3 className="text-xs uppercase tracking-wide text-gray-500 font-medium mb-2">
              Job Description
            </h3>

            <div className="
              text-gray-700 text-sm
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
