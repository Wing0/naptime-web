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

document.addEventListener('DOMContentLoaded', () => {
    const consentKey = 'naptime_cookie_consent';
    const analyticsConsentCookie = 'naptime_analytics_consent';
    const banner = document.getElementById('cookie-banner');
    const accept = document.getElementById('cookie-accept');
    const deny = document.getElementById('cookie-deny');

    if (!banner || !accept || !deny) return;

    const storedConsent = localStorage.getItem(consentKey);
    if (storedConsent === 'granted') {
        document.cookie = `${analyticsConsentCookie}=granted; Max-Age=31536000; Path=/; SameSite=Lax; Secure`;
    } else if (storedConsent === null) {
        setTimeout(() => {
            banner.classList.add('visible');
        }, 600);
    }

    accept.addEventListener('click', () => {
        localStorage.setItem(consentKey, 'granted');
        document.cookie = `${analyticsConsentCookie}=granted; Max-Age=31536000; Path=/; SameSite=Lax; Secure`;
        if (window.naptimeAnalytics) {
            window.naptimeAnalytics.consentChoice('granted');
        }
        banner.classList.remove('visible');
    });

    deny.addEventListener('click', () => {
        localStorage.setItem(consentKey, 'denied');
        document.cookie = `${analyticsConsentCookie}=; Max-Age=0; Path=/; SameSite=Lax; Secure`;
        if (window.naptimeAnalytics) {
            window.naptimeAnalytics.consentChoice('denied');
        }
        banner.classList.remove('visible');
    });
});

