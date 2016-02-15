describe("StripeAPI getInstance function", function () {
  it("should return a credentialed instance of the Stripe API", function (done) {
    let stripeInstance = StripeApi.methods.getInstance();

    expect(stripeInstance).not.toBe(undefined);
    done();
  });

});
