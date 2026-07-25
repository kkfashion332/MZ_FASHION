// 1. Firebase SDKs Import 
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue, push, remove, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// 2. User's Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5qRE8B6uwDUVWdUjnKYfGHOCOOhnK1Rk",
  authDomain: "mz-fashion-f4c8d.firebaseapp.com",
  projectId: "mz-fashion-f4c8d",
  storageBucket: "mz-fashion-f4c8d.firebasestorage.app",
  messagingSenderId: "756363172587",
  appId: "1:756363172587:web:b61d87481984267f9f7cae",
  databaseURL: "https://mz-fashion-f4c8d-default-rtdb.firebaseio.com" 
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/* =========================================
   ANIMATION LOGIC
   ========================================= */
const LOGO_URL = "./logo.png"; // Ensuring relative path for animation logo

// Shards Setup
const tiles = document.getElementById('tiles');
if(tiles) {
  for (let i = 0; i < 16; i++) {
    const row = Math.floor(i / 4), col = i % 4;
    const seed = (i * 9301 + 49297) % 233280;
    const rnd = seed / 233280;
    const angle = rnd * Math.PI * 2;
    const dist = 260 + ((i * 37) % 180);
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;
    const tr = ((i * 47) % 720) - 360;
    const delay = 0.15 + (row + col) * 0.08 + (i % 3) * 0.03;
    const el = document.createElement('div');
    el.className = 'tile';
    el.style.cssText = `
      left:${col*25}%; top:${row*25}%;
      background-image:url('${LOGO_URL}');
      background-position:${(col/3)*100}% ${(row/3)*100}%;
      --tx:${tx}px; --ty:${ty}px; --tr:${tr}deg;
      animation-delay:${delay}s;
    `;
    tiles.appendChild(el);
  }
}

// Particles Setup
const p = document.getElementById('particles');
if(p) {
  const chars = ['M','Z','✦','♛','MZ','F'];
  for (let i = 0; i < 14; i++) {
    const s = document.createElement('span');
    s.textContent = chars[i % chars.length];
    s.style.cssText = `
      left:${(i*37)%100}%; top:${(i*53)%100}%;
      font-size:${14 + ((i*7)%24)}px;
      animation-duration:${12 + ((i*3)%14)}s;
      animation-delay:${(i%7)*0.8}s;
      --dx:${((i*91)%200)-100}px;
      --dy:${-150 - ((i*43)%200)}px;
    `;
    p.appendChild(s);
  }
}

// 6 Seconds Page Transition
setTimeout(() => {
  const intro = document.getElementById('intro-container');
  const main = document.getElementById('main-website');
  if(intro && main) {
    intro.style.display = 'none';
    main.style.display = 'block';
    setTimeout(() => { main.style.opacity = '1'; }, 50);
  }
}, 6000); 

/* =========================================
   AUTO SWIPE BANNERS EVERY 2 SECONDS
   ========================================= */
setInterval(() => {
  const container = document.getElementById('banner-container');
  if(container && container.children.length > 1) {
    let maxScroll = container.scrollWidth - container.clientWidth;
    // If reached end, scroll back to 0, else scroll right by 1 width
    if (container.scrollLeft >= maxScroll - 10) {
      container.scrollLeft = 0;
    } else {
      container.scrollBy({ left: container.clientWidth, behavior: 'smooth' });
    }
  }
}, 2000);

/* =========================================
   REAL-TIME DATABASE & ADVANCED ADMIN RENDER
   ========================================= */

// Render Banners on Website and Admin Panel
const bannersRef = ref(db, 'banners');
onValue(bannersRef, (snapshot) => {
  const siteContainer = document.getElementById('banner-container');
  const adminContainer = document.getElementById('admin-banner-list');
  siteContainer.innerHTML = '';
  adminContainer.innerHTML = '';

  if(snapshot.exists()) {
    snapshot.forEach((child) => {
      const data = child.val();
      const key = child.key;

      // Render for Main Website (With Optional Link)
      const bannerContent = `<div class="banner" style="background-image: url('${data.url}')"></div>`;
      const finalBanner = data.link ? `<a href="${data.link}" target="_blank" class="banner-wrapper">${bannerContent}</a>` : `<div class="banner-wrapper">${bannerContent}</div>`;
      siteContainer.innerHTML += finalBanner;

      // Render for Admin List
      adminContainer.innerHTML += `
        <div class="admin-item">
          <div class="admin-item-info">
            <div class="admin-item-img" style="background-image: url('${data.url}')"></div>
            <div class="admin-item-text">${data.link ? 'Linked' : 'No Link'}</div>
          </div>
          <div class="admin-item-actions">
            <button class="action-btn btn-edit" onclick="window.editBanner('${key}', '${data.url}', '${data.link || ''}')">Edit</button>
            <button class="action-btn btn-del" onclick="window.deleteBanner('${key}')">Del</button>
          </div>
        </div>
      `;
    });
  } else {
    siteContainer.innerHTML = '<div class="no-data">No Banners Available.</div>';
    adminContainer.innerHTML = '<p style="color:#888; font-size:13px;">No banners added yet.</p>';
  }
});

// Render Products on Website and Admin Panel
const productsRef = ref(db, 'products');
onValue(productsRef, (snapshot) => {
  const siteContainer = document.getElementById('product-grid');
  const adminContainer = document.getElementById('admin-product-list');
  siteContainer.innerHTML = '';
  adminContainer.innerHTML = '';

  if(snapshot.exists()) {
    snapshot.forEach((child) => {
      const data = child.val();
      const key = child.key;

      // Render for Main Website
      siteContainer.innerHTML += `
        <div class="product-card">
          <div class="product-img" style="background-image: url('${data.url}')"></div>
          <h3>${data.name}</h3>
          <p>${data.price}</p>
        </div>
      `;

      // Render for Admin List
      adminContainer.innerHTML += `
        <div class="admin-item">
          <div class="admin-item-info">
            <div class="admin-item-img" style="background-image: url('${data.url}')"></div>
            <div class="admin-item-text">${data.name} <br><span style="color:#d4a94a;">${data.price}</span></div>
          </div>
          <div class="admin-item-actions">
            <button class="action-btn btn-edit" onclick="window.editProduct('${key}', '${data.url}', '${data.name}', '${data.price}')">Edit</button>
            <button class="action-btn btn-del" onclick="window.deleteProduct('${key}')">Del</button>
          </div>
        </div>
      `;
    });
  } else {
    siteContainer.innerHTML = '<div class="no-data" style="grid-column: span 2;">No Products Available.</div>';
    adminContainer.innerHTML = '<p style="color:#888; font-size:13px;">No products added yet.</p>';
  }
});


/* =========================================
   ADMIN PANEL ACTIONS & CRUD
   ========================================= */
let tapCount = 0;
let tapTimeout;

window.handleLogoTap = function() {
  tapCount++;
  clearTimeout(tapTimeout);
  tapTimeout = setTimeout(() => { tapCount = 0; }, 2000);

  if (tapCount === 7) {
    setTimeout(() => {
      let pin = prompt("Enter Admin PIN (Hint: 4321):");
      if (pin === "4321") {
        document.getElementById('admin-modal').style.display = 'flex';
      } else {
        alert("Access Denied.");
      }
    }, 100);
    tapCount = 0; 
  }
};

window.closeAdmin = function() {
  document.getElementById('admin-modal').style.display = 'none';
};

// ---- BANNER CRUD ----
window.addBanner = function() {
  let imgUrl = prompt("Enter Banner Image URL:");
  if (!imgUrl) return;
  let link = prompt("Enter Target Link (Insta/WhatsApp etc) or leave blank:");
  
  push(ref(db, 'banners'), { url: imgUrl, link: link || "" })
    .catch((error) => alert('Error: ' + error.message));
};

window.editBanner = function(key, oldUrl, oldLink) {
  let newUrl = prompt("Update Image URL:", oldUrl);
  if (newUrl === null) return; 
  let newLink = prompt("Update Link:", oldLink);
  if (newLink === null) return;

  update(ref(db, 'banners/' + key), { url: newUrl, link: newLink })
    .catch((error) => alert('Error: ' + error.message));
};

window.deleteBanner = function(key) {
  if(confirm("Delete this banner?")) {
    remove(ref(db, 'banners/' + key));
  }
};

// ---- PRODUCT CRUD ----
window.addProduct = function() {
  let imgUrl = prompt("1. Product Image URL:");
  if (!imgUrl) return;
  let name = prompt("2. Product Name:");
  if (!name) name = "Item";
  let price = prompt("3. Product Price (e.g., ₹2,999):");
  if (!price) price = "₹0";

  push(ref(db, 'products'), { url: imgUrl, name: name, price: price })
    .catch((error) => alert('Error: ' + error.message));
};

window.editProduct = function(key, oldUrl, oldName, oldPrice) {
  let newUrl = prompt("Update Image URL:", oldUrl);
  if (newUrl === null) return;
  let newName = prompt("Update Name:", oldName);
  if (newName === null) return;
  let newPrice = prompt("Update Price:", oldPrice);
  if (newPrice === null) return;

  update(ref(db, 'products/' + key), { url: newUrl, name: newName, price: newPrice })
    .catch((error) => alert('Error: ' + error.message));
};

window.deleteProduct = function(key) {
  if(confirm("Delete this product?")) {
    remove(ref(db, 'products/' + key));
  }
};
