document.addEventListener('DOMContentLoaded', () => {
    // ---- Navbar Scroll Effect ----
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.add('scrolled'); // Force for now, or just logic
            if (window.scrollY === 0) {
                 navbar.classList.remove('scrolled');
            }
        }
    });

    // Run once on load to catch initial state
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    }

    // ---- Mobile Menu Toggle ----
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    // Future mobile menu logic
    mobileMenuBtn.addEventListener('click', () => {
        // Toggle mobile menu visibility logic goes here
        console.log("Mobile menu clicked");
    });

    // ---- Scroll Reveal Logic ----
    const revealElements = document.querySelectorAll('.reveal');
    
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback or dev mode: if no intersection observer, just reveal them
        revealElements.forEach(el => el.classList.add('active'));
    }
});
