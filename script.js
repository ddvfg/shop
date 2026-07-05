
// 1. DATABASE (21 ITEMS WITH LOCAL IMAGES)

const mockProductsData = [
    // --- MEN'S COLLECTION ---
    { id: 1, title: "Classic Streetwear Pants", price: 65.00, category: "men", tags: ["home"], image: "images/1.png.png" },
    { id: 2, title: "Technical Cobalt Windbreaker", price: 130.00, category: "men", tags: ["home", "new"], image: "images/2.png.png" },
    { id: 3, title: "Graphic Studio Double Tee", price: 45.00, category: "men", tags: ["home"], image: "images/3.png.png" },
    { id: 4, title: "Gothic Print Black Hoodie", price: 80.00, category: "men", tags: ["home"], image: "images/4.png.png" },
    { id: 5, title: "Baggy Ninja Cargo Pants", price: 95.00, category: "men", tags: ["home"], image: "images/5.png.png" },
    { id: 6, title: "Acid Wash Distress Hoodie", price: 75.00, category: "men", tags: ["home", "new"], image: "images/6.png.png" },
    { id: 7, title: "Serenity Heavyweight Tee", price: 40.00, category: "men", tags: ["home"], image: "images/7.png.png" },
    { id: 8, title: "Minimalist Fleece Bomber", price: 110.00, category: "men", tags: ["home"], image: "images/8.png.png" },
    { id: 9, title: "Striped Grunge Knit Sweater", price: 70.00, category: "men", tags: ["home"], image: "images/9.png.png" },
    { id: 11, title: "Essential Oversized Black Tee", price: 35.00, category: "men", tags: ["home"], image: "images/11.png.png" },
    
   
    { id: 12, title: "Sport Full Tracksuit Set", price: 120.00, category: "men", tags: ["collections", "new"], image: "images/12.png.png" },
    { id: 14, title: "Pikachu Tee & Shorts Set", price: 45.00, category: "kids", tags: ["collections"], image: "images/14.png.png" },

    // --- WOMEN'S COLLECTION ---
    { id: 10, title: "Heart Graphic Crop Longsleeve", price: 38.00, category: "women", tags: ["home", "new"], image: "images/10.png.png" },
    { id: 13, title: "Cozy Hearts Knit Sweater", price: 68.00, category: "women", tags: ["home"], image: "images/13.png.png" },
    { id: 15, title: "Casual Denim Mini Dress", price: 55.00, category: "women", tags: ["home"], image: "images/15.png.png" },
    { id: 16, title: "Slim Fit V-Neck Tee", price: 30.00, category: "women", tags: ["home"], image: "images/16.png.png" },
    { id: 20, title: "Vintage Cat Print Tee", price: 42.00, category: "women", tags: ["home", "new"], image: "images/20.png.png" },
    { id: 21, title: "Fairycore Flare Sleeve Blouse", price: 48.00, category: "women", tags: ["home"], image: "images/21.png.png" },

    // --- KIDS COLLECTION ---
    { id: 17, title: "Puppy Graphic Fleece Sweatshirt", price: 35.00, category: "kids", tags: ["home"], image: "images/17.png.png" },
    { id: 18, title: "Spider-Man Hero Puffer Jacket", price: 85.00, category: "kids", tags: ["home", "new"], image: "images/18.png.png" },
    { id: 19, title: "Kids Classic Denim Overalls", price: 50.00, category: "kids", tags: ["home"], image: "images/19.png.png" }
];


let products = [];
let cart = JSON.parse(localStorage.getItem('xiv_cart')) || [];
let currentCategory = 'all';
let currentSection = 'home';


// 2. APP INITIALIZATION & NAVIGATION

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

async function initApp() {
    products = await new Promise((resolve) => setTimeout(() => resolve(mockProductsData), 50));
    renderProducts(getFilteredSectionItems());
    updateCartUI();
    setupOrderForm();
}

function getFilteredSectionItems() {
    return products.filter(p => p.tags.includes(currentSection));
}

window.changeSection = function(section, clickedButton) {
    currentSection = section;
    
    const navLinks = document.querySelectorAll('.nav-left-group .nav-link-main');
    navLinks.forEach(link => {
        link.classList.add('text-muted');
        link.classList.remove('active');
    });
    
    if (clickedButton) {
        clickedButton.classList.remove('text-muted');
        clickedButton.classList.add('active');
    }

    const mainTitle = document.getElementById('page-main-title');
    const subTitle = document.getElementById('page-sub-title');
    
    if (mainTitle && subTitle) {
        if (section === 'home') {
            mainTitle.innerHTML = 'New<br>Collection';
            subTitle.innerText = 'Summer 2026';
        } else if (section === 'collections') {
            mainTitle.innerHTML = 'Our<br>Suits & Sets';
            subTitle.innerText = 'Match Your Style';
        } else if (section === 'new') {
            mainTitle.innerHTML = 'Fresh<br>Arrivals';
            subTitle.innerText = 'Just Dropped';
        }
    }

    currentCategory = 'all';
    const catButtons = document.querySelectorAll('.filter-btn');
    catButtons.forEach(btn => btn.classList.remove('active'));
    
    const allBtn = document.querySelector(".filter-btn[onclick*='all']");
    if (allBtn) allBtn.classList.add('active');
    
    const searchInp = document.getElementById('search-input');
    if (searchInp) searchInp.value = '';

    renderProducts(getFilteredSectionItems());
};

// 3. PRODUCT RENDERING ENGINE

function renderProducts(items) {
    const container = document.getElementById('products-container');
    if (!container) return;
    container.innerHTML = '';

    if (items.length === 0) {
        container.innerHTML = `<div class="w-100 text-center text-muted py-5 fw-bold text-uppercase">No items found matching your criteria.</div>`;
        return;
    }

    items.forEach(product => {
        container.innerHTML += `
            <div class="col-sm-6 product-item-card fade-in-card" data-category="${product.category}" data-title="${product.title.toLowerCase()}">
                <div class="card showcase-card rounded-0">
                    <div class="showcase-img-holder">
                        <img src="${product.image}" alt="${product.title}">
                    </div>
                    <div class="card-body p-0 pt-3">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <h6 class="text-uppercase fw-bold m-0 small">${product.title}</h6>
                                <p class="fw-bold text-muted small mt-1">$${product.price.toFixed(2)}</p>
                            </div>
                            <button class="btn btn-sm btn-cart-add rounded-0 text-uppercase px-3" onclick="addToCart(${product.id}, '${product.title}', ${product.price}, '${product.image}')">+ Bag</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    initScrollAnimation();
}

function initScrollAnimation() {
    const cards = document.querySelectorAll('.fade-in-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.05
    });

    cards.forEach(card => observer.observe(card));
}


// 4. CART & LOCALSTORAGE SYSTEM

window.addToCart = function(id, title, price, image) {
    const cartItem = cart.find(item => item.id === id);
    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ id, title, price, image, quantity: 1 });
    }
    
    const badge = document.getElementById('cart-badge');
    if (badge) {
        badge.classList.remove('pop-animation');
        void badge.offsetWidth; 
        badge.classList.add('pop-animation');
    }

    syncCart();
};

function syncCart() {
    localStorage.setItem('xiv_cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const badge = document.getElementById('cart-badge');
    const cartContainer = document.getElementById('cart-items');
    const totalContainer = document.getElementById('cart-total');
    
    if (!badge || !cartContainer || !totalContainer) return;

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.innerText = totalItems;

    let totalCost = 0;
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = `<p class="text-center text-muted my-5 fw-semibold tracking-wider text-uppercase small">Your bag is empty.</p>`;
        totalContainer.innerText = "$0.00";
        return;
    }

    cart.forEach(item => {
        totalCost += item.price * item.quantity;
        cartContainer.innerHTML += `
            <div class="cart-item-row">
                <div class="d-flex align-items-center gap-3">
                    <div class="cart-item-image-holder">
                        <img src="${item.image}" alt="${item.title}">
                    </div>
                    <div>
                        <span class="small fw-bold text-uppercase d-block tracking-wider" style="max-width: 180px; line-height: 1.2;">${item.title}</span>
                        <span class="small text-muted fw-bold">$${item.price.toFixed(2)}</span>
                    </div>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <button class="btn cart-qty-btn rounded-0" onclick="changeQty(${item.id}, -1)">-</button>
                    <span class="small fw-bold px-1">${item.quantity}</span>
                    <button class="btn cart-qty-btn rounded-0" onclick="changeQty(${item.id}, 1)">+</button>
                </div>
            </div>
        `;
    });

    totalContainer.innerText = `$${totalCost.toFixed(2)}`;
}

window.changeQty = function(id, change) {
    const item = cart.find(p => p.id === id);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
        cart = cart.filter(p => p.id !== id);
    }
    syncCart();
};

window.toggleCartModal = function() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.style.display = modal.style.display === 'none' ? 'flex' : 'none';
    }
};

window.closeCartOnOverlay = function(event) {
    if(event.target.id === 'cartModal') {
        toggleCartModal();
    }
};


// 5. SEARCH & FILTER ENGINES

window.filterCategory = function(category) {
    currentCategory = category;
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    applyFilters();
};

window.searchProducts = function() {
    applyFilters();
};

function applyFilters() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const cards = document.querySelectorAll('.product-item-card');
    let visibleCount = 0;
    
    const allowedItems = getFilteredSectionItems();

    cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        const title = card.getAttribute('data-title');
        
        const itemObj = products.find(p => p.title.toLowerCase() === title);
        
        if (!itemObj) {
            card.style.display = 'none';
            return;
        }

        const isInSection = allowedItems.some(p => p.id === itemObj.id);
        const matchesCategory = currentCategory === 'all' || cardCategory === currentCategory;
        const matchesSearch = title.includes(query);

        if (isInSection && matchesCategory && matchesSearch) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    const container = document.getElementById('products-container');
    const existingMsg = document.getElementById('no-items-msg');
    if (existingMsg) existingMsg.remove();

    if (visibleCount === 0 && container) {
        const msg = document.createElement('div');
        msg.id = 'no-items-msg';
        msg.className = 'w-100 text-center text-muted py-5 fw-bold text-uppercase';
        msg.innerText = 'No items found matching your criteria.';
        container.appendChild(msg);
    }

    initScrollAnimation();
}


// 6. ORDER FORM VALIDATION & CHECKOUT

function setupOrderForm() {
    const orderForm = document.getElementById('order-form');
    orderForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('customer-name').value;
        const phone = document.getElementById('customer-phone').value;
        const address = document.getElementById('customer-address').value;
        
        alert(`Success!\n\nThank you for your order, ${name}!\nWe will send a confirmation message to ${phone}.\nDelivery Address: ${address}`);
        
        cart = [];
        syncCart();
        toggleCartModal();
        orderForm.reset();
    });
}
