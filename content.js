(function init() {
  const { STORAGE_KEY_SETTINGS, HIDE_SELECTORS, normalizeSettings } =
    globalThis.AnalyticsBlockerConfig;

  const STYLE_ID = 'ab-focus-style';

  function getSiteKey(hostname) {
    if (hostname === 'studio.youtube.com') return 'youtubeStudio';
    if (hostname === 'www.youtube.com' || hostname === 'youtube.com') return 'youtube';
    return null;
  }

  function shouldApplyHideRules(settings, siteKey) {
    if (!siteKey) return false;
    if (!settings.enabled) return false;
    return true;
  }

  function collectEnabledSelectors(selectorMap, settingValues) {
    const selectors = [];
    for (const [settingKey, values] of Object.entries(selectorMap || {})) {
      if (!settingValues[settingKey]) continue;
      selectors.push(...values);
    }
    return selectors;
  }

  function buildHideCss(settings, siteKey) {
    const globalSelectors = collectEnabledSelectors(
      HIDE_SELECTORS.global,
      settings.sites.global || {}
    );

    const siteSelectors = collectEnabledSelectors(
      HIDE_SELECTORS[siteKey],
      settings.sites[siteKey] || {}
    );

    const selectors = [...new Set([...globalSelectors, ...siteSelectors])];
    if (!selectors.length) {
      return '';
    }

    return `${selectors.join(',\n')} { display: none !important; }`;
  }

  function removeManagedStyle() {
    const existing = document.getElementById(STYLE_ID);
    if (existing) {
      existing.remove();
    }
  }

  function upsertManagedStyle(cssText) {
    if (!cssText) {
      removeManagedStyle();
      return;
    }

    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement('style');
      style.id = STYLE_ID;
      document.documentElement.appendChild(style);
    }

    if (style.textContent !== cssText) {
      style.textContent = cssText;
    }
  }

  async function refresh() {
    const syncData = await chrome.storage.sync.get(STORAGE_KEY_SETTINGS);
    const settings = normalizeSettings(syncData[STORAGE_KEY_SETTINGS]);
    const siteKey = getSiteKey(location.hostname);

    if (!shouldApplyHideRules(settings, siteKey)) {
      removeManagedStyle();
      return;
    }

    upsertManagedStyle(buildHideCss(settings, siteKey));
  }

  chrome.storage.onChanged.addListener((changes) => {
    if (changes[STORAGE_KEY_SETTINGS]) {
      refresh().catch(() => {
        // Ignore transient errors from extension lifecycle.
      });
    }
  });

  refresh().catch(() => {
    // Ignore transient errors from extension lifecycle.
  });
})();
