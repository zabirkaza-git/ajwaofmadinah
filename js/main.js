/* ============================================================
   AJWA OF MADINAH — main.js (Redesign 2026)
   Sticky nav · Mobile menu · Gallery · FAQ · Sticky bar · Reveal
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. Sticky Navigation & Sticky Bottom Bar ─────────────── */
  const navbar         = document.getElementById('navbar');
  const stickyBottomBar= document.getElementById('sticky-bottom-bar');
  const heroSection    = document.getElementById('hero');

  function handleScroll() {
    const scrollY = window.scrollY;

    // Header shrink on scroll
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Bottom Quick-Buy bar: appears after scrolling past 60% of hero
    if (heroSection && stickyBottomBar) {
      const heroBottom = heroSection.offsetTop + heroSection.offsetHeight * 0.6;
      if (scrollY > heroBottom) {
        stickyBottomBar.classList.add('visible');
        stickyBottomBar.removeAttribute('aria-hidden');
      } else {
        stickyBottomBar.classList.remove('visible');
        stickyBottomBar.setAttribute('aria-hidden', 'true');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run on load

  /* ── 2. Mobile Menu Toggle ──────────────────────────────── */
  const hamburger  = document.getElementById('hamburger');
  const mobileNav  = document.getElementById('mobile-nav');
  const mobileLinks= mobileNav
    ? mobileNav.querySelectorAll('.mobile-link, .mobile-cta-btn')
    : [];

  function toggleMobileMenu(isOpen) {
    if (!hamburger || !mobileNav) return;
    hamburger.classList.toggle('open', isOpen);
    mobileNav.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      toggleMobileMenu(!hamburger.classList.contains('open'));
    });
  }

  // Close menu when any link is clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMobileMenu(false));
  });

  // Close menu on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && hamburger && hamburger.classList.contains('open')) {
      toggleMobileMenu(false);
      hamburger.focus();
    }
  });

  /* ── 3. Smooth Scrolling for Internal Anchor Links ───────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 72;
        const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
        // Close mobile menu if open
        if (hamburger && hamburger.classList.contains('open')) {
          toggleMobileMenu(false);
        }
      }
    });
  });

  /* ── 4. Interactive Product Gallery Showcase ─────────────── */
  const thumbBtns       = document.querySelectorAll('.thumb-btn');
  const showcaseMainImg = document.getElementById('showcase-main-img');
  const captionTitle    = document.getElementById('showcase-caption-title');
  const captionSub      = document.getElementById('showcase-caption-sub');

  if (thumbBtns.length > 0 && showcaseMainImg) {
    thumbBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        // Remove active from all
        thumbBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');

        const newSrc   = this.getAttribute('data-src');
        const newTitle = this.getAttribute('data-title');
        const newSub   = this.getAttribute('data-sub');

        // Smooth crossfade
        showcaseMainImg.style.opacity   = '0';
        showcaseMainImg.style.transform = 'scale(0.97)';

        setTimeout(() => {
          showcaseMainImg.src = newSrc;
          if (captionTitle && newTitle) captionTitle.innerHTML = newTitle;
          if (captionSub   && newSub)   captionSub.innerHTML   = newSub;
          showcaseMainImg.style.opacity   = '1';
          showcaseMainImg.style.transform = 'scale(1)';
        }, 200);
      });
    });
  }

  /* ── 5. FAQ Accordion ───────────────────────────────────── */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all others
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const otherBtn = other.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      item.classList.toggle('active', !isActive);
      questionBtn.setAttribute('aria-expanded', String(!isActive));
    });
  });

  /* ── 6. Scroll Reveal — IntersectionObserver ─────────────── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  if ('IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.10, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(el => revealObs.observe(el));
  } else {
    // Fallback for older browsers
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ── 7. Nutrition Bar Fill Animation ─────────────────────── */
  const nutriBars = document.querySelectorAll('.nbi-fill');
  if (nutriBars.length > 0 && 'IntersectionObserver' in window) {
    const barObs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const target = entry.target;
            const w = target.getAttribute('data-width');
            if (w) target.style.width = w;
            barObs.unobserve(target);
          }
        });
      },
      { threshold: 0.25 }
    );
    nutriBars.forEach(bar => barObs.observe(bar));
  }

  /* ── 8. Active nav link highlight on scroll ──────────────── */
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  if (navAnchors.length > 0 && 'IntersectionObserver' in window) {
    const navHighlightObs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navAnchors.forEach(a => {
              if (a.getAttribute('href') === '#' + id) {
                a.style.color = 'var(--white)';
              } else {
                a.style.color = '';
              }
            });
          }
        });
      },
      { threshold: 0.40 }
    );
    sections.forEach(sec => navHighlightObs.observe(sec));
  }

})();
