# Focus Blocker for Creators (MV3)

Chrome extension that blocks analytics-heavy pages and hides vanity-metric UI so creators can stay focused on shipping.

## What you can customize

From the popup (main controls):
- Turn Focus Mode on/off.
- YouTube Studio:
  - Block Studio Analytics pages.
  - Hide dashboard metric cards.
  - Hide Analytics link in Studio sidebar.
- YouTube:
  - Block analytics URLs.
  - Hide public view counts.

From Advanced Settings page:
- Customize blocked-page title and message.
- Reset all settings to defaults.

## Load locally

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Click Load unpacked and select this folder.
4. Pin the extension and configure features from popup.

## Project structure

- `manifest.json`: MV3 manifest.
- `config.js`: default settings, selectors, and redirect templates.
- `background.js`: dynamic DNR rule management.
- `content.js`: applies hide rules from settings.
- `popup.*`: primary user controls.
- `options.*`: advanced settings.
- `blocked.*`: focus page shown when blocked pages are opened.
