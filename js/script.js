
let cart = [];

// Function to update cart display
function updateCartDisplay(productName) {
    const cartContainer = document.querySelector('.cart-items');
    const cartEmptyMessage = document.querySelector('.cart-empty'); // Ensure this matches your HTML
    const cartSummary = document.querySelector('.cart-summary');

    // Clear existing items in the cart
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartEmptyMessage.style.display = 'block'; // Show empty cart message
        cartSummary.style.display = 'none'; // Hide summary
        cartContainer.style.display = 'none'; // Hide cart items
    } else {
        cartEmptyMessage.style.display = 'none'; // Hide empty message
        cartContainer.style.display = 'block'; // Show cart items
        cartSummary.style.display = 'block'; // Show summary
        let total = 0;

        // Display cart items
        cart.forEach((item) => {
            total += item.price * item.quantity; // Calculate total

            const cartItem = document.createElement('cart-items');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
              <p>${item.name}</p>
              <p>Quantity: ${item.quantity}</p>
              <p>$${(item.price * item.quantity).toFixed(2)}</p>
              <button onclick="removeFromCart('${item.name}')">Remove</button>
            `;
            cartContainer.appendChild(cartItem);
        });

        // Update total
        document.querySelector('.cart-summary h3').innerText = `Total: $${total.toFixed(2)}`;
    }

    // Alert for the added product
    if (productName) {
        alert(`${productName} has been added to your cart!`);
    }
}

// Call updateCart() initially to check if the cart is empty


// Fetch the product data from data.json
fetch('./data.json')
    .then(response => response.json())
    .then(data => {
        const dessertContainer = document.getElementById('dessert-container');
        let productsDisplayed = 0;
        const productsPerLoad = 6; // Load 4 products at a time

        // Function to create a product card
        const createProductCard = (product) => {
            const dessertBox = document.createElement('div');
            dessertBox.classList.add('dessert-box');

            dessertBox.innerHTML = `
        <img src="${product.image.desktop}" alt="${product.name}">
        <button class="add-to-cart-btn"> <img src="Assets/images/icon-add-to-cart.svg" alt=""> Add to Cart</button>
        <p class="dessert-name">${product.category}</p>
        <h3 class="dessert-type">${product.name}</h3>
        <h3 class="price">$${product.price.toFixed(2)}</h3>
      `;

            // Add event listener to the "Add to Cart" button
            const addToCartBtn = dessertBox.querySelector('.add-to-cart-btn');
            addToCartBtn.addEventListener('click', () => addToCart(product));

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
                cartItem.quantity += 1; // Increment quantity if product already in cart
            } else {
                cart.push({ ...product, quantity: 1 }); // Add new product to cart
            }
            console.log(cart); // Temporary: Logging cart to the console for now
            updateCartDisplay(product.name); 
        };

        // Load the first set of products and add the scroll event listener
        loadMoreProducts();
        window.addEventListener('scroll', handleScroll);
    })
    .catch(error => console.error('Error fetching data:', error));
