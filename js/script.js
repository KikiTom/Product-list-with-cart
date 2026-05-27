let cart = [];

// Helper: safely encode HTML entities in a string for use in attribute values
function encodeAttr(str) {
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Helper: safely encode HTML entities for use in text content (prevents XSS via innerHTML)
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

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

            // Build DOM safely — avoid innerHTML with unsanitized data
            const infoDiv = document.createElement('div');
            infoDiv.classList.add('cart-item-info');

            const nameP = document.createElement('p');
            nameP.classList.add('cart-item-name');
            nameP.textContent = item.name;

            const detailsDiv = document.createElement('div');
            detailsDiv.classList.add('cart-item-details');

            const qtySpan = document.createElement('span');
            qtySpan.classList.add('cart-item-quantity');
            qtySpan.textContent = `${item.quantity}x`;

            const priceSpan = document.createElement('span');
            priceSpan.classList.add('cart-item-price');
            priceSpan.textContent = `@ $${item.price.toFixed(2)}`;

            const subtotalSpan = document.createElement('span');
            subtotalSpan.classList.add('cart-item-subtotal');
            subtotalSpan.textContent = `$${(item.price * item.quantity).toFixed(2)}`;

            detailsDiv.appendChild(qtySpan);
            detailsDiv.appendChild(priceSpan);
            detailsDiv.appendChild(subtotalSpan);

            infoDiv.appendChild(nameP);
            infoDiv.appendChild(detailsDiv);

            // Remove button — use dataset + event listener instead of onclick
            const removeBtn = document.createElement('button');
            removeBtn.classList.add('cart-item-remove');
            removeBtn.dataset.product = item.name;
            removeBtn.setAttribute('aria-label', `Remove ${encodeAttr(item.name)}`);

            const removeImg = document.createElement('img');
            removeImg.src = 'Assets/images/icon-remove-item.svg';
            removeImg.alt = '';
            removeBtn.appendChild(removeImg);

            // Event listener for remove
            removeBtn.addEventListener('click', () => {
                removeFromCart(item.name);
            });

            cartItem.appendChild(infoDiv);
            cartItem.appendChild(removeBtn);
            cartContainer.appendChild(cartItem);
        });

        // Update total
        document.querySelector('.cart-summary .cart-total').textContent = `$${total.toFixed(2)}`;
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

        // Build modal item safely — avoid innerHTML with unsanitized data
        const infoDiv = document.createElement('div');
        infoDiv.classList.add('modal-item-info');

        const nameP = document.createElement('p');
        nameP.classList.add('modal-item-name');
        nameP.textContent = item.name;

        const detailsDiv = document.createElement('div');
        detailsDiv.classList.add('modal-item-details');

        const qtySpan = document.createElement('span');
        qtySpan.classList.add('modal-item-quantity');
        qtySpan.textContent = `${item.quantity}x`;

        const priceSpan = document.createElement('span');
        priceSpan.classList.add('modal-item-price');
        priceSpan.textContent = `@ $${item.price.toFixed(2)}`;

        detailsDiv.appendChild(qtySpan);
        detailsDiv.appendChild(priceSpan);

        infoDiv.appendChild(nameP);
        infoDiv.appendChild(detailsDiv);

        const subtotalSpan = document.createElement('span');
        subtotalSpan.classList.add('modal-item-subtotal');
        subtotalSpan.textContent = `$${(item.price * item.quantity).toFixed(2)}`;

        itemEl.appendChild(infoDiv);
        itemEl.appendChild(subtotalSpan);
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

            // Build product card safely — avoid innerHTML with unsanitized data
            const imgBtnDiv = document.createElement('div');
            imgBtnDiv.id = 'img-btn';

            const img = document.createElement('img');
            img.src = product.image.desktop;
            img.alt = product.name;
            imgBtnDiv.appendChild(img);

            const addBtn = document.createElement('button');
            addBtn.classList.add('add-to-cart-btn');
            addBtn.tabIndex = 0;
            const addBtnImg = document.createElement('img');
            addBtnImg.src = 'Assets/images/icon-add-to-cart.svg';
            addBtnImg.alt = '';
            addBtn.appendChild(addBtnImg);
            const addBtnSpan = document.createElement('span');
            addBtnSpan.classList.add('label');
            addBtnSpan.textContent = 'Add to Cart';
            addBtn.appendChild(addBtnSpan);
            imgBtnDiv.appendChild(addBtn);

            const qtyBtnDiv = document.createElement('div');
            qtyBtnDiv.classList.add('add-to-quantity-btn');
            const minusBtn = document.createElement('button');
            minusBtn.classList.add('qty-btn', 'minus-btn');
            minusBtn.setAttribute('aria-label', 'Decrease quantity');
            const minusImg = document.createElement('img');
            minusImg.src = 'Assets/images/icon-decrement-quantity.svg';
            minusImg.alt = '';
            minusBtn.appendChild(minusImg);
            qtyBtnDiv.appendChild(minusBtn);

            const qtyLabel = document.createElement('span');
            qtyLabel.classList.add('label');
            qtyLabel.textContent = '1';
            qtyBtnDiv.appendChild(qtyLabel);

            const plusBtn = document.createElement('button');
            plusBtn.classList.add('qty-btn', 'plus-btn');
            plusBtn.setAttribute('aria-label', 'Increase quantity');
            const plusImg = document.createElement('img');
            plusImg.src = 'Assets/images/icon-increment-quantity.svg';
            plusImg.alt = '';
            plusBtn.appendChild(plusImg);
            qtyBtnDiv.appendChild(plusBtn);
            imgBtnDiv.appendChild(qtyBtnDiv);

            dessertBox.appendChild(imgBtnDiv);

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
            addBtn.addEventListener('click', () => addToCart(product));

            // Add event listeners for quantity buttons
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
        function addToCart(product) {
            const existingItem = cart.find(item => item.name === product.name);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            updateCartDisplay();
            toggleQuantityButtons(product.name, cart.find(item => item.name === product.name).quantity);
        }

        // Initial load
        loadMoreProducts();

        // Attach scroll listener
        window.addEventListener('scroll', handleScroll);
    })
    .catch(error => console.error('Error loading product data:', error));
