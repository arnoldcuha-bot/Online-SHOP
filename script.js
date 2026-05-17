const products = [
  {
    id: 1,
    name: "Noir Duftkerze",
    price: 24.99,
    description: "Warmes Aroma für entspannte Abende.",
  },
  {
    id: 2,
    name: "Luna Lederetui",
    price: 39.99,
    description: "Minimalistisches Design meets Premium-Haptik.",
  },
  {
    id: 3,
    name: "Satin Schlafmaske",
    price: 19.99,
    description: "Sanfte Nacht für stilvolle Erholung.",
  },
  {
    id: 4,
    name: "Carbon Trinkflasche",
    price: 29.99,
    description: "Thermische Eleganz für unterwegs.",
  },
  {
    id: 5,
    name: "Velvet Reisetasche",
    price: 69.99,
    description: "Geräumig, robust und luxuriös.",
  },
  {
    id: 6,
    name: "Silk Case",
    price: 14.99,
    description: "Feines Accessoire für tägliche Essentials.",
  },
];

const cart = new Map();
const productGrid = document.getElementById("productGrid");
const cartItems = document.getElementById("cartItems");
const subtotalEl = document.getElementById("subtotal");
const totalEl = document.getElementById("total");
const checkoutButton = document.getElementById("checkoutButton");

function formatPrice(value) {
  return value.toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
  });
}

function renderProducts() {
  productGrid.innerHTML = "";

  products.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-image">${product.name.split(" ")[0]}</div>
      <div>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
      </div>
      <div class="price">${formatPrice(product.price)}</div>
      <button class="btn btn-secondary" type="button">In den Warenkorb</button>
    `;

    const button = card.querySelector("button");
    button.addEventListener("click", () => addToCart(product));
    productGrid.appendChild(card);
  });
}

function renderCart() {
  cartItems.innerHTML = "";
  if (cart.size === 0) {
    cartItems.innerHTML = `<p class="cart-empty">Dein Warenkorb ist noch leer. Füge ein Produkt hinzu, um loszulegen.</p>`;
    subtotalEl.textContent = formatPrice(0);
    totalEl.textContent = formatPrice(0);
    return;
  }

  let subtotal = 0;

  cart.forEach((quantity, id) => {
    const product = products.find((item) => item.id === id);
    if (!product) return;
    const lineTotal = product.price * quantity;
    subtotal += lineTotal;

    const item = document.createElement("div");
    item.className = "cart-item";
    item.innerHTML = `
      <div class="cart-item-title">
        <strong>${product.name}</strong>
        <span class="cart-item-meta">${quantity} × ${formatPrice(product.price)}</span>
      </div>
      <div>
        <span>${formatPrice(lineTotal)}</span>
        <button class="btn btn-secondary" type="button">+</button>
        <button class="btn btn-secondary" type="button">-</button>
      </div>
    `;

    const [increase, decrease] = item.querySelectorAll("button");
    increase.addEventListener("click", () => changeQuantity(id, quantity + 1));
    decrease.addEventListener("click", () => changeQuantity(id, quantity - 1));
    cartItems.appendChild(item);
  });

  subtotalEl.textContent = formatPrice(subtotal);
  totalEl.textContent = formatPrice(subtotal);
}

function addToCart(product) {
  const current = cart.get(product.id) || 0;
  cart.set(product.id, current + 1);
  renderCart();
}

function changeQuantity(productId, nextQuantity) {
  if (nextQuantity <= 0) {
    cart.delete(productId);
  } else {
    cart.set(productId, nextQuantity);
  }
  renderCart();
}

checkoutButton.addEventListener("click", () => {
  if (cart.size === 0) {
    alert("Dein Warenkorb ist leer. Wähle ein Produkt aus, bevor du zur Kasse gehst.");
    return;
  }

  const summary = Array.from(cart.entries()).map(([id, qty]) => {
    const product = products.find((item) => item.id === id);
    return `${qty} × ${product.name}`;
  });

  alert(`Vielen Dank für deine Bestellung!\n\nBestellung:\n${summary.join("\n")}\n\nWir leiten dich zur sicheren Bezahlung weiter.`);
});

renderProducts();
renderCart();
