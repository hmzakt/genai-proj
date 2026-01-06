// src/webhooks/stripe.webhook.js

import Stripe from "stripe";
import PaymentLog from "../models/paymentSystem/paymentLog.model.js";
import PayrollRun from "../models/paymentSystem/payrollRun.model.js";
import PayrollItem from "../models/paymentSystem/payrollItem.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function stripeWebhook(req, res) {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
 
      case "transfer.paid": {
        const transfer = event.data.object;

        const payrollItemId =
          transfer.metadata?.payrollItemId;

        if (!payrollItemId) break;

        await PaymentLog.findOneAndUpdate(
          { transactionId: transfer.id },
          {
            status: "SUCCESS",
            rawResponse: transfer,
          },
          { new: true }
        );

        break;
      }

      case "transfer.failed": {
        const transfer = event.data.object;

        await PaymentLog.findOneAndUpdate(
          { transactionId: transfer.id },
          {
            status: "FAILED",
            rawResponse: transfer,
          },
          { new: true }
        );

        break;
      }
      case "account.updated": {
        const account = event.data.object;

        console.log(
          `Stripe account ${account.id} updated. Charges enabled: ${account.charges_enabled}`
        );
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    res.status(500).json({ error: "Webhook processing failed" });
  }
}
