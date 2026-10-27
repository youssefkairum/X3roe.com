// Maluuka secret surprise page: mobile-first step-by-step experience, reason deck, heart shower,
// and a dreamy Web Audio API music-box + starry pad soundtrack.
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

  var musicToggle = document.getElementById('music-toggle');
  var musicIcon = document.getElementById('music-icon');

  var reasonTabs = Array.prototype.slice.call(document.querySelectorAll('[data-reason-tab]'));
  var reasonPanels = Array.prototype.slice.call(document.querySelectorAll('[data-reason-panel]'));
  var reasonCounter = document.getElementById('reason-counter');
  var nextReasonOrStepBtn = document.getElementById('next-reason-or-step-btn');
  var nextReasonLabel = document.getElementById('next-reason-label');

  var currentStep = 0;
  var currentReason = 0;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Keep literal Phosphor classes in a comment so tools/icons.py includes them:
  // ph-fill ph-heart ph-fill ph-sparkle ph-fill ph-star ph-fill ph-speaker-high ph-fill ph-speaker-slash
  var ICONS = [
    'ph-fill ph-heart text-pink-400',
    'ph-fill ph-heart text-rose-400',
    'ph-fill ph-sparkle text-purple-300',
    'ph-fill ph-star text-amber-300',
    'ph-fill ph-heart text-pink-300'
  ];

  // =========================================================================
  // Dreamy Starry Music Box & Warm Pad Synthesizer (Web Audio API)
  // =========================================================================
  var AudioCtx = window.AudioContext || window.webkitAudioContext;
  var audioCtx = null;
  var masterGain = null;
  var delayBus = null;
  var musicPlaying = false;
  var musicTimer = null;
  var stepCursor = 0;

  // Note frequencies (Hz)
  var N = {
    C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, Fs4: 369.99, G4: 392.00, A4: 440.00, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
    C6: 1046.50, E6: 1318.51
  };

  // 8-bar dreamy progression (Fmaj9 -> G6 -> Em9 -> Am9 -> Dm9 -> G13 -> Cmaj9 -> Cmaj9)
  var BARS = [
    { pad: [N.F3, N.A3, N.C4, N.E4], notes: [N.E5, N.C5, N.G4, N.A4, N.C5, N.E5, N.G5, N.E5] },
    { pad: [N.G3, N.B3, N.D4, N.E4], notes: [N.D5, N.B4, N.G4, N.A4, N.B4, N.D5, N.E5, N.D5] },
    { pad: [N.E3, N.G3, N.B3, N.D4], notes: [N.B4, N.G4, N.E4, N.G4, N.B4, N.D5, N.G5, N.D5] },
    { pad: [N.A3, N.C4, N.E4, N.G4], notes: [N.C5, N.A4, N.E4, N.G4, N.A4, N.C5, N.E5, N.C5] },
    { pad: [N.D3, N.F3, N.A3, N.C4], notes: [N.F5, N.D5, N.A4, N.C5, N.D5, N.F5, N.A5, N.F5] },
    { pad: [N.G3, N.B3, N.D4, N.F4], notes: [N.E5, N.D5, N.B4, N.G4, N.A4, N.B4, N.D5, N.G5] },
    { pad: [N.C3, N.G3, N.B3, N.E4], notes: [N.E5, N.C5, N.B4, N.G4, N.E4, N.G4, N.B4, N.C5] },
    { pad: [N.C3, N.E3, N.A3, N.D4], notes: [N.D5, N.E5, N.G5, N.E5, N.C5, N.B4, N.C5, 0] }
  ];

  function ensureAudio() {
    if (!AudioCtx) return null;
    if (!audioCtx) {
      try {
        audioCtx = new AudioCtx();
        masterGain = audioCtx.createGain();
        masterGain.gain.value = 0.55;

        // Warm low-pass filter on master
        var warmFilter = audioCtx.createBiquadFilter();
        warmFilter.type = 'lowpass';
        warmFilter.frequency.value = 3400;

        // Dreamy stereo echo loop
        var delay = audioCtx.createDelay(1.0);
        delay.delayTime.value = 0.36;
        var feedback = audioCtx.createGain();
        feedback.gain.value = 0.28;
        var delayFilter = audioCtx.createBiquadFilter();
        delayFilter.type = 'lowpass';
        delayFilter.frequency.value = 1800;

        delay.connect(delayFilter);
        delayFilter.connect(feedback);
        feedback.connect(delay);

        var wetGain = audioCtx.createGain();
        wetGain.gain.value = 0.32;
        delay.connect(wetGain);

        delayBus = delay;
        masterGain.connect(warmFilter);
        warmFilter.connect(audioCtx.destination);
        wetGain.connect(warmFilter);
      } catch (e) {
        audioCtx = null;
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playBellNote(freq, startTime, duration, volume) {
    if (!audioCtx || !masterGain || !freq) return;
    var t = startTime || audioCtx.currentTime;
    var dur = duration || 2.1;
    var vol = volume || 0.11;

    var osc = audioCtx.createOscillator();
    var overtone = audioCtx.createOscillator();
    var env = audioCtx.createGain();
    var overtoneGain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);

    overtone.type = 'triangle';
    overtone.frequency.setValueAtTime(freq * 2, t);
    overtoneGain.gain.setValueAtTime(0.14, t);

    env.gain.setValueAtTime(0.0001, t);
    env.gain.linearRampToValueAtTime(vol, t + 0.018);
    env.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    osc.connect(env);
    overtone.connect(overtoneGain);
    overtoneGain.connect(env);

    env.connect(masterGain);
    if (delayBus) env.connect(delayBus);

    osc.start(t);
    overtone.start(t);
    osc.stop(t + dur + 0.05);
    overtone.stop(t + dur + 0.05);
  }

  function playPadChord(freqs, startTime, duration) {
    if (!audioCtx || !masterGain) return;
    var t = startTime || audioCtx.currentTime;
    var dur = duration || 3.1;

    var padFilter = audioCtx.createBiquadFilter();
    padFilter.type = 'lowpass';
    padFilter.frequency.setValueAtTime(750, t);

    var env = audioCtx.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.linearRampToValueAtTime(0.032, t + 0.9);
    env.gain.setValueAtTime(0.032, t + dur - 0.9);
    env.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    padFilter.connect(env);
    env.connect(masterGain);

    freqs.forEach(function (f, idx) {
      var osc = audioCtx.createOscillator();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(f, t);
      osc.detune.setValueAtTime(idx % 2 === 0 ? -5 : 5, t);
      osc.connect(padFilter);
      osc.start(t);
      osc.stop(t + dur + 0.05);
    });
  }

  function playSparkleChime(notes, spacing, vol) {
    if (!musicPlaying || !ensureAudio()) return;
    var now = audioCtx.currentTime;
    notes.forEach(function (f, i) {
      playBellNote(f, now + i * (spacing || 0.075), 1.4, vol || 0.08);
    });
  }

  function tickMusic() {
    if (!musicPlaying || !audioCtx) return;
    var barIndex = Math.floor(stepCursor / 8) % BARS.length;
    var noteIndex = stepCursor % 8;
    var bar = BARS[barIndex];
    var now = audioCtx.currentTime;

    if (noteIndex === 0) {
      playPadChord(bar.pad, now, 3.05);
    }
    var freq = bar.notes[noteIndex];
    if (freq) {
      playBellNote(freq, now, 2.2, noteIndex % 2 === 0 ? 0.11 : 0.075);
    }
    stepCursor = (stepCursor + 1) % (BARS.length * 8);
  }

  function updateMusicUI() {
    if (!musicToggle) return;
    musicToggle.setAttribute('aria-pressed', String(musicPlaying));
    musicToggle.setAttribute('aria-label', musicPlaying ? 'Mute background music' : 'Play background music');
    if (musicIcon) {
      musicIcon.classList.toggle('ph-speaker-high', musicPlaying);
      musicIcon.classList.toggle('ph-speaker-slash', !musicPlaying);
    }
  }

  function startMusic() {
    if (!ensureAudio()) return;
    if (musicPlaying) return;
    musicPlaying = true;
    updateMusicUI();
    tickMusic();
    musicTimer = window.setInterval(tickMusic, 375);
  }

  function stopMusic() {
    musicPlaying = false;
    if (musicTimer) {
      window.clearInterval(musicTimer);
      musicTimer = null;
    }
    updateMusicUI();
  }

  if (musicToggle) {
    musicToggle.addEventListener('click', function () {
      if (musicPlaying) {
        stopMusic();
      } else {
        startMusic();
      }
    });
  }

  // Pause audio if she locks her phone or switches tabs
  document.addEventListener('visibilitychange', function () {
    if (!audioCtx) return;
    if (document.hidden && musicPlaying) {
      audioCtx.suspend();
    } else if (!document.hidden && musicPlaying && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  });

  // =========================================================================
  // Particle burst (hearts & sparkles)
  // =========================================================================
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

  // =========================================================================
  // Step navigation
  // =========================================================================
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

  // =========================================================================
  // Reason sub-deck inside Step 3
  // =========================================================================
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
      playSparkleChime([N.G5, N.C6], 0.07, 0.065);
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
        playSparkleChime([N.E5, N.G5, N.C6], 0.07, 0.075);
        showStep(4);
      }
    });
  }

  // =========================================================================
  // Envelope open & replay
  // =========================================================================
  if (openBtn) {
    openBtn.addEventListener('click', function () {
      startMusic();
      playSparkleChime([N.C5, N.E5, N.G5, N.B5, N.C6, N.E6], 0.065, 0.09);
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

  // =========================================================================
  // Next / Prev step buttons & top progress dots
  // =========================================================================
  document.querySelectorAll('[data-next-step]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      spawnParticles(12, btn.getBoundingClientRect());
      playSparkleChime([N.G5, N.C6], 0.07, 0.07);
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

  // =========================================================================
  // Mobile touch swipe navigation between unlocked steps
  // =========================================================================
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

    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) {
        if (currentStep === 3 && currentReason < reasonPanels.length - 1) {
          showReason(currentReason + 1, true);
        } else if (currentStep < 4) {
          showStep(currentStep + 1);
        }
      } else {
        if (currentStep === 3 && currentReason > 0) {
          showReason(currentReason - 1, false);
        } else if (currentStep > 1) {
          showStep(currentStep - 1);
        }
      }
    }
  }, { passive: true });

  // =========================================================================
  // Virtual Hug Button & Love Meter
  // =========================================================================
  var hugCount = 0;
  var HUG_MESSAGES = [
    'Virtual hug delivered! Maluuka is officially the most loved wifey on Earth.',
    'Another big hug sent! Sending all my love to my favorite girl.',
    'Hug x3! Warning: Wifey love levels are off the charts.',
    'Unlimited hugs unlocked! You deserve all the happiness in the world, my wifey.',
    'Maximum love reached! Forever grateful to call you my wifey.'
  ];

  if (hugBtn) {
    hugBtn.addEventListener('click', function () {
      hugCount += 1;
      playSparkleChime([N.F5, N.A5, N.C6, N.E6], 0.06, 0.085);
      spawnParticles(22, hugBtn.getBoundingClientRect());
      if (hugStatus) {
        var msg = HUG_MESSAGES[(hugCount - 1) % HUG_MESSAGES.length];
        hugStatus.textContent = msg + ' (Hugs: ' + hugCount + ' • Love: ∞)';
      }
    });
  }
})();
