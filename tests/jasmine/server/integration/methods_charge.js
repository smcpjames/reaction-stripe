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
  it("should return saved = false when card is declined", function () {
    let form = {
      cvv2: "345",
      expire_month: "4",
      expire_year: "2019",
      name: "Test User",
      number: "4000000000000002",
      type: "visa"
    };
    let total = "22.98";
    let currency = "EUR";

    let stripeDeclineResult =
      {
        result: null,
        error: {
          type: "StripeCardError",
          rawType: "card_error",
          code: "card_declined",
          param: undefined,
          message: "Your card was declined.",
          detail: undefined,
          raw: {
            message: "Your card was declined.",
            type: "card_error",
            code: "card_declined",
            charge: "ch_17hXeXBXXkbZQs3x3lpNoH9l",
            statusCode: 402,
            requestId: "req_7xSZItk9XdVUIJ"
          },
          requestId: "req_7xSZItk9XdVUIJ",
          statusCode: 402
        }
      };
    spyOn(StripeApi.methods.createCharge, "call").and.returnValue(stripeDeclineResult);

    let chargeResult = null;
    Meteor.Stripe.authorize(form, {total: total, currency: currency}, function (error, result) {
      chargeResult = result;
    });

    expect(chargeResult).not.toBe(undefined);
    expect(chargeResult.saved).toBe(false);
    expect(chargeResult.error).toBe("Your card was declined.");
    expect(StripeApi.methods.createCharge.call).toHaveBeenCalledWith({
      chargeObj: {
        amount: 2298,
        currency: "EUR",
        card: {
          number: "4000000000000002",
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
  it("should return saved = false when an expired card is returned", function () {
    // Note that this test number makes the Stripe API return this error, it is
    // not looking at the actual expiration date.
    let form = {
      cvv2: "345",
      expire_month: "4",
      expire_year: "2019",
      name: "Test User",
      number: "4000000000000069",
      type: "visa"
    };
    let total = "22.98";
    let currency = "USD";

    let stripeExpiredCardResult =
      {
        result: null,
        error: {
          type: "StripeCardError",
          rawType: "card_error",
          code: "expired_card",
          param: "exp_month",
          message: "Your card has expired.",
          raw: {
            message: "Your card has expired.",
            type: "card_error",
            param: "exp_month",
            code: "expired_card",
            charge: "ch_17iBsDBXXkbZQs3xfZArVPEd",
            statusCode: 402,
            requestId: "req_7y88CojR2UJYOd"
          },
          requestId: "req_7y88CojR2UJYOd",
          statusCode: 402
        }
      };
    spyOn(StripeApi.methods.createCharge, "call").and.returnValue(stripeExpiredCardResult);

    let chargeResult = null;
    Meteor.Stripe.authorize(form, {total: total, currency: currency}, function (error, result) {
      chargeResult = result;
    });

    expect(chargeResult).not.toBe(undefined);
    expect(chargeResult.saved).toBe(false);
    expect(chargeResult.error).toBe("Your card has expired.");
    expect(StripeApi.methods.createCharge.call).toHaveBeenCalledWith({
      chargeObj: {
        amount: 2298,
        currency: "USD",
        card: {
          number: "4000000000000069",
          name: "Test User",
          cvc: "345",
          exp_month: "4",
          exp_year: "2019"
        }, capture: false
      }
    });
  });
});

