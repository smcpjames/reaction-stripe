/* eslint camelcase: 0 */


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

parseCardData = function (data) {
  let parsedCardData = {
    number: data.number,
    name: data.name,
    cvc: data.cvv2,
    exp_month: data.expire_month,
    exp_year: data.expire_year
  };
  return parsedCardData;
};

// Stripe uses a "Decimal-less" format so 10.00 becomes 1000
formatForStripe = function (amount) {
  return Math.round(amount * 100);
};


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

    let chargeObj = {
      amount: "",
      currency: "",
      card: {},
      capture: true
    };

    if (transactionType === "authorize") {
      chargeObj.capture = false;
    }
    chargeObj.card = parseCardData(cardData);
    chargeObj.amount = formatForStripe(paymentData.total);
    chargeObj.currency = paymentData.currency;
    let result;
    let chargeResult;

    try {
      chargeResult = StripeApi.methods.createCharge.call({chargeObj: chargeObj});
      ReactionCore.Log.info(chargeResult);
      if (chargeResult.status === "succeeded") {
        result = {
          saved: true,
          response: chargeResult
        };
      } else {
        ReactionCore.Log.info("Stripe Call succeeded but charge failed");
        result = {
          saved: false,
          error: chargeResult.error.message
        };
      }
      return result;
    } catch (e) {
      ReactionCore.Log.warn(e);
      throw new Meteor.Error("error", e.message);
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
      amount: formatForStripe(paymentMethod.amount)
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
    } catch (error) {
      ReactionCore.Log.warn(error);
      result = {
        saved: false,
        error: error
      };
      return {error: error, result: result};
    }
    return result;
  },

  "stripe/refund/create": function (paymentMethod, amount) {
    check(paymentMethod, ReactionCore.Schemas.PaymentMethod);
    check(amount, Number);
    console.log("paymentMethod: " + JSON.stringify(paymentMethod, null, 4));
    console.log("amount: " + amount);
    let refundDetails = {
      charge: paymentMethod.transactionId,
      amount: formatForStripe(amount),
      reason: "requested_by_customer"
    };
    let result;
    try {
      let refundResult = StripeApi.methods.createRefund.call({refundDetails: refundDetails});
      console.log("refund results: " + JSON.stringify(refundResult, null, 4));
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
    } catch (error) {
      ReactionCore.Log.warn(error);
      result = {
        saved: false,
        error: error.message
      };
      return {error: error, result: result}
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
    let result;
    try {
      let refunds = StripeApi.methods.listRefunds.call({transactionId: paymentMethod.transactionId});
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
    } catch (error) {
      ReactionCore.Log.warn(error);
      result = {
        error: error
      };
    }
    return result;
  }
});
