Router.map(function() {
  return this.route("dashboard/stripe", {
    controller: ShopAdminController,
    path: "dashboard/stripe",
    template: "stripe",
    waitOn: function() {
      return ReactionCore.Subscriptions.Packages;
    }
  });
});
