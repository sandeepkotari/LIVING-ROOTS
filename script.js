// Background slideshow
const backgroundImages = [
    'url("images/background1.jpg")',
    'url("images/background2.jpg")',
    'url("images/background3.jpg")',
    'url("images/background4.jpg")',
    'url("images/background5.jpg")'
];

let currentImageIndex = 0;

function updateBackground() {
    const slides = document.querySelectorAll('.background-slide');
    slides.forEach((slide, index) => {
        if (index === currentImageIndex) {
            slide.style.opacity = '1';
        } else {
            slide.style.opacity = '0';
        }
    });
    currentImageIndex = (currentImageIndex + 1) % backgroundImages.length;
}

// Initialize background slideshow
document.addEventListener('DOMContentLoaded', function() {
    updateBackground();
    setInterval(updateBackground, 5000);

    // Check login status
    const isLoginPage = window.location.pathname.endsWith('index.html') || 
                       window.location.pathname.endsWith('register.html');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (!isLoginPage && !isLoggedIn) {
        window.location.href = 'index.html';
    }

    // Login form handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        
        // Password visibility toggle
        const togglePassword = document.querySelector('.toggle-password');
        const passwordInput = document.getElementById('password');
        
        if (togglePassword && passwordInput) {
            togglePassword.addEventListener('click', function() {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                this.classList.toggle('fa-eye');
                this.classList.toggle('fa-eye-slash');
            });
        }
    }

    // Register form handling
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
        
        // Password visibility toggle for both password fields
        const passwordFields = registerForm.querySelectorAll('input[type="password"]');
        const toggleButtons = registerForm.querySelectorAll('.toggle-password');
        
        toggleButtons.forEach((toggle, index) => {
            toggle.addEventListener('click', function() {
                const field = passwordFields[index];
                const type = field.getAttribute('type') === 'password' ? 'text' : 'password';
                field.setAttribute('type', type);
                this.classList.toggle('fa-eye');
                this.classList.toggle('fa-eye-slash');
            });
        });
        
        // Real-time password validation
        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            passwordInput.addEventListener('input', function() {
                validatePassword(this.value);
            });
        }
    }

    // Product display handling
    setupProductDisplay();

    // Payment page functionality
    if (window.location.pathname.endsWith('payment.html')) {
        setupPaymentPage();
    }
});

function setupProductDisplay() {
    // Set default preview images when page loads
    const previewImage = document.getElementById('previewImage');
    const petPreviewImage = document.getElementById('petPreviewImage');
    
    if (previewImage) {
        const defaultHumanModel = document.querySelector('.model-option:not(.pet-model)');
        if (defaultHumanModel) {
            updatePreview(defaultHumanModel);
            defaultHumanModel.classList.add('active');
        }
    }
    
    if (petPreviewImage) {
        const defaultPetModel = document.querySelector('.pet-model');
        if (defaultPetModel) {
            updatePetPreview(defaultPetModel);
            defaultPetModel.classList.add('active');
        }
    }

    // Model selection for human coffins
    const modelOptions = document.querySelectorAll('.model-option:not(.pet-model)');
    modelOptions.forEach(option => {
        option.addEventListener('click', function() {
            modelOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            updatePreview(this);
        });
    });

    // Model selection for pet coffins
    const petModelOptions = document.querySelectorAll('.pet-model');
    petModelOptions.forEach(option => {
        option.addEventListener('click', function() {
            petModelOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            updatePetPreview(this);
        });
    });

    // Coffin type selection handling
    const coffinTypeSelect = document.getElementById('coffin-type');
    if (coffinTypeSelect) {
        coffinTypeSelect.addEventListener('change', function() {
            const humanSection = document.querySelector('.product-section:not(.pets-section)');
            const petsSection = document.querySelector('.pets-section');
            
            if (this.value === 'human') {
                humanSection.style.display = 'block';
                petsSection.style.display = 'none';
                const activeHumanModel = document.querySelector('.model-option:not(.pet-model).active');
                if (activeHumanModel) {
                    updatePreview(activeHumanModel);
                }
            } else {
                humanSection.style.display = 'none';
                petsSection.style.display = 'block';
                const activePetModel = document.querySelector('.pet-model.active');
                if (activePetModel) {
                    updatePetPreview(activePetModel);
                }
            }
        });
        
        // Trigger change event to set initial state
        coffinTypeSelect.dispatchEvent(new Event('change'));
    }

    // Add event listeners to quantity inputs
    const quantityInputs = document.querySelectorAll('.quantity-input');
    quantityInputs.forEach(input => {
        input.addEventListener('change', updateOrderSummary);
        input.addEventListener('input', updateOrderSummary);
    });

    // Initialize order summary
    updateOrderSummary();
}

function updateOrderSummary() {
    const summaryDetails = document.querySelector('.summary-details');
    const totalElement = document.querySelector('.total-amount');
    const proceedBtn = document.getElementById('proceedToPayment');
    let total = 0;

    // Clear previous summary
    summaryDetails.innerHTML = '';

    // Human coffins
    const humanQuantities = document.querySelectorAll('.quantity-input:not(.pet-quantity)');
    humanQuantities.forEach(input => {
        const size = input.dataset.size;
        const quantity = parseInt(input.value) || 0;
        if (quantity > 0) {
            const price = parseInt(input.closest('.size-price-option').querySelector('.size-btn').dataset.price);
            const subtotal = price * quantity;
            total += subtotal;
            
            summaryDetails.innerHTML += `
                <div class="summary-row">
                    <span>${size} ft Human Coffin x ${quantity}</span>
                    <span>₹${subtotal}</span>
                </div>`;
        }
    });

    // Pet coffins
    const petQuantities = document.querySelectorAll('.quantity-input.pet-quantity');
    petQuantities.forEach(input => {
        const size = input.dataset.size;
        const quantity = parseInt(input.value) || 0;
        if (quantity > 0) {
            const price = parseInt(input.closest('.size-price-option').querySelector('.size-btn').dataset.price);
            const subtotal = price * quantity;
            total += subtotal;
            
            summaryDetails.innerHTML += `
                <div class="summary-row">
                    <span>${size} ft Pet Coffin x ${quantity}</span>
                    <span>₹${subtotal}</span>
                </div>`;
        }
    });

    // Update total
    if (total > 0) {
        summaryDetails.innerHTML += `
            <div class="summary-row total">
                <span>Total</span>
                <span>₹${total}</span>
            </div>`;
        if (proceedBtn) {
            proceedBtn.style.display = 'block';
            proceedBtn.onclick = () => {
                // Save order summary to localStorage
                localStorage.setItem('orderSummaryHtml', summaryDetails.innerHTML);
                window.location.href = 'payment.html';
            };
        }
    } else {
        summaryDetails.innerHTML = '<div class="summary-row"><span>No items selected</span></div>';
        if (proceedBtn) {
            proceedBtn.style.display = 'none';
        }
    }
}

function updatePreview(selectedModel) {
    const previewImage = document.getElementById('previewImage');
    if (previewImage && selectedModel) {
        const imgSrc = selectedModel.querySelector('img').src;
        previewImage.src = imgSrc;
        previewImage.style.display = 'block';
        previewImage.style.transform = 'scale(1)';
    }
}

function updatePetPreview(selectedModel) {
    const petPreviewImage = document.getElementById('petPreviewImage');
    if (petPreviewImage && selectedModel) {
        const imgSrc = selectedModel.querySelector('img').src;
        petPreviewImage.src = imgSrc;
        petPreviewImage.style.display = 'block';
        petPreviewImage.style.transform = 'scale(1)';
    }
}

function getPrice(size) {
    const prices = {
        '5 feet': 2500,
        '6 feet': 3000,
        '7 feet': 3500,
        'pet-5 feet': 2000
    };
    return prices[size] || 0;
}

function setupQRScanner() {
    const scannerContainer = document.querySelector('.scanner-container');
    if (!scannerContainer) return;

    // Create scanner overlay
    const overlay = document.createElement('div');
    overlay.className = 'scanner-overlay';
    
    // Create scanning line animation
    const scanLine = document.createElement('div');
    scanLine.className = 'scanner-line';
    
    overlay.appendChild(scanLine);
    scannerContainer.appendChild(overlay);

    // Initialize QR scanner
    const scanner = new QRScanner({
        onScan: function(result) {
            if (result) {
                handlePaymentQR(result);
            }
        },
        onError: function(error) {
            console.error('Scanner error:', error);
            showNotification('Scanner error. Please try again.', 'error');
        }
    });

    // Start scanner
    scanner.start();
}

function handlePaymentQR(qrData) {
    try {
        const paymentData = JSON.parse(qrData);
        if (paymentData && paymentData.upi) {
            // Process UPI payment
            window.location.href = paymentData.upi;
        } else {
            showNotification('Invalid QR code format', 'error');
        }
    } catch (error) {
        console.error('QR processing error:', error);
        showNotification('Error processing QR code', 'error');
    }
}

function validatePassword(password) {
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*]/.test(password)
    };
    
    let strength = 0;
    Object.values(requirements).forEach(met => {
        if (met) strength++;
    });
    
    const strengthBar = document.querySelector('.password-strength-bar');
    if (strengthBar) {
        strengthBar.className = 'password-strength-bar';
        if (strength < 3) {
            strengthBar.classList.add('weak');
        } else if (strength < 5) {
            strengthBar.classList.add('medium');
        } else {
            strengthBar.classList.add('strong');
        }
    }
    
    return strength >= 3; // Require at least 3 criteria to be met
}

function showInputError(input, message) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.add('error');
    
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    
    formGroup.appendChild(errorMessage);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    console.log('Showing notification:', message, type);
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Trigger reflow
    notification.offsetHeight;
    
    // Add show class for animation
    notification.classList.add('show');
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Authentication functions
async function handleLogin(event) {
    event.preventDefault();
    console.log('Login attempt started');
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    console.log('Email:', email);
    console.log('Password length:', password.length);
    
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    try {
        console.log('Sending login request to server...');
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        console.log('Server response status:', response.status);
        const data = await response.json();
        console.log('Server response data:', data);
        
        if (response.ok) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            showNotification('Login successful!', 'success');
            setTimeout(() => {
                window.location.href = 'selection.html';
            }, 1000);
        } else {
            showNotification(data.message || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('An error occurred during login. Please try again.', 'error');
    }
}

async function handleRegister(event) {
    event.preventDefault();
    
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    // Clear previous errors
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
        const errorMessage = group.querySelector('.error-message');
        if (errorMessage) errorMessage.remove();
    });
    
    // Validation
    let hasError = false;
    
    if (!name) {
        showInputError(nameInput, 'Name is required');
        hasError = true;
    }
    
    if (!email) {
        showInputError(emailInput, 'Email is required');
        hasError = true;
    } else if (!isValidEmail(email)) {
        showInputError(emailInput, 'Please enter a valid email address');
        hasError = true;
    }
    
    if (!password) {
        showInputError(passwordInput, 'Password is required');
        hasError = true;
    }
    
    if (password !== confirmPassword) {
        showInputError(confirmPasswordInput, 'Passwords do not match');
        hasError = true;
    }
    
    if (hasError) return;
    
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification('Registration successful! Redirecting to login...', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            showNotification(data.message || 'Registration failed', 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showNotification('An error occurred during registration', 'error');
    }
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    window.location.href = 'index.html';
}

function setupPaymentPage() {
    // Load order summary from localStorage
    const orderSummary = document.getElementById('paymentOrderSummary');
    if (orderSummary) {
        const summaryHtml = localStorage.getItem('orderSummaryHtml');
        if (summaryHtml) {
            orderSummary.innerHTML = summaryHtml;
        } else {
            window.location.href = 'selection.html';
        }
    }

    // Payment method tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    const paymentForms = document.querySelectorAll('.payment-form');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            
            // Update active states
            tabButtons.forEach(btn => btn.classList.remove('active'));
            paymentForms.forEach(form => form.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(targetTab + 'Form').classList.add('active');
        });
    });

    // Card number formatting
    const cardNumber = document.getElementById('cardNumber');
    if (cardNumber) {
        cardNumber.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            let formattedValue = '';
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) {
                    formattedValue += ' ';
                }
                formattedValue += value[i];
            }
            e.target.value = formattedValue;
        });
    }

    // Expiry date formatting
    const expiryDate = document.getElementById('expiryDate');
    if (expiryDate) {
        expiryDate.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 2) {
                value = value.substr(0, 2) + '/' + value.substr(2);
            }
            e.target.value = value;
        });
    }

    // Handle form submissions
    setupPaymentFormHandlers();
}

function setupPaymentFormHandlers() {
    const forms = {
        upi: document.getElementById('upiForm'),
        card: document.getElementById('cardForm'),
        netbanking: document.getElementById('netbankingForm')
    };

    Object.entries(forms).forEach(([method, form]) => {
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await handlePayment(method, form);
            });
        }
    });
}

async function handlePayment(method, form) {
    showLoadingModal();
    
    try {
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Get form data
        const formData = new FormData(form);
        const paymentData = {
            method,
            amount: calculateTotal(),
            timestamp: new Date().toISOString(),
            details: Object.fromEntries(formData.entries())
        };

        // Save payment to server
        const response = await fetch('/api/payments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentData)
        });

        if (response.ok) {
            showPaymentModal('success', 'Payment successful! Redirecting to order confirmation...');
            // Clear order data
            localStorage.removeItem('orderSummaryHtml');
            // Redirect after 2 seconds
            setTimeout(() => {
                window.location.href = 'selection.html';
            }, 2000);
        } else {
            throw new Error('Payment failed');
        }
    } catch (error) {
        console.error('Payment error:', error);
        showPaymentModal('error', 'Payment failed. Please try again.');
    }
}

function showLoadingModal() {
    const modal = document.createElement('div');
    modal.className = 'payment-modal show';
    modal.innerHTML = `
        <i class="fas fa-spinner fa-spin"></i>
        <h3>Processing Payment...</h3>
        <p>Please do not refresh the page.</p>
    `;
    
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay show';
    
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
}

function showPaymentModal(type, message) {
    // Remove loading modal if exists
    const existingModal = document.querySelector('.payment-modal');
    const existingOverlay = document.querySelector('.modal-overlay');
    if (existingModal) existingModal.remove();
    if (existingOverlay) existingOverlay.remove();
    
    const modal = document.createElement('div');
    modal.className = `payment-modal ${type} show`;
    modal.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <h3>${type === 'success' ? 'Success!' : 'Error'}</h3>
        <p>${message}</p>
    `;
    
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay show';
    
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
}

function calculateTotal() {
    const totalElement = document.querySelector('.summary-row.total span:last-child');
    if (totalElement) {
        return parseInt(totalElement.textContent.replace(/[^0-9]/g, ''));
    }
    return 0;
}
