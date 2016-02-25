/* eslint camelcase: 0 */


describe("stripe/refund/create", function () {
  it("should call StripeApi.methods.createRefund with the proper parameters and return saved = true", function (done) {
    let paymentMethod = {
      processor: "Stripe",
      storedCard: "Visa 4242",
      method: "credit",
      transactionId: "ch_17hZ4wBXXkbZQs3xL5JhlSgS",
      amount: 19.99,
      status: "completed",
      mode: "capture",
      createdAt: new Date(),
      workflow: {status: "new"},
      metadata: {}
    };

    let stripeRefundResult = {
      id: "re_17hZzSBXXkbZQs3xgmmEeOci",
      object: "refund",
      amount: 1999,
      balance_transaction: "txn_17hZzSBXXkbZQs3xr6d9YECZ",
      charge: "ch_17hZ4wBXXkbZQs3xL5JhlSgS",
      created: 1456210186,
      currency: "usd",
      metadata: {},
      reason: null,
      receipt_number: null
    };

    spyOn(StripeApi.methods.createRefund, "call").and.returnValue(stripeRefundResult);

    let refundResult = null;
    let refundError = null;
    Meteor.call("stripe/refund/create", paymentMethod, paymentMethod.amount, function (error, result) {
      refundResult = result;
      refundError = error;
    });

    expect(refundError).toBe(undefined);
    expect(refundResult).not.toBe(undefined);
    expect(refundResult.saved).toBe(true);
    expect(StripeApi.methods.createRefund.call).toHaveBeenCalledWith({
      refundDetails: {
        charge: paymentMethod.transactionId,
        amount: 1999,
        reason: "requested_by_customer"
      }
    });
    done();
  });
});
