const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav');
const toast = document.querySelector('.toast');
const cartButton = document.querySelector('.cart');
const cartCount = cartButton.querySelector('b');
const cartDrawer = document.querySelector('.cart-drawer');
const cartBackdrop = document.querySelector('.cart-backdrop');
const cartItems = document.querySelector('.cart-items');
const subtotal = document.querySelector('.subtotal strong');
const closeCartButton = document.querySelector('.cart-close');
const searchTrigger = document.querySelector('.search-trigger');
const searchLayer = document.querySelector('.search-layer');
const searchInput = document.querySelector('.product-search');
const accountDialog = document.querySelector('.account-dialog');
const storageKey = 'pawvita-cart';
const whatsappNumber = '5511975104890';
let cart = JSON.parse(localStorage.getItem(storageKey) || '[]');

const formatCurrency = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function saveCart() { localStorage.setItem(storageKey, JSON.stringify(cart)); }

function renderCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartCount.textContent = totalItems;
  subtotal.textContent = formatCurrency(total);
  cartItems.innerHTML = cart.length
    ? cart.map((item) => `<article class="cart-item"><img src="${item.image}" alt="" /><div><h3>${item.name}</h3><p>${item.quantity} × ${formatCurrency(item.price)}</p></div><button class="remove-item" type="button" aria-label="Remover ${item.name}" data-id="${item.id}">×</button></article>`).join('')
    : '<p class="empty-cart">Seu carrinho está vazio.<br />Escolha algo especial para o seu pet. 🐾</p>';
  cartItems.querySelectorAll('.remove-item').forEach((button) => button.addEventListener('click', () => {
    cart = cart.filter((item) => item.id !== button.dataset.id);
    saveCart();
    renderCart();
  }));
}

function setCartOpen(open) {
  cartDrawer.classList.toggle('open', open);
  cartBackdrop.classList.toggle('open', open);
  cartDrawer.setAttribute('aria-hidden', String(!open));
  cartButton.setAttribute('aria-expanded', String(open));
  if (open) closeCartButton.focus();
}

menuButton?.addEventListener('click', () => {
  const open = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
});

navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  navigation.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));

document.querySelectorAll('.product-card').forEach((card, index) => {
  const addButton = card.querySelector('.price button');
  addButton?.addEventListener('click', () => {
    const name = card.querySelector('h3').textContent.trim();
    const image = card.querySelector('.product-visual img').getAttribute('src');
    const price = Number(card.querySelector('.price strong').textContent.replace('R$', '').replace('.', '').replace(',', '.').trim());
    const id = `produto-${index}`;
    const existing = cart.find((item) => item.id === id);
    if (existing) existing.quantity += 1;
    else cart.push({ id, name, image, price, quantity: 1 });
    saveCart();
    renderCart();
    toast.textContent = 'Adicionado ao carrinho! Seu pet vai amar. 🐾';
    toast.classList.add('show');
    window.setTimeout(() => toast.classList.remove('show'), 2600);
  });
});

cartButton.addEventListener('click', () => setCartOpen(true));
closeCartButton.addEventListener('click', () => setCartOpen(false));
cartBackdrop.addEventListener('click', () => setCartOpen(false));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setCartOpen(false); });
document.querySelector('.checkout-button').addEventListener('click', () => {
  if (!cart.length) return;
  const items = cart.map((item) => `• ${item.quantity}x ${item.name} — ${formatCurrency(item.price * item.quantity)}`).join('\n');
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const message = `Olá! Quero confirmar este pedido na PawVita:\n\n${items}\n\n*Total: ${formatCurrency(total)}*`;
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
});

searchTrigger.addEventListener('click', () => {
  searchLayer.classList.add('open');
  searchLayer.setAttribute('aria-hidden', 'false');
  searchInput.focus();
});
document.querySelector('.search-close').addEventListener('click', () => {
  searchLayer.classList.remove('open');
  searchLayer.setAttribute('aria-hidden', 'true');
  searchInput.value = '';
  document.querySelectorAll('.product-card').forEach((card) => card.classList.remove('is-hidden'));
});
searchInput.addEventListener('input', () => {
  const term = searchInput.value.trim().toLocaleLowerCase('pt-BR');
  document.querySelectorAll('.product-card').forEach((card) => {
    card.classList.toggle('is-hidden', term && !card.textContent.toLocaleLowerCase('pt-BR').includes(term));
  });
});
document.querySelector('.account-trigger').addEventListener('click', () => accountDialog.showModal());
document.querySelector('.account-close').addEventListener('click', () => accountDialog.close());
accountDialog.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();
  accountDialog.close();
  toast.textContent = 'Acesso simulado com sucesso!';
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2600);
});

renderCart();
