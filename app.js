/* ══════════════════════════════════════════════════
   DESIGN ERA — app.js
   Interactive Design Studio + UI Logic
══════════════════════════════════════════════════ */

'use strict';

// ── Helpers ──────────────────────────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const toast = (msg, dur = 3000) => {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), dur);
};

// ── Loader ───────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    $('#loader').classList.add('hidden');
  }, 2000);
});

// ── Nav scroll ───────────────────────────────────
const nav = $('#nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Mobile Drawer ────────────────────────────────
const drawer = $('#drawer');
const overlay = $('#drawerOverlay');

$('#menuToggle').addEventListener('click', () => {
  drawer.classList.add('open');
  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
});

function closeDrawer() {
  drawer.classList.remove('open');
  overlay.classList.remove('show');
  document.body.style.overflow = '';
}

$('#drawerClose').addEventListener('click', closeDrawer);
overlay.addEventListener('click', closeDrawer);

// Close drawer on nav link click
$$('.drawer-links a').forEach(a => a.addEventListener('click', closeDrawer));

// ── Smooth scroll for anchor links ───────────────
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const target = document.querySelector(a.getAttribute('href'));
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

// ── Category Tabs ────────────────────────────────
$$('.cat-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const cat = tab.dataset.cat;

    // Update tabs
    $$('.cat-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');

    // Update panels
    $$('.cat-panel').forEach(p => p.classList.remove('active'));
    $(`#panel-${cat}`).classList.add('active');

    // Re-trigger AOS for new panel
    observeAOS();
  });
});

// ── Scroll-triggered Animations (AOS) ────────────
function observeAOS() {
  const opts = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay || 0;
        setTimeout(() => el.classList.add('visible'), delay);
        observer.unobserve(el);
      }
    });
  }, opts);

  $$('[data-aos]').forEach((el, i) => {
    if (!el.classList.contains('visible')) {
      el.dataset.delay = i * 80;
      observer.observe(el);
    }
  });
}
observeAOS();

// ── Cart functionality ────────────────────────────
let cartCount = 0;
const cartCountEl = $('.cart-count');

document.addEventListener('click', e => {
  if (e.target.closest('.cart-add')) {
    cartCount++;
    cartCountEl.textContent = cartCount;

    // Animate badge
    cartCountEl.style.transform = 'scale(1.4)';
    setTimeout(() => { cartCountEl.style.transform = ''; }, 300);

    const card = e.target.closest('.product-card');
    const name = card ? card.querySelector('h3')?.textContent : 'Item';
    toast(`✓ "${name}" added to cart`);
  }
});

// ── Wishlist ──────────────────────────────────────
document.addEventListener('click', e => {
  const btn = e.target.closest('.wishlist');
  if (!btn) return;
  const isActive = btn.textContent === '♥';
  btn.textContent = isActive ? '♡' : '♥';
  btn.style.color = isActive ? '' : '#E8C4C4';
  toast(isActive ? 'Removed from wishlist' : '♥ Added to wishlist');
});

// ── Design Studio ─────────────────────────────────
const studio = {
  silhouette: 'lehenga',
  fabric: 'silk',
  color: '#8B1A2E',
  embellishment: 'none'
};

// Silhouette shapes config
const silhouetteConfig = {
  lehenga:  { topH: '110px', botH: '150px', topR: '50px 50px 20px 20px', botR: '10px 10px 50px 50px', botW: '150px' },
  saree:    { topH: '100px', botH: '160px', topR: '30px 30px 15px 15px', botR: '5px 5px 30px 30px', botW: '130px' },
  anarkali: { topH: '130px', botH: '170px', topR: '50px 50px 30px 30px', botR: '15px 15px 70px 70px', botW: '160px' },
  gown:     { topH: '100px', botH: '180px', topR: '45px 45px 15px 15px', botR: '5px 5px 50px 50px', botW: '110px' },
  western:  { topH: '90px',  botH: '130px', topR: '30px 30px 10px 10px', botR: '5px 5px 20px 20px', botW: '100px' },
};

// Fabric texture overlays (CSS filter or opacity tweak)
const fabricConfig = {
  silk:     { opacity: '0.95', filter: 'saturate(1.2)' },
  chiffon:  { opacity: '0.75', filter: 'saturate(0.9) brightness(1.1)' },
  velvet:   { opacity: '1',    filter: 'saturate(1.4) brightness(0.9)' },
  linen:    { opacity: '0.85', filter: 'saturate(0.8) brightness(1.05)' },
  banarasi: { opacity: '1',    filter: 'saturate(1.5)' },
};

// Embellishment overlay patterns
const embelConfig = {
  none:       { borderTop: 'none', boxShadow: '' },
  zardosi:    { borderTop: '3px solid rgba(200,153,62,0.9)', boxShadow: '0 -4px 20px rgba(200,153,62,0.4)' },
  chikankari: { borderTop: '3px dashed rgba(245,240,232,0.6)', boxShadow: '0 -4px 15px rgba(245,240,232,0.2)' },
  mirror:     { borderTop: '3px solid rgba(220,220,255,0.8)', boxShadow: '0 -4px 20px rgba(180,180,255,0.3)' },
  resham:     { borderTop: '3px solid rgba(232,196,196,0.9)', boxShadow: '0 -4px 15px rgba(232,196,196,0.3)' },
};

function updateMannequin() {
  const top = $('#mannequinTop');
  const bot = $('#mannequinBottom');
  const emb = $('#mannequinEmbellishment');
  const lbl = $('#studioLabel');
  const cfg = silhouetteConfig[studio.silhouette];
  const fab = fabricConfig[studio.fabric];
  const embelCfg = embelConfig[studio.embellishment];

  // Apply silhouette
  top.style.height = cfg.topH;
  top.style.borderRadius = cfg.topR;
  bot.style.height = cfg.botH;
  bot.style.borderRadius = cfg.botR;
  bot.style.width = cfg.botW;

  // Apply colour
  top.style.background = studio.color;
  bot.style.background = hexToRgba(studio.color, 0.6);

  // Apply fabric feel
  top.style.opacity = fab.opacity;
  top.style.filter = fab.filter;
  bot.style.opacity = fab.opacity;
  bot.style.filter = fab.filter;

  // Apply embellishment
  top.style.borderTop = embelCfg.borderTop;
  top.style.boxShadow = `0 10px 40px ${hexToRgba(studio.color, 0.4)}, ${embelCfg.boxShadow}`;

  // Update label
  const capSil = studio.silhouette.charAt(0).toUpperCase() + studio.silhouette.slice(1);
  const capFab = studio.fabric.charAt(0).toUpperCase() + studio.fabric.slice(1);
  const capEmb = studio.embellishment !== 'none' ? ` · ${studio.embellishment}` : '';
  lbl.textContent = `${capFab} ${capSil}${capEmb}`;
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// Silhouette buttons
$$('#silhouetteOpts .opt-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('#silhouetteOpts .opt-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    studio.silhouette = btn.dataset.sil;
    updateMannequin();
  });
});

// Fabric buttons
$$('#fabricOpts .opt-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('#fabricOpts .opt-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    studio.fabric = btn.dataset.fab;
    updateMannequin();
  });
});

// Colour swatches
$$('#colorPick .cp-swatch').forEach(sw => {
  sw.addEventListener('click', () => {
    $$('#colorPick .cp-swatch').forEach(s => s.classList.remove('active'));
    sw.classList.add('active');
    studio.color = sw.dataset.hex;
    updateMannequin();
  });
});

// Embellishment buttons
$$('#embelOpts .opt-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('#embelOpts .opt-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    studio.embellishment = btn.dataset.emb;
    updateMannequin();
  });
});

// Initial render
updateMannequin();

// ── Quote Modal ───────────────────────────────────
const quoteModal = $('#quoteModal');
const quoteDesc = $('#quoteDesc');

$('#requestQuote').addEventListener('click', () => {
  const cfg = silhouetteConfig[studio.silhouette];
  const capSil = studio.silhouette.charAt(0).toUpperCase() + studio.silhouette.slice(1);
  const capFab = studio.fabric.charAt(0).toUpperCase() + studio.fabric.slice(1);
  const emb = studio.embellishment !== 'none' ? `, ${studio.embellishment} embellishments` : '';
  quoteDesc.textContent = `${capFab} ${capSil} in colour ${studio.color}${emb}`;
  quoteModal.showModal();
});

$('#modalClose').addEventListener('click', () => quoteModal.close());

quoteModal.addEventListener('click', e => {
  if (e.target === quoteModal) quoteModal.close();
});

$('#quoteForm').addEventListener('submit', e => {
  e.preventDefault();
  quoteModal.close();
  toast('✓ Quote request sent! We\'ll contact you within 24 hours.');
});

// ── Newsletter Form ───────────────────────────────
$('#nlForm').addEventListener('submit', e => {
  e.preventDefault();
  const input = e.target.querySelector('input[type="email"]');
  toast(`✓ Subscribed with ${input.value}! Welcome to Design Era.`);
  input.value = '';
});

// ── Contact Form ──────────────────────────────────
$('#contactForm').addEventListener('submit', e => {
  e.preventDefault();
  toast('✓ Message sent! Our team will reach out within 24 hours.');
  e.target.reset();
});

// ── Palette copy hex on click ─────────────────────
$$('.palette-card').forEach(card => {
  card.addEventListener('click', () => {
    const hex = card.style.getPropertyValue('--clr');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(hex).then(() => {
        toast(`✓ Copied ${hex} to clipboard`);
      });
    }
  });
});

// ── Keyboard trap for modal ───────────────────────
quoteModal.addEventListener('keydown', e => {
  if (e.key === 'Escape') quoteModal.close();
});

// ── Parallax hero orbs on mouse move ─────────────
document.addEventListener('mousemove', e => {
  const { innerWidth: w, innerHeight: h } = window;
  const dx = (e.clientX / w - 0.5) * 30;
  const dy = (e.clientY / h - 0.5) * 30;
  const orbs = $$('.hero-gradient-orb');
  orbs.forEach((orb, i) => {
    const factor = (i + 1) * 0.4;
    orb.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
  });
}, { passive: true });

// ── Swatch tooltip ───────────────────────────────
$$('.swatch').forEach(sw => {
  sw.addEventListener('mouseenter', () => {
    toast(`${sw.title}`);
  });
});

console.log('%c🌸 Design Era', 'font-size:1.2rem; color:#C8993E; font-family:serif;');
console.log('%cPremium Women\'s Fashion — Crafted with ♥', 'color:#A09890;');

