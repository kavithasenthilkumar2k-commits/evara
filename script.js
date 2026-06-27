/* =============================================
   EVARA INTERIORS — script.js
   ============================================= */

/* ---- NAVBAR SCROLL ---- */

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});


/* ---- HAMBURGER MENU ---- */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger) {
 hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinks.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !hamburger.contains(e.target)) {
      navLinks.classList.remove('open');
    }
  });
}

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

/* ---- SCROLL REVEAL ---- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ---- STAT COUNTER ANIMATION ---- */
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      if (!target) return;
      let current = 0;
      const increment = target / 55;
      const timer = setInterval(() => {
        current = Math.min(current + increment, target);
        el.textContent = Math.floor(current) + '+';
        if (current >= target) clearInterval(timer);
      }, 18);
      countObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));

/* ---- TESTIMONIALS CAROUSEL ---- */
let currentSlide = 0;
const slides = document.querySelectorAll('.testimonial-slide');
const dots   = document.querySelectorAll('.t-dot');

function goToSlide(index) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = index;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

// Make goToSlide global so inline onclick works
window.goToSlide = goToSlide;

/* ---- BRAND ASSOCIATES (SLIDESHOW) ---- */
(function() {
  let partnerIdx = 0;
  const track = document.getElementById('partnersTrack');
  const dots = document.querySelectorAll('.partner-dot');
  if (!track || !dots.length) return;

  window.goToPartnerSlide = function(idx) {
    const offset = idx * 100;
    track.style.transform = `translateX(-${offset}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    partnerIdx = idx;
  };

  let autoAdvance = setInterval(() => {
    partnerIdx = (partnerIdx + 1) % dots.length;
    goToPartnerSlide(partnerIdx);
  }, 3000);
})();

// Auto rotate every 5 seconds
if(slides.length) {
  setInterval(() => {
    goToSlide((currentSlide + 1) % slides.length);
  }, 5000);
}

/* ---- BEFORE / AFTER SLIDER ---- */
(function () {
  const slider  = document.getElementById('baSlider');
  const before  = document.getElementById('baBefore');
  const handle  = document.getElementById('baHandle');
  if (!slider || !before || !handle) return;

  let dragging = false;

  function setPosition(clientX) {
    const rect = slider.getBoundingClientRect();
    let pct = (clientX - rect.left) / rect.width;
    pct = Math.max(0.02, Math.min(0.98, pct));
    const pctStr = (pct * 100).toFixed(2) + '%';
    before.style.width  = pctStr;
    handle.style.left   = pctStr;
  }

  // Mouse events
  handle.style.pointerEvents = 'auto';
  handle.addEventListener('mousedown', (e) => {
    dragging = true;
    e.preventDefault();
  });

  slider.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    setPosition(e.clientX);
  });

  window.addEventListener('mouseup', () => { dragging = false; });

  // Touch events
  handle.addEventListener('touchstart', (e) => {
    dragging = true;
    e.preventDefault();
  }, { passive: false });

  slider.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    setPosition(e.touches[0].clientX);
    e.preventDefault();
  }, { passive: false });

  window.addEventListener('touchend', () => { dragging = false; });

  // Click anywhere on slider
  slider.addEventListener('click', (e) => {
    setPosition(e.clientX);
  });
})();

/* ---- RENDER TO REALITY (COMPARE SLIDER) ---- */
(function () {
  const wrap = document.getElementById('renderCompare');
  const leftImg = document.getElementById('renderCompareLeftImg');
  const rightImg = document.getElementById('renderCompareRightImg');
  const handle = document.getElementById('renderCompareHandle');

  if (!wrap || !leftImg || !rightImg || !handle) return;

  let dragging = false;

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function setPositionFromClientX(clientX) {
    const rect = wrap.getBoundingClientRect();
    let pct = (clientX - rect.left) / rect.width;
    pct = clamp(pct, 0.02, 0.98);

    // Reveal the Reality image by adjusting its clip-path.
    // pct controls how much of the image from the left is visible.
    const pctStr = (pct * 100).toFixed(2) + '%';
    rightImg.style.clipPath = `inset(0 ${100 - pct * 100}% 0 0)`;

    // Position handle in the center
    handle.style.left = pctStr;
  }

  // Initialize
  rightImg.style.clipPath = 'inset(0 50% 0 0)';
  handle.style.left = '50%';

  // Mouse
  handle.addEventListener('mousedown', (e) => {
    dragging = true;
    e.preventDefault();
  });

  wrap.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    setPositionFromClientX(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    dragging = false;
  });

  // Touch
  handle.addEventListener('touchstart', (e) => {
    dragging = true;
    e.preventDefault();
  }, { passive: false });

  wrap.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    const touch = e.touches && e.touches[0];
    if (!touch) return;
    setPositionFromClientX(touch.clientX);
    e.preventDefault();
  }, { passive: false });

  window.addEventListener('touchend', () => {
    dragging = false;
  });

  // Click anywhere to set
  wrap.addEventListener('click', (e) => {
    if (dragging) return;
    setPositionFromClientX(e.clientX);
  });
})();
/* ---- MAIN CONTACT FORM SUBMISSION ---- */
const mainForm = document.getElementById('contactForm');
if (mainForm) {
  mainForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const fName = document.getElementById('name')?.value || '';
    const payload = {
      Timestamp: new Date().toLocaleString('en-IN'),
      Name: fName,
      Phone: "'" + (document.getElementById('phoneCode')?.value || '') + ' ' + (document.getElementById('phone')?.value || ''),
      Email: document.getElementById('email')?.value || '',
      'Property Location': document.getElementById('fLocation')?.value || '',
      'Property Type': document.getElementById('fType')?.value || '',
      "Updates checkBox": document.getElementById('waCheckbox')?.checked ? 'Yes' : 'No',
      Source: 'Footer Form',
    };

    const btn = mainForm.querySelector('[type=submit]');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    fetch('https://hook.eu1.make.com/qi8o4y1zdt79iaqgmpekp9mc1nf2h4ou', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).finally(() => {
      showThankYou(fName);
      mainForm.reset();
      btn.textContent = 'Send Enquiry';
      btn.disabled = false;
    });
  });
}

/* ---- AUTO FOOTER YEAR ---- */
const yearEl = document.getElementById('footerYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---- SMOOTH SCROLL OFFSET (for fixed navbar) ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#' || this.hasAttribute('onclick')) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const navH = document.getElementById('navbar')?.offsetHeight || 70;
    const top = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


// ----------------------------
// Projects overlay (Fix 2A)
// ----------------------------
window.projectData = {
  sunshine: {
    name: 'House of Sunshine',
    category: 'Residential',
    location: 'Chennai',
    year: '2024',
    area: '1300 sq.ft',
    description:
      "After thoughtful analysis of the client's lifestyle, the design intent was simple — elegant, cozy, and thoughtful light layering. Warm tones and carefully considered lighting transform this Chennai home into a sanctuary.",
    images: [
      'images/portfolio/sunshine-1.jpg',
      'images/portfolio/sunshine-2.jpg',
      'images/portfolio/sunshine-3.jpg',
      'images/portfolio/sunshine-4.jpg'
    ]
  },
  kitchen: {
    name: 'Smart Kitchen',
    category: 'Residential',
    location: 'Chennai',
    year: '2024',
    area: '130 sq.ft',
    description:
      'Smart storage solutions proposed thereby addressing every need of the client while not compromising on aesthetics and quality.',
    images: [
      'images/portfolio/kitchen-1.jpg',
      'images/portfolio/kitchen-2.jpg',
      'images/portfolio/kitchen-3.jpg',
      'images/portfolio/kitchen-4.jpg'
    ]
  },
  minimalism: {
    name: 'House of Minimalism',
    category: 'Residential',
    location: 'Chennai',
    year: '2024',
    area: '1500 sq.ft',
    description:
      'With a neutral color palette, the brief was to keep the house breathable with optimal functional spaces and to let in a lot of natural sunlight.',
    images: [
      'images/portfolio/minimalism-1.jpg',
      'images/portfolio/minimalism-2.jpg',
      'images/portfolio/minimalism-3.jpg',
      'images/portfolio/minimalism-4.jpg'
    ]
  },
  render: {
    name: 'Render to Reality',
    category: 'Residential',
    location: 'Chennai',
    year: '2024',
    area: '—',
    description: 'A design exploration balancing render intent with real-world comfort.',
    images: [
      'images/portfolio/render.png',
      'images/portfolio/reality.png',
      'images/portfolio/before.png',
      'images/portfolio/after.png'
    ]
  },
  warmKitchen: {
    name: 'The Warm Kitchen',
    category: 'Residential',
    location: 'Chennai',
    year: '2024',
    area: '—',
    description: 'Warm material selections paired with layered task lighting.',
    images: [
      'images/portfolio/warmkitchen-1.jpg',
      'images/portfolio/warmkitchen-2.jpg',
      'images/portfolio/warmkitchen-3.jpg',
      'images/portfolio/warmkitchen-4.jpg'
    ]
  },
  studioSilence: {
    name: 'Studio in Silence',
    category: 'Residential',
    location: 'Chennai',
    year: '2024',
    area: '—',
    description: 'A calm studio layout designed for focus, flow, and quiet luxury.',
    images: [
      'images/portfolio/studioin-silence-1.jpg',
      'images/portfolio/studioin-silence-2.jpg',
      'images/portfolio/studioin-silence-3.jpg',
      'images/portfolio/studioin-silence-4.jpg'
    ]
  },
  ecrVilla: {
    name: 'ECR Villa',
    category: 'Residential',
    location: 'Chennai',
    year: '2024',
    area: '—',
    description: 'Coastal modern interiors with breathable spaces and natural light.',
    images: [
      'images/portfolio/ecrvilla-1.jpg',
      'images/portfolio/ecrvilla-2.jpg',
      'images/portfolio/ecrvilla-3.jpg',
      'images/portfolio/ecrvilla-4.jpg'
    ]
  }
};

window.openDetail = function (key) {
  const p = window.projectData[key];
  if (!p) return;

  const detail = document.getElementById('project-detail');
  const content = document.getElementById('detail-content');
  if (!detail || !content) return;

  content.innerHTML = `
    <div style="margin-bottom:40px;">
      <img src="${p.images[0]}" alt="${p.name}" style="width:100%;height:400px;object-fit:cover;background:#e0dbd4;" />
    </div>
    <span style="font-size:14px;letter-spacing:0.12em;text-transform:uppercase;color:var(--teal)">${p.category} · ${p.location} · ${p.year} · ${p.area}</span>
    <h2 style="font-family:'Cormorant Garamond',serif;font-size:2.5rem;font-weight:400;color:var(--warm-black);margin:12px 0 20px;">${p.name}</h2>
    <p style="font-size:0.95rem;color:var(--warm-grey);line-height:1.8;max-width:700px;margin-bottom:40px;">${p.description}</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
      ${p.images
        .map(
          (img) =>
            `<img src="${img}" alt="${p.name}" style="width:100%;aspect-ratio:4/3;object-fit:cover;background:#e0dbd4;" />`
        )
        .join('')}
    </div>
  `;

  detail.style.display = 'block';
  window.scrollTo(0, 0);
};

window.closeDetail = function () {
  const detail = document.getElementById('project-detail');
  if (!detail) return;
  detail.style.display = 'none';
};

window.showAllProjects = function () {
  const all = document.getElementById('all-projects');
  const grid = document.getElementById('projects-gallery-grid');
  if (!all || !grid) return;

  const items = [
    { key: 'sunshine', name: 'House of Sunshine' },
    { key: 'kitchen', name: 'Smart Kitchen' },
    { key: 'minimalism', name: 'House of Minimalism' },
    { key: 'render', name: 'Render to Reality' },
    { key: 'warmKitchen', name: 'The Warm Kitchen' },
    { key: 'studioSilence', name: 'Studio in Silence' },
    { key: 'ecrVilla', name: 'ECR Villa' }
  ];

  grid.innerHTML = items
    .map(
      (it) => `
      <div class="project-card" style="cursor:pointer;" onclick="openDetail('${it.key}')">
        <div class="project-card-link">
          <img src="images/portfolio/${it.key}-1.jpg" alt="${it.name}" style="width:100%;height:220px;object-fit:cover;" />
          <div class="project-card-overlay" style="opacity:1; background:rgba(26,21,16,0.2);">
            <div class="project-card-meta">
              <span class="project-card-cat" style="color:rgba(13,148,136,0.95);">Project</span>
              <div class="project-card-name" style="color:var(--warm-white);">${it.name}</div>
            </div>
          </div>
        </div>
      </div>
    `
    )
    .join('');

  all.style.display = 'block';
  window.scrollTo(0, 0);
};

window.closeAllProjects = function () {
  const all = document.getElementById('all-projects');
  if (!all) return;
  all.style.display = 'none';
  window.scrollTo(0, 0);
  closeDetail();
};

/* ---- THANK YOU POPUP FUNCTIONS ---- */
window.closeThankYou = function() {
  const el = document.getElementById('thankYouOverlay');
  if (el) el.style.display = 'none';
};
// Close thank you overlay on backdrop click
document.getElementById('thankYouOverlay').addEventListener('click', function(e) {
  if (e.target === this) closeThankYou();
});

window.showThankYou = function(name) {
  const el = document.getElementById('thankYouName');
  if(name) el.textContent = 'Thank you, ' + name + '!';
  else el.textContent = 'Thank you!';
  const overlay = document.getElementById('thankYouOverlay');
  if (overlay) overlay.style.display = 'flex';
};
// Close thank you overlay on backdrop click
document.getElementById('thankYouOverlay').addEventListener('click', function(e) {
  if (e.target === this) closeThankYou();
});
/* ---- CONSULTATION POPUP LOGIC ---- */
(function() {
  const popup = document.getElementById('consultationPopup');
  if (!popup) return;

  const closeBtn = popup.querySelector('.popup-close-btn');
  const popupForm = document.getElementById('popupConsultationForm');

  window.openConsultationPopup = function(e) {
    if (e) e.preventDefault();
    popup.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeConsultationPopup = function () {
    const popup = document.getElementById('consultationPopup');
    if (popup) {
      popup.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (closeBtn) closeBtn.addEventListener('click', window.closeConsultationPopup);

popup.addEventListener('click', (e) => {
  if (e.target === popup) window.closeConsultationPopup();
});

  /* POPUP FORM SUBMISSION */
  if(popupForm) {
    popupForm.addEventListener('submit', function (e) {
      if (e.target.id !== 'popupConsultationForm') return;
      e.preventDefault();
      const payload = {
        Timestamp: new Date().toLocaleString('en-IN'),
        Name: document.getElementById('popupName')?.value || '',
        Phone: "'" + (document.getElementById('popupPhoneCode')?.value || '') + ' ' + (document.getElementById('popupPhone')?.value || ''),
        Email: document.getElementById('popupEmail')?.value || '',
        'Property Location': document.getElementById('popupLocation')?.value || '',
        'Property Type': document.getElementById('popupType')?.value || '',
        "Updates checkBox": document.getElementById('popup-updates')?.checked ? 'Yes' : 'No',
        Source: 'Popup Form',
      };

      const proxyUrl = 'https://corsproxy.io/?';
      const targetUrl = 'https://hook.eu1.make.com/qi8o4y1zdt79iaqgmpekp9mc1nf2h4ou';

      fetch(proxyUrl + encodeURIComponent(targetUrl), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .finally(() => {
        window.closeConsultationPopup();
        showThankYou(payload.Name);
        popupForm.reset();
      });
    });
  }
})();

/* ---- FLOATING WHATSAPP BUTTON LOGIC ---- */
window.handleWhatsAppClick = function() {
  const message = "Hi Evara !!\nI need your consultation..\nWhen can we connect ?";
  const url = "https://wa.me/916282574047?text=" + encodeURIComponent(message);
  window.open(url, '_blank');
};
/* ---- HERO SLIDESHOW LOGIC ---- */
(function() {
  let heroIdx = 0;
  const slides = document.querySelectorAll('#hero .hero-slide');
  const dots = document.querySelectorAll('#hero .h-dot');
  if (!slides.length) return;

  window.setHeroSlide = function(idx) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    heroIdx = idx;
    slides[heroIdx].classList.add('active');
    dots[heroIdx].classList.add('active');
  };

  let heroInterval = setInterval(() => {
    setHeroSlide((heroIdx + 1) % slides.length);
  }, 7500);

  dots.forEach(dot => {
    dot.addEventListener('click', () => clearInterval(heroInterval));
  });
})();


/* ---- MOBILE REVIEWS — 9 DOT SLIDING NAVIGATOR ---- */
(function() {
  if (window.innerWidth > 768) return;

  const TOTAL = 7;
  const VISIBLE = 6;
  const DOT_SIZE = 8;
  const ACTIVE_SIZE = 11;
  const GAP = 8;
  const UNIT = DOT_SIZE + GAP;

  // Get all 9 review cards
  const allCards = document.querySelectorAll('.review-card');
  if (!allCards.length) return;

  let cur = 0;

  // Hide desktop controls on mobile
  const desktopDots = document.querySelector('.reviews-dots');
  const prevBtn = document.querySelector('.reviews-prev');
  const nextBtn = document.querySelector('.reviews-next');
  if (desktopDots) desktopDots.style.display = 'none';

  // Show all slides, hide all cards except current
  document.querySelectorAll('.reviews-slide').forEach(s => {
    s.classList.add('active');
    s.style.display = 'block';
    s.style.gridTemplateColumns = '1fr';
  });

  allCards.forEach((card, i) => {
    card.style.display = i === 0 ? 'block' : 'none';
  });

  // Create mobile dot navigator
  const nav = document.createElement('div');
  nav.id = 'mobileReviewNav';
  nav.style.cssText = 'display:flex;align-items:center;justify-content:center;gap:12px;margin-top:20px;';

  const prevMob = document.createElement('button');
  prevMob.innerHTML = '&#8249;';
  prevMob.style.cssText = 'background:none;border:none;font-size:24px;color:#1A8F8F;cursor:pointer;padding:4px;line-height:1;';

  const viewport = document.createElement('div');
  viewport.style.cssText = 'width:88px;overflow:hidden;position:relative;height:20px;display:flex;align-items:center;';

  const track = document.createElement('div');
  track.style.cssText = 'display:flex;gap:8px;align-items:center;position:absolute;left:0;transition:left 0.4s cubic-bezier(0.4,0,0.2,1);';

  const nextMob = document.createElement('button');
  nextMob.innerHTML = '&#8250;';
  nextMob.style.cssText = 'background:none;border:none;font-size:24px;color:#1A8F8F;cursor:pointer;padding:4px;line-height:1;';

  nav.appendChild(prevMob);
  viewport.appendChild(track);
  nav.appendChild(viewport);
  nav.appendChild(nextMob);

  // Insert after reviews section
  const reviewsSection = document.getElementById('reviews');
  reviewsSection.appendChild(nav);
  
  function renderDots() {
    // Keep existing dots, just update styles
    const dots = track.querySelectorAll('.mob-rdot');
    if (dots.length !== TOTAL) {
      track.innerHTML = '';
      for (let i = 0; i < TOTAL; i++) {
        const d = document.createElement('div');
        d.className = 'mob-rdot';
        d.style.cssText = 'border-radius:50%;flex-shrink:0;cursor:pointer;transition:width 0.3s ease,height 0.3s ease,background 0.3s ease;';
        const idx = i;
        d.onclick = () => { cur = idx; update(); };
        track.appendChild(d);
      }
    }

    track.querySelectorAll('.mob-rdot').forEach((d, i) => {
      const isActive = i === cur;
      const isPast = i < cur;
      const size = isActive ? ACTIVE_SIZE : DOT_SIZE;
      d.style.width = size + 'px';
      d.style.height = size + 'px';
      d.style.background = isActive ? '#1A8F8F' : isPast ? '#7BB8B8' : '#C8C8C8';
    });

    // Slide track
    let offset = 0;
    if (cur >= VISIBLE - 1) {
      offset = (cur - (VISIBLE - 2)) * UNIT;
      const maxOffset = (TOTAL - VISIBLE) * UNIT;
      offset = Math.min(offset, maxOffset);
    }
    track.style.left = -offset + 'px';
  }

  function update() {
    allCards.forEach((card, i) => {
      card.style.display = i === cur ? 'block' : 'none';
    });
    renderDots();
  }

  prevMob.onclick = () => { cur = Math.max(0, cur - 1); update(); };
  nextMob.onclick = () => { cur = Math.min(TOTAL - 1, cur + 1); update(); };
  if (prevBtn) prevBtn.onclick = () => { cur = Math.max(0, cur - 1); update(); };
  if (nextBtn) nextBtn.onclick = () => { cur = Math.min(TOTAL - 1, cur + 1); update(); };

  renderDots();
})();
const heroForm = document.getElementById('heroConsultForm');
if (heroForm) {
  heroForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const heroName = document.getElementById('heroName')?.value || '';
    const heroWaChecked = document.getElementById('heroWaCheckbox')?.checked ? 'Yes' : 'No';
    const payload = {
      "Timestamp": new Date().toLocaleString('en-IN'),
      "Name": heroName,
      "Phone": "'" + (document.getElementById('heroPhoneCode')?.value || '') + ' ' + (document.getElementById('heroPhone')?.value || ''),
      "Email": document.getElementById('heroEmail')?.value || '',
      "Property Location": document.getElementById('heroLocation')?.value || '',
      "Property Type": document.getElementById('heroType')?.value || '',
     "Updates checkBox": heroWaChecked,
      "Source": "Hero Form"
    };
    fetch('https://hook.eu1.make.com/qi8o4y1zdt79iaqgmpekp9mc1nf2h4ou', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).finally(() => {
      showThankYou(heroName);
      heroForm.reset();
    });
  });
}

function saveFormState(source) {
  const data = { source, page: window.location.href };

  if (source === 'popup') {
    data.name = document.getElementById('popupName')?.value || '';
    data.phone = document.getElementById('popupPhone')?.value || '';
    data.phoneCode = document.getElementById('popupPhoneCode')?.value || '+91';
    data.email = document.getElementById('popupEmail')?.value || '';
    data.location = document.getElementById('popupLocation')?.value || '';
    data.type = document.getElementById('popupPropertyType')?.value || '';
    data.updates = document.getElementById('popup-updates')?.checked || false;
  } else if (source === 'footer') {
    data.name = document.getElementById('fName')?.value || '';
    data.phone = document.getElementById('fPhone')?.value || '';
    data.phoneCode = document.getElementById('fPhoneCode')?.value || '+91';
    data.email = document.getElementById('fEmail')?.value || '';
    data.location = document.getElementById('fLocation')?.value || '';
    data.type = document.getElementById('fType')?.value || '';
    data.updates = document.getElementById('fWa')?.checked || false;
  } else if (source === 'hero') {
    data.name = document.getElementById('heroName')?.value || '';
    data.phone = document.getElementById('heroPhone')?.value || '';
    data.phoneCode = document.getElementById('heroPhoneCode')?.value || '+91';
    data.email = document.getElementById('heroEmail')?.value || '';
    data.location = document.getElementById('heroLocation')?.value || '';
    data.type = document.getElementById('heroType')?.value || '';
    data.updates = document.getElementById('heroWaCheckbox')?.checked || false;
  }

  sessionStorage.setItem('termsFormState', JSON.stringify(data));
}

window.addEventListener('load', function() {
  const raw = sessionStorage.getItem('termsFormState');
  if (!raw) return;
  const data = JSON.parse(raw);

  // Only restore if we're back on the right page
  if (data.page !== window.location.href) return;

  sessionStorage.removeItem('termsFormState');

  if (data.source === 'popup') {
    // Restore popup fields
    if (document.getElementById('popupName')) document.getElementById('popupName').value = data.name;
    if (document.getElementById('popupPhone')) document.getElementById('popupPhone').value = data.phone;
    if (document.getElementById('popupPhoneCode')) document.getElementById('popupPhoneCode').value = data.phoneCode;
    if (document.getElementById('popupEmail')) document.getElementById('popupEmail').value = data.email;
    if (document.getElementById('popupLocation')) document.getElementById('popupLocation').value = data.location;
    if (document.getElementById('popupPropertyType')) document.getElementById('popupPropertyType').value = data.type;
    if (document.getElementById('popup-updates')) document.getElementById('popup-updates').checked = true;
    // Reopen popup
    const popup = document.getElementById('consultationPopup');
    if (popup) { popup.classList.add('active'); document.body.style.overflow = 'hidden'; }

  } else if (data.source === 'footer') {
    if (document.getElementById('fName')) document.getElementById('fName').value = data.name;
    if (document.getElementById('fPhone')) document.getElementById('fPhone').value = data.phone;
    if (document.getElementById('fPhoneCode')) document.getElementById('fPhoneCode').value = data.phoneCode;
    if (document.getElementById('fEmail')) document.getElementById('fEmail').value = data.email;
    if (document.getElementById('fLocation')) document.getElementById('fLocation').value = data.location;
    if (document.getElementById('fType')) document.getElementById('fType').value = data.type;
    if (document.getElementById('fWa')) document.getElementById('fWa').checked = true;
    // Scroll to footer
    document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });

  } else if (data.source === 'hero') {
    if (document.getElementById('heroName')) document.getElementById('heroName').value = data.name;
    if (document.getElementById('heroPhone')) document.getElementById('heroPhone').value = data.phone;
    if (document.getElementById('heroPhoneCode')) document.getElementById('heroPhoneCode').value = data.phoneCode;
    if (document.getElementById('heroEmail')) document.getElementById('heroEmail').value = data.email;
    if (document.getElementById('heroLocation')) document.getElementById('heroLocation').value = data.location;
    if (document.getElementById('heroType')) document.getElementById('heroType').value = data.type;
    if (document.getElementById('heroWaCheckbox')) document.getElementById('heroWaCheckbox').checked = true;
    // Scroll to hero form
    document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
  }
});