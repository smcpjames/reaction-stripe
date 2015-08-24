ReactionCore.registerPackage({
  name: 'reaction-stripe',
  autoEnable: false,
  settings: {
    mode: false,
    api_key: ""
  },
  registry: [
    {
      provides: 'dashboard',
      label: 'Stripe',
      description: "Stripe Payment for Reaction Commerce",
      icon: 'fa fa-cc-stripe',
      cycle: '3',
      container: 'dashboard'
    }, {
      route: 'stripe',
      provides: 'settings',
      container: 'dashboard'
    }, {
      template: 'stripePaymentForm',
      provides: 'paymentMethod'
    }
  ],
  permissions: [
    {
      label: "Stripe",
      permission: "dashboard/payments",
      group: "Shop Settings"
    }
  ]
});
