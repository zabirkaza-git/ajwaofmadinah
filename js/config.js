/* =============================================================
   AJWA OF MADINAH — config.js
   Fail konfigurasi harga dan tetapan promosi.
   ─────────────────────────────────────────────────────────────
   ✏️  CARA EDIT HARGA:
   Untuk menukar harga promosi, cari bahagian "packages" di bawah
   dan ubah nilai "promoPrice" sahaja.

   Contoh: tukar 10 pek dari RM170 ke RM160 → promoPrice: 160
           tukar 20 pek dari RM300 ke RM280 → promoPrice: 280

   ✏️  CARA AKTIF/NYAHAKTIF PROMOSI:
   Tukar  promotion.active  kepada  false  untuk nyahaktifkan promosi
   walaupun tarikh masih dalam tempoh promosi.
   ─────────────────────────────────────────────────────────────
   JANGAN edit fail lain untuk menukar harga — semuanya diambil
   dari konfigurasi ini secara automatik.
   ============================================================= */

const AJWA_CONFIG = {

  /* ── URL OnPay ──────────────────────────────────────────────
     Semua butang pembelian akan menuju ke URL ini.
     Jika URL berubah, edit di sini sahaja.
  ──────────────────────────────────────────────────────────── */
  onpayUrl: "https://irfankhairi.onpay.my/order/form/ajwaofmadinah",

  /* ── Tetapan Promosi ────────────────────────────────────────
     active    : true = promosi diaktifkan (bergantung pada tarikh)
                 false = promosi dimatikan sepenuhnya tanpa mengira tarikh
     startDate : Tarikh mula promosi (format: YYYY-MM-DD)
     endDate   : Tarikh tamat promosi (format: YYYY-MM-DD, tarikh ini TERMASUK dalam promosi)
     Semua tarikh dikira dalam zon waktu Malaysia (Asia/Kuala_Lumpur).
  ──────────────────────────────────────────────────────────── */
  promotion: {
    active:    true,
    startDate: "2026-11-01",   /* ✏️ Tukar tarikh mula jika perlu */
    endDate:   "2026-11-15"    /* ✏️ Tukar tarikh tamat jika perlu */
  },

  /* ── Pakej & Harga ──────────────────────────────────────────
     Untuk setiap pakej:
       originalPrice : Harga asal (RM) — akan dipapar berpalang semasa promosi
       promoPrice    : Harga promosi (RM) — ✏️ INI YANG PERLU DITUKAR JIKA HARGA PROMOSI BERUBAH

     Penjimatan (savings) dikira AUTOMATIK: originalPrice - promoPrice
     Tiada keperluan untuk edit mana-mana fail lain.
  ──────────────────────────────────────────────────────────── */
  packages: [
    {
      id:            "package-10",
      name:          "Pakej Usahawan 10 Pek",
      quantity:      10,
      originalPrice: 200,   /* RM200 — harga asal */
      promoPrice:    170    /* ✏️ RM170 — tukar nilai ini untuk harga promosi baharu */
    },
    {
      id:            "package-20",
      name:          "Pakej Usahawan 20 Pek",
      quantity:      20,
      originalPrice: 340,   /* RM340 — harga asal */
      promoPrice:    300    /* ✏️ RM300 — tukar nilai ini untuk harga promosi baharu */
    }
  ]

};


/* =============================================================
   FUNGSI UTILITI HARGA — JANGAN EDIT BAHAGIAN INI
   ─────────────────────────────────────────────────────────────
   Fungsi-fungsi berikut membaca konfigurasi di atas dan
   menentukan harga yang perlu dipaparkan secara automatik.
   ============================================================= */

/**
 * Semak sama ada promosi sedang aktif pada tarikh hari ini
 * (menggunakan zon waktu Malaysia Asia/Kuala_Lumpur).
 * @returns {boolean}
 */
function isPromoActive() {
  if (!AJWA_CONFIG.promotion.active) return false;

  try {
    /* Dapatkan tarikh hari ini dalam zon waktu Malaysia */
    const nowMY = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Asia/Kuala_Lumpur' })
    );
    /* Tetapkan masa ke awal hari (00:00:00) untuk perbandingan tarikh sahaja */
    const todayMY = new Date(nowMY.getFullYear(), nowMY.getMonth(), nowMY.getDate());

    /* Hurai tarikh mula dan tamat */
    const [sy, sm, sd] = AJWA_CONFIG.promotion.startDate.split('-').map(Number);
    const [ey, em, ed] = AJWA_CONFIG.promotion.endDate.split('-').map(Number);
    const start = new Date(sy, sm - 1, sd);
    const end   = new Date(ey, em - 1, ed);

    return todayMY >= start && todayMY <= end;
  } catch (e) {
    return false;
  }
}

/**
 * Dapatkan harga yang perlu dipaparkan untuk pakej tertentu.
 * @param {object} pkg - Objek pakej dari AJWA_CONFIG.packages
 * @returns {{ price: number, isPromo: boolean, savings: number }}
 */
function getPackagePrice(pkg) {
  const promoOn = isPromoActive();
  return {
    price:   promoOn ? pkg.promoPrice    : pkg.originalPrice,
    isPromo: promoOn,
    savings: pkg.originalPrice - pkg.promoPrice
  };
}

/**
 * Render semua kad pakej ke dalam container dengan id "pakej-cards-container".
 * Fungsi ini dipanggil secara automatik apabila DOM siap.
 */
function renderPackageCards() {
  const container = document.getElementById('pakej-cards-container');
  if (!container) return;

  const promoOn = isPromoActive();
  container.innerHTML = '';

  AJWA_CONFIG.packages.forEach(function(pkg, idx) {
    const isFeatured = idx === 1; /* Kad ke-2 (20 pek) sebagai featured */
    const savings    = pkg.originalPrice - pkg.promoPrice;

    let priceHTML = '';
    if (promoOn) {
      priceHTML = `
        <div class="pakej-promo-label">HARGA PROMOSI</div>
        <div class="pakej-price-row">
          <span class="pakej-original-price">RM${pkg.originalPrice}</span>
          <span class="pakej-promo-price">RM${pkg.promoPrice}</span>
        </div>
        <div class="pakej-savings">Jimat RM${savings}</div>
      `;
    } else {
      priceHTML = `
        <div class="pakej-price-row">
          <span class="pakej-promo-price">RM${pkg.originalPrice}</span>
        </div>
      `;
    }

    const featuredBadge = isFeatured
      ? `<div class="pakej-featured-ribbon">PALING POPULAR</div>`
      : '';

    const card = `
      <div class="pakej-card-new${isFeatured ? ' featured' : ''}" id="${pkg.id}">
        ${featuredBadge}
        <div class="pakej-card-inner">
          <div class="pakej-card-top">
            <span class="pakej-type-tag">PAKEJ USAHAWAN</span>
            <h3 class="pakej-qty-title">${pkg.quantity} PEK AJWA OF MADINAH</h3>
          </div>
          <div class="pakej-price-block">
            ${priceHTML}
          </div>
          <div class="pakej-divider"></div>
          <ul class="pakej-features-list">
            <li><span class="pf-check">✓</span> ${pkg.quantity} pek ziplock Kurma Ajwa 200g</li>
            <li><span class="pf-check">✓</span> 100% Kurma Ajwa asli dari Madinah</li>
            <li><span class="pf-check">✓</span> Pek ziplock kedap udara premium</li>
            <li><span class="pf-check">✓</span> Diimport oleh Irfan Khairi Sdn Bhd</li>
            <li><span class="pf-check">✓</span> Poster &amp; video marketing disediakan</li>
          </ul>
          <a href="${AJWA_CONFIG.onpayUrl}"
             target="_blank"
             rel="noopener noreferrer"
             class="btn-gold pakej-cta-btn"
             aria-label="Dapatkan ${pkg.name} melalui OnPay">
            <span>DAPATKAN PAKEJ INI</span>
            <span class="btn-arrow">→</span>
          </a>
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', card);
  });
}

/**
 * Kemas kini semua butang CTA OnPay dengan URL dari konfigurasi.
 */
function wireOnPayButtons() {
  document.querySelectorAll('[data-onpay-btn]').forEach(function(el) {
    el.setAttribute('href', AJWA_CONFIG.onpayUrl);
  });
}

/* Jalankan render selepas DOM siap */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    renderPackageCards();
    wireOnPayButtons();
  });
} else {
  renderPackageCards();
  wireOnPayButtons();
}
