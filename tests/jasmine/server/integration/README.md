The tests in the `stripeapi.js` file require a Stripe API key to run, so they
are disabled by default. If you need to make changes to these methods and have
an API key you can reenable them by just changing `xdescribe` to `describe`.

The `stripeapi` wrapper was written so that other tests could be written
without making actual calls the Stripe API.
