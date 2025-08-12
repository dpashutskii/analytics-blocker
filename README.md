# YouTube Analytics Blocker (MV3)

Blocks distracting YouTube Analytics while keeping Studio usable.

## Load the extension locally

1. Open Chrome and go to `chrome://extensions`.
2. Enable "Developer mode" (top-right).
3. Click "Load unpacked" and select the folder: `analytics-blocker`.
4. Refresh `https://studio.youtube.com/`.

## What is blocked/hidden

- Hidden on Studio dashboard (via content script):
  - Latest video performance card (`ytcd-card[test-id="channel-dashboard-snapshot-card"]`)
  - Channel analytics card (`ytcd-card[test-id="channel-dashboard-facts-card"]`)
  - Published videos card (`ytcd-card[test-id="channel-dashboard-recent-videos-card"]`)
  - Analytics sidebar link (and its parent list item)
- Redirected pages (via `rules.json` → `blocked.html`):
  - `https://studio.youtube.com/*/analytics*`
  - `https://www.youtube.com/analytics*`
  - `https://www.youtube.com/*/analytics*`

Notes:
- The content script uses a MutationObserver to keep these elements hidden as Studio updates dynamically.
- Temporarily need analytics? Disable the extension from `chrome://extensions` and reload, or we can add a toggle action.

## Extend

- Add or remove selectors in `content.js`/`content.css` to tune what’s hidden.
- Add more redirect rules in `rules.json` if needed. Reload the extension after changes.
