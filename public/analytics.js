/**
 * LaunchPad Analytics Tracker
 * Lightweight tracking for Free tier deployed pages
 * ~3KB minified, ~1.5KB gzipped
 */
(function() {
  'use strict';

  // Respect Do Not Track
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1') {
    return;
  }

  // Get project ID from script data attribute
  var script = document.currentScript || document.querySelector('script[data-lp-project]');
  if (!script) return;

  var projectId = script.getAttribute('data-lp-project');
  var apiUrl = script.getAttribute('data-lp-api') || 'https://launchpad.whop.com';

  if (!projectId) return;

  // Generate or retrieve session ID
  var sessionKey = 'lp_session_' + projectId;
  var sessionId = sessionStorage.getItem(sessionKey);
  if (!sessionId) {
    sessionId = 'ses_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    sessionStorage.setItem(sessionKey, sessionId);
  }

  // Throttle helper
  function throttle(fn, wait) {
    var last = 0;
    return function() {
      var now = Date.now();
      if (now - last >= wait) {
        last = now;
        fn.apply(this, arguments);
      }
    };
  }

  // Send event to API
  function track(eventType, data) {
    var payload = Object.assign({
      projectId: projectId,
      sessionId: sessionId,
      eventType: eventType,
      pageUrl: window.location.href,
      referrer: document.referrer || null,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      timestamp: Date.now()
    }, data || {});

    // Use sendBeacon for reliability, fallback to fetch
    var url = apiUrl + '/api/analytics/track';
    var body = JSON.stringify(payload);

    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, body);
    } else {
      fetch(url, {
        method: 'POST',
        body: body,
        headers: { 'Content-Type': 'application/json' },
        keepalive: true
      }).catch(function() {});
    }
  }

  // Track pageview on load
  track('pageview');

  // Track clicks
  document.addEventListener('click', function(e) {
    var target = e.target;
    var rect = target.getBoundingClientRect();

    // Walk up to find meaningful element
    while (target && target !== document.body) {
      if (target.tagName === 'A' || target.tagName === 'BUTTON' ||
          target.hasAttribute('data-lp-track') || target.id) {
        break;
      }
      target = target.parentElement;
    }

    track('click', {
      elementId: target ? (target.id || target.getAttribute('data-lp-track') || null) : null,
      elementText: target ? (target.textContent || '').slice(0, 100).trim() : null,
      elementTag: target ? target.tagName.toLowerCase() : null,
      xPosition: Math.round(e.pageX),
      yPosition: Math.round(e.pageY)
    });
  }, { passive: true });

  // Track scroll depth
  var maxScroll = 0;
  var scrollHandler = throttle(function() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var docHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    ) - window.innerHeight;

    var scrollPercent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;

    // Only track at milestones: 25%, 50%, 75%, 100%
    var milestones = [25, 50, 75, 100];
    for (var i = 0; i < milestones.length; i++) {
      if (scrollPercent >= milestones[i] && maxScroll < milestones[i]) {
        maxScroll = milestones[i];
        track('scroll', { scrollDepth: milestones[i] });
      }
    }
  }, 250);

  window.addEventListener('scroll', scrollHandler, { passive: true });

  // Track mouse position for heatmap (sampled)
  var mousePositions = [];
  var mouseMoveHandler = throttle(function(e) {
    mousePositions.push({
      x: Math.round(e.pageX),
      y: Math.round(e.pageY),
      t: Date.now()
    });

    // Send batch of positions every 30 entries
    if (mousePositions.length >= 30) {
      track('heatmap', { positions: mousePositions });
      mousePositions = [];
    }
  }, 500);

  document.addEventListener('mousemove', mouseMoveHandler, { passive: true });

  // Track page leave
  function trackLeave() {
    // Send remaining mouse positions
    if (mousePositions.length > 0) {
      track('heatmap', { positions: mousePositions });
    }

    // Calculate time on page
    var timeOnPage = Math.round((Date.now() - performance.timing.navigationStart) / 1000);

    track('leave', {
      scrollDepth: maxScroll,
      timeOnPage: timeOnPage
    });
  }

  // Use visibilitychange for mobile, beforeunload for desktop
  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') {
      trackLeave();
    }
  });

  window.addEventListener('beforeunload', trackLeave);

})();
