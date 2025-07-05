import { englishDays, englishMonths, englishFullDays } from "./constants.js";
import { formatTimeTo12Hour, getTimeSVG, getLocationSVG } from "./utils.js";

// Create event card - card within single event
export function createEventCard(event) {
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
  mainDay.textContent = englishDays[englishDay];

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
      englishMonths[startDate.toLocaleDateString("en-US", { month: "long" })];
    const endMonth =
      englishMonths[endDate.toLocaleDateString("en-US", { month: "long" })];
    const startDay =
      englishFullDays[
        startDate.toLocaleDateString("en-US", { weekday: "long" })
      ];
    const endDay =
      englishFullDays[endDate.toLocaleDateString("en-US", { weekday: "long" })];
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
        <a href="javascript:void(0)" class="read-more-desc">Read more</a>
      `;

      const readMoreLink = mainDesc.querySelector(".read-more-desc");
      const visibleText = mainDesc.querySelector(".visible-text");

      readMoreLink.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (readMoreLink.textContent === "Read more") {
          visibleText.innerHTML = fullText;
          readMoreLink.innerHTML = "Show less";
        } else {
          visibleText.innerHTML = truncatedText;
          readMoreLink.innerHTML = "Read more";
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
