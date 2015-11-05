 var Fiber, Future, ValidCVV, ValidCardNumber, ValidExpireMonth, ValidExpireYear;

Fiber = Npm.require("fibers");

Future = Npm.require("fibers/future");

Meteor.methods({
  stripeSubmit: function (transactionType, cardData, paymentData) {
    var Stripe, chargeObj, fut;
    check(transactionType, String);
    check(cardData, {
      name: String,
      number: ValidCardNumber,
      expire_month: ValidExpireMonth,
      expire_year: ValidExpireYear,
      cvv2: ValidCVV,
      type: String
    });
    check(paymentData, {
      total: String,
      currency: String
    });
    Stripe = Npm.require("stripe")(Meteor.Stripe.accountOptions());
    chargeObj = Meteor.Stripe.chargeObj();
    if (transactionType === "authorize") {
      chargeObj.capture = false;
    }
    chargeObj.card = Meteor.Stripe.parseCardData(cardData);
    chargeObj.amount = Math.round(paymentData.total * 100);
    chargeObj.currency = paymentData.currency;
    fut = new Future();
    this.unblock();
    Stripe.charges.create(chargeObj, Meteor.bindEnvironment(function (
      error, result) {
      if (error) {
        fut["return"]({
          saved: false,
          error: error
        });
      } else {
        fut["return"]({
          saved: true,
          response: result
        });
      }
    }, function (e) {
      ReactionCore.Log.warn(e);
    }));
    return fut.wait();
  },
  stripeCapture: function(transactionId, captureDetails) {
    check(transactionId, String);
    check(captureDetails, Object);

    var Stripe, fut;
    Stripe = Npm.require("stripe")(Meteor.Stripe.accountOptions());
    fut = new Future();
    this.unblock();
    Stripe.charges.capture(transactionId, captureDetails, Meteor.bindEnvironment(
      function (error, result) {
        if (error) {
          fut["return"]({
            saved: false,
            error: error
          });
        } else {
          fut["return"]({
            saved: true,
            response: result
          });
        }
      },
      function (e) {
        ReactionCore.Log.warn(e);
      }));
    return fut.wait();
  },
  stripeRefund: function(refundDetails) {
    check(refundDetails, Object);

    var Stripe, fut;
    Stripe = Npm.require("stripe")(Meteor.Stripe.accountOptions());
    fut = new Future();
    this.unblock();
    Stripe.refunds.create(refundDetails, Meteor.bindEnvironment(
      function (error, result) {
        if (error) {
          fut["return"]({
            saved: false,
            error: error
          });
        } else {
          fut["return"]({
            saved: true,
            type: result.object,
            amount: result.amount / 100,
            rawTransaction: result
          });
        }
      },
      function (e) {
        ReactionCore.Log.warn(e);
      }));
    return fut.wait();
  },

  /**
   * List refunds
   * @param  {String} transactionId A transaction id to use as a filter
   * @return {Future} future
   */
  "stripe/refunds/list": function (transactionId) {
    check(transactionId, String);
    this.unblock();

    let stripe = Npm.require("stripe")(Meteor.Stripe.accountOptions());
    let listRefunds = Meteor.wrapAsync(stripe.refunds.list, stripe.refunds);
    let result;

    try {
      let refunds = listRefunds({charge: transactionId});
      result = [];
      for (let refund of refunds.data) {
        result.push({
          type: refund.object,
          amount: refund.amount / 100,
          created: refund.created * 1000,
          currency: refund.currency,
          raw: refund
        });
      }
    } catch (e) {
      result = {
        error: e
      };
    }

    return result;
  }
});

ValidCardNumber = Match.Where(function (x) {
  return /^[0-9]{14,16}$/.test(x);
});

ValidExpireMonth = Match.Where(function (x) {
  return /^[0-9]{1,2}$/.test(x);
});

ValidExpireYear = Match.Where(function (x) {
  return /^[0-9]{4}$/.test(x);
});

ValidCVV = Match.Where(function (x) {
  return /^[0-9]{3,4}$/.test(x);
});
