import { Link, useLocation } from "react-router-dom";
import { logoutUser } from "../services/auth";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const { pathname } = useLocation();

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/create-job", label: "Create Job" },
    { href: "/archived", label: "Archived" }, // ✅ NEW
  ];

  return (
    <nav className="glass sticky top-4 z-10 flex items-center justify-between px-5 py-3">
      <div className="flex items-center gap-3">
        <span className="pill border-purple-400/40 bg-purple-500/20 text-purple-100">
          AI
        </span>
        <div className="leading-tight">
          <div className="font-semibold">Smart Job Tracker</div>
          <div className="text-xs text-slate-400">
            Stay organized across applications
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {token &&
          links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition border border-transparent ${
                pathname === link.href
                  ? "bg-purple-500/20 border-purple-400/50 text-white"
                  : "hover:bg-white/5 text-slate-200"
              }`}
            >
              {link.label}
            </Link>
          ))}

        {token ? (
          <button className="btn btn-ghost text-sm" onClick={logoutUser}>
            Logout
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="btn btn-ghost text-sm">
              Login
            </Link>
            <Link to="/signup" className="btn btn-primary text-sm">
              Sign up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
