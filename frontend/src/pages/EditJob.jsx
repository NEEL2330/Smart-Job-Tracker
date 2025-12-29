import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { updateJob } from "../services/jobs";

export default function EditJob() {
  const { state: job } = useLocation();
  const navigate = useNavigate();

  const [role, setRole] = useState(job.role);
  const [company, setCompany] = useState(job.company);
  const [location, setLocation] = useState(job.location || "");
  const [description, setDescription] = useState(job.description || "");
  const [saving, setSaving] = useState(false);

  const handleUpdate = async () => {
    try {
      setSaving(true);
      await updateJob(job.id, {
        role,
        company,
        location,
        description,
      });
      navigate("/dashboard");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[70vh] grid place-items-center">
      <div className="glass w-full max-w-md p-7 space-y-4">
        <h2 className="text-xl font-semibold text-center">Edit Job</h2>

        <button
            onClick={() => navigate(-1)}
            className="text-sm text-slate-400 hover:text-slate-200 transition"
            >
            ← Back
        </button>

        <input className="input" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Job title" />
        <input className="input" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company" />
        <input className="input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />

        <textarea
          className="input min-h-[100px]"
          placeholder="Job description / notes"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button className="btn-primary w-full" onClick={handleUpdate} disabled={saving}>
          {saving ? "Saving..." : "Update Job"}
        </button>
      </div>
    </div>
  );
}
