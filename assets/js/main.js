(function () {
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    },
    { threshold: 0.08 }
  );
  reveals.forEach((r) => io.observe(r));

  const DEFAULT_PHONE_TOAST = 'Phone number copied to clipboard';
  const PHONE_FAIL_TOAST = "Couldn't copy — try selecting the number";

  function showToast(message) {
    let el = document.getElementById('site-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'site-toast';
      el.className = 'site-toast';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add('site-toast--visible');
    clearTimeout(el._siteToastHide);
    el._siteToastHide = setTimeout(function () {
      el.classList.remove('site-toast--visible');
    }, 2800);
  }

  function copyWithFallback(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(
        function () {
          return true;
        },
        function () {
          return legacyCopy(text);
        }
      );
    }
    return Promise.resolve(legacyCopy(text));
  }

  function legacyCopy(text) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      ta.style.top = '0';
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, text.length);
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (e) {
      return false;
    }
  }

  function initPhoneCopyToClipboard() {
    const card = document.querySelector('.cta-contact');
    if (!card) return;
    card.addEventListener('click', function (e) {
      const row = e.target.closest('a.cta-contact-row');
      if (!row) return;
      const href = row.getAttribute('href') || '';
      if (href.indexOf('tel:') !== 0) return;
      e.preventDefault();
      const v = row.querySelector('.cta-contact-v');
      const text = v ? v.textContent.trim() : href.replace(/^tel:/i, '');
      const toastOk = row.dataset.copyToast || DEFAULT_PHONE_TOAST;
      copyWithFallback(text).then(function (ok) {
        showToast(ok ? toastOk : PHONE_FAIL_TOAST);
      });
    });
  }

  initPhoneCopyToClipboard();

  var NAV_DRAWER_CLOSE_MS = 320;

  function initMobileNav() {
    var toggle = document.querySelector('.nav-drawer-toggle');
    var drawer = document.getElementById('site-nav-drawer');
    if (!toggle || !drawer) return;

    var mq = window.matchMedia('(max-width: 980px)');

    function fullyClose() {
      drawer.classList.remove('nav-drawer--open');
      drawer.setAttribute('hidden', '');
      document.body.classList.remove('nav-drawer-open');
      document.documentElement.classList.remove('nav-drawer-open');
      document.body.style.overflow = '';
      toggle.setAttribute('aria-expanded', 'false');
      clearTimeout(drawer._navHideTimer);
      drawer._navHideTimer = null;
    }

    function closeDrawer() {
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-drawer-open');
      document.documentElement.classList.remove('nav-drawer-open');
      document.body.style.overflow = '';
      drawer.classList.remove('nav-drawer--open');
      clearTimeout(drawer._navHideTimer);
      drawer._navHideTimer = setTimeout(fullyClose, NAV_DRAWER_CLOSE_MS);
      toggle.focus();
    }

    function openDrawer() {
      clearTimeout(drawer._navHideTimer);
      drawer._navHideTimer = null;
      drawer.removeAttribute('hidden');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('nav-drawer-open');
      document.documentElement.classList.add('nav-drawer-open');
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          drawer.classList.add('nav-drawer--open');
        });
      });
      var closeBtn = drawer.querySelector('.nav-drawer__close');
      window.setTimeout(function () {
        if (closeBtn) closeBtn.focus();
      }, 50);
    }

    toggle.addEventListener('click', function () {
      if (toggle.getAttribute('aria-expanded') === 'true') {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    /* Delegated: reliably closes from backdrop, X button, and any nested hit target */
    drawer.addEventListener(
      'click',
      function (e) {
        var closer = e.target.closest('[data-nav-drawer-close]');
        if (closer && drawer.contains(closer)) {
          e.preventDefault();
          closeDrawer();
          return;
        }
        var navA = e.target.closest('.nav-links--drawer a');
        if (navA && drawer.contains(navA)) {
          closeDrawer();
        }
      },
      false
    );

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (drawer.hasAttribute('hidden')) return;
      closeDrawer();
    });

    function onViewportNavMode() {
      if (!mq.matches) fullyClose();
    }
    if (mq.addEventListener) {
      mq.addEventListener('change', onViewportNavMode);
    } else {
      mq.addListener(onViewportNavMode);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileNav);
  } else {
    initMobileNav();
  }
})();
