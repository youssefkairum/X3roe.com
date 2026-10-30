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
      var rect = heroCanvas.getBoundingClientRect();
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
          alpha: 0.16 + Math.random() * 0.22
        });
      } else {
        var col = Math.max(1, Math.min(cols - 1, Math.floor(Math.random() * cols)));
        pulses.push({
          horizontal: false,
          x: col * gridSize,
          y: dir > 0 ? -length : height + length,
          length: length,
          speed: speed,
          alpha: 0.16 + Math.random() * 0.22
        });
      }
    };

    var renderFrame = function (now) {
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
      var spotRadius = Math.min(width, height) * 0.42;
      var spotGrad = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, spotRadius);
      spotGrad.addColorStop(0, 'rgba(255, 255, 255, 0.055)');
      spotGrad.addColorStop(0.5, 'rgba(200, 215, 255, 0.02)');
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
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
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
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.065)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      // Orbital node on middle ring
      var orbX = Math.cos(elapsed * 0.35) * (baseR * 0.74);
      var orbY = Math.sin(elapsed * 0.35) * (baseR * 0.74);
      ctx.beginPath();
      ctx.arc(orbX, orbY, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.fill();
      ctx.restore();

      // Inner fine hairline ring + crosshair ticks
      ctx.save();
      ctx.rotate(elapsed * 0.11);
      ctx.beginPath();
      ctx.arc(0, 0, baseR * 0.46, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.045)';
      ctx.lineWidth = 1;
      ctx.stroke();

      for (var t = 0; t < 12; t++) {
        var ang = (t * Math.PI) / 6;
        var r1 = baseR * 0.46 - 4;
        var r2 = baseR * 0.46 + 4;
        ctx.beginPath();
        ctx.moveTo(Math.cos(ang) * r1, Math.sin(ang) * r1);
        ctx.lineTo(Math.cos(ang) * r2, Math.sin(ang) * r2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.stroke();
      }
      ctx.restore();
      ctx.restore();

      // Interactive dot-matrix grid intersections
      var influenceRadius = 210;
      var influenceRadiusSq = influenceRadius * influenceRadius;
      var centerMaskRx = width * 0.48;
      var centerMaskRy = height * 0.45;
      var centerX = width * 0.54;
      var centerY = height * 0.5;

      for (var gx = gridSize; gx < width; gx += gridSize) {
        for (var gy = gridSize; gy < height; gy += gridSize) {
          // Elliptical vignette so edges fade out smoothly
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
          var alpha = 0.09 * vignette;
          var radius = 1;

          if (distSq < influenceRadiusSq) {
            var dist = Math.sqrt(distSq) || 1;
            var factor = 1 - dist / influenceRadius;
            var ease = factor * factor;
            // Subtle magnetic pull toward focal point
            drawX += (dx / dist) * ease * 7;
            drawY += (dy / dist) * ease * 7;
            alpha = Math.min(0.65, (0.09 + ease * 0.48) * vignette);
            radius = 1 + ease * 1.4;
          }

          ctx.beginPath();
          ctx.arc(drawX, drawY, radius, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, ' + alpha.toFixed(3) + ')';
          ctx.fill();
        }
      }

      // Travelling signal pulses along grid lines
      if (!reduceMotion && pulses.length < 4 && Math.random() < 0.035) {
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

        // Bright leading tip
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, ' + Math.min(0.7, p.alpha * 1.8).toFixed(3) + ')';
        ctx.fill();

        if (
          (p.horizontal && ((p.speed > 0 && p.x - p.length > width) || (p.speed < 0 && p.x + p.length < 0))) ||
          (!p.horizontal && ((p.speed > 0 && p.y - p.length > height) || (p.speed < 0 && p.y + p.length < 0)))
        ) {
          pulses.splice(i, 1);
        }
      }

      if (!reduceMotion && isVisible) {
        rafId = window.requestAnimationFrame(renderFrame);
      } else {
        rafId = null;
      }
    };

    resizeCanvas();
    spawnPulse();
    spawnPulse();

    window.addEventListener('resize', function () {
      resizeCanvas();
      if (reduceMotion) renderFrame(performance.now());
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

    if ('IntersectionObserver' in window && heroSection && !reduceMotion) {
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
})();
