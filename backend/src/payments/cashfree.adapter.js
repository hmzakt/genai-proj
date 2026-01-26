import axios from "axios";
import PaymentAdapter from "./paymentAdapter.interface.js";

const CASHFREE_BASE_URL = "https://payout-api.cashfree.com/payout/v1";

export default class CashfreeAdapter extends PaymentAdapter {
    constructor() {
        super();
        this.appId = process.env.CASHFREE_CLIENT_ID || process.env.CASHFREE_APP_ID;
        this.secretKey = process.env.CASHFREE_CLIENT_SECRET_KEY || process.env.CASHFREE_SECRET_KEY;

        if (!this.appId || !this.secretKey) {
            throw new Error("Cashfree credentials not configured");
        }
    }

    async transfer({ amount, bankAccount, reference }) {
        if (!bankAccount.cashfreeBeneficiaryId) {
            throw new Error("Cashfree beneficiary not linked");
        }

        // Determine Base URL
        let baseUrl = "https://api.cashfree.com/payout"; // Default Prod
        if (this.appId.startsWith("TEST") || process.env.CASHFREE_URL?.includes("sandbox") || process.env.CASHFREE_URL?.includes("payout-gamma")) {
            baseUrl = "https://sandbox.cashfree.com/payout";
        }

        try {
            console.log(`Initiating Cashfree Transfer (V2) for ${reference} to ${bankAccount.cashfreeBeneficiaryId}...`);

            // Initiate standard transfer V2
            // Docs: https://docs.cashfree.com/reference/payouts-integration-transfer-funds
            const response = await axios.post(
                `${baseUrl}/transfers`,
                {
                    transfer_id: reference,
                    transfer_amount: parseFloat(amount.toFixed(2)),
                    transfer_mode: "banktransfer", // Default mode
                    beneficiary_details: {
                        beneficiary_id: bankAccount.cashfreeBeneficiaryId
                    },
                    transfer_currency: "INR",
                    transfer_remarks: `Payroll ${reference}`,
                },
                {
                    headers: {
                        "x-client-id": this.appId,
                        "x-client-secret": this.secretKey,
                        "x-api-version": "2024-01-01",
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = response.data;
            console.log("Cashfree Transfer V2 Response:", JSON.stringify(data, null, 2));

            // V2 returns the transfer object. Check for transfer_id presence or specific status if needed.
            // Usually returns status: "PENDING" or "PROCESSED" or "SUCCESS"
            return {
                success: true, // If axios didn't throw, we consider it initiated successfully
                transactionId: data.cf_transfer_id || reference,
                raw: data,
            };
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            console.error("Cashfree transfer error (V2):", errorMsg);
            if (error.response?.data) {
                console.error("- Response Data:", JSON.stringify(error.response.data, null, 2));
            }

            throw new Error(errorMsg || "Cashfree transfer failed");
        }
    }
}
