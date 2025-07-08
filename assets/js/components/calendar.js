import { englishMonths } from "./constants.js";
import { formatTimeTo12Hour } from "./utils.js";
import { initEventModal } from "./modal.js";

// Generate month view with days
export function generateEventsMonth(
  groupedEvents,
  targetMonth = null,
  targetYear = null
) {
  const monthNavigationContainer = document.querySelector(
    ".events-month-navigation-container"
  );
  const monthWrap =
    monthNavigationContainer.querySelector(".events-month-wrap");
  const monthDaysNumberWrap = monthWrap.querySelector(
    ".month-days-number-wrap"
  );

  // Clear existing days
  monthDaysNumberWrap.innerHTML = "";

  // Get all months that have events
  const monthsWithEvents = Array.from(groupedEvents.entries())
    .filter(([_, events]) => events.length > 0)
    .map(([month, events]) => {
      const firstEvent = events[0];
      const date = new Date(firstEvent.data.date_start_iso);
      return {
        month: month,
        year: date.getFullYear(),
        events: events,
      };
    });

  if (monthsWithEvents.length === 0) return;

  // Sort months chronologically
  monthsWithEvents.sort((a, b) => {
    const dateA = new Date(`${a.month} 1, ${a.year}`);
    const dateB = new Date(`${b.month} 1, ${b.year}`);
    return dateA - dateB;
  });

  // Find the target month or use the first month with events
  let currentMonth;
  if (targetMonth && targetYear) {
    currentMonth = monthsWithEvents.find(
      (m) => m.month === targetMonth && m.year === targetYear
    );
  }
  if (!currentMonth) {
    currentMonth = monthsWithEvents[0];
  }

  const currentDate = new Date(`${currentMonth.month} 1, ${currentMonth.year}`);

  // Update month heading
  const monthHeading = monthNavigationContainer.querySelector(
    ".events-month-heading"
  );
  monthHeading.textContent = `${englishMonths[currentMonth.month]} ${
    currentMonth.year
  }`;

  // Get first day of month and total days
  const firstDay = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const totalDays = new Date(
    currentMonth.year,
    currentDate.getMonth() + 1,
    0
  ).getDate();

  // Adjust firstDay to start with Monday (1) instead of Sunday (0)
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < adjustedFirstDay; i++) {
    const emptyDay = document.createElement("div");
    emptyDay.className = "month-day-number";
    monthDaysNumberWrap.appendChild(emptyDay);
  }

  // Add days of the month
  for (let day = 1; day <= totalDays; day++) {
    const dayNumber = document.createElement("div");
    dayNumber.className = "month-day-number";

    const dayNumberInner = document.createElement("div");
    dayNumberInner.className = "month-day-number-inner";
    dayNumberInner.textContent = day;

    // Check if the day is Saturday (6) or Sunday (0)
    const dayDate = new Date(currentMonth.year, currentDate.getMonth(), day);
    const dayOfWeek = dayDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      dayNumber.classList.add("weekend-day");
    }

    // Check if there are events on this day
    const eventsOnDay = currentMonth.events.filter((event) => {
      const eventDate = new Date(event.data.date_start_iso);
      return eventDate.getDate() === day;
    });

    if (eventsOnDay.length > 0) {
      dayNumber.classList.add("has-events");
      dayNumber.setAttribute("data-event-count", eventsOnDay.length);

      // Create event info container
      const eventSmallInfo = document.createElement("div");
      eventSmallInfo.className = "event-small-info bg-red";

      // Add each event to the day
      eventsOnDay.forEach((event) => {
        const eventBtn = document.createElement("button");
        eventBtn.className = "event-small-info-btn text-red bg-red";
        eventBtn.setAttribute("data-event-id", event.data.id);

        const eventTitle = document.createElement("div");
        eventTitle.className = "event-small-info-title";
        eventTitle.textContent = event.data.name;

        const eventTime = document.createElement("div");
        eventTime.className = "event-small-info-time";
        const formattedStartTime = formatTimeTo12Hour(event.data.time_start);
        const formattedEndTime = formatTimeTo12Hour(event.data.time_end);
        eventTime.textContent = `${formattedStartTime} - ${formattedEndTime}`;

        eventBtn.appendChild(eventTitle);
        eventBtn.appendChild(eventTime);
        eventSmallInfo.appendChild(eventBtn);
      });

      dayNumberInner.appendChild(eventSmallInfo);
    }

    dayNumber.appendChild(dayNumberInner);
    monthDaysNumberWrap.appendChild(dayNumber);
  }

  // Initialize event modal for this month
  // initEventModal(currentMonth.month); // Removed to avoid multiple initializations
}

// Initialize month navigation functionality
export function initMonthNavigation(groupedEvents) {
  const prevBtn = document.querySelector(".navigation-single-btn.prev-btn");
  const nextBtn = document.querySelector(".navigation-single-btn.next-btn");
  const monthHeading = document.querySelector(".events-month-heading");

  // Prevent multiple listeners
  if (prevBtn.dataset.listenersAdded === "true") return;
  prevBtn.dataset.listenersAdded = "true";
  nextBtn.dataset.listenersAdded = "true";

  // Get all months that have events
  const monthsWithEvents = Array.from(groupedEvents.entries())
    .filter(([_, events]) => events.length > 0)
    .map(([month, events]) => {
      const firstEvent = events[0];
      const date = new Date(firstEvent.data.date_start_iso);
      return {
        month: month,
        year: date.getFullYear(),
        events: events,
      };
    });

  // Sort months chronologically
  monthsWithEvents.sort((a, b) => {
    const dateA = new Date(`${a.month} 1, ${a.year}`);
    const dateB = new Date(`${b.month} 1, ${b.year}`);
    return dateA - dateB;
  });

  let currentMonthIndex = 0;

  function updateMonthDisplay() {
    const currentMonth = monthsWithEvents[currentMonthIndex];
    monthHeading.textContent = `${englishMonths[currentMonth.month]} ${
      currentMonth.year
    }`;
    generateEventsMonth(groupedEvents, currentMonth.month, currentMonth.year);

    // Update button states
    prevBtn.disabled = currentMonthIndex === 0;
    nextBtn.disabled = currentMonthIndex === monthsWithEvents.length - 1;
  }

  prevBtn.addEventListener("click", function () {
    console.log("Prev button clicked");
    if (currentMonthIndex > 0) {
      currentMonthIndex--;
      updateMonthDisplay();
    }
  });

  nextBtn.addEventListener("click", function () {
    console.log("Next button clicked");
    if (currentMonthIndex < monthsWithEvents.length - 1) {
      currentMonthIndex++;
      updateMonthDisplay();
    }
  });

  // Initialize the display
  updateMonthDisplay();
}
