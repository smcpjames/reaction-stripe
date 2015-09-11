Template.stripeSettings.helpers({
  packageData: function() {
    return ReactionCore.Collections.Packages.findOne({
      name: "reaction-stripe"
    });
  }
});

Template.stripe.helpers({
  packageData: function() {
    return ReactionCore.Collections.Packages.findOne({
      name: "reaction-stripe"
    });
  }
});

AutoForm.hooks({
  "stripe-update-form": {
    onSuccess: function(operation, result, template) {
      Alerts.removeSeen();
      return Alerts.add("Stripe settings saved.", "success");
    },
    onError: function(operation, error, template) {
      Alerts.removeSeen();
      return Alerts.add("Stripe settings update failed. " + error, "danger");
    }
  }
});
