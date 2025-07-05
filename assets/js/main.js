import { collectionData } from "./dummyData.js";
import { groupEventsByMonth } from "./components/dataProcessor.js";
import { generateEventAccordion } from "./components/accordion.js";
import {
  appendDropdownCategories,
  initFilterDropdown,
  initFilterEventListeners,
} from "./components/filters.js";
import {
  generateEventsMonth,
  initMonthNavigation,
} from "./components/calendar.js";
import { initEventModal } from "./components/modal.js";
import { initViewToggle } from "./components/viewToggle.js";

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
