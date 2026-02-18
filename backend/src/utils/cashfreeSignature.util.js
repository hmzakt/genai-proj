import crypto from "crypto";
import fs from "fs";
import path from "path";

/**
 * Generates the X-Cf-Signature header value required by Cashfree Payouts API
 * when using 2FA Public Key authentication (instead of IP whitelisting).
 *
 * Steps (per Cashfree docs):
 *  1. Take clientId
 *  2. Append "." + current UNIX timestamp (seconds)
 *  3. RSA-encrypt with OAEP padding using the downloaded public key PEM
 *  4. Base64-encode the result → this is the signature
 *
 * @param {string} clientId - Your Cashfree Client ID (X-Client-Id)
 * @returns {string} Base64-encoded RSA-OAEP encrypted signature
 */
export function generateCashfreeSignature(clientId) {
    const publicKeyPath = process.env.CASHFREE_PUBLIC_KEY_PATH;

    if (!publicKeyPath) {
        throw new Error(
            "CASHFREE_PUBLIC_KEY_PATH is not set in .env. " +
            "Download the public key from Cashfree Dashboard > Payouts > Developers > Two-Factor Authentication."
        );
    }

    const resolvedPath = path.resolve(publicKeyPath);

    if (!fs.existsSync(resolvedPath)) {
        throw new Error(
            `Cashfree public key file not found at: ${resolvedPath}. ` +
            "Ensure CASHFREE_PUBLIC_KEY_PATH points to the downloaded .pem file."
        );
    }

    const publicKeyPem = fs.readFileSync(resolvedPath, "utf8");

    // Build the data to encrypt: "<clientId>.<unixTimestampSeconds>"
    const unixTimestamp = Math.floor(Date.now() / 1000);
    const dataToEncrypt = `${clientId}.${unixTimestamp}`;

    // RSA encrypt with OAEP padding (matches PHP's OPENSSL_PKCS1_OAEP_PADDING)
    const encrypted = crypto.publicEncrypt(
        {
            key: publicKeyPem,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        },
        Buffer.from(dataToEncrypt, "utf8")
    );

    return encrypted.toString("base64");
}
