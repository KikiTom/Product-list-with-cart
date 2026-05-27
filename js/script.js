let cart = [];

// Function to update cart display
function updateCartDisplay() {
    const cartContainer = document.querySelector('.cart-items');
    const cartEmptyMessage = document.querySelector('.cart-empty');
    const cartSummary = document.querySelector('.cart-summary');
    const cartCountSpan = document.querySelector('#info-cart');

    // Clear existing items in the cart
    cartContainer.innerHTML = '';

    // Calculate total quantity for badge
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountSpan.textContent = `(${totalQuantity})`;

    if (cart.length === 0) {
        cartEmptyMessage.style.display = 'block';
        cartSummary.style.display = 'none';
        cartContainer.style.display = 'none';
    } else {
        cartEmptyMessage.style.display = 'none';
        cartContainer.style.display = 'block';
        cartSummary.style.display = 'block';
        let total = 0;

        // Display cart items
        cart.forEach((item) => {
            total += item.price * item.quantity;

            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
              <div class="cart-item-info">
                <p class="cart-item-name">${item.name}</p>
                <div class="cart-item-details">
                  <span class="cart-item-quantity">${item.quantity}x</span>
                  <span class="cart-item-price">@ $${item.price.toFixed(2)}</span>
                  <span class="cart-item-subtotal">$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
              <button class="cart-item-remove" onclick="removeFromCart('${item.name}')" aria-label="Remove ${item.name}">
                <img src="Assets/images/icon-remove-item.svg" alt="">
              </button>
            `;
            cartContainer.appendChild(cartItem);
        });

        // Update total
        document.querySelector('.cart-summary .cart-total').innerText = `$${total.toFixed(2)}`;
    }
}

// Function to remove item from cart
function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    updateCartDisplay();

    // Reset the corresponding product button to add-to-cart state
    const dessertBoxes = document.querySelectorAll('.dessert-box');
    dessertBoxes.forEach(box => {
        const productNameEl = box.querySelector('.dessert-type');
        if (productNameEl && productNameEl.textContent === productName) {
            const addBtn = box.querySelector('.add-to-cart-btn');
            const qtyBtn = box.querySelector('.add-to-quantity-btn');
            if (addBtn && qtyBtn) {
                addBtn.style.display = 'flex';
                qtyBtn.style.display = 'none';
            }
        }
    });
}

// Function to toggle quantity buttons visibility
function toggleQuantityButtons(productName, quantity) {
    const dessertBoxes = document.querySelectorAll('.dessert-box');
    dessertBoxes.forEach(box => {
        const productNameEl = box.querySelector('.dessert-type');
        if (productNameEl && productNameEl.textContent === productName) {
            const addBtn = box.querySelector('.add-to-cart-btn');
            const qtyBtn = box.querySelector('.add-to-quantity-btn');
            const qtyLabel = qtyBtn ? qtyBtn.querySelector('.label') : null;

            if (quantity > 0) {
                // Show quantity buttons, hide add-to-cart
                if (addBtn) addBtn.style.display = 'none';
                if (qtyBtn) qtyBtn.style.display = 'flex';
                if (qtyLabel) qtyLabel.textContent = quantity;
            } else {
                // Show add-to-cart, hide quantity buttons
                if (addBtn) addBtn.style.display = 'flex';
                if (qtyBtn) qtyBtn.style.display = 'none';
                if (qtyLabel) qtyLabel.textContent = '1';
            }
        }
    });
}

// Function to show confirm order modal
function showConfirmModal() {
    const modal = document.getElementById('confirm-modal');
    const modalItems = document.getElementById('modal-items');
    const modalTotal = document.getElementById('modal-total');

    if (!modal) return;

    modalItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        const itemEl = document.createElement('div');
        itemEl.classList.add('modal-item');
        itemEl.innerHTML = `
          <div class="modal-item-info">
            <p class="modal-item-name">${item.name}</p>
            <div class="modal-item-details">
              <span class="modal-item-quantity">${item.quantity}x</span>
              <span class="modal-item-price">@ $${item.price.toFixed(2)}</span>
            </div>
          </div>
          <span class="modal-item-subtotal">$${(item.price * item.quantity).toFixed(2)}</span>
        `;
        modalItems.appendChild(itemEl);
    });

    modalTotal.textContent = `$${total.toFixed(2)}`;
    modal.style.display = 'flex';
}

// Function to hide confirm order modal
function hideConfirmModal() {
    const modal = document.getElementById('confirm-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Function to reset the entire order
function resetOrder() {
    cart = [];
    updateCartDisplay();

    // Reset all product buttons to add-to-cart state
    const dessertBoxes = document.querySelectorAll('.dessert-box');
    dessertBoxes.forEach(box => {
        const addBtn = box.querySelector('.add-to-cart-btn');
        const qtyBtn = box.querySelector('.add-to-quantity-btn');
        const qtyLabel = qtyBtn ? qtyBtn.querySelector('.label') : null;
        if (addBtn) addBtn.style.display = 'flex';
        if (qtyBtn) qtyBtn.style.display = 'none';
        if (qtyLabel) qtyLabel.textContent = '1';
    });

    hideConfirmModal();
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
                <button class="add-to-cart-btn" tabindex="0"> 
                    <img src="Assets/images/icon-add-to-cart.svg" alt=""> 
                    <span class="label">Add to Cart</span>
                </button>
                <div class="add-to-quantity-btn">
                    <button class="qty-btn minus-btn" aria-label="Decrease quantity">
                        <img src="Assets/images/icon-decrement-quantity.svg" alt="">
                    </button>
                    <span class="label">1</span>
                    <button class="qty-btn plus-btn" aria-label="Increase quantity">
                        <img src="Assets/images/icon-increment-quantity.svg" alt="">
                    </button>   
                </div>
            </div>

            <div id="Description-product">
                <p class="dessert-name">${product.category}</p>
                <h3 class="dessert-type">${product.name}</h3>
                <h3 class="price">$${product.price.toFixed(2)}</h3>
            </div>
            `;

            // Add event listener to the "Add to Cart" button
            const addToCartBtn = dessertBox.querySelector('.add-to-cart-btn');
            addToCartBtn.addEventListener('click', () => addToCart(product));

            // Add event listeners for quantity buttons
            const minusBtn = dessertBox.querySelector('.minus-btn');
            const plusBtn = dessertBox.querySelector('.plus-btn');

            minusBtn.addEventListener('click', () => {
                const cartItem = cart.find(item => item.name === product.name);
                if (cartItem) {
                    if (cartItem.quantity > 1) {
                        cartItem.quantity -= 1;
                        updateCartDisplay();
                        toggleQuantityButtons(product.name, cartItem.quantity);
                    } else {
                        // Remove from cart when quantity reaches 0
                        removeFromCart(product.name);
                    }
                }
            });

            plusBtn.addEventListener('click', () => {
                const cartItem = cart.find(item => item.name === product.name);
                if (cartItem) {
                    cartItem.quantity += 1;
                    updateCartDisplay();
                    toggleQuantityButtons(product.name, cartItem.quantity);
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
        const addToCart = (product) => {
            const cartItem = cart.find(item => item.name === product.name);
            if (cartItem) {
                cartItem.quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            updateCartDisplay();
            toggleQuantityButtons(product.name, cart.find(item => item.name === product.name).quantity);
        };

        // Load the first set of products and add the scroll event listener
        loadMoreProducts();
        window.addEventListener('scroll', handleScroll);
    })
    .catch(error => console.error('Error fetching data:', error));

// Event listeners for confirm order and reset order (delegated since buttons exist in DOM)
document.addEventListener('DOMContentLoaded', () => {
    // Confirm order button
    const confirmOrderBtn = document.querySelector('.confirm-order-btn');
    if (confirmOrderBtn) {
        confirmOrderBtn.addEventListener('click', showConfirmModal);
    }

    // Start New Order button (in cart summary)
    const resetOrderBtn = document.querySelector('.reset-order-btn');
    if (resetOrderBtn) {
        resetOrderBtn.addEventListener('click', resetOrder);
    }

    // Start New Order button (in modal)
    const modalResetBtn = document.querySelector('.modal-reset-btn');
    if (modalResetBtn) {
        modalResetBtn.addEventListener('click', resetOrder);
    }

    // Close modal when clicking overlay
    const modal = document.getElementById('confirm-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideConfirmModal();
            }
        });
    }
});
