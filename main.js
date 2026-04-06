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
})();
