// netlify/functions/create-checkout-session.js
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    console.log("Incoming event body:", event.body);
    console.log("STRIPE_SECRET_KEY present:", !!process.env.STRIPE_SECRET_KEY);
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }
    const { priceId, collection, eventName } = JSON.parse(event.body);

    // Determine base URL from environment variables
    const isLocal =
      process.env.NETLIFY_DEV === "true" ||
      process.env.NODE_ENV === "development";
    const localBaseUrl = process.env.LOCAL_BASE_URL || "http://localhost:8888";
    const prodBaseUrl =
      process.env.PROD_BASE_URL ||
      "https://javascript-events-widget.netlify.app";
    const baseUrl = isLocal ? localBaseUrl : prodBaseUrl;

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/success?eventName=${encodeURIComponent(
        eventName
      )}&priceId=${encodeURIComponent(priceId)}`,

      cancel_url: `${baseUrl}/cancel`,
      metadata: {
        collection: collection || "",
        eventName: eventName || "",
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    console.error("Stripe error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
