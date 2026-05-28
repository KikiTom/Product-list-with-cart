let cart = [];
let allProducts = [];

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

// Function to create a product card
function createProductCard(product) {
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
}

// Function to handle adding products to the cart
function addToCart(product, dessertBox) {
    const cartItem = cart.find(item => item.name === product.name);
    if (cartItem) {
        cartItem.quantity += 1;
        // Update quantity label
        dessertBox.querySelector('.add-to-quantity-btn .label').textContent = cartItem.quantity;
    } else {
        cart.push({
            name: product.name,
            price: product.price,
            quantity: 1
        });
        // Show quantity button, hide add button
        dessertBox.querySelector('.add-to-cart-btn').style.display = 'none';
        dessertBox.querySelector('.add-to-quantity-btn').style.display = 'flex';
    }
    updateCartDisplay();
}

// Function to render products based on search query
function renderProducts(query) {
    const dessertContainer = document.getElementById('dessert-container');
    dessertContainer.innerHTML = '';

    const filteredProducts = query
        ? allProducts.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase())
        )
        : allProducts;

    const fragment = document.createDocumentFragment();
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);

        // Restore cart state for this product if it exists in cart
        const cartItem = cart.find(item => item.name === product.name);
        if (cartItem) {
            productCard.querySelector('.add-to-cart-btn').style.display = 'none';
            productCard.querySelector('.add-to-quantity-btn').style.display = 'flex';
            productCard.querySelector('.add-to-quantity-btn .label').textContent = cartItem.quantity;
        }

        fragment.appendChild(productCard);
    });

    dessertContainer.appendChild(fragment);
}

// Fetch the product data from data.json
fetch('./data.json')
    .then(response => response.json())
    .then(data => {
        allProducts = data;

        // Initial render of all products
        renderProducts('');

        // Search input event listener
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', (e) => {
            renderProducts(e.target.value);
        });

        // Confirm order button
        document.querySelector('.confirm-order-btn').addEventListener('click', () => {
            alert('Order confirmed! Thank you for your purchase.');
            cart = [];
            updateCartDisplay();
            // Reset all product buttons
            document.querySelectorAll('.dessert-box').forEach(box => {
                const addBtn = box.querySelector('.add-to-cart-btn');
                const qtyBtn = box.querySelector('.add-to-quantity-btn');
                if (addBtn && qtyBtn) {
                    addBtn.style.display = 'flex';
                    qtyBtn.style.display = 'none';
                    qtyBtn.querySelector('.label').textContent = '1';
                }
            });
        });

        // Reset order button
        document.querySelector('.reset-order-btn').addEventListener('click', () => {
            cart = [];
            updateCartDisplay();
            // Reset all product buttons
            document.querySelectorAll('.dessert-box').forEach(box => {
                const addBtn = box.querySelector('.add-to-cart-btn');
                const qtyBtn = box.querySelector('.add-to-quantity-btn');
                if (addBtn && qtyBtn) {
                    addBtn.style.display = 'flex';
                    qtyBtn.style.display = 'none';
                    qtyBtn.querySelector('.label').textContent = '1';
                }
            });
        });
    })
    .catch(error => console.error('Error loading products:', error));
