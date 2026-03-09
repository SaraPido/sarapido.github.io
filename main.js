// ── NAV ──
(function() {
  const hamburger = document.querySelector('.nav-hamburger');
  const links = document.querySelector('.nav-links');
  if (hamburger && links) {
    hamburger.addEventListener('click', () => links.classList.toggle('open'));
  }

  // Active nav link
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

// ── SKILL BAR ANIMATION ──
(function() {
  const fills = document.querySelectorAll('.skill-fill');
  if (!fills.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.width;
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  fills.forEach(f => obs.observe(f));
})();

// ── PIXEL MOUNTAIN RUNNER ──
(function() {
  const canvas = document.getElementById('runnerCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const SCALE = 2;
  const GROUND_Y = () => canvas.height - 28;
  const GRAVITY = 0.55;
  const JUMP_FORCE = -11;

  // Colors matching the site palette
  const C = {
    sky: '#0f1f2e',
    moon: '#e8f4f4',
    mountain1: '#1a3a3a',
    mountain2: '#1a6b6b',
    ground: '#2a9090',
    groundLine: '#3ab0b0',
    runner: '#e8f4f4',
    accent: '#e05c4b',
    star: '#8ec4c4',
  };

  // Stars
  const stars = Array.from({ length: 30 }, () => ({
    x: Math.random() * 2000,
    y: Math.random() * (canvas.height * 0.5),
    r: Math.random() * 1.5 + 0.5,
    twinkle: Math.random() * Math.PI * 2,
  }));

  // Mountains (parallax layers)
  function makeMountains(n, minH, maxH, spread) {
    return Array.from({ length: n }, (_, i) => ({
      x: i * spread,
      h: minH + Math.random() * (maxH - minH),
      w: spread * (0.8 + Math.random() * 0.5),
    }));
  }
  const mts1 = makeMountains(8, 40, 70, 200);
  const mts2 = makeMountains(12, 20, 40, 130);

  // Obstacles
  const obstacles = [];
  let obstacleTimer = 0;
  let obstacleInterval = 110;

  function spawnObstacle() {
    const type = Math.random() < 0.6 ? 'rock' : 'flag';
    obstacles.push({ x: canvas.width + 20, type, w: type === 'rock' ? 14 : 6, h: type === 'rock' ? 16 : 28 });
  }

  // Runner state
  const runner = {
    x: 80,
    y: GROUND_Y(),
    vy: 0,
    onGround: true,
    frame: 0,
    frameTimer: 0,
    dead: false,
    jumpPressed: false,
  };

  let scroll = 0;
  let score = 0;
  let speed = 3;
  let highScore = 0;
  let gameOver = false;
  let flash = 0;

  // Input
  function jump() {
    if (runner.onGround && !runner.dead) {
      runner.vy = JUMP_FORCE;
      runner.onGround = false;
    }
  }

  window.addEventListener('keydown', e => { if (e.code === 'Space' || e.code === 'ArrowUp') jump(); });
  canvas.addEventListener('click', jump);
  canvas.addEventListener('touchstart', e => { e.preventDefault(); jump(); }, { passive: false });

  function drawPixelMountain(x, baseY, w, h, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    const peak = x + w / 2;
    ctx.moveTo(x, baseY);
    ctx.lineTo(peak, baseY - h);
    ctx.lineTo(x + w, baseY);
    ctx.closePath();
    ctx.fill();
    // Snow cap
    ctx.fillStyle = 'rgba(232,244,244,0.2)';
    ctx.beginPath();
    ctx.moveTo(peak, baseY - h);
    ctx.lineTo(peak - w * 0.12, baseY - h * 0.75);
    ctx.lineTo(peak + w * 0.12, baseY - h * 0.75);
    ctx.closePath();
    ctx.fill();
  }

  // Pixel runner — 7 frames of stick figure
  function drawRunner(x, y, frame, dead) {
    const s = SCALE;
    ctx.save();
    ctx.translate(Math.floor(x), Math.floor(y));
    ctx.fillStyle = C.runner;
    ctx.strokeStyle = C.runner;
    ctx.lineWidth = 2;

    if (dead) {
      // X eyes, flat
      ctx.fillStyle = C.accent;
      // body lying down
      ctx.fillRect(-8, -6, 16, 4);
      ctx.fillRect(-6, -10, 4, 4); // head
      // X eyes
      ctx.strokeStyle = '#0f1f2e';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(-5,-9); ctx.lineTo(-3,-7); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-3,-9); ctx.lineTo(-5,-7); ctx.stroke();
      ctx.restore();
      return;
    }

    // Head
    ctx.fillStyle = C.runner;
    ctx.fillRect(-5, -32, 10, 10);
    // Hair flick (cute detail)
    ctx.fillRect(-3, -34, 6, 2);
    ctx.fillRect(4, -33, 2, 2);

    // Ponytail (Sara's touch)
    ctx.fillStyle = C.accent;
    const pt = [2, -3, 4, -2, 2, -1][frame % 3];
    ctx.fillRect(5, -30 + pt, 4, 2);
    ctx.fillRect(9, -28 + pt, 2, 2);

    ctx.fillStyle = C.runner;
    // Torso
    ctx.fillRect(-4, -22, 8, 10);

    // Legs — 6 frames of running
    const legFrames = [
      [[-3,-12,0,12],[ 2,-12,0,12]],  // 0 neutral
      [[-4,-12,0,10],[ 2,-12,2, 8]],  // 1
      [[-5,-12,-2, 8],[ 2,-12,4, 6]], // 2 stride
      [[-3,-12,0,12],[ 2,-12,0,12]],  // 3
      [[-2,-12,2, 8],[-4,-12,0,10]],  // 4
      [[ 2,-12,4, 6],[-5,-12,-2, 8]], // 5 stride back
    ];
    const f = frame % 6;
    // leg 1
    ctx.fillRect(legFrames[f][0][0], -12 + legFrames[f][0][1], 3, 10);
    ctx.fillRect(legFrames[f][0][2], -12 + legFrames[f][0][3] - 2, 4, 4);
    // leg 2
    ctx.fillRect(legFrames[f][1][0], -12 + legFrames[f][1][1], 3, 10);
    ctx.fillRect(legFrames[f][1][2], -12 + legFrames[f][1][3] - 2, 4, 4);

    // Arms swing
    const armSwing = Math.sin(frame * 1.05) * 6;
    ctx.fillRect(-8, -22 + armSwing, 4, 8);
    ctx.fillRect( 4, -22 - armSwing, 4, 8);

    ctx.restore();
  }

  function drawObstacle(obs) {
    ctx.save();
    ctx.translate(Math.floor(obs.x), GROUND_Y());
    if (obs.type === 'rock') {
      ctx.fillStyle = '#3a5a5a';
      ctx.fillRect(-obs.w/2, -obs.h, obs.w, obs.h);
      ctx.fillStyle = '#4a7a7a';
      ctx.fillRect(-obs.w/2+2, -obs.h, obs.w-4, 4);
    } else {
      // Flag / summit marker
      ctx.fillStyle = '#3a5a5a';
      ctx.fillRect(-2, -obs.h, 3, obs.h);
      ctx.fillStyle = C.accent;
      ctx.fillRect(1, -obs.h, 10, 7);
    }
    ctx.restore();
  }

  let lastTime = 0;
  function loop(ts) {
    const dt = Math.min((ts - lastTime) / 16.67, 3);
    lastTime = ts;

    // Update
    if (!gameOver) {
      scroll += speed * dt;
      speed = 3 + score * 0.0015;
      score += dt * 0.5;

      // Obstacles
      obstacleTimer += dt;
      if (obstacleTimer >= obstacleInterval) {
        spawnObstacle();
        obstacleTimer = 0;
        obstacleInterval = 80 + Math.random() * 60;
      }

      for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= speed * dt;
        if (obstacles[i].x < -40) obstacles.splice(i, 1);
      }

      // Physics
      if (!runner.onGround) {
        runner.vy += GRAVITY * dt;
        runner.y += runner.vy * dt;
        if (runner.y >= GROUND_Y()) {
          runner.y = GROUND_Y();
          runner.vy = 0;
          runner.onGround = true;
        }
      }

      // Animate
      runner.frameTimer += dt;
      if (runner.frameTimer > 4) {
        runner.frame++;
        runner.frameTimer = 0;
      }

      // Collision
      for (const obs of obstacles) {
        const dx = Math.abs(obs.x - runner.x);
        const dy = runner.y - (GROUND_Y() - obs.h + 2);
        if (dx < obs.w * 0.5 + 5 && dy < obs.h - 2) {
          gameOver = true;
          runner.dead = true;
          if (score > highScore) highScore = score;
          flash = 8;
          setTimeout(() => { gameOver = false; runner.dead = false; obstacles.length = 0; score = 0; speed = 3; obstacleTimer = 0; runner.y = GROUND_Y(); runner.vy = 0; runner.onGround = true; }, 1400);
          break;
        }
      }
    }

    // Draw background
    ctx.fillStyle = C.sky;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Flash on death
    if (flash > 0) {
      ctx.fillStyle = `rgba(224,92,75,${flash * 0.04})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      flash--;
    }

    // Stars
    const t = ts / 1000;
    for (const s of stars) {
      const alpha = 0.4 + 0.3 * Math.sin(s.twinkle + t * 0.8);
      ctx.fillStyle = `rgba(140,196,196,${alpha})`;
      ctx.beginPath();
      ctx.arc(s.x % canvas.width, s.y * canvas.height / 120, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Moon
    ctx.fillStyle = C.moon;
    ctx.beginPath();
    ctx.arc(canvas.width - 60, 28, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = C.sky;
    ctx.beginPath();
    ctx.arc(canvas.width - 54, 24, 11, 0, Math.PI * 2);
    ctx.fill();

    // Mountains layer 1 (far)
    const gY = GROUND_Y();
    for (const m of mts1) {
      const mx = ((m.x - scroll * 0.2) % (canvas.width + 300) + canvas.width + 300) % (canvas.width + 300) - 150;
      drawPixelMountain(mx, gY, m.w, m.h, C.mountain1);
    }
    // Mountains layer 2 (near)
    for (const m of mts2) {
      const mx = ((m.x - scroll * 0.5) % (canvas.width + 250) + canvas.width + 250) % (canvas.width + 250) - 100;
      drawPixelMountain(mx, gY, m.w, m.h, C.mountain2);
    }

    // Ground
    ctx.fillStyle = C.ground;
    ctx.fillRect(0, gY, canvas.width, canvas.height - gY);
    ctx.strokeStyle = C.groundLine;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, gY);
    ctx.lineTo(canvas.width, gY);
    ctx.stroke();

    // Ground dots scrolling
    ctx.fillStyle = C.groundLine;
    for (let i = 0; i < 20; i++) {
      const gx = ((i * 60 - scroll * 1.5 % 60) % canvas.width + canvas.width) % canvas.width;
      ctx.fillRect(gx, gY + 6, 3, 2);
    }

    // Obstacles
    for (const obs of obstacles) drawObstacle(obs);

    // Runner
    drawRunner(runner.x, runner.y, runner.frame, runner.dead);

    // Score
    ctx.fillStyle = 'rgba(140,196,196,0.7)';
    ctx.font = `${SCALE * 5}px 'DM Mono', monospace`;
    ctx.textAlign = 'right';
    ctx.fillText(`${Math.floor(score).toString().padStart(5,'0')}m`, canvas.width - 12, 20);
    if (highScore > 0) {
      ctx.fillStyle = 'rgba(224,92,75,0.6)';
      ctx.fillText(`HI ${Math.floor(highScore).toString().padStart(5,'0')}`, canvas.width - 12, 36);
    }

    if (gameOver) {
      ctx.fillStyle = 'rgba(232,244,244,0.85)';
      ctx.font = "bold 13px 'DM Sans', sans-serif";
      ctx.textAlign = 'center';
      ctx.fillText('CLICK or SPACE to restart', canvas.width / 2, gY / 2 + 8);
    } else if (score < 5) {
      ctx.fillStyle = 'rgba(140,196,196,0.55)';
      ctx.font = "11px 'DM Sans', sans-serif";
      ctx.textAlign = 'center';
      ctx.fillText('CLICK · SPACE · TAP to jump', canvas.width / 2, gY / 2 + 8);
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
})();
