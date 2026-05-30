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
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100vw';
  container.style.height = '100vh';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '1'; // just above background blobs, behind cards
  container.style.overflow = 'hidden';
  document.body.appendChild(container);

  const leavesAndFlowers = [
    { type: 'text', content: '✿', color: 'var(--flora-1)' },       // Flower (Rose)
    { type: 'text', content: '✿', color: 'var(--flora-2)' },       // Flower (Lavender)
    { type: 'text', content: '✿', color: 'var(--flora-3)' },       // Flower (Plum)
    { 
      type: 'svg', 
      content: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17,2C14,2 10.3,3.7 7.7,6.3C4,10 3,15.5 3,20C3,20.5 3.5,21 4,21C8.5,21 14,20 17.7,16.3C20.3,13.7 22,10 22,7C22,2 17,2 17,2Z"/></svg>', 
      color: 'var(--flora-4)' 
    }, // Leaf (Forest green)
    { 
      type: 'svg', 
      content: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17,2C14,2 10.3,3.7 7.7,6.3C4,10 3,15.5 3,20C3,20.5 3.5,21 4,21C8.5,21 14,20 17.7,16.3C20.3,13.7 22,10 22,7C22,2 17,2 17,2Z"/></svg>', 
      color: 'var(--flora-5)' 
    }  // Leaf (Olive green)
  ];

  const maxParticles = 12;
  let activeParticles = 0;

  function spawnParticle() {
    if (activeParticles >= maxParticles) return;
    
    activeParticles++;
    const item = leavesAndFlowers[Math.floor(Math.random() * leavesAndFlowers.length)];
    const particle = document.createElement('div');
    
    particle.style.position = 'absolute';
    particle.style.pointerEvents = 'none';
    
    if (item.type === 'text') {
      particle.textContent = item.content;
    } else {
      particle.innerHTML = item.content;
      const svg = particle.querySelector('svg');
      if (svg) {
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.style.display = 'block';
      }
    }
    
    // Randomize initial properties
    const startX = Math.random() * window.innerWidth;
    const startY = -60;
    const size = Math.random() * 20 + 30; // 30px to 50px
    const opacity = Math.random() * 0.12 + 0.12; // 0.12 to 0.24 opacity
    const duration = Math.random() * 14000 + 14000; // 14s to 28s for slow gentle float
    const swingSpeed = Math.random() * 3000 + 2000; // speed of sway
    const swingRange = Math.random() * 50 + 25; // 25px to 75px sway range
    const rotationSpeed = Math.random() * 360 - 180; // random rotation degree
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.display = 'flex';
    particle.style.alignItems = 'center';
    particle.style.justifyContent = 'center';
    
    particle.style.left = `${startX}px`;
    particle.style.top = `${startY}px`;
    particle.style.fontSize = `${size}px`;
    particle.style.opacity = opacity;
    particle.style.color = item.color;
    particle.style.transform = `rotate(0deg)`;
    particle.style.transition = `transform ${duration}ms linear, top ${duration}ms linear, left ${duration}ms linear`;
    
    container.appendChild(particle);

    // Force style recalculation for transitions
    particle.getBoundingClientRect();
    
    // Animate using JS interval + transition or requestAnimationFrame for smooth drift
    const startTime = Date.now();
    
    function animate() {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;
      
      if (progress >= 1) {
        particle.remove();
        activeParticles--;
        return;
      }
      
      // Calculate new position
      const currentY = startY + (window.innerHeight + 80) * progress;
      const sway = Math.sin((elapsed / swingSpeed) * Math.PI) * swingRange;
      const currentX = startX + sway - (progress * 50); // slight leftwards wind drift
      
      particle.style.top = `${currentY}px`;
      particle.style.left = `${currentX}px`;
      particle.style.transform = `rotate(${progress * rotationSpeed}deg)`;
      
      requestAnimationFrame(animate);
    }
    
    requestAnimationFrame(animate);
  }

  // Initial particles spread across height
  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      spawnParticle();
      const lastChild = container.lastChild;
      if (lastChild) {
        lastChild.style.top = `${Math.random() * window.innerHeight}px`;
      }
    }, i * 1500);
  }

  // Spawning interval
  setInterval(spawnParticle, 1800);
}

document.addEventListener('DOMContentLoaded', createFloatingFlora);
