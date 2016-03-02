Package.describe({
  summary: "Reaction Stripe - Stripe payments for Reaction Commerce",
  name: "reactioncommerce:reaction-stripe",
  version: "3.1.2",
  git: "https://github.com/reactioncommerce/reaction-stripe.git"
});

Npm.depends({
  stripe: "4.4.0"
});

Package.onUse(function (api) {
  api.versionsFrom("METEOR@1.2");

  // meteor base packages
  api.use("meteor-base");
  api.use("mongo");
  api.use("ecmascript");
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
  api.use("promise");


  api.use("reactioncommerce:core@0.12.0");

  api.use("mdg:validated-method@1.0.1");

  api.imply("mdg:validated-method@1.0.1");

  api.addFiles("server/register.js", ["server"]); // register as a reaction package
  api.addFiles("server/stripe.js", ["server"]);
  api.addFiles("server/stripeapi.js", ["server"]);
  api.addFiles([
    "common/collections.js",
    "lib/stripe.js"
  ], ["client", "server"]);

  api.addFiles([
    "client/templates/stripe.html",
    "client/templates/stripe.js",
    "client/templates/cart/checkout/payment/methods/stripe/stripe.html",
    "client/templates/cart/checkout/payment/methods/stripe/stripe.less",
    "client/templates/cart/checkout/payment/methods/stripe/stripe.js"
  ], ["client"]);

  api.export("StripeApi", "server");
});

Package.onTest(function (api) {
  api.use("underscore");
  api.use("random");
  api.use("sanjo:jasmine@0.21.0");
  api.use("velocity:html-reporter@0.9.1");
  api.use("velocity:console-reporter@0.1.4");

  api.use("accounts-base");
  api.use("accounts-password");

  // reaction core
  api.use("reactioncommerce:reaction-collections");
  api.use("reactioncommerce:reaction-factories");
  api.use("reactioncommerce:core");
  api.use("reactioncommerce:reaction-stripe");


  // server integration tests
  api.addFiles("tests/jasmine/server/integration/methods_charge.js", "server");
  api.addFiles("tests/jasmine/server/integration/methods_capture.js", "server");
  api.addFiles("tests/jasmine/server/integration/methods_refund.js", "server");
  api.addFiles("tests/jasmine/server/integration/methods_refundlist.js", "server");
  api.addFiles("tests/jasmine/server/integration/stripeapi.js", "server");
});

