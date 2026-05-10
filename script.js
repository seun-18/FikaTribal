function toggleMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    }
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const nav = document.querySelector('nav');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (nav && !nav.contains(event.target)) {
        if (menuToggle) menuToggle.classList.remove('active');
        if (navMenu) navMenu.classList.remove('active');
    }
});

// Close menu when clicking on a link
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('menuToggle');
    if (hamburger) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMenu();
        });
    }

    const navLinks = document.querySelectorAll('.nav-menu .nav-link');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (menuToggle) menuToggle.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
        });
    });

});