function loadPartial(id, url) {
  return fetch(url)
    .then((response) => response.text())
    .then((html) => {
      document.getElementById(id).innerHTML = html;
    });
}

// Wait for all partials to load, then initialize the app
Promise.all([
  loadPartial("header", "/partials/header.html"),
  loadPartial("footer", "/partials/footer.html"),
  // loadPartial("event-modal", "/partials/event-modal.html"),
  // loadPartial("payment-modal", "/partials/payment-modal.html"),
]).then(() => {
  requestAnimationFrame(() => {
    import("./main.js").then((module) => {
      if (module && module.initializeApp) {
        module.initializeApp();
      }
    });
  });
});
