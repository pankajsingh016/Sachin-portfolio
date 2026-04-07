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

  function initProofCarousels() {
    document.querySelectorAll('[data-proof-carousel]').forEach(function (root) {
      if (root.dataset.carouselInit === '1') return;
      root.dataset.carouselInit = '1';

      const track = root.querySelector('[data-carousel-track]');
      const tabs = root.querySelectorAll('[data-carousel-tab]');
      const slides = root.querySelectorAll('.feat-proof-slide');
      const video = root.querySelector('.feat-proof-slide--video video');
      const urlBar = root.querySelector('.feat-proof-url');
      const progressWrap = root.querySelector('.feat-proof-carousel-progress');
      const progressBar = root.querySelector('.feat-proof-carousel-progress-bar');

      if (!track || tabs.length < 2) return;

      let idx = 0;
      const n = tabs.length;
      const rawPdf = parseInt(
        String(root.dataset.pdfPhaseMs || root.getAttribute('data-pdf-phase-ms') || '10000'),
        10
      );
      const pdfPhaseMs = !isNaN(rawPdf) && rawPdf >= 2000 ? rawPdf : 10000;
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const videoBar =
        root.dataset.videoUrlBar ||
        root.getAttribute('data-video-url-bar') ||
        'Video';
      const pdfBar =
        root.dataset.pdfUrlBar ||
        root.getAttribute('data-pdf-url-bar') ||
        (urlBar ? urlBar.textContent.trim() : '');

      var pdfTimer = null;
      var endedHandler = null;
      var metaHandler = null;

      function setUrlBar() {
        if (!urlBar) return;
        urlBar.textContent = idx === 0 ? videoBar : pdfBar;
      }

      function restartProgress(ms) {
        if (!progressBar || !progressWrap) return;
        progressBar.classList.remove('feat-proof-carousel-progress-bar--tick');
        if (reduceMotion) return;
        void progressBar.offsetWidth;
        progressWrap.style.setProperty('--feat-proof-carousel-ms', ms + 'ms');
        progressBar.classList.add('feat-proof-carousel-progress-bar--tick');
      }

      function clearPdfTimer() {
        if (pdfTimer) clearTimeout(pdfTimer);
        pdfTimer = null;
      }

      function clearVideoListeners() {
        if (video && endedHandler) {
          video.removeEventListener('ended', endedHandler);
          endedHandler = null;
        }
        if (video && metaHandler) {
          video.removeEventListener('loadedmetadata', metaHandler);
          metaHandler = null;
        }
      }

      function applyVisualIndex(i) {
        idx = ((i % n) + n) % n;
        track.style.transform = 'translateX(-' + idx * (100 / n) + '%)';
        tabs.forEach(function (t, j) {
          var sel = j === idx;
          t.setAttribute('aria-selected', sel ? 'true' : 'false');
          t.classList.toggle('feat-proof-tab--active', sel);
        });
        slides.forEach(function (slide, j) {
          slide.setAttribute('aria-hidden', j !== idx ? 'true' : 'false');
        });
        if (video && idx !== 0) {
          try {
            video.pause();
          } catch (e) {}
        }
        setUrlBar();
      }

      function beginPdfPhase() {
        if (reduceMotion) return;
        clearPdfTimer();
        clearVideoListeners();
        if (video) {
          try {
            video.pause();
            video.currentTime = 0;
          } catch (e) {}
        }
        applyVisualIndex(1);
        restartProgress(pdfPhaseMs);
        pdfTimer = setTimeout(beginVideoPhase, pdfPhaseMs);
      }

      function beginVideoPhase() {
        if (reduceMotion) return;
        clearPdfTimer();
        clearVideoListeners();
        applyVisualIndex(0);
        if (!video) {
          beginPdfPhase();
          return;
        }
        video.currentTime = 0;
        function armProgressAndPlay() {
          var d = video.duration;
          var ms =
            !isNaN(d) && isFinite(d) && d > 0
              ? Math.round(d * 1000)
              : 60000;
          restartProgress(ms);
          endedHandler = function () {
            endedHandler = null;
            beginPdfPhase();
          };
          video.addEventListener('ended', endedHandler, { once: true });
          video.play().catch(function () {});
        }
        if (video.readyState >= 1) {
          armProgressAndPlay();
        } else {
          metaHandler = function () {
            metaHandler = null;
            armProgressAndPlay();
          };
          video.addEventListener('loadedmetadata', metaHandler, { once: true });
        }
      }

      tabs.forEach(function (tab, j) {
        tab.addEventListener('click', function () {
          if (reduceMotion) {
            applyVisualIndex(j);
            setUrlBar();
            return;
          }
          clearPdfTimer();
          clearVideoListeners();
          if (j === 1) {
            beginPdfPhase();
          } else {
            beginVideoPhase();
          }
        });
      });

      if (reduceMotion) {
        applyVisualIndex(1);
        return;
      }
      beginPdfPhase();
    });
  }

  function bootProofCarousel() {
    initProofCarousels();
  }

  if (document.documentElement.classList.contains('theme-ready')) {
    bootProofCarousel();
  } else {
    window.addEventListener('portfolio:theme-ready', bootProofCarousel, { once: true });
  }
})();
