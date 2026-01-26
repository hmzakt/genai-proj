"use client";

import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                            About{" "}
                            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Our Mission
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600">
                            We're on a mission to revolutionize the hiring process with
                            AI-powered intelligence.
                        </p>
                    </div>

                    {/* Story Section */}
                    <div className="mb-16">
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 md:p-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Our Story
                            </h2>
                            <p className="text-gray-700 mb-4 leading-relaxed">
                                Founded in 2024, HR AI Platform was born from a simple
                                observation: hiring teams spend countless hours manually
                                screening resumes, often missing great candidates due to time
                                constraints and unconscious bias.
                            </p>
                            <p className="text-gray-700 mb-4 leading-relaxed">
                                We believed there had to be a better way. By combining
                                cutting-edge artificial intelligence with deep HR expertise, we
                                created a platform that not only saves time but also improves
                                the quality of hiring decisions.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                Today, we're proud to serve over 500 companies worldwide,
                                helping them find the right talent faster and more efficiently
                                than ever before.
                            </p>
                        </div>
                    </div>

                    {/* Values Section */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                            Our Values
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                                    <svg
                                        className="w-6 h-6 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Innovation First
                                </h3>
                                <p className="text-gray-600">
                                    We constantly push the boundaries of what's possible with AI
                                    and machine learning to deliver cutting-edge solutions.
                                </p>
                            </div>

                            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center mb-4">
                                    <svg
                                        className="w-6 h-6 text-white"
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
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Fairness & Diversity
                                </h3>
                                <p className="text-gray-600">
                                    We're committed to reducing bias in hiring and promoting
                                    diversity through objective, data-driven decisions.
                                </p>
                            </div>

                            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center mb-4">
                                    <svg
                                        className="w-6 h-6 text-white"
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
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Privacy & Security
                                </h3>
                                <p className="text-gray-600">
                                    Your data is sacred. We employ enterprise-grade security and
                                    comply with all major privacy regulations.
                                </p>
                            </div>

                            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-red-600 rounded-lg flex items-center justify-center mb-4">
                                    <svg
                                        className="w-6 h-6 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Customer Success
                                </h3>
                                <p className="text-gray-600">
                                    Your success is our success. We're dedicated to providing
                                    exceptional support and continuous improvement.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Team Section */}
                    <div className="text-center bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-12 text-white">
                        <h2 className="text-3xl font-bold mb-4">Join Our Team</h2>
                        <p className="text-xl text-indigo-100 mb-6">
                            We're always looking for talented individuals who share our
                            passion for innovation and excellence.
                        </p>
                        <a
                            href="#"
                            className="inline-block px-8 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                        >
                            View Open Positions
                        </a>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
