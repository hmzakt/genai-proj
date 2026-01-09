import { PayrollStatus, PaymentStatus } from "@/types/payroll";

interface StatusBadgeProps {
    status: PayrollStatus | PaymentStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const getStatusStyles = () => {
        switch (status) {
            case "DRAFT":
                return "bg-gray-100 text-gray-800 border-gray-300";
            case "REVIEWED":
                return "bg-blue-100 text-blue-800 border-blue-300";
            case "APPROVED":
                return "bg-purple-100 text-purple-800 border-purple-300";
            case "PAID":
            case "SUCCESS":
                return "bg-green-100 text-green-800 border-green-300";
            case "FAILED":
                return "bg-red-100 text-red-800 border-red-300";
            case "PENDING":
                return "bg-yellow-100 text-yellow-800 border-yellow-300";
            default:
                return "bg-gray-100 text-gray-800 border-gray-300";
        }
    };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles()}`}
        >
            {status}
        </span>
    );
}
