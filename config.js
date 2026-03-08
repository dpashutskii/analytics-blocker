(function initConfig(root) {
  const DEFAULT_SETTINGS = {
    settingsVersion: 2,
    enabled: true,
    blockedPage: {
      title: 'Analytics blocked',
      message:
        'This page is blocked to protect your focus. Keep shipping instead of checking vanity metrics.',
    },
    sites: {
      youtubeStudio: {
        blockAnalyticsPages: true,
        hideAnalyticsNav: false,

        hideDashboardLatestVideoCard: false,
        hideDashboardChannelAnalyticsCard: false,
        hideDashboardPublishedVideosCard: false,
        hideDashboardCommunityCard: false,
        hideDashboardCommentsCard: false,
        hideDashboardRecentSubscribersCard: false,

        hideDashboardVideoRowMetrics: false,
        hideDashboardPostStats: false,

        hideContentPageMetricColumns: false,
        hideCommentsInboxThreads: false,
        hideCommentActionButtons: false,
        hideAnalyticsPageCards: false,
      },
      youtube: {
        blockAnalyticsPages: false,
        hidePublicViewCounts: false,
      },
      global: {
        hideMetricNumbersEverywhere: false,
      },
    },
  };

  const STORAGE_KEY_SETTINGS = 'abSettings';
  const MANAGED_RULE_ID_MIN = 1000;
  const MANAGED_RULE_ID_MAX = 1999;

  const REDIRECT_RULE_TEMPLATES = [
    {
      site: 'youtubeStudio',
      settingKey: 'blockAnalyticsPages',
      regexFilter: '^https://studio\\.youtube\\.com/.*/analytics.*',
    },
    {
      site: 'youtubeStudio',
      settingKey: 'blockAnalyticsPages',
      regexFilter: '^https://studio\\.youtube\\.com/analytics.*',
    },
    {
      site: 'youtube',
      settingKey: 'blockAnalyticsPages',
      regexFilter: '^https://(www\\.)?youtube\\.com/analytics.*',
    },
    {
      site: 'youtube',
      settingKey: 'blockAnalyticsPages',
      regexFilter: '^https://(www\\.)?youtube\\.com/.*/analytics.*',
    },
  ];

  const HIDE_SELECTORS = {
    global: {
      hideMetricNumbersEverywhere: [
        'ytd-video-view-count-renderer',
        'span.inline-metadata-item.style-scope.ytd-video-meta-block:first-child',
        '#metadata-line > span:first-child',
        'ytcd-video-list-cell-video-light .video-metrics',
        'ytcd-channel-facts-item #metrics-table',
        'ytcd-channel-facts-item .metric-row',
        'ytcd-post-stats-item',
        'ytcd-entity-snapshot-item .video-metrics',
        'ytcd-entity-snapshot-item #metrics-table',
        'ytcp-video-row .tablecell-views',
        'ytcp-video-row .tablecell-comments',
        'ytcp-video-row .tablecell-likes',
        'ytcp-table-header .tablecell-views',
        'ytcp-table-header .tablecell-comments',
        'ytcp-table-header .tablecell-likes',
        'ytcp-comment-action-buttons #vote-count',
        'ytcp-comment-action-buttons #show-replies-button',
        'yta-key-metric-block #metric-total',
        'yta-key-metric-block #performance-label',
        'yta-key-metric-block .metric-value',
        'yta-key-metric-block .comparison-value',
        'yta-key-metric-block .typical-performance-value',
        'yta-personalized-overview-header #title',
        'yta-key-metric-card yta-line-chart-base svg text',
        'yta-top-performing-entities .header.metric',
        'yta-top-performing-entities .metric.metric-cell',
        'yta-top-performing-entities .rank',
        'yta-entity-snapshot .table-value',
        'yta-entity-snapshot .metric-value',
        'yta-metric-performance-bar .lower-bound',
        'yta-metric-performance-bar .upper-bound',
        'yta-latest-activity-card .metric',
        'yta-latest-activity-card .right-col',
        'yta-latest-activity-card .value',
        'yta-latest-activity-card .metric-value',
        'yta-playlist-entrypoint-singleton .stats-row-views-metric',
        'yta-playlist-entrypoint-singleton .stats-row-watch-time-metric',
        'yta-entity-snapshot-carousel #navigation-text',
      ],
    },
    youtubeStudio: {
      hideAnalyticsNav: [
        'ytcp-navigation-drawer li[role="presentation"]:has(> ytcp-ve > a.menu-item-link[href*="/analytics/"])',
        'ytcp-navigation-drawer li[role="presentation"]:has(a.menu-item-link[href*="/analytics/"])',
        'li[role="presentation"]:has(> ytcp-ve > a.menu-item-link[href*="/analytics/"])',
        'ytcp-navigation-drawer a.menu-item-link[href*="/analytics/"]',
        '.advanced-analytics-separator',
      ],

      hideDashboardLatestVideoCard: [
        'ytcd-channel-dashboard ytcd-card[test-id="channel-dashboard-snapshot-card"]',
        'ytcd-channel-dashboard ytcd-card:has(ytcd-entity-snapshot-item)',
      ],
      hideDashboardChannelAnalyticsCard: [
        'ytcd-channel-dashboard ytcd-card[test-id="channel-dashboard-facts-card"]',
        'ytcd-channel-dashboard ytcd-card:has(ytcd-channel-facts-item)',
      ],
      hideDashboardPublishedVideosCard: [
        'ytcd-channel-dashboard ytcd-card[test-id="channel-dashboard-recent-videos-card"]',
        'ytcd-channel-dashboard ytcd-card:has(ytcd-recent-videos-item)',
      ],
      hideDashboardCommunityCard: [
        'ytcd-channel-dashboard ytcd-card[test-id="channel-dashboard-post-card"]',
        'ytcd-channel-dashboard ytcd-card:has(ytcd-post-snapshot-item)',
      ],
      hideDashboardCommentsCard: [
        'ytcd-channel-dashboard ytcd-card[test-id="channel-dashboard-comment-card"]',
        'ytcd-channel-dashboard ytcd-card:has(ytcd-comments-snapshot-item)',
      ],
      hideDashboardRecentSubscribersCard: [
        'ytcd-channel-dashboard ytcd-card[test-id="channel-dashboard-recent-activity-card"]',
        'ytcd-channel-dashboard ytcd-card:has(ytcd-recent-activity-item)',
      ],

      hideDashboardVideoRowMetrics: [
        'ytcd-channel-dashboard ytcd-video-list-cell-video-light .video-metrics',
        'ytcd-channel-dashboard ytcd-entity-snapshot-item .video-metrics',
      ],
      hideDashboardPostStats: ['ytcd-channel-dashboard ytcd-post-stats-item'],
      hideContentPageMetricColumns: [
        'ytcp-video-section-content ytcp-table-header .tablecell-views',
        'ytcp-video-section-content ytcp-table-header .tablecell-comments',
        'ytcp-video-section-content ytcp-table-header .tablecell-likes',
        'ytcp-video-section-content ytcp-video-row .tablecell-views',
        'ytcp-video-section-content ytcp-video-row .tablecell-comments',
        'ytcp-video-section-content ytcp-video-row .tablecell-likes',
      ],
      hideCommentsInboxThreads: [
        'ytcp-activity-section #comments-content',
        'ytcp-comments-section #contents',
        'ytcp-comments-section #iron-list',
      ],
      hideCommentActionButtons: [
        'ytcp-comment #comment-actions',
        'ytcp-comment-action-buttons',
        'ytcp-comment #reply-button',
        'ytcp-comment #show-replies-button',
      ],
      hideAnalyticsPageCards: [
        'yta-key-metric-card',
        'yta-entity-snapshot-carousel',
        'yta-latest-activity-card',
      ],
    },
    youtube: {
      hidePublicViewCounts: [
        'ytd-video-view-count-renderer',
        '#metadata-line > span:first-child',
        'span.inline-metadata-item.style-scope.ytd-video-meta-block:first-child',
      ],
    },
  };

  function deepMerge(base, override) {
    if (!override || typeof override !== 'object') {
      return structuredClone(base);
    }

    const out = Array.isArray(base) ? [...base] : { ...base };
    for (const [key, value] of Object.entries(override)) {
      if (
        value &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        base[key] &&
        typeof base[key] === 'object' &&
        !Array.isArray(base[key])
      ) {
        out[key] = deepMerge(base[key], value);
      } else {
        out[key] = value;
      }
    }
    return out;
  }

  function normalizeSettings(candidate) {
    const merged = deepMerge(DEFAULT_SETTINGS, candidate || {});

    // Migrate legacy defaults that were too aggressive when Focus mode was toggled on.
    if (candidate && candidate.settingsVersion == null) {
      merged.sites.youtubeStudio.hideAnalyticsNav = false;
      merged.sites.youtubeStudio.hideDashboardLatestVideoCard = false;
      merged.sites.youtubeStudio.hideDashboardChannelAnalyticsCard = false;
      merged.sites.youtubeStudio.hideDashboardPublishedVideosCard = false;
      merged.sites.youtubeStudio.hideDashboardCommunityCard = false;
      merged.sites.youtubeStudio.hideDashboardCommentsCard = false;
      merged.sites.youtubeStudio.hideDashboardRecentSubscribersCard = false;
      merged.sites.youtubeStudio.hideDashboardVideoRowMetrics = false;
      merged.sites.youtubeStudio.hideDashboardPostStats = false;
      merged.sites.youtubeStudio.hideContentPageMetricColumns = false;
      merged.sites.youtubeStudio.hideCommentsInboxThreads = false;
      merged.sites.youtubeStudio.hideCommentActionButtons = false;
      merged.sites.youtubeStudio.hideAnalyticsPageCards = false;
      merged.sites.global.hideMetricNumbersEverywhere = false;
    }

    // Migrate old coarse toggle to the new per-card controls.
    if (merged.sites?.youtubeStudio?.hideDashboardCards === true) {
      merged.sites.youtubeStudio.hideDashboardLatestVideoCard = true;
      merged.sites.youtubeStudio.hideDashboardChannelAnalyticsCard = true;
      merged.sites.youtubeStudio.hideDashboardPublishedVideosCard = true;
    }

    if (merged.sites?.youtubeStudio?.enabled === false) {
      merged.sites.youtubeStudio.blockAnalyticsPages = false;
      merged.sites.youtubeStudio.hideAnalyticsNav = false;
      merged.sites.youtubeStudio.hideDashboardLatestVideoCard = false;
      merged.sites.youtubeStudio.hideDashboardChannelAnalyticsCard = false;
      merged.sites.youtubeStudio.hideDashboardPublishedVideosCard = false;
      merged.sites.youtubeStudio.hideDashboardCommunityCard = false;
      merged.sites.youtubeStudio.hideDashboardCommentsCard = false;
      merged.sites.youtubeStudio.hideDashboardRecentSubscribersCard = false;
      merged.sites.youtubeStudio.hideDashboardVideoRowMetrics = false;
      merged.sites.youtubeStudio.hideDashboardPostStats = false;
      merged.sites.youtubeStudio.hideContentPageMetricColumns = false;
      merged.sites.youtubeStudio.hideCommentsInboxThreads = false;
      merged.sites.youtubeStudio.hideCommentActionButtons = false;
      merged.sites.youtubeStudio.hideAnalyticsPageCards = false;
    }

    if (merged.sites?.youtube?.enabled === false) {
      merged.sites.youtube.blockAnalyticsPages = false;
      merged.sites.youtube.hidePublicViewCounts = false;
    }

    delete merged.sites?.youtubeStudio?.enabled;
    delete merged.sites?.youtubeStudio?.hideDashboardCards;
    delete merged.sites?.youtube?.enabled;
    merged.settingsVersion = 2;

    return merged;
  }

  root.AnalyticsBlockerConfig = {
    DEFAULT_SETTINGS,
    STORAGE_KEY_SETTINGS,
    MANAGED_RULE_ID_MIN,
    MANAGED_RULE_ID_MAX,
    REDIRECT_RULE_TEMPLATES,
    HIDE_SELECTORS,
    normalizeSettings,
  };
})(globalThis);
