# Events Widget

A modern, modular, and responsive events widget for web projects. Easily display, filter, and explore upcoming events with a beautiful UI and smooth interactions.

## Features

- List and calendar (month) views
- Smooth accordion transitions
- Modal event details
- Category filtering
- Responsive design
- Easy to customize with your own data and styles

## Folder Structure

```
js-events-widget/
│
├── index.html                # Main HTML file
├── assets/
│   ├── css/
│   │   └── style.css         # Main stylesheet
│   └── js/
│       ├── main.js           # Entry point, initializes the widget
│       ├── dummyData.js      # Example event data
│       └── components/       # Modular JS components
│           ├── accordion.js
│           ├── calendar.js
│           ├── constants.js
│           ├── dataProcessor.js
│           ├── eventCard.js
│           ├── filters.js
│           ├── modal.js
│           ├── utils.js
│           └── viewToggle.js
└── ... (other project files)
```

## Quick Start

1. **Clone or download this repo.**
2. Open `index.html` in your browser (no build step needed).
3. Edit `assets/js/dummyData.js` to add your own events.
4. Customize styles in `assets/css/style.css` as needed.

## Customization

- **Add/Edit Events:** Modify `dummyData.js`.
- **Change Colors:** Each event can have a `color` property.
- **Change Layout/Behavior:** Edit the relevant JS component in `assets/js/components/`.

## Requirements

- Modern browser (uses ES modules)
- No build tools or frameworks required

## Credits

- UI/UX: DM Sans font via Google Fonts
- Icons: Lucide (SVG)

---

**Enjoy your new events widget!**
