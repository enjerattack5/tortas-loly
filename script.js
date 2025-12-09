// Número de WhatsApp del negocio (México: 52 + tu número)
const WHATSAPP_NUMBER = "5219617522184";

// Menú de productos
const MENU = [
  { id: 1, name: "Torta de pierna", price: 48, desc: "Pierna adobada, jitomate, cebolla, aguacate." },
  { id: 2, name: "Torta de jamón", price: 42, desc: "Jamón de pavo, queso, jitomate y mayonesa." },
  { id: 3, name: "Torta de milanesa", price: 55, desc: "Milanesa crujiente, lechuga, jitomate y chipotle." },
  { id: 4, name: "Torta vegetariana", price: 45, desc: "Queso panela, aguacate, jitomate y frijoles." },
  { id: 5, name: "Combo con bebida", price: 65, desc: "Cualquier torta + refresco o agua." },
  { id: 6, name: "Torta de chorizo", price: 50, desc: "Chorizo doradito, frijolitos y pico de gallo." }
];

// Estado del carrito
let cart = [];

// Utilidad: formato de dinero
const money = v => `$${v.toFixed(2)} MXN`;

// Render del menú
function renderMenu(){
  const list = document.getElementById("menuList");
  list.innerHTML = "";
  MENU.forEach(item => {
    const el = document.createElement("div");
    el.className = "item";
    el.innerHTML = `
      <div class="item-info">
        <div class="item-name">${item.name}</div>
        <div class="item-desc">${item.desc}</div>
        <div class="price">${money(item.price)}</div>
      </div>
      <div class="item-actions">
        <input class="qty" type="number" min="1" value="1" aria-label="Cantidad" />
        <button class="small-btn add-btn">Agregar</button>
      </div>
    `;
    const qtyInput = el.querySelector(".qty");
    const addBtn = el.querySelector(".add-btn");
    addBtn.addEventListener("click", () => addToCart(item, parseInt(qtyInput.value || "1", 10)));
    list.appendChild(el);
  });
}

// Agregar al carrito
function addToCart(item, qty){
  if(isNaN(qty) || qty < 1) qty = 1;
  const existing = cart.find(c => c.id === item.id);
  if(existing){
    existing.qty += qty;
  } else {
    cart.push({ id: item.id, name: item.name, price: item.price, qty });
  }
  renderCart();
}

// Render del carrito
function renderCart(){
  const list = document.getElementById("cartList");
  list.innerHTML = "";
  if(cart.length === 0){
    list.innerHTML = `<div class="muted">Tu pedido está vacío. Agrega tortas del menú.</div>`;
  } else {
    cart.forEach(ci => {
      const row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML = `
        <div>
          <strong>${ci.name}</strong>
          <div class="muted tiny">x${ci.qty} • ${money(ci.price)} c/u</div>
        </div>
        <div class="cart-actions">
          <button class="small-btn minus">-</button>
          <button class="small-btn plus">+</button>
          <button class="small-btn delete">Eliminar</button>
        </div>
      `;
      row.querySelector(".minus").addEventListener("click", () => {
        ci.qty = Math.max(1, ci.qty - 1);
        renderCart();
      });
      row.querySelector(".plus").addEventListener("click", () => {
        ci.qty += 1;
        renderCart();
      });
      row.querySelector(".delete").addEventListener("click", () => {
        cart = cart.filter(c => c.id !== ci.id);
        renderCart();
      });
      list.appendChild(row);
    });
  }
  updateTotal();
}

// Total
function updateTotal(){
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  document.getElementById("cartTotal").textContent = money(total);
}

// Mensaje de WhatsApp
function buildWhatsappMessage(){
  const name = document.getElementById("clientName").value.trim();
  let msg = `Hola Tortas Loly,%0Aquiero hacer un pedido:%0A%0A`;
  if(cart.length === 0){
    msg += `— (Sin productos aún)`;
  } else {
    cart.forEach(ci => {
      msg += `• ${ci.name} x${ci.qty} — ${money(ci.price * ci.qty)}%0A`;
    });
  }
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  msg += `%0ATotal: ${money(total)}%0A`;
  if(name) msg += `%0ANombre: ${encodeURIComponent(name)}`;
  msg += `%0A%0A¿Tiempo de entrega y forma de pago?`;
  return msg;
}

// Abrir WhatsApp
function openWhatsapp(){
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsappMessage()}`;
  window.open(url, "_blank");
}

// Eventos
function bindEvents(){
  document.getElementById("checkoutBtn").addEventListener("click", openWhatsapp);
  document.getElementById("clearCartBtn").addEventListener("click", () => { cart = []; renderCart(); });
  const heroBtn = document.getElementById("heroWhatsapp");
  if (heroBtn) {
    heroBtn.addEventListener("click", (e) => { e.preventDefault(); openWhatsapp(); });
  }
  const inlineBtn = document.getElementById("inlineWhatsapp");
  if (inlineBtn) {
    inlineBtn.addEventListener("click", (e) => { e.preventDefault(); openWhatsapp(); });
  }
}

// Inicializar
function init(){
  renderMenu();
  renderCart();
  bindEvents();
  const yearEl = document.getElementById("year");
  if(yearEl) yearEl.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", init);
