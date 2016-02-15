/* eslint camelcase: 0 */

const Fiber = Npm.require("fibers");
const Future = Npm.require("fibers/future");
// const Stripe = Npm.require("stripe")(Meteor.Stripe.accountOptions());

const ValidCardNumber = Match.Where(function (x) {
  return /^[0-9]{14,16}$/.test(x);
});

const ValidExpireMonth = Match.Where(function (x) {
  return /^[0-9]{1,2}$/.test(x);
});

const ValidExpireYear = Match.Where(function (x) {
  return /^[0-9]{4}$/.test(x);
});

const ValidCVV = Match.Where(function (x) {
  return /^[0-9]{3,4}$/.test(x);
});


Meteor.methods({
  "stripeSubmit": function (transactionType, cardData, paymentData) {
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
    let chargeObj = Meteor.Stripe.chargeObj();
    if (transactionType === "authorize") {
      chargeObj.capture = false;
    }
    chargeObj.card = Meteor.Stripe.parseCardData(cardData);
    chargeObj.amount = Math.round(paymentData.total * 100);
    chargeObj.currency = paymentData.currency;
    let fut = new Future();
    this.unblock();
    let stripe = StripeApi.methods.getInstance.run();
    stripe.charges.create(chargeObj, Meteor.bindEnvironment(function (
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

  /**
   * Capture a Stripe charge
   * @see https://stripe.com/docs/api#capture_charge
   * @param  {Object} paymentMethod A PaymentMethod object
   * @return {Object} results from Stripe normalized
   */
  "stripe/payment/capture": function (paymentMethod) {
    check(paymentMethod, ReactionCore.Schemas.PaymentMethod);
    this.unblock();

    let result;
    const stripe = Npm.require("stripe")(Meteor.Stripe.accountOptions());
    const capturePayment = Meteor.wrapAsync(stripe.charges.capture, stripe.charges);
    const captureDetails = {
      amount: Math.round(paymentMethod.amount * 100)
    };

    try {
      const response = capturePayment(paymentMethod.transactionId, captureDetails);
      result = {
        saved: true,
        response: response
      };
    } catch (e) {
      ReactionCore.Log.warn(e);
      result = {
        saved: false,
        error: e
      };
    }

    return result;
  },

  "stripe/refund/create": function(paymentMethod, amount) {
    check(paymentMethod, ReactionCore.Schemas.PaymentMethod);
    check(amount, Number);


    let refundDetails = {
      charge: paymentMethod.transactionId,
      amount: Math.round(amount * 100),
      reason: "requested_by_customer"
    };

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
   * @param  {Object} paymentMethod object
   * @return {Object} result
   */
  "stripe/refund/list": function (paymentMethod) {
    check(paymentMethod, ReactionCore.Schemas.PaymentMethod);
    this.unblock();

    let stripe = Npm.require("stripe")(Meteor.Stripe.accountOptions());
    let listRefunds = Meteor.wrapAsync(stripe.refunds.list, stripe.refunds);
    let result;

    try {
      let refunds = listRefunds({charge: paymentMethod.transactionId});
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

