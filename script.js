/* ================================================================
   DR. RAMY YOUSRY — MAIN SCRIPT v2
   EN default | AR | FR support
   Top Bar: Timezone + Session Timer
   ================================================================ */

// ===== CONTACT FORM BACKEND CONFIG =====
// Paste the Web App URL you get after deploying Code.gs on Google Apps Script.
// Guide: see SETUP-GUIDE-AR.md included in this package.
const SHEET_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbwqV0jwo9dALxQB34Lx1XY0mgdcVuyXiov0J3LjltcnydWRXyl7mnPvlnO4eN9oSpKD/exec';

// ===== STATE =====
let currentLang = localStorage.getItem('drr_lang') || 'en';
let sessionStart = Date.now();
let sessionInterval = null;
let clockInterval = null;

// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initNavbar();
  initLangSwitcher();
  initTopBar();
  initCounterAnimations();
  initScrollAnimations();
  initForm();
  initAIChat();
  initMobileNav();
  applyLanguage(currentLang);
});

// ===== TOP BAR =====
function initTopBar() {
  // ─── Clock + Timezone ───
  updateClock();
  clockInterval = setInterval(updateClock, 1000);

  // ─── Session Timer ───
  sessionInterval = setInterval(updateSessionTimer, 1000);
}

function updateClock() {
  const now = new Date();
  const clockEl = document.getElementById('top-clock');
  const tzEl = document.getElementById('top-timezone');
  if (!clockEl) return;

  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  clockEl.textContent = timeStr;

  if (tzEl) {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const shortTz = now.toLocaleTimeString('en', { timeZoneName: 'short' }).split(' ').pop();
      tzEl.textContent = shortTz || tz.split('/').pop().replace('_', ' ');
    } catch (e) {
      tzEl.textContent = '';
    }
  }
}

function updateSessionTimer() {
  const elapsed = Math.floor((Date.now() - sessionStart) / 1000);
  const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
  const secs = (elapsed % 60).toString().padStart(2, '0');
  const el = document.getElementById('session-timer');
  if (el) el.textContent = `${mins}:${secs}`;
}

// ===== PARTICLES =====
function initParticles() {
  const container = document.getElementById('particles-container');
  if (!container) return;
  const colors = ['#00d4ff', '#7b2fff', '#ff6b35', '#ffd700', '#00ff88'];
  const count = window.innerWidth < 768 ? 18 : 35;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 3 + 1;
    const color = colors[Math.floor(Math.random() * colors.length)];
    p.style.cssText = `width:${size}px;height:${size}px;background:${color};left:${Math.random()*100}%;animation-duration:${Math.random()*15+10}s;animation-delay:-${Math.random()*15}s;box-shadow:0 0 ${size*2}px ${color};`;
    container.appendChild(p);
  }
}

// ===== NAVBAR =====
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        document.getElementById('nav-links')?.classList.remove('open');
      }
    });
  });
}

// ===== MOBILE NAV =====
function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    const spans = toggle.querySelectorAll('span');
    const open = links.classList.contains('open');
    spans[0].style.transform = open ? 'rotate(45deg) translate(5px,6px)' : '';
    spans[1].style.opacity = open ? '0' : '';
    spans[2].style.transform = open ? 'rotate(-45deg) translate(5px,-6px)' : '';
  });
}

// ===== LANGUAGE SWITCHER =====
function initLangSwitcher() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      if (lang !== currentLang) {
        currentLang = lang;
        localStorage.setItem('drr_lang', lang);
        applyLanguage(lang);
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      }
    });
  });

  // Set active on load
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-lang') === currentLang);
  });
}

// ===== APPLY LANGUAGE =====
function applyLanguage(lang) {
  if (typeof translations === 'undefined') return;
  const t = translations[lang];
  if (!t) return;

  // Direction
  const isRTL = lang === 'ar';
  document.body.classList.toggle('rtl-mode', isRTL);
  document.body.classList.toggle('ltr-mode', !isRTL);
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');

  // Store in sessionStorage for sub-pages
  sessionStorage.setItem('drr_lang', lang);

  // Map of element IDs to translation keys
  const map = {
    'tb-your-time': 'top_your_time', 'tb-session': 'top_session', 'tb-available': 'available',
    'nav-about': 'nav_about', 'nav-expertise': 'nav_expertise', 'nav-experience': 'nav_experience',
    'nav-certifications': 'nav_certifications', 'nav-conferences': 'nav_conferences',
    'nav-portfolio': 'nav_portfolio', 'nav-contact': 'nav_contact',
    'hero-badge': 'hero_badge', 'hero-name': 'hero_name', 'hero-title': 'hero_title',
    'hero-subtitle': 'hero_subtitle', 'hero-cta1': 'hero_cta_primary', 'hero-cta2': 'hero_cta_secondary',
    'hero-scroll': 'hero_scroll',
    'stat-years': 'stat_years', 'stat-trainees': 'stat_trainees',
    'stat-programs': 'stat_programs', 'stat-conferences': 'stat_conferences',
    'tag-about': 'tag_about', 'tag-expertise': 'tag_expertise', 'tag-portfolio': 'tag_portfolio',
    'tag-contact': 'tag_contact',
    'h-about': 'h_about', 'h-expertise': 'h_expertise', 'h-portfolio': 'h_portfolio', 'h-contact': 'h_contact',
    'about-lead': 'about_lead', 'about-body': 'about_body',
    'contact-location': 'contact_location', 'contact-location2': 'contact_location',
    'contact-loc-label': 'contact_loc_label',
    'exp1-title': 'exp1_title', 'exp1-body': 'exp1_body', 'exp2-title': 'exp2_title', 'exp2-body': 'exp2_body',
    'exp3-title': 'exp3_title', 'exp3-body': 'exp3_body', 'exp4-title': 'exp4_title', 'exp4-body': 'exp4_body',
    'exp5-title': 'exp5_title', 'exp5-body': 'exp5_body', 'exp6-title': 'exp6_title', 'exp6-body': 'exp6_body',
    'explore-btn': 'explore',
    'port1-title': 'port1_title', 'port1-desc': 'port1_desc', 'port1-btn': 'port1_btn',
    'port2-title': 'port2_title', 'port2-desc': 'port2_desc', 'port2-btn': 'port2_btn',
    'port3-title': 'port3_title', 'port3-desc': 'port3_desc', 'port3-btn': 'port3_btn',
    'port4-title': 'port4_title', 'port4-desc': 'port4_desc', 'port4-btn': 'port4_btn',
    'port-note': 'port_note', 'port-contact': 'port_contact',
    'contact-info-title': 'contact_info_title',
    'contact-register-title': 'contact_register_title', 'contact-register-sub': 'contact_register_sub',
    'lbl-name': 'form_name', 'lbl-email': 'form_email', 'lbl-phone': 'form_phone',
    'lbl-interest': 'form_interest', 'lbl-message': 'form_message',
    'opt-select': 'form_select', 'opt-training': 'opt_training', 'opt-consulting': 'opt_consulting',
    'opt-cyber': 'opt_cyber', 'opt-lecture': 'opt_lecture', 'opt-portfolio': 'opt_portfolio', 'opt-other': 'opt_other',
    'form-submit': 'form_submit',
    'wa-btn': 'wa_btn', 'wa-tooltip': 'wa_tooltip',
    'ai-tooltip': 'ai_tooltip', 'ai-title': 'ai_title', 'ai-status': 'ai_status',
    'ai-welcome': 'ai_welcome', 'ai-coming': 'ai_coming',
    'ai-register-btn': 'ai_register_btn', 'ai-wa-btn': 'ai_wa_btn',
    'footer-desc': 'footer_desc', 'footer-links-title': 'footer_links',
    'footer-contact-title': 'footer_contact', 'footer-rights': 'footer_rights', 'footer-built': 'footer_built',
    'view-all-expertise': 'view_all',
    'fl-about': 'nav_about', 'fl-expertise': 'nav_expertise', 'fl-experience': 'nav_experience',
    'fl-certs': 'nav_certifications', 'fl-portfolio': 'nav_portfolio', 'fl-contact': 'nav_contact',
  };

  Object.entries(map).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el && t[key] !== undefined) el.textContent = t[key];
  });

  // Placeholders
  setPlaceholder('fullname', t.form_ph_name);
  setPlaceholder('email', t.form_ph_email);
  setPlaceholder('phone', t.form_ph_phone);
  setPlaceholder('message', t.form_ph_msg);
  setPlaceholder('chat-input', t.chat_ph);

  // Card explore buttons (all)
  document.querySelectorAll('.card-explore').forEach(el => { el.textContent = t.explore || 'Explore →'; });

  // Update floating tags for about section
  const tags = document.querySelectorAll('.floating-tag span:last-child');
  const tagTexts = lang === 'ar'
    ? ['أمن سيبراني', 'ذكاء اصطناعي', 'مدرب دولي']
    : lang === 'fr'
    ? ['Cybersécurité', 'Gouvernance IA', 'Formateur Int\'l']
    : ['Cybersecurity', 'AI Governance', 'Int\'l Trainer'];
  tags.forEach((tag, i) => { if (tagTexts[i]) tag.textContent = tagTexts[i]; });

  // WhatsApp links
  const waMsg = encodeURIComponent(t.wa_msg || '');
  document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    link.href = `https://wa.me/14489958107?text=${waMsg}`;
  });

  // Page title
  const titles = { en: 'Dr. Ramy Yousry | International Consultant — AI & Cybersecurity', ar: 'د. رامي يسري | مستشار دولي — الذكاء الاصطناعي والأمن السيبراني', fr: 'Dr. Ramy Yousry | Consultant International — IA & Cybersécurité' };
  document.title = titles[lang] || titles.en;
}

function setPlaceholder(id, text) {
  const el = document.getElementById(id);
  if (el && text) el.placeholder = text;
}

// ===== COUNTER ANIMATIONS =====
function initCounterAnimations() {
  const counters = document.querySelectorAll('.stat-num');
  let animated = false;
  const statsEl = document.querySelector('.hero-stats');
  if (!statsEl) return;

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      counters.forEach(c => {
        const target = parseInt(c.getAttribute('data-target')) || 0;
        animateNumber(c, target, 1800);
      });
    }
  }, { threshold: 0.5 });
  obs.observe(statsEl);
}

function animateNumber(el, target, duration) {
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current).toLocaleString();
  }, 16);
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const els = document.querySelectorAll('.fade-in');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = e.target.getAttribute('data-delay') || 0;
        setTimeout(() => e.target.classList.add('visible'), parseInt(delay));
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
}

// ===== FORM =====
function initForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    const btnText = btn?.querySelector('.btn-text');
    const btnLoader = btn?.querySelector('.btn-loader');

    if (btn) btn.disabled = true;
    if (btnText) btnText.style.display = 'none';
    if (btnLoader) btnLoader.style.display = 'inline';

    const successEl = document.getElementById('form-success');
    const msgEl = document.getElementById('form-success-msg');
    const t = (typeof translations !== 'undefined') ? translations[currentLang] : null;
    const sheetConfigured = SHEET_WEBAPP_URL && !SHEET_WEBAPP_URL.includes('https://script.google.com/macros/s/AKfycbwqV0jwo9dALxQB34Lx1XY0mgdcVuyXiov0J3LjltcnydWRXyl7mnPvlnO4eN9oSpKD/exec');
    const formspreeConfigured = form.action && !form.action.includes('YOUR_FORMSPREE_ID');

    if (!sheetConfigured && !formspreeConfigured) {
      showFormMsg('⚙️ Please configure the form backend first (see SETUP-GUIDE-AR.md).', true);
      if (btn) btn.disabled = false;
      if (btnText) btnText.style.display = 'inline';
      if (btnLoader) btnLoader.style.display = 'none';
      return;
    }

    let sheetOk = !sheetConfigured; // treat as "ok" if not set up, so it doesn't block success
    let formspreeOk = !formspreeConfigured;

    try {
      // 1) Send to Google Sheet (primary log — never lost, no monthly limit)
      if (sheetConfigured) {
        try {
          await fetch(SHEET_WEBAPP_URL, { method: 'POST', body: new FormData(form) });
          sheetOk = true; // Apps Script web apps often respond as opaque (no-cors-like); treat network success as ok
        } catch { sheetOk = false; }
      }

      // 2) Send to Formspree (optional secondary email notification)
      if (formspreeConfigured) {
        try {
          const resp = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } });
          formspreeOk = resp.ok;
        } catch { formspreeOk = false; }
      }

      if (sheetOk || formspreeOk) {
        form.reset();
        if (successEl) { successEl.style.display = 'flex'; successEl.style.borderColor = ''; successEl.style.background = ''; successEl.style.color = ''; }
        if (msgEl && t) msgEl.textContent = t.form_success;
        setTimeout(() => { if (successEl) successEl.style.display = 'none'; }, 8000);
      } else {
        throw new Error('Failed');
      }
    } catch { showFormMsg('❌ An error occurred. Please try again.', true); }
    finally {
      if (btn) btn.disabled = false;
      if (btnText) btnText.style.display = 'inline';
      if (btnLoader) btnLoader.style.display = 'none';
    }
  });
}

function showFormMsg(msg, isError = false) {
  const el = document.getElementById('form-success');
  const msgEl = document.getElementById('form-success-msg');
  if (!el) return;
  el.style.display = 'flex';
  if (isError) { el.style.borderColor = 'rgba(255,107,53,0.4)'; el.style.background = 'rgba(255,107,53,0.08)'; el.style.color = '#ff9966'; }
  if (msgEl) msgEl.textContent = msg;
  setTimeout(() => { el.style.display = 'none'; el.style.borderColor = ''; el.style.background = ''; el.style.color = ''; }, 7000);
}

// ===== AI CHAT =====
function initAIChat() {
  const btn = document.getElementById('ai-chat-btn');
  const modal = document.getElementById('ai-chat-modal');
  const closeBtn = document.getElementById('chat-close');
  if (!btn || !modal) return;

  btn.addEventListener('click', () => modal.classList.add('active'));
  closeBtn?.addEventListener('click', () => modal.classList.remove('active'));
  document.addEventListener('click', e => {
    if (!modal.contains(e.target) && !btn.contains(e.target)) modal.classList.remove('active');
  });
}

// ===== SUBPAGE UTILS (for sub-pages) =====
function initSubPage() {
  const lang = sessionStorage.getItem('drr_lang') || localStorage.getItem('drr_lang') || 'en';
  currentLang = lang;

  initParticles();
  initTopBar();

  // Set active lang button
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-lang') === lang);
    b.addEventListener('click', () => {
      const l = b.getAttribute('data-lang');
      currentLang = l;
      localStorage.setItem('drr_lang', l);
      sessionStorage.setItem('drr_lang', l);
      applySubPageLanguage(l);
      document.querySelectorAll('.lang-btn').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
    });
  });

  // Scroll animations
  initScrollAnimations();

  applySubPageLanguage(lang);
  updateGoBackBtn();
}

function updateGoBackBtn() {
  const backBtn = document.querySelector('.back-btn');
  const closeBtn = document.querySelector('.close-btn');
  if (backBtn) {
    backBtn.addEventListener('click', e => {
      e.preventDefault();
      if (document.referrer && document.referrer.includes(location.hostname)) {
        history.back();
      } else {
        location.href = 'index.html';
      }
    });
  }
  if (closeBtn) {
    closeBtn.addEventListener('click', e => { e.preventDefault(); location.href = 'index.html'; });
  }
}

function applySubPageLanguage(lang) {
  if (typeof translations === 'undefined') return;
  const t = translations[lang];
  if (!t) return;

  const isRTL = lang === 'ar';
  document.body.classList.toggle('rtl-mode', isRTL);
  document.body.classList.toggle('ltr-mode', !isRTL);
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');

  // Top bar
  const tbYT = document.getElementById('tb-your-time'); if (tbYT) tbYT.textContent = t.top_your_time;
  const tbS = document.getElementById('tb-session'); if (tbS) tbS.textContent = t.top_session;
  const tbA = document.getElementById('tb-available'); if (tbA) tbA.textContent = t.available;

  // Nav
  ['about','expertise','experience','certifications','conferences','portfolio','contact'].forEach(k => {
    const el = document.getElementById(`nav-${k}`);
    if (el && t[`nav_${k}`]) el.textContent = t[`nav_${k}`];
  });

  // Back/Close buttons
  const backBtn = document.querySelector('.back-btn span');
  if (backBtn && t.go_back) backBtn.textContent = t.go_back;
  const closeBtnEl = document.querySelector('.close-btn span');
  if (closeBtnEl && t.close_page) closeBtnEl.textContent = t.close_page;

  // AI chat
  setSubEl('ai-tooltip', t.ai_tooltip); setSubEl('ai-title', t.ai_title);
  setSubEl('ai-status', t.ai_status); setSubEl('ai-welcome', t.ai_welcome);
  setSubEl('ai-coming', t.ai_coming);
  setPlaceholder('chat-input', t.chat_ph);
  setSubEl('wa-tooltip', t.wa_tooltip);

  // WhatsApp
  const waMsg = encodeURIComponent(t.wa_msg || '');
  document.querySelectorAll('a[href*="wa.me"]').forEach(l => { l.href = `https://wa.me/14489958107?text=${waMsg}`; });

  // Call page-specific function
  if (typeof applyPageLang === 'function') applyPageLang(lang, t);
}

function setSubEl(id, text) {
  const el = document.getElementById(id);
  if (el && text !== undefined) el.textContent = text;
}
