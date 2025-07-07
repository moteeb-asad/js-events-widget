import { STRIPE_PUBLISHABLE_KEY } from "../config";

const stripe = Stripe(STRIPE_PUBLISHABLE_KEY);

// Initialize book ticket functionality
function initBookTicket() {
  // Handle clicks on large book ticket buttons (in modal)
  document.addEventListener("click", function (e) {
    if (e.target.closest(".book-ticket-btn")) {
      e.stopPropagation();

      // Get event data from modal
      const modal = document.querySelector(".lx-agenda-event-modal-container");
      const eventTitle = modal.querySelector(".event-modal-title").textContent;

      handleBookClick();
      // Your booking logic here
      console.log("Book ticket for event:", eventTitle);
    }
  });
}

async function handleBookClick() {
  const response = await fetch(
    "https://your-serverless-function.com/create-checkout-session",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId: "123", eventName: "Yoga Class" }),
    }
  );

  const session = await response.json();
  await stripe.redirectToCheckout({ sessionId: session.id });
}
export { initBookTicket };
