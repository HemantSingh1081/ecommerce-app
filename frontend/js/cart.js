document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    updateCartCount();
});

function loadCart() {
    let container = document.getElementById('cartContent');
    if (!container) return;
    
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <h3>Your cart is empty</h3>
                <a href="index.html">Continue Shopping →</a>
            </div>
        `;
        return;
    }
    
    let total = 0;
    let html = `<div class="cart-items">`;
    
    cart.forEach((item, index) => {
        let itemTotal = item.price * item.quantity;
        total += itemTotal;
        html += `
            <div class="cart-item">
                <img src="${item.image}" onerror="this.src='https://placehold.co/80x80'">
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <div class="cart-item-price">$${item.price}</div>
                </div>
                <div class="cart-item-quantity">
                    <input type="number" min="1" value="${item.quantity}" onchange="updateQuantity(${index}, this.value)">
                </div>
                <button class="remove-item" onclick="removeItem(${index})">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
    });
    
    html += `</div>`;
    html += `
        <div class="cart-summary">
            <h3>Order Summary</h3>
            <div class="summary-row">
                <span>Subtotal</span>
                <span>$${total.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Shipping</span>
                <span>Free</span>
            </div>
            <div class="summary-row summary-total">
                <span>Total</span>
                <span>$${total.toFixed(2)}</span>
            </div>
            <button class="checkout-btn" onclick="checkout()">Proceed to Checkout</button>
        </div>
    `;
    
    container.innerHTML = html;
}

function updateQuantity(index, newQty) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    let qty = parseInt(newQty);
    
    if (qty <= 0) {
        cart.splice(index, 1);
    } else {
        cart[index].quantity = qty;
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    updateCartCount();
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    updateCartCount();
}

async function checkout() {
    let token = localStorage.getItem('token');
    
    if (!token) {
        alert('Please login first');
        window.location.href = 'login.html';
        return;
    }
    
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }
    
    let total = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    
    try {
        let res = await fetch('http://localhost:5000/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ items: cart, totalAmount: total })
        });
        
        if (res.ok) {
            alert('Order placed successfully!');
            localStorage.removeItem('cart');
            loadCart();
            updateCartCount();
        } else {
            let data = await res.json();
            alert('Order failed: ' + (data.message || 'Please try again'));
        }
    } catch (err) {
        alert('Network error. Please try again.');
    }
}

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    let total = cart.reduce((sum, i) => sum + (i.quantity || 1), 0);
    document.querySelectorAll('#cartCount').forEach(el => el.textContent = total);
}