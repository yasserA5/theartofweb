const express = require("express");
const app = express();
const stripe = require("stripe")("YOUR_STRIPE_SECRET_KEY"); // replace with your Stripe secret key

app.use(express.static("."));
app.use(express.json());

const priceMap = {
  starter: 2750,
  business: 7150,
  mobile: 77000,
  advanced: 13200,
  enterprise: 132000
};

// Update price dynamically
function updatePrice() {
  const pack = packSelect.value;
  const amount = priceMap[pack] || 0;
  priceDiv.textContent = amount > 0 ? amount + " MAD" : "Contact Us";
}

app.post("/create-checkout-session", async (req, res) => {
  const { pack } = req.body;
  const amount = priceMap[pack];

  if(!amount) return res.status(400).json({ error: "Invalid pack" });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{
      price_data: {
        currency: "usd",
        product_data: { name: pack + " Pack" },
        unit_amount: amount
      },
      quantity: 1
    }],
    mode: "payment",
    success_url: "http://localhost:4242/success.html",
    cancel_url: "http://localhost:4242/cancel.html"
  });

  res.json({ id: session.id });
});

app.listen(4242, () => console.log("Server running on port 4242"));
