Package.describe({
  summary: "Reaction Stripe - Stripe payments for Reaction Commerce",
  name: "reactioncommerce:reaction-stripe",
  version: "1.4.0",
  git: "https://github.com/reactioncommerce/reaction-stripe.git"
});

Npm.depends({'stripe': '3.6.0'});

Package.onUse(function (api, where) {
  api.versionsFrom('METEOR@1.0');
  api.use("meteor-platform");
  api.use("coffeescript");
  api.use("less");
  api.use("reactioncommerce:core@0.6.1");

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
