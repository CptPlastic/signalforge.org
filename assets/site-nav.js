(function () {
  window.SF_DISCORD = window.SF_DISCORD || {
    invite: 'https://discord.gg/signalforge',
    label: 'Discord Community',
  };

  var MODE_BAR =
    '<div class="sf-mode-bar" aria-label="Display mode">' +
    '<button type="button" class="sf-mode-btn" data-sf-mode-btn="dark" title="Select DARK · tap again to cycle DARK→NITE→NVG · hold for LIGHT (touch)">◑ DARK</button>' +
    '<button type="button" class="sf-mode-btn" data-sf-mode-btn="nite">▌ NITE</button>' +
    '<button type="button" class="sf-mode-btn" data-sf-mode-btn="nvg">◈ NVG</button>' +
    '<button type="button" class="sf-mode-btn" data-sf-mode-btn="light" title="Daylight mode · click again for DARK">☀ LIGHT</button>' +
    '</div>';

  function pageId() {
    return document.body.getAttribute('data-sf-page') || 'home';
  }

  function home(path) {
    if (pageId() === 'home') return path;
    if (path.charAt(0) === '#') return 'index.html' + path;
    return path;
  }

  function activeAttr(id) {
    return pageId() === id ? ' class="is-active"' : '';
  }

  function discordHref() {
    return window.SF_DISCORD && window.SF_DISCORD.invite ? window.SF_DISCORD.invite : '#';
  }

  function renderNav() {
    var mount = document.getElementById('sf-site-nav');
    if (!mount) return;

    var brandHref = pageId() === 'home' ? '#top' : 'index.html';

    mount.innerHTML =
      '<header class="site-nav" id="top">' +
      '<div class="site-nav-inner">' +
      '<a class="nav-brand" href="' + brandHref + '">SignalForge</a>' +
      '<nav class="nav-desktop" aria-label="Primary">' +
      '<details class="nav-group"><summary>Get Started</summary><div class="nav-panel">' +
      '<a href="https://p7hub.projectseven.us/" target="_blank" rel="noopener noreferrer">Open Hosted Hub</a>' +
      '<a href="join.html"' + activeAttr('join') + '>Join the Hub</a>' +
      '<a href="' + home('#recorder') + '">Install CLI</a>' +
      '<a href="mobile.html"' + activeAttr('mobile') + '>SignalForgeHub</a>' +
      '</div></details>' +
      '<details class="nav-group"><summary>Operate</summary><div class="nav-panel">' +
      '<a href="' + home('#run') + '">Run Your Own Hub</a>' +
      '<a href="' + home('#retention') + '">Call Retention</a>' +
      '<a href="' + home('#offgrid') + '">Off-Grid Cells</a>' +
      '<a href="source.html"' + activeAttr('source') + '>Source &amp; Build Notes</a>' +
      '<a href="' + home('#transcription') + '">Transcription</a>' +
      '<a href="' + home('#ptt') + '">Push-to-Talk</a>' +
      '<a href="' + home('#display-modes') + '">Display Modes</a>' +
      '</div></details>' +
      '<details class="nav-group"><summary>Network</summary><div class="nav-panel">' +
      '<a href="' + home('#signalhub') + '">SignalHub Federation</a>' +
      '<a href="' + home('#directory') + '">Directory &amp; Trust</a>' +
      '<a href="register-hub.html"' + activeAttr('register-hub') + '>Register Hub</a>' +
      '<a href="' + home('#roadmap') + '">Roadmap</a>' +
      '<a href="' + home('#network') + '">The Vision</a>' +
      '</div></details>' +
      '<a class="nav-direct" href="about.html"' + activeAttr('about') + '>About</a>' +
      '<a class="nav-direct nav-hub-cta" href="https://p7hub.projectseven.us/" target="_blank" rel="noopener noreferrer">Hub</a>' +
      '<a class="nav-direct nav-discord-cta" href="' + discordHref() + '" target="_blank" rel="noopener noreferrer">Discord</a>' +
      '</nav>' +
      MODE_BAR +
      '<button type="button" class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="nav-mobile">Menu</button>' +
      '</div>' +
      '<div class="nav-mobile" id="nav-mobile">' +
      '<div class="nav-mobile-section"><div class="nav-mobile-title">Get Started</div>' +
      '<a href="https://p7hub.projectseven.us/" target="_blank" rel="noopener noreferrer">Open Hosted Hub</a>' +
      '<a href="join.html"' + activeAttr('join') + '>Join the Hub</a>' +
      '<a href="' + home('#recorder') + '">Install CLI</a>' +
      '<a href="mobile.html"' + activeAttr('mobile') + '>SignalForgeHub</a></div>' +
      '<div class="nav-mobile-section"><div class="nav-mobile-title">Operate</div>' +
      '<a href="' + home('#run') + '">Run Your Own Hub</a>' +
      '<a href="' + home('#retention') + '">Call Retention</a>' +
      '<a href="' + home('#offgrid') + '">Off-Grid Cells</a>' +
      '<a href="source.html"' + activeAttr('source') + '>Source &amp; Build Notes</a>' +
      '<a href="' + home('#transcription') + '">Transcription</a>' +
      '<a href="' + home('#ptt') + '">Push-to-Talk</a>' +
      '<a href="' + home('#display-modes') + '">Display Modes</a></div>' +
      '<div class="nav-mobile-section"><div class="nav-mobile-title">Network</div>' +
      '<a href="' + home('#signalhub') + '">SignalHub Federation</a>' +
      '<a href="' + home('#directory') + '">Directory &amp; Trust</a>' +
      '<a href="register-hub.html"' + activeAttr('register-hub') + '>Register Hub</a>' +
      '<a href="' + home('#roadmap') + '">Roadmap</a>' +
      '<a href="' + home('#network') + '">The Vision</a></div>' +
      '<div class="nav-mobile-section"><div class="nav-mobile-title">About</div>' +
      '<a href="about.html"' + activeAttr('about') + '>About SignalForge</a></div>' +
      '<div class="nav-mobile-section nav-mobile-cta">' +
      '<a class="nav-mobile-hub" href="https://p7hub.projectseven.us/" target="_blank" rel="noopener noreferrer">Open Hub</a>' +
      '<a class="nav-mobile-discord" href="' + discordHref() + '" target="_blank" rel="noopener noreferrer">Discord</a></div>' +
      '<div class="nav-mobile-section"><div class="nav-mobile-title">Display</div>' + MODE_BAR + '</div>' +
      '</div></header>';

    var navToggle = document.getElementById('nav-toggle');
    var navMobile = document.getElementById('nav-mobile');
    navToggle?.addEventListener('click', function () {
      var open = navMobile?.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.textContent = open ? 'Close' : 'Menu';
    });
    navMobile?.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navMobile.classList.remove('open');
        navToggle?.setAttribute('aria-expanded', 'false');
        if (navToggle) navToggle.textContent = 'Menu';
      });
    });

    document.querySelectorAll('.nav-group').forEach(function (group) {
      group.addEventListener('toggle', function () {
        if (!group.open) return;
        document.querySelectorAll('.nav-group').forEach(function (other) {
          if (other !== group) other.removeAttribute('open');
        });
      });
    });

    document.addEventListener('click', function (event) {
      if (!event.target || !event.target.closest) return;
      if (event.target.closest('.nav-group')) return;
      document.querySelectorAll('.nav-group[open]').forEach(function (el) {
        el.removeAttribute('open');
      });
    });

    document.dispatchEvent(new Event('sf-nav-mounted'));
  }

  function footerColumn(title, linksHtml) {
    return (
      '<div class="site-footer-col">' +
      '<div class="site-footer-col-title">' + title + '</div>' +
      '<nav class="site-footer-col-links" aria-label="' + title + '">' +
      linksHtml +
      '</nav></div>'
    );
  }

  function renderFooter() {
    var mount = document.getElementById('sf-site-footer');
    if (!mount) return;

    var operateLinks =
      '<a href="' + home('#run') + '">Run Your Own Hub</a>' +
      '<a href="' + home('#retention') + '">Call Retention</a>' +
      '<a href="' + home('#offgrid') + '">Off-Grid Cells</a>' +
      '<a href="source.html"' + activeAttr('source') + '>Source &amp; Build Notes</a>' +
      '<a href="' + home('#transcription') + '">Transcription</a>' +
      '<a href="' + home('#ptt') + '">Push-to-Talk</a>' +
      '<a href="' + home('#display-modes') + '">Display Modes</a>' +
      '<a href="api.html"' + activeAttr('api') + '>API Docs</a>';

    var networkLinks =
      '<a href="' + home('#signalhub') + '">SignalHub Federation</a>' +
      '<a href="' + home('#directory') + '">Directory &amp; Trust</a>' +
      '<a href="register-hub.html"' + activeAttr('register-hub') + '>Register Hub</a>' +
      '<a href="' + home('#roadmap') + '">Roadmap</a>' +
      '<a href="' + home('#network') + '">The Vision</a>';

    var communityLinks =
      '<a href="join.html"' + activeAttr('join') + '>Join the Hub</a>' +
      '<a href="https://p7hub.projectseven.us/" target="_blank" rel="noopener noreferrer">Open Hosted Hub</a>' +
      '<a href="feedback.html"' + activeAttr('feedback') + '>Feedback</a>' +
      '<a href="brand.html"' + activeAttr('brand') + '>Brand Guide</a>' +
      '<a href="' + home('#mission') + '">Mission</a>' +
      '<a href="' + discordHref() + '" target="_blank" rel="noopener noreferrer">Discord</a>';

    mount.innerHTML =
      '<footer class="site-footer">' +
      '<div class="site-footer-inner">' +
      '<div class="site-footer-brand">SignalForge</div>' +
      '<div class="site-footer-grid">' +
      footerColumn('Operate', operateLinks) +
      footerColumn('Network', networkLinks) +
      footerColumn('Community', communityLinks) +
      '</div>' +
      '<div class="site-footer-meta">Yukon, Oklahoma &mdash; projectseven co ltd</div>' +
      '<div class="site-footer-meta"><a href="mailto:info@projectseven.us">info@projectseven.us</a></div>' +
      '</div></footer>';
  }

  function init() {
    renderNav();
    renderFooter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
