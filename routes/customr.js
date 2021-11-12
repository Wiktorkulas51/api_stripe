const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);

//customer
router.get("/", async (req, res) => {
  // cus_KYQIE5TQzScMbG
  // const customerId = req.params.customer;
  const customerId = req.params;
  console.log(customerId);
  const invoice = await stripe.invoices.retrieveUpcoming({
    customer: customerId,
  });

  res.send(invoice);
});

module.exports = router;
