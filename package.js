Package.describe({
  summary: "Reaction Stripe - Stripe payments for Reaction Commerce",
  name: "reactioncommerce:reaction-stripe",
  version: "2.1.1",
  git: "https://github.com/reactioncommerce/reaction-stripe.git"
});

Npm.depends({'stripe': '3.7.1'});

Package.onUse(function (api, where) {
  api.versionsFrom('METEOR@1.2');

  // meteor base packages
  api.use("standard-minifiers");
  api.use("mobile-experience");
  api.use("meteor-base");
  api.use("mongo");
  api.use("blaze-html-templates");
  api.use("session");
  api.use("jquery");
  api.use("tracker");
  api.use("logging");
  api.use("reload");
  api.use("random");
  api.use("ejson");
  api.use("spacebars");
  api.use("check");

  // meteor add-on packages

  api.use("less");
  api.use("reactioncommerce:core@0.8.0");

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
