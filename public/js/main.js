import {
  collectionData,
  groupEventsByMonth,
  generateEventAccordion,
  appendDropdownCategories,
  initFilterDropdown,
  initFilterEventListeners,
  generateEventsMonth,
  initMonthNavigation,
  initEventModal,
  initViewToggle,
  initBookTicket,
  showLoader,
  hideLoader,
} from "./imports.js";

function initializeApp() {
  showLoader();
  // Global variable to store grouped events
  let groupedEvents;

  // Use imported collection data instead of API call
  groupedEvents = groupEventsByMonth(collectionData);

  // Make groupedEvents available globally for modal access
  window.groupedEvents = groupedEvents;

  // Initialize all components
  generateEventAccordion(groupedEvents);
  appendDropdownCategories(groupedEvents);
  generateEventsMonth(groupedEvents);

  // Initialize all event listeners and functionality
  initFilterDropdown();
  initFilterEventListeners();
  initViewToggle();
  initBookTicket();
  initEventModal(); // Only call once after modal is loaded
}

initializeApp();
hideLoader();
