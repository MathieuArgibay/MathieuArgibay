document.addEventListener('DOMContentLoaded', function() {
    // Animation des sections au défilement
    const sections = document.querySelectorAll('section');

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if(entry.isIntersecting){
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

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.style.display = "block";
        } else {
            backToTopButton.style.display = "none";
        }
    });

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
            if(navMenu.classList.contains('open')){
                navMenu.classList.remove('open');
                navToggle.classList.remove('open');
                document.body.classList.remove('menu-open');
            }
        });
    });

    // Apparition du logo lors du scroll sur tous les écrans
    const logo = document.querySelector('.logo');

    function handleScroll() {
        if(window.scrollY > 50){
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

    // Ouvrir la modale correspondante au clic sur le bouton "Voir le projet"
    modalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('show'); // Ajouter la classe 'show' pour afficher la modale
                document.body.style.overflow = 'hidden'; // Empêche le défilement de l'arrière-plan
            }
        });
    });

    // Fermer la modale au clic sur le bouton de fermeture
    modalCloses.forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            const modal = closeBtn.closest('.modal');
            if (modal) {
                modal.classList.remove('show'); // Retirer la classe 'show' pour cacher la modale
                document.body.style.overflow = ''; // Réactive le défilement de l'arrière-plan
            }
        });
    });

    // Fermer la modale au clic en dehors du contenu
    modals.forEach(modal => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.classList.remove('show'); // Retirer la classe 'show' pour cacher la modale
                document.body.style.overflow = ''; // Réactive le défilement de l'arrière-plan
            }
        });
    });
});
// Initialisation d'EmailJS
(function() {
    emailjs.init("csaavtxg0Jb0SDrtw"); // Remplace TON_USER_ID_EMAILJS par ton vrai user ID EmailJS
})();

// Formulaire de contact
const form = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");

form.addEventListener("submit", function(event) {
    event.preventDefault();
    
    emailjs.sendForm('service_1cjyzga', 'template_cgjz1bk', this)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            formMessage.textContent = "Votre message a été envoyé avec succès!";
            formMessage.style.color = "green";
        }, function(error) {
            console.log('FAILED...', error);
            formMessage.textContent = "Erreur lors de l'envoi du message. Veuillez réessayer.";
            formMessage.style.color = "red";
        });

    form.reset();
});

