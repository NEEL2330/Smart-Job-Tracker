import ResumeMatcher from "../components/ResumeMatcher";

{jobs.map((job) => (
  <div key={job.id} className="job-card">
    <h3>{job.title}</h3>
    <p>{job.company}</p>

    {/* AI Resume Matcher */}
    <ResumeMatcher jobId={job.id} />
  </div>
))}
