import { getDOMElements } from "./utils.js";

// Filter dropdown
export function initFilterDropdown() {
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

// Function to create and append a selected filter button
export function createSelectedFilterBtn(category) {
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

// Function to update the selected filters display
export function updateSelectedFilters(category, state) {
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

// Append Categories In Filter
export function appendDropdownCategories(events) {
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

// Function to handle clearing all selected filters
export function clearAllFilters() {
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

// Function to handle selecting all filters
export function selectAllFilters() {
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

// Function to handle checkbox click and re-enable Select All button if needed
export function updateSelectAllState() {
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

// Main function to show/hide event cards based on selected checkboxes
export function filterEventCardsBySelectedCategories() {
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

// Initialize filter event listeners
export function initFilterEventListeners() {
  // Remove if selected filter button clicked
  document
    .querySelector(".selected-filters-wrap")
    .addEventListener("click", function (e) {
      var btn = e.target.closest(".selected-filter-btn");
      if (!btn) return;

      var category = btn.querySelector(".selected-filter-btn-text").textContent;

      // Uncheck corresponding checkbox
      document
        .querySelectorAll(".dynamic-checkbox")
        .forEach(function (checkbox) {
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

  // Clear all button
  document.querySelector(".filter-btn-container .clear-all").onclick =
    clearAllFilters;

  // Select all button
  document.querySelector(".filter-btn-container .select-all").onclick =
    selectAllFilters;

  // Filter items click
  document.querySelector(".filter-btn-container .filter-items").onclick =
    updateSelectAllState;

  // Add event listener for checkbox changes
  document.addEventListener("click", function (e) {
    const checkbox = e.target.closest(".single-checkbox");
    if (checkbox) {
      filterEventCardsBySelectedCategories();
    }
  });
}
