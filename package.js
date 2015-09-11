Package.describe({
  summary: "Reaction Stripe - Stripe payments for Reaction Commerce",
  name: "reactioncommerce:reaction-stripe",
  version: "2.0.0",
  git: "https://github.com/reactioncommerce/reaction-stripe.git"
});

Npm.depends({'stripe': '3.7.1'});

Package.onUse(function (api, where) {
  api.versionsFrom('METEOR@1.1.0.2');
  api.use("meteor-platform");
  api.use("less");
  api.use("reactioncommerce:core@0.7.0");

  api.addFiles("server/register.js",["server"]); // register as a reaction package
  api.addFiles("server/stripe.js",["server"]);

  api.addFiles([
    "common/collections.js",
    "common/routing.js",
    "lib/stripe.js"
    ],["client","server"]);

  api.addFiles([
    "client/templates/stripe.html",
    "client/templates/stripe.less",
    "client/templates/stripe.js",
    "client/templates/cart/checkout/payment/methods/stripe/stripe.html",
    "client/templates/cart/checkout/payment/methods/stripe/stripe.less",
    "client/templates/cart/checkout/payment/methods/stripe/stripe.js"
    ],
    ["client"]);
});
