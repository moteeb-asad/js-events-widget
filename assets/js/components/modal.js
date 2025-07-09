import { englishMonths, englishFullDays } from "./constants.js";
import { formatTimeTo12Hour } from "./utils.js";

// Initialize Event Modal
export function initEventModal(currentMonthName) {
  const modalContainer = document.querySelector(
    ".lx-agenda-event-modal-container"
  );
  if (!modalContainer) return; // Exit if modal is not found
  const closeBtn = modalContainer.querySelector(".event-modal-close-btn");
  if (!closeBtn) {
    console.error("Event modal close button not found!");
    return;
  }

  // Function to format date
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const englishDay = date.toLocaleDateString("en-US", { weekday: "long" });
    const englishMonth = date.toLocaleDateString("en-US", { month: "long" });
    return `${englishFullDays[englishDay]} ${date.getDate()} ${
      englishMonths[englishMonth]
    } ${date.getFullYear()}`;
  }

  // Function to open modal with event details
  function openModal(event) {
    const modalTitle = modalContainer.querySelector(".event-modal-title");
    const modalCategory = modalContainer.querySelector(".event-modal-category");
    const modalContent = modalContainer.querySelector(".event-modal-content");
    const dateText = modalContainer.querySelector(".date-text");
    const timeSpan = modalContainer.querySelector(".time-span");
    const locationSpan = modalContainer.querySelector(".location-span");
    const descText = modalContainer.querySelector(".desc-text");

    // Set event details with exact classes from template
    modalTitle.textContent = event.data.name;
    modalTitle.className = "event-modal-title text-red"; // Match template class

    if (event.data.categories && event.data.categories.trim() !== "") {
      modalCategory.textContent = event.data.categories;
      modalCategory.className = "event-modal-category text-red"; // Match template class
      modalCategory.style.display = "";
    } else {
      modalCategory.style.display = "none";
    }

    modalContent.className = "event-modal-content bg-red"; // Match template class

    // Format date to match template format
    const eventDate = new Date(event.data.date_start_iso);
    dateText.textContent = formatDate(event.data.date_start_iso);

    const formattedStartTime = formatTimeTo12Hour(event.data.time_start);
    const formattedEndTime = formatTimeTo12Hour(event.data.time_end);
    timeSpan.textContent = `${formattedStartTime} - ${formattedEndTime}`;
    locationSpan.textContent = event.data.locations;

    // Set description and add scroll class if more than 100 words
    descText.innerHTML = event.data.description || "No description available";
    const wordCount = event.data.description
      ? event.data.description.split(/\s+/).length
      : 0;
    if (wordCount > 100) {
      descText.classList.add("scroll");
    } else {
      descText.classList.remove("scroll");
    }

    // Remove any existing price label if present
    const bookTicketWrap = modalContainer.querySelector(".book-ticket-wrap");
    let priceLabel = bookTicketWrap.querySelector(".event-price-label");
    if (!priceLabel) {
      priceLabel = document.createElement("span");
      priceLabel.className = "event-price-label";
      bookTicketWrap.appendChild(priceLabel);
    }
    const price = event.data.price
      ? (event.data.price / 100).toFixed(2)
      : "0.00";
    priceLabel.textContent = `$${price}`;

    // Show modal
    modalContainer.style.display = "flex";
  }

  // Function to close modal
  function closeModal() {
    modalContainer.style.display = "none";
  }

  // Add click event to close button
  closeBtn.addEventListener("click", closeModal);

  // Add click event to modal container to close when clicking outside
  modalContainer.addEventListener("click", (e) => {
    if (e.target === modalContainer) {
      closeModal();
    }
  });

  // Add click events to all event buttons
  const eventButtons = document.querySelectorAll(".event-small-info-btn");

  eventButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();

      const eventId = btn.getAttribute("data-event-id");

      // Get groupedEvents from global scope or pass it as parameter
      const groupedEvents = window.groupedEvents;

      if (!groupedEvents || !groupedEvents.get) {
        console.error("groupedEvents is not properly initialized");
        return;
      }

      const eventsForMonth = groupedEvents.get(currentMonthName);
      if (!eventsForMonth) {
        console.error(`No events found for month: ${currentMonthName}`);
        return;
      }

      const event = eventsForMonth.find((ev) => ev.data.id === eventId);
      if (event) {
        openModal(event);
      } else {
        console.error("Event not found for ID:", eventId);
      }
    });
  });
}
