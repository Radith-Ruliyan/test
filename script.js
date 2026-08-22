'use strict';

/* ==========================================================================
   D'amorr — Etalase Snack & Aksesoris Premium
   Vanilla JavaScript — tanpa library/framework
   ========================================================================== */

const WHATSAPP_NUMBER = '6285811876515';

const FAVORITES_KEY = 'damorr-favorites-v1';
const CART_KEY = 'damorr-cart-v1';

/* ==========================================================================
   DATA PRODUK
   ========================================================================== */

const PRODUCTS = [
  {
    id: 'snack-1',
    name: 'Mie Kriwil Pedas',
    category: 'snack',
    price: 6000,
    image: 'assets/product/Snack1.png',
    badge: '',
    description: ''
  },
  {
    id: 'snack-2',
    name: 'Basreng Pedas',
    category: 'snack',
    price: 6000,
    image: 'assets/product/Snack2.png',
    badge: '',
    description: ''
  },
  {
    id: 'snack-3',
    name: 'Mie Kriwil Asin',
    category: 'snack',
    price: 6000,
    image: 'assets/product/Snack3.png',
    badge: '',
    description: ''
  },
  {
    id: 'Aksesoris-1',
    name: 'Gantungan Kunci Custom Nama',
    category: 'Aksesoris',
    price: 10000,
    image: 'assets/product/Aksesoris1.png',
    badge: '',
    description: ''
  },
  {
    id: 'Aksesoris-2',
    name: 'Gantungan Kunci Custom Spotify',
    category: 'Aksesoris',
    price: 10000,
    image: 'assets/product/Aksesoris2.png',
    badge: '',
    description: ''
  },
  {
    id: 'Aksesoris-3',
    name: 'Gantungan Kunci Custom Foto',
    category: 'Aksesoris',
    price: 10000,
    image: 'assets/product/Aksesoris3.png',
    badge: '',
    description: ''
  }
];

/* ==========================================================================
   STATE
   ========================================================================== */

const state = {
  category: 'semua',
  query: '',
  favorites: loadFromStorage(FAVORITES_KEY, []),
  cart: loadFromStorage(CART_KEY, [])
};

/* ==========================================================================
   UTIL
   ========================================================================== */

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (err) {
    return fallback;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    /* diam saja jika storage penuh/tidak tersedia */
  }
}

function formatRupiah(amount) {
  const n = Number(amount) || 0;
  try {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(n);
  } catch (err) {
    return 'Rp' + n.toLocaleString('id-ID');
  }
}

function escapeHTML(str) {
  const s = String(str == null ? '' : str);
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function findProduct(id) {
  return PRODUCTS.find(function (p) { return p.id === id; }) || null;
}

function debounce(fn, wait) {
  let t = null;
  return function () {
    const args = arguments;
    const ctx = this;
    clearTimeout(t);
    t = setTimeout(function () { fn.apply(ctx, args); }, wait);
  };
}

function qs(sel, ctx) {
  return (ctx || document).querySelector(sel);
}
function qsa(sel, ctx) {
  return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
}

/* ==========================================================================
   TOAST
   ========================================================================== */

function showToast(message) {
  const region = qs('#toast-region');
  if (!region) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.textContent = String(message == null ? '' : message);

  region.appendChild(toast);

  requestAnimationFrame(function () {
    toast.classList.add('is-visible');
  });

  setTimeout(function () {
    toast.classList.remove('is-visible');
    setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 2600);
}

/* ==========================================================================
   RENDER PRODUK
   ========================================================================== */

function getFilteredProducts() {
  const query = state.query.trim().toLowerCase();
  return PRODUCTS.filter(function (p) {
    const matchesCategory = state.category === 'semua' || p.category === state.category;
    const matchesQuery = !query ||
      p.name.toLowerCase().indexOf(query) !== -1 ||
      p.description.toLowerCase().indexOf(query) !== -1;
    return matchesCategory && matchesQuery;
  });
}

function renderProductCard(product) {
  const isFav = state.favorites.indexOf(product.id) !== -1;
  const card = document.createElement('article');
  card.className = 'product-card';
  card.setAttribute('data-reveal', '');
  card.setAttribute('data-product-id', product.id);

  card.innerHTML =
    '<div class="product-media">' +
      '<img src="' + escapeHTML(product.image) + '" alt="' + escapeHTML(product.name) + '" loading="lazy" width="800" height="800">' +
      (product.badge ? '<span class="badge product-badge">' + escapeHTML(product.badge) + '</span>' : '') +
      '<button type="button" class="product-fav fav-toggle' + (isFav ? ' is-active' : '') + '" data-favorite data-id="' + escapeHTML(product.id) + '" aria-pressed="' + (isFav ? 'true' : 'false') + '" aria-label="' + (isFav ? 'Hapus dari favorit' : 'Tambah ke favorit') + '">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="' + (isFav ? 'currentColor' : 'none') + '" aria-hidden="true"><path d="M12 21s-7.5-4.6-10-9.1C.5 8.3 2.4 4.5 6.2 4.1c2-.2 3.9.8 5 2.4 1.1-1.6 3-2.6 5-2.4 3.8.4 5.7 4.2 4.2 7.8-2.5 4.5-10 9.1-10 9.1z" stroke="currentColor" stroke-width="1.8"/></svg>' +
      '</button>' +
    '</div>' +
    '<div class="product-info">' +
      '<h3 class="product-name">' + escapeHTML(product.name) + '</h3>' +
      '<p class="product-desc">' + escapeHTML(product.description) + '</p>' +
      '<p class="product-price">' + escapeHTML(formatRupiah(product.price)) + '</p>' +
      '<div class="product-actions">' +
        '<button type="button" class="btn btn-secondary btn-quick" data-quick-view data-id="' + escapeHTML(product.id) + '">Lihat Detail</button>' +
        '<button type="button" class="btn btn-primary btn-add" data-add-cart data-id="' + escapeHTML(product.id) + '">+ Keranjang</button>' +
      '</div>' +
    '</div>';

  return card;
}

function renderProductGrid() {
  const grid = qs('#product-grid');
  const emptyState = qs('#empty-state');
  if (!grid) return;

  const filtered = getFilteredProducts();
  grid.innerHTML = '';

  if (filtered.length === 0) {
    if (emptyState) emptyState.hidden = false;
    return;
  }
  if (emptyState) emptyState.hidden = true;

  const fragment = document.createDocumentFragment();
  filtered.forEach(function (product, index) {
    var card = renderProductCard(product);
    /* Stagger entry animation on mobile (skip on desktop via matchMedia) */
    if (window.matchMedia('(max-width: 768px)').matches) {
      card.style.animationDelay = (index * 60) + 'ms';
    }
    fragment.appendChild(card);
  });
  grid.appendChild(fragment);

  observeReveal();
}

/* ==========================================================================
   FILTER KATEGORI & PENCARIAN
   ========================================================================== */

function setActiveCategoryButtons() {
  qsa('[data-category]').forEach(function (btn) {
    const isActive = btn.getAttribute('data-category') === state.category;
    btn.classList.toggle('is-active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

function handleCategoryClick(e) {
  const btn = e.target.closest('[data-category]');
  if (!btn) return;
  state.category = btn.getAttribute('data-category') || 'semua';
  setActiveCategoryButtons();
  renderProductGrid();
}

function handleSearchInput(e) {
  state.query = e.target.value || '';
  qsa('.search-input').forEach(function (input) {
    if (input !== e.target) {
      input.value = state.query;
    }
  });
  renderProductGrid();
}

/* ==========================================================================
   FAVORIT
   ========================================================================== */

function toggleFavorite(id) {
  const idx = state.favorites.indexOf(id);
  if (idx === -1) {
    state.favorites.push(id);
    showToast('Ditambahkan ke favorit ✿');
  } else {
    state.favorites.splice(idx, 1);
    showToast('Dihapus dari favorit');
  }
  saveToStorage(FAVORITES_KEY, state.favorites);
  updateFavoriteButtonsUI();
}

function updateFavoriteButtonsUI() {
  qsa('[data-favorite]').forEach(function (btn) {
    const id = btn.getAttribute('data-id');
    const isFav = state.favorites.indexOf(id) !== -1;
    btn.classList.toggle('is-active', isFav);
    btn.setAttribute('aria-pressed', isFav ? 'true' : 'false');
    btn.setAttribute('aria-label', isFav ? 'Hapus dari favorit' : 'Tambah ke favorit');
    const svgPath = btn.querySelector('svg');
    if (svgPath) svgPath.setAttribute('fill', isFav ? 'currentColor' : 'none');
  });

  const favBtn = qs('#favorite-btn');
  if (favBtn) {
    const count = state.favorites.length;
    favBtn.setAttribute('aria-pressed', count > 0 ? 'true' : 'false');
    favBtn.setAttribute('aria-label', 'Lihat produk favorit (' + count + ')');
  }
}

/* ==========================================================================
   CART
   ========================================================================== */

function getCartCount() {
  return state.cart.reduce(function (sum, item) { return sum + item.qty; }, 0);
}

function getCartTotal() {
  return state.cart.reduce(function (sum, item) {
    const product = findProduct(item.id);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
}

function addToCart(id, qty) {
  const product = findProduct(id);
  if (!product) return;

  const existing = state.cart.find(function (item) { return item.id === id; });
  if (existing) {
    existing.qty += (qty || 1);
  } else {
    state.cart.push({ id: id, qty: qty || 1 });
  }
  saveToStorage(CART_KEY, state.cart);
  renderCart();
  
  const cartBtn = qs('#cart-btn');
  if (cartBtn) {
    cartBtn.classList.add('is-cart-bump');
    setTimeout(function () {
      cartBtn.classList.remove('is-cart-bump');
    }, 450);
  }

  showToast(product.name + ' ditambahkan ke keranjang');
}

function removeFromCart(id) {
  state.cart = state.cart.filter(function (item) { return item.id !== id; });
  saveToStorage(CART_KEY, state.cart);
  renderCart();
}

function changeQty(id, delta) {
  const item = state.cart.find(function (item) { return item.id === id; });
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id);
    return;
  }
  saveToStorage(CART_KEY, state.cart);
  renderCart();
}

function renderCartCount() {
  const countEl = qs('#cart-count');
  if (countEl) countEl.textContent = String(getCartCount());
}

function renderCart() {
  const itemsEl = qs('#cart-items');
  const totalEl = qs('#cart-total');
  const checkoutBtn = qs('#checkout-btn');

  renderCartCount();

  if (!itemsEl) return;

  if (state.cart.length === 0) {
    itemsEl.innerHTML = '<p class="cart-empty-msg">Keranjangmu masih kosong. Yuk mulai belanja!</p>';
    if (totalEl) totalEl.textContent = formatRupiah(0);
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }

  const fragment = document.createDocumentFragment();

  state.cart.forEach(function (item) {
    const product = findProduct(item.id);
    if (!product) return;

    const row = document.createElement('div');
    row.className = 'cart-item';
    row.setAttribute('data-cart-item-id', product.id);

    row.innerHTML =
      '<img src="' + escapeHTML(product.image) + '" alt="' + escapeHTML(product.name) + '" loading="lazy" width="72" height="72">' +
      '<div class="cart-item-info">' +
        '<p class="cart-item-name">' + escapeHTML(product.name) + '</p>' +
        '<p class="cart-item-price">' + escapeHTML(formatRupiah(product.price)) + '</p>' +
        '<div class="cart-item-qty">' +
          '<button type="button" data-qty-decrease data-id="' + escapeHTML(product.id) + '" aria-label="Kurangi jumlah ' + escapeHTML(product.name) + '">−</button>' +
          '<span aria-live="polite">' + item.qty + '</span>' +
          '<button type="button" data-qty-increase data-id="' + escapeHTML(product.id) + '" aria-label="Tambah jumlah ' + escapeHTML(product.name) + '">+</button>' +
        '</div>' +
      '</div>' +
      '<button type="button" class="cart-item-remove" data-cart-remove data-id="' + escapeHTML(product.id) + '" aria-label="Hapus ' + escapeHTML(product.name) + ' dari keranjang">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><line x1="5" y1="5" x2="19" y2="19" stroke="currentColor" stroke-width="2"/><line x1="19" y1="5" x2="5" y2="19" stroke="currentColor" stroke-width="2"/></svg>' +
      '</button>';

    fragment.appendChild(row);
  });

  itemsEl.innerHTML = '';
  itemsEl.appendChild(fragment);

  if (totalEl) totalEl.textContent = formatRupiah(getCartTotal());
  if (checkoutBtn) checkoutBtn.disabled = false;
}

function handleCartItemsClick(e) {
  const decreaseBtn = e.target.closest('[data-qty-decrease]');
  const increaseBtn = e.target.closest('[data-qty-increase]');
  const removeBtn = e.target.closest('[data-cart-remove]');

  if (decreaseBtn) {
    changeQty(decreaseBtn.getAttribute('data-id'), -1);
    return;
  }
  if (increaseBtn) {
    changeQty(increaseBtn.getAttribute('data-id'), 1);
    return;
  }
  if (removeBtn) {
    const id = removeBtn.getAttribute('data-id');
    const product = findProduct(id);
    removeFromCart(id);
    if (product) showToast(product.name + ' dihapus dari keranjang');
  }
}

/* ==========================================================================
   CART DRAWER
   ========================================================================== */

let lastFocusedElement = null;

function openCartDrawer() {
  const drawer = qs('#cart-drawer');
  const backdrop = qs('#cart-backdrop');
  const cartBtn = qs('#cart-btn');
  if (!drawer) return;

  lastFocusedElement = document.activeElement;

  drawer.hidden = false;
  if (backdrop) backdrop.hidden = false;
  document.body.classList.add('no-scroll');
  if (cartBtn) cartBtn.setAttribute('aria-expanded', 'true');

  requestAnimationFrame(function () {
    drawer.classList.add('is-open');
    if (backdrop) backdrop.classList.add('is-visible');
  });

  const closeBtn = qs('#cart-close');
  if (closeBtn) closeBtn.focus();
}

function closeCartDrawer() {
  const drawer = qs('#cart-drawer');
  const backdrop = qs('#cart-backdrop');
  const cartBtn = qs('#cart-btn');
  if (!drawer || drawer.hidden) return;

  drawer.classList.remove('is-open');
  if (backdrop) backdrop.classList.remove('is-visible');
  document.body.classList.remove('no-scroll');
  if (cartBtn) cartBtn.setAttribute('aria-expanded', 'false');

  setTimeout(function () {
    drawer.hidden = true;
    if (backdrop) backdrop.hidden = true;
  }, 350);

  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  }
}

function isCartDrawerOpen() {
  const drawer = qs('#cart-drawer');
  return !!(drawer && !drawer.hidden);
}

/* ==========================================================================
   QUICK VIEW MODAL
   ========================================================================== */

function openQuickView(id) {
  const product = findProduct(id);
  const modal = qs('#quick-view');
  const content = qs('#quick-view-content');
  if (!product || !modal || !content) return;

  lastFocusedElement = document.activeElement;

  const isFav = state.favorites.indexOf(product.id) !== -1;

  content.innerHTML =
    '<button type="button" id="quick-view-close" aria-label="Tutup pratinjau produk">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><line x1="5" y1="5" x2="19" y2="19" stroke="currentColor" stroke-width="2"/><line x1="19" y1="5" x2="5" y2="19" stroke="currentColor" stroke-width="2"/></svg>' +
    '</button>' +
    '<h2 id="quick-view-heading" class="quick-view-title">' + escapeHTML(product.name) + '</h2>' +
    '<div class="quick-view-body">' +
      '<img src="' + escapeHTML(product.image) + '" alt="' + escapeHTML(product.name) + '" loading="lazy" width="800" height="800">' +
      '<div class="quick-view-detail">' +
        (product.badge ? '<span class="badge product-badge">' + escapeHTML(product.badge) + '</span>' : '') +
        '<p class="quick-view-price">' + escapeHTML(formatRupiah(product.price)) + '</p>' +
        '<p class="quick-view-desc">' + escapeHTML(product.description) + '</p>' +
        '<div class="quick-view-actions">' +
          '<button type="button" class="btn btn-primary btn-add" data-add-cart data-id="' + escapeHTML(product.id) + '">+ Keranjang</button>' +
          '<button type="button" class="product-fav fav-toggle' + (isFav ? ' is-active' : '') + '" data-favorite data-id="' + escapeHTML(product.id) + '" aria-pressed="' + (isFav ? 'true' : 'false') + '" aria-label="' + (isFav ? 'Hapus dari favorit' : 'Tambah ke favorit') + '">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="' + (isFav ? 'currentColor' : 'none') + '" aria-hidden="true"><path d="M12 21s-7.5-4.6-10-9.1C.5 8.3 2.4 4.5 6.2 4.1c2-.2 3.9.8 5 2.4 1.1-1.6 3-2.6 5-2.4 3.8.4 5.7 4.2 4.2 7.8-2.5 4.5-10 9.1-10 9.1z" stroke="currentColor" stroke-width="1.8"/></svg>' +
          '</button>' +
        '</div>' +
      '</div>' +
    '</div>';

  modal.hidden = false;
  document.body.classList.add('no-scroll');

  requestAnimationFrame(function () {
    modal.classList.add('is-open');
  });

  const closeBtn = qs('#quick-view-close');
  if (closeBtn) closeBtn.focus();
}

function closeQuickView() {
  const modal = qs('#quick-view');
  if (!modal || modal.hidden) return;

  modal.classList.remove('is-open');
  document.body.classList.remove('no-scroll');

  setTimeout(function () {
    modal.hidden = true;
  }, 350);

  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  }
}

function isQuickViewOpen() {
  const modal = qs('#quick-view');
  return !!(modal && !modal.hidden);
}

/* ==========================================================================
   CHECKOUT VIA WHATSAPP
   ========================================================================== */

function buildWhatsAppMessage() {
  if (state.cart.length === 0) return '';

  const lines = ['Halo D\'amorr, saya ingin memesan:'];

  state.cart.forEach(function (item) {
    const product = findProduct(item.id);
    if (!product) return;
    lines.push('- ' + product.name + ' x' + item.qty + ' (' + formatRupiah(product.price * item.qty) + ')');
  });

  lines.push('');
  lines.push('Total: ' + formatRupiah(getCartTotal()));

  return lines.join('\n');
}

function handleCheckout() {
  if (state.cart.length === 0) return;
  const message = buildWhatsAppMessage();
  const url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
  window.open(url, '_blank', 'noopener,noreferrer');
}

/* ==========================================================================
   MOBILE MENU
   ========================================================================== */

function toggleMobileMenu() {
  const btn = qs('#mobile-menu-btn');
  const menu = qs('#mobile-menu');
  if (!btn || !menu) return;

  const isOpen = btn.getAttribute('aria-expanded') === 'true';

  if (isOpen) {
    btn.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    setTimeout(function () { menu.hidden = true; }, 350);
  } else {
    btn.setAttribute('aria-expanded', 'true');
    menu.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(function () { menu.classList.add('is-open'); });
  }
}

function closeMobileMenu() {
  const btn = qs('#mobile-menu-btn');
  const menu = qs('#mobile-menu');
  if (!btn || !menu || menu.hidden) return;
  btn.setAttribute('aria-expanded', 'false');
  menu.classList.remove('is-open');
  document.body.classList.remove('no-scroll');
  setTimeout(function () { menu.hidden = true; }, 350);
}

/* ==========================================================================
   FAQ ACCORDION
   ========================================================================== */

function handleAccordionClick(e) {
  const trigger = e.target.closest('[data-accordion]');
  if (!trigger) return;

  const panelId = trigger.getAttribute('aria-controls');
  const panel = panelId ? document.getElementById(panelId) : null;
  const isOpen = trigger.getAttribute('aria-expanded') === 'true';

  qsa('[data-accordion]').forEach(function (otherTrigger) {
    if (otherTrigger === trigger) return;
    otherTrigger.setAttribute('aria-expanded', 'false');
    const otherPanelId = otherTrigger.getAttribute('aria-controls');
    const otherPanel = otherPanelId ? document.getElementById(otherPanelId) : null;
    if (otherPanel) otherPanel.hidden = true;
  });

  trigger.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
  if (panel) panel.hidden = isOpen;
}

/* ==========================================================================
   PRODUCT GRID DELEGATED ACTIONS (favorite / add-cart / quick-view)
   ========================================================================== */

function handleProductGridClick(e) {
  const favBtn = e.target.closest('[data-favorite]');
  if (favBtn) {
    toggleFavorite(favBtn.getAttribute('data-id'));
    return;
  }

  const addBtn = e.target.closest('[data-add-cart]');
  if (addBtn) {
    addToCart(addBtn.getAttribute('data-id'), 1);
    return;
  }

  const quickViewBtn = e.target.closest('[data-quick-view]');
  if (quickViewBtn) {
    openQuickView(quickViewBtn.getAttribute('data-id'));
  }
}

function handleQuickViewContentClick(e) {
  const closeBtn = e.target.closest('#quick-view-close');
  if (closeBtn) {
    closeQuickView();
    return;
  }

  const favBtn = e.target.closest('[data-favorite]');
  if (favBtn) {
    toggleFavorite(favBtn.getAttribute('data-id'));
    updateFavoriteButtonsUI();
    return;
  }

  const addBtn = e.target.closest('[data-add-cart]');
  if (addBtn) {
    addToCart(addBtn.getAttribute('data-id'), 1);
  }
}

/* ==========================================================================
   SCROLL PROGRESS
   ========================================================================== */

function updateScrollProgress() {
  const bar = qs('#scroll-progress');
  if (!bar) return;

  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress = height > 0 ? Math.min(100, Math.max(0, (scrollTop / height) * 100)) : 0;

  bar.style.width = progress + '%';
  bar.setAttribute('aria-valuenow', String(Math.round(progress)));
}

/* ==========================================================================
   INTERSECTION OBSERVER — REVEAL ON SCROLL
   ========================================================================== */

let revealObserver = null;

function getRevealObserver() {
  if (revealObserver) return revealObserver;
  if (!('IntersectionObserver' in window)) return null;

  revealObserver = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  return revealObserver;
}

function observeReveal() {
  const observer = getRevealObserver();
  const targets = qsa('[data-reveal]');

  if (!observer) {
    targets.forEach(function (el) { el.classList.add('is-revealed'); });
    return;
  }

  targets.forEach(function (el) {
    if (!el.classList.contains('is-revealed')) {
      observer.observe(el);
    }
  });
}

/* ==========================================================================
   CURSOR GLOW & MAGNETIC CTA (hanya perangkat pointer presisi)
   ========================================================================== */

function isPrecisePointer() {
  try {
    return window.matchMedia('(pointer: fine)').matches;
  } catch (err) {
    return false;
  }
}

function initCursorGlow() {
  const glow = qs('#cursor-glow');
  if (!glow || !isPrecisePointer()) return;

  let rafId = null;
  let targetX = 0;
  let targetY = 0;

  function render() {
    glow.style.transform = 'translate3d(' + targetX + 'px, ' + targetY + 'px, 0)';
    rafId = null;
  }

  document.addEventListener('mousemove', function (e) {
    targetX = e.clientX;
    targetY = e.clientY;
    if (rafId === null) rafId = requestAnimationFrame(render);
  }, { passive: true });
}

function initMagneticButtons() {
  if (!isPrecisePointer()) return;

  qsa('[data-magnetic]').forEach(function (el) {
    let rafId = null;
    let targetX = 0;
    let targetY = 0;

    function render() {
      el.style.transform = 'translate3d(' + targetX + 'px, ' + targetY + 'px, 0)';
      rafId = null;
    }

    el.addEventListener('mousemove', function (e) {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      targetX = relX * 0.2;
      targetY = relY * 0.2;
      if (rafId === null) rafId = requestAnimationFrame(render);
    }, { passive: true });

    el.addEventListener('mouseleave', function () {
      targetX = 0;
      targetY = 0;
      if (rafId === null) rafId = requestAnimationFrame(render);
    }, { passive: true });
  });
}

/* ==========================================================================
   GLOBAL KEYDOWN & OUTSIDE CLICK
   ========================================================================== */

function handleGlobalKeydown(e) {
  if (e.key !== 'Escape') return;

  if (isQuickViewOpen()) {
    closeQuickView();
    return;
  }
  if (isCartDrawerOpen()) {
    closeCartDrawer();
    return;
  }
  closeMobileMenu();
}

function handleOutsideClick(e) {
  const backdrop = qs('#cart-backdrop');
  if (backdrop && !backdrop.hidden && e.target === backdrop) {
    closeCartDrawer();
    return;
  }

  const modal = qs('#quick-view');
  if (modal && !modal.hidden && e.target === modal) {
    closeQuickView();
  }
}

/* ==========================================================================
   INISIALISASI
   ========================================================================== */

function bindEvents() {
  const mobileMenuBtn = qs('#mobile-menu-btn');
  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMobileMenu);

  const mobileMenu = qs('#mobile-menu');
  if (mobileMenu) mobileMenu.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeMobileMenu();
  });

  const searchInputs = qsa('.search-input');
  searchInputs.forEach(function (input) {
    input.addEventListener('input', debounce(handleSearchInput, 200));
    const searchForm = input.closest('form');
    if (searchForm) searchForm.addEventListener('submit', function (e) { e.preventDefault(); });
  });

  const filterList = qs('.filter-list');
  if (filterList) filterList.addEventListener('click', handleCategoryClick);

  const productGrid = qs('#product-grid');
  if (productGrid) productGrid.addEventListener('click', handleProductGridClick);

  const favoriteBtn = qs('#favorite-btn');
  if (favoriteBtn) favoriteBtn.addEventListener('click', function () {
    state.category = 'semua';
    setActiveCategoryButtons();
    state.query = '';
    if (searchInput) searchInput.value = '';
    const grid = qs('#product-grid');
    const emptyState = qs('#empty-state');
    if (grid) {
      grid.innerHTML = '';
      const favProducts = PRODUCTS.filter(function (p) { return state.favorites.indexOf(p.id) !== -1; });
      if (favProducts.length === 0) {
        if (emptyState) emptyState.hidden = false;
        showToast('Belum ada produk favorit');
      } else {
        if (emptyState) emptyState.hidden = true;
        const fragment = document.createDocumentFragment();
        favProducts.forEach(function (p) { fragment.appendChild(renderProductCard(p)); });
        grid.appendChild(fragment);
        observeReveal();
      }
    }
    const katalog = qs('#katalog');
    if (katalog) katalog.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  const cartBtn = qs('#cart-btn');
  if (cartBtn) cartBtn.addEventListener('click', openCartDrawer);

  const cartClose = qs('#cart-close');
  if (cartClose) cartClose.addEventListener('click', closeCartDrawer);

  const cartBackdrop = qs('#cart-backdrop');
  if (cartBackdrop) cartBackdrop.addEventListener('click', closeCartDrawer);

  const cartItems = qs('#cart-items');
  if (cartItems) cartItems.addEventListener('click', handleCartItemsClick);

  const checkoutBtn = qs('#checkout-btn');
  if (checkoutBtn) checkoutBtn.addEventListener('click', handleCheckout);

  const catalogCheckoutBtn = qs('#catalog-checkout-btn');
  if (catalogCheckoutBtn) catalogCheckoutBtn.addEventListener('click', openCartDrawer);

  const quickViewContent = qs('#quick-view-content');
  if (quickViewContent) quickViewContent.addEventListener('click', handleQuickViewContentClick);

  const faqSection = qs('#faq');
  if (faqSection) faqSection.addEventListener('click', handleAccordionClick);

  document.addEventListener('keydown', handleGlobalKeydown);
  document.addEventListener('click', handleOutsideClick);
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
}

function init() {
  setActiveCategoryButtons();
  renderProductGrid();
  renderCart();
  updateFavoriteButtonsUI();
  bindEvents();
  observeReveal();
  updateScrollProgress();
  initCursorGlow();
  initMagneticButtons();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}