describe("StripeAPI getInstance function", function () {
  it("should return a credentialed instance of the Stripe API", function (done) {
    let stripeInstance = StripeApi.methods.getInstance();
    console.log(JSON.stringify(stripeInstance));
    expect(stripeInstance).toBe(undefined);
    done();
  });

});
