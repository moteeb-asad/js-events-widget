# JS Events Widget

A modern, modular, and responsive events widget for web projects. Easily display, filter, and explore upcoming events with a beautiful UI, smooth interactions, and integrated Stripe payments.

---

## Tech Stack

- **Frontend:** Vanilla JavaScript (ES Modules), HTML, CSS (DM Sans via Google Fonts, Lucide SVG icons)
- **Backend:** Netlify Functions (Node.js)
- **Payments:** Stripe Checkout (via serverless function)
- **Build Tool:** Vite (for local dev and production builds)
- **Deployment:** Netlify

---

## Project Structure

```
js-events-widget/
│
├── index.html                  # Main HTML file
├── package.json                # Project metadata and scripts
├── package-lock.json           # Dependency lock file
├── .gitignore
├── README.md
│
├── src/
│   ├── css/
│   │   └── style.css           # Main stylesheet
│   └── js/
│       ├── main.js             # App entry point
│       ├── dummyData.js        # Example event data
│       └── components/
│           ├── accordion.js
│           ├── bookEvent.js
│           ├── calendar.js
│           ├── constants.js
│           ├── dataProcessor.js
│           ├── eventCard.js
│           ├── filters.js
│           ├── modal.js
│           ├── utils.js
│           └── viewToggle.js
│
├── public/
│   ├── config.js               # Stripe publishable key for frontend
│   └── assets/                 # (optional: static assets)
│
├── netlify/
│   └── functions/
│       └── create-checkout-session.js  # Netlify serverless function for Stripe
│
├── dist/                       # Production build output (after `npm run build`)
│
└── node_modules/               # Installed dependencies
```

---

## How to Run Locally

1. **Clone the repository:**

   ```sh
   git clone <repo-url>
   cd js-events-widget
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Set up environment variables:**

   - Create a `.env` file in the project root and add your Stripe secret key (from your Stripe dashboard).
   - Example: Add your secret key as an environment variable (do not commit the actual key).

4. **Set your Stripe publishable key:**

   - Edit `public/config.js` and set your Stripe publishable key (from your Stripe dashboard) in the file.

5. **Start the local dev server with Netlify Functions:**
   ```sh
   netlify dev
   ```
   - Visit [http://localhost:8888](http://localhost:8888)

---

## How to Deploy (Netlify)

1. **Push your code to GitHub (or your preferred Git provider).**
2. **Connect your repo to Netlify.**
3. **Set environment variables in Netlify dashboard:**
   - Add your Stripe secret key as an environment variable in the Netlify dashboard.
   - (Optional) Add your Stripe publishable key as an environment variable if needed.
4. **Ensure your Functions directory is set to `netlify/functions`.**
5. **Deploy your site!**

---

## Configuring Netlify Function

- The function is located at `netlify/functions/create-checkout-session.js`.
- It expects a POST request with a JSON body:
  ```json
  {
    "priceId": "price_xxx",
    "collection": "event-highlights",
    "eventName": "Event Name"
  }
  ```
- The function creates a Stripe Checkout session and returns a redirect URL.

---

## Adding/Editing Events

- Edit `src/js/dummyData.js` to add or modify events.
- Each event should have a `stripePriceId` (from your Stripe dashboard), `name`, `date_start_iso`, `date_end_iso`, `price`, etc.

Example:

```js
{
  uuid: "evt-001",
  data: {
    name: "JavaScript Coding Workshop",
    date_start_iso: "2025-08-11",
    date_end_iso: "2025-08-11",
    price: 2000,
    stripePriceId: "price_1RiDNNK6xLgk1t9fiU672FU2",
    // ...other fields
  }
}
```

---

## Brief Description

JS Events Widget is a plug-and-play, Stripe-enabled event listing widget for modern web projects. It supports list and calendar views, category filtering, responsive design, and seamless ticket booking with Stripe Checkout. Built with modular vanilla JS and easily customizable for your needs.

---
