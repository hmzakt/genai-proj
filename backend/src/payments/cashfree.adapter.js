import axios from "axios";
import PaymentAdapter from "./paymentAdapter.interface.js";

const CASHFREE_BASE_URL = "https://payout-api.cashfree.com/payout/v1";

export default class CashfreeAdapter extends PaymentAdapter {
    constructor() {
        super();
        this.appId = process.env.CASHFREE_CLIENT_ID;
        this.secretKey = process.env.CASHFREE_CLIENT_SECRET_KEY;

        if (!this.appId || !this.secretKey) {
            throw new Error("Cashfree credentials not configured");
        }
    }

    async transfer({ amount, bankAccount, reference }) {
        if (!bankAccount.cashfreeBeneficiaryId) {
            throw new Error("Cashfree beneficiary not linked");
        }

        try {
            // Initiate standard transfer
            const response = await axios.post(
                `${CASHFREE_BASE_URL}/requestTransfer`,
                {
                    beneId: bankAccount.cashfreeBeneficiaryId,
                    amount: amount.toFixed(2),
                    transferId: reference,
                    remarks: `Payroll payout ${reference}`,
                },
                {
                    headers: {
                        "X-Client-Id": this.appId,
                        "X-Client-Secret": this.secretKey,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = response.data;

            return {
                success: data.status === "SUCCESS",
                transactionId: data.data?.referenceId || reference,
                raw: data,
            };
        } catch (error) {
            console.error("Cashfree transfer error:", error.response?.data || error.message);
            throw new Error(
                error.response?.data?.message || "Cashfree transfer failed"
            );
        }
    }
}
