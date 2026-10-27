const $ = (s) => document.querySelector(s);
const FIELDS = [["kategori","f-kategori"],["bahan","f-bahan"],["periode","f-periode"]];
let koleksi = [];

fetch("data/koleksi.json")
  .then((r) => r.json())
  .then((d) => { koleksi = d; initFilters(); render(); })
  .catch(() => { $("#grid").innerHTML = '<p class="empty">Data koleksi gagal dimuat. Periksa data/koleksi.json.</p>'; });

function initFilters() {
  FIELDS.forEach(([key, id]) => {
    [...new Set(koleksi.map((k) => k[key]).filter(Boolean))].sort().forEach((v) => {
      const o = document.createElement("option"); o.value = o.textContent = v; $("#" + id).append(o);
    });
    $("#" + id).addEventListener("change", render);
  });
  $("#q").addEventListener("input", render);
  $("#reset").addEventListener("click", () => {
    $("#q").value = ""; FIELDS.forEach(([, id]) => ($("#" + id).value = "")); render();
  });
}

const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

function render() {
  const q = $("#q").value.trim().toLowerCase();
  const list = koleksi.filter((k) =>
    FIELDS.every(([key, id]) => !$("#" + id).value || k[key] === $("#" + id).value) &&
    (!q || [k.nama, k.kode, k.situs, k.deskripsi].join(" ").toLowerCase().includes(q)));
  $("#count").textContent = `${list.length} dari ${koleksi.length} objek`;
  $("#grid").innerHTML = list.length ? list.map((k) => `
    <button class="card" data-id="${esc(k.kode)}">
      <div class="thumb" style="${k.poster ? `background-image:url('${esc(k.poster)}')` : ""}">${k.poster ? "" : "Pratinjau 3D"}</div>
      <div class="card-body">
        <h2>${esc(k.nama)}</h2>
        <p class="kode">${esc(k.kode)}</p>
        <div class="tags">${[k.kategori, k.bahan].filter(Boolean).map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
      </div>
    </button>`).join("") : '<p class="empty">Tidak ada objek yang cocok. Ubah kata kunci atau atur ulang penyaring.</p>';
  document.querySelectorAll(".card").forEach((c) => c.addEventListener("click", () => openDetail(c.dataset.id)));
}

function openDetail(kode) {
  const k = koleksi.find((x) => x.kode === kode); if (!k) return;
  const mv = $("#mv"), err = $("#mv-error");
  err.hidden = true;
  mv.onerror = () => (err.hidden = false);
  mv.addEventListener("error", () => (err.hidden = false), { once: true });
  mv.setAttribute("alt", "Model 3D " + k.nama);
  mv.setAttribute("src", k.model);
  mv.setAttribute("orientation", k.orientasi || "0deg 0deg 0deg");
  if (k.poster) mv.setAttribute("poster", k.poster); else mv.removeAttribute("poster");
  const rows = [["Kode", k.kode], ["Kategori", k.kategori], ["Bahan", k.bahan], ["Periode", k.periode],
    ["Situs", k.situs], ["Dimensi", k.dimensi], ["Kondisi", k.kondisi], ["Tahun akuisisi", k.tahun]]
    .filter(([, v]) => v);
  $("#info").innerHTML = `<h2>${esc(k.nama)}</h2>
    <dl>${rows.map(([a, b]) => `<dt>${a}</dt><dd>${esc(b)}</dd>`).join("")}</dl>
    ${k.deskripsi ? `<p>${esc(k.deskripsi)}</p>` : ""}`;
  $("#detail").showModal();
  history.replaceState(null, "", "#" + encodeURIComponent(kode));
}

$("#close").addEventListener("click", () => $("#detail").close());
$("#detail").addEventListener("close", () => history.replaceState(null, "", location.pathname));
$("#detail").addEventListener("click", (e) => { if (e.target.id === "detail") e.target.close(); });
window.addEventListener("load", () => {
  const h = decodeURIComponent(location.hash.slice(1));
  if (h) setTimeout(() => openDetail(h), 500);
});
