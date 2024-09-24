document.addEventListener("DOMContentLoaded", function() {
    const cartBtn = document.querySelector('.cart-btn button');
    const cartOverlay = document.createElement('div');
    const cartItemsContainer = document.createElement('div');
    let cartItems = [];

    // Initialize cart overlay structure
    cartOverlay.id = 'cart-overlay';
    cartOverlay.classList.add('cart-overlay');
    cartOverlay.innerHTML = `
        <div class="cart-content">
            <h2>Warenkorb</h2>
            <div id="cart-items"></div>
            <button class="close-cart">Schließen</button>
        </div>
    `;
    document.body.appendChild(cartOverlay);

    // Get the cart items container
    const closeCartBtn = cartOverlay.querySelector('.close-cart');
    const cartItemsElement = cartOverlay.querySelector('#cart-items');

    // Show/Hide Cart
    cartBtn.addEventListener('click', () => {
        cartOverlay.classList.toggle('show');
    });

    closeCartBtn.addEventListener('click', () => {
        cartOverlay.classList.remove('show');
    });

    // Add to Cart buttons functionality
    document.querySelectorAll('.product-btn').forEach((btn, index) => {
        btn.addEventListener('click', () => {
            const productCard = btn.parentElement;
            const productTitle = productCard.querySelector('.product-title').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent;

            // Add product to cart
            addToCart(productTitle, productPrice);

            // Show the cart overlay
            cartOverlay.classList.add('show');
        });
    });

    function addToCart(title, price) {
        cartItems.push({ title, price });
        updateCartUI();
    }

    function updateCartUI() {
        cartItemsElement.innerHTML = ''; // Clear existing items
        cartItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.textContent = `${item.title} - ${item.price}`;
            cartItemsElement.appendChild(itemElement);
        });
    }
});