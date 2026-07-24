// Is wrapper se ensure hota hai ki page ke saare elements load hone ke BAAD hi JS chalegi
document.addEventListener('DOMContentLoaded', () => {

  /* =========================================
     INTRO ANIMATION LOGIC
     ========================================= */
  // Relative path added
  const LOGO_URL = "./File_00000000fdb082089a8183b3a1cc72c3.png"; 

  const tiles = document.getElementById('tiles');
  if (tiles) {
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

  const p = document.getElementById('particles');
  if (p) {
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

  // Fixed Timing Logic 
  setTimeout(() => {
    const intro = document.getElementById('intro-container');
    const main = document.getElementById('main-website');
    
    if (intro && main) {
      intro.style.display = 'none';
      main.style.display = 'block';
      
      // Force trigger opacity transition
      setTimeout(() => {
        main.style.opacity = '1';
      }, 50);
    }
  }, 6000); // 6 seconds

}); // DOMContentLoaded khatam

/* =========================================
   ADMIN PLANNER LOGIC (7 Taps + PIN)
   ========================================= */
let tapCount = 0;
let tapTimeout;

function handleLogoTap() {
  tapCount++;
  
  clearTimeout(tapTimeout);
  tapTimeout = setTimeout(() => { tapCount = 0; }, 2000);

  if (tapCount === 7) {
    setTimeout(() => {
      let pin = prompt("Enter Admin PIN:");
      if (pin === "4321") {
        document.getElementById('admin-modal').style.display = 'flex';
      } else {
        alert("Access Denied: Incorrect PIN.");
      }
    }, 100);
    tapCount = 0; 
  }
}

function closeAdmin() {
  document.getElementById('admin-modal').style.display = 'none';
}

/* =========================================
   DYNAMIC ADD/REMOVE FUNCTIONS (Admin)
   ========================================= */
let bannerCount = 2;
function addBanner() {
  bannerCount++;
  const container = document.getElementById('banner-container');
  const newBanner = document.createElement('div');
  newBanner.className = 'banner';
  newBanner.innerHTML = `<h2>Promo Banner ${bannerCount}</h2><p style="color:var(--muted)">Special Offer Limited Time</p>`;
  container.appendChild(newBanner);
  alert('Banner Added successfully!');
}

function removeBanner() {
  const container = document.getElementById('banner-container');
  if (container.lastElementChild) {
    container.removeChild(container.lastElementChild);
    alert('Last banner removed!');
  } else {
    alert('No banners to remove.');
  }
}

let productCount = 4;
function addProduct() {
  productCount++;
  const container = document.getElementById('product-grid');
  const newProduct = document.createElement('div');
  newProduct.className = 'product-card';
  newProduct.innerHTML = `<div class="product-img">New Item Image</div><h3>MZ Exclusive ${productCount}</h3><p>₹3,499</p>`;
  container.appendChild(newProduct);
  alert('Product Added successfully!');
}

function removeProduct() {
  const container = document.getElementById('product-grid');
  if (container.lastElementChild) {
    container.removeChild(container.lastElementChild);
    alert('Last product removed!');
  } else {
    alert('No products to remove.');
  }
}
