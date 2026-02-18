import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";

function getKey() {
    const KEY_HEX = process.env.ENCRYPTION_KEY;
    if (!KEY_HEX || KEY_HEX.length !== 64) {
        throw new Error(
            "ENCRYPTION_KEY must be set in .env as a 64-character hex string (32 bytes)"
        );
    }
    return Buffer.from(KEY_HEX, "hex");
}

/**
 * Encrypts a value using AES-256-GCM.
 * Returns a string in the format: iv:authTag:ciphertext (all hex-encoded).
 */
export function encrypt(value) {
    if (value === null || value === undefined) return value;
    const key = getKey();
    const iv = crypto.randomBytes(12); // 96-bit IV recommended for GCM
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    const plaintext = String(value);
    const encrypted = Buffer.concat([
        cipher.update(plaintext, "utf8"),
        cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();

    return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted.toString("hex")}`;
}

/**
 * Decrypts a value encrypted by encrypt().
 * Returns the original string, or the value as-is if it doesn't look encrypted.
 */
export function decrypt(value) {
    if (value === null || value === undefined) return value;
    const str = String(value);

    // If it doesn't match the expected format, return as-is (handles legacy plaintext)
    const parts = str.split(":");
    if (parts.length !== 3) return value;

    try {
        const key = getKey();
        const [ivHex, authTagHex, ciphertextHex] = parts;
        const iv = Buffer.from(ivHex, "hex");
        const authTag = Buffer.from(authTagHex, "hex");
        const ciphertext = Buffer.from(ciphertextHex, "hex");

        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        decipher.setAuthTag(authTag);

        const decrypted = Buffer.concat([
            decipher.update(ciphertext),
            decipher.final(),
        ]);
        return decrypted.toString("utf8");
    } catch {
        // If decryption fails (e.g. wrong key or corrupted data), return as-is
        return value;
    }
}

/**
 * Encrypts a numeric field — stores as encrypted string, returns original number on decrypt.
 */
export function encryptNumber(value) {
    if (value === null || value === undefined) return value;
    return encrypt(String(value));
}

/**
 * Decrypts a numeric field — returns a Number.
 */
export function decryptNumber(value) {
    if (value === null || value === undefined) return value;
    const decrypted = decrypt(value);
    const num = parseFloat(decrypted);
    return isNaN(num) ? value : num;
}
