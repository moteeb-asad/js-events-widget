import { STRIPE_PUBLISHABLE_KEY } from "../config.js";

const stripe = Stripe(STRIPE_PUBLISHABLE_KEY);

// Initialize book ticket functionality
function showPaymentModal() {
  const paymentModal = document.querySelector(".payment-modal-container");
  if (paymentModal) {
    paymentModal.style.display = "flex";
  }
}

function hidePaymentModal() {
  const paymentModal = document.querySelector(".payment-modal-container");
  if (paymentModal) {
    paymentModal.style.display = "none";
  }
}

function initBookTicket() {
  // Handle clicks on large book ticket buttons (in modal)
  document.addEventListener("click", function (e) {
    if (e.target.closest(".book-ticket-btn")) {
      e.stopPropagation();

      // Get event data from book button

      const eventTitle = e.target.closest(".book-ticket-btn").dataset.eventname;
      let priceId = e.target.closest(".book-ticket-btn").dataset.priceid;
      console.log("priceId", priceId);
      console.log("eventTitle", eventTitle);
      let collection = null;
      console.log(window.groupedEvents);
      window.groupedEvents.forEach((events) => {
        events.forEach((event) => {
          if (event.data.name === eventTitle) {
            priceId = event.data.stripePriceId;
            collection = "event-highlights"; // Or use event.data.collection if present
          }
        });
      });

      if (!priceId) {
        alert("Stripe Price ID not found for this event.");
        return;
      }

      showPaymentModal();
      // Optionally, call handleBookClick() after payment is confirmed
      handleBookClick(priceId, { collection, eventName: eventTitle });
      console.log("Book ticket for event:", eventTitle);
    }
  });

  // Close payment modal when clicking outside the modal wrap
  document.addEventListener("click", function (e) {
    const paymentModal = document.querySelector(".payment-modal-container");
    const paymentWrap = document.querySelector(".payment-modal-wrap");
    if (
      paymentModal &&
      paymentModal.style.display === "flex" &&
      e.target === paymentModal
    ) {
      hidePaymentModal();
    }
  });

  // Close payment modal when clicking the close button
  document.addEventListener("click", function (e) {
    if (e.target.closest(".payment-modal-close-btn")) {
      hidePaymentModal();
    }
  });
}

async function handleBookClick(priceId, metadata) {
  const response = await fetch("/.netlify/functions/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ priceId, metadata }),
  });
  const session = await response.json();
  await stripe.redirectToCheckout({ sessionId: session.id });
}
export { initBookTicket };
