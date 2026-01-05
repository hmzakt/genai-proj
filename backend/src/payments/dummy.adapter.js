import PaymentAdapter from "./paymentAdapter.interface.js";

export default class DummyAdapter extends PaymentAdapter {
  async transfer({ amount, bankAccount, reference }) {
    // Simulating network delay
    await new Promise((r) => setTimeout(r, 300));

    return {
      success: true,
      transactionId: `DUMMY_TXN_${Date.now()}`,
      reference,
      raw: {
        amount,
        bankAccount,
      },
    };
  }
}
