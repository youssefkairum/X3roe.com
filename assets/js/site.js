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

  // ---- Hero Precision Background Canvas (#hero-canvas) ----
  var heroCanvas = document.getElementById('hero-canvas');
  if (heroCanvas && heroCanvas.getContext) {
    var ctx = heroCanvas.getContext('2d');
    var heroSection = document.getElementById('hero') || heroCanvas.parentElement;
    var width = 0;
    var height = 0;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var gridSize = 48;
    var pointer = { x: -9999, y: -9999, targetX: -9999, targetY: -9999, active: false, lastMove: 0 };
    var pulses = [];
    var rafId = null;
    var isVisible = true;
    var startTime = performance.now();

    var resizeCanvas = function () {
      var rect = (heroSection || heroCanvas).getBoundingClientRect();
      width = rect.width || window.innerWidth;
      height = rect.height || window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      heroCanvas.width = Math.round(width * dpr);
      heroCanvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    var spawnPulse = function () {
      if (!width || !height) return;
      var horizontal = Math.random() > 0.45;
      var cols = Math.floor(width / gridSize);
      var rows = Math.floor(height / gridSize);
      if (cols < 2 || rows < 2) return;
      var dir = Math.random() > 0.5 ? 1 : -1;
      var length = 90 + Math.random() * 130;
      var speed = (1.4 + Math.random() * 1.8) * dir;
      if (horizontal) {
        var row = Math.max(1, Math.min(rows - 1, Math.floor(Math.random() * rows)));
        pulses.push({
          horizontal: true,
          x: dir > 0 ? -length : width + length,
          y: row * gridSize,
          length: length,
          speed: speed,
          alpha: 0.14 + Math.random() * 0.16
        });
      } else {
        var col = Math.max(1, Math.min(cols - 1, Math.floor(Math.random() * cols)));
        pulses.push({
          horizontal: false,
          x: col * gridSize,
          y: dir > 0 ? -length : height + length,
          length: length,
          speed: speed,
          alpha: 0.14 + Math.random() * 0.16
        });
      }
    };

    var renderFrame = function (now) {
      if (heroSection && (Math.abs(heroSection.clientWidth - width) > 4 || Math.abs(heroSection.clientHeight - height) > 4)) {
        resizeCanvas();
      }
      var elapsed = (now - startTime) * 0.001;
      ctx.clearRect(0, 0, width, height);

      // Autonomous smooth Lissajous focal point when pointer is idle or on touch devices
      var idle = !pointer.active || (now - pointer.lastMove > 2800);
      var autoX = width * (0.58 + 0.22 * Math.sin(elapsed * 0.45));
      var autoY = height * (0.48 + 0.20 * Math.cos(elapsed * 0.33));
      var goalX = idle ? autoX : pointer.targetX;
      var goalY = idle ? autoY : pointer.targetY;

      if (pointer.x < -1000) {
        pointer.x = goalX;
        pointer.y = goalY;
      } else {
        pointer.x += (goalX - pointer.x) * 0.08;
        pointer.y += (goalY - pointer.y) * 0.08;
      }

      // Soft ambient spotlight following the active focal point
      var spotRadius = Math.min(width, height) * 0.40;
      var spotGrad = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, spotRadius);
      spotGrad.addColorStop(0, 'rgba(255, 255, 255, 0.04)');
      spotGrad.addColorStop(0.5, 'rgba(180, 205, 255, 0.015)');
      spotGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = spotGrad;
      ctx.fillRect(0, 0, width, height);

      // Concentric precision telemetry rings (right-weighted on desktop to balance typography)
      var ringCx = width >= 768 ? width * 0.68 : width * 0.5;
      var ringCy = height * 0.5;
      var baseR = Math.min(width, height) * (width >= 768 ? 0.34 : 0.40);

      ctx.save();
      ctx.translate(ringCx, ringCy);

      // Outer dashed telemetry ring
      ctx.save();
      ctx.rotate(elapsed * 0.05);
      ctx.beginPath();
      ctx.setLineDash([3, 12]);
      ctx.arc(0, 0, baseR, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.075)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // Middle segmented arc ring (counter-rotating)
      ctx.save();
      ctx.rotate(-elapsed * 0.08);
      for (var a = 0; a < 4; a++) {
        ctx.beginPath();
        var startAngle = a * (Math.PI / 2) + 0.18;
        ctx.arc(0, 0, baseR * 0.74, startAngle, startAngle + (Math.PI / 2 - 0.36));
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      // Subtle orbital node on middle ring
      var orbX = Math.cos(elapsed * 0.35) * (baseR * 0.74);
      var orbY = Math.sin(elapsed * 0.35) * (baseR * 0.74);
      ctx.beginPath();
      ctx.arc(orbX, orbY, 2.0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.38)';
      ctx.fill();
      ctx.restore();

      // Inner fine hairline ring + crosshair degree ticks
      ctx.save();
      ctx.rotate(elapsed * 0.11);
      ctx.beginPath();
      ctx.arc(0, 0, baseR * 0.46, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.stroke();

      for (var t = 0; t < 12; t++) {
        var ang = (t * Math.PI) / 6;
        var r1 = baseR * 0.46 - 4;
        var r2 = baseR * 0.46 + 4;
        ctx.beginPath();
        ctx.moveTo(Math.cos(ang) * r1, Math.sin(ang) * r1);
        ctx.lineTo(Math.cos(ang) * r2, Math.sin(ang) * r2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.11)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();
      ctx.restore();

      // Interactive dot-matrix grid intersections
      var influenceRadius = 200;
      var influenceRadiusSq = influenceRadius * influenceRadius;
      var centerMaskRx = width * 0.48;
      var centerMaskRy = height * 0.45;
      var centerX = width * 0.54;
      var centerY = height * 0.5;

      for (var gx = gridSize; gx < width; gx += gridSize) {
        for (var gy = gridSize; gy < height; gy += gridSize) {
          var nx = (gx - centerX) / centerMaskRx;
          var ny = (gy - centerY) / centerMaskRy;
          var edgeDist = nx * nx + ny * ny;
          if (edgeDist > 1.35) continue;
          var vignette = Math.max(0, 1 - edgeDist * 0.74);

          var dx = pointer.x - gx;
          var dy = pointer.y - gy;
          var distSq = dx * dx + dy * dy;

          var drawX = gx;
          var drawY = gy;
          var alpha = 0.08 * vignette;
          var radius = 1;

          if (distSq < influenceRadiusSq) {
            var dist = Math.sqrt(distSq) || 1;
            var factor = 1 - dist / influenceRadius;
            var ease = factor * factor;
            drawX += (dx / dist) * ease * 6;
            drawY += (dy / dist) * ease * 6;
            alpha = Math.min(0.45, (0.08 + ease * 0.34) * vignette);
            radius = 1 + ease * 1.2;
          }

          ctx.beginPath();
          ctx.arc(drawX, drawY, radius, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, ' + alpha.toFixed(3) + ')';
          ctx.fill();
        }
      }

      // Travelling signal comet pulses along grid lines
      if (pulses.length < 4 && Math.random() < 0.035) {
        spawnPulse();
      }

      for (var i = pulses.length - 1; i >= 0; i--) {
        var p = pulses[i];
        p.x += p.horizontal ? p.speed : 0;
        p.y += p.horizontal ? 0 : p.speed;

        var tailX = p.horizontal ? p.x - Math.sign(p.speed) * p.length : p.x;
        var tailY = p.horizontal ? p.y : p.y - Math.sign(p.speed) * p.length;

        var grad = ctx.createLinearGradient(tailX, tailY, p.x, p.y);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        grad.addColorStop(1, 'rgba(255, 255, 255, ' + p.alpha.toFixed(3) + ')');

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Subtle leading tip
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, ' + Math.min(0.55, p.alpha * 1.7).toFixed(3) + ')';
        ctx.fill();

        if (
          (p.horizontal && ((p.speed > 0 && p.x - p.length > width) || (p.speed < 0 && p.x + p.length < 0))) ||
          (!p.horizontal && ((p.speed > 0 && p.y - p.length > height) || (p.speed < 0 && p.y + p.length < 0)))
        ) {
          pulses.splice(i, 1);
        }
      }

      if (isVisible) {
        rafId = window.requestAnimationFrame(renderFrame);
      } else {
        rafId = null;
      }
    };

    resizeCanvas();
    spawnPulse();
    spawnPulse();
    spawnPulse();

    window.addEventListener('resize', function () {
      resizeCanvas();
    }, { passive: true });

    if (heroSection) {
      heroSection.addEventListener('mousemove', function (e) {
        var rect = heroCanvas.getBoundingClientRect();
        pointer.targetX = e.clientX - rect.left;
        pointer.targetY = e.clientY - rect.top;
        pointer.active = true;
        pointer.lastMove = performance.now();
      }, { passive: true });

      heroSection.addEventListener('mouseleave', function () {
        pointer.active = false;
      }, { passive: true });

      heroSection.addEventListener('touchmove', function (e) {
        if (e.touches && e.touches[0]) {
          var rect = heroCanvas.getBoundingClientRect();
          pointer.targetX = e.touches[0].clientX - rect.left;
          pointer.targetY = e.touches[0].clientY - rect.top;
          pointer.active = true;
          pointer.lastMove = performance.now();
        }
      }, { passive: true });
    }

    if ('IntersectionObserver' in window && heroSection) {
      var heroObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          isVisible = entry.isIntersecting;
          if (isVisible && !rafId) {
            rafId = window.requestAnimationFrame(renderFrame);
          } else if (!isVisible && rafId) {
            window.cancelAnimationFrame(rafId);
            rafId = null;
          }
        });
      }, { threshold: 0 });
      heroObserver.observe(heroSection);
    }

    renderFrame(performance.now());
  }

  // ---- Distinct Project Section Background Canvases ([data-project-canvas]) ----
  var projectCanvases = Array.prototype.slice.call(document.querySelectorAll('[data-project-canvas]'));
  if (projectCanvases.length) {
    var hexChars = '0123456789ABCDEF';
    var cubeVertices = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1,  1], [1, -1,  1], [1, 1,  1], [-1, 1,  1]
    ];
    var cubeEdges = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7]
    ];

    var initProjectCanvas = function (canvas) {
      if (!canvas.getContext) return;
      var type = canvas.getAttribute('data-project-canvas');
      var ctx = canvas.getContext('2d');
      var container = canvas.parentElement || canvas;
      var section = canvas.closest('section') || container;
      var width = 0;
      var height = 0;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var rafId = null;
      var isVisible = true;
      var startTime = performance.now();
      var pointer = { x: -9999, y: -9999, active: false, lastMove: 0 };
      var state = {};

      var setupState = function () {
        if (type === 'ipasscoder') {
          var colSpacing = 44;
          var cols = Math.max(5, Math.floor(width / colSpacing));
          var streams = [];
          for (var c = 0; c < cols; c++) {
            var count = 2;
            for (var k = 0; k < count; k++) {
              streams.push({
                x: (c + 0.5) * colSpacing,
                y: Math.random() * height,
                speed: 18 + Math.random() * 24,
                char: '0x' + hexChars[Math.floor(Math.random() * hexChars.length)] + hexChars[Math.floor(Math.random() * hexChars.length)],
                alpha: 0.16 + Math.random() * 0.18,
                nextSwap: Math.random() * 1.5
              });
            }
          }
          state.streams = streams;
        } else if (type === 'iprayer') {
          var starCount = 28;
          var stars = [];
          for (var s = 0; s < starCount; s++) {
            stars.push({
              x: Math.random() * width,
              y: Math.random() * height,
              vx: (Math.random() - 0.5) * 6,
              vy: (Math.random() - 0.5) * 6,
              r: 1.2 + Math.random() * 1.6,
              phase: Math.random() * Math.PI * 2,
              flare: s % 5 === 0
            });
          }
          state.stars = stars;
        } else if (type === 'voxel') {
          var cubes = [];
          for (var v = 0; v < 6; v++) {
            cubes.push({
              nx: 0.16 + Math.random() * 0.68,
              ny: 0.16 + Math.random() * 0.68,
              size: 12 + Math.random() * 14,
              rx: Math.random() * Math.PI * 2,
              ry: Math.random() * Math.PI * 2,
              rz: Math.random() * Math.PI * 2,
              vrx: (Math.random() - 0.5) * 0.7,
              vry: (Math.random() - 0.5) * 0.8,
              vrz: (Math.random() - 0.5) * 0.6,
              accent: v % 2 === 0
            });
          }
          state.cubes = cubes;
          state.ripples = [];
          state.lastBounceSide = -1;
        } else if (type === 'slumber') {
          var motes = [];
          for (var m = 0; m < 34; m++) {
            motes.push({
              x: Math.random() * width,
              y: Math.random() * height,
              vx: (Math.random() - 0.5) * 10,
              vy: -6 - Math.random() * 12,
              r: 1.0 + Math.random() * 1.8,
              alpha: 0.25 + Math.random() * 0.40
            });
          }
          state.motes = motes;
          state.pings = [
            { x: width * 0.5, y: height * 0.44, born: 0, maxR: Math.min(width, height) * 0.46 }
          ];
          state.lastPing = 0;
        } else if (type === 'music') {
          var notes = [];
          for (var n = 0; n < 24; n++) {
            notes.push({
              x: Math.random() * width,
              y: Math.random() * height,
              vy: -10 - Math.random() * 14,
              r: 1.2 + Math.random() * 2.0,
              hue: n % 2 === 0 ? '99, 102, 241' : '56, 189, 248',
              alpha: 0.28 + Math.random() * 0.36
            });
          }
          state.notes = notes;
        }
      };

      var resize = function () {
        var rect = container.getBoundingClientRect();
        width = rect.width || 360;
        height = rect.height || 360;
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        setupState();
      };

      var drawIPasscoder = function (elapsed, dt) {
        // Horizontal cryptographic verification scanline
        var scanY = ((elapsed * 45) % (height + 100)) - 50;
        var scanGrad = ctx.createLinearGradient(0, scanY - 32, 0, scanY + 32);
        scanGrad.addColorStop(0, 'rgba(245, 158, 11, 0)');
        scanGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.08)');
        scanGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = scanGrad;
        ctx.fillRect(0, scanY - 32, width, 64);

        ctx.beginPath();
        ctx.moveTo(0, scanY);
        ctx.lineTo(width, scanY);
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.22)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Falling hexadecimal cipher streams
        ctx.font = '600 9.5px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        var streams = state.streams || [];
        for (var s = 0; s < streams.length; s++) {
          var st = streams[s];
          st.y += st.speed * dt;
          if (st.y > height + 18) st.y = -18;

          if (elapsed > st.nextSwap) {
            st.char = '0x' + hexChars[Math.floor(Math.random() * hexChars.length)] + hexChars[Math.floor(Math.random() * hexChars.length)];
            st.nextSwap = elapsed + 0.4 + Math.random() * 1.1;
          }

          var distScan = Math.abs(st.y - scanY);
          var dx = pointer.x - st.x;
          var dy = pointer.y - st.y;
          var distPtr = Math.sqrt(dx * dx + dy * dy);
          var locked = distScan < 20 || (pointer.active && distPtr < 75);

          if (locked) {
            ctx.fillStyle = 'rgba(245, 158, 11, 0.55)';
            ctx.fillText(st.char, st.x, st.y);
            ctx.strokeStyle = 'rgba(245, 158, 11, 0.28)';
            ctx.lineWidth = 1;
            ctx.strokeRect(st.x - 15, st.y - 8.5, 30, 11);
          } else {
            ctx.fillStyle = 'rgba(255, 255, 255, ' + (st.alpha * 0.55).toFixed(3) + ')';
            ctx.fillText(st.char, st.x, st.y);
          }
        }

        // Centered concentric cryptographic vault dial framing the lock icon
        var dialCx = width * 0.5;
        var dialCy = height * 0.5;
        var dialR = Math.min(width, height) * 0.39;

        ctx.save();
        ctx.translate(dialCx, dialCy);

        // Stepped outer vault ring
        var stepAngle = Math.floor(elapsed * 0.8) * (Math.PI / 12) + (elapsed * 0.06);
        ctx.save();
        ctx.rotate(stepAngle);
        ctx.beginPath();
        ctx.setLineDash([5, 11]);
        ctx.arc(0, 0, dialR, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.22)';
        ctx.lineWidth = 1.1;
        ctx.stroke();

        for (var i = 0; i < 16; i++) {
          var a = (i * Math.PI) / 8;
          ctx.beginPath();
          ctx.moveTo(Math.cos(a) * (dialR - 5), Math.sin(a) * (dialR - 5));
          ctx.lineTo(Math.cos(a) * (dialR + 5), Math.sin(a) * (dialR + 5));
          ctx.strokeStyle = i % 4 === 0 ? 'rgba(245, 158, 11, 0.40)' : 'rgba(255, 255, 255, 0.11)';
          ctx.lineWidth = 1;
          ctx.setLineDash([]);
          ctx.stroke();
        }
        ctx.restore();

        // Counter-rotating inner tumbler ring
        ctx.save();
        ctx.rotate(-elapsed * 0.10);
        ctx.beginPath();
        ctx.arc(0, 0, dialR * 0.72, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.14)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
        ctx.restore();
      };

      var drawIPrayer = function (elapsed, dt) {
        // Twinkling constellation stars + geometric threads
        var stars = state.stars || [];
        for (var i = 0; i < stars.length; i++) {
          var st = stars[i];
          st.x += st.vx * dt;
          st.y += st.vy * dt;
          if (st.x < 0) st.x = width;
          if (st.x > width) st.x = 0;
          if (st.y < 0) st.y = height;
          if (st.y > height) st.y = 0;

          var twinkle = 0.16 + 0.28 * (0.5 + 0.5 * Math.sin(elapsed * 2.0 + st.phase));
          ctx.beginPath();
          ctx.arc(st.x, st.y, st.r * 0.85, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(45, 212, 191, ' + twinkle.toFixed(3) + ')';
          ctx.fill();

          for (var j = i + 1; j < stars.length; j++) {
            var st2 = stars[j];
            var dx = st.x - st2.x;
            var dy = st.y - st2.y;
            var dSq = dx * dx + dy * dy;
            if (dSq < 8500) {
              var lineAlpha = (1 - Math.sqrt(dSq) / 92) * 0.12;
              ctx.beginPath();
              ctx.moveTo(st.x, st.y);
              ctx.lineTo(st2.x, st2.y);
              ctx.strokeStyle = 'rgba(45, 212, 191, ' + lineAlpha.toFixed(3) + ')';
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }
        }

        // Centered Sacred Geometric Astrolabe (Rub el Hizb 8-pointed star)
        var cx = width * 0.5;
        var cy = height * 0.5;
        var R = Math.min(width, height) * 0.40;

        ctx.save();
        ctx.translate(cx, cy);

        // Expanding Qibla azimuth pulse ring
        var pulseFrac = (elapsed * 0.22) % 1;
        var pulseR = R * (0.35 + pulseFrac * 0.82);
        var pulseAlpha = (1 - pulseFrac) * 0.22;
        ctx.beginPath();
        ctx.arc(0, 0, pulseR, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(45, 212, 191, ' + pulseAlpha.toFixed(3) + ')';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Outer celestial degree ring
        ctx.save();
        ctx.rotate(elapsed * 0.05);
        ctx.beginPath();
        ctx.arc(0, 0, R, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(45, 212, 191, 0.20)';
        ctx.lineWidth = 1;
        ctx.stroke();

        for (var m = 0; m < 24; m++) {
          var ang = (m * Math.PI) / 12;
          var inner = m % 3 === 0 ? R - 7 : R - 3.5;
          ctx.beginPath();
          ctx.moveTo(Math.cos(ang) * inner, Math.sin(ang) * inner);
          ctx.lineTo(Math.cos(ang) * R, Math.sin(ang) * R);
          ctx.strokeStyle = m % 3 === 0 ? 'rgba(45, 212, 191, 0.38)' : 'rgba(255, 255, 255, 0.11)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        ctx.restore();

        // Rub el Hizb (two overlapping squares at 45 deg)
        ctx.save();
        ctx.rotate(-elapsed * 0.06);
        var sqR = R * 0.75;
        for (var q = 0; q < 2; q++) {
          ctx.save();
          ctx.rotate((q * Math.PI) / 4);
          ctx.beginPath();
          for (var v = 0; v < 4; v++) {
            var va = (v * Math.PI) / 2 + Math.PI / 4;
            var vx = Math.cos(va) * sqR;
            var vy = Math.sin(va) * sqR;
            if (v === 0) ctx.moveTo(vx, vy);
            else ctx.lineTo(vx, vy);
            ctx.fillStyle = 'rgba(45, 212, 191, 0.45)';
            ctx.fillRect(vx - 1.5, vy - 1.5, 3, 3);
          }
          ctx.closePath();
          ctx.strokeStyle = 'rgba(45, 212, 191, 0.22)';
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.restore();
        }
        ctx.restore();
        ctx.restore();
      };

      var drawVoxel = function (elapsed, dt) {
        // Perspective 3D wireframe court floor in the lower half of the circular arena
        var horizonY = height * 0.54;
        var bottomY = height;
        var vanishX = width * 0.5;

        ctx.save();
        var numLines = 9;
        for (var i = 0; i < numLines; i++) {
          var norm = (i / (numLines - 1)) - 0.5;
          var topX = vanishX + norm * width * 0.46;
          var botX = vanishX + norm * width * 1.3;
          ctx.beginPath();
          ctx.moveTo(topX, horizonY);
          ctx.lineTo(botX, bottomY);
          ctx.strokeStyle = i === 4 ? 'rgba(52, 211, 153, 0.24)' : 'rgba(52, 211, 153, 0.08)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        var scrollOffset = (elapsed * 0.30) % (1 / 5);
        for (var r = 0; r <= 5; r++) {
          var t = Math.min(1, (r / 5) + scrollOffset);
          var easeT = t * t;
          var y = horizonY + easeT * (bottomY - horizonY);
          var span = (0.46 + easeT * 0.84) * width * 0.5;
          ctx.beginPath();
          ctx.moveTo(vanishX - span, y);
          ctx.lineTo(vanishX + span, y);
          ctx.strokeStyle = r === 0 ? 'rgba(52, 211, 153, 0.26)' : 'rgba(52, 211, 153, ' + (0.07 + t * 0.14).toFixed(3) + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        ctx.restore();

        // Floating tumbling 3D wireframe voxel cubes
        var cubes = state.cubes || [];
        for (var c = 0; c < cubes.length; c++) {
          var cb = cubes[c];
          cb.rx += cb.vrx * dt;
          cb.ry += cb.vry * dt;
          cb.rz += cb.vrz * dt;

          var cx = cb.nx * width + Math.sin(elapsed * 0.6 + c) * 10;
          var cy = cb.ny * height + Math.cos(elapsed * 0.5 + c) * 10;
          var s = cb.size;

          var cosX = Math.cos(cb.rx), sinX = Math.sin(cb.rx);
          var cosY = Math.cos(cb.ry), sinY = Math.sin(cb.ry);
          var cosZ = Math.cos(cb.rz), sinZ = Math.sin(cb.rz);

          var proj = [];
          for (var v = 0; v < 8; v++) {
            var x = cubeVertices[v][0];
            var y = cubeVertices[v][1];
            var z = cubeVertices[v][2];

            var y1 = y * cosX - z * sinX;
            var z1 = y * sinX + z * cosX;
            var x2 = x * cosY + z1 * sinY;
            var z2 = -x * sinY + z1 * cosY;
            var x3 = x2 * cosZ - y1 * sinZ;
            var y3 = x2 * sinZ + y1 * cosZ;

            var scale = 3.2 / (3.2 + z2 * 0.35);
            proj.push([cx + x3 * s * scale, cy + y3 * s * scale]);
          }

          ctx.beginPath();
          for (var e = 0; e < cubeEdges.length; e++) {
            var p1 = proj[cubeEdges[e][0]];
            var p2 = proj[cubeEdges[e][1]];
            ctx.moveTo(p1[0], p1[1]);
            ctx.lineTo(p2[0], p2[1]);
          }
          ctx.strokeStyle = cb.accent ? 'rgba(52, 211, 153, 0.26)' : 'rgba(255, 255, 255, 0.12)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Autonomous parabolic rally ball + bounce ripples inside the circular court
        var rallyDuration = 2.1;
        var cycle = elapsed / rallyDuration;
        var bounceIndex = Math.floor(cycle);
        var phase = cycle - bounceIndex;
        var goingRight = bounceIndex % 2 === 0;

        var leftX = width * 0.16;
        var rightX = width * 0.84;
        var groundY = height * 0.74;
        var arcHeight = height * 0.40;

        if (state.lastBounceSide !== bounceIndex) {
          state.lastBounceSide = bounceIndex;
          state.ripples.push({
            x: goingRight ? leftX : rightX,
            y: groundY,
            r: 4,
            alpha: 0.55
          });
        }

        for (var rp = state.ripples.length - 1; rp >= 0; rp--) {
          var rip = state.ripples[rp];
          rip.r += 42 * dt;
          rip.alpha -= 0.42 * dt;
          if (rip.alpha <= 0) {
            state.ripples.splice(rp, 1);
            continue;
          }
          ctx.save();
          ctx.translate(rip.x, rip.y);
          ctx.scale(1.6, 0.55);
          ctx.strokeStyle = 'rgba(52, 211, 153, ' + rip.alpha.toFixed(3) + ')';
          ctx.lineWidth = 1.2;
          ctx.strokeRect(-rip.r, -rip.r, rip.r * 2, rip.r * 2);
          ctx.restore();
        }

        var steps = 10;
        for (var tr = steps; tr >= 0; tr--) {
          var tp = Math.max(0, phase - tr * 0.024);
          var bx = goingRight ? (leftX + (rightX - leftX) * tp) : (rightX - (rightX - leftX) * tp);
          var by = groundY - 4 * arcHeight * tp * (1 - tp);
          var tAlpha = (1 - tr / (steps + 1)) * 0.48;
          var bSize = tr === 0 ? 7 : 4 * (1 - tr / (steps + 2));
          ctx.fillStyle = tr === 0 ? 'rgba(52, 211, 153, 0.82)' : 'rgba(52, 211, 153, ' + tAlpha.toFixed(3) + ')';
          ctx.fillRect(bx - bSize * 0.5, by - bSize * 0.5, bSize, bSize);
        }
      };

      var drawSlumber = function (elapsed, dt) {
        // Spawn periodic binaural acoustic sonar pings inside the CRT monitor
        if (elapsed - state.lastPing > 2.4) {
          state.lastPing = elapsed;
          state.pings.push({
            x: width * (0.25 + Math.random() * 0.50),
            y: height * (0.25 + Math.random() * 0.50),
            born: elapsed,
            maxR: Math.min(width, height) * 0.42
          });
          if (state.pings.length > 4) state.pings.shift();
        }

        for (var p = state.pings.length - 1; p >= 0; p--) {
          var pg = state.pings[p];
          var age = elapsed - pg.born;
          var duration = 3.6;
          if (age > duration) {
            state.pings.splice(p, 1);
            continue;
          }

          var crossAlpha = Math.max(0, (1 - age / duration) * 0.45);
          ctx.strokeStyle = 'rgba(239, 68, 68, ' + crossAlpha.toFixed(3) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(pg.x - 5, pg.y);
          ctx.lineTo(pg.x + 5, pg.y);
          ctx.moveTo(pg.x, pg.y - 5);
          ctx.lineTo(pg.x, pg.y + 5);
          ctx.stroke();

          for (var w = 0; w < 3; w++) {
            var wAge = age - w * 0.40;
            if (wAge <= 0) continue;
            var prog = wAge / duration;
            if (prog >= 1) continue;
            var r = prog * pg.maxR;
            var alpha = (1 - prog) * 0.34;

            ctx.beginPath();
            var segments = 48;
            for (var s = 0; s <= segments; s++) {
              var a = (s / segments) * Math.PI * 2;
              var jitter = Math.sin(a * 10 + elapsed * 12 + w) * 2.5 * (1 - prog);
              var px = pg.x + Math.cos(a) * (r + jitter);
              var py = pg.y + Math.sin(a) * (r + jitter);
              if (s === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.strokeStyle = 'rgba(239, 68, 68, ' + alpha.toFixed(3) + ')';
            ctx.lineWidth = 1.1;
            ctx.stroke();
          }
        }

        // Drifting abyssal ash & crimson ember motes
        var motes = state.motes || [];
        for (var m = 0; m < motes.length; m++) {
          var mt = motes[m];
          mt.x += (mt.vx + Math.sin(elapsed + m) * 5) * dt;
          mt.y += mt.vy * dt;
          if (mt.y < -10) {
            mt.y = height + 10;
            mt.x = Math.random() * width;
          }
          if (mt.x < 0) mt.x = width;
          if (mt.x > width) mt.x = 0;

          ctx.beginPath();
          ctx.arc(mt.x, mt.y, mt.r * 0.85, 0, Math.PI * 2);
          ctx.fillStyle = m % 2 === 0
            ? 'rgba(239, 68, 68, ' + (mt.alpha * 0.75).toFixed(3) + ')'
            : 'rgba(255, 255, 255, ' + (mt.alpha * 0.45).toFixed(3) + ')';
          ctx.fill();
        }

        // PSX / VHS horizontal tracking glitch band
        var glitchTrigger = Math.sin(elapsed * 3.1) * Math.cos(elapsed * 5.7);
        if (glitchTrigger > 0.68) {
          var gy = (Math.sin(elapsed * 17) * 0.5 + 0.5) * height;
          var gh = 6 + Math.random() * 14;
          ctx.fillStyle = 'rgba(220, 38, 38, 0.10)';
          ctx.fillRect(0, gy, width, gh);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
          ctx.fillRect(0, gy + gh * 0.4, width, 1.2);
        }
      };

      var drawMusic = function (elapsed, dt) {
        var centerY = height * 0.5;
        var mod = pointer.active ? ((pointer.y / Math.max(1, height)) - 0.5) * 0.6 : 0;

        // Stereo frequency-spectrum analyzer bars across the vinyl record
        var barCount = 44;
        var totalBarW = width * 0.86;
        var startX = (width - totalBarW) * 0.5;
        var stepX = totalBarW / barCount;

        for (var b = 0; b < barCount; b++) {
          var norm = b / (barCount - 1);
          var env = Math.sin(norm * Math.PI);
          var energy =
            0.45 * Math.sin(elapsed * 2.4 + b * 0.28) +
            0.35 * Math.cos(elapsed * 3.6 - b * 0.42) +
            0.20 * Math.sin(elapsed * 5.1 + b * 0.15);
          var barH = Math.max(3, (10 + Math.abs(energy) * (height * 0.18)) * env);
          var bx = startX + b * stepX;

          ctx.fillStyle = b % 2 === 0 ? 'rgba(99, 102, 241, 0.22)' : 'rgba(56, 189, 248, 0.18)';
          ctx.fillRect(bx, centerY - barH, 1.6, barH * 2);
        }

        // 5 flowing multi-harmonic analog synth waveforms
        var waves = [
          { amp: height * 0.11, freq: 0.012, speed: 1.2, color: 'rgba(99, 102, 241, 0.42)', width: 1.5 },
          { amp: height * 0.08, freq: 0.017, speed: -0.95, color: 'rgba(56, 189, 248, 0.34)', width: 1.2 },
          { amp: height * 0.14, freq: 0.009, speed: 0.75, color: 'rgba(255, 255, 255, 0.20)', width: 1.0 },
          { amp: height * 0.06, freq: 0.022, speed: 1.5, color: 'rgba(129, 140, 248, 0.28)', width: 1.0 },
          { amp: height * 0.09, freq: 0.014, speed: -1.2, color: 'rgba(56, 189, 248, 0.18)', width: 1.0 }
        ];

        for (var w = 0; w < waves.length; w++) {
          var wv = waves[w];
          ctx.beginPath();
          for (var x = 0; x <= width; x += 6) {
            var nx = x / Math.max(1, width);
            var taper = Math.sin(nx * Math.PI);
            var y =
              centerY +
              Math.sin(x * wv.freq + elapsed * wv.speed + w) * wv.amp * (1 + mod) * taper +
              Math.cos(x * wv.freq * 1.8 - elapsed * wv.speed * 0.7) * (wv.amp * 0.35) * taper;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.strokeStyle = wv.color;
          ctx.lineWidth = wv.width;
          ctx.stroke();
        }

        // Floating harmonic overtone particles
        var notes = state.notes || [];
        for (var n = 0; n < notes.length; n++) {
          var nt = notes[n];
          nt.y += nt.vy * dt;
          nt.x += Math.sin(elapsed * 1.0 + n) * 5 * dt;
          if (nt.y < -10) {
            nt.y = height + 10;
            nt.x = Math.random() * width;
          }
          ctx.beginPath();
          ctx.arc(nt.x, nt.y, nt.r * 0.85, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(' + nt.hue + ', ' + (nt.alpha * 0.55).toFixed(3) + ')';
          ctx.fill();
        }
      };

      var lastNow = performance.now();
      var render = function (now) {
        if (container && (Math.abs(container.clientWidth - width) > 2 || Math.abs(container.clientHeight - height) > 2)) {
          resize();
        }
        var dt = Math.min(0.05, Math.max(0.001, (now - lastNow) * 0.001));
        lastNow = now;
        var elapsed = (now - startTime) * 0.001;

        ctx.clearRect(0, 0, width, height);

        if (type === 'ipasscoder') drawIPasscoder(elapsed, dt);
        else if (type === 'iprayer') drawIPrayer(elapsed, dt);
        else if (type === 'voxel') drawVoxel(elapsed, dt);
        else if (type === 'slumber') drawSlumber(elapsed, dt);
        else if (type === 'music') drawMusic(elapsed, dt);

        if (isVisible) {
          rafId = window.requestAnimationFrame(render);
        } else {
          rafId = null;
        }
      };

      resize();

      window.addEventListener('resize', function () {
        resize();
      }, { passive: true });

      if (section) {
        section.addEventListener('mousemove', function (e) {
          var rect = canvas.getBoundingClientRect();
          pointer.x = e.clientX - rect.left;
          pointer.y = e.clientY - rect.top;
          pointer.active = true;
          if (type === 'slumber' && performance.now() - pointer.lastMove > 700) {
            state.pings.push({
              x: pointer.x,
              y: pointer.y,
              born: (performance.now() - startTime) * 0.001,
              maxR: Math.min(width, height) * 0.34
            });
            if (state.pings.length > 6) state.pings.shift();
            pointer.lastMove = performance.now();
          }
        }, { passive: true });

        section.addEventListener('mouseleave', function () {
          pointer.active = false;
        }, { passive: true });

        section.addEventListener('touchmove', function (e) {
          if (e.touches && e.touches[0]) {
            var rect = canvas.getBoundingClientRect();
            pointer.x = e.touches[0].clientX - rect.left;
            pointer.y = e.touches[0].clientY - rect.top;
            pointer.active = true;
          }
        }, { passive: true });
      }

      if ('IntersectionObserver' in window && section) {
        var obs = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            isVisible = entry.isIntersecting;
            if (isVisible && !rafId) {
              lastNow = performance.now();
              rafId = window.requestAnimationFrame(render);
            } else if (!isVisible && rafId) {
              window.cancelAnimationFrame(rafId);
              rafId = null;
            }
          });
        }, { threshold: 0 });
        obs.observe(section);
      }

      render(performance.now());
    };

    projectCanvases.forEach(initProjectCanvas);
  }
})();
