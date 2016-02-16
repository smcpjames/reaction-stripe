/* eslint camelcase: 0 */

const Fiber = Npm.require("fibers");
const Future = Npm.require("fibers/future");

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
    let result;
    let chargeResult;
    try {
      chargeResult = StripeApi.methods.createCharge.call({chargeObj: chargeObj});
      if (chargeResult.status === "succeeded") {
        result = {
          saved: true,
          response: chargeResult
        };
      } else {
        result = {
          saved: false,
          response: chargeResult
        };
      }
      return result;
    }
    catch (error) {
      ReactionCore.Log.warn(error);
    }
  },

  /**
   * Capture a Stripe charge
   * @see https://stripe.com/docs/api#capture_charge
   * @param  {Object} paymentMethod A PaymentMethod object
   * @return {Object} results from Stripe normalized
   */
  "stripe/payment/capture": function (paymentMethod) {
    check(paymentMethod, ReactionCore.Schemas.PaymentMethod);
    let result;
    let captureResult;
    const captureDetails = {
      amount: Math.round(paymentMethod.amount * 100)
    };

    try {
      captureResult = StripeApi.methods.captureCharge.call({
        transactionId: paymentMethod.transactionId,
        captureDetails: captureDetails
      });
      if (captureResult.status === "succeeded") {
        result = {
          saved: true,
          response: captureResult
        };
      } else {
        result = {
          saved: false,
          response: captureResult
        };
      }
    } catch (e) {
      ReactionCore.Log.warn(e);
      result = {
        saved: false,
        error: e
      };
    }
    return result;
  },

  "stripe/refund/create": function (paymentMethod, amount) {
    check(paymentMethod, ReactionCore.Schemas.PaymentMethod);
    check(amount, Number);
    let refundDetails = {
      charge: paymentMethod.transactionId,
      amount: Math.round(amount * 100),
      reason: "requested_by_customer"
    };
    let result;
    let refundResult = StripeApi.methods.createRefund.call({ refundDetails: refundDetails });
    if (refundResult.object === "refund") {
      result = {
        saved: true,
        response: refundResult
      };
    } else {
      result = {
        saved: false,
        response: refundResult
      };
    }
    return result;
  },

  /**
   * List refunds
   * @param  {Object} paymentMethod object
   * @return {Object} result
   */
  "stripe/refund/list": function (paymentMethod) {
    check(paymentMethod, ReactionCore.Schemas.PaymentMethod);
    this.unblock();

    let stripe = StripeApi.methods.getInstance.run();
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

