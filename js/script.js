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

            // Build cart item info section
            const infoDiv = document.createElement('div');
            infoDiv.classList.add('cart-item-info');

            const nameP = document.createElement('p');
            nameP.classList.add('cart-item-name');
            nameP.textContent = item.name;
            infoDiv.appendChild(nameP);

            const detailsDiv = document.createElement('div');
            detailsDiv.classList.add('cart-item-details');

            const qtySpan = document.createElement('span');
            qtySpan.classList.add('cart-item-qty');
            qtySpan.textContent = `${item.quantity}x`;
            detailsDiv.appendChild(qtySpan);

            const unitPriceSpan = document.createElement('span');
            unitPriceSpan.classList.add('cart-item-unit-price');
            unitPriceSpan.textContent = `@ $${item.price.toFixed(2)}`;
            detailsDiv.appendChild(unitPriceSpan);

            const totalPriceSpan = document.createElement('span');
            totalPriceSpan.classList.add('cart-item-total-price');
            totalPriceSpan.textContent = `$${itemTotal.toFixed(2)}`;
            detailsDiv.appendChild(totalPriceSpan);

            infoDiv.appendChild(detailsDiv);
            cartItem.appendChild(infoDiv);

            // Remove button with dataset approach (no onclick string)
            const removeBtn = document.createElement('button');
            removeBtn.classList.add('cart-item-remove');
            removeBtn.dataset.name = item.name;

            const removeImg = document.createElement('img');
            removeImg.src = 'Assets/images/icon-remove-item.svg';
            removeImg.alt = 'Remove';
            removeBtn.appendChild(removeImg);

            removeBtn.addEventListener('click', function() {
                removeFromCart(this.dataset.name);
            });

            cartItem.appendChild(removeBtn);
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

            // Image & button section
            const imgBtnDiv = document.createElement('div');
            imgBtnDiv.id = 'img-btn';

            const img = document.createElement('img');
            img.src = product.image.desktop;
            img.alt = product.name;
            imgBtnDiv.appendChild(img);

            // Add to Cart button
            const addBtn = document.createElement('button');
            addBtn.classList.add('add-to-cart-btn');
            const addBtnImg = document.createElement('img');
            addBtnImg.src = 'Assets/images/icon-add-to-cart.svg';
            addBtnImg.alt = '';
            const addBtnSpan = document.createElement('span');
            addBtnSpan.classList.add('label');
            addBtnSpan.textContent = 'Add to Cart';
            addBtn.appendChild(addBtnImg);
            addBtn.appendChild(addBtnSpan);
            imgBtnDiv.appendChild(addBtn);

            // Quantity button (with class instead of duplicate id)
            const qtyBtn = document.createElement('button');
            qtyBtn.classList.add('add-to-quantity-btn');

            const minusIcon = document.createElement('box-icon');
            minusIcon.setAttribute('name', 'minus-circle');
            minusIcon.classList.add('quantity-btn');
            qtyBtn.appendChild(minusIcon);

            const qtyLabel = document.createElement('span');
            qtyLabel.classList.add('label');
            qtyLabel.textContent = '1';
            qtyBtn.appendChild(qtyLabel);

            const plusIcon = document.createElement('box-icon');
            plusIcon.setAttribute('name', 'plus-circle');
            plusIcon.classList.add('quantity-btn');
            qtyBtn.appendChild(plusIcon);

            imgBtnDiv.appendChild(qtyBtn);
            dessertBox.appendChild(imgBtnDiv);

            // Description section
            const descDiv = document.createElement('div');
            descDiv.id = 'Description-product';

            const categoryP = document.createElement('p');
            categoryP.classList.add('dessert-name');
            categoryP.textContent = product.category;
            descDiv.appendChild(categoryP);

            const nameH3 = document.createElement('h3');
            nameH3.classList.add('dessert-type');
            nameH3.textContent = product.name;
            descDiv.appendChild(nameH3);

            const priceH3 = document.createElement('h3');
            priceH3.classList.add('price');
            priceH3.textContent = `$${product.price.toFixed(2)}`;
            descDiv.appendChild(priceH3);

            dessertBox.appendChild(descDiv);

            // Add event listener to the "Add to Cart" button
            addBtn.addEventListener('click', () => addToCart(product, dessertBox));

            // Quantity controls
            minusIcon.addEventListener('click', () => {
                const cartItem = cart.find(item => item.name === product.name);
                if (cartItem) {
                    if (cartItem.quantity > 1) {
                        cartItem.quantity -= 1;
                        qtyLabel.textContent = cartItem.quantity;
                    } else {
                        // Remove from cart
                        cart = cart.filter(item => item.name !== product.name);
                        // Reset button state
                        addBtn.style.display = 'flex';
                        dessertBox.querySelector('.add-to-quantity-btn').style.display = 'none';
                        qtyLabel.textContent = '1';
                    }
                    updateCartDisplay();
                }
            });

            plusIcon.addEventListener('click', () => {
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
    const modalTotalAmount = document.getElementById('modal-total-amount');

    // Clear previous items
    modalItems.innerHTML = '';

    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const itemRow = document.createElement('div');
        itemRow.classList.add('modal-item');

        // Item thumbnail
        const itemThumb = document.createElement('img');
        itemThumb.src = item.image.thumbnail;
        itemThumb.alt = item.name;
        itemThumb.classList.add('modal-item-thumb');
        itemRow.appendChild(itemThumb);

        // Item details
        const itemDetails = document.createElement('div');
        itemDetails.classList.add('modal-item-details');

        const itemName = document.createElement('p');
        itemName.classList.add('modal-item-name');
        itemName.textContent = item.name;
        itemDetails.appendChild(itemName);

        const itemQtyPrice = document.createElement('div');
        itemQtyPrice.classList.add('modal-item-qty-price');

        const itemQty = document.createElement('span');
        itemQty.classList.add('modal-item-qty');
        itemQty.textContent = `${item.quantity}x`;
        itemQtyPrice.appendChild(itemQty);

        const itemUnitPrice = document.createElement('span');
        itemUnitPrice.classList.add('modal-item-unit-price');
        itemUnitPrice.textContent = `@ $${item.price.toFixed(2)}`;
        itemQtyPrice.appendChild(itemUnitPrice);

        itemDetails.appendChild(itemQtyPrice);
        itemRow.appendChild(itemDetails);

        // Item total price
        const itemTotalPrice = document.createElement('span');
        itemTotalPrice.classList.add('modal-item-total-price');
        itemTotalPrice.textContent = `$${itemTotal.toFixed(2)}`;
        itemRow.appendChild(itemTotalPrice);

        modalItems.appendChild(itemRow);
    });

    modalTotalAmount.textContent = `$${total.toFixed(2)}`;
    overlay.style.display = 'flex';
}

function closeOrderModal() {
    const overlay = document.getElementById('order-modal-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

function resetOrder() {
    cart = [];
    closeOrderModal();
    updateCartDisplay();

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
}

// Initialize modal on page load
document.addEventListener('DOMContentLoaded', createOrderModal);
