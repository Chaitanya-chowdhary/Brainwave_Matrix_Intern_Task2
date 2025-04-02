// Product Data
const products = [
    {
        id: 1,
        title: "'67 Camaro",
        collection: "Vintage Series",
        price: 24.99,
        image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        category: "vintage",
        badge: "Rare"
    },
    {
        id: 2,
        title: "Dodge Charger R/T",
        collection: "Fast & Furious",
        price: 19.99,
        image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        category: "premium",
        badge: "New"
    },
    {
        id: 3,
        title: "Porsche 911 GT3",
        collection: "Premium Series",
        price: 29.99,
        image: "https://images.unsplash.com/photo-1580274455191-1c62238fa333?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        category: "premium",
        badge: "Hot"
    },
    {
        id: 4,
        title: "'69 Mustang Boss 302",
        collection: "Limited Edition",
        price: 34.99,
        image: "https://images.unsplash.com/photo-1582063289852-62e3ba1f1ad2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        category: "limited",
        badge: "Limited"
    },
    {
        id: 5,
        title: "Tesla Cybertruck",
        collection: "New Releases",
        price: 22.99,
        image: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        category: "new",
        badge: "New"
    },
    {
        id: 6,
        title: "Batmobile",
        collection: "Entertainment",
        price: 27.99,
        image: "https://images.unsplash.com/photo-1593941707882-a5bbbfd6e8a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        category: "premium",
        badge: "Exclusive"
    },
    {
        id: 7,
        title: "'55 Chevy Bel Air",
        collection: "Vintage Series",
        price: 26.99,
        image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        category: "vintage",
        badge: "Classic"
    },
    {
        id: 8,
        title: "Lamborghini Sian",
        collection: "Super Treasure Hunt",
        price: 39.99,
        image: "https://images.unsplash.com/photo-1633613286848-e6f43bbafb8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        category: "limited",
        badge: "Rare"
    }
];

// Cart Data
let cart = [];
let wishlist = [];

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const cartIcon = document.getElementById('cart-icon');
const cartCount = document.getElementById('cart-count');
const modalOverlay = document.getElementById('modal-overlay');
const closeModal = document.getElementById('close-modal');
const cartItems = document.getElementById('cart-items');
const cartSummary = document.getElementById('cart-summary');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartTotal = document.getElementById('cart-total');

// Display Products
function displayProducts(filter = 'all') {
    productsGrid.innerHTML = '';
    
    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(product => product.category === filter);
    
    filteredProducts.forEach(product => {
        const isInWishlist = wishlist.includes(product.id);
        
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.id = product.id;
        productCard.dataset.category = product.category;
        
        productCard.innerHTML = `
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-collection">${product.collection}</p>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <div class="product-actions">
                    <button class="add-to-cart">Add to Cart</button>
                    <button class="wishlist-btn ${isInWishlist ? 'active' : ''}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="${isInWishlist ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
    
    // Add event listeners to new buttons
    addProductEventListeners();
}

// Add event listeners to product buttons
function addProductEventListeners() {
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.closest('.product-card').dataset.id);
            addToCart(productId);
        });
    });
    
    // Wishlist buttons
    document.querySelectorAll('.wishlist-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.closest('.product-card').dataset.id);
            toggleWishlist(productId, this);
        });
    });
}

// Add to cart function
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    
    // Show a quick confirmation
    const confirmation = document.createElement('div');
    confirmation.textContent = `${product.title} added to cart!`;
    confirmation.style.position = 'fixed';
    confirmation.style.bottom = '20px';
    confirmation.style.right = '20px';
    confirmation.style.backgroundColor = 'var(--primary)';
    confirmation.style.color = 'white';
    confirmation.style.padding = '10px 20px';
    confirmation.style.borderRadius = '5px';
    confirmation.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    confirmation.style.zIndex = '1000';
    confirmation.style.animation = 'fadeIn 0.3s, fadeOut 0.3s 2s forwards';
    
    document.body.appendChild(confirmation);
    
    setTimeout(() => {
        confirmation.remove();
    }, 2500);
}

// Toggle wishlist function
function toggleWishlist(productId, button) {
    const index = wishlist.indexOf(productId);
    
    if (index === -1) {
        wishlist.push(productId);
        button.classList.add('active');
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
        `;
    } else {
        wishlist.splice(index, 1);
        button.classList.remove('active');
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
        `;
    }
}

// Update cart function
function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart modal if open
    if (modalOverlay.classList.contains('active')) {
        renderCartItems();
    }
}

// Render cart items
function renderCartItems() {
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty</p>
                <a href="#featured" class="btn">Continue Shopping</a>
            </div>
        `;
        cartSummary.style.display = 'none';
        return;
    }
    
    cartItems.innerHTML = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.dataset.id = item.id;
        
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.title}</h4>
                <p class="cart-item-collection">${item.collection}</p>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn decrease">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn increase">+</button>
            </div>
            <button class="remove-item">Remove</button>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    // Update summary
    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    cartTotal.textContent = `$${subtotal.toFixed(2)}`;
    cartSummary.style.display = 'block';
    
    // Add event listeners to cart item buttons
    addCartItemEventListeners();
}

// Add event listeners to cart item buttons
function addCartItemEventListeners() {
    // Decrease quantity buttons
    document.querySelectorAll('.decrease').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.closest('.cart-item').dataset.id);
            updateCartItemQuantity(productId, -1);
        });
    });
    
    // Increase quantity buttons
    document.querySelectorAll('.increase').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.closest('.cart-item').dataset.id);
            updateCartItemQuantity(productId, 1);
        });
    });
    
    // Remove item buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.closest('.cart-item').dataset.id);
            removeCartItem(productId);
        });
    });
}

// Update cart item quantity
function updateCartItemQuantity(productId, change) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += change;
        
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        
        updateCart();
    }
}

// Remove cart item
function removeCartItem(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Filter products
filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Filter products
        const filter = this.dataset.filter;
        displayProducts(filter);
    });
});

// Toggle cart modal
cartIcon.addEventListener('click', function() {
    modalOverlay.classList.add('active');
    renderCartItems();
});

closeModal.addEventListener('click', function() {
    modalOverlay.classList.remove('active');
});

// Close modal when clicking outside
modalOverlay.addEventListener('click', function(e) {
    if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
    }
});

// Newsletter form submission
document.querySelector('.newsletter-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input').value;
    
    // In a real app, you would send this to your server
    alert(`Thanks for subscribing with ${email}! You'll receive collector updates soon.`);
    this.reset();
});

// Initialize the page
displayProducts();