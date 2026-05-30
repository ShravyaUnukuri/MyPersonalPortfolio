/* ===========================
   THEME TOGGLE & COUNTER
=========================== */
const themeToggleBtn = document.getElementById('themeToggle');
const htmlEl = document.documentElement;

if (themeToggleBtn) {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    htmlEl.setAttribute('data-theme', savedTheme);
  }

  themeToggleBtn.addEventListener('click', () => {
    const assembly = themeToggleBtn.querySelector('.lamp-assembly');
    if (assembly) {
      assembly.classList.add('pulled');
    }

    const currentTheme = htmlEl.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Toggle theme with a slight delay matching the pull climax
    setTimeout(() => {
      htmlEl.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    }, 200);

    // Remove pulled class after animation completes (800ms)
    setTimeout(() => {
      if (assembly) assembly.classList.remove('pulled');
    }, 800);
  });
}


// Visitor Counter
const visitCountEl = document.getElementById('visitCount');
const visitCountMobileEl = document.getElementById('visitCountMobile');
function setVisitCount(val) {
  if (visitCountEl) visitCountEl.textContent = val;
  if (visitCountMobileEl) visitCountMobileEl.textContent = val;
}
if (visitCountEl || visitCountMobileEl) {
  fetch('https://api.counterapi.dev/v1/shravyaportfolio/pagevisits/up')
    .then(res => res.json())
    .then(data => {
      setVisitCount(data.count);
    })
    .catch(err => {
      console.error('Counter API error:', err);
      let fallback = parseInt(localStorage.getItem('fallbackCount') || '142');
      fallback++;
      localStorage.setItem('fallbackCount', fallback);
      setVisitCount(fallback);
    });
}

/* ===========================
   CUSTOM CURSOR — BEAN
   (desktop/mouse only)
=========================== */
const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
const bean = document.getElementById('cursor');
const glow = document.getElementById('cursorGlow');

let mouseX = 0, mouseY = 0;
let glowX = 0, glowY = 0;
let isMagnetic = false;

if (!isTouchDevice) {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isMagnetic) {
      bean.style.left = mouseX + 'px';
      bean.style.top = mouseY + 'px';
    }
  });

  // Magnetic Buttons
  document.querySelectorAll('.btn-primary, .btn-ghost, .hero-social-link').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      isMagnetic = true;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      bean.style.left = (rect.left + rect.width / 2) + 'px';
      bean.style.top = (rect.top + rect.height / 2) + 'px';
    });

    el.addEventListener('mouseleave', () => {
      isMagnetic = false;
      el.style.transform = 'translate(0px, 0px)';
    });
  });

  // Smooth glow follow
  function animateGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';
    requestAnimationFrame(animateGlow);
  }
  animateGlow();

  // Bean reacts to hover
  document.querySelectorAll('a, button, .project-card, .cert-card, .stat-card, .skill-group, .contact-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      bean.style.transform = 'translate(-50%, -50%) rotate(-15deg) scale(1.6)';
      bean.style.background = '#b56a52';
      glow.style.width = '70px';
      glow.style.height = '70px';
    });
    el.addEventListener('mouseleave', () => {
      bean.style.transform = 'translate(-50%, -50%) rotate(-15deg) scale(1)';
      bean.style.background = 'var(--accent)';
      glow.style.width = '48px';
      glow.style.height = '48px';
    });
  });
}

/* ===========================
   NAVBAR SCROLL EFFECT
=========================== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

/* ===========================
   MOBILE NAV TOGGLE
=========================== */
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ===========================
   SCROLL REVEAL
=========================== */
const fadeEls = document.querySelectorAll(
  'section, .stat-card, .skill-group, .timeline-item, .research-card, .project-card, .cert-card, .contact-item, .about-text, .about-cards'
);

fadeEls.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeEls.forEach(el => observer.observe(el));

/* ===========================
   STAGGER CHILDREN
=========================== */
document.querySelectorAll('.skills-grid, .projects-grid, .cert-grid, .about-cards').forEach(grid => {
  const children = grid.querySelectorAll('.fade-in');
  children.forEach((child, i) => {
    child.style.animationDelay = `${i * 100}ms`;
  });
});

/* ===========================
   ACTIVE NAV HIGHLIGHT
=========================== */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) current = section.getAttribute('id');
  });

  navAnchors.forEach(a => {
    a.style.color = '';
    if (a.getAttribute('href') === `#${current}`) {
      a.style.color = 'var(--accent)';
    }
  });
});

/* ===========================
   TYPEWRITER EFFECT
=========================== */
const roles = ['Full-Stack Developer', 'Security Researcher', 'Technical Copywriter'];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typewriterEl = document.getElementById('typewriter');

function typeWriter() {
  if (!typewriterEl) return;
  const currentRole = roles[roleIndex];
  
  if (isDeleting) {
    typewriterEl.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typewriterEl.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 40 : 100;

  if (!isDeleting && charIndex === currentRole.length) {
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 500;
  }

  setTimeout(typeWriter, delay);
}

document.addEventListener('DOMContentLoaded', typeWriter);

/* ===========================
   3D TILT EFFECT
=========================== */
if (typeof VanillaTilt !== 'undefined' && !isTouchDevice) {
  VanillaTilt.init(document.querySelectorAll(".stat-card, .cert-card"), {
    max: 8,
    speed: 400,
    glare: true,
    "max-glare": 0.15,
    scale: 1.02
  });
}

/* ===========================
   TAP-TO-FLIP (touch devices)
   Replaces CSS :hover flip
=========================== */
if (isTouchDevice) {
  document.querySelectorAll('.project-card').forEach(card => {
    // Add a subtle hint label on the front
    const hint = document.createElement('p');
    hint.className = 'flip-hint';
    hint.textContent = 'Tap to flip ↩';
    hint.style.cssText = 'font-size:0.68rem;color:var(--text-muted);letter-spacing:0.08em;margin-top:10px;opacity:0.7;';
    const front = card.querySelector('.flip-front');
    if (front) front.appendChild(hint);

    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });
}



/* ===========================
   FLYING LEAVES & FLOWERS
=========================== */
function createFloatingFlora() {
  const container = document.createElement('div');
  container.className = 'floating-flora-container';
  Object.assign(container.style, {
    position: 'fixed', top: '0', left: '0',
    width: '100vw', height: '100vh',
    pointerEvents: 'none', zIndex: '1', overflow: 'hidden'
  });
  document.body.appendChild(container);

  // Cute, varied flora — flowers, petals, leaves, stars, hearts
  const flora = [
    { glyph: '✿',  color: 'var(--flora-1)' }, // dusty rose flower
    { glyph: '✿',  color: 'var(--flora-3)' }, // outlined flower
    { glyph: '⁕',  color: 'var(--flora-2)' }, // five-petal star
    { glyph: '🌸', color: null },              // cherry blossom emoji
    { glyph: '·',  color: 'var(--flora-1)' }, // tiny dot petal
  ];

  const maxParticles = 14;
  let activeParticles = 0;

  // Smooth easing for the opacity envelope:
  // fade in over first 12%, hold, fade out over last 22%
  function opacityAt(t, peak) {
    const fadeIn  = 0.12;
    const fadeOut = 0.22;
    if (t < fadeIn)            return peak * (t / fadeIn);
    if (t > 1 - fadeOut)       return peak * ((1 - t) / fadeOut);
    return peak;
  }

  function spawnParticle(preplacedY) {
    if (activeParticles >= maxParticles) return;
    activeParticles++;

    const item    = flora[Math.floor(Math.random() * flora.length)];
    const size    = Math.random() * 16 + 22;          // 22 – 38 px
    const peakOp  = Math.random() * 0.13 + 0.13;      // 0.13 – 0.26
    const dur     = Math.random() * 12000 + 16000;     // 16 – 28 s
    const swingSpd = Math.random() * 2800 + 1800;      // sway period
    const swingAmp = Math.random() * 45 + 20;          // 20 – 65 px sway
    const windDrift = (Math.random() - 0.4) * 60;     // slight random wind
    const spinTotal = Math.random() * 280 - 140;       // –140° to +140°
    const startX  = Math.random() * window.innerWidth;
    const startY  = preplacedY !== undefined ? preplacedY : -size - 10;

    const el = document.createElement('div');
    Object.assign(el.style, {
      position:       'absolute',
      pointerEvents:  'none',
      width:          `${size}px`,
      height:         `${size}px`,
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      fontSize:       `${size}px`,
      lineHeight:     '1',
      left:           `${startX}px`,
      top:            `${startY}px`,
      opacity:        '0',
      willChange:     'transform, opacity, top, left',
    });
    el.textContent = item.glyph;
    if (item.color) el.style.color = item.color;

    container.appendChild(el);

    const startTime = performance.now();

    function animate(now) {
      const elapsed  = now - startTime;
      const t        = Math.min(elapsed / dur, 1);

      // position
      const y    = startY + (window.innerHeight + size + 60) * t;
      const sway = Math.sin((elapsed / swingSpd) * Math.PI * 2) * swingAmp;
      const x    = startX + sway + windDrift * t;

      // opacity envelope — gentle fade in, long hold, soft fade out
      const op = opacityAt(t, peakOp);

      // tiny scale breathe — grows slightly in mid-flight, shrinks at end
      const scale = 0.85 + 0.2 * Math.sin(t * Math.PI);

      el.style.top       = `${y}px`;
      el.style.left      = `${x}px`;
      el.style.opacity   = op;
      el.style.transform = `rotate(${t * spinTotal}deg) scale(${scale})`;

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        // opacity is already 0 at t=1 — remove silently
        el.remove();
        activeParticles--;
      }
    }

    requestAnimationFrame(animate);
  }

  // Seed initial particles scattered across the full viewport height
  // so the screen isn't empty on load
  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      if (activeParticles < maxParticles) {
        const el = container; // dummy check — spawnParticle handles it
        const preY = Math.random() * window.innerHeight;
        spawnParticle(preY);
      }
    }, i * 600);
  }

  // Keep a gentle stream going
  setInterval(() => spawnParticle(), 2200);
}

document.addEventListener('DOMContentLoaded', createFloatingFlora);
