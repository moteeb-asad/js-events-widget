let groupedEvents;
let expandActiveMonthAccordion = data.config.expandActiveMonthAccordion;

// Add Dutch translations at the top of the file after imports
const dutchMonths = {
  January: "Januari",
  February: "Februari",
  March: "Maart",
  April: "April",
  May: "Mei",
  June: "Juni",
  July: "Juli",
  August: "Augustus",
  September: "September",
  October: "Oktober",
  November: "November",
  December: "December",
};

const dutchDays = {
  Mon: "Ma",
  Tue: "Di",
  Wed: "Wo",
  Thu: "Do",
  Fri: "Vr",
  Sat: "Za",
  Sun: "Zo",
};

const dutchFullDays = {
  Monday: "Maandag",
  Tuesday: "Dinsdag",
  Wednesday: "Woensdag",
  Thursday: "Donderdag",
  Friday: "Vrijdag",
  Saturday: "Zaterdag",
  Sunday: "Zondag",
};

// For Testing purposes

// groupedEvents = groupEventsByMonth(collectionData);
// generateEventAccordion(groupedEvents);
// appendDropdownCategories(groupedEvents);
// generateEventsMonth(groupedEvents);

// Fetch events and generate accordion
api.collections
  .getCollection({ collectionName: data.collections[0] })
  .then(function (collectionData) {
    console.log("Collection Data:", collectionData);
    groupedEvents = groupEventsByMonth(collectionData);
    generateEventAccordion(groupedEvents);
    appendDropdownCategories(groupedEvents);
    generateEventsMonth(groupedEvents);
    groupedEvents = groupEventsByMonth(collectionData);
  })
  .catch(function (error) {
    console.error("Error fetching collection:", error);
  });

//  INITIALIZE VIEW TOGGLE - Function to initialize view toggle functionality
function initViewToggle() {
  const viewWrap = document.querySelector(".view-wrap");
  const listBtn = viewWrap.querySelector(".view-list-btn");
  const monthBtn = viewWrap.querySelector(".view-month-btn");
  const accordionContainer = document.querySelector(
    ".events-accordion-container"
  );
  const monthNavigationContainer = document.querySelector(
    ".events-month-navigation-container"
  );

  function toggleView(activeBtn, inactiveBtn) {
    activeBtn.classList.add("active");
    inactiveBtn.classList.remove("active");
  }

  listBtn.addEventListener("click", function () {
    toggleView(listBtn, monthBtn);
    accordionContainer.style.display = "block";
    monthNavigationContainer.style.display = "none";
  });

  monthBtn.addEventListener("click", function () {
    toggleView(monthBtn, listBtn);
    monthNavigationContainer.style.display = "block";
    accordionContainer.style.display = "none";
    // Initialize month navigation when switching to month view
    initMonthNavigation(groupedEvents);
  });
}

// GROUP EVENTS BY MONTH (ORDERED) - Group events by month (ordered)
function groupEventsByMonth(events) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const grouped = new Map();
  months.forEach((month) => grouped.set(month, []));

  events.forEach((event) => {
    const startDate = new Date(event.data.date_start_iso);
    const endDate = new Date(event.data.date_end_iso);

    // Get all dates between start and end (inclusive)
    const dates = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Add event to each month it spans
    dates.forEach((date) => {
      const monthName = months[date.getMonth()];
      // Create a copy of the event for each day, but keep the original start and end dates
      const eventCopy = {
        ...event,
        data: {
          ...event.data,
          date_start_iso: date.toISOString().split("T")[0], // Update the display date
          original_start_iso: event.data.date_start_iso, // Keep original start date
          original_end_iso: event.data.date_end_iso, // Keep original end date
        },
      };
      grouped.get(monthName).push(eventCopy);
    });
  });

  return grouped;
}

// GENERATE EVENT ACCORDION - Generate event accordion
function generateEventAccordion(groupedEvents) {
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

    monthHeading.textContent = `${dutchMonths[monthName]} ${year}`;

    // Create total events span
    const totalEvents = document.createElement("span");
    totalEvents.className = "total-events list-no-of-ev-styling";
    totalEvents.textContent = `${monthEvents.length} evenementen`;

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
    // Check if we're in Duda editor environment
    const isDudaEditor = data.inEditor;

    const delay = isDudaEditor ? 500 : 100; // Longer delay for editor

    setTimeout(() => {
      if (firstAccordionButton) {
        const eventContent = firstAccordionButton
          .closest(".single-event")
          .querySelector(".event-content");
        if (eventContent) {
          eventContent.setAttribute("data-open", "true");
          eventContent.style.display = "block";
        }
      }
    }, delay);

    // Additional fallback for editor environment
    if (isDudaEditor) {
      setTimeout(() => {
        if (firstAccordionButton) {
          const eventContent = firstAccordionButton
            .closest(".single-event")
            .querySelector(".event-content");
          if (
            eventContent &&
            eventContent.getAttribute("data-open") === "false"
          ) {
            eventContent.setAttribute("data-open", "true");
            eventContent.style.display = "block";
          }
        }
      }, 1000);
    }
  }
}

//  TOGGLE EVENT ACCORDION - Toggle event accordion
function initEventAccordion() {
  document.addEventListener("click", function (e) {
    const eventBtn = e.target.closest(".event-btn");
    if (!eventBtn) return;

    const singleEvent = eventBtn.closest(".single-event");
    const eventContent = singleEvent.querySelector(".event-content");
    const chevronIcon = eventBtn.querySelector(".lucide-chevron-down");

    const isOpen = eventContent.getAttribute("data-open") === "true";

    if (isOpen) {
      eventContent.style.display = "none";
      chevronIcon.style.transform = "rotate(0deg)";
      eventContent.setAttribute("data-open", "false");
    } else {
      eventContent.style.display = "block";
      chevronIcon.style.transform = "rotate(180deg)";
      eventContent.setAttribute("data-open", "true");
    }
  });
}

//  CREATE EVENT CARD - card within single event
function createEventCard(event) {
  const eventCard = document.createElement("div");
  eventCard.className = "event-card";
  eventCard.setAttribute("data-event-category", event.data.categories);

  // Left: Date & Day
  const dateDayWrap = document.createElement("div");
  dateDayWrap.className = "date-day-wrap";

  const startDate = new Date(
    event.data.original_start_iso || event.data.date_start_iso
  );
  const endDate = new Date(
    event.data.original_end_iso || event.data.date_end_iso
  );
  const isMultiDay = startDate.toDateString() !== endDate.toDateString();

  const mainDate = document.createElement("span");
  mainDate.className = "main-date list-ev-main-date-styling";
  mainDate.textContent = new Date(event.data.date_start_iso).getDate();

  const mainDay = document.createElement("div");
  mainDay.className = "main-day list-ev-main-day-styling";
  const englishDay = new Date(event.data.date_start_iso).toLocaleDateString(
    "en-US",
    { weekday: "short" }
  );
  mainDay.textContent = dutchDays[englishDay];

  dateDayWrap.appendChild(mainDate);
  dateDayWrap.appendChild(mainDay);

  // Right: Event Info
  const infoWrap = document.createElement("div");
  infoWrap.className = "info-wrap bg-red";

  // Title + Category
  const titleWrap = document.createElement("div");
  titleWrap.className = "title-wrap";

  const mainTitle = document.createElement("h3");
  mainTitle.className = "main-title text-yellow list-ev-title-styling";
  mainTitle.textContent = event.data.name;

  const eventCategory = document.createElement("div");
  eventCategory.className =
    "event-category list-ev-category-styling list-ev-category-bg-styling";

  if (event.data.categories && event.data.categories.trim() !== "") {
    eventCategory.textContent = event.data.categories;
  } else {
    eventCategory.style.display = "none";
  }

  titleWrap.appendChild(mainTitle);
  titleWrap.appendChild(eventCategory);

  // Details: Time, Location, Description
  const detailsWrap = document.createElement("div");
  detailsWrap.className = "details-wrap";

  const timeWrap = document.createElement("div");
  timeWrap.className = "time-wrap list-ev-time-styling";
  const formattedStartTime = formatTimeTo12Hour(event.data.time_start);
  const formattedEndTime = formatTimeTo12Hour(event.data.time_end);

  // Create date range text for multi-day events
  let timeText;
  if (isMultiDay) {
    const startMonth =
      dutchMonths[startDate.toLocaleDateString("en-US", { month: "long" })];
    const endMonth =
      dutchMonths[endDate.toLocaleDateString("en-US", { month: "long" })];
    const startDay =
      dutchFullDays[startDate.toLocaleDateString("en-US", { weekday: "long" })];
    const endDay =
      dutchFullDays[endDate.toLocaleDateString("en-US", { weekday: "long" })];
    timeText = `${startDay} ${startDate.getDate()} ${startMonth} ${formattedStartTime} - ${endDay} ${endDate.getDate()} ${endMonth} ${formattedEndTime}`;
  } else {
    timeText = `${formattedStartTime} - ${formattedEndTime}`;
  }
  timeWrap.innerHTML = getTimeSVG() + `<span>${timeText}</span>`;

  const locationWrap = document.createElement("div");
  locationWrap.className = "location-wrap";
  locationWrap.innerHTML =
    getLocationSVG() +
    `<span class="list-ev-location-styling">${
      event.data.locations || ""
    }</span>`;

  const mainDesc = document.createElement("div");
  mainDesc.className = "main-desc list-ev-desc-styling";

  if (event.data.description) {
    const fullText = event.data.description;
    if (fullText.length > 365) {
      const truncatedText = fullText.substring(0, 365);
      const remainingText = fullText.substring(365);

      mainDesc.innerHTML = `
        <span class="visible-text">${truncatedText}</span>
        <a href="javascript:void(0)" class="read-more-desc">Lees meer</a>
      `;

      const readMoreLink = mainDesc.querySelector(".read-more-desc");
      const visibleText = mainDesc.querySelector(".visible-text");

      readMoreLink.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (readMoreLink.textContent === "Lees meer") {
          visibleText.innerHTML = fullText;
          readMoreLink.innerHTML = "Minder";
        } else {
          visibleText.innerHTML = truncatedText;
          readMoreLink.innerHTML = "Lees meer";
        }
      });
    } else {
      mainDesc.innerHTML = fullText;
    }
  } else {
    mainDesc.innerHTML = "";
  }

  detailsWrap.appendChild(timeWrap);
  detailsWrap.appendChild(locationWrap);
  detailsWrap.appendChild(mainDesc);

  infoWrap.appendChild(titleWrap);
  infoWrap.appendChild(detailsWrap);

  eventCard.appendChild(dateDayWrap);
  eventCard.appendChild(infoWrap);

  return eventCard;
}

//  CONVERT TIME TO 12 HOURS - Convert Time to 12 hours
function formatTimeTo12Hour(timeStr) {
  if (!timeStr) return "";

  const [hour, minute] = timeStr.split(":").map(Number);
  return `${hour.toString().padStart(2, "0")}.${minute
    .toString()
    .padStart(2, "0")} uur`;
}

//  FILTER DROPDOWN - Filter dropdown
function initFilterDropdown() {
  const filterBtn = document.querySelector(".filter-btn");
  const filterDropdown = document.querySelector(".filter-dropdown");

  if (!filterBtn || !filterDropdown) return;

  function toggleDropdown(e) {
    e.stopPropagation();
    const isHidden = window.getComputedStyle(filterDropdown).display === "none";
    filterDropdown.style.display = isHidden ? "block" : "none";
  }

  function closeDropdownOnOutsideClick(e) {
    if (!filterBtn.contains(e.target) && !filterDropdown.contains(e.target)) {
      filterDropdown.style.display = "none";
    }
  }

  filterBtn.addEventListener("click", toggleDropdown);
  document.addEventListener("click", closeDropdownOnOutsideClick);
}

//  GET DOMELEMENTS - Helper function to get the required DOM elements
function getDOMElements() {
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

//  APPEND SELECTED FILTER - Function to create and append a selected filter button
function createSelectedFilterBtn(category) {
  const selectedFilterBtn = document.createElement("div");
  selectedFilterBtn.className = "selected-filter-btn";

  const filterText = document.createElement("span");
  filterText.className = "selected-filter-btn-text selected-filter-btn-styling";
  filterText.textContent = category;

  const checkIcon = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  checkIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  checkIcon.setAttribute("width", "24");
  checkIcon.setAttribute("height", "24");
  checkIcon.setAttribute("viewBox", "0 0 24 24");
  checkIcon.setAttribute("fill", "none");
  checkIcon.setAttribute("stroke", "currentColor");
  checkIcon.setAttribute("stroke-width", "2");
  checkIcon.setAttribute("stroke-linecap", "round");
  checkIcon.setAttribute("stroke-linejoin", "round");
  checkIcon.classList.add("lucide", "lucide-check", "h-3", "w-3");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M20 6 9 17l-5-5");
  checkIcon.appendChild(path);

  selectedFilterBtn.appendChild(filterText);
  selectedFilterBtn.appendChild(checkIcon);

  return selectedFilterBtn;
}

//  UPDATE SELECTED FILTERS - Function to update the selected filters display
function updateSelectedFilters(category, state) {
  const { selectedFiltersWrap, eventsHeading } = getDOMElements();

  if (state === "checked") {
    // Check if the filter button is already present to avoid duplicates
    const existingFilterBtn = [
      ...selectedFiltersWrap.querySelectorAll(".selected-filter-btn"),
    ].find(
      (btn) =>
        btn.querySelector(".selected-filter-btn-text").textContent === category
    );

    if (!existingFilterBtn) {
      const selectedFilterBtn = createSelectedFilterBtn(category);
      selectedFiltersWrap.appendChild(selectedFilterBtn);
    }

    // Show selected filters and hide heading
    selectedFiltersWrap.classList.add("active");
    eventsHeading.style.display = "none";
  } else {
    // Remove the selected filter button
    const buttons = selectedFiltersWrap.querySelectorAll(
      ".selected-filter-btn"
    );
    buttons.forEach((btn) => {
      if (
        btn.querySelector(".selected-filter-btn-text").textContent === category
      ) {
        btn.remove();
      }
    });

    // Hide selected filters and show heading if no filters are selected
    if (selectedFiltersWrap.children.length === 0) {
      selectedFiltersWrap.classList.remove("active");
      eventsHeading.style.display = "block";
    }
  }
}

//  REMOVE IF SELECTED FILTER BUTTON CLICKED - function to remove if selected filter button clicked
document
  .querySelector(".selected-filters-wrap")
  .addEventListener("click", function (e) {
    var btn = e.target.closest(".selected-filter-btn");
    if (!btn) return;

    var category = btn.querySelector(".selected-filter-btn-text").textContent;

    // Uncheck corresponding checkbox
    document.querySelectorAll(".dynamic-checkbox").forEach(function (checkbox) {
      var label = checkbox.querySelector(".checkbox-text").textContent;
      if (label === category) {
        checkbox
          .querySelector(".checkbox-icon span")
          .setAttribute("data-state", "unchecked");
      }
    });

    // Update UI and filter logic
    updateSelectedFilters(category, "unchecked");
    document.querySelector(
      ".filter-btn-container .select-all"
    ).disabled = false;

    // Get remaining selected categories
    const remainingCategories = Array.from(
      document.querySelectorAll(
        ".single-checkbox .checkbox-icon span[data-state='checked']"
      )
    ).map((el) => {
      const wrapper = el.closest(".single-checkbox");
      return wrapper?.querySelector(".checkbox-text")?.textContent.trim();
    });

    // Update event visibility based on remaining categories
    const allEventCards = document.querySelectorAll(".event-card");
    const allEventContents = document.querySelectorAll(".event-content");
    const allSingleEvents = document.querySelectorAll(".single-event");

    // First hide all event contents
    allEventContents.forEach((content) => {
      content.style.display = "none";
    });

    // Then show only the relevant ones
    allEventCards.forEach((card) => {
      const cardCategory = card.getAttribute("data-event-category");
      const shouldShow =
        remainingCategories.length === 0 ||
        remainingCategories.includes(cardCategory);

      if (shouldShow) {
        card.style.display = "flex";
        const eventContent = card.closest(".event-content");
        if (eventContent) {
          eventContent.style.display = "block";
        }
      } else {
        card.style.display = "none";
      }
    });

    // Update single event containers
    allSingleEvents.forEach((singleEvent) => {
      const hasVisibleCards = singleEvent.querySelector(
        ".event-card[style='display: flex;']"
      );
      if (hasVisibleCards) {
        singleEvent.style.display = "block";
      } else {
        singleEvent.style.display = "none";
      }
    });
  });

//  FILTER CATEGORIES - Append Categories In Filter
function appendDropdownCategories(events) {
  const { filterDropdown, filterItems, selectedFiltersWrap, eventsHeading } =
    getDOMElements();

  filterItems.innerHTML = "";

  // Get unique categories from events
  const categories = new Set();
  events.forEach((monthEvents) => {
    monthEvents.forEach((event) => {
      const categoriesData = event.data.categories;
      if (categoriesData) {
        if (Array.isArray(categoriesData)) {
          categoriesData.forEach((category) => {
            categories.add(category);
          });
        } else {
          categories.add(categoriesData);
        }
      }
    });
  });

  // Create and append new checkboxes for each category
  categories.forEach((category) => {
    const singleCheckbox = document.createElement("div");
    singleCheckbox.classList.add("single-checkbox", "dynamic-checkbox"); // Added 'dynamic-checkbox' class

    const checkboxIcon = document.createElement("span");
    checkboxIcon.classList.add("checkbox-icon");

    const checkboxState = document.createElement("span");
    checkboxState.setAttribute("data-state", "unchecked");

    const checkboxSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    checkboxSvg.setAttribute("width", "15");
    checkboxSvg.setAttribute("height", "15");
    checkboxSvg.setAttribute("viewBox", "0 0 15 15");
    checkboxSvg.setAttribute("fill", "none");
    checkboxSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    checkboxSvg.classList.add("h-4", "w-4");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d",
      "M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
    );
    path.setAttribute("fill", "currentColor");
    path.setAttribute("fill-rule", "evenodd");
    path.setAttribute("clip-rule", "evenodd");

    checkboxSvg.appendChild(path);
    checkboxState.appendChild(checkboxSvg);
    checkboxIcon.appendChild(checkboxState);

    const checkboxText = document.createElement("span");
    checkboxText.classList.add("checkbox-text");
    checkboxText.textContent = category;

    singleCheckbox.appendChild(checkboxIcon);
    singleCheckbox.appendChild(checkboxText);

    // Add click event to handle checkbox state
    singleCheckbox.addEventListener("click", function () {
      const currentState = checkboxState.getAttribute("data-state");
      const newState = currentState === "checked" ? "unchecked" : "checked";
      checkboxState.setAttribute("data-state", newState);

      // Update selected filters display
      updateSelectedFilters(category, newState);

      // Close the filter dropdown
      filterDropdown.style.display = "none";
    });

    filterItems.appendChild(singleCheckbox);
  });
}

//  CLEAR ALL - Function to handle clearing all selected filters
document.querySelector(".filter-btn-container .clear-all").onclick =
  clearAllFilters;

function clearAllFilters() {
  // Reset all checkboxes to unchecked state
  document
    .querySelectorAll(".single-checkbox .checkbox-icon span")
    .forEach((checkbox) => {
      checkbox.setAttribute("data-state", "unchecked");
    });

  // Clear selected filters display
  const selectedFiltersWrap = document.querySelector(".selected-filters-wrap");
  selectedFiltersWrap.innerHTML = "";
  selectedFiltersWrap.classList.remove("active");

  // Show the default heading
  const eventsHeading = document.querySelector(".events-heading");
  eventsHeading.style.display = "block";

  // Hide the filter dropdown
  const filterDropdown = document.querySelector(".filter-dropdown");
  filterDropdown.style.display = "none";

  // Re-enable the select all button
  document.querySelector(".filter-btn-container .select-all").disabled = false;

  // Show all event cards and their containers
  const allEventCards = document.querySelectorAll(".event-card");
  const allEventContents = document.querySelectorAll(".event-content");
  const allSingleEvents = document.querySelectorAll(".single-event");

  // Show all event cards
  allEventCards.forEach((card) => {
    card.style.display = "flex";
  });

  // Show all event contents
  allEventContents.forEach((content) => {
    content.style.display = "block";
  });

  // Show all single event containers
  allSingleEvents.forEach((singleEvent) => {
    singleEvent.style.display = "block";
  });
}

//  SELECT ALL - Function to handle selecting all filters
document.querySelector(".filter-btn-container .select-all").onclick =
  selectAllFilters;

function selectAllFilters() {
  const { filterDropdown, filterItems } = getDOMElements();
  const checkboxes = filterItems.querySelectorAll(".single-checkbox");

  // Check all checkboxes
  checkboxes.forEach(function (cb) {
    const checkboxState = cb.querySelector(".checkbox-icon span");
    checkboxState.setAttribute("data-state", "checked");
    const category = cb.querySelector(".checkbox-text").textContent;
    updateSelectedFilters(category, "checked");
  });

  // Show all event cards and their containers
  const allEventCards = document.querySelectorAll(".event-card");
  const allEventContents = document.querySelectorAll(".event-content");
  const allSingleEvents = document.querySelectorAll(".single-event");

  // Show all event cards
  allEventCards.forEach((card) => {
    card.style.display = "flex";
  });

  // Show all event contents
  allEventContents.forEach((content) => {
    content.style.display = "block";
  });

  // Show all single event containers
  allSingleEvents.forEach((singleEvent) => {
    singleEvent.style.display = "block";
  });

  // Close dropdown and disable button
  filterDropdown.style.display = "none";
  document.querySelector(".filter-btn-container .select-all").disabled = true;
}

// FILTER ITEMS - Function to handle checkbox click and re-enable Select All button if needed
document.querySelector(".filter-btn-container .filter-items").onclick =
  updateSelectAllState;

function updateSelectAllState() {
  var checkboxes = document.querySelectorAll(
    ".filter-items .single-checkbox.dynamic-checkbox"
  );
  var allChecked = true;

  checkboxes.forEach(function (cb) {
    if (
      cb.querySelector(".checkbox-icon span").getAttribute("data-state") !==
      "checked"
    ) {
      allChecked = false;
    }
  });

  document.querySelector(".filter-btn-container .select-all").disabled =
    allChecked;
}

// FILTER EVENT CARDS - Main function to show/hide event cards based on selected checkboxes
function filterEventCardsBySelectedCategories() {
  // Get selected categories
  const selectedCategories = Array.from(
    document.querySelectorAll(
      ".single-checkbox .checkbox-icon span[data-state='checked']"
    )
  ).map((el) => {
    const wrapper = el.closest(".single-checkbox");
    return wrapper?.querySelector(".checkbox-text")?.textContent.trim();
  });

  // Get all event cards and their containers
  const allEventCards = document.querySelectorAll(".event-card");
  const allEventContents = document.querySelectorAll(".event-content");
  const allSingleEvents = document.querySelectorAll(".single-event");

  // First, hide all event contents
  allEventContents.forEach((content) => {
    content.style.display = "none";
  });

  // Then, show only the relevant ones
  allEventCards.forEach((card) => {
    const cardCategory = card.getAttribute("data-event-category");

    const shouldShow =
      selectedCategories.length === 0 ||
      selectedCategories.includes(cardCategory);

    if (shouldShow) {
      // Show the card
      card.style.display = "flex";
      // Show its parent event content
      const eventContent = card.closest(".event-content");
      if (eventContent) {
        eventContent.style.display = "block";
      }
    } else {
      // Hide the card
      card.style.display = "none";
    }
  });

  // Update the visibility of single-event containers
  allSingleEvents.forEach((singleEvent) => {
    const hasVisibleCards = singleEvent.querySelector(
      ".event-card[style='display: flex;']"
    );
    if (hasVisibleCards) {
      singleEvent.style.display = "block";
    } else {
      singleEvent.style.display = "none";
    }
  });
}

//  ADD EVENT LISTENER FOR CHECKBOX CHANGES - Add event listener for checkbox changes
document.addEventListener("click", function (e) {
  const checkbox = e.target.closest(".single-checkbox");
  if (checkbox) {
    filterEventCardsBySelectedCategories();
  }
});

//  GET SVG - Functions to get SVGs
function getTimeSVG() {
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

function getLocationSVG() {
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

//  INITIALIZE FILTER - Initialize filter
initFilterDropdown();

//  INITIALIZE VIEW TOGGLE - Initialize view toggle
initViewToggle();

// GENERATE EVENTS MONTH - Generate month view with days
function generateEventsMonth(
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
  monthHeading.textContent = `${dutchMonths[currentMonth.month]} ${
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

  initEventModal(currentMonth.month);
}

// INITIALIZE MONTH NAVIGATION - Initialize month navigation functionality
function initMonthNavigation(groupedEvents) {
  const prevBtn = document.querySelector(".navigation-single-btn.prev-btn");
  const nextBtn = document.querySelector(".navigation-single-btn.next-btn");
  const monthHeading = document.querySelector(".events-month-heading");

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
    monthHeading.textContent = `${dutchMonths[currentMonth.month]} ${
      currentMonth.year
    }`;
    generateEventsMonth(groupedEvents, currentMonth.month, currentMonth.year);

    // Update button states
    prevBtn.disabled = currentMonthIndex === 0;
    nextBtn.disabled = currentMonthIndex === monthsWithEvents.length - 1;
  }

  prevBtn.addEventListener("click", function () {
    if (currentMonthIndex > 0) {
      currentMonthIndex--;
      updateMonthDisplay();
    }
  });

  nextBtn.addEventListener("click", function () {
    if (currentMonthIndex < monthsWithEvents.length - 1) {
      currentMonthIndex++;
      updateMonthDisplay();
    }
  });

  // Initialize the display
  updateMonthDisplay();
}

// Initialize Event Modal
function initEventModal(currentMonthName) {
  const modalContainer = document.querySelector(
    ".lx-agenda-event-modal-container"
  );
  const closeBtn = modalContainer.querySelector(".event-modal-close-btn");

  // Function to format date
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const englishDay = date.toLocaleDateString("en-US", { weekday: "long" });
    const englishMonth = date.toLocaleDateString("en-US", { month: "long" });
    return `${dutchFullDays[englishDay]} ${date.getDate()} ${
      dutchMonths[englishMonth]
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
    descText.innerHTML =
      event.data.description || "Geen beschrijving beschikbaar";
    const wordCount = event.data.description
      ? event.data.description.split(/\s+/).length
      : 0;
    if (wordCount > 100) {
      descText.classList.add("scroll");
    } else {
      descText.classList.remove("scroll");
    }

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
