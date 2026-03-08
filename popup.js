const { STORAGE_KEY_SETTINGS, normalizeSettings } = globalThis.AnalyticsBlockerConfig;

const el = {
  status: document.getElementById('status'),
  saveState: document.getElementById('saveState'),
  openOptions: document.getElementById('openOptions'),

  enabled: document.getElementById('enabled'),
  globalHideMetricNumbers: document.getElementById('globalHideMetricNumbers'),

  studioBlockAnalytics: document.getElementById('studioBlockAnalytics'),
  studioHideNav: document.getElementById('studioHideNav'),
  studioHideLatestVideoCard: document.getElementById('studioHideLatestVideoCard'),
  studioHideChannelAnalyticsCard: document.getElementById('studioHideChannelAnalyticsCard'),
  studioHidePublishedVideosCard: document.getElementById('studioHidePublishedVideosCard'),
  studioHideCommunityCard: document.getElementById('studioHideCommunityCard'),
  studioHideCommentsCard: document.getElementById('studioHideCommentsCard'),
  studioHideRecentSubscribersCard: document.getElementById('studioHideRecentSubscribersCard'),
  studioHideVideoRowMetrics: document.getElementById('studioHideVideoRowMetrics'),
  studioHidePostStats: document.getElementById('studioHidePostStats'),
  studioHideContentMetricColumns: document.getElementById('studioHideContentMetricColumns'),
  studioHideCommentsInboxThreads: document.getElementById('studioHideCommentsInboxThreads'),
  studioHideCommentActionButtons: document.getElementById('studioHideCommentActionButtons'),
  studioHideAnalyticsPageCards: document.getElementById('studioHideAnalyticsPageCards'),

  youtubeBlockAnalytics: document.getElementById('youtubeBlockAnalytics'),
  youtubeHideViews: document.getElementById('youtubeHideViews'),
};

function setStatus(settings) {
  el.status.textContent = settings.enabled
    ? 'Focus mode is active.'
    : 'Focus mode is turned off.';
}

function fillForm(settings) {
  el.enabled.checked = settings.enabled;
  el.globalHideMetricNumbers.checked = settings.sites.global.hideMetricNumbersEverywhere;

  el.studioBlockAnalytics.checked = settings.sites.youtubeStudio.blockAnalyticsPages;
  el.studioHideNav.checked = settings.sites.youtubeStudio.hideAnalyticsNav;
  el.studioHideLatestVideoCard.checked =
    settings.sites.youtubeStudio.hideDashboardLatestVideoCard;
  el.studioHideChannelAnalyticsCard.checked =
    settings.sites.youtubeStudio.hideDashboardChannelAnalyticsCard;
  el.studioHidePublishedVideosCard.checked =
    settings.sites.youtubeStudio.hideDashboardPublishedVideosCard;
  el.studioHideCommunityCard.checked =
    settings.sites.youtubeStudio.hideDashboardCommunityCard;
  el.studioHideCommentsCard.checked = settings.sites.youtubeStudio.hideDashboardCommentsCard;
  el.studioHideRecentSubscribersCard.checked =
    settings.sites.youtubeStudio.hideDashboardRecentSubscribersCard;
  el.studioHideVideoRowMetrics.checked =
    settings.sites.youtubeStudio.hideDashboardVideoRowMetrics;
  el.studioHidePostStats.checked = settings.sites.youtubeStudio.hideDashboardPostStats;
  el.studioHideContentMetricColumns.checked =
    settings.sites.youtubeStudio.hideContentPageMetricColumns;
  el.studioHideCommentsInboxThreads.checked =
    settings.sites.youtubeStudio.hideCommentsInboxThreads;
  el.studioHideCommentActionButtons.checked =
    settings.sites.youtubeStudio.hideCommentActionButtons;
  el.studioHideAnalyticsPageCards.checked =
    settings.sites.youtubeStudio.hideAnalyticsPageCards;

  el.youtubeBlockAnalytics.checked = settings.sites.youtube.blockAnalyticsPages;
  el.youtubeHideViews.checked = settings.sites.youtube.hidePublicViewCounts;
  setStatus(settings);
}

async function loadSettings() {
  const data = await chrome.storage.sync.get(STORAGE_KEY_SETTINGS);
  return normalizeSettings(data[STORAGE_KEY_SETTINGS]);
}

function readForm(settings) {
  return {
    ...settings,
    enabled: el.enabled.checked,
    sites: {
      ...settings.sites,
      global: {
        ...settings.sites.global,
        hideMetricNumbersEverywhere: el.globalHideMetricNumbers.checked,
      },
      youtubeStudio: {
        ...settings.sites.youtubeStudio,
        blockAnalyticsPages: el.studioBlockAnalytics.checked,
        hideAnalyticsNav: el.studioHideNav.checked,
        hideDashboardLatestVideoCard: el.studioHideLatestVideoCard.checked,
        hideDashboardChannelAnalyticsCard: el.studioHideChannelAnalyticsCard.checked,
        hideDashboardPublishedVideosCard: el.studioHidePublishedVideosCard.checked,
        hideDashboardCommunityCard: el.studioHideCommunityCard.checked,
        hideDashboardCommentsCard: el.studioHideCommentsCard.checked,
        hideDashboardRecentSubscribersCard: el.studioHideRecentSubscribersCard.checked,
        hideDashboardVideoRowMetrics: el.studioHideVideoRowMetrics.checked,
        hideDashboardPostStats: el.studioHidePostStats.checked,
        hideContentPageMetricColumns: el.studioHideContentMetricColumns.checked,
        hideCommentsInboxThreads: el.studioHideCommentsInboxThreads.checked,
        hideCommentActionButtons: el.studioHideCommentActionButtons.checked,
        hideAnalyticsPageCards: el.studioHideAnalyticsPageCards.checked,
      },
      youtube: {
        ...settings.sites.youtube,
        blockAnalyticsPages: el.youtubeBlockAnalytics.checked,
        hidePublicViewCounts: el.youtubeHideViews.checked,
      },
    },
  };
}

let saveTimer;

async function persistFromForm() {
  const current = await loadSettings();
  const next = readForm(current);
  await chrome.storage.sync.set({ [STORAGE_KEY_SETTINGS]: next });
  await chrome.runtime.sendMessage({ type: 'ab:refreshRules' });

  setStatus(next);
  el.saveState.textContent = 'Saved';
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    el.saveState.textContent = '';
  }, 900);
}

async function init() {
  const settings = await loadSettings();
  fillForm(settings);

  const toggles = [
    el.enabled,
    el.globalHideMetricNumbers,

    el.studioBlockAnalytics,
    el.studioHideNav,
    el.studioHideLatestVideoCard,
    el.studioHideChannelAnalyticsCard,
    el.studioHidePublishedVideosCard,
    el.studioHideCommunityCard,
    el.studioHideCommentsCard,
    el.studioHideRecentSubscribersCard,
    el.studioHideVideoRowMetrics,
    el.studioHidePostStats,
    el.studioHideContentMetricColumns,
    el.studioHideCommentsInboxThreads,
    el.studioHideCommentActionButtons,
    el.studioHideAnalyticsPageCards,

    el.youtubeBlockAnalytics,
    el.youtubeHideViews,
  ];

  for (const toggle of toggles) {
    toggle.addEventListener('change', () => {
      persistFromForm().catch(() => {
        el.saveState.textContent = 'Save failed';
      });
    });
  }

  el.openOptions.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
}

init().catch(() => {
  el.status.textContent = 'Could not load settings';
});
