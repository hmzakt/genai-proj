import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const appId = process.env.CASHFREE_APP_ID;
const secretKey = process.env.CASHFREE_SECRET_KEY;
// Default to Prod if not set, but allow override
const baseUrl = process.env.CASHFREE_URL || "https://payout-api.cashfree.com/payout/v1";

console.log("--- Verifying Cashfree Credentials ---");
console.log("App ID:", appId ? appId.substring(0, 4) + "****" : "Not Set");
console.log("Base URL:", baseUrl);

async function checkBalance() {
    try {
        console.log("Attempting to fetch balance...");
        const response = await axios.get(`${baseUrl}/getBalance`, {
            headers: {
                "X-Client-Id": appId,
                "X-Client-Secret": secretKey,
                "Content-Type": "application/json",
            },
        });
        console.log("✅ Success! Credentials are valid.");
        console.log("Response:", JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error("❌ Failed!");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", JSON.stringify(error.response.data, null, 2));
            console.error("Headers:", JSON.stringify(error.response.headers, null, 2));
        } else {
            console.error("Error:", error.message);
        }

        console.log("\n--- Troubleshooting Tips ---");
        console.log("1. Are these 'Payouts' keys? (Not Payment Gateway keys)");
        console.log("2. Is your IP whitelisted? (Required for Production)");
        console.log("3. Are you using Test keys on Prod URL? (Set CASHFREE_URL to https://payout-gamma.cashfree.com/payout/v1 for Test)");
    }
}

checkBalance();
