import axios from "axios";
import PaymentAdapter from "./paymentAdapter.interface.js";
import { generateCashfreeSignature } from "../utils/cashfreeSignature.util.js";
import BankAccount from "../models/paymentSystem/bankAccount.model.js";

export default class CashfreeAdapter extends PaymentAdapter {
    constructor() {
        super();
        this.appId = process.env.CASHFREE_CLIENT_ID || process.env.CASHFREE_APP_ID;
        this.secretKey = process.env.CASHFREE_CLIENT_SECRET_KEY || process.env.CASHFREE_SECRET_KEY;

        if (!this.appId || !this.secretKey) {
            throw new Error("Cashfree credentials not configured");
        }
    }

    _getBaseUrl() {
        if (this.appId.startsWith("TEST") || process.env.CASHFREE_URL?.includes("sandbox") || process.env.CASHFREE_URL?.includes("payout-gamma")) {
            return "https://sandbox.cashfree.com/payout";
        }
        return "https://api.cashfree.com/payout";
    }

    _getHeaders() {
        return {
            "x-client-id": this.appId,
            "x-client-secret": this.secretKey,
            "x-api-version": "2024-01-01",
            "X-Cf-Signature": generateCashfreeSignature(this.appId),
            "Content-Type": "application/json",
        };
    }

    /**
     * Verify the beneficiary exists on Cashfree. If not, re-create it
     * using the bank account details stored in our DB.
     * Returns the valid beneficiary ID to use for the transfer.
     */
    async ensureBeneficiaryExists(bankAccount, employee) {
        const baseUrl = this._getBaseUrl();
        const headers = this._getHeaders();
        const beneId = bankAccount.cashfreeBeneficiaryId;

        try {
            // Step 1: Check if beneficiary exists
            console.log(`Verifying beneficiary ${beneId} exists on Cashfree...`);
            await axios.get(`${baseUrl}/beneficiary/${beneId}`, { headers });
            console.log(`Beneficiary ${beneId} verified successfully.`);
            return beneId;
        } catch (error) {
            const errCode = error.response?.data?.code;
            const httpStatus = error.response?.status;

            // Only re-create if it's actually a "not found" error
            if (httpStatus === 404 || errCode === "beneficiary_not_found") {
                console.warn(`Beneficiary ${beneId} not found on Cashfree. Re-creating...`);
                return await this._recreateBeneficiary(bankAccount, employee);
            }

            // Some other error (auth, network, etc.) — rethrow
            const errorMsg = error.response?.data?.message || error.message;
            console.error(`Beneficiary verification failed: ${errorMsg}`);
            throw new Error(`Beneficiary verification failed: ${errorMsg}`);
        }
    }

    /**
     * Re-create the beneficiary on Cashfree and update the stored ID in our DB.
     */
    async _recreateBeneficiary(bankAccount, employee) {
        const baseUrl = this._getBaseUrl();
        const headers = this._getHeaders();
        const newBeneId = `BENE_${bankAccount.employeeId}_${Date.now()}`;

        try {
            const response = await axios.post(
                `${baseUrl}/beneficiary`,
                {
                    beneficiary_id: newBeneId,
                    beneficiary_name: bankAccount.accountHolderName,
                    beneficiary_instrument_details: {
                        bank_account_number: bankAccount.accountNumber,
                        bank_ifsc: bankAccount.ifscCode,
                    },
                    beneficiary_contact_details: {
                        beneficiary_email: employee?.email || "noreply@example.com",
                        beneficiary_phone: employee?.phone || "9999999999",
                        beneficiary_country_code: "+91",
                        beneficiary_address: "India",
                        beneficiary_city: "Mumbai",
                        beneficiary_state: "Maharashtra",
                        beneficiary_postal_code: "400001",
                    },
                },
                { headers }
            );

            console.log(`Beneficiary re-created successfully: ${newBeneId}`, JSON.stringify(response.data, null, 2));

            // Update the stored beneficiary ID in the database
            await BankAccount.findByIdAndUpdate(bankAccount._id, {
                cashfreeBeneficiaryId: newBeneId,
            });

            console.log(`Updated BankAccount ${bankAccount._id} with new beneficiary ID: ${newBeneId}`);
            return newBeneId;
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            console.error(`Failed to re-create beneficiary: ${errorMsg}`);
            if (error.response?.data) {
                console.error("- Response Data:", JSON.stringify(error.response.data, null, 2));
            }
            throw new Error(`Failed to re-create beneficiary: ${errorMsg}`);
        }
    }

    async transfer({ amount, bankAccount, reference, employee }) {
        if (!bankAccount.accountNumber || !bankAccount.ifscCode) {
            throw new Error("Bank account details (account number, IFSC) are required for transfer");
        }

        const baseUrl = this._getBaseUrl();
        const headers = this._getHeaders();

        try {
            console.log(`Initiating Cashfree Transfer (V2) for ${reference} with inline beneficiary details...`);

            // Use inline beneficiary details in the transfer request
            // Do NOT include beneficiary_id — Cashfree V2 treats it as a lookup key
            // against pre-registered beneficiaries and fails with beneficiary_not_found
            const requestBody = {
                transfer_id: reference,
                transfer_amount: parseFloat(amount.toFixed(2)),
                transfer_mode: "banktransfer",
                beneficiary_details: {
                    beneficiary_name: bankAccount.accountHolderName || employee?.name || "Beneficiary",
                    beneficiary_instrument_details: {
                        bank_account_number: bankAccount.accountNumber,
                        bank_ifsc: bankAccount.ifscCode,
                    },
                    beneficiary_contact_details: {
                        beneficiary_email: employee?.email || "noreply@example.com",
                        beneficiary_phone: employee?.phone || "9999999999",
                    },
                },
                transfer_currency: "INR",
                transfer_remarks: `Payroll ${reference}`,
            };

            console.log("Transfer request body:", JSON.stringify(requestBody, null, 2));

            const response = await axios.post(
                `${baseUrl}/transfers`,
                requestBody,
                { headers }
            );

            const data = response.data;
            console.log("Cashfree Transfer V2 Response:", JSON.stringify(data, null, 2));

            return {
                success: true,
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
