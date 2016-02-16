StripeApi = {};
StripeApi.methods = {};


StripeApi.methods.getInstance = new ValidatedMethod({
  name: "StripeApi.methods.getInstance",
  validate: new SimpleSchema({
    apiKey: { type: String }
  }).validator(),
  run({ apikey }) {
    const dyanmicApiKey = Meteor.Stripe.accountOptions();
    let stripeInstance = Npm.require("stripe")(dyanmicApiKey);
    return stripeInstance;
  }
});

StripeApi.methods.createCharge = new ValidatedMethod({
  name: "StripeApi.methods.createCharge",
  validate: new SimpleSchema({
    chargeObj: { type: Object }
  }).validator(),
  run({ chargeObj }) {
    //
  }
});
