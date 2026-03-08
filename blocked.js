const { STORAGE_KEY_SETTINGS, normalizeSettings } = globalThis.AnalyticsBlockerConfig;

const titleEl = document.getElementById('title');
const messageEl = document.getElementById('message');
const backBtn = document.getElementById('back');
const openOptionsBtn = document.getElementById('openOptions');

async function loadSettings() {
  const data = await chrome.storage.sync.get(STORAGE_KEY_SETTINGS);
  return normalizeSettings(data[STORAGE_KEY_SETTINGS]);
}

async function init() {
  const settings = await loadSettings();
  titleEl.textContent = settings.blockedPage.title;
  messageEl.textContent = settings.blockedPage.message;
}

backBtn.addEventListener('click', () => {
  history.back();
});

openOptionsBtn.addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

init().catch(() => {
  // no-op
});
