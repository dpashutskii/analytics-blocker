# YouTube Analytics Blocker (MV3)

Blocks YouTube Analytics pages so they don't distract you.

## Load the extension locally

1. Open Chrome and go to `chrome://extensions`.
2. Enable "Developer mode" (top-right).
3. Click "Load unpacked" and select this folder: `/Users/dpashutskii/projects/analytics-blocker`.
4. Visit any YouTube Analytics URLs (e.g., `https://studio.youtube.com/`) – you should be redirected to a simple blocked page.

## How it works

- Uses Declarative Net Request rules (`rules.json`) to redirect requests for analytics pages to `blocked.html`.
- A minimal `content.js` and `content.css` are included for future enhancements (like hiding analytics links in the UI).

## Extend

- To add more blocked paths, add more rules in `rules.json` following the same structure.
- After changes, reload the extension from `chrome://extensions`.
