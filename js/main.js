/* ============================================================
   AJWA OF MADINAH — main.js
   Sticky nav · Mobile menu · Interactive Gallery · FAQ · Sticky bar
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. Sticky Navigation & Sticky Bottom Bar ────────────── */
  const navbar = document.getElementById('navbar');
  const stickyBottomBar = document.getElementById('sticky-bottom-bar');
  const heroSection = document.getElementById('hero');

  function handleScroll() {
    const scrollY = window.scrollY;

    // Header transition
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Bottom Quick Buy bar (appears after scrolling past 60% of hero)
    if (heroSection && stickyBottomBar) {
      const heroBottom = heroSection.offsetTop + heroSection.offsetHeight * 0.6;
      if (scrollY > heroBottom) {
        stickyBottomBar.classList.add('visible');
      } else {
        stickyBottomBar.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ── 2. Mobile Menu Toggle ──────────────────────────────── */
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

  /* ── 4. Interactive Product Gallery Showcase ─────────────── */
  const thumbBtns = document.querySelectorAll('.thumb-btn');
  const showcaseMainImg = document.getElementById('showcase-main-img');
  const captionTitle = document.getElementById('showcase-caption-title');
  const captionSub = document.getElementById('showcase-caption-sub');

  if (thumbBtns.length > 0 && showcaseMainImg) {
    thumbBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        // Remove active class from all
        thumbBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });

        // Set active on clicked
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');

        const newSrc = this.getAttribute('data-src');
        const newTitle = this.getAttribute('data-title');
        const newSub = this.getAttribute('data-sub');

        // Smooth crossfade
        showcaseMainImg.style.opacity = '0';
        showcaseMainImg.style.transform = 'scale(0.97)';

        setTimeout(() => {
          showcaseMainImg.src = newSrc;
          if (captionTitle && newTitle) captionTitle.textContent = newTitle;
          if (captionSub && newSub) captionSub.textContent = newSub;

          showcaseMainImg.style.opacity = '1';
          showcaseMainImg.style.transform = 'scale(1)';
        }, 200);
      });
    });
  }

  /* ── 5. FAQ Accordion ───────────────────────────────────── */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Optional: close other items
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

  /* ── 7. Nutrition Bar Fill Animation ─────────────────────── */
  const nutriBars = document.querySelectorAll('.nbi-fill');
  if (nutriBars.length > 0 && 'IntersectionObserver' in window) {
    const barObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const target = entry.target;
            const targetWidth = target.getAttribute('data-width');
            if (targetWidth) {
              target.style.width = targetWidth;
            }
            barObserver.unobserve(target);
          }
        });
      },
      { threshold: 0.25 }
    );
    nutriBars.forEach(bar => barObserver.observe(bar));
  }

})();
