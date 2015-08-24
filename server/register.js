Router.map(function() {
  return this.route('stripe', {
    controller: ShopAdminController,
    path: 'dashboard/settings/stripe',
    template: 'stripe',
    waitOn: function() {
      return ReactionCore.Subscriptions.Packages;
    }
  });
});
