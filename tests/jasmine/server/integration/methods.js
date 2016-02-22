/* eslint camelcase: 0 */


let stripeChargeResult = {
  id: "ch_17hA8DBXXkbZQs3xENUmN9bZ",
  object: "charge",
  amount: 2298,
  amount_refunded: 0,
  captured: false,
  created: 1456110785,
  currency: "usd",
  refunded: false,
  shipping: null,
  source: {
    id: "card_17hA8DBXXkbZQs3xclGesDrp",
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
    name: "Test User",
    tokenization_method: null
  },
  statement_descriptor: null,
  status: "succeeded"
};


describe("Meteor.Stripe.authorize", function () {
  it("should call StripeApi.methods.createCharge with the proper parameters and return saved = true", function (done) {
    let form = {
      cvv2: "345",
      expire_month: "4",
      expire_year: "2019",
      name: "Test User",
      number: "4242424242424242",
      type: "visa"
    };
    let total = "22.98";
    let currency = "USD";

    spyOn(StripeApi.methods.createCharge, "call").and.returnValue(stripeChargeResult);

    let chargeResult = null;
    Meteor.Stripe.authorize(form, {total: total, currency: currency}, function (error, result) {
      chargeResult = result;
    });

    expect(chargeResult).not.toBe(undefined);
    expect(chargeResult.saved).toBe(true);
    done();
  });
});

describe("Meteor.Stripe.authorize", function () {
  it("should properly charge a card when using a currency besides USD", function () {
    let form = {
      cvv2: "345",
      expire_month: "4",
      expire_year: "2019",
      name: "Test User",
      number: "4242424242424242",
      type: "visa"
    };
    let total = "22.98";
    let currency = "EUR";

    spyOn(StripeApi.methods.createCharge, "call").and.returnValue(stripeChargeResult);

    let chargeResult = null;
    Meteor.Stripe.authorize(form, {total: total, currency: currency}, function (error, result) {
      chargeResult = result;
    });

    expect(chargeResult).not.toBe(undefined);
    expect(chargeResult.saved).toBe(true);
    expect(StripeApi.methods.createCharge.call).toHaveBeenCalledWith({
      chargeObj: {
        amount: 2298,
        currency: "EUR",
        card: {
          number: "4242424242424242",
          name: "Test User",
          cvc: "345",
          exp_month: "4",
          exp_year: "2019"
        }, capture: false
      }
    });
  });
});

describe("Meteor.Stripe.authorize", function () {
  it("should properly charge a card when using a currency besides USD", function () {
    let form = {
      cvv2: "345",
      expire_month: "4",
      expire_year: "2019",
      name: "Test User",
      number: "4242424242424242",
      type: "visa"
    };
    let total = "22.98";
    let currency = "EUR";

    spyOn(StripeApi.methods.createCharge, "call").and.returnValue(stripeChargeResult);

    let chargeResult = null;
    Meteor.Stripe.authorize(form, {total: total, currency: currency}, function (error, result) {
      chargeResult = result;
    });

    expect(chargeResult).not.toBe(undefined);
    expect(chargeResult.saved).toBe(true);
    expect(StripeApi.methods.createCharge.call).toHaveBeenCalledWith({
      chargeObj: {
        amount: 2298,
        currency: "EUR",
        card: {
          number: "4242424242424242",
          name: "Test User",
          cvc: "345",
          exp_month: "4",
          exp_year: "2019"
        }, capture: false
      }
    });
  });
});

