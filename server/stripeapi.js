/* eslint camelcase: 0 */

StripeApi = {};
StripeApi.methods = {};


cardSchema = new SimpleSchema({
  number: { type: String },
  name: { type: String },
  cvc: { type: String },
  exp_month: { type: String },
  exp_year: { type: String }
});

chargeObjectSchema = new SimpleSchema({
  amount: {type: Number},
  currency: {type: String},
  card: { type: cardSchema },
  capture: { type: Boolean }
});

StripeApi.methods.getApiKey = new ValidatedMethod({
  name: "StripeApi.methods.getApiKey",
  validate: null,
  run() {
    const settings = ReactionCore.Collections.Packages.findOne({name: "reaction-stripe"}).settings;
    if (!settings.api_key) {
      throw new Meteor.Error("403", "Invalid Stripe Credentials");
    }
    return settings.api_key;
  }
});


StripeApi.methods.createCharge = new ValidatedMethod({
  name: "StripeApi.methods.createCharge",
  validate: new SimpleSchema({
    chargeObj: { type: chargeObjectSchema }
  }).validator(),
  run({ chargeObj }) {
    const dyanmicApiKey = StripeApi.methods.getApiKey.call();
    const stripe = StripeSync(dyanmicApiKey);
    let chargeResult = stripe.charges.create(chargeObj);
    return chargeResult;
  }
});
