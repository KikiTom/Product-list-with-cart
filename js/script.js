let cart = [];

// Function to update cart display
function updateCartDisplay() {
    const cartContainer = document.querySelector('.cart-items');
    const cartEmptyMessage = document.querySelector('.cart-empty');
    const cartSummary = document.querySelector('.cart-summary');
    const infoCart = document.querySelector('#info-cart');

    // Clear existing items in the cart
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartEmptyMessage.style.display = 'block';
        cartSummary.style.display = 'none';
        cartContainer.style.display = 'none';
        infoCart.textContent = '(0)';
    } else {
        cartEmptyMessage.style.display = 'none';
        cartContainer.style.display = 'block';
        cartSummary.style.display = 'block';

        let total = 0;
        let totalItems = 0;

        // Display cart items
        cart.forEach((item) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            totalItems += item.quantity;

            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <p class="cart-item-name">${item.name}</p>
                    <div class="cart-item-details">
                        <span class="cart-item-qty">${item.quantity}x</span>
                        <span class="cart-item-unit-price">@ $${item.price.toFixed(2)}</span>
                        <span class="cart-item-total-price">$${itemTotal.toFixed(2)}</span>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart('${item.name}')">
                    <img src="Assets/images/icon-remove-item.svg" alt="Remove">
                </button>
            `;
            cartContainer.appendChild(cartItem);
        });

        // Update total
        document.querySelector('.cart-summary h3').innerText = `$${total.toFixed(2)}`;
        infoCart.textContent = `(${totalItems})`;
    }
}

// Global function to remove item from cart
function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    updateCartDisplay();
    // Also reset the corresponding product card button state
    resetProductButton(productName);
}

// Helper to reset product card button to "Add to Cart" state
function resetProductButton(productName) {
    const dessertBoxes = document.querySelectorAll('.dessert-box');
    dessertBoxes.forEach(box => {
        const dessertType = box.querySelector('.dessert-type');
        if (dessertType && dessertType.textContent === productName) {
            const addBtn = box.querySelector('.add-to-cart-btn');
            const qtyBtn = box.querySelector('.add-to-quantity-btn');
            if (addBtn && qtyBtn) {
                addBtn.style.display = 'flex';
                qtyBtn.style.display = 'none';
                qtyBtn.querySelector('.label').textContent = '1';
            }
        }
    });
}

// Fetch the product data from data.json
fetch('./data.json')
    .then(response => response.json())
    .then(data => {
        const dessertContainer = document.getElementById('dessert-container');
        let productsDisplayed = 0;
        const productsPerLoad = 6;

        // Function to create a product card
        const createProductCard = (product) => {
            const dessertBox = document.createElement('div');
            dessertBox.classList.add('dessert-box');

            dessertBox.innerHTML = `
            <div id="img-btn">
                <img src="${product.image.desktop}" alt="${product.name}">
                <button class="add-to-cart-btn"> 
                    <img src="Assets/images/icon-add-to-cart.svg" alt=""> 
                    <span class="label">Add to Cart</span>
                </button>
                <button class="add-to-quantity-btn">
                    <box-icon name='minus-circle' id="quantity-btn"></box-icon>
                    <span class="label">1</span>
                    <box-icon name='plus-circle' id="quantity-btn"></box-icon>   
                </button>
            </div>

            <div id="Description-product">
                <p class="dessert-name">${product.category}</p>
                <h3 class="dessert-type">${product.name}</h3>
                <h3 class="price">$${product.price.toFixed(2)}</h3>
            </div>
            `;

            // Add event listener to the "Add to Cart" button
            const addToCartBtn = dessertBox.querySelector('.add-to-cart-btn');
            addToCartBtn.addEventListener('click', () => addToCart(product, dessertBox));

            // Quantity controls
            const minusBtn = dessertBox.querySelector('box-icon[name="minus-circle"]');
            const plusBtn = dessertBox.querySelector('box-icon[name="plus-circle"]');
            const qtyLabel = dessertBox.querySelector('.add-to-quantity-btn .label');

            minusBtn.addEventListener('click', () => {
                const cartItem = cart.find(item => item.name === product.name);
                if (cartItem) {
                    if (cartItem.quantity > 1) {
                        cartItem.quantity -= 1;
                        qtyLabel.textContent = cartItem.quantity;
                    } else {
                        // Remove from cart
                        cart = cart.filter(item => item.name !== product.name);
                        // Reset button state
                        addToCartBtn.style.display = 'flex';
                        dessertBox.querySelector('.add-to-quantity-btn').style.display = 'none';
                        qtyLabel.textContent = '1';
                    }
                    updateCartDisplay();
                }
            });

            plusBtn.addEventListener('click', () => {
                const cartItem = cart.find(item => item.name === product.name);
                if (cartItem) {
                    cartItem.quantity += 1;
                    qtyLabel.textContent = cartItem.quantity;
                    updateCartDisplay();
                }
            });

            return dessertBox;
        };

        // Function to load more products
        const loadMoreProducts = () => {
            const fragment = document.createDocumentFragment();

            for (let i = productsDisplayed; i < productsDisplayed + productsPerLoad && i < data.length; i++) {
                const product = data[i];
                const productCard = createProductCard(product);
                fragment.appendChild(productCard);
            }

            dessertContainer.appendChild(fragment);
            productsDisplayed += productsPerLoad;

            if (productsDisplayed >= data.length) {
                window.removeEventListener('scroll', handleScroll);
            }
        };

        // Scroll event listener to trigger loading more products
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
                loadMoreProducts();
            }
        };

        // Function to handle adding products to the cart
        const addToCart = (product, dessertBox) => {
            const cartItem = cart.find(item => item.name === product.name);
            if (cartItem) {
                cartItem.quantity += 1;
                // Update quantity label
                const qtyLabel = dessertBox.querySelector('.add-to-quantity-btn .label');
                qtyLabel.textContent = cartItem.quantity;
            } else {
                cart.push({ ...product, quantity: 1 });
                // Show quantity button, hide add-to-cart button
                const addBtn = dessertBox.querySelector('.add-to-cart-btn');
                const qtyBtn = dessertBox.querySelector('.add-to-quantity-btn');
                addBtn.style.display = 'none';
                qtyBtn.style.display = 'flex';
                qtyBtn.querySelector('.label').textContent = '1';
            }
            updateCartDisplay();
        };

        // Load the first set of products and add the scroll event listener
        loadMoreProducts();
        window.addEventListener('scroll', handleScroll);
    })
    .catch(error => console.error('Error fetching data:', error));

// --- Order Confirmation Modal ---

// Create modal elements
function createOrderModal() {
    // Overlay
    const overlay = document.createElement('div');
    overlay.classList.add('modal-overlay');
    overlay.id = 'order-modal-overlay';

    // Modal container
    const modal = document.createElement('div');
    modal.classList.add('modal-container');
    modal.id = 'order-modal';

    modal.innerHTML = `
        <div class="modal-header">
            <img src="Assets/images/icon-order-confirmed.svg" alt="Order Confirmed" class="modal-check-icon">
            <h2>Order Confirmed</h2>
            <p class="modal-subtitle">We hope you enjoy your food!</p>
        </div>
        <div class="modal-items" id="modal-items">
            <!-- Items will be populated dynamically -->
        </div>
        <div class="modal-total">
            <span>Order Total</span>
            <span class="modal-total-amount" id="modal-total-amount">$0.00</span>
        </div>
        <button class="modal-start-new-btn" id="modal-start-new-btn">Start New Order</button>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Event listener for Start New Order button
    document.getElementById('modal-start-new-btn').addEventListener('click', resetOrder);

    // Close modal when clicking overlay (optional - but we'll keep it to only close via button)
    // overlay.addEventListener('click', (e) => {
    //     if (e.target === overlay) {
    //         closeOrderModal();
    //     }
    // });
}

function openOrderModal() {
    if (cart.length === 0) return;

    const overlay = document.getElementById('order-modal-overlay');
    const modalItems = document.getElementById('modal-items');
    const modalTotal = document.getElementById('modal-total-amount');

    // Populate items
    modalItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const modalItem = document.createElement('div');
        modalItem.classList.add('modal-item');
        modalItem.innerHTML = `
            <div class="modal-item-left">
                <img src="${item.image.thumbnail}" alt="${item.name}" class="modal-item-img">
                <div class="modal-item-info">
                    <p class="modal-item-name">${item.name}</p>
                    <span class="modal-item-qty">${item.quantity}x</span>
                    <span class="modal-item-price">@ $${item.price.toFixed(2)}</span>
                </div>
            </div>
            <div class="modal-item-right">
                <span class="modal-item-total">$${itemTotal.toFixed(2)}</span>
            </div>
        `;
        modalItems.appendChild(modalItem);
    });

    modalTotal.textContent = `$${total.toFixed(2)}`;
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeOrderModal() {
    const overlay = document.getElementById('order-modal-overlay');
    if (overlay) {
        overlay.style.display = 'none';
        document.body.style.overflow = '';
    }
}

function resetOrder() {
    // Clear cart
    cart = [];

    // Reset all product buttons to "Add to Cart" state
    const dessertBoxes = document.querySelectorAll('.dessert-box');
    dessertBoxes.forEach(box => {
        const addBtn = box.querySelector('.add-to-cart-btn');
        const qtyBtn = box.querySelector('.add-to-quantity-btn');
        if (addBtn && qtyBtn) {
            addBtn.style.display = 'flex';
            qtyBtn.style.display = 'none';
            qtyBtn.querySelector('.label').textContent = '1';
        }
    });

    // Update cart display
    updateCartDisplay();

    // Close modal
    closeOrderModal();
}

// Initialize modal on page load
document.addEventListener('DOMContentLoaded', () => {
    createOrderModal();

    // Confirm Order button
    const confirmBtn = document.querySelector('.confirm-order-btn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', openOrderModal);
    }

    // Reset order button (in cart summary)
    const resetBtn = document.querySelector('.reset-order-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetOrder);
    }
});
