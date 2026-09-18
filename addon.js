// Verified Google Place Landmarks & Coordinates
const places = [
  { name: "Shri Kasba Ganpati Mandir Pune", lat: 18.5195, lng: 73.8569 },
  { name: "Shree Tambdi Jogeshwari Temple Pune", lat: 18.5168, lng: 73.8564 },
  { name: "Guruji Talim Ganpati Laxmi Road Pune", lat: 18.5158, lng: 73.8550 },
  { name: "Tulshibaug Ganpati Mandir Pune", lat: 18.5146, lng: 73.8552 },
  { name: "Kesari Wada Tilak Ganpati Pune", lat: 18.5173, lng: 73.8499 },
  { name: "Shrimant Dagdusheth Halwai Ganpati Mandir Pune", lat: 18.5165, lng: 73.8560 },
  { name: "Akhil Mandai Ganpati Mandir Pune", lat: 18.5126, lng: 73.8557 },
  { name: "Shrimant Bhausaheb Rangari Ganpati Pune", lat: 18.5178, lng: 73.8552 },
  { name: "Punyacha Raja Sadashiv Peth Pune", lat: 18.5120, lng: 73.8505 }
];

document.addEventListener("DOMContentLoaded", () => {
  const pageLang = document.documentElement.lang || "mr";

  // 1. Inject Accessibility Stepper & Multilingual Font Selector
  const controlGrid = document.querySelector(".control-grid");
  if (controlGrid) {
    controlGrid.innerHTML = `
      <div class="size-stepper">
        <button class="size-btn" data-scale="0.92" onclick="setFontScale(0.92, this)">A−</button>
        <button class="size-btn active" data-scale="1" onclick="setFontScale(1, this)">A</button>
        <button class="size-btn" data-scale="1.18" onclick="setFontScale(1.18, this)">A+</button>
        <button class="size-btn" data-scale="1.32" onclick="setFontScale(1.32, this)">A++</button>
      </div>
      <div class="tool-pill">
        <label for="font-select">Aa:</label>
        <select id="font-select" onchange="changeFont(this.value)">
          <option value="'Mukta', system-ui, sans-serif">मुक्ता (Mukta Devanagari)</option>
          <option value="'Noto Sans Gurmukhi', system-ui, sans-serif">ਗੁਰਮੁਖੀ (Noto Gurmukhi)</option>
          <option value="'Noto Sans Devanagari', system-ui, sans-serif">देवनागरी (Noto Sans)</option>
          <option value="'Poppins', sans-serif">Poppins (Modern Clean)</option>
          <option value="'Merriweather', serif">Merriweather (Classic Serif)</option>
          <option value="system-ui, -apple-system, sans-serif">System Default</option>
        </select>
      </div>
    `;
  }

  // 2. Localized Labels for Tour Buttons
  const tourActions = document.querySelector(".tour-actions");
  if (tourActions) {
    const walkingUrl = "https://www.google.com/maps/dir/?api=1"
      + "&origin=" + encodeURIComponent("Shri Kasba Ganpati Mandir Pune")
      + "&destination=" + encodeURIComponent("Punyacha Raja Sadashiv Peth Pune")
      + "&waypoints=" + [
          "Shree Tambdi Jogeshwari Temple Pune",
          "Shrimant Bhausaheb Rangari Ganpati Pune",
          "Shrimant Dagdusheth Halwai Ganpati Mandir Pune",
          "Guruji Talim Ganpati Laxmi Road Pune",
          "Tulshibaug Ganpati Mandir Pune",
          "Akhil Mandai Ganpati Mandir Pune",
          "Kesari Wada Tilak Ganpati Pune"
        ].map(encodeURIComponent).join("%7C")
      + "&travelmode=walking";

    const tourLabel = pageLang === "mr" ? "🚶 पायी दर्शन मार्ग (Maps)" :
                      pageLang === "hi" ? "🚶 पैदल दर्शन मार्ग (Maps)" :
                      pageLang === "pa" ? "🚶 ਪੈਦਲ ਦਰਸ਼ਨ ਮਾਰਗ (Maps)" : "🚶 Walking Tour (Maps)";

    const kmlLabel = pageLang === "mr" ? "🗺️ KML डाउनलोड" :
                     pageLang === "hi" ? "🗺️ KML डाउनलोड" :
                     pageLang === "pa" ? "🗺️ KML ਡਾਊਨਲੋਡ" : "🗺️ Download KML";

    tourActions.innerHTML = `
      <a href="${walkingUrl}" target="_blank" rel="noopener" class="tour-btn walking">${tourLabel}</a>
      <button onclick="downloadKML()" class="tour-btn">${kmlLabel}</button>
    `;
  }

  // 3. Localized Google Maps Link on Every Card
  const mapLinkText = pageLang === "mr" ? "📍 गुगल मॅप्सवर पहा" :
                      pageLang === "hi" ? "📍 गूगल मैप्स पर देखें" :
                      pageLang === "pa" ? "📍 ਗੂਗਲ ਮੈਪਸ 'ਤੇ ਦੇਖੋ" : "📍 Open in Google Maps";

  document.querySelectorAll(".card-body").forEach((body, i) => {
    if (places[i] && !body.querySelector(".map-link")) {
      const a = document.createElement("a");
      a.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(places[i].name);
      a.target = "_blank";
      a.rel = "noopener";
      a.className = "map-link";
      a.innerHTML = mapLinkText;
      body.appendChild(a);
    }
  });

  // 4. Mount Touch Zoom Lightbox
  setupLightbox();

  // 5. Restore Accessibility Scaling
  const savedScale = localStorage.getItem("pune_ganpati_scale");
  if (savedScale) setFontScale(parseFloat(savedScale));

  // 6. Language-Aware Font Default
  const savedFont = localStorage.getItem("pune_ganpati_font");
  const defaultFont = pageLang === "pa" ? "'Noto Sans Gurmukhi', system-ui, sans-serif" :
                      (pageLang === "mr" || pageLang === "hi") ? "'Mukta', system-ui, sans-serif" :
                      "'Poppins', sans-serif";

  const activeFont = savedFont || defaultFont;
  document.body.style.fontFamily = activeFont;
  const sel = document.getElementById("font-select");
  if (sel) sel.value = activeFont;
});

function changeFont(fontFamily) {
  document.body.style.fontFamily = fontFamily;
  try { localStorage.setItem("pune_ganpati_font", fontFamily); } catch(e) {}
}

function setFontScale(scale, btn) {
  document.documentElement.style.setProperty("--font-scale", scale);
  document.querySelectorAll(".size-btn").forEach(b => b.classList.remove("active"));
  const activeBtn = btn || document.querySelector(`.size-btn[data-scale="${scale}"]`);
  if (activeBtn) activeBtn.classList.add("active");
  try { localStorage.setItem("pune_ganpati_scale", scale); } catch(e) {}
}

function downloadKML() {
  const pageLang = document.documentElement.lang || "mr";
  let placemarks = "";
  document.querySelectorAll(".card").forEach((card, i) => {
    const title = card.querySelector("h2") ? card.querySelector("h2").innerText : places[i].name;
    const sub = card.querySelector(".subhead") ? card.querySelector(".subhead").innerText : "";
    placemarks += `
    <Placemark>
      <name>${title}</name>
      <description><![CDATA[<b>${sub}</b>]]></description>
      <Point><coordinates>${places[i].lng},${places[i].lat},0</coordinates></Point>
    </Placemark>`;
  });
  const kml = `<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>Pune Ganpati Tour</name>${placemarks}</Document></kml>`;
  const blob = new Blob([kml], { type: "application/vnd.google-earth.kml+xml" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `pune_ganpati_tour_${pageLang}.kml`;
  a.click();
}

let currentScale = 1, posX = 0, posY = 0, isDragging = false, startX = 0, startY = 0;
function setupLightbox() {
  const modal = document.createElement("div");
  modal.id = "modal";
  modal.innerHTML = `
    <div id="modal-bar">
      <span id="modal-title"></span>
      <div class="ctrl-btns">
        <button class="ctrl-btn" onclick="applyZoom(0.4)">＋</button>
        <button class="ctrl-btn" onclick="applyZoom(-0.4)">−</button>
        <button class="ctrl-btn" onclick="resetZoom()">⟲</button>
        <button class="ctrl-btn close-btn" onclick="closeModal()">✕</button>
      </div>
    </div>
    <div id="viewport"><img id="modal-img" src="" alt="View"></div>
  `;
  document.body.appendChild(modal);

  document.querySelectorAll(".img-box").forEach(box => {
    box.addEventListener("click", () => {
      const img = box.querySelector("img");
      const card = box.closest(".card");
      const title = card ? card.querySelector("h2").innerText : "";
      if (img) openModal(img.src, title);
    });
  });

  const modalImg = document.getElementById("modal-img");
  let lastTap = 0;
  modalImg.addEventListener("touchend", e => {
    const now = new Date().getTime();
    if (now - lastTap < 300 && now - lastTap > 0) {
      if (currentScale > 1.2) resetZoom();
      else { currentScale = 2.4; updateTransform(); }
      e.preventDefault();
    }
    lastTap = now;
  });

  modalImg.addEventListener("touchstart", e => {
    if (currentScale > 1 && e.touches.length === 1) {
      isDragging = true;
      startX = e.touches[0].clientX - posX;
      startY = e.touches[0].clientY - posY;
    }
  });

  modalImg.addEventListener("touchmove", e => {
    if (isDragging && currentScale > 1 && e.touches.length === 1) {
      posX = e.touches[0].clientX - startX;
      posY = e.touches[0].clientY - startY;
      updateTransform();
      e.preventDefault();
    }
  });

  modalImg.addEventListener("touchend", () => { isDragging = false; });
}

function openModal(src, title) {
  const modal = document.getElementById("modal");
  document.getElementById("modal-img").src = src;
  document.getElementById("modal-title").innerText = title;
  modal.style.display = "block";
  document.body.style.overflow = "hidden";
  resetZoom();
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
  document.body.style.overflow = "auto";
}

function updateTransform() {
  document.getElementById("modal-img").style.transform = `translate(${posX}px, ${posY}px) scale(${currentScale})`;
}

function applyZoom(delta) {
  currentScale = Math.min(Math.max(1, currentScale + delta), 4.5);
  if (currentScale === 1) { posX = 0; posY = 0; }
  updateTransform();
}

function resetZoom() {
  currentScale = 1; posX = 0; posY = 0;
  updateTransform();
}
