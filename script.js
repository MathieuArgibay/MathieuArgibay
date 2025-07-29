document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // Animation des sections
    // =========================
    const sections = document.querySelectorAll('section');
    if (sections.length) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        sections.forEach(section => {
            section.classList.add('invisible');
            observer.observe(section);
        });
    }

    // =========================
    // Bouton "Retour en haut"
    // =========================
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', function () {
            backToTopButton.style.display = window.pageYOffset > 300 ? "block" : "none";
        });
        backToTopButton.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // =========================
    // Menu burger
    // =========================
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
            document.body.classList.toggle('menu-open');
        });
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('open')) {
                    navMenu.classList.remove('open');
                    navToggle.classList.remove('open');
                    document.body.classList.remove('menu-open');
                }
            });
        });
    }

    // =========================
    // Logo qui apparaît au scroll
    // =========================
    const logo = document.querySelector('.logo');
    if (logo) {
        function handleScroll() {
            if (window.scrollY > 50) {
                logo.classList.add('visible');
            } else {
                logo.classList.remove('visible');
            }
        }
        window.addEventListener('scroll', handleScroll);
        handleScroll();
    }

    // =========================
    // Modales & carrousel (portfolio)
    // =========================
    const modalButtons = document.querySelectorAll('.btn-view');
    const modals = document.querySelectorAll('.modal');
    const modalCloses = document.querySelectorAll('.modal-close');

    if (modalButtons.length && modals.length) {
        modalButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modalId = button.getAttribute('data-modal');
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.classList.add('show');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        modalCloses.forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                const modal = closeBtn.closest('.modal');
                if (modal) {
                    modal.classList.remove('show');
                    document.body.style.overflow = '';
                }
            });
        });

        modals.forEach(modal => {
            modal.addEventListener('click', (event) => {
                if (event.target === modal) {
                    modal.classList.remove('show');
                    document.body.style.overflow = '';
                }
            });

            // Carrousel dans les modales
            const slides = modal.querySelectorAll('.carousel-slide');
            let current = 0;

            const showSlide = index => {
                slides.forEach((img, i) => img.classList.toggle('active', i === index));
            };

            modal.querySelector('.carousel-prev')?.addEventListener('click', () => {
                current = (current - 1 + slides.length) % slides.length;
                showSlide(current);
            });

            modal.querySelector('.carousel-next')?.addEventListener('click', () => {
                current = (current + 1) % slides.length;
                showSlide(current);
            });

            modal.addEventListener('show', () => {
                current = 0;
                showSlide(current);
            });
        });
    }

    // =========================
    // Thème clair/sombre
    // =========================
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        const body = document.body;
        let savedTheme = localStorage.getItem('theme');
        if (!savedTheme) {
            savedTheme = 'dark';
            localStorage.setItem('theme', savedTheme);
        }
        body.classList.add(`${savedTheme}-theme`);
        toggleBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

        toggleBtn.addEventListener('click', () => {
            const isDark = body.classList.contains('dark-theme');
            body.classList.toggle('dark-theme', !isDark);
            body.classList.toggle('light-theme', isDark);

            const newTheme = isDark ? 'light' : 'dark';
            toggleBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
            localStorage.setItem('theme', newTheme);
        });
    }

    // =========================
    // Formulaire (EmailJS + reCAPTCHA)
    // =========================
    const form = document.getElementById("contact-form");
    const formMessage = document.getElementById("form-message");
    const loadingSpinner = document.getElementById("loading-spinner");

    if (form) {
        // Initialisation EmailJS
        if (typeof emailjs !== 'undefined') {
            emailjs.init("w-BEFMqJhqCDsKvY2"); // Remplace par ta clé publique
        }

        form.addEventListener("submit", function (event) {
            event.preventDefault();

            // Vérification reCAPTCHA
            if (typeof grecaptcha !== "undefined") {
                const recaptchaResponse = grecaptcha.getResponse();
                if (recaptchaResponse.length === 0) {
                    formMessage.textContent = "Merci de vérifier le reCAPTCHA.";
                    formMessage.style.color = "red";
                    return;
                }
            }

            loadingSpinner.style.display = "flex";

            const userEmail = form.querySelector("input[name='email']").value;
            const userName = form.querySelector("input[name='name']").value;

            // Envoi EmailJS
            emailjs.sendForm('service_1cjyzga', 'template_cgjz1bk', this)
                .then(() => {
                    sendAutoResponse(userName, userEmail).then(() => {
                        window.location.href = 'confirmation.html';
                    });
                    formMessage.textContent = "Message envoyé avec succès !";
                    formMessage.style.color = "green";
                })
                .catch(() => {
                    formMessage.textContent = "Erreur lors de l'envoi. Veuillez réessayer.";
                    formMessage.style.color = "red";
                })
                .finally(() => {
                    loadingSpinner.style.display = "none";
                    form.reset();
                    if (typeof grecaptcha !== "undefined") grecaptcha.reset();
                });
        });

        // Réponse automatique
        function sendAutoResponse(userName, userEmail) {
            return new Promise((resolve, reject) => {
                if (!userEmail || !userName) return reject("Données manquantes");
                const params = { user_name: userName, user_email: userEmail };
                emailjs.send('service_1cjyzga', 'template_u8y4np8', params)
                    .then(resolve)
                    .catch(reject);
            });
        }
    }

});
