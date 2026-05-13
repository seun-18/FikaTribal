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

    loadProperties();
    loadCartFromStorage();
    setupNavigation();
    updateCartCount();
});

// Cart Data
const Tribal = [
    {
        id: 1,
        title: "Bauble #4",
        price: 20000
    },
    {
        id: 2,
        title: "Bauble #3",
        price: 20000
    },
    {
        id: 3,
        title: "Bauble #2",
        price: 20000
    },
    {
        id: 4,
        title: "Bauble #1",
        price: 20000
    }
]

let cart = [];

// Load Properties Function
function loadProperties() {
    // This function can be used to dynamically load product properties
    console.log('Properties loaded:', Tribal);
}

// Setup Navigation Function
function setupNavigation() {
    // This function can be used to set up navigation event listeners
    console.log('Navigation setup complete');
}

// Cart Functions
function addToCart(id) {
    const property = Tribal.find(p => p.id === id);
    if (!property) {
        alert('Product not found!');
        return;
    }

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
        updateCartTotal();
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <p style="margin: 0; color: var(--text);">${item.title}</p>
                <small style="color: var(--text-muted);">₦${item.price.toLocaleString()} x ${item.quantity}</small>
            </div>
            <button onclick="removeFromCart(${item.id})" style="background: #ff4444; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer; font-size: 12px;">Remove</button>
        </div>
    `).join('');

    updateCartTotal();
}

function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartTotal = document.getElementById('cart-total');
    if (cartTotal) {
        cartTotal.textContent = total.toLocaleString();
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
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
        alert('Your cart is empty. Please add items before checking out.');
        return;
    }
    
    // Redirect to checkout page
    window.location.href = 'checkout.html';
}

// Notification Function
function showNotification(message) {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(136deg, var(--text), var(--glass-bg2));
        color: black;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
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

// Add animation style
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
