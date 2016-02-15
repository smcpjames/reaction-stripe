class StripeApi {
  constructor(apiKey = null) {
    let stripeInstance;
    if (apiKey !== null) {
      stripeInstance = Npm.require("stripe")(apiKey);
    } else {
      const dynamicApiKey = Meteor.Stripe.accountOptions();
      stripeInstance = Npm.require("stripe")(dynamicApiKey);
    }
    return stripeInstance;
  }
}
