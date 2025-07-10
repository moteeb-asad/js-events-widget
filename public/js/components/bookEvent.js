const stripe = Stripe(window.STRIPE_PUBLISHABLE_KEY);

function initBookTicket() {
  document.addEventListener("click", async function (e) {
    if (e.target.closest(".book-ticket-btn")) {
      e.stopPropagation();

      const btn = e.target.closest(".book-ticket-btn");
      const originalContent = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<span class="loader"></span> Processing...';

      const eventTitle = btn.dataset.eventname;
      let priceId = btn.dataset.priceid;
      window.groupedEvents.forEach((events) => {
        events.forEach((event) => {
          if (event.data.name === eventTitle) {
            priceId = event.data.stripePriceId;
          }
        });
      });

      if (!priceId) {
        btn.disabled = false;
        btn.innerHTML = originalContent;
        alert("Stripe Price ID not found for this event.");
        return;
      }

      // Call Netlify Function to create Stripe Checkout Session
      try {
        const response = await fetch(
          "/.netlify/functions/create-checkout-session",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              priceId,
              eventName: eventTitle,
            }),
          }
        );
        const data = await response.json();
        if (data.url) {
          window.location.href = data.url; // Redirect to Stripe Checkout
        } else {
          btn.disabled = false;
          btn.innerHTML = originalContent;
          alert("Failed to create Stripe Checkout session.");
        }
      } catch (error) {
        btn.disabled = false;
        btn.innerHTML = originalContent;
        alert("Error connecting to payment service.");
      }
    }
  });
}

export { initBookTicket };
