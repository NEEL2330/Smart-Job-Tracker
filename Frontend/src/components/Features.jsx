import React from "react";

const TrackingIcon = () => (
  <svg className="w-12 h-12 text-indigo-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 00-4-4H3V9h2a4 4 0 004-4V3l7 4-7 4v2a4 4 0 004 4h2v2h-2a4 4 0 00-4 4z" />
  </svg>
);

const AiIcon = () => (
  <svg className="w-12 h-12 text-indigo-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const ReminderIcon = () => (
  <svg className="w-12 h-12 text-indigo-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const Features = () => {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-extrabold text-gray-900">The All-In-One Job Search Toolkit</h3>
          <p className="mt-4 text-lg text-gray-500">Everything you need to stay organized and get ahead.</p>
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <TrackingIcon />
            <h4 className="text-xl font-semibold text-gray-900">Track Every Application</h4>
            <p className="mt-2 text-gray-600">
              Manage all your job applications in one place. Move them through stages from 'Applied' to 'Offer'.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <AiIcon />
            <h4 className="text-xl font-semibold text-gray-900">AI-Powered Assistance</h4>
            <p className="mt-2 text-gray-600">
              Get AI suggestions to tailor your resume and prepare for interviews with job-based questions.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <ReminderIcon />
            <h4 className="text-xl font-semibold text-gray-900">Never Miss a Deadline</h4>
            <p className="mt-2 text-gray-600">
              Set smart reminders for application deadlines, interviews, and follow-ups.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
