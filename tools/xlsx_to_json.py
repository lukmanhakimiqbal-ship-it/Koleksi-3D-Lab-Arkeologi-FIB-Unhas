"""Ubah inventaris Excel menjadi data/koleksi.json.
Pemakaian: python tools/xlsx_to_json.py inventaris.xlsx
Baris pertama = header: kode, nama, kategori, bahan, periode, situs,
dimensi, kondisi, tahun, deskripsi. Kolom model dan poster dibuat otomatis
dari kode (models/<kode>.glb, posters/<kode>.jpg) bila filenya ada."""
import json, sys
from pathlib import Path
from openpyxl import load_workbook

src = Path(sys.argv[1])
ws = load_workbook(src, data_only=True).active
rows = list(ws.iter_rows(values_only=True))
head = [str(h).strip().lower() for h in rows[0]]
root = Path(__file__).resolve().parent.parent
out = []
for r in rows[1:]:
    d = {h: ("" if v is None else str(v).strip()) for h, v in zip(head, r)}
    if not d.get("kode"):
        continue
    d["model"] = f"models/{d['kode']}.glb"
    poster = root / "posters" / f"{d['kode']}.jpg"
    d["poster"] = f"posters/{d['kode']}.jpg" if poster.exists() else ""
    out.append(d)
(root / "data" / "koleksi.json").write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"{len(out)} objek ditulis ke data/koleksi.json")
