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
   PAGE TRANSITION LOGIC (AFTER VIDEO)
   ========================================= */
// 7 Seconds Timeout setup (Tagline fades at 3s and animation takes 2s, 7s gives it proper time)
setTimeout(() => {
  const intro = document.getElementById('intro-container');
  const main = document.getElementById('main-website');
  if(intro && main) {
    intro.style.display = 'none';
    main.style.display = 'block';
    setTimeout(() => { main.style.opacity = '1'; }, 50);
  }
}, 7000); 

/* =========================================
   AUTO SWIPE BANNERS EVERY 2 SECONDS
   ========================================= */
setInterval(() => {
  const container = document.getElementById('banner-container');
  if(container && container.children.length > 1) {
    let maxScroll = container.scrollWidth - container.clientWidth;
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

      const bannerContent = `<div class="banner" style="background-image: url('${data.url}')"></div>`;
      const finalBanner = data.link ? `<a href="${data.link}" target="_blank" class="banner-wrapper">${bannerContent}</a>` : `<div class="banner-wrapper">${bannerContent}</div>`;
      siteContainer.innerHTML += finalBanner;

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

      siteContainer.innerHTML += `
        <div class="product-card">
          <div class="product-img" style="background-image: url('${data.url}')"></div>
          <h3>${data.name}</h3>
          <p>${data.price}</p>
        </div>
      `;

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
