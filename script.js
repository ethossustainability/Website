// Mobile Navigation Toggle
// Shared motion preferences, also respected by the existing carousel and anchors.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

document.addEventListener('DOMContentLoaded', () => {
    try { document.body.classList.toggle('motion-paused', sessionStorage.getItem('ethos-motion-paused') === 'true'); } catch { }
    const footer = document.querySelector('.footer');
    const motionButton = document.createElement('button');
    motionButton.type = 'button';
    motionButton.className = 'motion-toggle';
    motionButton.textContent = 'Pause motion';
    motionButton.setAttribute('aria-pressed', 'false');
    if (document.body.classList.contains('motion-paused')) {
        motionButton.textContent = 'Resume motion';
        motionButton.setAttribute('aria-pressed', 'true');
    }
    footer?.querySelector('.footer-bottom')?.appendChild(motionButton);

    const revealElements = document.querySelectorAll('.internships-banner, .metric, .story-content, .mission-content, .event-item, .initiative-card, .partner-card, .section-title, .section-subtitle, .partners-cta, .partner-logo-item, .internship-form-card, .gallery-item, .lesson-sidebar, .lesson-steps, .contact-form, .legal-content, .partner-spotlight, .section-heading-row');
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: .08 });
    if (!reducedMotion.matches && !document.body.classList.contains('motion-paused')) revealElements.forEach(element => {
        const siblings = [...element.parentElement.children].filter(child => child.matches('.metric, .partner-logo-item, .gallery-item, .initiative-card, .partner-card'));
        const index = siblings.indexOf(element);
        if (index >= 0) element.style.setProperty('--reveal-delay', `${Math.min(index, 3) * 80}ms`);
        element.classList.add('reveal-ready');
        revealObserver.observe(element);
    });

    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    glow.setAttribute('aria-hidden', 'true');
    document.body.appendChild(glow);
    let glowFrame = 0;
    let pointerX = 0;
    let pointerY = 0;
    function hideGlow() {
        cancelAnimationFrame(glowFrame);
        glowFrame = 0;
        glow.classList.remove('is-visible');
    }
    document.addEventListener('pointermove', event => {
        if (!finePointer.matches || reducedMotion.matches || document.body.classList.contains('motion-paused') || event.pointerType === 'touch') return;
        pointerX = event.clientX;
        pointerY = event.clientY;
        glow.classList.add('is-visible');
        glow.classList.toggle('is-interactive', Boolean(event.target.closest('a, button, input, textarea')));
        if (!glowFrame) glowFrame = requestAnimationFrame(() => {
            glow.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
            glowFrame = 0;
        });
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', hideGlow);
    window.addEventListener('blur', hideGlow);
    reducedMotion.addEventListener('change', hideGlow);
    reducedMotion.addEventListener('change', () => {
        if (reducedMotion.matches) revealElements.forEach(element => element.classList.add('is-revealed'));
    });
    finePointer.addEventListener('change', hideGlow);
    motionButton.addEventListener('click', () => {
        const paused = document.body.classList.toggle('motion-paused');
        try { sessionStorage.setItem('ethos-motion-paused', String(paused)); } catch { }
        motionButton.setAttribute('aria-pressed', String(paused));
        motionButton.textContent = paused ? 'Resume motion' : 'Pause motion';
        if (paused) {
            hideGlow();
            revealElements.forEach(element => element.classList.add('is-revealed'));
            document.querySelectorAll('.project-card').forEach(element => {
                element.style.opacity = '1';
                element.style.transform = 'none';
            });
        }
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        if (new URL(link.href).pathname === window.location.pathname ||
            (window.location.pathname.endsWith('/') && new URL(link.href).pathname === `${window.location.pathname}index.html`)) {
            link.setAttribute('aria-current', 'page');
        }
    });
    if (!footer) return;

    const launch = document.createElement('button');
    launch.type = 'button';
    launch.className = 'footer-play';
    launch.textContent = '♻';
    launch.title = 'A little planet-friendly detour';
    launch.setAttribute('aria-label', 'Play the recycling sorting game');
    (footer.querySelector('.footer-social') || footer.querySelector('.footer-content')).appendChild(launch);

    const game = document.createElement('dialog');
    game.className = 'eco-game';
    game.setAttribute('aria-labelledby', 'game-title');
    game.setAttribute('aria-describedby', 'game-intro');
    game.innerHTML = `
        <div class="game-top"><span class="game-kicker">You found the easter egg ✳</span><button type="button" class="game-close" aria-label="Close recycling game" autofocus>×</button></div>
        <h2 id="game-title">Give it a second life.</h2>
        <p class="game-intro" id="game-intro">Eight everyday items. Three bins. How well can you sort? Select a bin with a click, tap, or keyboard.</p>
        <div class="game-progress"><span id="game-round"></span><span id="game-score"></span></div>
        <progress max="8" value="0" aria-label="Items sorted"></progress>
        <div class="game-item"><span class="game-emoji" aria-hidden="true"></span><h3 id="game-item-name"></h3></div>
        <div class="game-bins" role="group" aria-label="Choose a bin">
            <button type="button" class="game-bin" data-bin="recycle"><span aria-hidden="true">♻</span>Recycle</button>
            <button type="button" class="game-bin" data-bin="compost"><span aria-hidden="true">🌱</span>Compost</button>
            <button type="button" class="game-bin" data-bin="trash"><span aria-hidden="true">🗑</span>Trash</button>
        </div>
        <p class="game-feedback" role="status" aria-live="polite" aria-atomic="true"></p>
        <button type="button" class="btn btn-primary game-next" hidden>Next item →</button>
        <p class="game-note">A practice round for common materials. Recycling and compost rules vary—always check your local program. Never put batteries in these bins.</p>`;
    document.body.appendChild(game);

    const items = [
        { name: 'Empty aluminum can', emoji: '🥫', bin: 'recycle', tip: 'Empty aluminum cans can be recycled into new metal products.' },
        { name: 'Banana peel', emoji: '🍌', bin: 'compost', tip: 'Fruit peels can return nutrients to soil in a compost system.' },
        { name: 'Clean cardboard box', emoji: '📦', bin: 'recycle', tip: 'Flatten clean, dry cardboard before placing it in recycling.' },
        { name: 'Used disposable diaper', emoji: '🧷', bin: 'trash', tip: 'Used disposable diapers belong in the trash, never recycling or home compost.' },
        { name: 'Apple core', emoji: '🍎', bin: 'compost', tip: 'Apple cores and other fruit scraps can go into compost.' },
        { name: 'Broken ceramic mug', emoji: '☕', bin: 'trash', tip: 'Ceramics cannot be recycled with glass. Wrap sharp pieces before disposal.' },
        { name: 'Clean newspaper', emoji: '📰', bin: 'recycle', tip: 'Clean, dry newspaper can be recycled into new paper.' },
        { name: 'Dry leaves', emoji: '🍂', bin: 'compost', tip: 'Dry leaves add carbon to compost. Mix them with food scraps.' }
    ];
    const bins = [...game.querySelectorAll('.game-bin')];
    const next = game.querySelector('.game-next');
    const feedback = game.querySelector('.game-feedback');
    let deck = [];
    let round = 0;
    let score = 0;
    let answered = false;
    let previousOverflow = '';

    function renderRound() {
        answered = false;
        const item = deck[round];
        game.querySelector('#game-round').textContent = `Item ${round + 1} of ${deck.length}`;
        game.querySelector('#game-score').textContent = `${score} correct`;
        game.querySelector('progress').value = round;
        game.querySelector('.game-emoji').textContent = item.emoji;
        game.querySelector('#game-item-name').textContent = item.name;
        feedback.textContent = '';
        bins.forEach(bin => { bin.disabled = false; });
        game.querySelector('.game-bins').hidden = false;
        next.hidden = true;
        next.textContent = 'Next item →';
    }
    function restart() {
        deck = [...items];
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        round = 0;
        score = 0;
        renderRound();
    }
    launch.addEventListener('click', () => {
        restart();
        previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        game.showModal();
    });
    bins.forEach(bin => bin.addEventListener('click', () => {
        if (answered) return;
        answered = true;
        const item = deck[round];
        const correct = bin.dataset.bin === item.bin;
        if (correct) score++;
        feedback.textContent = `${correct ? 'Nice sorting!' : `This one goes in ${item.bin}.`} ${item.tip}`;
        game.querySelector('#game-score').textContent = `${score} correct`;
        game.querySelector('progress').value = round + 1;
        bins.forEach(button => { button.disabled = true; });
        next.hidden = false;
        next.textContent = round === deck.length - 1 ? 'See your results →' : 'Next item →';
        next.focus({ preventScroll: true });
    }));
    next.addEventListener('click', () => {
        if (round === deck.length) {
            restart();
            bins[0].focus({ preventScroll: true });
            return;
        }
        round++;
        if (round < deck.length) {
            renderRound();
            bins[0].focus({ preventScroll: true });
        } else {
            game.querySelector('#game-round').textContent = 'Round complete';
            game.querySelector('.game-emoji').textContent = score === deck.length ? '🌍' : '🌱';
            game.querySelector('#game-item-name').textContent = `${score} / ${deck.length} sorted correctly`;
            game.querySelector('.game-bins').hidden = true;
            feedback.textContent = score === deck.length ? 'Planet-friendly pro! Keep that circular thinking going.' : 'Every small action counts. Play again and put what you learned into practice.';
            next.textContent = 'Play again ↻';
            next.focus({ preventScroll: true });
        }
    });
    game.querySelector('.game-close').addEventListener('click', () => game.close());
    game.addEventListener('click', event => {
        if (event.target !== game) return;
        const rect = game.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) game.close();
    });
    game.addEventListener('close', () => {
        document.body.style.overflow = previousOverflow;
        launch.focus({ preventScroll: true });
    });
});

const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
    navToggle.setAttribute('aria-expanded', 'false');

    navToggle.addEventListener('click', () => {
        const isExpanded = navMenu.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', String(isExpanded));
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu) {
            navMenu.classList.remove('active');
        }
        if (navToggle) {
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
});

// Smooth Scrolling (only for same-page anchors)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Only handle if it's a same-page anchor (not cross-page like index.html#contact)
        if (href.startsWith('#') && !href.includes('.')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80; // Account for sticky navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.body.classList.contains('motion-paused') ? 'instant' : 'smooth'
                });
            }
        }
    });
});

// Handle cross-page anchor links (e.g., index.html#contact)
document.querySelectorAll('a[href*="#"]').forEach(anchor => {
    const href = anchor.getAttribute('href');
    if (href.includes('.html#')) {
        anchor.addEventListener('click', function (e) {
            // Let the browser handle navigation, then scroll after page loads
            // The target page will handle scrolling if needed
        });
    }
});

// Newsletter Form Handling
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;

        // Here you would typically send the email to your backend
        // For now, we'll just show an alert
        alert(`Thank you for subscribing! We'll send updates to ${email}`);
        newsletterForm.reset();
    });
}

// Lightbox Modal Gallery for all .gallery-grid images
function createLightboxModal() {
    if (document.getElementById('lightboxModal')) return;
    const modal = document.createElement('div');
    modal.id = 'lightboxModal';
    modal.style.position = 'fixed';
    modal.style.top = 0;
    modal.style.left = 0;
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.85)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = 9999;
    modal.style.visibility = 'hidden';
    modal.style.opacity = 0;
    modal.style.transition = 'opacity 0.2s';
    modal.innerHTML = `
        <span id="lightboxClose" style="position:absolute;top:30px;right:50px;font-size:3rem;color:#fff;cursor:pointer;z-index:10001;">&times;</span>
        <img id="lightboxImg" src="" alt="Gallery Image" style="max-width:90vw;max-height:80vh;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.4);">
    `;
    document.body.appendChild(modal);
    // Close logic
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.id === 'lightboxClose') {
            modal.style.opacity = 0;
            setTimeout(() => { modal.style.visibility = 'hidden'; }, 200);
        }
    });
}

function enableGalleryLightbox() {
    createLightboxModal();
    const modal = document.getElementById('lightboxModal');
    const imgEl = document.getElementById('lightboxImg');
    document.querySelectorAll('.gallery-grid .gallery-item img').forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            imgEl.src = img.src;
            modal.style.visibility = 'visible';
            modal.style.opacity = 1;
        });
    });
}

document.addEventListener('DOMContentLoaded', enableGalleryLightbox);
// Quotes Carousel Logic
document.addEventListener('DOMContentLoaded', function () {
    const quotes = document.querySelectorAll('.quotes-carousel .quote-item');
    let current = 0;
    if (quotes.length > 0) {
        setInterval(() => {
            if (document.hidden || document.body.classList.contains('motion-paused') || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            quotes[current].classList.remove('active');
            current = (current + 1) % quotes.length;
            quotes[current].classList.add('active');
        }, 3500);
    }
});

// Swap label for coming-soon buttons while hovered or keyboard-focused.
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.coming-soon-btn').forEach(button => {
        const originalText = button.textContent.trim() || 'Coming Soon';
        button.dataset.defaultText = originalText;
        button.style.minWidth = `${button.offsetWidth}px`;

        button.addEventListener('mouseenter', () => {
            button.textContent = 'Not Yet!';
        });

        button.addEventListener('mouseleave', () => {
            button.textContent = button.dataset.defaultText;
        });

        button.addEventListener('focus', () => {
            button.textContent = 'Not Yet!';
        });

        button.addEventListener('blur', () => {
            button.textContent = button.dataset.defaultText;
        });
    });
});

function addFooterLegalLinks() {
    document.querySelectorAll('.footer').forEach(footer => {
        if (footer.querySelector('.footer-legal')) {
            return;
        }

        const footerBottom = footer.querySelector('.footer-bottom');
        if (!footerBottom) {
            return;
        }

        const legalLinks = document.createElement('nav');
        legalLinks.className = 'footer-legal';
        legalLinks.setAttribute('aria-label', 'Legal links');
        legalLinks.innerHTML = `
            <a href="/cookies-and-data-collection.html">Cookies &amp; Data Collection</a>
            <a href="/privacy-policy.html">Privacy Policy</a>
            <a href="/accessibility-statement.html">Accessibility Statement</a>
            <a href="/terms-and-conditions.html">Terms &amp; Conditions</a>
        `;

        footerBottom.parentNode.insertBefore(legalLinks, footerBottom);
    });
}

document.addEventListener('DOMContentLoaded', addFooterLegalLinks);

// Contact Form AJAX Submission
const contactForm = document.getElementById('contactForm');
const formResult = document.getElementById('contact-result');
const submitBtn = document.getElementById('submit-btn');

if (contactForm && formResult && submitBtn) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        if (submitBtn.disabled) return;
        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }
        function showResult(message, state) {
            formResult.style.display = 'block';
            formResult.textContent = message;
            formResult.className = `form-status form-status-${state}`;
        }
        if (contactForm.querySelector('input[name="botcheck"]')?.checked) {
            showResult('Submission blocked.', 'error');
            return;
        }
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        contactForm.setAttribute('aria-busy', 'true');
        showResult('Sending your message...', 'pending');
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);
        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(Object.fromEntries(new FormData(contactForm))),
                signal: controller.signal
            });
            const result = await response.json();
            if (!response.ok || result.success !== true) {
                throw new Error('Submission was not accepted.');
            }
            showResult('Message sent successfully! Thank you for reaching out.', 'success');
            contactForm.reset();
        } catch (error) {
            showResult(error.name === 'AbortError'
                ? 'The request took too long. Your message is still here—please try again.'
                : 'We couldn’t send your message. Please try again, or email info@ethossustainability.org.', 'error');
        } finally {
            clearTimeout(timeout);
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit';
            contactForm.setAttribute('aria-busy', 'false');
        }
    });
}

// Add scroll effect to navbar
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }

});

// Fade in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe project cards
document.querySelectorAll('.project-card').forEach(card => {
    if (reducedMotion.matches) return;
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Handle anchor scrolling on page load
window.addEventListener('load', () => {
    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
            setTimeout(() => {
                const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.body.classList.contains('motion-paused') ? 'instant' : 'smooth'
                });
            }, 100);
        }
    }
});

// Team Modal Functionality
const teamModal = document.getElementById('teamModal');
const modalClose = document.querySelector('.modal-close');
const modalOverlay = document.querySelector('.modal-overlay');

if (teamModal) {
    document.querySelectorAll('.clickable-photo').forEach(photo => {
        photo.addEventListener('click', () => {
            const name = photo.dataset.memberName;
            const role = photo.dataset.memberRole;
            const bio = photo.dataset.memberBio;
            const image = photo.dataset.memberImage;
            const cropX = photo.dataset.cropX || 'center';
            const cropY = photo.dataset.cropY || 'center';
            const modalSize = photo.dataset.modalSize;

            document.getElementById('modalName').textContent = name;
            document.getElementById('modalRole').textContent = role;
            document.getElementById('modalBio').textContent = bio;

            const modalContent = teamModal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.classList.remove('wide');
                if (modalSize === 'wide') modalContent.classList.add('wide');
            }

            const modalImg = document.getElementById('modalPhoto');
            if (modalImg) {
                modalImg.src = image;
                modalImg.style.setProperty('--crop-x', cropX);
                modalImg.style.setProperty('--crop-y', cropY);
            }

            teamModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeModal = () => {
        teamModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && teamModal.classList.contains('active')) {
            closeModal();
        }
    });
}
