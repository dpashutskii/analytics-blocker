importScripts('config.js');

const {
  STORAGE_KEY_SETTINGS,
  MANAGED_RULE_ID_MIN,
  MANAGED_RULE_ID_MAX,
  REDIRECT_RULE_TEMPLATES,
  normalizeSettings,
} = globalThis.AnalyticsBlockerConfig;

async function getSettings() {
  const result = await chrome.storage.sync.get(STORAGE_KEY_SETTINGS);
  return normalizeSettings(result[STORAGE_KEY_SETTINGS]);
}

function buildDynamicRules(settings) {
  const rules = [];
  let nextId = MANAGED_RULE_ID_MIN;

  for (const template of REDIRECT_RULE_TEMPLATES) {
    const siteSettings = settings.sites[template.site];
    if (!siteSettings || !siteSettings[template.settingKey]) {
      continue;
    }

    rules.push({
      id: nextId,
      priority: 1,
      action: {
        type: 'redirect',
        redirect: { extensionPath: '/blocked.html' },
      },
      condition: {
        regexFilter: template.regexFilter,
        resourceTypes: ['main_frame'],
      },
    });

    nextId += 1;
  }

  return rules;
}

async function listManagedRuleIds() {
  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  return existing
    .map((rule) => rule.id)
    .filter((id) => id >= MANAGED_RULE_ID_MIN && id <= MANAGED_RULE_ID_MAX);
}

async function applyRules() {
  const settings = await getSettings();
  const removeRuleIds = await listManagedRuleIds();
  const addRules = settings.enabled ? buildDynamicRules(settings) : [];

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds,
    addRules,
  });
}

async function ensureDefaults() {
  const syncData = await chrome.storage.sync.get(STORAGE_KEY_SETTINGS);
  if (!syncData[STORAGE_KEY_SETTINGS]) {
    await chrome.storage.sync.set({
      [STORAGE_KEY_SETTINGS]: normalizeSettings(null),
    });
  } else {
    await chrome.storage.sync.set({
      [STORAGE_KEY_SETTINGS]: normalizeSettings(syncData[STORAGE_KEY_SETTINGS]),
    });
  }
}

chrome.runtime.onInstalled.addListener(async () => {
  await ensureDefaults();
  await applyRules();
});

chrome.runtime.onStartup.addListener(async () => {
  await ensureDefaults();
  await applyRules();
});

chrome.storage.onChanged.addListener(async (changes, areaName) => {
  if (areaName === 'sync' && changes[STORAGE_KEY_SETTINGS]) {
    await applyRules();
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  (async () => {
    if (!message || typeof message !== 'object') {
      sendResponse({ ok: false, error: 'Invalid message' });
      return;
    }

    if (message.type === 'ab:refreshRules') {
      await applyRules();
      sendResponse({ ok: true });
      return;
    }

    sendResponse({ ok: false, error: 'Unknown message type' });
  })().catch((error) => {
    sendResponse({ ok: false, error: error?.message || 'Unexpected error' });
  });

  return true;
});
