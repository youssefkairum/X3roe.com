// X3rœ Music Page: Minimalist Native Audio Player with Instant Pre-Buffered Playback.
(function () {
  'use strict';

  // Keep literal Phosphor classes in a comment so tools/icons.py bundles them:
  // ph-fill ph-play ph-fill ph-pause ph-fill ph-skip-back ph-fill ph-skip-forward

  var TRACKS = [
    {
      id: 'afterimage',
      title: 'Afterimage (feat. Nakadate)',
      release: 'Single',
      group: 'singles',
      src: '/assets/audio/afterimage.m4a',
      cover: '/cover_afterimage.jpg',
      duration: '4:20',
      durationSec: 260
    },
    {
      id: 'bodytalk',
      title: 'BODYTALK',
      release: 'Single',
      group: 'singles',
      src: '/assets/audio/bodytalk.m4a',
      cover: '/cover_bodytalk.jpg',
      duration: '2:58',
      durationSec: 178
    },
    {
      id: 'velvet-plan',
      title: 'Velvet Plan',
      release: 'Midnight Blue EP',
      group: 'midnight',
      src: '/assets/audio/velvet-plan.m4a',
      cover: '/cover_midnight.jpg',
      duration: '3:39',
      durationSec: 219
    },
    {
      id: 'ephemeral',
      title: 'Ephemeral (feat. Limi)',
      release: 'Midnight Blue EP',
      group: 'midnight',
      src: '/assets/audio/ephemeral.m4a',
      cover: '/cover_midnight.jpg',
      duration: '3:42',
      durationSec: 222
    },
    {
      id: 'hotel-skin',
      title: 'Hotel Skin',
      release: 'Midnight Blue EP',
      group: 'midnight',
      src: '/assets/audio/hotel-skin.m4a',
      cover: '/cover_midnight.jpg',
      duration: '3:09',
      durationSec: 189
    },
    {
      id: 'room-42',
      title: 'Room 42',
      release: 'Midnight Blue EP',
      group: 'midnight',
      src: '/assets/audio/room-42.m4a',
      cover: '/cover_midnight.jpg',
      duration: '3:10',
      durationSec: 190
    },
    {
      id: 'secrets-of-my-soul',
      title: 'Secrets of My Soul',
      release: 'Midnight Blue EP',
      group: 'midnight',
      src: '/assets/audio/secrets-of-my-soul.m4a',
      cover: '/cover_midnight.jpg',
      duration: '2:55',
      durationSec: 175
    },
    {
      id: 'the-undertow',
      title: 'The Undertow',
      release: 'Midnight Blue EP',
      group: 'midnight',
      src: '/assets/audio/the-undertow.m4a',
      cover: '/cover_midnight.jpg',
      duration: '4:13',
      durationSec: 253
    },
    {
      id: 'xero-2',
      title: 'Xer0 2.0',
      release: 'Xero, Vol. 2',
      group: 'xero',
      src: '/assets/audio/xero-2.m4a',
      cover: '/cover_xero.jpg',
      duration: '2:44',
      durationSec: 164
    },
    {
      id: 'lost-in-you',
      title: 'Lost In You',
      release: 'Anti-social EP',
      group: 'antisocial',
      src: '/assets/audio/lost-in-you.m4a',
      cover: '/cover_antisocial.jpg',
      duration: '4:19',
      durationSec: 259
    }
  ];

  var currentIndex = 0;
  var isPlaying = false;
  var isSeeking = false;
  var audioPool = {};

  // DOM Elements
  var playerBar = document.getElementById('player-bar');
  var playerCover = document.getElementById('player-cover');
  var playerTitle = document.getElementById('player-title');
  var playerSubtitle = document.getElementById('player-subtitle');
  var playerTime = document.getElementById('player-time');
  var playerToggle = document.getElementById('player-toggle');
  var playerToggleIcon = document.getElementById('player-toggle-icon');
  var playerPrev = document.getElementById('player-prev');
  var playerNext = document.getElementById('player-next');
  var playerSeek = document.getElementById('player-seek');

  var heroVinyl = document.getElementById('hero-vinyl');
  var heroVinylArt = document.getElementById('hero-vinyl-art');
  var heroPlayBtn = document.getElementById('hero-play-btn');
  var heroPlayIcon = document.getElementById('hero-play-icon');
  var heroPlayLabel = document.getElementById('hero-play-label');

  var releaseButtons = Array.prototype.slice.call(document.querySelectorAll('[data-release-play]'));

  function formatTime(sec) {
    if (!isFinite(sec) || sec < 0) return '0:00';
    var total = Math.floor(sec);
    var m = Math.floor(total / 60);
    var s = total % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function updateSeekVisual(pct) {
    if (!playerSeek) return;
    var clamped = Math.max(0, Math.min(100, pct || 0));
    playerSeek.style.setProperty('--seek-pct', clamped.toFixed(2) + '%');
  }

  function updateMediaSession(track) {
    if (!('mediaSession' in navigator) || !track) return;
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: 'X3rœ',
        album: track.release,
        artwork: [
          { src: track.cover, sizes: '640x640', type: 'image/jpeg' }
        ]
      });
    } catch (e) {
      // Ignore if MediaMetadata is unsupported
    }
  }

  // Create and reuse a dedicated Audio instance per track so Safari/Chrome keep its decoded buffer ready
  function getAudio(index) {
    var track = TRACKS[index];
    if (!track) return null;
    if (!audioPool[track.id]) {
      var a = new Audio();
      a.preload = 'auto';
      a.src = track.src;
      a.load();

      a.addEventListener('timeupdate', function () {
        if (currentIndex !== index || isSeeking) return;
        var cur = a.currentTime || 0;
        var dur = isFinite(a.duration) && a.duration > 0 ? a.duration : track.durationSec;
        if (playerTime) {
          playerTime.textContent = formatTime(cur) + ' / ' + (isFinite(a.duration) && a.duration > 0 ? formatTime(a.duration) : track.duration);
        }
        if (playerSeek && dur > 0) {
          var pct = (cur / dur) * 100;
          playerSeek.value = String(pct);
          updateSeekVisual(pct);
        }
      });

      a.addEventListener('play', function () {
        if (currentIndex !== index) return;
        isPlaying = true;
        syncUI();
      });

      a.addEventListener('pause', function () {
        if (currentIndex !== index) return;
        isPlaying = false;
        syncUI();
      });

      a.addEventListener('ended', function () {
        if (currentIndex !== index) return;
        loadTrack(currentIndex + 1, true);
      });

      audioPool[track.id] = a;
    }
    return audioPool[track.id];
  }

  function findIndexById(id) {
    for (var i = 0; i < TRACKS.length; i++) {
      if (TRACKS[i].id === id) return i;
    }
    return -1;
  }

  // Pre-buffer Hero track immediately, and pre-buffer the 4 Catalog cover tracks shortly after
  getAudio(0);
  window.setTimeout(function () {
    ['bodytalk', 'velvet-plan', 'xero-2', 'lost-in-you'].forEach(function (id) {
      var idx = findIndexById(id);
      if (idx !== -1) getAudio(idx);
    });
  }, 350);

  function syncUI() {
    var track = TRACKS[currentIndex];
    if (!track) return;

    if (playerCover) playerCover.src = track.cover;
    if (playerTitle) playerTitle.textContent = track.title;
    if (playerSubtitle) playerSubtitle.textContent = track.release;

    if (playerToggle) {
      playerToggle.setAttribute('aria-label', isPlaying ? 'Pause ' + track.title : 'Play ' + track.title);
    }
    if (playerToggleIcon) {
      playerToggleIcon.classList.toggle('ph-pause', isPlaying);
      playerToggleIcon.classList.toggle('ph-play', !isPlaying);
    }

    if (heroVinyl) {
      heroVinyl.classList.toggle('is-spinning', isPlaying);
    }
    if (heroVinylArt) {
      heroVinylArt.src = track.cover;
    }
    if (heroPlayBtn && heroPlayIcon && heroPlayLabel) {
      var afterimagePlaying = isPlaying && track.id === 'afterimage';
      heroPlayIcon.classList.toggle('ph-pause', afterimagePlaying);
      heroPlayIcon.classList.toggle('ph-play', !afterimagePlaying);
      heroPlayLabel.textContent = afterimagePlaying ? 'Pause' : 'Listen Now';
    }

    releaseButtons.forEach(function (btn) {
      var firstId = btn.getAttribute('data-release-play');
      var group = btn.getAttribute('data-release-group');
      var activeRelease = group ? track.group === group : track.id === firstId;
      var releasePlaying = activeRelease && isPlaying;
      btn.classList.toggle('is-playing', releasePlaying);
      btn.setAttribute('aria-label', (releasePlaying ? 'Pause ' : 'Play ') + (btn.getAttribute('data-release-name') || 'release'));
      var icon = btn.querySelector('i');
      if (icon) {
        icon.classList.toggle('ph-pause', releasePlaying);
        icon.classList.toggle('ph-play', !releasePlaying);
      }
    });
  }

  function loadTrack(index, autoplay) {
    if (index < 0) index = TRACKS.length - 1;
    if (index >= TRACKS.length) index = 0;

    var prevAudio = getAudio(currentIndex);
    if (prevAudio && currentIndex !== index) {
      prevAudio.pause();
      try { prevAudio.currentTime = 0; } catch (e) {}
    }

    currentIndex = index;
    var track = TRACKS[index];
    var a = getAudio(index);

    if (playerTime) playerTime.textContent = '0:00 / ' + track.duration;
    if (playerSeek) playerSeek.value = '0';
    updateSeekVisual(0);
    updateMediaSession(track);

    if (playerBar) {
      playerBar.removeAttribute('hidden');
    }

    // Warm the next track in queue
    getAudio((index + 1) % TRACKS.length);

    if (autoplay && a) {
      isPlaying = true;
      syncUI();
      var playPromise = a.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          isPlaying = false;
          syncUI();
        });
      }
    } else {
      syncUI();
    }
  }

  function togglePlay() {
    if (playerBar) {
      playerBar.removeAttribute('hidden');
    }
    var a = getAudio(currentIndex);
    if (!a) return;

    if (a.paused) {
      isPlaying = true;
      syncUI();
      getAudio((currentIndex + 1) % TRACKS.length);
      var playPromise = a.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          isPlaying = false;
          syncUI();
        });
      }
    } else {
      a.pause();
      isPlaying = false;
      syncUI();
    }
  }

  function playTrackById(id) {
    var idx = findIndexById(id);
    if (idx === -1) return;

    if (currentIndex === idx) {
      togglePlay();
    } else {
      loadTrack(idx, true);
    }
  }

  // ---- Controls ----
  if (playerToggle) {
    playerToggle.addEventListener('click', togglePlay);
  }
  if (playerPrev) {
    playerPrev.addEventListener('click', function () {
      var a = getAudio(currentIndex);
      if (a && a.currentTime > 3) {
        a.currentTime = 0;
      } else {
        loadTrack(currentIndex - 1, true);
      }
    });
  }
  if (playerNext) {
    playerNext.addEventListener('click', function () {
      loadTrack(currentIndex + 1, true);
    });
  }

  if (playerSeek) {
    playerSeek.addEventListener('input', function () {
      isSeeking = true;
      var pct = parseFloat(playerSeek.value) || 0;
      updateSeekVisual(pct);
      var track = TRACKS[currentIndex];
      var a = getAudio(currentIndex);
      var dur = a && isFinite(a.duration) && a.duration > 0 ? a.duration : track.durationSec;
      if (playerTime && dur > 0) {
        playerTime.textContent = formatTime((pct / 100) * dur) + ' / ' + formatTime(dur);
      }
    });
    playerSeek.addEventListener('change', function () {
      var pct = parseFloat(playerSeek.value) || 0;
      var track = TRACKS[currentIndex];
      var a = getAudio(currentIndex);
      var dur = a && isFinite(a.duration) && a.duration > 0 ? a.duration : track.durationSec;
      if (a && dur > 0) {
        try {
          a.currentTime = (pct / 100) * dur;
        } catch (e) {}
      }
      isSeeking = false;
    });
  }

  // ---- Hero buttons & Vinyl click ----
  if (heroPlayBtn) {
    heroPlayBtn.addEventListener('click', function () {
      playTrackById('afterimage');
    });
  }
  if (heroVinyl) {
    heroVinyl.addEventListener('click', function () {
      togglePlay();
    });
  }

  // ---- Catalog release cards ----
  releaseButtons.forEach(function (btn) {
    var firstId = btn.getAttribute('data-release-play');
    var group = btn.getAttribute('data-release-group');

    var warm = function () {
      var idx = findIndexById(firstId);
      if (idx !== -1) getAudio(idx);
    };
    btn.addEventListener('mouseenter', warm, { passive: true });
    btn.addEventListener('touchstart', warm, { passive: true });
    btn.addEventListener('focus', warm, { passive: true });

    btn.addEventListener('click', function () {
      var currentTrack = TRACKS[currentIndex];
      if (group && currentTrack && currentTrack.group === group) {
        togglePlay();
      } else {
        playTrackById(firstId);
      }
    });
  });

  // ---- MediaSession hardware key handlers ----
  if ('mediaSession' in navigator) {
    try {
      navigator.mediaSession.setActionHandler('play', function () { togglePlay(); });
      navigator.mediaSession.setActionHandler('pause', function () { togglePlay(); });
      navigator.mediaSession.setActionHandler('previoustrack', function () { loadTrack(currentIndex - 1, true); });
      navigator.mediaSession.setActionHandler('nexttrack', function () { loadTrack(currentIndex + 1, true); });
    } catch (e) {
      // Ignore unsupported actions
    }
  }

  syncUI();
  updateSeekVisual(0);
})();
