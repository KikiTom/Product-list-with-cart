let cart = [];

// Function to update cart display
function updateCartDisplay(productName) {
    const cartContainer = document.querySelector('.cart-items');
    const cartEmptyMessage = document.querySelector('.cart-empty');
    const cartSummary = document.querySelector('.cart-summary');
    const infoCart = document.getElementById('info-cart');

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
            total += item.price * item.quantity;
            totalItems += item.quantity;

            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
              <div class="cart-item-info">
                <p class="cart-item-name">${item.name}</p>
                <div class="cart-item-details">
                  <span class="cart-item-qty">${item.quantity}x</span>
                  <span class="cart-item-price">@ $${item.price.toFixed(2)}</span>
                  <span class="cart-item-total">$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
              <button class="remove-item-btn" data-name="${item.name}">
                <img src="Assets/images/icon-remove-item.svg" alt="Remove">
              </button>
            `;
            cartContainer.appendChild(cartItem);
        });

        // Update total
        document.querySelector('.cart-summary h3').innerText = `Total: $${total.toFixed(2)}`;

        // Update cart counter
        infoCart.textContent = `(${totalItems})`;

        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-item-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                removeFromCart(this.dataset.name);
            });
        });
    }
}

// Function to remove item from cart
function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    updateCartDisplay();
}

// Function to show confirmation modal
function showConfirmModal() {
    // Remove existing modal if any
    const existingModal = document.querySelector('.confirm-modal-overlay');
    if (existingModal) {
        existingModal.remove();
    }

    const modalOverlay = document.createElement('div');
    modalOverlay.classList.add('confirm-modal-overlay');

    let itemsHtml = '';
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        itemsHtml += `
            <div class="modal-item">
                <img src="${item.image.thumbnail}" alt="${item.name}" class="modal-item-img">
                <div class="modal-item-info">
                    <p class="modal-item-name">${item.name}</p>
                    <span class="modal-item-qty">${item.quantity}x</span>
                    <span class="modal-item-price">@ $${item.price.toFixed(2)}</span>
                </div>
                <span class="modal-item-total">$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `;
    });

    modalOverlay.innerHTML = `
        <div class="confirm-modal">
            <img src="Assets/images/icon-order-confirmed.svg" alt="Confirmed" class="modal-confirm-icon">
            <h2 class="modal-title">Order Confirmed</h2>
            <p class="modal-subtitle">We hope you enjoy your food!</p>
            <div class="modal-items">
                ${itemsHtml}
            </div>
            <div class="modal-total">
                <span>Order Total</span>
                <span class="modal-total-amount">$${total.toFixed(2)}</span>
            </div>
            <button class="modal-start-new-btn">Start New Order</button>
        </div>
    `;

    document.body.appendChild(modalOverlay);

    // Add event listener to "Start New Order" button inside modal
    modalOverlay.querySelector('.modal-start-new-btn').addEventListener('click', function() {
        resetOrder();
        modalOverlay.remove();
    });
}

// Function to reset order
function resetOrder() {
    cart = [];
    updateCartDisplay();

    // Reset all product cards to show "Add to Cart" button instead of quantity controls
    document.querySelectorAll('.dessert-box').forEach(box => {
        const addBtn = box.querySelector('.add-to-cart-btn');
        const qtyBtn = box.querySelector('.add-to-quantity-btn');
        if (addBtn && qtyBtn) {
            addBtn.style.display = 'flex';
            qtyBtn.style.display = 'none';
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
                    <img src="Assets/images/icon-decrement-quantity.svg" alt="Decrease" class="qty-minus">
                    <span class="label qty-value">1</span>
                    <img src="Assets/images/icon-increment-quantity.svg" alt="Increase" class="qty-plus">
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

            // Add event listeners for quantity +/- buttons
            const qtyMinus = dessertBox.querySelector('.qty-minus');
            const qtyPlus = dessertBox.querySelector('.qty-plus');
            const qtyValue = dessertBox.querySelector('.qty-value');

            qtyMinus.addEventListener('click', () => {
                const cartItem = cart.find(item => item.name === product.name);
                if (cartItem) {
                    if (cartItem.quantity > 1) {
                        cartItem.quantity--;
                        qtyValue.textContent = cartItem.quantity;
                        updateCartDisplay();
                    } else {
                        // Remove from cart and show add button
                        removeFromCart(product.name);
                        addToCartBtn.style.display = 'flex';
                        dessertBox.querySelector('.add-to-quantity-btn').style.display = 'none';
                    }
                }
            });

            qtyPlus.addEventListener('click', () => {
                const cartItem = cart.find(item => item.name === product.name);
                if (cartItem) {
                    cartItem.quantity++;
                    qtyValue.textContent = cartItem.quantity;
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
                // Update the qty display
                const qtyValue = dessertBox.querySelector('.qty-value');
                if (qtyValue) qtyValue.textContent = cartItem.quantity;
            } else {
                cart.push({ ...product, quantity: 1 });
                // Show quantity controls, hide add button
                const addBtn = dessertBox.querySelector('.add-to-cart-btn');
                const qtyBtn = dessertBox.querySelector('.add-to-quantity-btn');
                if (addBtn && qtyBtn) {
                    addBtn.style.display = 'none';
                    qtyBtn.style.display = 'flex';
                    const qtyValue = dessertBox.querySelector('.qty-value');
                    if (qtyValue) qtyValue.textContent = '1';
                }
            }
            updateCartDisplay();
        };

        // Load the first set of products and add the scroll event listener
        loadMoreProducts();
        window.addEventListener('scroll', handleScroll);

        // Add event listener to Confirm Order button
        document.querySelector('.confirm-order-btn').addEventListener('click', function() {
            if (cart.length > 0) {
                showConfirmModal();
            }
        });

        // Add event listener to Reset Order button
        document.querySelector('.reset-order-btn').addEventListener('click', function() {
            resetOrder();
        });
    })
    .catch(error => console.error('Error fetching data:', error));
