"use client";

import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";

export default function PricingPage() {
    const plans = [
        {
            name: "Starter",
            price: "Coming Soon",
            description: "Perfect for small teams getting started",
            features: [
                "Up to 100 resumes/month",
                "Basic AI screening",
                "Email support",
                "1 user account",
                "Basic analytics",
            ],
            highlighted: false,
        },
        {
            name: "Professional",
            price: "Coming Soon",
            description: "For growing companies with active hiring",
            features: [
                "Up to 1,000 resumes/month",
                "Advanced AI screening",
                "Priority support",
                "5 user accounts",
                "Advanced analytics",
                "Batch processing",
                "API access",
            ],
            highlighted: true,
        },
        {
            name: "Enterprise",
            price: "Custom",
            description: "For large organizations with complex needs",
            features: [
                "Unlimited resumes",
                "Custom AI models",
                "24/7 dedicated support",
                "Unlimited users",
                "Custom integrations",
                "White-label options",
                "SLA guarantee",
                "On-premise deployment",
            ],
            highlighted: false,
        },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <Navbar />

            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                            Simple, Transparent{" "}
                            <span className="text-indigo-600 dark:text-indigo-400">
                                Pricing
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Choose the perfect plan for your hiring needs. All plans include a
                            14-day free trial.
                        </p>
                    </div>

                    {/* Pricing Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {plans.map((plan, index) => (
                            <div
                                key={index}
                                className={`relative rounded-2xl p-8 ${plan.highlighted
                                        ? "bg-indigo-600 dark:bg-indigo-700 text-white shadow-2xl scale-105"
                                        : "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700"
                                    }`}
                            >
                                {plan.highlighted && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-semibold">
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                <div className="text-center mb-6">
                                    <h3
                                        className={`text-2xl font-bold mb-2 ${plan.highlighted ? "text-white" : "text-gray-900"
                                            }`}
                                    >
                                        {plan.name}
                                    </h3>
                                    <p
                                        className={`text-sm mb-4 ${plan.highlighted ? "text-indigo-100" : "text-gray-600"
                                            }`}
                                    >
                                        {plan.description}
                                    </p>
                                    <div className="mb-4">
                                        <span
                                            className={`text-4xl font-bold ${plan.highlighted ? "text-white" : "text-gray-900"
                                                }`}
                                        >
                                            {plan.price}
                                        </span>
                                    </div>
                                </div>

                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-start">
                                            <svg
                                                className={`w-5 h-5 mr-2 mt-0.5 flex-shrink-0 ${plan.highlighted ? "text-white" : "text-green-500"
                                                    }`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <span
                                                className={
                                                    plan.highlighted ? "text-white" : "text-gray-600"
                                                }
                                            >
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href="/contact"
                                    className={`block w-full py-3 px-6 rounded-xl font-semibold text-center transition-all duration-200 ${plan.highlighted
                                            ? "bg-white text-indigo-600 hover:bg-gray-100"
                                            : "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white hover:shadow-lg"
                                        }`}
                                >
                                    {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* FAQ Section */}
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                            Frequently Asked Questions
                        </h2>
                        <div className="space-y-6">
                            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    When will pricing be available?
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    We're currently finalizing our pricing structure. Contact us
                                    to discuss your needs and get early access pricing.
                                </p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Can I change plans later?
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Yes! You can upgrade or downgrade your plan at any time. Changes
                                    will be reflected in your next billing cycle.
                                </p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    What payment methods do you accept?
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    We accept all major credit cards, bank transfers, and can set up
                                    custom payment terms for enterprise customers.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
