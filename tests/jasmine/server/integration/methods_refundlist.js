/* eslint camelcase: 0 */


describe("stripe/refunds/list", function () {
  it("should call StripeApi.methods.listRefunds with the proper parameters and return a properly" +
    "formatted list of refunds", function (done) {
    let paymentMethod = {
      processor: "Stripe",
      storedCard: "Visa 4242",
      method: "credit",
      transactionId: "ch_17iCSlBXXkbZQs3xUpRw24mL",
      amount: 19.99,
      status: "completed",
      mode: "capture",
      createdAt: new Date(),
      workflow: {
        status: "new"
      },
      metadata: {}
    };

    let stripeRefundListResult = {
      object: "list",
      data: [
        {
          id: "re_17iCTeBXXkbZQs3xYZ3iJyB6",
          object: "refund",
          amount: 1999,
          balance_transaction: "txn_17iCTeBXXkbZQs3xl9FKE5an",
          charge: "ch_17iCSlBXXkbZQs3xUpRw24mL",
          created: 1456358130,
          currency: "usd",
          metadata: {},
          reason: null,
          receipt_number: null
        }
      ],
      has_more: false,
      url: "/v1/refunds"
    };

    spyOn(StripeApi.methods.listRefunds, "call").and.returnValue(stripeRefundListResult);

    let refundListResult = null;
    let refundListError = null;
    Meteor.call("stripe/refund/list", paymentMethod, function (error, result) {
      refundListResult = result;
      refundListError = error;
    });

    expect(refundListError).toBeUndefined();
    expect(refundListResult).toBeDefined();
    expect(refundListResult.length).toBe(1);
    expect(refundListResult[0].type).toBe("refund");
    expect(refundListResult[0].amount).toBe(19.99);
    expect(refundListResult[0].currency).toBe("usd");

    expect(StripeApi.methods.listRefunds.call).toHaveBeenCalledWith({
      transactionId: paymentMethod.transactionId
    });
    done();
  });
});
