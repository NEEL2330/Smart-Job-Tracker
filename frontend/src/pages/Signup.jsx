import { useState } from "react";
import { registerUser } from "../services/auth";
import { Link } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    try {
      setSubmitting(true);
      setError("");
      await registerUser(name, email, password);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err?.response?.data?.detail || "Signup failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[70vh] grid place-items-center">
      <div className="glass w-full max-w-md p-7 space-y-6">
        <div className="text-center space-y-1">
          <p className="text-sm text-slate-400">Create an account</p>
          <h2 className="text-2xl font-semibold">Join Smart Job Tracker</h2>
        </div>

        <div className="space-y-3">
          <input
            className="input"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="input"
            placeholder="Work email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <div className="pill border-amber-400/50 bg-amber-500/10 text-amber-100 justify-center">
              {error}
            </div>
          )}

          <button className="btn-primary w-full" onClick={handleSignup} disabled={submitting}>
            {submitting ? "Creating account..." : "Sign up"}
          </button>

          <p className="text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-300 hover:text-purple-200 underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

