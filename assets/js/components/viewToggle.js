import { initMonthNavigation } from "./calendar.js";

// Initialize view toggle functionality
export function initViewToggle() {
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
    console.log("monthBtn clicked");
    toggleView(monthBtn, listBtn);
    monthNavigationContainer.style.display = "block";
    accordionContainer.style.display = "none";
    // Initialize month navigation when switching to month view
    initMonthNavigation(window.groupedEvents);
  });
}
