let allProducts = [];
let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    updateCartCount();
    updateWishlistCount();
    checkAuthStatus();
});

async function loadProducts() {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    container.innerHTML = '<div style="text-align:center; padding:50px;">Loading products...</div>';
    
    try {
        const res = await fetch('http://localhost:5000/api/products');
        allProducts = await res.json();
        displayProducts(allProducts);
    } catch (err) {
        container.innerHTML = '<div style="text-align:center; padding:50px; color:red;">Error loading products. Make sure backend is running on port 5000</div>';
    }
}

function displayProducts(products) {
    const container = document.getElementById('productsContainer');
    if (!products || products.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:50px;">No products found</div>';
        return;
    }
    
    container.innerHTML = products.map(p => `
        <div class="product-card">
            <img src="${p.image}" onerror="this.src='https://placehold.co/300x220/e9ecef/495057?text=Product'">
            <h3>${p.name}</h3>
            <div class="price">$${p.price}</div>
            
            <div class="product-buttons">
                <button class="cart-btn" onclick="addToCart('${p._id}','${p.name}',${p.price},'${p.image}')">🛒 Add to Cart</button>
                <button class="wishlist-btn" onclick="addToWishlist('${p._id}','${p.name}',${p.price},'${p.image}')">❤️ Wishlist</button>
            </div>
        </div>
    `).join('');
}

function addToCart(id, name, price, image) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    let existing = cart.find(item => item.productId === id);
    
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ productId: id, name, price, image, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showToast(`${name} added to cart!`);
}

function addToWishlist(id, name, price, image) {
    if (!wishlist.find(item => item.productId === id)) {
        wishlist.push({ productId: id, name, price, image });
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistCount();
        showToast(`${name} added to wishlist!`);
    } else {
        showToast(`${name} already in wishlist`);
    }
}

function showWishlist() {
    const modal = document.getElementById('wishlistModal');
    const itemsDiv = document.getElementById('wishlistItems');
    
    if (!modal) return;
    
    if (wishlist.length === 0) {
        itemsDiv.innerHTML = '<p style="text-align:center; padding:20px;">Your wishlist is empty 😔</p>';
    } else {
        itemsDiv.innerHTML = wishlist.map((item, index) => `
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px; padding:10px; border-bottom:1px solid #eee">
                <img src="${item.image}" width="50" height="50" style="object-fit:cover; border-radius:8px">
                <div style="flex:1">
                    <strong>${item.name}</strong><br>
                    <span style="color:#ff6b35">$${item.price}</span>
                </div>
                <button onclick="addToCart('${item.productId}','${item.name}',${item.price},'${item.image}')" style="background:#ff6b35; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">Add</button>
                <button onclick="removeFromWishlist('${item.productId}')" style="background:#dc3545; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">X</button>
            </div>
        `).join('');
    }
    
    modal.style.display = 'block';
}

function removeFromWishlist(id) {
    wishlist = wishlist.filter(item => item.productId !== id);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
    showWishlist();
}

function closeWishlist() {
    const modal = document.getElementById('wishlistModal');
    if (modal) modal.style.display = 'none';
}

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    let total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    document.querySelectorAll('#cartCount').forEach(el => el.textContent = total);
}

function updateWishlistCount() {
    document.querySelectorAll('#wishlistCount').forEach(el => el.textContent = wishlist.length);
}

function searchProducts() {
    let term = document.getElementById('searchInput').value.toLowerCase();
    let filtered = allProducts.filter(p => p.name.toLowerCase().includes(term));
    displayProducts(filtered);
}

function filterByCategory(cat) {
    let filtered = allProducts.filter(p => p.category === cat);
    displayProducts(filtered);
}

function showToast(message) {
    let toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 12px 20px;
        border-radius: 30px;
        z-index: 9999;
        font-size: 14px;
        animation: fadeInOut 2s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

function shopNow() {
    window.location.href = 'index.html';
}

function logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

function checkAuthStatus() {
    let token = localStorage.getItem('token');
    let user = JSON.parse(localStorage.getItem('user') || '{}');
    let authSection = document.getElementById('authSection');
    let userSection = document.getElementById('userSection');
    let userNameDisplay = document.getElementById('userNameDisplay');
    
    if (token && user.name) {
        if (authSection) authSection.style.display = 'none';
        if (userSection) userSection.style.display = 'flex';
        if (userNameDisplay) userNameDisplay.textContent = `Hi, ${user.name.split(' ')[0]}`;
    } else {
        if (authSection) authSection.style.display = 'flex';
        if (userSection) userSection.style.display = 'none';
    }
}