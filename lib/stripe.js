/* eslint camelcase: 0 */

Meteor.Stripe = {
  authorize: function (cardInfo, paymentInfo, callback) {
    Meteor.call("stripeSubmit", "authorize", cardInfo, paymentInfo, callback);
  }
};
