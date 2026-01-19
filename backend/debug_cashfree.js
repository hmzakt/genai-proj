import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// Try both key names
const appId = process.env.CASHFREE_CLIENT_ID || process.env.CASHFREE_APP_ID;
const secretKey = process.env.CASHFREE_CLIENT_SECRET_KEY || process.env.CASHFREE_SECRET_KEY;
const baseUrl = process.env.CASHFREE_URL || "https://payout-api.cashfree.com/payout/v1";

console.log("\n--- Debugging Cashfree Credentials ---");
console.log(`Using App ID: '${appId}' (Length: ${appId?.length})`);
console.log(`Using Secret: '${secretKey?.substring(0, 5)}...' (Length: ${secretKey?.length})`);
console.log(`Target URL: ${baseUrl}`);

if (!appId || !secretKey) {
    console.error("❌ Missing specific keys in .env");
    process.exit(1);
}

async function verifyKeys() {
    try {
        console.log("\nAttempting 'Get Balance' request...");

        // Try with standard headers + Version
        const headers = {
            "X-Client-Id": appId,
            "X-Client-Secret": secretKey,
            "x-api-version": "2024-01-01",
            "Content-Type": "application/json"
        };
        console.log("Request Headers:", JSON.stringify(headers, null, 2));

        const response = await axios.get(`${baseUrl}/getBalance`, { headers });

        console.log("\n✅ SUCCESS! Connection Established.");
        console.log("Response:", response.data);
    } catch (error) {
        console.log("\n❌ Request FAILED.");
        if (error.response) {
            console.log(`Status Code: ${error.response.status} ${error.response.statusText}`);
            console.log("Response Body:", JSON.stringify(error.response.data, null, 2));
            console.log("Response Headers:", JSON.stringify(error.response.headers, null, 2));
        } else {
            console.log("Error:", error.message);
        }
    }
}

verifyKeys();
