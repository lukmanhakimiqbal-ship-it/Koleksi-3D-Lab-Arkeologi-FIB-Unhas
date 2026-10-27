# Koleksi 3D Laboratorium Arkeologi FIB Unhas

Situs statis untuk menampilkan koleksi 3D hasil fotogrametri. Tanpa server dan tanpa build; berjalan di GitHub Pages.

## Struktur
- `index.html`, `style.css`, `app.js`: situs
- `data/koleksi.json`: metadata koleksi
- `models/`: file model `.glb` (nama = kode, mis. `ARK-001.glb`)
- `posters/`: gambar pratinjau `.jpg` (opsional)
- `tools/xlsx_to_json.py`: buat `koleksi.json` dari Excel

## Menambah objek
1. Ekspor model dari Metashape/RealityCapture ke `.glb`, lalu letakkan di `models/KODE.glb`.
2. Tambahkan entri di `data/koleksi.json`, atau isi Excel lalu jalankan `python tools/xlsx_to_json.py inventaris.xlsx`.
3. Commit dan push.

Tips: kompres model dengan `gltf-transform optimize in.glb out.glb` (target di bawah 25 MB per file; batas GitHub 100 MB).

## Deploy
1. Buat repositori di GitHub, lalu push seluruh isi folder ini ke cabang `main`.
2. Settings > Pages > Source: **GitHub Actions**.
3. Situs aktif di `https://<username>.github.io/<nama-repo>/`.

## Uji lokal
```
python -m http.server 8000
```
Buka http://localhost:8000
