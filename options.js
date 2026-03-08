const { STORAGE_KEY_SETTINGS, DEFAULT_SETTINGS, normalizeSettings } =
  globalThis.AnalyticsBlockerConfig;

const el = {
  form: document.getElementById('settingsForm'),
  blockedTitle: document.getElementById('blockedTitle'),
  blockedMessage: document.getElementById('blockedMessage'),
  resetDefaults: document.getElementById('resetDefaults'),
  savedState: document.getElementById('savedState'),
};

function setSavedState(text) {
  el.savedState.textContent = text;
  if (!text) return;
  setTimeout(() => {
    el.savedState.textContent = '';
  }, 1500);
}

function fillForm(settings) {
  el.blockedTitle.value = settings.blockedPage.title;
  el.blockedMessage.value = settings.blockedPage.message;
}

function readForm(settings) {
  return {
    ...settings,
    blockedPage: {
      title: (el.blockedTitle.value || '').trim() || settings.blockedPage.title,
      message: (el.blockedMessage.value || '').trim() || settings.blockedPage.message,
    },
  };
}

async function loadSettings() {
  const data = await chrome.storage.sync.get(STORAGE_KEY_SETTINGS);
  return normalizeSettings(data[STORAGE_KEY_SETTINGS]);
}

async function saveSettings(nextSettings) {
  await chrome.storage.sync.set({ [STORAGE_KEY_SETTINGS]: nextSettings });
  await chrome.runtime.sendMessage({ type: 'ab:refreshRules' });
}

async function init() {
  fillForm(await loadSettings());

  el.form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const current = await loadSettings();
    const next = readForm(current);
    await saveSettings(next);
    setSavedState('Saved');
  });

  el.resetDefaults.addEventListener('click', async () => {
    const reset = normalizeSettings(DEFAULT_SETTINGS);
    await saveSettings(reset);
    fillForm(reset);
    setSavedState('Defaults restored');
  });
}

init().catch(() => {
  setSavedState('Could not load settings');
});
