/* ============================================================
   AJWA OF MADINAH — reseller.js
   Interactive Profit Calculator, Sticky Bars, FAQ, Scroll Reveal
   Irfan Khairi Sdn Bhd © 2026
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. Sticky Navigation & Reseller Sticky Bottom Bar ─────── */
  const navbar = document.getElementById('navbar');
  const stickyBar = document.getElementById('reseller-sticky-bar');
  const heroSection = document.getElementById('hero-reseller');

  function handleScroll() {
    const scrollY = window.scrollY;

    // Header transition & announcement bar collapse
    if (navbar) {
      if (scrollY > 25) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Sticky Bottom bar visibility
    if (heroSection && stickyBar) {
      const heroBottom = heroSection.offsetTop + heroSection.offsetHeight * 0.5;
      if (scrollY > heroBottom) {
        stickyBar.classList.add('visible');
      } else {
        stickyBar.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ── 2. Mobile Menu Toggle ───────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = mobileNav ? mobileNav.querySelectorAll('.mobile-link, .mobile-cta-btn') : [];

  function toggleMobileMenu(isOpen) {
    if (!hamburger || !mobileNav) return;
    hamburger.classList.toggle('open', isOpen);
    mobileNav.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.contains('open');
      toggleMobileMenu(!isOpen);
    });
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMobileMenu(false));
  });

  /* ── 3. Smooth Scrolling for Internal Links ──────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 80;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ── 4. Interactive Profit Calculator ────────────────────── */
  const presetButtons = document.querySelectorAll('.calc-preset-btn');
  const resPacksEl = document.getElementById('calc-res-packs');
  const resModalEl = document.getElementById('calc-res-modal');
  const resJualanEl = document.getElementById('calc-res-jualan');
  const resUntungEl = document.getElementById('calc-res-untung');

  const COST_PER_PACK = 17; // RM17
  const PRICE_PER_PACK = 30; // RM30
  const PACKS_PER_BUNDLE = 20; // 20 pek per bundle

  function updateCalculator(bundleCount) {
    const totalPacks = bundleCount * PACKS_PER_BUNDLE;
    const totalModal = totalPacks * COST_PER_PACK; // e.g. 20 * 17 = 340
    const totalJualan = totalPacks * PRICE_PER_PACK; // e.g. 20 * 30 = 600
    const totalUntung = totalJualan - totalModal; // e.g. 600 - 340 = 260

    if (resPacksEl) resPacksEl.textContent = totalPacks.toLocaleString('ms-MY') + ' Pek';
    if (resModalEl) resModalEl.textContent = 'RM ' + totalModal.toLocaleString('ms-MY');
    if (resJualanEl) resJualanEl.textContent = 'RM ' + totalJualan.toLocaleString('ms-MY');
    if (resUntungEl) resUntungEl.textContent = '+RM ' + totalUntung.toLocaleString('ms-MY');
  }

  if (presetButtons.length > 0) {
    presetButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        presetButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const bundles = parseInt(this.getAttribute('data-bundles'), 10) || 1;
        updateCalculator(bundles);
      });
    });

    // Initialize default (1 bundle = 20 packs)
    updateCalculator(1);
  }

  /* ── 5. FAQ Accordion ───────────────────────────────────── */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherBtn = otherItem.querySelector('.faq-question');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        item.classList.toggle('active', !isActive);
        questionBtn.setAttribute('aria-expanded', !isActive ? 'true' : 'false');
      });
    }
  });

  /* ── 6. Scroll Reveal Observer ──────────────────────────── */
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('visible'));
  }

})();
