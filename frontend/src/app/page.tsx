"use client";

import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Galaxy from "@/components/ui/galaxy";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />

      {/* Hero Section */}


      <section className="relative px-4 sm:px-6 lg:px-8 min-h-screen bg-white dark:bg-gray-950 flex items-center">
        {/* Galaxy Background */}
        <div className="absolute inset-0 w-full h-170 overflow-hidden bg-gray-950">
          <Galaxy />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="text-center">
            <h1 className="text-5xl pt-20 md:text-6xl lg:text-7xl font-bold text-gray-950 dark:text-white mb-6">
              Transform Your Hiring with{" "}
              <span className="text-indigo-600 dark:text-indigo-400">
                AI-Powered
              </span>{" "}
              Intelligence
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto">
              Screen resumes faster, eliminate bias, and find the perfect
              candidates with our advanced AI platform. Save 90% of your
              recruitment time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/contact"
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-200 w-full sm:w-auto text-center"
              >
                Book a Trial
              </Link>
              <Link
                href="/signup"
                className="px-8 py-4 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-600 dark:border-indigo-500 rounded-xl font-semibold text-lg hover:bg-indigo-50 dark:hover:bg-gray-700 hover:scale-105 transition-all duration-200 w-full sm:w-auto text-center"
              >
                Sign Up Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features for Modern HR Teams
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to streamline your recruitment process and
              make data-driven hiring decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                AI Resume Screening
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Automatically analyze and rank resumes based on job
                requirements. Our AI understands context and skills beyond
                keywords.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Smart Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get deep insights into your hiring pipeline with comprehensive
                analytics and reporting dashboards.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Batch Processing
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Process hundreds of resumes simultaneously with our powerful
                batch processing engine. Scale effortlessly.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-8 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Payroll Management
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Seamlessly manage employee payroll with integrated payment
                processing and automated calculations.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group p-8 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                AI HR Assistant
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Chat with our AI assistant to get instant answers about HR
                policies, employee data, and more.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group p-8 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Secure & Compliant
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Enterprise-grade security with GDPR compliance. Your data is
                encrypted and protected at all times.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-900 dark:bg-blue-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-5xl font-bold mb-2">90%</div>
              <div className="text-xl text-indigo-100">Time Saved</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">xx,xxx+</div>
              <div className="text-xl text-indigo-100">Resumes Processed</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">xxx+</div>
              <div className="text-xl text-indigo-100">Happy Companies</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Transform Your Hiring?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10">
            Join hundreds of companies already using our AI platform to hire
            smarter and faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/contact"
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-200 w-full sm:w-auto text-center"
            >
              Book a Trial
            </Link>
            <Link
              href="/signup"
              className="px-8 py-4 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-600 dark:border-indigo-500 rounded-xl font-semibold text-lg hover:bg-indigo-50 dark:hover:bg-gray-700 hover:scale-105 transition-all duration-200 w-full sm:w-auto text-center"
            >
              Sign Up Now
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
