export default class PaymentAdapter {
  async transfer({ amount, bankAccount, reference }) {
    throw new Error("transfer() not implemented");
  }
}
