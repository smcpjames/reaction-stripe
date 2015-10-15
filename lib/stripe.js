Meteor.Stripe = {
  accountOptions: function () {
    const settings = ReactionCore.Collections.Packages.findOne({
      name: "reaction-stripe"
    }).settings;
    if (!settings.api_key) {
      throw new Meteor.Error(403, "Invalid Stripe Credentials");
    }
    return settings.api_key;
  },
  authorize: function (cardInfo, paymentInfo, callback) {
    Meteor.call("stripeSubmit", "authorize", cardInfo, paymentInfo,
      callback);
  },
  capture: function (transactionId, amount, callback) {
    const captureDetails = {
      amount: amount
    };
    Meteor.call("stripeCapture", transactionId, captureDetails, callback);
  },
  config: function (options) {
    this.accountOptions = options;
  },
  chargeObj: function () {
    return {
      amount: "",
      currency: "",
      card: {},
      capture: true
    };
  },
  parseCardData: function (data) {
    return {
      number: data.number,
      name: data.name,
      cvc: data.cvv2,
      exp_month: data.expire_month,
      exp_year: data.expire_year
    };
  }
};
