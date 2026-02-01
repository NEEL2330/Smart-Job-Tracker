import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // Redirect to dashboard if already logged in
    useEffect(() => {
        if (token) {
            navigate("/dashboard");
        }
    }, [token, navigate]);

    return (
        <div className="min-h-[85vh] flex flex-col">
            {/* Hero Section */}
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16">
                <div className="animate-fade-up">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 mb-6">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                            AI-Powered Job Tracking
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                        Track Your Job Hunt
                        <br />
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Like a Pro
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
                        Organize applications, track statuses, and land your dream job faster
                        with AI-powered insights and a beautiful dashboard.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/signup"
                            className="btn-primary text-base px-8 py-3 w-full sm:w-auto"
                        >
                            Get Started Free
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-16 px-4">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                        Everything you need to stay organized
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={<IconDashboard />}
                            title="Visual Dashboard"
                            description="See all your applications at a glance with status tracking and quick filters."
                            delay="stagger-1"
                        />
                        <FeatureCard
                            icon={<IconAI />}
                            title="AI Resume Analyzer"
                            description="Get instant feedback on your resume and match it to job descriptions."
                            delay="stagger-2"
                        />
                        <FeatureCard
                            icon={<IconStats />}
                            title="Application Stats"
                            description="Track your response rates, interview ratios, and optimize your strategy."
                            delay="stagger-3"
                        />
                    </div>
                </div>
            </div>

            {/* Social Proof */}
            <div className="py-8 px-4 border-t border-gray-200 dark:border-gray-800">
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    Trusted by job seekers worldwide 🌍
                </p>
            </div>
        </div>
    );
}

function FeatureCard({ icon, title, description, delay }) {
    return (
        <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-up ${delay}`}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white mb-4">
                {icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
        </div>
    );
}

// Icons
function IconDashboard() {
    return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
    );
}

function IconAI() {
    return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
    );
}

function IconStats() {
    return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    );
}
