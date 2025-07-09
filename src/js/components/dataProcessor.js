// Group events by month (ordered)
export function groupEventsByMonth(events) {
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
