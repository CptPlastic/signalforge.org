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

    var pressTimer = null;

    bar.querySelectorAll('.sf-mode-btn').forEach(function (btn) {
      var target = btn.getAttribute('data-sf-mode-btn');
      if (!validMode(target)) return;

      btn.addEventListener('click', function () {
        var current = getStored();
        if (target === 'light') {
          if (current === 'light') return;
          return;
        }
        if (current === target) {
          apply(nextTactical(current));
          return;
        }
        apply(target);
      });

      if (target === 'dark') {
        btn.addEventListener('mousedown', function () {
          clearTimeout(pressTimer);
          pressTimer = setTimeout(function () {
            apply('light');
          }, LONG_PRESS_MS);
        });
        btn.addEventListener('mouseup', function () {
          clearTimeout(pressTimer);
        });
        btn.addEventListener('mouseleave', function () {
          clearTimeout(pressTimer);
        });
        btn.addEventListener('touchstart', function () {
          clearTimeout(pressTimer);
          pressTimer = setTimeout(function () {
            apply('light');
          }, LONG_PRESS_MS);
        }, { passive: true });
        btn.addEventListener('touchend', function () {
          clearTimeout(pressTimer);
        });
      }

      if (target === 'light') {
        btn.addEventListener('click', function () {
          if (getStored() === 'light') apply('dark');
        });
      }
    });
  }

  function init() {
    apply(getStored());
    document.querySelectorAll('.sf-mode-bar').forEach(wireBar);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
