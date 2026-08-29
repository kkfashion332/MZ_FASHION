Utton class="small-button" style="margin-top:9px" data-action="buy-now" data-id="${esc(item.product.id)}" data-testid="button-buy-cart-${esc(item.product.id)}">Buy now</button></div></div>`).join("")}<div style="display:flex;justify-content:space-between;margin-top:20px;font-weight:700"><span>Total</span><span>${money(total)}</span></div>` : `<div class="empty-state"><strong>Your bag is empty.</strong>Add a piece you love.</div>`}</div></div>`;
}

function renderAdmin() {
  const editing = state.adminEditing ? productById(state.adminEditing) : null;
  return `<div class="admin-page">
    <header class="admin-header"><div><div class="admin-kicker">Unique Fashion / Store desk</div><h1>Manage the good stuff.</h1></div><button class="secondary-button" data-action="go-home" data-testid="button-admin-back">${icon("arrow", 16)} Back to store</button></header>
    <main class="admin-main">
      <section class="admin-panel"><h2>${editing ? "Edit product" : "Add a product"}</h2><p>Add a product with its image URL, category, price and live status.</p><form data-form="product"><div class="form-grid"><div class="field full"><label for="admin-name">Product name</label><input id="admin-name" name="name" required value="${esc(editing?.name || "")}" placeholder="e.g. Kota Street Shirt" data-testid="input-admin-name"></div><div class="field full"><label for="admin-image">Image URL</label><input id="admin-image" name="image" type="url" required value="${esc(editing?.image || "")}" placeholder="https://..." data-testid="input-admin-image"></div><div class="field"><label for="admin-category">Category</label><select id="admin-category" name="category" data-testid="select-admin-category">${Object.entries(categoryLabels).filter(([key]) => key !== "all").map(([key, label]) => `<option value="${key}" ${editing?.category === key ? "selected" : ""}>${label}</option>`).join("")}</select></div><div class="field"><label for="admin-price">Price (₹)</label><input id="admin-price" name="price" type="number" min="1" required value="${editing?.price || ""}" data-testid="input-admin-price"></div><div class="field"><label for="admin-mrp">MRP (₹)</label><input id="admin-mrp" name="mrp" type="number" min="1" required value="${editing?.mrp || ""}" data-testid="input-admin-mrp"></div><div class="field"><label for="admin-discount">Discount (%)</label><input id="admin-discount" name="discount" type="number" min="0" max="90" required value="${editing?.discount || 0}" data-testid="input-admin-discount"></div><div class="field"><label for="admin-stock">Stock</label><input id="admin-stock" name="stock" type="number" min="0" required value="${editing?.stock ?? 1}" data-testid="input-admin-stock"></div><div class="field"><label for="admin-live">Live option</label><select id="admin-live" name="live" data-testid="select-admin-live"><option value="true" ${editing?.live ? "selected" : ""}>Live / ready</option><option value="false" ${editing && !editing.live ? "selected" : ""}>Offline</option></select></div><div class="field full"><label for="admin-description">Description</label><textarea id="admin-description" name="description" placeholder="Short product description" data-testid="input-admin-description">${esc(editing?.description || "")}</textarea></div></div><div class="admin-form-actions"><button class="primary-button" type="submit" data-testid="button-save-product">${editing ? "Save changes" : "Add product"} ${icon("check", 15)}</button>${editing ? `<button class="secondary-button" type="button" data-action="cancel-edit" data-testid="button-cancel-edit">Cancel</button>` : ""}</div></form><div class="admin-list"><h3>At a glance</h3><div class="mini-row"><span>Total products</span><strong>${state.products.length}</strong></div><div class="mini-row"><span>Liked products</span><strong>${state.liked.length}</strong></div><div class="mini-row"><span>Orders</span><strong>${state.orders.length}</strong></div></div></section>
      <section class="admin-panel"><h2>Your catalog</h2><p>Edit the details your customers see on the storefront.</p><div class="admin-products">${state.products.map((product) => `<article class="admin-product" data-testid="admin-product-${esc(product.id)}"><img src="${esc(product.image)}" alt="${esc(product.name)}"><strong>${esc(product.name)}</strong><small>${categoryName(product.category)} · ${money(product.price)}</small><div class="admin-product-actions"><button class="small-button" data-action="edit-product" data-id="${esc(product.id)}" data-testid="button-edit-product-${esc(product.id)}">${icon("edit", 13)} Edit</button><button class="small-button" data-action="delete-product" data-id="${esc(product.id)}" data-testid="button-delete-product-${esc(product.id)}">${icon("trash", 13)} Delete</button></div></article>`).join("")}</div><div class="admin-list"><h3>Recent orders</h3>${state.orders.length ? [...state.orders].reverse().slice(0, 8).map((order) => `<div class="mini-row"><span>${esc(order.productName)} · ${esc(order.customerName)}</span><strong>${money(order.total)}</strong></div>`).join("") : `<div class="mini-row"><span>No orders yet</span><strong>—</strong></div>`}</div></section>
    </main>
  </div>`;
}

function closeModal() { state.modal = null; render(); }
function scrollToCollection() { document.querySelector("#collection")?.scrollIntoView({ behavior: "smooth" }); }

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action], [data-logo-tap]");
  if (!target) return;
  if (target.hasAttribute("data-logo-tap")) {
    event.preventDefault();
    const now = Date.now();
    logoTaps = [...logoTaps.filter((tap) => now - tap < 2200), now];
    if (logoTaps.length >= 5) {
      logoTaps = [];
      window.location.hash = "admin";
      showToast("Admin panel unlocked");
    }
    return;
  }
  const action = target.dataset.action;
  if (action === "set-category") { state.category = target.dataset.category || "all"; state.modal = null; render(); if (target.dataset.category !== "all") setTimeout(scrollToCollection, 30); }
  if (action === "shop-collection") scrollToCollection();
  if (action === "toggle-like") {
    const id = target.dataset.id;
    state.liked = isLiked(id) ? state.liked.filter((likedId) => likedId !== id) : [...state.liked, id];
    save(); render(); showToast(isLiked(id) ? "Saved to your liked pieces" : "Removed from liked pieces");
  }
  if (action === "open-liked") { state.modal = { type: "liked" }; render(); }
  if (action === "open-orders") { state.modal = { type: "orders" }; render(); }
  if (action === "open-cart") { state.modal = { type: "cart" }; render(); }
  if (action === "buy-now") { state.modal = { type: "checkout", id: target.dataset.id }; render(); }
  if (action === "add-cart") {
    const existing = state.cart.find((item) => item.id === target.dataset.id);
    if (existing) existing.quantity += 1; else state.cart.push({ id: target.dataset.id, quantity: 1 });
    save(); updateCounts(); showToast("Added to your bag");
  }
  if (action === "close-modal") {
    if (event.target.closest("[data-modal-content]") && !target.classList.contains("close-button") && !target.dataset.testid?.includes("close")) return;
    closeModal();
  }
  if (action === "go-home") { window.location.hash = ""; state.adminEditing = null; render(); }
  if (action === "edit-product") { state.adminEditing = target.dataset.id; render(); window.scrollTo({ top: 0, behavior: "smooth" }); }
  if (action === "cancel-edit") { state.adminEditing = null; render(); }
  if (action === "delete-product") {
    const product = productById(target.dataset.id);
    if (product && window.confirm(`Delete ${product.name}?`)) {
      state.products = state.products.filter((item) => item.id !== target.dataset.id);
      state.liked = state.liked.filter((id) => id !== target.dataset.id);
      state.cart = state.cart.filter((item) => item.id !== target.dataset.id);
      save(); render(); showToast("Product removed");
    }
  }
});

document.addEventListener("input", (event) => {
  if (!event.target.matches("[data-search]")) return;
  state.search = event.target.value;
  const value = state.search;
  render();
  const search = document.querySelector("[data-search]");
  if (search) { search.focus(); search.setSelectionRange(value.length, value.length); }
});

document.addEventListener("submit", (event) => {
  const form = event.target;
  if (form.dataset.form === "checkout") {
    event.preventDefault();
    const data = new FormData(form);
    const product = productById(form.dataset.productId);
    const quantity = Math.max(1, Number(data.get("quantity")) || 1);
    const order = { id: `UF-${Date.now().toString().slice(-6)}`, productName: product.name, image: product.image, quantity, total: product.price * quantity, customerName: data.get("name"), phone: data.get("phone"), address: data.get("address"), status: "Order placed" };
    state.orders.push(order);
    state.cart = state.cart.filter((item) => item.id !== product.id);
    save();
    state.modal = { type: "success", orderId: order.id, phone: order.phone };
    render();
    showToast("Order placed successfully");
  }
  if (form.dataset.form === "product") {
    event.preventDefault();
    const data = new FormData(form);
    const item = { name: data.get("name"), image: data.get("image"), category: data.get("category"), price: Number(data.get("price")), mrp: Number(data.get("mrp")), discount: Number(data.get("discount")), stock: Number(data.get("stock")), live: data.get("live") === "true", description: data.get("description") };
    if (state.adminEditing) {
      state.products = state.products.map((product) => product.id === state.adminEditing ? { ...product, ...item } : product);
      showToast("Product updated");
    } else {
      state.products.push({ ...item, id: `product-${Date.now()}` });
      showToast("Product added");
    }
    state.adminEditing = null;
    save(); render();
  }
});

window.addEventListener("hashchange", render);
render();
