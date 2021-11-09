const express = require("express");
const router = express.Router();
const stripe = require("stripe")(
  "sk_test_51Jru7nG0BKaAS1EwQrikoNaA08IrMSSvvIE5pLel6vc0OXovnVOqBUmZYpODDPR5L6DhsWgJmxD7ZW8Xbr8ANFEa00wMcz1yvm"
);

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
