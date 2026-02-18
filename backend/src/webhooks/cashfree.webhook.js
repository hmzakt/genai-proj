import BankAccount from "../models/paymentSystem/bankAccount.model.js";
import PaymentLog from "../models/paymentSystem/paymentLog.model.js";
import crypto from "crypto";

/**
 * Verify Cashfree webhook signature
 * Docs: https://docs.cashfree.com/docs/webhooks#webhook-signature-verification
 */
function verifyWebhookSignature(payload, signature, timestamp) {
    const publicKey = process.env.CASHFREE_PUBLIC_KEY;
    
    if (!publicKey) {
        console.warn("⚠️ CASHFREE_PUBLIC_KEY not set - skipping signature verification (NOT SECURE!)");
        return true; // Skip verification if key not set (for backward compatibility)
    }

    try {
        // Create the signature string: timestamp + payload
        const signatureString = timestamp + JSON.stringify(payload);
        
        // Verify using RSA-SHA256
        const verifier = crypto.createVerify("RSA-SHA256");
        verifier.update(signatureString);
        
        const isValid = verifier.verify(
            publicKey,
            signature,
            "base64"
        );
        
        if (!isValid) {
            console.error("❌ Webhook signature verification failed!");
        }
        
        return isValid;
    } catch (error) {
        console.error("❌ Error verifying webhook signature:", error.message);
        return false;
    }
}

export default async function cashfreeWebhook(req, res) {
    try {
        const event = req.body;
        const signature = req.headers["x-webhook-signature"];
        const timestamp = req.headers["x-webhook-timestamp"];

        // Verify webhook signature
        if (!verifyWebhookSignature(event, signature, timestamp)) {
            console.error("🚨 SECURITY ALERT: Invalid webhook signature received!");
            console.error(`   Source IP: ${req.ip}`);
            console.error(`   Event Type: ${event.event}`);
            return res.status(401).json({ error: "Invalid signature" });
        }
        
        console.log(`✅ Webhook signature verified - Event: ${event.event}`);

        switch (event.event) {
            case "TRANSFER_SUCCESS": {
                const transfer = event.data;
                const transferId = transfer.transferId;

                // Update payment log
                await PaymentLog.findOneAndUpdate(
                    { transactionId: transferId },
                    {
                        status: "SUCCESS",
                        rawResponse: transfer,
                    },
                    { new: true }
                );

                break;
            }

            case "TRANSFER_FAILED": {
                const transfer = event.data;
                const transferId = transfer.transferId;

                await PaymentLog.findOneAndUpdate(
                    { transactionId: transferId },
                    {
                        status: "FAILED",
                        rawResponse: transfer,
                    },
                    { new: true }
                );

                break;
            }

            case "TRANSFER_REVERSED": {
                const transfer = event.data;
                const transferId = transfer.transferId;

                await PaymentLog.findOneAndUpdate(
                    { transactionId: transferId },
                    {
                        status: "REVERSED",
                        rawResponse: transfer,
                    },
                    { new: true }
                );

                break;
            }

            case "BENEFICIARY_VERIFIED": {
                const beneficiary = event.data;

                await BankAccount.findOneAndUpdate(
                    { cashfreeBeneficiaryId: beneficiary.beneId },
                    {
                        onboardingStatus: "COMPLETE",
                        verified: true
                    }
                );

                break;
            }

            default:
                console.log(`Unhandled Cashfree event type: ${event.event}`);
        }

        res.json({ received: true });
    } catch (err) {
        console.error("Cashfree webhook handler error:", err);
        res.status(500).json({ error: "Webhook processing failed" });
    }
}
