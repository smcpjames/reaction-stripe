/* eslint camelcase: 0 */

let stripeCaptureResult = {
  id: "ch_17hZ4wBXXkbZQs3xL5JhlSgS",
  object: "charge",
  amount: 1999,
  amount_refunded: 0,
  application_fee: null,
  balance_transaction: "txn_17hZ6OBXXkbZQs3xvtVtXtQ3",
  captured: true,
  created: 1456206682,
  currency: "usd",
  customer: null,
  description: null,
  destination: null,
  dispute: null,
  failure_code: null,
  failure_message: null,
  fraud_details: {},
  invoice: null,
  livemode: false,
  metadata: {},
  order: null,
  paid: true,
  receipt_email: null,
  receipt_number: null,
  refunded: false,
  refunds: {
    object: "list",
    data: [],
    has_more: false,
    total_count: 0,
    url: "/v1/charges/ch_17hZ4wBXXkbZQs3xL5JhlSgS/refunds"
  },
  shipping: null,
  source: {
    id: "card_17hZ4wBXXkbZQs3xRVgvZONw",
    object: "card",
    address_city: null,
    address_country: null,
    address_line1: null,
    address_line1_check: null,
    address_line2: null,
    address_state: null,
    address_zip: null,
    address_zip_check: null,
    brand: "Visa",
    country: "US",
    customer: null,
    cvc_check: "pass",
    dynamic_last4: null,
    exp_month: 3,
    exp_year: 2019,
    fingerprint: "sMf9T3BK8Si2Nqme",
    funding: "credit",
    last4: "4242",
    metadata: {},
    name: "Brent Hoover",
    tokenization_method: null
  },
  statement_descriptor: null,
  status: "succeeded"
};

describe("stripe/payment/capture", function () {
  it("should call StripeApi.methods.captureCharge with the proper parameters and return saved = true", function (done) {
    let paymentMethod = {
      processor: "Stripe",
      storedCard: "Visa 4242",
      method: "credit",
      transactionId: "ch_17hZ4wBXXkbZQs3xL5JhlSgS",
      amount: 19.99,
      status: "approved",
      mode: "capture",
      createdAt: new Date()
    };

    spyOn(StripeApi.methods.captureCharge, "call").and.returnValue(stripeCaptureResult);

    let captureResult = null;
    let captureError = null;
    Meteor.call("stripe/payment/capture", paymentMethod, function (error, result) {
      captureResult = result;
      captureError = error;
    });

    expect(captureError).toBe(undefined);
    expect(captureResult).not.toBe(undefined);
    expect(captureResult.saved).toBe(true);
    expect(StripeApi.methods.captureCharge.call).toHaveBeenCalledWith({
      transactionId: paymentMethod.transactionId,
      captureDetails: {
        amount: 1999
      }
    });
    done();
  });
});

describe("stripe/payment/capture", function () {
  it("should should return a match error if transactionId is not available", function (done) {
    let paymentMethod = {
      processor: "Stripe",
      storedCard: "Visa 4242",
      method: "credit",
      amount: 19.99,
      status: "approved",
      mode: "capture",
      createdAt: new Date()
    };

    spyOn(StripeApi.methods.captureCharge, "call").and.returnValue(stripeCaptureResult);

    let captureResult = null;
    let captureError = null;
    Meteor.call("stripe/payment/capture", paymentMethod, function (error, result) {
      captureResult = result;
      captureError = error;
    });

    expect(captureError.message).toBe("Match error: Match error: Transaction id is required");
    expect(captureResult).toBe(undefined);
    done();
  });
});

