import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";


export default function CreateJob() {
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);


  const handleCreate = async () => {
    try {
      setSaving(true);
      await API.post("/jobs", {
        role,
        company,
        location,
        description,
        status: "applied",
      });
      window.location.href = "/dashboard";
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[70vh] grid place-items-center">
      <div className="glass w-full max-w-md p-7 space-y-4">
        <h2 className="text-xl font-semibold text-center">Add Job</h2>

        <button
          onClick={() => navigate(-1)}
          className="text-sm text-slate-400 hover:text-slate-200 transition"
        >
          ← Back
        </button>

        <input className="input" placeholder="Job title" value={role} onChange={(e) => setRole(e.target.value)} />
        <input className="input" placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
        <input className="input" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />

        <textarea
          className="input min-h-[100px]"
          placeholder="Job description / notes"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button className="btn-primary w-full" onClick={handleCreate} disabled={saving}>
          {saving ? "Saving..." : "Add job"}
        </button>
      </div>
    </div>
  );
}
