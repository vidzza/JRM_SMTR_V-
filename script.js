// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        const spans = hamburger.querySelectorAll('span');
        if (navLinks.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(8px, 8px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
}

// Smooth scroll with offset for fixed header
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 100;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header scroll effect
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

// Observe elements for animation (EXCLUDING service-premium cards)
const animatedElements = document.querySelectorAll(`
    .why-card,
    .timeline-item,
    .cert-item,
    .comparison-item,
    .benefit-item
`);

animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + '+';
        }
    }, 16);
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            const statNumbers = entry.target.querySelectorAll('.stat-item h3');
            
            // Animate the "85+" stat
            if (statNumbers[0] && statNumbers[0].textContent === '85+') {
                let current = 0;
                const target = 85;
                const duration = 2000;
                const increment = target / (duration / 16);
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        statNumbers[0].textContent = '85+';
                        clearInterval(timer);
                    } else {
                        statNumbers[0].textContent = Math.floor(current) + '+';
                    }
                }, 16);
            }
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// Parallax effect for hero shapes
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.hero-shape');
    
    shapes.forEach((shape, index) => {
        const speed = 0.5 + (index * 0.1);
        shape.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Add hover effect to service cards (REMOVED - keeping it simple)
// Service cards now have CSS-only hover effects

// Service card hover effect with tilt (REMOVED - too distracting)
// Keeping clean, professional hover effect in CSS only

// Add click tracking for CTAs (for analytics)
const ctaButtons = document.querySelectorAll('a[href*="wa.me"]');
ctaButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        const buttonText = this.textContent.trim();
        console.log('CTA Clicked:', buttonText);
        
        // You can add Google Analytics or other tracking here
        // gtag('event', 'cta_click', { 'button_text': buttonText });
    });
});

// Lazy load images (if you add images later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add smooth reveal animation to timeline items
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }, index * 150);
        }
    });
}, { threshold: 0.2 });

timelineItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-30px)';
    item.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    timelineObserver.observe(item);
});

// Add pulse animation to primary CTAs
const primaryCTAs = document.querySelectorAll('.btn-primary, .btn-cta');
setInterval(() => {
    primaryCTAs.forEach(btn => {
        btn.style.animation = 'none';
        setTimeout(() => {
            btn.style.animation = 'pulse 0.5s ease-out';
        }, 10);
    });
}, 5000);

// Keyboard accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Add scroll progress indicator
const scrollProgress = document.createElement('div');
scrollProgress.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, #CFB6DE 0%, #7FA895 100%);
    z-index: 9999;
    transition: width 0.1s ease-out;
`;
document.body.appendChild(scrollProgress);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    scrollProgress.style.width = scrolled + '%';
});

// Preload critical resources
window.addEventListener('load', () => {
    // Add loaded class to body for any load-dependent animations
    document.body.classList.add('loaded');
    
    // Prefetch WhatsApp link for faster loading
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    whatsappLinks.forEach(link => {
        const prefetch = document.createElement('link');
        prefetch.rel = 'dns-prefetch';
        prefetch.href = 'https://wa.me';
        document.head.appendChild(prefetch);
    });
});

// Add typing effect to hero title (optional, uncomment to use)
/*
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 50);
    }
});
*/

// Service card hover effect with tilt
serviceCards.forEach(card => {
    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px) scale(1.02)`;
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
    });
});

// Add custom cursor effect (optional enhancement)
const cursorDot = document.createElement('div');
cursorDot.style.cssText = `
    width: 8px;
    height: 8px;
    background: #7FA895;
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s;
    mix-blend-mode: difference;
`;
document.body.appendChild(cursorDot);

document.addEventListener('mousemove', (e) => {
    cursorDot.style.left = e.clientX - 4 + 'px';
    cursorDot.style.top = e.clientY - 4 + 'px';
    cursorDot.style.opacity = '1';
});

document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = '0';
});

// Enhanced button interactions
const allButtons = document.querySelectorAll('.btn');
allButtons.forEach(button => {
    button.addEventListener('mouseenter', function() {
        cursorDot.style.transform = 'scale(3)';
    });
    
    button.addEventListener('mouseleave', function() {
        cursorDot.style.transform = 'scale(1)';
    });
});

// Service cards - simple, clean interaction
const serviceCards = document.querySelectorAll('.service-premium');
serviceCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        cursorDot.style.transform = 'scale(2)';
    });
    
    card.addEventListener('mouseleave', function() {
        cursorDot.style.transform = 'scale(1)';
    });
});

console.log('🦅 Página de Julissa Ramos - Seguros Monterrey NYL cargada exitosamente');
console.log('📱 WhatsApp: +52 614 603 8380');