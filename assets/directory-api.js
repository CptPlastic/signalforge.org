/**
 * Directory worker API base URL.
 *
 * Default: Cloudflare workers.dev (no DNS changes required).
 * Optional: set a pretty host via CNAME at your DNS provider, e.g.
 *   directory.signalforge.org  CNAME  signalforge-directory.<account>.workers.dev
 * then update DIRECTORY_API below.
 */
(function () {
  window.SF_DIRECTORY_API = 'https://signalforge-directory.jason-johnson-633.workers.dev';
})();
