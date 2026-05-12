// toggleMenu
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

// Cart

let cart = [];

document.addEventListener('DOMContentLoaded', function() {
    loadProperties();
    loadCartFromStorage();
    setupNavigation();
    updateCartCount();
});

// Cart Functions
function addToCart(id) {
    const property = id;
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...property,
            quantity: 1
        });
    }
    
    saveCartToStorage();
    updateCartCount();
    updateCartDisplay();
    showNotification(`${property.title} added to cart!`);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCartToStorage();
    updateCartCount();
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: var(--text-muted);">Your cart is empty</p>';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <small>$₦{}</small>
            </div>
            <button onclick="removeFromCart(${item.id})" style="background: var(--text-muted); color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer;">Remove</button>
        </div>
    `).join('');

    updateCartTotal();
}

function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const cartTotal = document.getElementById('cart-total');
    if (cartTotal) {
        cartTotal.textContent = total.toLocaleString();
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    if (!modal) return;
    
    modal.classList.toggle('active');
    if (modal.classList.contains('active')) {
        updateCartDisplay();
    }
}

function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty. What are you getting from us today.');
        return;
    }
    
    // Redirect to checkout page
    window.location.href = 'checkout.html';
}

// Storage Functions
function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const saved = localStorage.getItem('cart');
    if (saved) {
        cart = JSON.parse(saved);
    }
}

