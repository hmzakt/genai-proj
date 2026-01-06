import Stripe from "stripe";
import PaymentAdapter from "./paymentAdapter.interface.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default class StripeAdapter extends PaymentAdapter {
  async transfer({ amount, bankAccount, reference }) {
    if (!bankAccount.stripeAccountId) {
      throw new Error("Stripe account not linked");
    }

    const payout = await stripe.transfers.create({
      amount: Math.round(amount * 100),   //paise 
      currency: "inr",
      destination: bankAccount.stripeAccountId,
      description: `Payroll payout ${reference}`,
      metadata: { payrollItemId: reference },
    });

    return {
      success: payout.status === "paid",
      transactionId: payout.id,
      raw: payout,
    };
  }
}
