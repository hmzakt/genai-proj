interface StepIndicatorProps {
    currentStep: number;
    steps: string[];
}

export default function StepIndicator({
    currentStep,
    steps,
}: StepIndicatorProps) {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = stepNumber < currentStep;
                    const isCurrent = stepNumber === currentStep;

                    return (
                        <div key={index} className="flex items-center flex-1">
                            <div className="flex flex-col items-center flex-1">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${isCompleted
                                            ? "bg-green-500 dark:bg-green-600 text-white"
                                            : isCurrent
                                                ? "bg-indigo-600 dark:bg-indigo-600 text-white"
                                                : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                                        }`}
                                >
                                    {isCompleted ? "✓" : stepNumber}
                                </div>
                                <span
                                    className={`mt-2 text-sm font-medium ${isCurrent ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400"
                                        }`}
                                >
                                    {step}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div
                                    className={`h-1 flex-1 mx-4 ${isCompleted ? "bg-green-500 dark:bg-green-600" : "bg-gray-200 dark:bg-gray-700"
                                        }`}
                                    style={{ marginTop: "-2rem" }}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
