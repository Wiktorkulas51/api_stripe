const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);

const body_parser = require("body-parser");
//webhook
router.post(
  "/",
  body_parser.raw({ type: "application/json" }),
  async (req, res) => {
    let data;
    let eventType;
    // Check if webhook signing is configured.
    const webhookSecret = process.env.WEBHOOKSECKRET;

    if (webhookSecret) {
      // Retrieve the event by verifying the signature using the raw body and secret.
      let event;
      let signature = req.headers["stripe-signature"];

      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          webhookSecret
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed. ${err}`);
        return res.sendStatus(400);
      }
      // Extract the object from the event.
      data = event.data;
      // console.log(data, "asd");

      eventType = event.type;
    } else {
      // Webhook signing is recommended, but if the secret is not configured in `config.js`,
      // retrieve the event data directly from the request body.
      data = req.body.data;
      eventType = req.body.type;
    }

    switch (eventType) {
      case "checkout.session.completed":
        const { hashAPIKey, generateAPIKey } = require("../apiGen");
        const { customers, apiKeys } = require("../customers");
        // Data included in the event object:
        const customerId = data.object.customer;
        const subscriptionId = data.object.subscription;

        console.log(
          `💰 Customer ${customerId} subscribed to plan ${subscriptionId}`
        );

        // Get the subscription. The first item is the plan the user subscribed to.
        const subscription = await stripe.subscriptions.retrieve(
          subscriptionId
        );
        const itemId = subscription.items.data[0].id;

        // Generate API key
        const { apiKey, hashedAPIKey } = generateAPIKey();
        console.log(`User's API Key: ${apiKey}`);
        console.log(`Hashed API Key: ${hashedAPIKey}`);

        try {
          // Store the API key in your database.
          customers[customerId] = {
            apikey: hashedAPIKey,
            itemId,
            active: true,
          };
          apiKeys[hashedAPIKey] = customerId;
        } catch (err) {
          console.log(err);
        }

        break;
      case "invoice.paid":
        break;
      case "invoice.payment_failed":
        break;
      default:
      // Unhandled event type
    }

    res.sendStatus(200);
  }
);

module.exports = router;
