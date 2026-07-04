// База данных с точными именами файлов из твоего репозитория GitHub
const mockProductsData = [
    { id: 1, title: "Minimal Classic Pants", price: 65.00, category: "men", image: "images/1.png.jfif" },
    { id: 2, title: "Technical Windbreaker", price: 130.00, category: "men", image: "images/2.png.jfif" },
    { id: 3, title: "Graphic Studio Tee", price: 40.00, category: "men", image: "images/3.png.webp" },
    { id: 4, title: "Oversized Gothic Hoodie", price: 80.00, category: "men", image: "images/4.png.webp" },
    { id: 5, title: "Baggy Ninja Pants", price: 95.00, category: "men", image: "images/5.png.webp" },
    { id: 6, title: "Vintage Wash Hoodie", price: 75.00, category: "women", image: "images/6.png.webp" },
    { id: 7, title: "Serenity Heavyweight Tee", price: 45.00, category: "women", image: "images/7.png.webp" },
    { id: 8, title: "Minimal Zip Bomber", price: 110.00, category: "men", image: "images/8.png.webp" },
    { id: 9, title: "Striped Knit Sweater", price: 70.00, category: "women", image: "images/9.png.webp" }
];

let products = [];
let cart = JSON.parse(localStorage.getItem('xiv_cart')) || [];
let currentCategory = 'all';

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

async function initApp() {
    products = await new Promise((resolve) => setTimeout(() => resolve(mockProductsData), 50));
    renderProducts(products);
    updateCartUI();
    setupOrderForm();
}

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
            <div class="col-sm-6 product-item-card" data-category="${product.category}" data-title="${product.title.toLowerCase()}">
                <div class="card showcase-card rounded-0">
                    <div class="showcase-img-holder">
                        <img src="${product.image}" alt="${product.title}" style="mix-blend-mode: multiply;">
                    </div>
                    <div class="card-body p-0 pt-3">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <h6 class="text-uppercase fw-bold m-0 small">${product.title}</h6>
                                <p class="fw-bold text-muted small mt-1">$${product.price.toFixed(2)}</p>
                            </div>
                            <button class="btn btn-sm btn-dark rounded-0 text-uppercase px-3" onclick="addToCart(${product.id}, '${product.title}', ${product.price})">+ Bag</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

window.addToCart = function(id, title, price) {
    const cartItem = cart.find(item => item.id === id);
    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ id, title, price, quantity: 1 });
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
        cartContainer.innerHTML = `<p class="text-center text-muted my-4">Your bag is empty.</p>`;
        totalContainer.innerText = "$0.00";
        return;
    }

    cart.forEach(item => {
        totalCost += item.price * item.quantity;
        cartContainer.innerHTML += `
            <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                <div>
                    <span class="small fw-bold text-uppercase d-block">${item.title}</span>
                    <span class="small text-muted">$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <button class="btn btn-dark p-1 px-2 py-0 fw-bold" onclick="changeQty(${item.id}, -1)">-</button>
                    <span class="small fw-bold">${item.quantity}</span>
                    <button class="btn btn-dark p-1 px-2 py-0 fw-bold" onclick="changeQty(${item.id}, 1)">+</button>
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

window.filterCategory = function(category) {
    currentCategory = category;
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    applyFilters();
};

window.searchProducts = function() {
    applyFilters();
};

function applyFilters() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const cards = document.querySelectorAll('.product-item-card');
    
    cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        const title = card.getAttribute('data-title');
        
        const matchesCategory = currentCategory === 'all' || cardCategory === currentCategory;
        const matchesSearch = title.includes(query);

        if (matchesCategory && matchesSearch) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function setupOrderForm() {
    const orderForm = document.getElementById('order-form');
    orderForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        alert(`Thank you for your order, ${document.getElementById('customer-name').value}!`);
        cart = [];
        syncCart();
        toggleCartModal();
        orderForm.reset();
    });
}
