(function () {
  var STORAGE_KEY = 'sf-display-mode';
  var TACTICAL = ['dark', 'nite', 'nvg'];
  var LONG_PRESS_MS = 800;

  function validMode(m) {
    return m === 'dark' || m === 'nite' || m === 'nvg' || m === 'light';
  }

  function getStored() {
    try {
      var m = localStorage.getItem(STORAGE_KEY);
      return validMode(m) ? m : 'dark';
    } catch (e) {
      return 'dark';
    }
  }

  function apply(mode) {
    document.documentElement.setAttribute('data-sf-mode', mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch (e) {
      /* ignore */
    }
    document.querySelectorAll('.sf-mode-btn').forEach(function (btn) {
      var active = btn.getAttribute('data-sf-mode-btn') === mode;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function nextTactical(current) {
    var i = TACTICAL.indexOf(current);
    if (i < 0) return 'dark';
    return TACTICAL[(i + 1) % TACTICAL.length];
  }

  function wireBar(bar) {
    if (!bar || bar.dataset.sfModeWired) return;
    bar.dataset.sfModeWired = '1';

    bar.querySelectorAll('.sf-mode-btn').forEach(function (btn) {
      var target = btn.getAttribute('data-sf-mode-btn');
      if (!validMode(target)) return;

      var pressTimer = null;
      var longPressFired = false;

      function clearPress() {
        if (pressTimer) {
          clearTimeout(pressTimer);
          pressTimer = null;
        }
      }

      btn.addEventListener('click', function () {
        if (longPressFired) {
          longPressFired = false;
          return;
        }
        var current = getStored();
        if (target === 'light') {
          apply(current === 'light' ? 'dark' : 'light');
          return;
        }
        if (current === target) {
          apply(nextTactical(current));
          return;
        }
        apply(target);
      });

      if (target === 'dark') {
        function startLongPress() {
          clearPress();
          longPressFired = false;
          pressTimer = setTimeout(function () {
            longPressFired = true;
            apply('light');
          }, LONG_PRESS_MS);
        }
        btn.addEventListener('mousedown', startLongPress);
        btn.addEventListener('mouseup', clearPress);
        btn.addEventListener('mouseleave', clearPress);
        btn.addEventListener('touchstart', startLongPress, { passive: true });
        btn.addEventListener('touchend', clearPress);
        btn.addEventListener('touchcancel', clearPress);
      }
    });
  }

  function init() {
    apply(getStored());
    document.querySelectorAll('.sf-mode-bar').forEach(wireBar);
  }

  window.SF_initDisplayModes = init;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  document.addEventListener('sf-nav-mounted', init);
})();
