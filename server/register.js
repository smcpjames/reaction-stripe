ReactionCore.registerPackage({
  label: "Stripe",
  name: 'reaction-stripe',
  icon: 'fa fa-cc-stripe',
  autoEnable: false,
  settings: {
    mode: false,
    api_key: ""
  },
  registry: [
    // Dashboard card
    {
      provides: 'dashboard',
      label: 'Stripe',
      description: "Stripe Payment for Reaction Commerce",
      icon: 'fa fa-cc-stripe',
      cycle: '3',
      container: 'dashboard'
    },

    // Settings panel
    {
      label: "Stripe Settings",
      i18nLabel: "app.stripeSettings",
      route: 'stripe',
      provides: 'settings',
      container: 'dashboard',
      template: 'stripeSettings',
    },

    // Payment form for checkout
    {
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
