/* eslint camelcase: 0 */

Meteor.Stripe = {
  authorize: function (cardInfo, paymentInfo, callback) {
    Meteor.call("stripeSubmit", "authorize", cardInfo, paymentInfo,
      callback);
  },
  capture: function (transactionId, amount, callback) {
    // TODO: This may need to be somewhere more apparant
    // Amount must be an integer for stripe ($19.99 => 1999)
    let captureDetails = {
      amount: Math.round(amount * 100)
    };
    Meteor.call("stripeCapture", transactionId, captureDetails, callback);
  },
  refund: function (transactionId, amount, callback) {
    let refundDetails = {
      charge: transactionId,
      amount: Math.round(amount * 100),
      reason: "requested_by_customer"
    };
    Meteor.call("stripeRefund", refundDetails, callback);
  },
  refunds: (transactionId, callback) => {
    Meteor.call("stripe/refunds/list", transactionId, callback);
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
