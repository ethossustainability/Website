// Mobile Navigation Toggle
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
                const offsetTop = target.offsetTop - 80; // Account for sticky navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
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

// Contact Form AJAX Submission
const contactForm = document.getElementById('contactForm');
const formResult = document.getElementById('contact-result');
const submitBtn = document.getElementById('submit-btn');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const botcheckValue = contactForm.querySelector('input[name="botcheck"]')?.value?.trim();
        if (botcheckValue) {
            formResult.style.display = 'block';
            formResult.textContent = 'Submission blocked.';
            formResult.style.backgroundColor = '#f8d7da';
            formResult.style.color = '#721c24';
            return;
        }

        // Visual feedback: Update button state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        const formData = new FormData(contactForm);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        formResult.style.display = 'block';
        formResult.textContent = 'Please wait...';
        formResult.style.backgroundColor = '#f0f0f0';
        formResult.style.color = '#333';

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    formResult.textContent = 'Message sent successfully!';
                    formResult.style.backgroundColor = '#d4edda';
                    formResult.style.color = '#155724';
                    contactForm.reset();
                    submitBtn.style.display = 'none'; // Hide button on success
                } else {
                    console.log(response);
                    formResult.textContent = json.message;
                    formResult.style.backgroundColor = '#f8d7da';
                    formResult.style.color = '#721c24';
                }
            })
            .catch(error => {
                console.log(error);
                formResult.textContent = 'Something went wrong!';
                formResult.style.backgroundColor = '#f8d7da';
                formResult.style.color = '#721c24';
            })
            .then(function () {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit';
                setTimeout(() => {
                    // Keep result visible, or hide after 5s
                    // formResult.style.display = "none";
                }, 5000);
            });
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
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
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
