// Array, um die Artikel im Warenkorb zu speichern
let cart = [];

// Notwendige Elemente holen
const openCartBtn = document.getElementById("open-cart-btn");
const closeCartImg = document.getElementById("close-cart-img");
const cartOverlay = document.getElementById("cart-overlay");
const cartItemsContainer = document.querySelector(".cart-items");
const cartContent = document.querySelector(".cart-content"); // Cart content area
const burgerMenu = document.getElementById("burger-menu");
const nav = document.querySelector("nav");

burgerMenu.addEventListener("click", (event) => {
  nav.classList.toggle("active");
  event.stopPropagation();
});

// Close the menu if the user clicks outside of the nav or burger icon
document.addEventListener("click", function (event) {
  const isClickInsideNav = nav.contains(event.target);
  const isClickOnBurgerMenu = burgerMenu.contains(event.target);

  // If the click is outside the nav and burger icon, close the menu
  if (!isClickInsideNav && !isClickOnBurgerMenu) {
    nav.classList.remove("active");
  }
});

// Close the menu when any link isnide the menu is clicked
document.querySelectorAll("nav a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("active");
  });
});

// Funktion, um den Warenkorb zu öffnen
openCartBtn.addEventListener("click", function () {
  cartOverlay.classList.add("show");
});

// Funktion, um den Warenkorb zu schließen (Ueber das Schliessen-Icon)
closeCartImg.addEventListener("click", function () {
  cartOverlay.classList.remove("show");
});

// Funktion um den Warenkorb aus localStorage zu laden
window.addEventListener("load", loadCart);

//Funktion um den Warenkorb zu speichern
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Funktion um den Warenkorb zu laden
function loadCart() {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartDisplay();
    updateCartQuantity();
  }
}

// Function to close the cart if the user clicks outside the cart content
document.addEventListener("click", function (event) {
  // Check if the click is outside the cart content and the cart is open
  if (
    cartOverlay.classList.contains("show") &&
    !cartContent.contains(event.target) &&
    !openCartBtn.contains(event.target)
  ) {
    cartOverlay.classList.remove("show"); // Close the cart
  }
});

// Prevent the cart from closing when clicking inside the cart content
cartContent.addEventListener("click", function (event) {
  event.stopPropagation(); // Prevent event bubbling up to the document
});

// Event-Listener für alle 'explore-now-btn' Buttons
const buyNowButtons = document.querySelectorAll(".product-btn");
buyNowButtons.forEach((button, index) => {
  button.addEventListener("click", function () {
    const productCard = button.closest(".product-card");
    const product = {
      name: productCard.querySelector(".product-title").innerText,
      price: productCard.querySelector(".product-price").innerText,
      image: productCard.querySelector(".product-image").src,
    };
    addToCart(product);
  });
});

// Funktion, um ein Produkt zum Warenkorb hinzuzufügen
function addToCart(product) {
  product.price = parseFloat(product.price.replace("€", "").replace(",", "."));
  const existingProduct = cart.find((item) => item.name === product.name);

  if (existingProduct) {
    existingProduct.quantity++;
    existingProduct.totalPrice =
      existingProduct.quantity * existingProduct.price;
  } else {
    cart.push({
      ...product,
      quantity: 1,
      totalPrice: product.price,
    });
  }

  saveCart(); // Save cart to localStorage

  updateCartDisplay();
  updateCartQuantity();
}

// Funktion, um die Warenkorb-Anzahl zu aktualisieren
function updateCartQuantity() {
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cart-quantity").innerText = totalQuantity;
}

// Funktion, um den Warenkorb-Inhalt in der Overlay-Anzeige zu aktualisieren
function updateCartDisplay() {
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Dein Warenkorb ist leer.</p>";
  } else {
    cart.forEach((item) => {
      const itemElement = document.createElement("div");
      itemElement.classList.add("cart-item");

      itemElement.innerHTML = `
        <div class="product-info">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="product-name">${item.name}</div>
        </div>
        <div class="quantity-controls">
            <button class="quantity-btn minus">-</button>
            <input type="number" class="quantity-input" value="${
              item.quantity
            }" min="1">
            <button class="quantity-btn plus">+</button>
        </div>
        <div class="product-price">${item.totalPrice.toFixed(2)}€</div>
        <div class="remove-item">
            <button class="remove-btn">
            <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg">
                <path
                d="M3.28125 3.28125L3.86719 12.6562C3.89502 13.1979 4.28906 13.5938 4.80469 13.5938H10.1953C10.713 
                13.5938 11.0997 13.1979 11.1328 12.6562L11.7188 3.28125" stroke="#8F8F8F" stroke-width="0.9375" 
                stroke-linecap="round" stroke-linejoin="round"></path><path d="M2.34375 3.28125H12.6562H2.34375Z" 
                fill="#8F8F8F"></path><path d="M2.34375 3.28125H12.6562" stroke="#8F8F8F" stroke-width="0.9375" 
                stroke-miterlimit="10" stroke-linecap="round"></path><path d="M9.60938 5.15625L9.375 11.7188M5.625 
                3.28125V2.10938C5.62473 2.01697 5.64273 1.92541 5.67797 1.83998C5.71321 1.75455 5.76499 1.67693 5.83034 
                1.61159C5.89568 1.54624 5.9733 1.49446 6.05873 1.45922C6.14416 1.42398 6.23571 1.40598 6.32812 1.40625H8.67188C8.76429 
                1.40598 8.85584 1.42398 8.94127 1.45922C9.0267 1.49446 9.10432 1.54624 9.16966 1.61159C9.23501 1.67693 9.28679 1.75455 
                9.32203 1.83998C9.35727 1.92541 9.37527 2.01697 9.375 2.10938V3.28125H5.625ZM7.5 5.15625V11.7188V5.15625ZM5.39062 5.15625L5.625 
                11.7188L5.39062 5.15625Z" stroke="#8F8F8F" stroke-width="0.9375" stroke-linecap="round" stroke-linejoin="round">
                </path>
            </svg>
            </button>
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
  document.querySelectorAll(".quantity-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const input = button.parentElement.querySelector(".quantity-input");
      const productTitle = button
        .closest(".cart-item")
        .querySelector(".product-name").innerText;
      const productInCart = cart.find((item) => item.name === productTitle);

      let currentValue = parseInt(input.value);

      if (button.classList.contains("minus")) {
        if (currentValue > 1) {
          input.value = currentValue - 1;
          productInCart.quantity--;
        }
      } else if (button.classList.contains("plus")) {
        input.value = currentValue + 1;
        productInCart.quantity++;
      }

      // Update the total price based on new quantity
      productInCart.totalPrice = productInCart.quantity * productInCart.price;

      // Update the display with the new total price
      button.closest(".cart-item").querySelector(".product-price").innerText =
        productInCart.totalPrice.toFixed(2) + " €";

      updateCartQuantity(); // Update the cart quantity display
    });
  });

  document.querySelectorAll(".quantity-input").forEach((input) => {
    input.addEventListener("change", function () {
      const productTitle = input
        .closest(".cart-item")
        .querySelector(".product-name").innerText;
      const productInCart = cart.find((item) => item.name === productTitle);

      let newQuantity = parseInt(input.value);

      // Ensure that the input value is at least 1
      if (newQuantity < 1) {
        newQuantity = 1;
        input.value = 1;
      }

      productInCart.quantity = newQuantity;

      // Update the total price based on new quantity
      productInCart.totalPrice = productInCart.quantity * productInCart.price;

      // Update the display with the new total price
      input.closest(".cart-item").querySelector(".product-price").innerText =
        productInCart.totalPrice.toFixed(2) + " €";

      updateCartQuantity(); // Update the cart quantity display
    });
  });
}

// Event-Listener für Artikel-Entfernung
function addRemoveItemListeners() {
  document.querySelectorAll(".remove-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const productTitle = button
        .closest(".cart-item")
        .querySelector(".product-name").innerText;
      cart = cart.filter((item) => item.name !== productTitle);

      saveCart(); // Save cart to localStorage

      updateCartDisplay();
      updateCartQuantity();
    });
  });
}
