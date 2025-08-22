// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const dashboard = document.getElementById('dashboard');
const heroSection = document.querySelector('.hero');

// Show Login Form
function showLogin() {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    heroSection.style.display = 'none';
    dashboard.style.display = 'none';
}

// Show Register Form
function showRegister() {
    registerForm.style.display = 'block';
    loginForm.style.display = 'none';
    heroSection.style.display = 'none';
    dashboard.style.display = 'none';
}

// Show Dashboard
function showDashboard() {
    dashboard.style.display = 'block';
    loginForm.style.display = 'none';
    registerForm.style.display = 'none';
    heroSection.style.display = 'none';
}

// Show Hero Section (Home)
function showHome() {
    heroSection.style.display = 'flex';
    loginForm.style.display = 'none';
    registerForm.style.display = 'none';
    dashboard.style.display = 'none';
}

// Login Function
function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (email && password) {
        // In a real app, you would validate credentials with a backend
        showDashboard();
    } else {
        alert('Please enter both email and password');
    }
}

// Register Function
function register() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    if (name && email && password) {
        // In a real app, you would send this data to a backend
        document.getElementById('userName').textContent = name;
        showDashboard();
    } else {
        alert('Please fill in all fields');
    }
}

// Logout Function
function logout() {
    showHome();
}

// Add Balance Function
function addBalance() {
    alert('This would open a modal to add funds in a real application');
}

// Initialize page to show home section
showHome();