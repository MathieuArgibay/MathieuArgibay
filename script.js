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
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if(navMenu.classList.contains('open')){
                navMenu.classList.remove('open');
                navToggle.classList.remove('open');
            }
        });
    });

    // Apparition du logo lors du scroll sur petits écrans
    const logo = document.querySelector('.logo');

    function handleScroll() {
        if(window.innerWidth <= 768) { // Vérifie si l'écran est petit
            if(window.scrollY > 50){
                logo.classList.add('visible');
            } else {
                logo.classList.remove('visible');
            }
        } else {
            logo.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll); // Met à jour lors du redimensionnement
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
