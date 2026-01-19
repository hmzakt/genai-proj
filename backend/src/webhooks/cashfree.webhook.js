import BankAccount from "../models/paymentSystem/bankAccount.model.js";
import PaymentLog from "../models/paymentSystem/paymentLog.model.js";

export default async function cashfreeWebhook(req, res) {
    try {
        const event = req.body;

        // Cashfree webhook signature verification would go here
        // For now, we'll process the event directly

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
