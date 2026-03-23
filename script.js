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
    const hamburger  = document.getElementById('hamburger');
    const navLinks   = document.getElementById('navLinks');
    const navOverlay = document.getElementById('navOverlay');

    function closeNav() {
        if (!navLinks || !hamburger) return;
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
        if (navOverlay) {
            navOverlay.classList.remove('active');
            navOverlay.setAttribute('aria-hidden', 'true');
        }
        // Close any open mobile dropdowns
        document.querySelectorAll('.nav-item-dropdown.mobile-open').forEach(function (el) {
            el.classList.remove('mobile-open');
        });
    }

    if (navOverlay) navOverlay.addEventListener('click', closeNav);

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function () {
            const isOpen = navLinks.classList.toggle('open');
            hamburger.setAttribute('aria-expanded', String(isOpen));
            const spans = hamburger.querySelectorAll('span');
            if (isOpen) {
                spans[0].style.transform = 'rotate(45deg) translate(5.5px, 5.5px)';
                spans[1].style.opacity   = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5.5px, -5.5px)';
                if (navOverlay) {
                    navOverlay.classList.add('active');
                    navOverlay.setAttribute('aria-hidden', 'false');
                }
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity   = '';
                spans[2].style.transform = '';
                if (navOverlay) {
                    navOverlay.classList.remove('active');
                    navOverlay.setAttribute('aria-hidden', 'true');
                }
            }
        });

        navLinks.querySelectorAll('a:not([data-tab-target])').forEach(function (link) {
            link.addEventListener('click', function () {
                // Only close if not a dropdown toggle
                if (!this.classList.contains('nav-link-dropdown')) {
                    closeNav();
                }
            });
        });
    }

    /* ──────────────────────────────────────────
       MOBILE DROPDOWN ACCORDION
    ────────────────────────────────────────── */
    document.querySelectorAll('.nav-link-dropdown').forEach(function (trigger) {
        trigger.addEventListener('click', function (e) {
            var isMobile = window.innerWidth <= 768;
            var isTouch  = window.matchMedia('(hover: none)').matches;
            if (!isMobile && !isTouch) return; // desktop mouse uses CSS hover
            e.preventDefault();
            e.stopImmediatePropagation(); // prevent smooth-scroll handler from firing closeNav()
            var parent = this.closest('.nav-item-dropdown');
            if (!parent) return;
            parent.classList.toggle('mobile-open');
        });
    });

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
            clearInterval(autoTimer);
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
    const sections   = Array.from(document.querySelectorAll('section[id]'));

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
            a.classList.toggle('nav-link--active', href === '#' + activeId);
        });
    }

    /* ──────────────────────────────────────────
       DROPDOWN — nav service links activate tab
    ────────────────────────────────────────── */
    document.querySelectorAll('[data-tab-target]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var tabId = this.dataset.tabTarget;
            if (tabId) { activateTab(tabId); }
            closeNav();
        });
    });

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
       SWIPE — close nav by swiping up on mobile
       Listen on document (not nav) so overflow-y:auto
       scroll interception doesn't block the gesture.
       Only fires when nav is open and scrolled to top.
    ────────────────────────────────────────── */
    var navSwipeStartY  = 0;
    var navSwipeStartX  = 0;
    var navSwipeAtTop   = false;

    document.addEventListener('touchstart', function (e) {
        if (!navLinks || !navLinks.classList.contains('open')) return;
        navSwipeStartY = e.changedTouches[0].clientY;
        navSwipeStartX = e.changedTouches[0].clientX;
        navSwipeAtTop  = navLinks.scrollTop === 0;
    }, { passive: true });

    document.addEventListener('touchend', function (e) {
        if (!navLinks || !navLinks.classList.contains('open')) return;
        if (!navSwipeAtTop) return; // user was mid-scroll, don't close
        var diffY = navSwipeStartY - e.changedTouches[0].clientY;
        var diffX = Math.abs(navSwipeStartX - e.changedTouches[0].clientX);
        // Swipe up ≥ 60px and more vertical than horizontal
        if (diffY > 60 && diffY > diffX) {
            closeNav();
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

    // Set nav top dynamically to match real header height
    function setNavTop() {
        if (!header || !navLinks) return;
        var h = header.offsetHeight;
        navLinks.style.top = h + 'px';
        navLinks.style.maxHeight = 'calc(100vh - ' + h + 'px)';
    }
    setNavTop();
    window.addEventListener('resize', setNavTop, { passive: true });

    // Preconnect WhatsApp DNS
    window.addEventListener('load', function () {
        document.body.classList.add('loaded');
        const pre = document.createElement('link');
        pre.rel   = 'dns-prefetch';
        pre.href  = 'https://wa.me';
        document.head.appendChild(pre);
    });

}());
