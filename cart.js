document.addEventListener('DOMContentLoaded', function() {
    // For demo purposes, let's add functionality to the "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.product-card button');
    const cartCount = document.querySelector('.cart-count');
    const cartEmptyMessage = document.querySelector('.cart-empty-message');
    const cartItemContainer = document.querySelector('.cart-item-container');
    const checkoutButton = document.querySelector('.checkout-button');
    const subtotalElement = document.querySelector('.subtotal');
    const shippingElement = document.querySelector('.shipping');
    const taxElement = document.querySelector('.tax');
    const totalElement = document.querySelector('.total-price');
    
    // Initialize cart
    let cartItems = [];
    
    // Load cart from localStorage if available
    if (localStorage.getItem('cartItems')) {
        cartItems = JSON.parse(localStorage.getItem('cartItems'));
        updateCartDisplay();
    }
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productCard = button.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = parseFloat(productCard.querySelector('p').textContent.replace('$', ''));
            
            // Add item to cart
            cartItems.push({
                name: productName,
                price: productPrice,
                quantity: 1
            });
            
            // Save to localStorage
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            
            // Update cart display
            updateCartDisplay();
            
            // Animation for button
            button.textContent = 'Added!';
            button.style.backgroundColor = '#4CAF50';
            
            setTimeout(() => {
                button.textContent = 'Add to Cart';
                button.style.backgroundColor = '';
            }, 1500);
        });
    });
    
    function updateCartDisplay() {
        // Update cart count
        cartCount.textContent = cartItems.length;
        
        // Show/hide empty cart message
        if (cartItems.length === 0) {
            cartEmptyMessage.style.display = 'block';
            cartItemContainer.style.display = 'none';
            checkoutButton.disabled = true;
        } else {
            cartEmptyMessage.style.display = 'none';
            cartItemContainer.style.display = 'block';
            checkoutButton.disabled = false;
            
            // Clear existing items
            cartItemContainer.innerHTML = '';
            
            // Add each item to the cart
            cartItems.forEach((item, index) => {
                const cartItemElement = document.createElement('div');
                cartItemElement.classList.add('cart-item');
                cartItemElement.innerHTML = `
                    <div class="cart-item-image"></div>
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn minus" data-index="${index}">-</button>
                            <input type="number" value="${item.quantity}" min="1" max="10" data-index="${index}">
                            <button class="quantity-btn plus" data-index="${index}">+</button>
                        </div>
                    </div>
                    <button class="remove-item" data-index="${index}">×</button>
                `;
                cartItemContainer.appendChild(cartItemElement);
            });
            
            // Add event listeners to new elements
            addCartItemEventListeners();
        }
        
        // Update order summary
        updateOrderSummary();
    }
    
    function addCartItemEventListeners() {
        // Quantity buttons
        document.querySelectorAll('.quantity-btn.minus').forEach(button => {
            button.addEventListener('click', () => {
                const index = button.getAttribute('data-index');
                if (cartItems[index].quantity > 1) {
                    cartItems[index].quantity--;
                    updateCartDisplay();
                }
            });
        });
        
        document.querySelectorAll('.quantity-btn.plus').forEach(button => {
            button.addEventListener('click', () => {
                const index = button.getAttribute('data-index');
                if (cartItems[index].quantity < 10) {
                    cartItems[index].quantity++;
                    updateCartDisplay();
                }
            });
        });
        
        // Quantity input
        document.querySelectorAll('.cart-item-quantity input').forEach(input => {
            input.addEventListener('change', () => {
                const index = input.getAttribute('data-index');
                const value = parseInt(input.value);
                if (value >= 1 && value <= 10) {
                    cartItems[index].quantity = value;
                } else if (value < 1) {
                    cartItems[index].quantity = 1;
                    input.value = 1;
                } else {
                    cartItems[index].quantity = 10;
                    input.value = 10;
                }
                updateOrderSummary();
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
            });
        });
        
        // Remove buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', () => {
                const index = button.getAttribute('data-index');
                cartItems.splice(index, 1);
                updateCartDisplay();
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
            });
        });
    }
    
    function updateOrderSummary() {
        // Calculate subtotal
        const subtotal = cartItems.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
        
        // Calculate shipping (free over $50)
        const shipping = subtotal > 50 ? 0 : 5.99;
        
        // Calculate tax (8%)
        const tax = subtotal * 0.08;
        
        // Calculate total
        const total = subtotal + shipping + tax;
        
        // Update display
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        shippingElement.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
        taxElement.textContent = `$${tax.toFixed(2)}`;
        totalElement.textContent = `$${total.toFixed(2)}`;
        
        // Save to localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
    
    // Checkout button
    checkoutButton.addEventListener('click', () => {
        alert('Checkout functionality would be implemented here in a real application.');
    });
});