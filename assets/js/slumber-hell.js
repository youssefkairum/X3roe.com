// Slumber Hell page: screenshot lightbox and the CRT scanline toggle.
// (Scroll reveal and the mobile menu come from the shared assets/js/site.js.)
(function () {
  'use strict';

  // ---- Screenshot lightbox ----
  // Tiles: <button data-lightbox="<image url>" data-caption="..."> containing the thumbnail <img>.
  // The enlarged image gets the same alt text as the tile's thumbnail.
  var dialog = document.getElementById('lightbox');
  var tiles = document.querySelectorAll('[data-lightbox]');

  if (dialog && typeof dialog.showModal === 'function') {
    var frame = dialog.querySelector('[data-lightbox-frame]');
    var caption = document.getElementById('lightbox-caption');
    var closeButton = dialog.querySelector('[data-lightbox-close]');
    var image = document.createElement('img');
    image.className = 'lightbox-img';
    image.width = 1024;
    image.height = 473;
    image.decoding = 'async';
    frame.appendChild(image);

    var opener = null;

    tiles.forEach(function (tile) {
      tile.addEventListener('click', function () {
        var thumb = tile.querySelector('img');
        opener = tile;
        image.src = tile.getAttribute('data-lightbox');
        image.alt = thumb ? thumb.alt : '';
        caption.textContent = tile.getAttribute('data-caption') || '';
        dialog.showModal();
        closeButton.focus();
      });
    });

    closeButton.addEventListener('click', function () {
      dialog.close();
    });

    // A click on the backdrop (outside the dialog's content) targets the dialog itself.
    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) dialog.close();
    });

    // Escape: <dialog> handles it natively; handling it here as well keeps it working where the
    // browser's own close request does not fire (older engines, synthetic key events).
    dialog.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' || event.key === 'Esc') {
        event.preventDefault();
        dialog.close();
      }
    });

    // In every case return focus to the tile that opened the dialog.
    dialog.addEventListener('close', function () {
      if (opener) {
        opener.focus();
        opener = null;
      }
    });
  } else {
    // Very old browsers without <dialog>: open the image itself.
    tiles.forEach(function (tile) {
      tile.addEventListener('click', function () {
        window.location.href = tile.getAttribute('data-lightbox');
      });
    });
  }

  // ---- CRT scanline overlay toggle ----
  // Default: on, except when the visitor asks for reduced motion or a contrast change.
  // An explicit choice is remembered in localStorage (when storage is available).
  var overlay = document.getElementById('crt-scanlines');
  var toggle = document.getElementById('crt-toggle');

  if (overlay && toggle) {
    var STORAGE_KEY = 'slumberhell.crt';
    var stateLabel = toggle.querySelector('[data-crt-state]');
    var stored = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      stored = null;
    }

    var prefersOff = false;
    if (window.matchMedia) {
      prefersOff = window.matchMedia(
        '(prefers-reduced-motion: reduce), (prefers-contrast: more), (prefers-contrast: less), ' +
        '(prefers-contrast: custom), (forced-colors: active)'
      ).matches;
    }

    var on = stored === 'on' ? true : stored === 'off' ? false : !prefersOff;

    var apply = function () {
      overlay.classList.toggle('disabled', !on);
      toggle.setAttribute('aria-pressed', String(on));
      if (stateLabel) stateLabel.textContent = on ? 'on' : 'off';
    };

    apply();
    toggle.hidden = false;

    toggle.addEventListener('click', function () {
      on = !on;
      apply();
      try {
        window.localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off');
      } catch (e) {
        // Storage blocked (private mode, disabled cookies): the choice lasts for this page view.
      }
    });
  }
})();
