// Hides specific distracting sections on YouTube Studio without blocking the page

(function init() {
  const TARGET_SELECTORS = [
    'ytcd-card[test-id="channel-dashboard-snapshot-card"]',
    'ytcd-card[test-id="channel-dashboard-facts-card"]',
    'ytcd-card[test-id="channel-dashboard-recent-videos-card"]',
    'ytcp-navigation-drawer a.menu-item-link[href*="/analytics/"]',
  ];

  const hideElement = (el) => {
    try {
      if (!el) return;
      if (el.style && el.style.display !== 'none') {
        el.style.setProperty('display', 'none', 'important');
      }
      el.setAttribute('data-analytics-blocker-hidden', 'true');
    } catch (_) {
      // ignore
    }
  };

  const hideTargets = (root = document) => {
    for (const selector of TARGET_SELECTORS) {
      const nodes = root.querySelectorAll(selector);
      for (const node of nodes) hideElement(node);
    }
  };

  // Initial attempt (in case elements are already present)
  hideTargets();

  // Observe SPA updates and late-loaded content
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'childList') {
        for (const added of m.addedNodes) {
          if (!(added instanceof Element)) continue;
          hideTargets(added);
        }
      }
      if (m.type === 'attributes') {
        const target = m.target;
        if (target instanceof Element) hideTargets(target);
      }
    }
  });

  observer.observe(document.documentElement || document, {
    subtree: true,
    childList: true,
    attributes: true,
  });
})();

