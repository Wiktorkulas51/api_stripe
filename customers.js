// Reverse mapping of stripe to API key. Model this in your preferred database.
const customers = {
  // stripeCustomerId : data
  stripeCustomerId: {
    apiKey: "evt_3JsEwzG0BKaAS1Ew1wnspkNX",
    active: false,
    itemId: "stripeSubscriptionItemId",
  },
};
const apiKeys = {
  // apiKey : customerdata
  evt_3JsEwzG0BKaAS1Ew1wnspkNX: "stripeCustomerId",
};

module.exports = {
  customers: customers,
  apiKeys: apiKeys,
};
