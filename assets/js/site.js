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
      var length = 130 + Math.random() * 180;
      var speed = (2.2 + Math.random() * 2.6) * dir;
      if (horizontal) {
        var row = Math.max(1, Math.min(rows - 1, Math.floor(Math.random() * rows)));
        pulses.push({
          horizontal: true,
          x: dir > 0 ? -length : width + length,
          y: row * gridSize,
          length: length,
          speed: speed,
          alpha: 0.45 + Math.random() * 0.40
        });
      } else {
        var col = Math.max(1, Math.min(cols - 1, Math.floor(Math.random() * cols)));
        pulses.push({
          horizontal: false,
          x: col * gridSize,
          y: dir > 0 ? -length : height + length,
          length: length,
          speed: speed,
          alpha: 0.45 + Math.random() * 0.40
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
      var autoX = width * (0.58 + 0.24 * Math.sin(elapsed * 0.55));
      var autoY = height * (0.48 + 0.22 * Math.cos(elapsed * 0.40));
      var goalX = idle ? autoX : pointer.targetX;
      var goalY = idle ? autoY : pointer.targetY;

      if (pointer.x < -1000) {
        pointer.x = goalX;
        pointer.y = goalY;
      } else {
        pointer.x += (goalX - pointer.x) * 0.09;
        pointer.y += (goalY - pointer.y) * 0.09;
      }

      // Ambient spotlight following the active focal point
      var spotRadius = Math.min(width, height) * 0.46;
      var spotGrad = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, spotRadius);
      spotGrad.addColorStop(0, 'rgba(255, 255, 255, 0.14)');
      spotGrad.addColorStop(0.45, 'rgba(180, 210, 255, 0.06)');
      spotGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = spotGrad;
      ctx.fillRect(0, 0, width, height);

      // Concentric precision telemetry rings (right-weighted on desktop to balance typography)
      var ringCx = width >= 768 ? width * 0.68 : width * 0.5;
      var ringCy = height * 0.5;
      var baseR = Math.min(width, height) * (width >= 768 ? 0.36 : 0.42);

      ctx.save();
      ctx.translate(ringCx, ringCy);

      // Rotating radar sweep sector inside telemetry ring
      ctx.save();
      ctx.rotate(elapsed * 0.35);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, baseR, -0.28, 0.28);
      ctx.closePath();
      var sweepGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, baseR);
      sweepGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      sweepGrad.addColorStop(0.7, 'rgba(200, 225, 255, 0.06)');
      sweepGrad.addColorStop(1, 'rgba(255, 255, 255, 0.14)');
      ctx.fillStyle = sweepGrad;
      ctx.fill();
      ctx.restore();

      // Outer dashed telemetry ring
      ctx.save();
      ctx.rotate(elapsed * 0.06);
      ctx.beginPath();
      ctx.setLineDash([4, 12]);
      ctx.arc(0, 0, baseR, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.26)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // Middle segmented arc ring (counter-rotating)
      ctx.save();
      ctx.rotate(-elapsed * 0.10);
      for (var a = 0; a < 4; a++) {
        ctx.beginPath();
        var startAngle = a * (Math.PI / 2) + 0.18;
        ctx.arc(0, 0, baseR * 0.74, startAngle, startAngle + (Math.PI / 2 - 0.36));
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.24)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      // Glowing orbital node on middle ring
      var orbX = Math.cos(elapsed * 0.45) * (baseR * 0.74);
      var orbY = Math.sin(elapsed * 0.45) * (baseR * 0.74);
      ctx.beginPath();
      ctx.arc(orbX, orbY, 7, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(orbX, orbY, 3.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
      ctx.fill();
      ctx.restore();

      // Inner fine ring + crosshair degree ticks
      ctx.save();
      ctx.rotate(elapsed * 0.14);
      ctx.beginPath();
      ctx.arc(0, 0, baseR * 0.46, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      for (var t = 0; t < 12; t++) {
        var ang = (t * Math.PI) / 6;
        var r1 = baseR * 0.46 - 6;
        var r2 = baseR * 0.46 + 6;
        ctx.beginPath();
        ctx.moveTo(Math.cos(ang) * r1, Math.sin(ang) * r1);
        ctx.lineTo(Math.cos(ang) * r2, Math.sin(ang) * r2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.34)';
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }
      ctx.restore();
      ctx.restore();

      // Interactive dot-matrix grid intersections + active focal filaments
      var influenceRadius = 240;
      var influenceRadiusSq = influenceRadius * influenceRadius;
      var centerMaskRx = width * 0.52;
      var centerMaskRy = height * 0.48;
      var centerX = width * 0.52;
      var centerY = height * 0.5;
      var activeNodes = [];

      for (var gx = gridSize; gx < width; gx += gridSize) {
        for (var gy = gridSize; gy < height; gy += gridSize) {
          var nx = (gx - centerX) / centerMaskRx;
          var ny = (gy - centerY) / centerMaskRy;
          var edgeDist = nx * nx + ny * ny;
          if (edgeDist > 1.45) continue;
          var vignette = Math.max(0.15, 1 - edgeDist * 0.65);

          var dx = pointer.x - gx;
          var dy = pointer.y - gy;
          var distSq = dx * dx + dy * dy;

          var drawX = gx;
          var drawY = gy;
          var alpha = 0.24 * vignette;
          var radius = 1.4;

          if (distSq < influenceRadiusSq) {
            var dist = Math.sqrt(distSq) || 1;
            var factor = 1 - dist / influenceRadius;
            var ease = factor * factor;
            drawX += (dx / dist) * ease * 9;
            drawY += (dy / dist) * ease * 9;
            alpha = Math.min(0.95, (0.24 + ease * 0.72) * vignette);
            radius = 1.4 + ease * 2.2;
            if (factor > 0.35) {
              activeNodes.push({ x: drawX, y: drawY, f: factor });
            }
          }

          ctx.beginPath();
          ctx.arc(drawX, drawY, radius, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, ' + alpha.toFixed(3) + ')';
          ctx.fill();
        }
      }

      // Draw fine geometric filaments between illuminated nodes near the focal point
      for (var n1 = 0; n1 < activeNodes.length; n1++) {
        for (var n2 = n1 + 1; n2 < activeNodes.length; n2++) {
          var adx = activeNodes[n1].x - activeNodes[n2].x;
          var ady = activeNodes[n1].y - activeNodes[n2].y;
          var adSq = adx * adx + ady * ady;
          if (adSq < 3400) {
            var fAlpha = Math.min(0.38, activeNodes[n1].f * activeNodes[n2].f * 0.45);
            ctx.beginPath();
            ctx.moveTo(activeNodes[n1].x, activeNodes[n1].y);
            ctx.lineTo(activeNodes[n2].x, activeNodes[n2].y);
            ctx.strokeStyle = 'rgba(200, 225, 255, ' + fAlpha.toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Travelling signal comet pulses along grid lines
      if (pulses.length < 6 && Math.random() < 0.06) {
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
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Bright glowing leading tip
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
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
      var section = canvas.closest('section') || canvas.parentElement;
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
          var colSpacing = 54;
          var cols = Math.max(5, Math.floor(width / colSpacing));
          var streams = [];
          for (var c = 0; c < cols; c++) {
            var count = 3;
            for (var k = 0; k < count; k++) {
              streams.push({
                x: (c + 0.5) * colSpacing,
                y: Math.random() * height,
                speed: 22 + Math.random() * 32,
                char: '0x' + hexChars[Math.floor(Math.random() * hexChars.length)] + hexChars[Math.floor(Math.random() * hexChars.length)],
                alpha: 0.20 + Math.random() * 0.22,
                nextSwap: Math.random() * 1.5
              });
            }
          }
          state.streams = streams;
        } else if (type === 'iprayer') {
          var starCount = Math.min(64, Math.max(32, Math.floor((width * height) / 18000)));
          var stars = [];
          for (var s = 0; s < starCount; s++) {
            stars.push({
              x: Math.random() * width,
              y: Math.random() * height,
              vx: (Math.random() - 0.5) * 9,
              vy: (Math.random() - 0.5) * 9,
              r: 1.4 + Math.random() * 2.0,
              phase: Math.random() * Math.PI * 2,
              flare: s % 5 === 0
            });
          }
          state.stars = stars;
        } else if (type === 'voxel') {
          var cubes = [];
          for (var v = 0; v < 9; v++) {
            cubes.push({
              nx: 0.08 + Math.random() * 0.84,
              ny: 0.12 + Math.random() * 0.72,
              size: 18 + Math.random() * 24,
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
          for (var m = 0; m < 60; m++) {
            motes.push({
              x: Math.random() * width,
              y: Math.random() * height,
              vx: (Math.random() - 0.5) * 14,
              vy: -8 - Math.random() * 16,
              r: 1.2 + Math.random() * 2.2,
              alpha: 0.25 + Math.random() * 0.45
            });
          }
          state.motes = motes;
          state.pings = [
            { x: width * 0.72, y: height * 0.48, born: 0, maxR: Math.min(width, height) * 0.42 },
            { x: width * 0.28, y: height * 0.36, born: 0.9, maxR: Math.min(width, height) * 0.36 }
          ];
          state.lastPing = 0;
        } else if (type === 'music') {
          var notes = [];
          for (var n = 0; n < 40; n++) {
            notes.push({
              x: Math.random() * width,
              y: Math.random() * height,
              vy: -12 - Math.random() * 20,
              r: 1.5 + Math.random() * 2.5,
              hue: n % 2 === 0 ? '99, 102, 241' : '56, 189, 248',
              alpha: 0.30 + Math.random() * 0.40
            });
          }
          state.notes = notes;
        }
      };

      var resize = function () {
        var rect = (section || canvas).getBoundingClientRect();
        width = rect.width || window.innerWidth;
        height = rect.height || window.innerHeight;
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        setupState();
      };

      var drawIPasscoder = function (elapsed, dt) {
        // Horizontal cryptographic verification scanline
        var scanY = ((elapsed * 75) % (height + 160)) - 80;
        var scanGrad = ctx.createLinearGradient(0, scanY - 60, 0, scanY + 60);
        scanGrad.addColorStop(0, 'rgba(245, 158, 11, 0)');
        scanGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.22)');
        scanGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = scanGrad;
        ctx.fillRect(0, scanY - 60, width, 120);

        ctx.beginPath();
        ctx.moveTo(0, scanY);
        ctx.lineTo(width, scanY);
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.55)';
        ctx.lineWidth = 1.6;
        ctx.stroke();

        // Concentric cryptographic vault dial on the right side
        var dialCx = width >= 768 ? width * 0.73 : width * 0.5;
        var dialCy = height * 0.5;
        var dialR = Math.min(width, height) * 0.36;

        ctx.save();
        ctx.translate(dialCx, dialCy);

        // Rotating amber radar sector
        ctx.save();
        ctx.rotate(elapsed * 0.45);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, dialR, -0.35, 0.35);
        ctx.closePath();
        var rGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, dialR);
        rGrad.addColorStop(0, 'rgba(245, 158, 11, 0)');
        rGrad.addColorStop(1, 'rgba(245, 158, 11, 0.18)');
        ctx.fillStyle = rGrad;
        ctx.fill();
        ctx.restore();

        // Stepped vault ring
        var stepAngle = Math.floor(elapsed * 0.9) * (Math.PI / 12) + (elapsed * 0.08);
        ctx.save();
        ctx.rotate(stepAngle);
        ctx.beginPath();
        ctx.setLineDash([8, 14]);
        ctx.arc(0, 0, dialR, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.42)';
        ctx.lineWidth = 1.8;
        ctx.stroke();

        for (var i = 0; i < 16; i++) {
          var a = (i * Math.PI) / 8;
          ctx.beginPath();
          ctx.moveTo(Math.cos(a) * (dialR - 8), Math.sin(a) * (dialR - 8));
          ctx.lineTo(Math.cos(a) * (dialR + 8), Math.sin(a) * (dialR + 8));
          ctx.strokeStyle = i % 4 === 0 ? 'rgba(245, 158, 11, 0.65)' : 'rgba(255, 255, 255, 0.22)';
          ctx.lineWidth = i % 4 === 0 ? 2 : 1.2;
          ctx.setLineDash([]);
          ctx.stroke();
        }
        ctx.restore();

        // Counter-rotating inner tumbler
        ctx.save();
        ctx.rotate(-elapsed * 0.12);
        ctx.beginPath();
        ctx.arc(0, 0, dialR * 0.72, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)';
        ctx.lineWidth = 1.4;
        ctx.stroke();
        ctx.restore();
        ctx.restore();

        // Falling hexadecimal cipher streams
        ctx.font = '700 12px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        var streams = state.streams || [];
        for (var s = 0; s < streams.length; s++) {
          var st = streams[s];
          st.y += st.speed * dt;
          if (st.y > height + 24) st.y = -24;

          if (elapsed > st.nextSwap) {
            st.char = '0x' + hexChars[Math.floor(Math.random() * hexChars.length)] + hexChars[Math.floor(Math.random() * hexChars.length)];
            st.nextSwap = elapsed + 0.35 + Math.random() * 1.0;
          }

          var distScan = Math.abs(st.y - scanY);
          var dx = pointer.x - st.x;
          var dy = pointer.y - st.y;
          var distPtr = Math.sqrt(dx * dx + dy * dy);
          var locked = distScan < 38 || (pointer.active && distPtr < 130);

          if (locked) {
            ctx.fillStyle = 'rgba(251, 191, 36, 0.92)';
            ctx.fillText(st.char, st.x, st.y);
            ctx.strokeStyle = 'rgba(245, 158, 11, 0.60)';
            ctx.lineWidth = 1.2;
            ctx.strokeRect(st.x - 20, st.y - 11, 40, 15);
          } else {
            ctx.fillStyle = 'rgba(255, 255, 255, ' + st.alpha.toFixed(3) + ')';
            ctx.fillText(st.char, st.x, st.y);
          }
        }
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

          var twinkle = 0.35 + 0.55 * (0.5 + 0.5 * Math.sin(elapsed * 2.2 + st.phase));
          ctx.beginPath();
          ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(45, 212, 191, ' + twinkle.toFixed(3) + ')';
          ctx.fill();

          if (st.flare) {
            ctx.strokeStyle = 'rgba(153, 246, 228, ' + (twinkle * 0.65).toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(st.x - 6, st.y);
            ctx.lineTo(st.x + 6, st.y);
            ctx.moveTo(st.x, st.y - 6);
            ctx.lineTo(st.x, st.y + 6);
            ctx.stroke();
          }

          for (var j = i + 1; j < stars.length; j++) {
            var st2 = stars[j];
            var dx = st.x - st2.x;
            var dy = st.y - st2.y;
            var dSq = dx * dx + dy * dy;
            if (dSq < 19000) {
              var lineAlpha = (1 - Math.sqrt(dSq) / 138) * 0.28;
              ctx.beginPath();
              ctx.moveTo(st.x, st.y);
              ctx.lineTo(st2.x, st2.y);
              ctx.strokeStyle = 'rgba(45, 212, 191, ' + lineAlpha.toFixed(3) + ')';
              ctx.lineWidth = 1.1;
              ctx.stroke();
            }
          }
        }

        // Sacred Geometric Astrolabe (Rub el Hizb 8-pointed star)
        var cx = width >= 768 ? width * 0.28 : width * 0.5;
        var cy = height * 0.5;
        var R = Math.min(width, height) * 0.36;

        ctx.save();
        ctx.translate(cx, cy);

        // Expanding Qibla azimuth pulse rings
        for (var p = 0; p < 2; p++) {
          var pulseFrac = ((elapsed * 0.25) + p * 0.5) % 1;
          var pulseR = R * (0.30 + pulseFrac * 0.95);
          var pulseAlpha = (1 - pulseFrac) * 0.45;
          ctx.beginPath();
          ctx.arc(0, 0, pulseR, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(45, 212, 191, ' + pulseAlpha.toFixed(3) + ')';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Outer celestial degree ring
        ctx.save();
        ctx.rotate(elapsed * 0.06);
        ctx.beginPath();
        ctx.arc(0, 0, R, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(45, 212, 191, 0.38)';
        ctx.lineWidth = 1.6;
        ctx.stroke();

        for (var m = 0; m < 24; m++) {
          var ang = (m * Math.PI) / 12;
          var inner = m % 3 === 0 ? R - 11 : R - 5;
          ctx.beginPath();
          ctx.moveTo(Math.cos(ang) * inner, Math.sin(ang) * inner);
          ctx.lineTo(Math.cos(ang) * R, Math.sin(ang) * R);
          ctx.strokeStyle = m % 3 === 0 ? 'rgba(45, 212, 191, 0.65)' : 'rgba(255, 255, 255, 0.24)';
          ctx.lineWidth = m % 3 === 0 ? 1.8 : 1;
          ctx.stroke();
        }
        ctx.restore();

        // Rub el Hizb (two overlapping squares at 45 deg) + octagram
        ctx.save();
        ctx.rotate(-elapsed * 0.08);
        var sqR = R * 0.74;
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
            ctx.fillStyle = 'rgba(94, 234, 212, 0.85)';
            ctx.fillRect(vx - 2.5, vy - 2.5, 5, 5);
          }
          ctx.closePath();
          ctx.strokeStyle = 'rgba(45, 212, 191, 0.42)';
          ctx.lineWidth = 1.6;
          ctx.stroke();
          ctx.restore();
        }

        // Inner astrolabe ring
        ctx.beginPath();
        ctx.arc(0, 0, R * 0.38, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(45, 212, 191, 0.30)';
        ctx.lineWidth = 1.4;
        ctx.stroke();
        ctx.restore();

        ctx.restore();
      };

      var drawVoxel = function (elapsed, dt) {
        // Perspective 3D wireframe court floor in the lower half
        var horizonY = height * 0.54;
        var bottomY = height;
        var vanishX = width * 0.5;

        ctx.save();
        // Perspective longitudinal court lines
        var numLines = 11;
        for (var i = 0; i < numLines; i++) {
          var norm = (i / (numLines - 1)) - 0.5;
          var topX = vanishX + norm * width * 0.42;
          var botX = vanishX + norm * width * 1.25;
          ctx.beginPath();
          ctx.moveTo(topX, horizonY);
          ctx.lineTo(botX, bottomY);
          ctx.strokeStyle = i === 5 ? 'rgba(52, 211, 153, 0.48)' : 'rgba(52, 211, 153, 0.18)';
          ctx.lineWidth = i === 5 ? 1.8 : 1.1;
          ctx.stroke();
        }

        // Animated scrolling perspective transverse depth lines
        var scrollOffset = (elapsed * 0.35) % (1 / 6);
        for (var r = 0; r <= 6; r++) {
          var t = Math.min(1, (r / 6) + scrollOffset);
          var easeT = t * t;
          var y = horizonY + easeT * (bottomY - horizonY);
          var span = (0.42 + easeT * 0.83) * width * 0.5;
          ctx.beginPath();
          ctx.moveTo(vanishX - span, y);
          ctx.lineTo(vanishX + span, y);
          ctx.strokeStyle = r === 0 ? 'rgba(52, 211, 153, 0.50)' : 'rgba(52, 211, 153, ' + (0.14 + t * 0.26).toFixed(3) + ')';
          ctx.lineWidth = 1.3;
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

          var cx = cb.nx * width + Math.sin(elapsed * 0.6 + c) * 18;
          var cy = cb.ny * height + Math.cos(elapsed * 0.5 + c) * 16;
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
          ctx.strokeStyle = cb.accent ? 'rgba(52, 211, 153, 0.52)' : 'rgba(255, 255, 255, 0.28)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Autonomous parabolic rally ball + bounce ripples
        var rallyDuration = 2.1;
        var cycle = elapsed / rallyDuration;
        var bounceIndex = Math.floor(cycle);
        var phase = cycle - bounceIndex;
        var goingRight = bounceIndex % 2 === 0;

        var leftX = width * 0.20;
        var rightX = width * 0.80;
        var groundY = height * 0.72;
        var arcHeight = Math.min(height * 0.38, 270);

        if (state.lastBounceSide !== bounceIndex) {
          state.lastBounceSide = bounceIndex;
          state.ripples.push({
            x: goingRight ? leftX : rightX,
            y: groundY,
            r: 6,
            alpha: 0.85
          });
        }

        // Draw expanding isometric voxel bounce ripples
        for (var rp = state.ripples.length - 1; rp >= 0; rp--) {
          var rip = state.ripples[rp];
          rip.r += 70 * dt;
          rip.alpha -= 0.48 * dt;
          if (rip.alpha <= 0) {
            state.ripples.splice(rp, 1);
            continue;
          }
          ctx.save();
          ctx.translate(rip.x, rip.y);
          ctx.scale(1.6, 0.55);
          ctx.strokeStyle = 'rgba(52, 211, 153, ' + rip.alpha.toFixed(3) + ')';
          ctx.lineWidth = 2;
          ctx.strokeRect(-rip.r, -rip.r, rip.r * 2, rip.r * 2);
          ctx.restore();
        }

        // Parabolic trail & glowing voxel ball
        var steps = 14;
        for (var tr = steps; tr >= 0; tr--) {
          var tp = Math.max(0, phase - tr * 0.022);
          var bx = goingRight ? (leftX + (rightX - leftX) * tp) : (rightX - (rightX - leftX) * tp);
          var by = groundY - 4 * arcHeight * tp * (1 - tp);
          var tAlpha = (1 - tr / (steps + 1)) * 0.75;
          var bSize = tr === 0 ? 11 : 6 * (1 - tr / (steps + 2));
          if (tr === 0) {
            ctx.fillStyle = 'rgba(52, 211, 153, 0.28)';
            ctx.fillRect(bx - 12, by - 12, 24, 24);
          }
          ctx.fillStyle = tr === 0 ? 'rgba(110, 231, 183, 0.98)' : 'rgba(52, 211, 153, ' + tAlpha.toFixed(3) + ')';
          ctx.fillRect(bx - bSize * 0.5, by - bSize * 0.5, bSize, bSize);
        }
      };

      var drawSlumber = function (elapsed, dt) {
        // Spawn periodic binaural acoustic sonar pings ("Entity Listening")
        if (elapsed - state.lastPing > 1.9) {
          state.lastPing = elapsed;
          state.pings.push({
            x: width * (0.16 + Math.random() * 0.68),
            y: height * (0.18 + Math.random() * 0.64),
            born: elapsed,
            maxR: Math.min(width, height) * (0.36 + Math.random() * 0.16)
          });
          if (state.pings.length > 5) state.pings.shift();
        }

        // Draw acoustic sonar wave rings
        for (var p = state.pings.length - 1; p >= 0; p--) {
          var pg = state.pings[p];
          var age = elapsed - pg.born;
          var duration = 3.8;
          if (age > duration) {
            state.pings.splice(p, 1);
            continue;
          }

          // Crosshair + glowing dot at sound epicenter
          var crossAlpha = Math.max(0, (1 - age / duration) * 0.75);
          ctx.strokeStyle = 'rgba(239, 68, 68, ' + crossAlpha.toFixed(3) + ')';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(pg.x - 8, pg.y);
          ctx.lineTo(pg.x + 8, pg.y);
          ctx.moveTo(pg.x, pg.y - 8);
          ctx.lineTo(pg.x, pg.y + 8);
          ctx.stroke();

          // 3 harmonic soundwave rings per ping
          for (var w = 0; w < 3; w++) {
            var wAge = age - w * 0.42;
            if (wAge <= 0) continue;
            var prog = wAge / duration;
            if (prog >= 1) continue;
            var r = prog * pg.maxR;
            var alpha = (1 - prog) * 0.58;

            ctx.beginPath();
            var segments = 56;
            for (var s = 0; s <= segments; s++) {
              var a = (s / segments) * Math.PI * 2;
              var jitter = Math.sin(a * 10 + elapsed * 12 + w) * 4.0 * (1 - prog);
              var px = pg.x + Math.cos(a) * (r + jitter);
              var py = pg.y + Math.sin(a) * (r + jitter);
              if (s === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.strokeStyle = 'rgba(239, 68, 68, ' + alpha.toFixed(3) + ')';
            ctx.lineWidth = 1.6;
            ctx.stroke();
          }
        }

        // Drifting abyssal ash & crimson ember motes
        var motes = state.motes || [];
        for (var m = 0; m < motes.length; m++) {
          var mt = motes[m];
          mt.x += (mt.vx + Math.sin(elapsed + m) * 6) * dt;
          mt.y += mt.vy * dt;
          if (mt.y < -10) {
            mt.y = height + 10;
            mt.x = Math.random() * width;
          }
          if (mt.x < 0) mt.x = width;
          if (mt.x > width) mt.x = 0;

          ctx.beginPath();
          ctx.arc(mt.x, mt.y, mt.r, 0, Math.PI * 2);
          ctx.fillStyle = m % 2 === 0
            ? 'rgba(239, 68, 68, ' + Math.min(0.85, mt.alpha * 1.4).toFixed(3) + ')'
            : 'rgba(255, 255, 255, ' + (mt.alpha * 0.8).toFixed(3) + ')';
          ctx.fill();
        }

        // PSX / VHS horizontal tracking glitch band
        var glitchTrigger = Math.sin(elapsed * 3.1) * Math.cos(elapsed * 5.7);
        if (glitchTrigger > 0.55) {
          var gy = (Math.sin(elapsed * 17) * 0.5 + 0.5) * height;
          var gh = 10 + Math.random() * 24;
          ctx.fillStyle = 'rgba(220, 38, 38, 0.16)';
          ctx.fillRect(0, gy, width, gh);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
          ctx.fillRect(0, gy + gh * 0.4, width, 2);
        }
      };

      var drawMusic = function (elapsed, dt) {
        var centerY = height * 0.54;
        var mod = pointer.active ? ((pointer.y / Math.max(1, height)) - 0.5) * 0.7 : 0;

        // Stereo frequency-spectrum analyzer bars along the horizon
        var barCount = 64;
        var totalBarW = Math.min(width * 0.88, 1080);
        var startX = (width - totalBarW) * 0.5;
        var stepX = totalBarW / barCount;

        for (var b = 0; b < barCount; b++) {
          var norm = b / (barCount - 1);
          var env = Math.sin(norm * Math.PI);
          var energy =
            0.45 * Math.sin(elapsed * 2.6 + b * 0.28) +
            0.35 * Math.cos(elapsed * 3.8 - b * 0.42) +
            0.20 * Math.sin(elapsed * 5.5 + b * 0.15);
          var barH = Math.max(6, (22 + Math.abs(energy) * 95) * env);
          var bx = startX + b * stepX;

          ctx.fillStyle = b % 2 === 0 ? 'rgba(99, 102, 241, 0.34)' : 'rgba(56, 189, 248, 0.30)';
          ctx.fillRect(bx, centerY - barH, 2.5, barH * 2);
        }

        // 5 flowing multi-harmonic analog synth waveforms
        var waves = [
          { amp: 58, freq: 0.0055, speed: 1.3, color: 'rgba(99, 102, 241, 0.65)', width: 2.2 },
          { amp: 44, freq: 0.0080, speed: -1.0, color: 'rgba(56, 189, 248, 0.55)', width: 1.8 },
          { amp: 72, freq: 0.0040, speed: 0.8, color: 'rgba(255, 255, 255, 0.35)', width: 1.5 },
          { amp: 32, freq: 0.0115, speed: 1.7, color: 'rgba(129, 140, 248, 0.45)', width: 1.4 },
          { amp: 48, freq: 0.0068, speed: -1.35, color: 'rgba(56, 189, 248, 0.28)', width: 1.2 }
        ];

        for (var w = 0; w < waves.length; w++) {
          var wv = waves[w];
          ctx.beginPath();
          for (var x = 0; x <= width; x += 10) {
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
          nt.x += Math.sin(elapsed * 1.1 + n) * 8 * dt;
          if (nt.y < -10) {
            nt.y = height + 10;
            nt.x = Math.random() * width;
          }
          ctx.beginPath();
          ctx.arc(nt.x, nt.y, nt.r, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(' + nt.hue + ', ' + nt.alpha.toFixed(3) + ')';
          ctx.fill();
        }
      };

      var lastNow = performance.now();
      var render = function (now) {
        if (section && (Math.abs(section.clientWidth - width) > 4 || Math.abs(section.clientHeight - height) > 4)) {
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
