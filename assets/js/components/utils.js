// Convert Time to 12 hours
export function formatTimeTo12Hour(timeStr) {
  if (!timeStr) return "";

  const [hour, minute] = timeStr.split(":").map(Number);
  return `${hour.toString().padStart(2, "0")}.${minute
    .toString()
    .padStart(2, "0")} uur`;
}

// Get SVG functions
export function getTimeSVG() {
  return `
    <svg
      class="event-time-svg lucide lucide-calendar h-3.5 w-3.5"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M8 2v4"></path>
      <path d="M16 2v4"></path>
      <rect width="18" height="18" x="3" y="4" rx="2"></rect>
      <path d="M3 10h18"></path>
    </svg>
  `;
}

export function getLocationSVG() {
  return `
    <svg
      class="event-location-svg lucide lucide-map-pin h-3.5 w-3.5"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  `;
}

// Helper function to get the required DOM elements
export function getDOMElements() {
  const filterDropdown = document.querySelector(".filter-dropdown");
  const filterItems = filterDropdown.querySelector(".filter-items");
  const selectedFiltersWrap = document.querySelector(".selected-filters-wrap");
  const eventsHeading = document.querySelector(".events-heading");
  const eventCards = document.querySelectorAll(".event-card");

  return {
    filterDropdown,
    filterItems,
    selectedFiltersWrap,
    eventsHeading,
    eventCards,
  };
}
