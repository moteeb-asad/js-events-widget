import { englishMonths, expandActiveMonthAccordion } from "./constants.js";
import { createEventCard } from "./eventCard.js";

// Generate event accordion
export function generateEventAccordion(groupedEvents) {
  const eventsContainer = document.querySelector(".events-accordion-wrap");
  eventsContainer.innerHTML = "";

  let isFirstAccordion = true;
  let firstAccordionButton = null;

  // Convert grouped events to array and sort chronologically
  const sortedMonths = Array.from(groupedEvents.entries())
    .filter(([_, events]) => events.length > 0)
    .map(([monthName, events]) => {
      const firstEvent = events[0];
      const eventDate = new Date(firstEvent.data.date_start_iso);
      return {
        monthName: monthName,
        events: events,
        year: eventDate.getFullYear(),
        monthIndex: eventDate.getMonth(),
      };
    })
    .sort((a, b) => {
      // Sort by year first, then by month
      if (a.year !== b.year) {
        return a.year - b.year;
      }
      return a.monthIndex - b.monthIndex;
    });

  sortedMonths.forEach(({ monthName, events: monthEvents, year }) => {
    // Create month container
    const singleEvent = document.createElement("div");
    singleEvent.className = "single-event";

    // Create button
    const eventBtn = document.createElement("button");
    eventBtn.className = "event-btn";

    // Store reference to first accordion button
    if (isFirstAccordion) {
      firstAccordionButton = eventBtn;
    }

    // Create inner wrap
    const innerWrap = document.createElement("div");
    innerWrap.className = "inner-wrap";

    // Create month heading with year
    const monthHeading = document.createElement("h4");
    monthHeading.className = "month-heading list-ev-mnth-year-styling";

    monthHeading.textContent = `${englishMonths[monthName]} ${year}`;

    // Create total events span
    const totalEvents = document.createElement("span");
    totalEvents.className = "total-events list-no-of-ev-styling";
    totalEvents.textContent = `${monthEvents.length} events`;

    const chevronIcon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    chevronIcon.setAttribute("width", "24");
    chevronIcon.setAttribute("height", "24");
    chevronIcon.setAttribute("viewBox", "0 0 24 24");
    chevronIcon.setAttribute("fill", "none");
    chevronIcon.setAttribute("stroke", "currentColor");
    chevronIcon.setAttribute("stroke-width", "2");
    chevronIcon.setAttribute("stroke-linecap", "round");
    chevronIcon.setAttribute("stroke-linejoin", "round");
    chevronIcon.classList.add(
      "lucide",
      "lucide-chevron-down",
      "h-5",
      "w-5",
      "text-muted-foreground",
      "transition-transform"
    );

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "m6 9 6 6 6-6");
    chevronIcon.appendChild(path);

    const eventContent = document.createElement("div");
    eventContent.className = "event-content";
    eventContent.setAttribute("data-open", "false"); // initial state

    monthEvents.forEach((event) => {
      const eventCard = createEventCard(event);
      eventContent.appendChild(eventCard);
    });

    innerWrap.appendChild(monthHeading);
    innerWrap.appendChild(totalEvents);
    eventBtn.appendChild(innerWrap);
    eventBtn.appendChild(chevronIcon);
    singleEvent.appendChild(eventBtn);
    singleEvent.appendChild(eventContent);

    eventsContainer.appendChild(singleEvent);

    isFirstAccordion = false;
  });

  initEventAccordion();

  // Auto-expand first accordion after everything is initialized
  if (firstAccordionButton && expandActiveMonthAccordion !== false) {
    // Auto-expand first accordion
    setTimeout(() => {
      if (firstAccordionButton) {
        const eventContent = firstAccordionButton
          .closest(".single-event")
          .querySelector(".event-content");
        if (eventContent) {
          eventContent.setAttribute("data-open", "true");
          eventContent.classList.add("open");
        }
      }
    }, 100);
  }
}

// Toggle event accordion
export function initEventAccordion() {
  document.addEventListener("click", function (e) {
    const eventBtn = e.target.closest(".event-btn");
    if (!eventBtn) return;

    const singleEvent = eventBtn.closest(".single-event");
    const eventContent = singleEvent.querySelector(".event-content");
    const chevronIcon = eventBtn.querySelector(".lucide-chevron-down");

    const isOpen = eventContent.classList.contains("open");

    if (isOpen) {
      eventContent.classList.remove("open");
      chevronIcon.style.transform = "rotate(0deg)";
      eventContent.setAttribute("data-open", "false");
    } else {
      eventContent.classList.add("open");
      chevronIcon.style.transform = "rotate(180deg)";
      eventContent.setAttribute("data-open", "true");
    }
  });
}
