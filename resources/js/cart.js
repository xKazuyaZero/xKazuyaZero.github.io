// Array, um die Artikel im Warenkorb zu speichern
let cart = [];

// Notwendige Elemente holen
const openCartBtn = document.getElementById('open-cart-btn');
const closeCartImg = document.getElementById('close-cart-img');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.querySelector('.cart-items');

// Funktion, um den Warenkorb zu öffnen
openCartBtn.addEventListener('click', function() {
    cartOverlay.classList.add('show');
});

// Funktion, um den Warenkorb zu schließen
closeCartImg.addEventListener('click', function() {
    cartOverlay.classList.remove('show');
});

// Event-Listener für alle 'buy-now-btn' Buttons
const buyNowButtons = document.querySelectorAll('.buy-now-btn');
buyNowButtons.forEach((button, index) => {
    button.addEventListener('click', function() {
        const productCard = button.closest('.product-card');
        const product = {
            name: productCard.querySelector('.product-title').innerText,
            price: productCard.querySelector('.product-price').innerText,
            image: productCard.querySelector('.product-image').src
        };
        addToCart(product);
    });
});

// Funktion, um ein Produkt zum Warenkorb hinzuzufügen
function addToCart(product) {
    const existingProduct = cart.find(item => item.name === product.name);

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartDisplay();
    updateCartQuantity();
}

// Funktion, um die Warenkorb-Anzahl zu aktualisieren
function updateCartQuantity() {
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-quantity').innerText = totalQuantity;
}

// Funktion, um den Warenkorb-Inhalt in der Overlay-Anzeige zu aktualisieren
function updateCartDisplay() {
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Dein Warenkorb ist leer.</p>';
    } else {
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');

            itemElement.innerHTML = `
                <div class="product-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="product-details">
                    <h3 class="product-title">${item.name}</h3>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn minus">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1">
                    <button class="quantity-btn plus">+</button>
                </div>
                <div class="product-price">${item.price}</div>
                <div class="remove-item">
                    <button class="remove-btn">🗑️</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        // Event Listener für Menge erhöhen/verringern und Artikel entfernen
        addQuantityControlListeners();
        addRemoveItemListeners();
    }
}

// Event-Listener für Mengensteuerung
function addQuantityControlListeners() {
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', function() {
            const input = button.parentElement.querySelector('.quantity-input');
            const productTitle = button.closest('.cart-item').querySelector('.product-title').innerText;
            const productInCart = cart.find(item => item.name === productTitle);

            let currentValue = parseInt(input.value);

            if (button.classList.contains('minus')) {
                if (currentValue > 1) {
                    input.value = currentValue - 1;
                    productInCart.quantity--;
                }
            } else if (button.classList.contains('plus')) {
                input.value = currentValue + 1;
                productInCart.quantity++;
            }

            updateCartQuantity();
        });
    });
}

// Event-Listener für Artikel-Entfernung
function addRemoveItemListeners() {
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productTitle = button.closest('.cart-item').querySelector('.product-title').innerText;
            cart = cart.filter(item => item.name !== productTitle);

            updateCartDisplay();
            updateCartQuantity();
        });
    });
}
