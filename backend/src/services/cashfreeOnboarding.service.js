import axios from "axios";
import BankAccount from "../models/paymentSystem/bankAccount.model.js";

// Allow override for Test environment, otherwise default to Prod
// const CASHFREE_BASE_URL = process.env.CASHFREE_URL || "https://payout-api.cashfree.com/payout/v1";

export async function startCashfreeOnboarding(employee, bankAccountData) {
    // 1. Resolve Credentials
    const appId = process.env.CASHFREE_CLIENT_ID || process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_CLIENT_SECRET_KEY || process.env.CASHFREE_SECRET_KEY;

    if (!appId || !secretKey) {
        console.error("Missing Cashfree Credentials in .env");
        throw new Error("Cashfree credentials not configured");
    }

    // Determine Base URL (User provided sandbox URL, logic to fallback to prod)
    // Old Env might have: https://payout-gamma.cashfree.com/payout/v1 -> We need to retire this
    // New V2 Sandbox: https://sandbox.cashfree.com/payout
    // New V2 Prod: https://api.cashfree.com/payout

    let baseUrl = "https://api.cashfree.com/payout"; // Default Prod
    if (appId.startsWith("TEST") || process.env.CASHFREE_URL?.includes("sandbox") || process.env.CASHFREE_URL?.includes("payout-gamma")) {
        baseUrl = "https://sandbox.cashfree.com/payout";
    }

    // 2. Prepare Beneficiary ID
    // Construct a unique ID. Using timestamp ensures uniqueness if retried.
    const beneId = `BENE_${employee._id}_${Date.now()}`;

    try {
        console.log(`Initiating Cashfree Onboarding (V2) for ${employee.email}...`);
        console.log(`Target URL: ${baseUrl}/beneficiary`);

        // 3. Call Cashfree API: Add Beneficiary V2
        const response = await axios.post(
            `${baseUrl}/beneficiary`,
            {
                beneficiary_id: beneId,
                beneficiary_name: bankAccountData.accountHolderName,
                beneficiary_instrument_details: {
                    bank_account_number: bankAccountData.accountNumber,
                    bank_ifsc: bankAccountData.ifscCode
                },
                beneficiary_contact_details: {
                    beneficiary_email: employee.email,
                    beneficiary_phone: employee.phone || "9999999999",
                    beneficiary_country_code: "+91",
                    beneficiary_address: "Mumbai, India", // Simplified for now
                    beneficiary_city: "Mumbai",
                    beneficiary_state: "Maharashtra",
                    beneficiary_postal_code: "400001"
                }
            },
            {
                headers: {
                    "x-client-id": appId,
                    "x-client-secret": secretKey,
                    "x-api-version": "2024-01-01", // Explicitly set version
                    "Content-Type": "application/json",
                },
            }
        );

        const data = response.data;

        // In V2, success usually returns the beneficiary details object directly.
        // There isn't always a "status": "SUCCESS" field like V1.
        // If it throws, axios catches it. If it returns 200, it's good.

        console.log("Cashfree V2 Response:", JSON.stringify(data, null, 2));

        // 4. Update Database
        // Use findOneAndUpdate with upsert to prevent duplicates
        const bankAccount = await BankAccount.findOneAndUpdate(
            { employeeId: employee._id },
            {
                accountHolderName: bankAccountData.accountHolderName,
                accountNumber: bankAccountData.accountNumber,
                ifscCode: bankAccountData.ifscCode,
                bankName: bankAccountData.bankName,
                cashfreeBeneficiaryId: beneId,
                onboardingStatus: "COMPLETE",
                verified: true,
                isPrimary: true,
            },
            { new: true, upsert: true }
        );

        return {
            cashfreeBeneficiaryId: beneId,
            bankAccountId: bankAccount._id,
            success: true,
        };

    } catch (error) {
        // Enhanced Error Logging
        const errorMsg = error.response?.data?.message || error.message;
        const subCode = error.response?.data?.subCode || "UNKNOWN"; // V2 might differ, but safe to keep

        console.error("Cashfree Onboarding Failed (V2):");
        console.error(`- Error: ${errorMsg}`);
        console.error(`- SubCode: ${subCode}`);
        if (error.response?.data) {
            console.error("- Response Data:", JSON.stringify(error.response.data, null, 2));
        }

        throw new Error(errorMsg || "Failed to create Cashfree beneficiary");
    }
}
