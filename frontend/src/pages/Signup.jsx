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
      const detail = err?.response?.data?.detail;
      // Handle Pydantic validation errors (array of objects) vs simple string errors
      if (Array.isArray(detail)) {
        setError(detail.map(e => e.msg).join(", "));
      } else if (typeof detail === "string") {
        setError(detail);
      } else {
        setError("Signup failed. Try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !submitting) {
      handleSignup();
    }
  };

  return (
    <div className="min-h-[70vh] grid place-items-center px-4">
      <div className="w-full max-w-md animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-xl shadow-lg shadow-blue-500/25 mb-4">
            AI
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
          <p className="text-gray-500 mt-1">Join Smart Job Tracker today</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl shadow-xl shadow-gray-200/40 p-6 sm:p-8 space-y-5">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
              <input
                className="input"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                className="input"
                placeholder="you@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input
                className="input"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm animate-fade-in">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <button
            className="btn-primary w-full"
            onClick={handleSignup}
            disabled={submitting}
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </span>
            ) : (
              "Create account"
            )}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Already have an account?</span>
            </div>
          </div>

          <Link
            to="/login"
            className="btn btn-ghost w-full justify-center"
          >
            Sign in instead
          </Link>
        </div>
      </div>
    </div>
  );
}
