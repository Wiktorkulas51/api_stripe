const express = require("express");
const router = express.Router();
const { customers, apiKeys } = require("../customers");

router.get("/", async (req, res) => {
  const { hashAPIKey } = require("../apiGen");
  const { apiKey } = req.query;
  console.log(apiKey);

  if (!apiKey) {
    res.sendStatus(400); // bad request
  }

  const hashedAPIKey = hashAPIKey(apiKey);
  console.log(hashedAPIKey);
  const customerId = apiKeys[hashedAPIKey];
  const customer = customers[customerId];
  console.log(customerId, customers);

  if (!customer || !customer.active) {
    res.sendStatus(403); // not authorized
  } else {
    // Record usage with Stripe Billing
    const record = await stripe.subscriptionItems.createUsageRecord(
      customer.itemId,
      {
        quantity: 1,
        timestamp: "now",
        action: "increment",
      }
    );
    res.send({ data: "🔥🔥🔥🔥🔥🔥🔥🔥", usage: record });
  }
});

// POST http://localhost:3030/checkout
// Create a Stripe Checkout Session to create a customer and subscribe them to a plan
router.post("/", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: "price_1JruCCG0BKaAS1EwHfuiLIcM",
        quantity: 1,
      },
    ],
    success_url:
      "http://localhost:5000/dashboard?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "http://localhost:5000/error",
  });
  res.send(session);
});

//   webhook

module.exports = router;
