// X3rœ Music Page: Native HTML5 Audio Player, Interactive Catalog & Tracklist, and MediaSession API.
(function () {
  'use strict';

  // Keep literal Phosphor classes in a comment so tools/icons.py bundles them:
  // ph-fill ph-play ph-fill ph-pause ph-fill ph-skip-back ph-fill ph-skip-forward
  // ph-bold ph-repeat ph-fill ph-speaker-high ph-fill ph-speaker-slash

  var TRACKS = [
    {
      id: 'afterimage',
      title: 'Afterimage (feat. Nakadate)',
      release: 'Afterimage • Single',
      group: 'singles',
      src: '/assets/audio/afterimage.m4a',
      cover: '/cover_afterimage.jpg',
      duration: '4:20',
      durationSec: 260
    },
    {
      id: 'bodytalk',
      title: 'BODYTALK',
      release: 'BODYTALK • Single',
      group: 'singles',
      src: '/assets/audio/bodytalk.m4a',
      cover: '/cover_bodytalk.jpg',
      duration: '2:58',
      durationSec: 178
    },
    {
      id: 'velvet-plan',
      title: 'Velvet Plan',
      release: 'Midnight Blue • EP',
      group: 'midnight',
      src: '/assets/audio/velvet-plan.m4a',
      cover: '/cover_midnight.jpg',
      duration: '3:39',
      durationSec: 219
    },
    {
      id: 'ephemeral',
      title: 'Ephemeral (feat. Limi)',
      release: 'Midnight Blue • EP',
      group: 'midnight',
      src: '/assets/audio/ephemeral.m4a',
      cover: '/cover_midnight.jpg',
      duration: '3:42',
      durationSec: 222
    },
    {
      id: 'hotel-skin',
      title: 'Hotel Skin',
      release: 'Midnight Blue • EP',
      group: 'midnight',
      src: '/assets/audio/hotel-skin.m4a',
      cover: '/cover_midnight.jpg',
      duration: '3:09',
      durationSec: 189
    },
    {
      id: 'room-42',
      title: 'Room 42',
      release: 'Midnight Blue • EP',
      group: 'midnight',
      src: '/assets/audio/room-42.m4a',
      cover: '/cover_midnight.jpg',
      duration: '3:10',
      durationSec: 190
    },
    {
      id: 'secrets-of-my-soul',
      title: 'Secrets of My Soul',
      release: 'Midnight Blue • EP',
      group: 'midnight',
      src: '/assets/audio/secrets-of-my-soul.m4a',
      cover: '/cover_midnight.jpg',
      duration: '2:55',
      durationSec: 175
    },
    {
      id: 'the-undertow',
      title: 'The Undertow',
      release: 'Midnight Blue • EP',
      group: 'midnight',
      src: '/assets/audio/the-undertow.m4a',
      cover: '/cover_midnight.jpg',
      duration: '4:14',
      durationSec: 254
    },
    {
      id: 'xero-2',
      title: 'Xer0 2.0',
      release: 'Xero, Vol. 2 • Album',
      group: 'xero',
      src: '/assets/audio/xero-2.m4a',
      cover: '/cover_xero.jpg',
      duration: '2:48',
      durationSec: 168
    },
    {
      id: 'lost-in-you',
      title: 'Lost In You',
      release: 'Anti-social • EP',
      group: 'antisocial',
      src: '/assets/audio/lost-in-you.m4a',
      cover: '/cover_antisocial.jpg',
      duration: '4:19',
      durationSec: 259
    }
  ];

  var audio = new Audio();
  audio.preload = 'metadata';

  var currentIndex = 0;
  var isPlaying = false;
  var isSeeking = false;

  // DOM Elements
  var playerBar = document.getElementById('player-bar');
  var playerCover = document.getElementById('player-cover');
  var playerTitle = document.getElementById('player-title');
  var playerSubtitle = document.getElementById('player-subtitle');
  var playerToggle = document.getElementById('player-toggle');
  var playerToggleIcon = document.getElementById('player-toggle-icon');
  var playerPrev = document.getElementById('player-prev');
  var playerNext = document.getElementById('player-next');
  var playerLoop = document.getElementById('player-loop');
  var playerSeek = document.getElementById('player-seek');
  var playerCurrentTime = document.getElementById('player-current-time');
  var playerDuration = document.getElementById('player-duration');
  var playerMute = document.getElementById('player-mute');
  var playerMuteIcon = document.getElementById('player-mute-icon');
  var playerVolume = document.getElementById('player-volume');

  var heroVinyl = document.getElementById('hero-vinyl');
  var heroVinylArt = document.getElementById('hero-vinyl-art');
  var heroPlayBtn = document.getElementById('hero-play-btn');
  var heroPlayIcon = document.getElementById('hero-play-icon');
  var heroPlayLabel = document.getElementById('hero-play-label');

  var trackButtons = Array.prototype.slice.call(document.querySelectorAll('[data-track-id]'));
  var releaseButtons = Array.prototype.slice.call(document.querySelectorAll('[data-release-play]'));
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter-group]'));

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

    // Hero vinyl & hero button state
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
      heroPlayLabel.textContent = afterimagePlaying ? 'Pause Track' : 'Play Track';
    }

    // Tracklist rows
    trackButtons.forEach(function (btn) {
      var id = btn.getAttribute('data-track-id');
      var active = id === track.id;
      var rowPlaying = active && isPlaying;
      btn.setAttribute('aria-current', active ? 'true' : 'false');
      btn.classList.toggle('is-active', active);
      btn.classList.toggle('is-playing', rowPlaying);

      var icon = btn.querySelector('[data-row-icon]');
      if (icon) {
        icon.classList.toggle('ph-pause', rowPlaying);
        icon.classList.toggle('ph-play', !rowPlaying);
      }
    });

    // Release cards in Catalog
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

    var track = TRACKS[index];
    var changed = currentIndex !== index || !audio.src;
    currentIndex = index;

    if (changed) {
      audio.src = track.src;
      if (playerCurrentTime) playerCurrentTime.textContent = '0:00';
      if (playerDuration) playerDuration.textContent = track.duration;
      if (playerSeek) playerSeek.value = '0';
      updateSeekVisual(0);
      updateMediaSession(track);
    }

    if (playerBar) {
      playerBar.removeAttribute('hidden');
    }

    if (autoplay) {
      var playPromise = audio.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise.then(function () {
          isPlaying = true;
          syncUI();
        }).catch(function () {
          isPlaying = false;
          syncUI();
        });
      } else {
        isPlaying = true;
        syncUI();
      }
    } else {
      syncUI();
    }
  }

  function togglePlay() {
    if (!audio.src) {
      loadTrack(currentIndex, true);
      return;
    }
    if (audio.paused) {
      audio.play().then(function () {
        isPlaying = true;
        syncUI();
      }).catch(function () {
        isPlaying = false;
        syncUI();
      });
    } else {
      audio.pause();
      isPlaying = false;
      syncUI();
    }
  }

  function playTrackById(id) {
    var idx = -1;
    for (var i = 0; i < TRACKS.length; i++) {
      if (TRACKS[i].id === id) {
        idx = i;
        break;
      }
    }
    if (idx === -1) return;

    if (currentIndex === idx && audio.src) {
      togglePlay();
    } else {
      loadTrack(idx, true);
    }
  }

  // ---- Audio element events ----
  audio.addEventListener('loadedmetadata', function () {
    if (playerDuration && isFinite(audio.duration) && audio.duration > 0) {
      playerDuration.textContent = formatTime(audio.duration);
    }
  });

  audio.addEventListener('timeupdate', function () {
    if (isSeeking) return;
    var cur = audio.currentTime || 0;
    var dur = isFinite(audio.duration) && audio.duration > 0
      ? audio.duration
      : TRACKS[currentIndex].durationSec;
    if (playerCurrentTime) playerCurrentTime.textContent = formatTime(cur);
    if (playerSeek && dur > 0) {
      var pct = (cur / dur) * 100;
      playerSeek.value = String(pct);
      updateSeekVisual(pct);
    }
  });

  audio.addEventListener('play', function () {
    isPlaying = true;
    syncUI();
  });

  audio.addEventListener('pause', function () {
    isPlaying = false;
    syncUI();
  });

  audio.addEventListener('ended', function () {
    if (audio.loop) return;
    loadTrack(currentIndex + 1, true);
  });

  // ---- Controls ----
  if (playerToggle) {
    playerToggle.addEventListener('click', togglePlay);
  }
  if (playerPrev) {
    playerPrev.addEventListener('click', function () {
      if (audio.currentTime > 3) {
        audio.currentTime = 0;
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
  if (playerLoop) {
    playerLoop.addEventListener('click', function () {
      audio.loop = !audio.loop;
      playerLoop.setAttribute('aria-pressed', String(audio.loop));
    });
  }

  if (playerSeek) {
    playerSeek.addEventListener('input', function () {
      isSeeking = true;
      var pct = parseFloat(playerSeek.value) || 0;
      updateSeekVisual(pct);
      var dur = isFinite(audio.duration) && audio.duration > 0
        ? audio.duration
        : TRACKS[currentIndex].durationSec;
      if (playerCurrentTime && dur > 0) {
        playerCurrentTime.textContent = formatTime((pct / 100) * dur);
      }
    });
    playerSeek.addEventListener('change', function () {
      var pct = parseFloat(playerSeek.value) || 0;
      if (!audio.src) {
        loadTrack(currentIndex, false);
      }
      var dur = isFinite(audio.duration) && audio.duration > 0
        ? audio.duration
        : TRACKS[currentIndex].durationSec;
      if (dur > 0) {
        try {
          audio.currentTime = (pct / 100) * dur;
        } catch (e) {
          // Ignore if metadata not ready yet
        }
      }
      isSeeking = false;
    });
  }

  function updateMuteUI() {
    var muted = audio.muted || audio.volume === 0;
    if (playerMute) {
      playerMute.setAttribute('aria-pressed', String(muted));
      playerMute.setAttribute('aria-label', muted ? 'Unmute audio' : 'Mute audio');
    }
    if (playerMuteIcon) {
      playerMuteIcon.classList.toggle('ph-speaker-slash', muted);
      playerMuteIcon.classList.toggle('ph-speaker-high', !muted);
    }
  }

  if (playerMute) {
    playerMute.addEventListener('click', function () {
      audio.muted = !audio.muted;
      updateMuteUI();
    });
  }

  if (playerVolume) {
    playerVolume.addEventListener('input', function () {
      var val = parseFloat(playerVolume.value);
      audio.volume = Math.max(0, Math.min(1, val));
      playerVolume.style.setProperty('--seek-pct', (audio.volume * 100).toFixed(1) + '%');
      if (audio.volume > 0 && audio.muted) {
        audio.muted = false;
      }
      updateMuteUI();
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

  // ---- Tracklist rows & Catalog release cards ----
  trackButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-track-id');
      playTrackById(id);
    });
  });

  releaseButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var firstId = btn.getAttribute('data-release-play');
      var group = btn.getAttribute('data-release-group');
      var currentTrack = TRACKS[currentIndex];
      if (group && currentTrack && currentTrack.group === group && audio.src) {
        togglePlay();
      } else {
        playTrackById(firstId);
      }
    });
  });

  // ---- Tracklist filter tabs ----
  filterButtons.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var filter = tab.getAttribute('data-filter-group');
      filterButtons.forEach(function (b) {
        b.setAttribute('aria-pressed', String(b === tab));
      });
      trackButtons.forEach(function (row) {
        var rowGroup = row.getAttribute('data-track-group');
        var visible = filter === 'all' || rowGroup === filter || (filter === 'albums' && (rowGroup === 'xero' || rowGroup === 'antisocial'));
        row.hidden = !visible;
      });
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

  // Initialise UI with Track 0 ready in the dock
  syncUI();
  updateSeekVisual(0);
})();
