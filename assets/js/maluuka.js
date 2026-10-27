// Maluuka secret surprise page: mobile-first step-by-step experience, reason deck, and heart shower.
(function () {
  'use strict';

  var steps = Array.prototype.slice.call(document.querySelectorAll('[data-step]'));
  var stepDotsContainer = document.getElementById('step-progress');
  var stepDots = Array.prototype.slice.call(document.querySelectorAll('[data-step-dot]'));
  var openBtn = document.getElementById('open-envelope-btn');
  var replayBtn = document.getElementById('replay-envelope-btn');
  var particleLayer = document.getElementById('particle-layer');
  var hugBtn = document.getElementById('hug-btn');
  var hugStatus = document.getElementById('hug-status');

  var reasonTabs = Array.prototype.slice.call(document.querySelectorAll('[data-reason-tab]'));
  var reasonPanels = Array.prototype.slice.call(document.querySelectorAll('[data-reason-panel]'));
  var reasonCounter = document.getElementById('reason-counter');
  var nextReasonOrStepBtn = document.getElementById('next-reason-or-step-btn');
  var nextReasonLabel = document.getElementById('next-reason-label');

  var currentStep = 0;
  var currentReason = 0;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Particle burst (hearts & sparkles) ----
  // Keep literal Phosphor classes in a comment so tools/icons.py includes them:
  // ph-fill ph-heart ph-fill ph-sparkle ph-fill ph-star
  var ICONS = [
    'ph-fill ph-heart text-pink-400',
    'ph-fill ph-heart text-rose-400',
    'ph-fill ph-sparkle text-purple-300',
    'ph-fill ph-star text-amber-300',
    'ph-fill ph-heart text-pink-300'
  ];

  function spawnParticles(count, originRect) {
    if (!particleLayer || reduceMotion) return;

    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var centerX = originRect ? originRect.left + originRect.width / 2 : vw / 2;
    var centerY = originRect ? originRect.top + originRect.height / 2 : vh * 0.5;

    for (var i = 0; i < count; i++) {
      var el = document.createElement('i');
      var iconClass = ICONS[i % ICONS.length];
      el.className = 'floating-particle ' + iconClass;
      el.setAttribute('aria-hidden', 'true');

      var spreadX = (Math.random() - 0.5) * Math.min(vw * 0.85, 360);
      var startX = centerX + (Math.random() - 0.5) * 60;
      var startY = centerY + (Math.random() - 0.5) * 30;
      var dy = -(120 + Math.random() * 200);
      var dur = (1.5 + Math.random() * 1.1).toFixed(2) + 's';
      var scale = (0.85 + Math.random() * 0.85).toFixed(2);
      var rot = Math.round((Math.random() - 0.5) * 60) + 'deg';
      var size = Math.round(16 + Math.random() * 16) + 'px';

      el.style.left = startX + 'px';
      el.style.top = startY + 'px';
      el.style.fontSize = size;
      el.style.setProperty('--dx', Math.round(spreadX) + 'px');
      el.style.setProperty('--dy', Math.round(dy) + 'px');
      el.style.setProperty('--dur', dur);
      el.style.setProperty('--scale', scale);
      el.style.setProperty('--rot', rot);

      particleLayer.appendChild(el);
      (function (node) {
        window.setTimeout(function () {
          if (node.parentNode) node.parentNode.removeChild(node);
        }, 2700);
      })(el);
    }
  }

  // ---- Step navigation ----
  function showStep(index) {
    if (index < 0 || index >= steps.length) return;
    currentStep = index;

    steps.forEach(function (sec, idx) {
      var active = idx === index;
      sec.classList.toggle('is-active', active);
    });

    if (stepDotsContainer) {
      stepDotsContainer.hidden = index === 0;
    }

    stepDots.forEach(function (dot) {
      var dotStep = parseInt(dot.getAttribute('data-step-dot'), 10);
      if (dotStep === index) {
        dot.setAttribute('aria-current', 'step');
      } else {
        dot.removeAttribute('aria-current');
      }
    });

    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  // ---- Reason sub-deck inside Step 3 ----
  function showReason(index, withSparkle) {
    if (index < 0 || index >= reasonPanels.length) return;
    currentReason = index;

    reasonTabs.forEach(function (tab, idx) {
      var selected = idx === index;
      tab.setAttribute('aria-selected', String(selected));
    });

    reasonPanels.forEach(function (panel, idx) {
      panel.hidden = idx !== index;
    });

    if (reasonCounter) {
      reasonCounter.textContent = 'REASON 0' + (index + 1) + ' / 0' + reasonPanels.length;
    }

    if (nextReasonLabel) {
      if (index < reasonPanels.length - 1) {
        nextReasonLabel.textContent = 'Next Reason (' + (index + 2) + '/' + reasonPanels.length + ')';
      } else {
        nextReasonLabel.textContent = 'Final Surprise';
      }
    }

    if (withSparkle && reasonTabs[index]) {
      spawnParticles(8, reasonTabs[index].getBoundingClientRect());
    }
  }

  reasonTabs.forEach(function (tab, idx) {
    tab.addEventListener('click', function () {
      showReason(idx, true);
    });
  });

  if (nextReasonOrStepBtn) {
    nextReasonOrStepBtn.addEventListener('click', function () {
      if (currentReason < reasonPanels.length - 1) {
        showReason(currentReason + 1, true);
      } else {
        spawnParticles(14, nextReasonOrStepBtn.getBoundingClientRect());
        showStep(4);
      }
    });
  }

  // ---- Envelope open & replay ----
  if (openBtn) {
    openBtn.addEventListener('click', function () {
      spawnParticles(26, openBtn.getBoundingClientRect());
      if (reduceMotion) {
        showStep(1);
        return;
      }
      openBtn.classList.add('is-opening');
      window.setTimeout(function () {
        showStep(1);
      }, 520);
    });
  }

  if (replayBtn) {
    replayBtn.addEventListener('click', function () {
      if (openBtn) openBtn.classList.remove('is-opening');
      showReason(0, false);
      showStep(0);
    });
  }

  // ---- Next / Prev step buttons & top progress dots ----
  document.querySelectorAll('[data-next-step]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      spawnParticles(12, btn.getBoundingClientRect());
      showStep(currentStep + 1);
    });
  });

  document.querySelectorAll('[data-prev-step]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      showStep(currentStep - 1);
    });
  });

  stepDots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      var target = parseInt(dot.getAttribute('data-step-dot'), 10);
      if (target >= 1 && target <= 4) {
        showStep(target);
      }
    });
  });

  // ---- Mobile touch swipe navigation between unlocked steps ----
  var touchStartX = 0;
  var touchStartY = 0;

  document.addEventListener('touchstart', function (e) {
    if (!e.touches || e.touches.length !== 1) return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', function (e) {
    if (currentStep === 0 || !e.changedTouches || e.changedTouches.length !== 1) return;
    var dx = e.changedTouches[0].clientX - touchStartX;
    var dy = e.changedTouches[0].clientY - touchStartY;

    // Horizontal swipe only
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) {
        // Swipe left -> next reason or next step
        if (currentStep === 3 && currentReason < reasonPanels.length - 1) {
          showReason(currentReason + 1, true);
        } else if (currentStep < 4) {
          showStep(currentStep + 1);
        }
      } else {
        // Swipe right -> prev reason or prev step
        if (currentStep === 3 && currentReason > 0) {
          showReason(currentReason - 1, false);
        } else if (currentStep > 1) {
          showStep(currentStep - 1);
        }
      }
    }
  }, { passive: true });

  // ---- Virtual Hug Button & Love Meter ----
  var hugCount = 0;
  var HUG_MESSAGES = [
    'Virtual hug delivered! Maluuka is officially the most loved bestie on Earth.',
    'Another big hug sent! Sending 1,000% good vibes your way.',
    'Hug x3! Warning: Bestie appreciation levels are off the charts.',
    'Unlimited hugs unlocked! You deserve all the happiness in the world, Maluuka.',
    'Maximum love reached! Forever grateful to have you as my best friend.'
  ];

  if (hugBtn) {
    hugBtn.addEventListener('click', function () {
      hugCount += 1;
      spawnParticles(22, hugBtn.getBoundingClientRect());
      if (hugStatus) {
        var msg = HUG_MESSAGES[(hugCount - 1) % HUG_MESSAGES.length];
        hugStatus.textContent = msg + ' (Hugs: ' + hugCount + ' • Love: ∞)';
      }
    });
  }
})();
