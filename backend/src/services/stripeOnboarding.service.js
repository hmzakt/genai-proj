import Stripe from "stripe";
import BankAccount from "../models/paymentSystem/bankAccount.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function startStripeOnboarding(employee, returnUrl) {
  // 1️⃣ Create Stripe Connected Account
  const account = await stripe.accounts.create({
    type: "custom",
    country: "IN",
    email: employee.email,
    capabilities: {
      transfers: { requested: true },
    },
  });

  // 2️⃣ Save Stripe account reference
  const bankAccount = await BankAccount.create({
    employeeId: employee._id,
    stripeAccountId: account.id,
    onboardingStatus: "PENDING",
  });

  // 3️⃣ Create Stripe onboarding link
  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: returnUrl,
    return_url: returnUrl,
    type: "account_onboarding",
  });

  return {
    onboardingUrl: accountLink.url,
    stripeAccountId: account.id,
    bankAccountId: bankAccount._id,
  };
}
