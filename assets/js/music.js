// X3rœ Music Pages (music.html, bodytalk.html, midnight-blue.html):
// Minimalist Native Audio Player with Instant Pre-Buffered Playback & Time-Synced Lyrics.
(function () {
  'use strict';

  // Keep literal Phosphor classes in a comment so tools/icons.py bundles them:
  // ph-fill ph-play ph-fill ph-pause ph-fill ph-skip-back ph-fill ph-skip-forward

  var TRACKS = [
    {
      id: 'afterimage',
      title: 'Afterimage (feat. Nakadate)',
      release: 'Single',
      group: 'afterimage',
      src: '/assets/audio/afterimage.m4a',
      cover: '/cover_afterimage.jpg',
      duration: '4:20',
      durationSec: 260,
      lyrics: [
        { t: 0, text: '♪ Instrumental Intro ♪' },
        { t: 45.18, text: 'The window hums with faded rain' },
        { t: 51.13, text: 'Your outline moves inside my brain' },
        { t: 57.13, text: 'You left your shirt upon the chair' },
        { t: 62.99, text: 'It still pretends that you are there' },
        { t: 68.95, text: 'I watch the dust drift through the air' },
        { t: 74.87, text: 'It’s how you vanish — soft, aware' },
        { t: 84.07, text: 'You fade like smoke in the light' },
        { t: 90.10, text: 'A dream that breaks when I try to hold tight' },
        { t: 95.82, text: 'Every breath still carries your name' },
        { t: 100.72, text: 'But nothing ever feels the same' },
        { t: 110.37, text: 'Your voice returns in radio waves' },
        { t: 116.67, text: 'Low and distant, through the haze' },
        { t: 122.39, text: 'I close my eyes to hear it clear' },
        { t: 128.21, text: 'It sounds like love, it sounds like fear' },
        { t: 134.07, text: 'You’re everywhere and never near' },
        { t: 140.05, text: 'A ghost that whispers in my ear' },
        { t: 149.35, text: 'You fade like smoke in the light' },
        { t: 155.32, text: 'A dream that breaks when I try to hold tight' },
        { t: 161.18, text: 'Every breath still carries your name' },
        { t: 165.92, text: 'But nothing ever feels the same' },
        { t: 174.35, text: 'Maybe love was just a blur' },
        { t: 179.93, text: 'Soft edges, nothing sure' },
        { t: 186.09, text: 'I keep replaying what we were' },
        { t: 191.05, text: 'Till silence starts to stir' },
        { t: 221.50, text: 'The room still breathes your shadow slow' },
        { t: 227.45, text: 'I never learned to let you go' },
        { t: 232.26, text: 'You fade, you fade — into the light' },
        { t: 240.08, text: 'And I just watch, through endless night' }
      ]
    },
    {
      id: 'bodytalk',
      title: 'BODYTALK',
      release: 'Single',
      group: 'bodytalk',
      src: '/assets/audio/bodytalk.m4a',
      cover: '/cover_bodytalk.jpg',
      duration: '2:58',
      durationSec: 178,
      lyrics: [
        { t: 0, text: '♪ Instrumental Intro ♪' },
        { t: 18.77, text: 'You walk in like a midnight sin' },
        { t: 23.80, text: 'Perfume mixed with smoke and gin' },
        { t: 28.99, text: 'Every curve you’ve got’s a crime' },
        { t: 33.75, text: 'And I keep doing time' },
        { t: 39.97, text: 'Your beauty’s cold, it cuts so deep' },
        { t: 45.03, text: 'You make me beg, you make me bleed' },
        { t: 48.96, text: 'Your body speaks in tongues I crave' },
        { t: 54.51, text: 'But your words could dig a grave' },
        { t: 59.11, text: 'I try to love the fire inside' },
        { t: 64.19, text: 'But girl, you burn and never cry' },
        { t: 72.25, text: 'Your body never lies to me' },
        { t: 77.27, text: 'But your soul’s a mystery' },
        { t: 80.47, text: 'You taste like heaven, talk like pain' },
        { t: 82.90, text: 'I lose myself then curse your name' },
        { t: 85.52, text: 'Yeah, your body’s holy, but your heart’s a war' },
        { t: 88.86, text: 'And I keep crawling back for more' },
        { t: 94.80, text: 'You love me just to feel control' },
        { t: 100.05, text: 'Then vanish deep inside your soul' },
        { t: 104.93, text: 'Every kiss is a sweet disguise' },
        { t: 108.90, text: 'I see the truth behind your eyes' },
        { t: 115.93, text: 'You call it love, I call it need' },
        { t: 120.97, text: 'We plant the hurt and let it bleed' },
        { t: 125.37, text: 'You’re poison dressed in angel skin' },
        { t: 128.33, text: 'A war I’ll never win' },
        { t: 130.12, text: 'Still I drink you like my sin' },
        { t: 133.05, text: 'And fall right back again' },
        { t: 134.98, text: 'So let the night erase my pride' },
        { t: 140.57, text: 'Your shadow’s where I hide' },
        { t: 146.27, text: 'Your body saves me, your heart destroys' },
        { t: 151.63, text: 'But I still chase the noise' }
      ]
    },
    {
      id: 'velvet-plan',
      title: 'Velvet Plan',
      release: 'Midnight Blue EP',
      group: 'midnight',
      src: '/assets/audio/velvet-plan.m4a',
      cover: '/cover_midnight.jpg',
      duration: '3:39',
      durationSec: 219,
      lyrics: [
        { t: 0, text: '♪ Instrumental Intro ♪' },
        { t: 19.50, text: 'Cut a name off her wrist, didn’t ask for it' },
        { t: 25.42, text: 'She don’t know I exist, but I track the orbit' },
        { t: 30.74, text: 'Another face in the smoke, another ghost in the bed' },
        { t: 37.42, text: 'I keep loving ’em slow just to break them instead' },
        { t: 41.50, text: 'She smells like danger, talks like fate' },
        { t: 44.56, text: 'But I see five of her when it’s getting late' },
        { t: 47.22, text: 'Candles flicker like they know my sins' },
        { t: 49.90, text: 'Every time I lose one, I pull another in' },
        { t: 52.42, text: 'Told them all you’re the only one, like a prayer with a loaded gun' },
        { t: 57.62, text: 'Split in pieces, don’t know who I am — just a hollow heart with a velvet plan' },
        { t: 63.46, text: 'I can’t touch love without bleeding, can’t stop hearts without feeding' },
        { t: 73.10, text: 'Every mirror shows a lie I made, and they fall for me just to fade' },
        { t: 79.42, text: 'No names left on my tongue, just perfume and the damage done' },
        { t: 84.42, text: 'They loved a ghost with a bleeding crown' },
        { t: 87.20, text: 'Now they’re buried in my breakdown' },
        { t: 91.78, text: 'I watch them breathe like I need their breath, trace their scars then I steal what’s left' },
        { t: 100.78, text: 'I’m not cruel, just a slave to need — love turns black when a soul won’t bleed' },
        { t: 106.20, text: 'They say obsession’s just love in chains' },
        { t: 108.98, text: 'But I break them all when they learn my name' },
        { t: 111.54, text: 'I dress it up like a sweet romance' },
        { t: 114.34, text: 'Then kill the beat when we start to dance' },
        { t: 117.00, text: 'Told them lies in my sweetest voice' },
        { t: 119.80, text: 'Gave them pain and I called it choice' },
        { t: 122.38, text: 'Now my bed feels like a haunted stage' },
        { t: 125.10, text: 'Where every touch writes another page' },
        { t: 128.00, text: 'I can’t touch love without bleeding' },
        { t: 132.10, text: 'Can’t stop hearts without feeding' },
        { t: 137.44, text: 'Every mirror shows a lie I made' },
        { t: 141.00, text: 'And they fall for me just to fade' },
        { t: 143.82, text: 'No names left on my tongue' },
        { t: 146.06, text: 'Just perfume and the damage done' },
        { t: 148.70, text: 'They loved a ghost with a bleeding crown' },
        { t: 151.46, text: 'Now they’re buried in my breakdown' },
        { t: 156.08, text: 'Five shades of heaven, one devil’s grin — can’t love them right, so I let ’em in' },
        { t: 169.98, text: 'They scream my name like it meant escape, but I close the door, now it’s far too late' },
        { t: 179.86, text: 'I love them all in my own sick way, now their shadows beg me to stay' },
        { t: 186.64, text: 'But I’m just a voice in a lover’s scream — a monster built from a broken dream' }
      ]
    },
    {
      id: 'ephemeral',
      title: 'Ephemeral (feat. Limi)',
      release: 'Midnight Blue EP',
      group: 'midnight',
      src: '/assets/audio/ephemeral.m4a',
      cover: '/cover_midnight.jpg',
      duration: '3:42',
      durationSec: 222,
      lyrics: [
        { t: 0, text: '♪ Instrumental Intro ♪' },
        { t: 19.33, text: 'You came through my door like a fever dream' },
        { t: 23.83, text: 'Skin still wet from the city steam' },
        { t: 28.73, text: 'Said you only want it till the light' },
        { t: 33.79, text: 'Now you’re tangled up in me tonight' },
        { t: 39.25, text: 'Liquor on your breath, truth on your tongue' },
        { t: 44.40, text: 'Whispered "I don’t care what we’ve done."' },
        { t: 48.95, text: 'But I see the guilt behind your grin' },
        { t: 53.39, text: 'Every touch drips with original sin' },
        { t: 59.08, text: 'We both know what this night means —' },
        { t: 63.09, text: 'Heaven in between dirty sheets' },
        { t: 68.29, text: 'You said you’d leave before the dawn' },
        { t: 73.00, text: 'But baby, the sun’s already on' },
        { t: 78.93, text: 'Stay till the morning kills the thrill' },
        { t: 83.78, text: 'Till the sun burns what we feel' },
        { t: 89.36, text: 'You taste like love, but it’s not real' },
        { t: 94.27, text: 'Just a wound I don’t want to heal' },
        { t: 99.82, text: 'Your phone lights up, I turn away' },
        { t: 104.74, text: 'Don’t ask my name, I won’t stay' },
        { t: 109.63, text: 'You said I’m poison, I said you’re too —' },
        { t: 114.57, text: 'Now we’re both high on something true' },
        { t: 121.32, text: 'You ride me slow like a prayer denied' },
        { t: 125.85, text: 'Eyes closed tight, tryin’ not to cry' },
        { t: 133.99, text: 'You said "Don’t stop till it’s all undone,"' },
        { t: 138.33, text: 'But baby, it’s gone — here comes the sun' },
        { t: 143.99, text: 'Till the sun burns what we feel' },
        { t: 148.95, text: 'You taste like love, but it’s not real' },
        { t: 154.56, text: 'Just a wound I don’t want to heal' },
        { t: 159.21, text: 'Don’t call this love — it’s just decay' },
        { t: 163.48, text: 'Bodies fade, but the sins stay' },
        { t: 168.87, text: 'When you wake, I’ll be long gone' },
        { t: 173.80, text: 'Another ghost before the dawn' },
        { t: 179.12, text: 'Now the sky turns gold on your skin' },
        { t: 184.11, text: 'Another night that pulls me in' },
        { t: 188.82, text: 'You said forever, but I just run —' },
        { t: 194.20, text: 'We don’t last here, not before the sun' }
      ]
    },
    {
      id: 'hotel-skin',
      title: 'Hotel Skin',
      release: 'Midnight Blue EP',
      group: 'midnight',
      src: '/assets/audio/hotel-skin.m4a',
      cover: '/cover_midnight.jpg',
      duration: '3:09',
      durationSec: 189,
      lyrics: [
        { t: 0, text: '♪ Instrumental Intro ♪' },
        { t: 15.00, text: 'She left her heels by the minibar, her body talkin’ louder than her heart' },
        { t: 22.44, text: 'Told me "Make me feel like I’m the only star," but I just needed somewhere to fall apart' },
        { t: 29.34, text: 'Lipstick stains on my collarbone, she moan my name like she on the throne' },
        { t: 36.94, text: 'I told her, "Baby, this ain’t home" — she said, "I know, just don’t leave me alone"' },
        { t: 42.94, text: 'Now she’s high off my breath, begging for the taste of death' },
        { t: 50.54, text: 'And when I pull her close, she forgets herself — but I’m already somewhere else' },
        { t: 57.74, text: 'I touch to forget, and I kiss to lie — every moment just echoes goodbye' },
        { t: 64.68, text: 'She loves the pain that drips from my smile, but I don’t stay, never been my style' },
        { t: 71.92, text: 'In my hotel skin, I’m a god for the night — fake love under broken lights' },
        { t: 79.72, text: 'She says she feels heaven inside my sin, but I’m gone before the morning begins' },
        { t: 87.50, text: 'Room full of perfume and empty souls, body’s warm but the heart stays cold' },
        { t: 94.40, text: 'She said, "You ruin me, make me whole" — I said, "Baby, that’s how the story goes"' },
        { t: 101.58, text: 'Champagne tears and a pill on her tongue, she said "This is what I’ve always done"' },
        { t: 108.78, text: 'I told her "Me too, don’t fall in love," then I bit her lip just to taste the blood' },
        { t: 117.50, text: 'Don’t ask where I go when it’s done, I’m just a ghost that learned to run' },
        { t: 124.06, text: 'She said "You feel like forever," I laugh — ’cause forever ends after one last gasp' },
        { t: 129.98, text: 'I touch to forget, and I kiss to lie — every moment just echoes goodbye' },
        { t: 137.42, text: 'She loves the pain that drips from my smile, but I don’t stay, never been my style' },
        { t: 144.22, text: 'In my hotel skin, I’m a god for the night — fake love under broken lights' },
        { t: 151.90, text: 'She says she feels heaven inside my sin, but I’m gone before the morning begins' },
        { t: 159.42, text: 'I leave her sleeping in velvet sin, while my soul slips out again' },
        { t: 166.80, text: 'No names, no promises, no winning — just another ghost I left within' }
      ]
    },
    {
      id: 'room-42',
      title: 'Room 42',
      release: 'Midnight Blue EP',
      group: 'midnight',
      src: '/assets/audio/room-42.m4a',
      cover: '/cover_midnight.jpg',
      duration: '3:10',
      durationSec: 190,
      lyrics: [
        { t: 0, text: '♪ Instrumental Intro ♪' },
        { t: 19.50, text: 'This bed was never made for love' },
        { t: 27.06, text: 'You used to call me your drug, now your moans still echo in my head' },
        { t: 33.18, text: 'And your scent won’t leave my sheets, my bed — you move like sin, I’m as cold as glass' },
        { t: 40.28, text: 'You said you’d stay, I never asked — now I wake to your ghost on my chest' },
        { t: 47.68, text: 'And guilt still sleeps where you rest' },
        { t: 52.28, text: 'I was wrong, I was wrong to let you in this room' },
        { t: 58.22, text: 'Now you know how I move, now you taste my truth' },
        { t: 64.82, text: 'You got me weak, I hate that it’s you' },
        { t: 74.62, text: 'You told your girls how I made you shake' },
        { t: 82.28, text: 'Now they all stare, now they all fake' },
        { t: 86.96, text: 'Could’ve kept it quiet, but you love the fame' },
        { t: 92.10, text: 'Now my name’s in your mouth like a praying vein' },
        { t: 95.24, text: 'Two missed calls, now I’m in too deep' },
        { t: 98.50, text: 'Every night’s a secret I don’t keep' },
        { t: 101.60, text: 'You said you’d never fall in love' },
        { t: 108.06, text: 'But you came twice and called it love' },
        { t: 114.34, text: 'I was wrong, I was wrong to let you in this room' },
        { t: 121.76, text: 'Now you know how I move, now you taste my truth' },
        { t: 133.26, text: 'You got me weak, I hate that it’s you' },
        { t: 137.10, text: 'If I knew you’d haunt my sheets' },
        { t: 143.36, text: 'I’d have left you on the floor' },
        { t: 146.40, text: 'You said I’m the pain you need' },
        { t: 149.72, text: 'Now you’re bleeding for more' },
        { t: 152.70, text: 'If your man call your phone again' },
        { t: 155.10, text: 'Tell him it’s me, we both pretend' },
        { t: 158.30, text: 'He don’t know what we’ve been through' },
        { t: 161.26, text: 'Girl, you still smell like Room 42' }
      ]
    },
    {
      id: 'secrets-of-my-soul',
      title: 'Secrets of My Soul',
      release: 'Midnight Blue EP',
      group: 'midnight',
      src: '/assets/audio/secrets-of-my-soul.m4a',
      cover: '/cover_midnight.jpg',
      duration: '2:55',
      durationSec: 175,
      lyrics: [
        { t: 0, text: '♪ Instrumental Intro ♪' },
        { t: 20.00, text: 'I’m lost inside the shadows' },
        { t: 29.06, text: 'Tracing every scar, every choice I can’t undo — the silence holds my name like a warning' },
        { t: 44.06, text: 'And I’m sinking deep, no hand to pull me through' },
        { t: 51.06, text: 'Who am I when the mirror lies? Where do I go when the ground disappears?' },
        { t: 59.50, text: 'I’m caught between the shadows and the light, losing my soul through all these years' },
        { t: 66.14, text: 'With every breath I’m searching for the truth, trying to remember who I was before I fell' },
        { t: 76.72, text: 'My eyes can’t see what my voice will never say' },
        { t: 85.46, text: 'Every part of me fractures in the quiet' },
        { t: 89.76, text: 'No one hears the war that rages in my chest' },
        { t: 98.96, text: 'Just me and my reflection on the edge' },
        { t: 103.18, text: 'Maybe I’m not meant to be found, maybe breaking’s how I become whole' },
        { t: 112.40, text: 'The night keeps teaching me to let go, and the darkness knows the secrets of my soul' },
        { t: 121.42, text: 'Who am I when the mirror lies? Where do I go when the ground disappears?' },
        { t: 131.32, text: 'I’m caught between the shadows and the light, losing my soul through all these years' },
        { t: 137.98, text: 'With every breath I’m searching for the truth, trying to remember who I was before I fell' },
        { t: 147.98, text: 'I’m still here, standing in my shadow — learning how to live with what remains' }
      ]
    },
    {
      id: 'the-undertow',
      title: 'The Undertow',
      release: 'Midnight Blue EP',
      group: 'midnight',
      src: '/assets/audio/the-undertow.m4a',
      cover: '/cover_midnight.jpg',
      duration: '4:13',
      durationSec: 253,
      lyrics: [
        { t: 0, text: '♪ Instrumental Intro ♪' },
        { t: 30.00, text: 'Whispers crawl along the floor' },
        { t: 37.00, text: 'Names I don’t remember anymore' },
        { t: 43.00, text: 'Dreams decay where shadows stay' },
        { t: 50.00, text: 'And I can’t tell the night from day' },
        { t: 54.00, text: 'Every step I take just fades' },
        { t: 63.60, text: 'Like echoes caught in broken frames' },
        { t: 70.74, text: 'Don’t wake me now, just let me fall' },
        { t: 76.98, text: 'The fire’s gone, but I can still hear it call' },
        { t: 83.42, text: 'If this is healing, let it burn slow' },
        { t: 91.02, text: 'I’m learning to love the undertow' },
        { t: 108.92, text: 'Glass in the moonlight, blood on the key' },
        { t: 115.56, text: 'Doors keep opening inside of me' },
        { t: 118.90, text: 'Voices hum a lullaby' },
        { t: 121.78, text: 'Saying nothing ever truly dies' },
        { t: 126.16, text: 'Every face I try to shake' },
        { t: 132.56, text: 'Is drifting back into the haze' },
        { t: 141.00, text: 'Don’t wake me now, just let me fall' },
        { t: 146.38, text: 'The fire’s gone, but I still hear it call' },
        { t: 152.98, text: 'If this is peace, then let it burn slow' },
        { t: 159.60, text: 'I’m learning to love the undertow' },
        { t: 169.46, text: 'Maybe I was never real' },
        { t: 172.06, text: 'Maybe pain is how we heal' },
        { t: 175.80, text: 'If I’m still dreaming when it’s done' },
        { t: 179.40, text: 'Let me sleep beneath the sun' },
        { t: 182.66, text: 'Ash on my tongue, ghost in my breath' },
        { t: 199.22, text: 'Heaven’s a rumor I haven’t met' },
        { t: 206.30, text: 'The credits roll, the lights all fade' },
        { t: 212.42, text: 'But somewhere my soul stays' }
      ]
    }
  ];

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

  var playerLyricsBtn = document.getElementById('player-lyrics-btn');
  var playerLyricsClose = document.getElementById('player-lyrics-close');
  var playerLyricsPanel = document.getElementById('player-lyrics-panel');
  var playerLyricsList = document.getElementById('player-lyrics-list');
  var playerLyricPreview = document.getElementById('player-lyric-preview');

  var heroVinyl = document.getElementById('hero-vinyl');
  var heroPlayBtn = document.getElementById('hero-play-btn');
  var heroPlayIcon = document.getElementById('hero-play-icon');
  var heroPlayLabel = document.getElementById('hero-play-label');
  var heroDefaultLabel = heroPlayLabel ? heroPlayLabel.textContent : 'Listen Now';

  var releaseButtons = Array.prototype.slice.call(document.querySelectorAll('[data-release-play]'));
  var trackButtons = Array.prototype.slice.call(document.querySelectorAll('[data-track-id]'));

  function findIndexById(id) {
    for (var i = 0; i < TRACKS.length; i++) {
      if (TRACKS[i].id === id) return i;
    }
    return -1;
  }

  var defaultTrackId = (playerBar && playerBar.getAttribute('data-default-track')) || 'afterimage';
  var defaultIndex = findIndexById(defaultTrackId);
  var currentIndex = defaultIndex !== -1 ? defaultIndex : 0;
  var isPlaying = false;
  var isSeeking = false;
  var lyricsOpen = false;
  var activeLyricIndex = -1;
  var renderedLyricsTrackId = null;
  var audioPool = {};

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

  function renderTrackLyrics(track) {
    if (!playerLyricsList || !track) return;
    if (renderedLyricsTrackId === track.id) return;
    renderedLyricsTrackId = track.id;
    activeLyricIndex = -1;
    playerLyricsList.innerHTML = '';

    var lines = track.lyrics || [];
    lines.forEach(function (item, idx) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('data-lyric-idx', String(idx));
      btn.className = 'w-full text-left py-1.5 px-2.5 rounded-lg text-xs sm:text-sm transition-all duration-200 cursor-pointer block text-white/40 hover:text-white/80';
      btn.textContent = item.text;
      btn.addEventListener('click', function () {
        var a = getAudio(currentIndex);
        if (a) {
          try {
            a.currentTime = item.t;
          } catch (e) {}
          if (a.paused) {
            togglePlay();
          } else {
            syncLyricsTime(item.t);
          }
        }
      });
      playerLyricsList.appendChild(btn);
    });

    if (playerLyricPreview) {
      playerLyricPreview.textContent = lines.length > 1 ? lines[1].text : (lines[0] ? lines[0].text : '');
    }
  }

  function syncLyricsTime(curSec) {
    var track = TRACKS[currentIndex];
    if (!track || !track.lyrics || !track.lyrics.length) return;
    renderTrackLyrics(track);

    var lines = track.lyrics;
    var idx = 0;
    for (var i = 0; i < lines.length; i++) {
      if (curSec >= lines[i].t) {
        idx = i;
      } else {
        break;
      }
    }

    if (idx === activeLyricIndex) return;
    activeLyricIndex = idx;

    if (playerLyricPreview && lines[idx]) {
      playerLyricPreview.textContent = lines[idx].text;
    }

    if (playerLyricsList) {
      var buttons = playerLyricsList.querySelectorAll('[data-lyric-idx]');
      var activeEl = null;
      for (var j = 0; j < buttons.length; j++) {
        var isCurrent = j === idx;
        buttons[j].className = isCurrent
          ? 'w-full text-left py-1.5 px-2.5 rounded-lg text-xs sm:text-sm font-bold text-white bg-white/10 transition-all duration-200 cursor-pointer block'
          : 'w-full text-left py-1.5 px-2.5 rounded-lg text-xs sm:text-sm text-white/40 hover:text-white/80 transition-all duration-200 cursor-pointer block';
        if (isCurrent) activeEl = buttons[j];
      }
      if (activeEl && lyricsOpen) {
        var containerTop = playerLyricsList.scrollTop;
        var containerHeight = playerLyricsList.clientHeight;
        var elTop = activeEl.offsetTop - playerLyricsList.offsetTop;
        var elHeight = activeEl.offsetHeight;
        var targetScroll = elTop - (containerHeight / 2) + (elHeight / 2);
        if (Math.abs(containerTop - targetScroll) > 12) {
          playerLyricsList.scrollTo({ top: Math.max(0, targetScroll), behavior: 'smooth' });
        }
      }
    }
  }

  function setLyricsOpen(open) {
    lyricsOpen = !!open;
    if (playerLyricsPanel) {
      if (lyricsOpen) {
        playerLyricsPanel.removeAttribute('hidden');
      } else {
        playerLyricsPanel.setAttribute('hidden', '');
      }
    }
    if (playerLyricsBtn) {
      playerLyricsBtn.setAttribute('aria-expanded', lyricsOpen ? 'true' : 'false');
      playerLyricsBtn.classList.toggle('bg-white', lyricsOpen);
      playerLyricsBtn.classList.toggle('text-black', lyricsOpen);
      playerLyricsBtn.classList.toggle('border-white', lyricsOpen);
      playerLyricsBtn.classList.toggle('text-white/70', !lyricsOpen);
    }
    if (lyricsOpen && playerLyricsList && activeLyricIndex >= 0) {
      var activeEl = playerLyricsList.querySelector('[data-lyric-idx="' + activeLyricIndex + '"]');
      if (activeEl) {
        var elTop = activeEl.offsetTop - playerLyricsList.offsetTop;
        var targetScroll = elTop - (playerLyricsList.clientHeight / 2) + (activeEl.offsetHeight / 2);
        playerLyricsList.scrollTop = Math.max(0, targetScroll);
      }
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
        syncLyricsTime(cur);
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

  // Pre-buffer current page's default track immediately, then warm the other featured tracks
  getAudio(currentIndex);
  window.setTimeout(function () {
    ['afterimage', 'bodytalk', 'velvet-plan', 'ephemeral'].forEach(function (id) {
      var idx = findIndexById(id);
      if (idx !== -1) getAudio(idx);
    });
  }, 300);

  function syncUI() {
    var track = TRACKS[currentIndex];
    if (!track) return;

    if (playerCover) playerCover.src = track.cover;
    if (playerTitle) playerTitle.textContent = track.title;
    if (playerSubtitle) playerSubtitle.textContent = track.release;

    renderTrackLyrics(track);

    if (playerToggle) {
      playerToggle.setAttribute('aria-label', isPlaying ? 'Pause ' + track.title : 'Play ' + track.title);
    }
    if (playerToggleIcon) {
      playerToggleIcon.classList.toggle('ph-pause', isPlaying);
      playerToggleIcon.classList.toggle('ph-play', !isPlaying);
    }

    if (heroVinyl) {
      var vinylGroup = heroVinyl.getAttribute('data-hero-group');
      var vinylTrack = heroVinyl.getAttribute('data-hero-track') || defaultTrackId;
      var vinylActive = vinylGroup ? track.group === vinylGroup : track.id === vinylTrack;
      heroVinyl.classList.toggle('is-spinning', isPlaying && vinylActive);
    }
    if (heroPlayBtn && heroPlayIcon && heroPlayLabel) {
      var heroGroup = heroPlayBtn.getAttribute('data-hero-group');
      var heroTrack = heroPlayBtn.getAttribute('data-hero-track') || defaultTrackId;
      var heroActive = heroGroup ? track.group === heroGroup : track.id === heroTrack;
      var heroPlaying = isPlaying && heroActive;
      heroPlayIcon.classList.toggle('ph-pause', heroPlaying);
      heroPlayIcon.classList.toggle('ph-play', !heroPlaying);
      heroPlayLabel.textContent = heroPlaying ? 'Pause' : heroDefaultLabel;
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
    renderTrackLyrics(track);
    syncLyricsTime(0);

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

  if (playerLyricsBtn) {
    playerLyricsBtn.addEventListener('click', function () {
      setLyricsOpen(!lyricsOpen);
    });
  }
  if (playerLyricsClose) {
    playerLyricsClose.addEventListener('click', function () {
      setLyricsOpen(false);
    });
  }
  if (playerLyricPreview) {
    playerLyricPreview.addEventListener('click', function () {
      setLyricsOpen(!lyricsOpen);
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
        var seekSec = (pct / 100) * dur;
        playerTime.textContent = formatTime(seekSec) + ' / ' + formatTime(dur);
        syncLyricsTime(seekSec);
      }
    });
    playerSeek.addEventListener('change', function () {
      var pct = parseFloat(playerSeek.value) || 0;
      var track = TRACKS[currentIndex];
      var a = getAudio(currentIndex);
      var dur = a && isFinite(a.duration) && a.duration > 0 ? a.duration : track.durationSec;
      if (a && dur > 0) {
        var seekSec = (pct / 100) * dur;
        try {
          a.currentTime = seekSec;
        } catch (e) {}
        syncLyricsTime(seekSec);
      }
      isSeeking = false;
    });
  }

  // ---- Hero buttons & Vinyl click ----
  if (heroPlayBtn) {
    heroPlayBtn.addEventListener('click', function () {
      var heroGroup = heroPlayBtn.getAttribute('data-hero-group');
      var heroTrack = heroPlayBtn.getAttribute('data-hero-track') || defaultTrackId;
      var currentTrack = TRACKS[currentIndex];
      if (heroGroup && currentTrack && currentTrack.group === heroGroup) {
        togglePlay();
      } else {
        playTrackById(heroTrack);
      }
    });
  }
  if (heroVinyl) {
    heroVinyl.addEventListener('click', function () {
      var vinylGroup = heroVinyl.getAttribute('data-hero-group');
      var vinylTrack = heroVinyl.getAttribute('data-hero-track') || defaultTrackId;
      var currentTrack = TRACKS[currentIndex];
      if (vinylGroup && currentTrack && currentTrack.group === vinylGroup) {
        togglePlay();
      } else {
        playTrackById(vinylTrack);
      }
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

  // ---- Tracklist rows (on midnight-blue.html) ----
  trackButtons.forEach(function (btn) {
    var id = btn.getAttribute('data-track-id');
    var warm = function () {
      var idx = findIndexById(id);
      if (idx !== -1) getAudio(idx);
    };
    btn.addEventListener('mouseenter', warm, { passive: true });
    btn.addEventListener('touchstart', warm, { passive: true });
    btn.addEventListener('focus', warm, { passive: true });

    btn.addEventListener('click', function () {
      playTrackById(id);
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
