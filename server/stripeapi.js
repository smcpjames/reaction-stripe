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
  amount: { type: Number },
  currency: {type: String},
  card: { type: cardSchema },
  capture: { type: Boolean }
});

captureDetailsSchema = new SimpleSchema({
  amount: { type: Number }
});

refundDetailsSchema = new SimpleSchema({
  charge: { type: String },
  amount: { type: Number },
  metadata: { type: String, optional: true },
  reason: { type: String }
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
    chargeObj: { type: chargeObjectSchema },
    apiKey: { type: String, optional: true }
  }).validator(),
  run({ chargeObj, apiKey }) {
    let stripe;
    if (!apiKey) {
      const dyanmicApiKey = StripeApi.methods.getApiKey.call();
      stripe = StripeSync(dyanmicApiKey);
    } else {
      stripe = StripeSync(apiKey);
    }
    let chargeResult = stripe.charges.create(chargeObj);
    return chargeResult;
  }
});

StripeApi.methods.captureCharge = new ValidatedMethod({
  name: "StripeApi.methods.captureCharge",
  validate: new SimpleSchema({
    transactionId: { type: String },
    captureDetails: { type: captureDetailsSchema },
    apiKey: { type: String, optional: true }
  }).validator(),
  run({ transactionId, captureDetails, apiKey })  {
    let stripe;
    if (!apiKey) {
      const dynamicApiKey = StripeApi.methods.getApiKey.call();
      stripe = StripeSync(dynamicApiKey);
    } else {
      stripe = StripeSync(apiKey);
    }
    let captureResults = stripe.charges.capture(transactionId, captureDetails);
    return captureResults;
  }
});

StripeApi.methods.createRefund = new ValidatedMethod({
  name: "StripeApi.methods.createRefund",
  validate: new SimpleSchema({
    refundDetails: { type: refundDetailsSchema },
    apiKey: { type: String, optional: true }
  }).validator(),
  run({ refundDetails, apiKey }) {
    let stripe;
    if (!apiKey) {
      const dynamicApiKey = StripeApi.methods.getApiKey.call();
      stripe = StripeSync(dynamicApiKey);
    } else {
      stripe = StripeSync(apiKey);
    }
    let refundResults = stripe.refunds.create({ charge: refundDetails.charge });
    return refundResults;
  }
});

StripeApi.methods.listRefunds = new ValidatedMethod({
  name: "StripeApi.methods.listRefunds",
  validate: new SimpleSchema({
    transactionId: { type: String },
    apiKey: { type: String, optional: true }
  }).validator(),
  run({ transactionId, apiKey }) {
    let stripe;
    if (!apiKey) {
      const dynamicApiKey = StripeApi.methods.getApiKey.call();
      stripe = StripeSync(dynamicApiKey);
    } else {
      stripe = StripeSync(apiKey);
    }
    let refundListResults = stripe.refunds.list({ charge: transactionId });
    return refundListResults;
  }
});
