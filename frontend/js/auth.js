const API_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});

function checkAuth() {
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

// Login
let loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;
        let msgDiv = document.getElementById('message');
        
        try {
            let res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            let data = await res.json();
            
            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                alert('Login successful! ');
                window.location.href = 'index.html';
            } else {
                if (msgDiv) msgDiv.innerText = data.message || 'Login failed';
            }
        } catch (err) {
            if (msgDiv) msgDiv.innerText = 'Network error. Make sure backend is running.';
        }
    });
}

// Register
let registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        let name = document.getElementById('name').value;
        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;
        let msgDiv = document.getElementById('message');
        
        try {
            let res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            let data = await res.json();
            
            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                alert('Registration successful! ');
                window.location.href = 'index.html';
            } else {
                if (msgDiv) msgDiv.innerText = data.message || 'Registration failed';
            }
        } catch (err) {
            if (msgDiv) msgDiv.innerText = 'Network error. Make sure backend is running.';
        }
    });
}

function logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}