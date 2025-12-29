import { useState } from "react";
import { loginUser } from "../services/auth";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    try {
      setSubmitting(true);
      await loginUser(email, password);
      window.location.href = "/dashboard";
    } catch (err) {
      const message = err?.response?.data?.detail || "Login failed. Check credentials.";
      alert(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[70vh] grid place-items-center">
      <div className="glass w-full max-w-md p-7 space-y-6">
        <div className="text-center space-y-1">
          <p className="text-sm text-slate-400">Welcome back</p>
          <h2 className="text-2xl font-semibold">Sign in to continue</h2>
        </div>

        <div className="space-y-3">
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
          <button className="btn-primary w-full" onClick={handleLogin} disabled={submitting}>
            {submitting ? "Signing in..." : "Login"}
          </button>
          <p className="text-center text-sm text-slate-400">
            New here?{" "}
            <Link to="/signup" className="text-purple-300 hover:text-purple-200 underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
