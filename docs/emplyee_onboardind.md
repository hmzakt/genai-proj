Employee onboarding flow:

Admin adds employee

System creates Stripe Connected Account

Employee completes Stripe-hosted KYC

Stripe returns acct_xxx

Save it in BankAccount

Create Connected Account
const account = await stripe.accounts.create({
  type: "custom",
  country: "IN",
  email: employee.email,
  capabilities: {
    transfers: { requested: true },
  },
});