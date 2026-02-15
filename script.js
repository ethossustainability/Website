// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
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
// Contact Form AJAX Submission
const contactForm = document.getElementById('contactForm');
const formResult = document.getElementById('contact-result');
const submitBtn = document.getElementById('submit-btn');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

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
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }

    lastScroll = currentScroll;
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
