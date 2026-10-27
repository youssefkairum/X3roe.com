// Maluuka secret surprise page: envelope reveal, appreciation cards, and heart shower.
(function () {
  'use strict';

  var stage = document.getElementById('envelope-stage');
  var openBtn = document.getElementById('open-envelope-btn');
  var replayBtn = document.getElementById('replay-envelope-btn');
  var content = document.getElementById('surprise-content');
  var particleLayer = document.getElementById('particle-layer');
  var hugBtn = document.getElementById('hug-btn');
  var hugStatus = document.getElementById('hug-status');

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
    var centerY = originRect ? originRect.top + originRect.height / 2 : vh * 0.55;

    for (var i = 0; i < count; i++) {
      var el = document.createElement('i');
      var iconClass = ICONS[i % ICONS.length];
      el.className = 'floating-particle ' + iconClass;
      el.setAttribute('aria-hidden', 'true');

      var spreadX = (Math.random() - 0.5) * Math.min(vw * 0.75, 420);
      var startX = centerX + (Math.random() - 0.5) * 80;
      var startY = centerY + (Math.random() - 0.5) * 40;
      var dy = -(140 + Math.random() * 240);
      var dur = (1.6 + Math.random() * 1.3).toFixed(2) + 's';
      var scale = (0.9 + Math.random() * 0.9).toFixed(2);
      var rot = Math.round((Math.random() - 0.5) * 60) + 'deg';
      var size = Math.round(18 + Math.random() * 18) + 'px';

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
        }, 3000);
      })(el);
    }
  }

  // ---- Envelope opening & replay ----
  function openEnvelope() {
    if (!openBtn || !content || !stage) return;

    var rect = openBtn.getBoundingClientRect();
    spawnParticles(28, rect);

    if (reduceMotion) {
      stage.hidden = true;
      content.removeAttribute('data-locked');
      content.focus();
      return;
    }

    openBtn.classList.add('is-opening');
    window.setTimeout(function () {
      stage.hidden = true;
      content.removeAttribute('data-locked');
      content.focus();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 620);
  }

  function replayEnvelope() {
    if (!openBtn || !content || !stage) return;
    openBtn.classList.remove('is-opening');
    content.setAttribute('data-locked', 'true');
    stage.hidden = false;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    openBtn.focus();
  }

  if (openBtn) {
    openBtn.addEventListener('click', openEnvelope);
  }
  if (replayBtn) {
    replayBtn.addEventListener('click', replayEnvelope);
  }

  // ---- Interactive "Why You're The Best Bestie" cards ----
  var cards = document.querySelectorAll('[data-bestie-card]');
  cards.forEach(function (card) {
    card.addEventListener('click', function () {
      var expanded = card.getAttribute('aria-expanded') === 'true';
      var next = !expanded;
      card.setAttribute('aria-expanded', String(next));

      var secret = card.querySelector('[data-card-secret]');
      var prompt = card.querySelector('[data-card-prompt]');
      if (secret) secret.hidden = !next;
      if (prompt) prompt.hidden = next;

      if (next) {
        spawnParticles(10, card.getBoundingClientRect());
      }
    });
  });

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
        hugStatus.textContent = msg + ' (Hugs sent: ' + hugCount + ' • Love: ∞)';
      }
    });
  }
})();
