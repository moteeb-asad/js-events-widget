// netlify/functions/create-checkout-session.js
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    console.log("Incoming event body:", event.body);
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { priceId, eventName } = JSON.parse(event.body);

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: priceId, quantity: 1, eventName: eventName }],
      mode: "payment",
      success_url: "https://YOUR_SITE.netlify.app/success", // Change to your real URL
      cancel_url: "https://YOUR_SITE.netlify.app/cancel", // Change to your real URL
    });
    return {
      statusCode: 200,
      body: JSON.stringify({ id: session.id }),
    };
  } catch (err) {
    console.error("Stripe error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
