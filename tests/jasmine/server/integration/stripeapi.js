/* eslint camelcase: 0 */

xdescribe("StripeAPI createCharge function", function () {
  it("should return a result with status = success", function (done) {
    let apiKey = "";
    let cardObject = {
      number: "4242424242424242",
      name: "Test User",
      cvc: "345",
      exp_month: "02",
      exp_year: "2019"
    };
    let chargeObject = {
      amount: 1999,
      currency: "USD",
      card: cardObject,
      capture: false
    };

    StripeApi.methods.createCharge.validate({
      chargeObj: chargeObject,
      apiKey: apiKey
    });

    let result = StripeApi.methods.createCharge.run({ chargeObj: chargeObject, apiKey: apiKey });
    expect(result.status).toBe("succeeded");
    done();
  });
});

xdescribe("StripeAPI captureCharge function", function () {
  it("should return a result with status = success", function (done) {
    let apiKey = "";
    let cardObject = {
      number: "4242424242424242",
      name: "Test User",
      cvc: "345",
      exp_month: "02",
      exp_year: "2019"
    };
    let chargeObject = {
      amount: 1999,
      currency: "USD",
      card: cardObject,
      capture: false
    };
    const chargeResult = StripeApi.methods.createCharge.run({ chargeObj: chargeObject, apiKey: apiKey });
    const transactionId = chargeResult.id;
    const captureDetails = {
      amount: 1999
    };
    let result = StripeApi.methods.captureCharge.call({
      transactionId: transactionId,
      captureDetails: captureDetails,
      apiKey: apiKey
    });
    expect(result.status).toBe("succeeded");
    done();
  });
});
