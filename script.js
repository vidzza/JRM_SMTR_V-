/* ══════════════════════════════════════════════
   JULISSA RAMOS — SMNYL
   script.js — All interactivity
   ══════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ──────────────────────────────────────────
       REDUCED MOTION — shared media query
    ────────────────────────────────────────── */
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    /* ──────────────────────────────────────────
       SCROLL PROGRESS BAR
    ────────────────────────────────────────── */
    const scrollProgress = document.getElementById('scrollProgress');

    function updateScrollProgress() {
        if (!scrollProgress) return;
        const docH = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const pct  = docH > 0 ? (window.scrollY / docH) * 100 : 0;
        scrollProgress.style.width = pct + '%';
    }

    /* ──────────────────────────────────────────
       HEADER — scroll class + hide/show
    ────────────────────────────────────────── */
    const header = document.getElementById('header');

    function updateHeader() {
        if (!header) return;
        if (window.scrollY > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    /* ──────────────────────────────────────────
       HAMBURGER / MOBILE NAV
    ────────────────────────────────────────── */
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('navLinks');

    function closeNav() {
        if (!navLinks || !hamburger) return;
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
    }

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function () {
            const isOpen = navLinks.classList.toggle('open');
            hamburger.setAttribute('aria-expanded', String(isOpen));
            const spans = hamburger.querySelectorAll('span');
            if (isOpen) {
                spans[0].style.transform = 'rotate(45deg) translate(5.5px, 5.5px)';
                spans[1].style.opacity   = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5.5px, -5.5px)';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity   = '';
                spans[2].style.transform = '';
            }
        });

        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', closeNav);
        });
    }

    /* ──────────────────────────────────────────
       SMOOTH SCROLL (offset for fixed header)
    ────────────────────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            closeNav();
            const offset = (header ? header.offsetHeight : 80) + 16;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: top, behavior: 'smooth' });
        });
    });

    /* ──────────────────────────────────────────
       SERVICES TABS
    ────────────────────────────────────────── */
    const tabBtns   = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    function activateTab(tabId) {
        tabBtns.forEach(function (btn) {
            const isActive = btn.dataset.tab === tabId;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', String(isActive));
        });
        tabPanels.forEach(function (panel) {
            const isActive = panel.id === 'tab-' + tabId;
            panel.classList.toggle('active', isActive);
        });
    }

    tabBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            activateTab(this.dataset.tab);
        });
    });

    // WAI-ARIA keyboard navigation for tabs (ArrowLeft / ArrowRight / Home / End)
    if (tabBtns.length) {
        tabBtns.forEach(function (btn, index) {
            btn.addEventListener('keydown', function (e) {
                let targetIndex = -1;
                if (e.key === 'ArrowRight') {
                    targetIndex = (index + 1) % tabBtns.length;
                } else if (e.key === 'ArrowLeft') {
                    targetIndex = (index - 1 + tabBtns.length) % tabBtns.length;
                } else if (e.key === 'Home') {
                    targetIndex = 0;
                } else if (e.key === 'End') {
                    targetIndex = tabBtns.length - 1;
                }
                if (targetIndex >= 0) {
                    e.preventDefault();
                    tabBtns[targetIndex].focus();
                    activateTab(tabBtns[targetIndex].dataset.tab);
                }
            });
        });
    }

    /* ──────────────────────────────────────────
       TESTIMONIALS CAROUSEL
    ────────────────────────────────────────── */
    const track       = document.getElementById('testimonialsTrack');
    const prevBtn     = document.getElementById('testimonialPrev');
    const nextBtn     = document.getElementById('testimonialNext');
    const dotsWrapper = document.getElementById('testimonialDots');

    if (track) {
        const wrapper = track.parentElement;   // .testimonials-wrapper (overflow:hidden)
        const cards   = track.querySelectorAll('.testimonial-card');
        const total   = cards.length;
        let current   = 0;
        let autoTimer = null;

        // Layout: give every card the exact pixel width of the wrapper,
        // then make the track wide enough to hold all cards side-by-side.
        function layout() {
            var w = wrapper.offsetWidth;
            cards.forEach(function (card) { card.style.width = w + 'px'; });
            track.style.width = (w * total) + 'px';
        }

        layout();

        // Build dots
        if (dotsWrapper) {
            cards.forEach(function (_, i) {
                const dot = document.createElement('button');
                dot.className  = 'testimonial-dot' + (i === 0 ? ' active' : '');
                dot.setAttribute('aria-label', 'Ir al testimonio ' + (i + 1));
                dot.addEventListener('click', function () { goTo(i); resetAuto(); });
                dotsWrapper.appendChild(dot);
            });
        }

        function updateDots() {
            if (!dotsWrapper) return;
            dotsWrapper.querySelectorAll('.testimonial-dot').forEach(function (dot, i) {
                dot.classList.toggle('active', i === current);
            });
        }

        function goTo(index) {
            current = (index + total) % total;
            track.style.transform = 'translateX(-' + (current * wrapper.offsetWidth) + 'px)';
            updateDots();
        }

        function next() { goTo(current + 1); }
        function prev() { goTo(current - 1); }

        // Recalculate layout and reposition on resize (no animation flash)
        var resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                track.style.transition = 'none';
                layout();
                track.style.transform = 'translateX(-' + (current * wrapper.offsetWidth) + 'px)';
                // Re-enable transition after reflow
                requestAnimationFrame(function () {
                    track.style.transition = '';
                });
            }, 100);
        }, { passive: true });

        function startAuto() {
            if (prefersReducedMotion.matches) return; // respect user preference
            autoTimer = setInterval(next, 5000);
        }
        function resetAuto() {
            clearInterval(autoTimer);
            startAuto();
        }

        if (prevBtn) prevBtn.addEventListener('click', function () { prev(); resetAuto(); });
        if (nextBtn) nextBtn.addEventListener('click', function () { next(); resetAuto(); });

        // Pause on hover
        if (wrapper) {
            wrapper.addEventListener('mouseenter', function () { clearInterval(autoTimer); });
            wrapper.addEventListener('mouseleave', startAuto);
        }

        // Touch / swipe
        let touchStartX = 0;
        track.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].clientX;
        }, { passive: true });
        track.addEventListener('touchend', function (e) {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) { diff > 0 ? next() : prev(); resetAuto(); }
        }, { passive: true });

        startAuto();
    }

    /* ──────────────────────────────────────────
       FAQ ACCORDION
    ────────────────────────────────────────── */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item, index) {
        const question = item.querySelector('.faq-question');
        const answer   = item.querySelector('.faq-answer');
        if (!question || !answer) return;

        // aria-controls pairing (WAI-ARIA accordion pattern)
        const answerId = 'faq-answer-' + (index + 1);
        answer.id = answerId;
        question.setAttribute('aria-controls', answerId);

        question.addEventListener('click', function () {
            const isOpen = item.classList.contains('open');

            // Close all
            faqItems.forEach(function (other) {
                const otherAnswer = other.querySelector('.faq-answer');
                other.classList.remove('open');
                other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                if (otherAnswer) otherAnswer.style.maxHeight = '0';
            });

            // Open this one if it was closed
            if (!isOpen) {
                item.classList.add('open');
                question.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    /* ──────────────────────────────────────────
       INTERSECTION OBSERVER — animate on scroll
    ────────────────────────────────────────── */
    const animateEls = document.querySelectorAll('[data-animate]');

    if (animateEls.length) {
        const animateObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    animateObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        animateEls.forEach(function (el) { animateObserver.observe(el); });
    }

    /* ──────────────────────────────────────────
       WHY CARDS — stagger with data-delay handled
       via CSS [data-delay] selectors
    ────────────────────────────────────────── */

    /* ──────────────────────────────────────────
       ANIMATED COUNTERS — why-stat-number
    ────────────────────────────────────────── */
    function animateCounter(el) {
        var target  = parseInt(el.dataset.counter, 10) || 0;
        var suffix  = el.dataset.suffix || '';
        var duration = prefersReducedMotion.matches ? 0 : 1400;
        var start    = null;

        function step(timestamp) {
            if (!start) start = timestamp;
            var elapsed  = timestamp - start;
            var progress = Math.min(elapsed / duration, 1);
            // ease-out quad
            var eased    = 1 - (1 - progress) * (1 - progress);
            var current  = Math.round(eased * target);
            el.textContent = current + suffix;
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target + suffix;
            }
        }

        if (duration === 0) {
            el.textContent = target + suffix;
        } else {
            requestAnimationFrame(step);
        }
    }

    var counterEls = document.querySelectorAll('[data-counter]');
    if (counterEls.length) {
        var counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counterEls.forEach(function (el) { counterObserver.observe(el); });
    }

    /* ──────────────────────────────────────────
       ACTIVE NAV LINK (highlight current section)
    ────────────────────────────────────────── */
    const navAnchors = document.querySelectorAll('.nav-link');
    const sections   = Array.from(document.querySelectorAll('section[id], div[id="inicio"]'));

    function updateActiveNav() {
        const scrollY   = window.scrollY;
        const headerH   = header ? header.offsetHeight : 80;
        let activeId    = '';

        sections.forEach(function (sec) {
            const top = sec.offsetTop - headerH - 40;
            if (scrollY >= top) activeId = sec.id;
        });

        navAnchors.forEach(function (a) {
            const href = a.getAttribute('href');
            a.style.color = (href === '#' + activeId) ? 'var(--purple-dark)' : '';
        });
    }

    /* ──────────────────────────────────────────
       WHATSAPP CTA TRACKING
    ────────────────────────────────────────── */
    document.querySelectorAll('a[href*="wa.me"]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            // Analytics hook — add gtag / fbq here if needed
            // gtag('event', 'wa_click', { button: this.textContent.trim() });
        });
    });

    /* ──────────────────────────────────────────
       SCROLL EVENT — batched
    ────────────────────────────────────────── */
    let ticking = false;
    window.addEventListener('scroll', function () {
        if (!ticking) {
            requestAnimationFrame(function () {
                updateScrollProgress();
                updateHeader();
                updateActiveNav();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    /* ──────────────────────────────────────────
       KEYBOARD — close nav on Escape
    ────────────────────────────────────────── */
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeNav();
    });

    /* ──────────────────────────────────────────
       INIT
    ────────────────────────────────────────── */
    updateScrollProgress();
    updateHeader();
    updateActiveNav();

    // Preconnect WhatsApp DNS
    window.addEventListener('load', function () {
        document.body.classList.add('loaded');
        const pre = document.createElement('link');
        pre.rel   = 'dns-prefetch';
        pre.href  = 'https://wa.me';
        document.head.appendChild(pre);
    });

}());
