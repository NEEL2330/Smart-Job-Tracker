import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CreateJob from "./pages/CreateJob.jsx";
import EditJob from "./pages/EditJob.jsx";
import Signup from "./pages/Signup.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import AIAnalyzer from "./pages/AIAnalyzer";
import ArchivedJobs from "./pages/ArchivedJobs";


function AppContent() {
  const { pathname } = useLocation();
  const hideNavbar = pathname === "/" || pathname === "/login" || pathname === "/signup";

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 flex flex-col gap-3 sm:gap-4 min-h-screen">
      {!hideNavbar && <Navbar />}

      <main className="flex flex-col gap-4 flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-job"
            element={
              <ProtectedRoute>
                <CreateJob />
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobs/:id/edit"
            element={
              <ProtectedRoute>
                <EditJob />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ai-analyzer"
            element={
              <ProtectedRoute>
                <AIAnalyzer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/archived"
            element={
              <ProtectedRoute>
                <ArchivedJobs />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}
