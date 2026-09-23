// Shared behaviour for every content page: scroll reveal and the mobile menu.
(function () {
  window.__x3roeReady = true;

  // ---- Scroll reveal ----
  // Observes each .reveal element against the viewport (root: null also accounts for
  // clipping by nested scroll containers), so tall sections and nested scrollers work.
  var items = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var show = function (el) { el.classList.add('active'); };
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(show);
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          show(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0 });
    items.forEach(function (el) { observer.observe(el); });

    // A .reveal element in the last few pixels of the page can stay below the viewport even
    // when the page is scrolled to the end (its hidden state is shifted down by 30px), so show
    // everything that is left once the end of the page is reached (or if the page cannot scroll).
    var showRest = function () {
      var doc = document.documentElement;
      if (window.innerHeight + window.scrollY >= doc.scrollHeight - 2) {
        items.forEach(function (el) {
          if (!el.classList.contains('active')) {
            show(el);
            observer.unobserve(el);
          }
        });
        window.removeEventListener('scroll', showRest);
      }
    };
    window.addEventListener('scroll', showRest, { passive: true });
    showRest();
  }

  // ---- Mobile menu ----
  // Markup: <button data-nav-toggle aria-controls="mobile-nav" aria-expanded="false">
  //           <i class="ph-bold ph-list" aria-hidden="true"></i></button>
  //         <nav id="mobile-nav" data-mobile-nav hidden> ...links... </nav>
  // The icon switches between 'ph-bold ph-list' (closed) and 'ph-bold ph-x' (open). Keep both
  // literal pairs in this file: tools/icons.py only generates icons it finds written out in full.
  var toggle = document.querySelector('[data-nav-toggle]');
  var menu = document.querySelector('[data-mobile-nav]');
  if (toggle && menu) {
    var icon = toggle.querySelector('i');
    var setOpen = function (open) {
      menu.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      if (icon) {
        icon.classList.toggle('ph-list', !open);
        icon.classList.toggle('ph-x', open);
      }
    };
    setOpen(false);
    toggle.addEventListener('click', function () { setOpen(menu.hidden); });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) {
        setOpen(false);
        toggle.focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (!menu.hidden && !menu.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
    });
  }
})();
