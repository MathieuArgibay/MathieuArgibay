document.addEventListener("DOMContentLoaded", function() {
    // Animation des sections au défilement
    const sections = document.querySelectorAll('section');

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        section.classList.add('invisible');
        observer.observe(section);
    });

    // Bouton "Retour en haut"
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.style.display = "block";
            } else {
                backToTopButton.style.display = "none";
            }
        });
    }

    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Fonctionnalité du menu burger
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

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

    // Apparition du logo lors du scroll
    const logo = document.querySelector('.logo');

    function handleScroll() {
        if (window.scrollY > 50) {
            logo.classList.add('visible');
        } else {
            logo.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialisation

    // Gestion des modales pour les projets
    const modalButtons = document.querySelectorAll('.btn-view');
    const modals = document.querySelectorAll('.modal');
    const modalCloses = document.querySelectorAll('.modal-close');

    modalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('show');
                document.body.style.overflow = 'hidden'; // Bloque le scroll
            }
        });
    });

    modalCloses.forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            const modal = closeBtn.closest('.modal');
            if (modal) {
                modal.classList.remove('show');
                document.body.style.overflow = ''; // Réactive le scroll
            }
        });
    });

    modals.forEach(modal => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.classList.remove('show');
                document.body.style.overflow = ''; // Réactive le scroll
            }
        });
    });

    // Initialisation d'EmailJS avec la bonne version du SDK
    emailjs.init("w-BEFMqJhqCDsKvY2"); // Remplace avec ta clé publique EmailJS

    const form = document.getElementById("contact-form");
    const formMessage = document.getElementById("form-message");
    const loadingSpinner = document.getElementById("loading-spinner");

    if (form) {
        form.addEventListener("submit", function(event) {
            event.preventDefault();

            // Afficher le loader personnalisé pendant l'envoi
            loadingSpinner.style.display = "flex";

            // Récupérer les valeurs avant de réinitialiser le formulaire
            const userEmail = form.querySelector("input[name='email']").value;
            const userName = form.querySelector("input[name='name']").value;

            // Envoyer le formulaire principal
            emailjs.sendForm('service_1cjyzga', 'template_cgjz1bk', this)
                .then(function(response) {
                    console.log('SUCCESS! Formulaire envoyé:', response.status, response.text);

                    // Appeler la fonction de réponse automatique
                    sendAutoResponse(userName, userEmail).then(() => {
                        console.log('Réponse automatique envoyée, redirection en cours...');
                        window.location.href = 'confirmation.html';
                    }).catch((error) => {
                        console.error('Erreur lors de l\'envoi de la réponse automatique...', error);
                    });

                    // Cacher le loader après succès
                    loadingSpinner.style.display = "none";
                }, function(error) {
                    console.error('Échec de l\'envoi du formulaire...', error);
                    formMessage.textContent = "Erreur lors de l'envoi du message. Veuillez réessayer.";
                    formMessage.style.color = "red";
                    loadingSpinner.style.display = "none"; // Cacher le loader après erreur
                });

            form.reset();
        });

    } else {
        console.error("Formulaire non trouvé");
    }

    // Fonction pour envoyer la réponse automatique
    function sendAutoResponse(userName, userEmail) {
        return new Promise(function(resolve, reject) {
            // Logs pour valider la récupération des valeurs
            console.log('Email utilisateur:', userEmail);
            console.log('Nom utilisateur:', userName);

            if (!userEmail || !userName) {
                console.error('Les champs email ou nom sont vides.');
                reject('Les champs email ou nom sont vides.');
                return;
            }

            const autoResponseParams = {
                user_name: userName,
                user_email: userEmail
            };

            // Envoyer l'email automatique
            emailjs.send('service_1cjyzga', 'template_u8y4np8', autoResponseParams)
                .then(function(response) {
                    console.log('Réponse automatique envoyée avec succès!', response.status, response.text);
                    resolve();
                }, function(error) {
                    console.error('Échec de l\'envoi de la réponse automatique...', error);
                    reject(error);
                });
        });
    }
});
