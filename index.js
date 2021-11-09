const express = require("express");
const app = express();
const port = 3030;
// const stripe = require("stripe")("sk_test_YOUR_KEY");

const apiRoutes = require("./routes/api");
const webhook = require("./routes/webhook");
const customer = require("./routes/customr");

app.use("/api", apiRoutes);
app.use("/checkout", apiRoutes);
app.use("/webhook", webhook);
app.use("/usage/:customer", customer);

app.listen(port, () => console.log(`app is lissing at port:${port}`));
