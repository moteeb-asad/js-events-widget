# JS Events Widget

## Project Structure

```
js-events-widget/
│
├── public/                  # All static files served at the root
│   ├── index.html           # Main entry point
│   ├── cancel.html          # Payment cancel page
│   ├── success.html         # Payment success page
│   ├── css/
│   │   └── style.css        # Main stylesheet
│   ├── js/
│   │   ├── main.js          # Main JS entry point
│   │   ├── imports.js       # Centralized imports for all modules
│   │   ├── dummyData.js     # Sample event data
│   │   └── components/      # JS components (accordion.js, modal.js, etc.)
│   ├── config.js            # Stripe publishable key config
│   └── assets/              # Images, fonts, etc. (add as needed)
│
├── netlify/
│   └── functions/           # Netlify serverless functions
│       └── create-checkout-session.js
│
├── .netlify/                # Netlify build/deploy settings (auto-generated)
├── netlify.toml             # Netlify configuration (publish dir, etc.)
├── package.json             # Project metadata and dependencies
├── package-lock.json        # Dependency lockfile
├── .gitignore               # Git ignore rules
├── README.md                # Project documentation
└── dist/                    # (Optional) Build output (if using a build tool)
```

## Folder & File Details

- **public/**: All static files and assets. This is the web root for local and production (Netlify) hosting.

  - **index.html**: Main app entry point.
  - **cancel.html**: Shown when a Stripe payment is cancelled.
  - **success.html**: Shown after successful Stripe payment, displays event details.
  - **css/**: Contains all CSS files (e.g., `style.css`).
  - **js/**: Contains all JavaScript files.
    - **main.js**: App entry point, initializes all components.
    - **imports.js**: Centralized import/export for all modules.
    - **dummyData.js**: Example event data for development/testing.
    - **components/**: Modular JS files for UI and logic (accordion, modal, etc.).
  - **config.js**: Exposes Stripe publishable key to frontend.
  - **assets/**: (Optional) Place for images, fonts, etc.

- **netlify/functions/**: Serverless backend functions (e.g., Stripe checkout session creation).
- **netlify.toml**: Netlify configuration file. Sets `public/` as the publish directory.
- **.netlify/**: Netlify build/deploy settings (auto-generated).
- **package.json**: Project metadata and dependencies.
- **package-lock.json**: Dependency lockfile.
- **.gitignore**: Files/folders to ignore in git.
- **README.md**: Project documentation.
- **dist/**: (Optional) Build output if you add a build step.

## How to Run Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start local server (with Netlify Dev):
   ```bash
   netlify dev
   ```
3. Open [http://localhost:8888](http://localhost:8888) in your browser.

## Netlify Functions & Stripe Secret Key Setup

- The Stripe payment integration uses a Netlify Function located at `netlify/functions/create-checkout-session.js`.
- **You must set the `STRIPE_SECRET_KEY` environment variable in your Netlify project settings.**
  - Go to your site on Netlify > Site settings > Environment variables.
  - Add a new variable:
    - Key: `STRIPE_SECRET_KEY`
    - Value: _your Stripe secret key (starts with `sk_`)_
  - Make sure to redeploy your site after adding or updating environment variables.
- The function will not work unless this variable is set. You will see errors like `Neither apiKey nor config.authenticator provided` if it is missing.
- You can also set other environment variables for local and production base URLs if needed:
  - `LOCAL_BASE_URL` (e.g., `http://localhost:8888`)
  - `PROD_BASE_URL` (e.g., `https://your-site.netlify.app`)

## Deployment

- Deploy to Netlify. The `public/` folder is used as the publish directory.
- Ensure your environment variables are set in the Netlify dashboard for production.

## Notes

- All static assets (HTML, CSS, JS, images) must be in `public/` or its subfolders to be served.
- Use `imports.js` to keep your JS imports clean and organized.
- Serverless functions (like Stripe integration) go in `netlify/functions/`.
