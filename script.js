document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.card, .feature-row, .step-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Add visible class styling
    const style = document.createElement('style');
    style.textContent = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
});

// Cookie Consent Logic
document.addEventListener('DOMContentLoaded', () => {
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const denyBtn = document.getElementById('cookie-deny');

    // Check if consent is already stored
    const consent = localStorage.getItem('naptime_cookie_consent');

    if (!consent) {
        // Show banner after a short delay
        setTimeout(() => {
            cookieBanner.classList.add('visible');
        }, 1000);
    } else if (consent === 'granted') {
        grantConsent();
    }

    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('naptime_cookie_consent', 'granted');
        grantConsent();
        hideBanner();
    });

    denyBtn.addEventListener('click', () => {
        localStorage.setItem('naptime_cookie_consent', 'denied');
        hideBanner();
    });

    function grantConsent() {
        if (typeof gtag === 'function') {
            gtag('consent', 'update', {
                'ad_storage': 'granted',
                'analytics_storage': 'granted'
            });
        }
    }

    function hideBanner() {
        cookieBanner.classList.remove('visible');
    }
});
