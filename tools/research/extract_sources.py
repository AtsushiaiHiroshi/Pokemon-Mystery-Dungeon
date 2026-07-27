"""Extract the PMD reference library page by page, using OCR when required."""

from __future__ import annotations

import json
import hashlib
import re
import subprocess
import sys
import time
import unicodedata
from pathlib import Path

import pymupdf
from pypdf import PdfReader


ROOT = Path(r"C:\Users\Gamer\AppData\Local\FoundryVTT\Pokemon-Mystery-Dungeon")
OUTPUT = ROOT / "tmp" / "research"
PAGES = OUTPUT / "pages"
IMAGES = OUTPUT / "images"
PROGRESS = OUTPUT / "progress.json"
CATALOG = OUTPUT / "catalog.json"
TESSERACT = Path(r"C:\Program Files\Tesseract-OCR\tesseract.exe")
TESSDATA = ROOT / "tmp" / "ocr" / "tessdata"
PDFTOPPM = Path(
    r"C:\Users\Gamer\.cache\codex-runtimes\codex-primary-runtime"
    r"\dependencies\native\poppler\Library\bin\pdftoppm.exe"
)
RENDER_DOCUMENTS: dict[str, pymupdf.Document] = {}

SOURCE_ROOTS = [
    Path(r"C:\Users\Gamer\Documents\D&D\Homebrew\Pokémon"),
    Path(r"C:\Users\Gamer\Documents\Pokemon Mystery Dungeon"),
]

CORE_NAMES = {
    "Cronicas de Evaloren Libro de Aventura.pdf",
    "Gimnasios Pokemon y sus Lideres.pdf",
    "Hoja de personaje PokeDyD.pdf",
    "Manual PokeD&D Modo Aventura version 2 de 2026.pdf",
    "Resumen de funcionamiento de hoja personaje de pokednd.pdf",
    "CharacterSheet_FormFillable.pdf",
    "CharacterSheet_PrintSafe.pdf",
    "Explorers! A PMD RPG v1.0.pdf",
    "ExplorersCheatSheet.pdf",
    "Status Conditions.pdf",
    "Mystery Dungeon TTRPG Rulebook _ GM Binder.pdf",
    "Pokerole Mystery Dungeon.pdf",
    "Narrator's Guide.pdf",
    "Player's Guide.pdf",
    "PMDTA Optional.pdf",
}


def slug(path: Path) -> str:
    normalized = unicodedata.normalize("NFKD", path.stem)
    ascii_name = normalized.encode("ascii", "ignore").decode("ascii")
    return re.sub(r"[^a-zA-Z0-9]+", "-", ascii_name).strip("-").lower()


def text_quality(text: str) -> float:
    if not text.strip():
        return 0.0
    useful = sum(char.isalnum() or char.isspace() or char in ".,:;!?()[]%+-/°" for char in text)
    return useful / len(text)


def write_progress(**values: object) -> None:
    current = {}
    if PROGRESS.exists():
        current = json.loads(PROGRESS.read_text(encoding="utf-8"))
    current.update(values)
    current["updated_at"] = time.time()
    PROGRESS.write_text(json.dumps(current, ensure_ascii=False, indent=2), encoding="utf-8")


def ocr_page(pdf: Path, page_number: int, image_prefix: Path) -> str:
    image = image_prefix.with_suffix(".png")
    document = RENDER_DOCUMENTS.setdefault(str(pdf), pymupdf.open(str(pdf)))
    page = document.load_page(page_number - 1)
    scale = 110 / 72
    page.get_pixmap(matrix=pymupdf.Matrix(scale, scale), alpha=False).save(image)
    result = subprocess.run(
        [
            str(TESSERACT),
            str(image),
            "stdout",
            "--tessdata-dir",
            str(TESSDATA),
            "-l",
            "spa+eng",
            "--psm",
            "11",
        ],
        check=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        timeout=45,
    )
    image.unlink(missing_ok=True)
    return result.stdout.strip()


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    PAGES.mkdir(parents=True, exist_ok=True)
    IMAGES.mkdir(parents=True, exist_ok=True)

    all_pdfs = sorted(
        path
        for source_root in SOURCE_ROOTS
        for path in source_root.rglob("*.pdf")
    )
    review_pdfs = all_pdfs
    base_keys: dict[str, int] = {}
    for pdf in review_pdfs:
        base = slug(pdf)
        base_keys[base] = base_keys.get(base, 0) + 1
    catalog = {
        "sources": [str(path) for path in all_pdfs],
        "core_sources": [str(path) for path in all_pdfs if path.name in CORE_NAMES],
        "documents": [],
    }
    total_pages = 0
    for pdf in review_pdfs:
        total_pages += len(PdfReader(str(pdf)).pages)

    processed = 0
    write_progress(status="running", documents=0, pages=0, total_pages=total_pages)
    for document_index, pdf in enumerate(review_pdfs, start=1):
        reader = PdfReader(str(pdf))
        key = slug(pdf)
        if base_keys[key] > 1:
            suffix = hashlib.sha1(str(pdf.parent).encode("utf-8")).hexdigest()[:8]
            key = f"{key}-{suffix}"
        document_dir = PAGES / key
        document_dir.mkdir(parents=True, exist_ok=True)
        record = {
            "path": str(pdf),
            "key": key,
            "pages": len(reader.pages),
            "ocr_pages": [],
            "text_pages": [],
            "errors": [],
        }
        for page_index, page in enumerate(reader.pages, start=1):
            page_file = document_dir / f"{page_index:04d}.txt"
            cached = page_file.read_text(encoding="utf-8") if page_file.exists() else ""
            retry_cached = "[METHOD] extract-fallback" in cached or not cached.strip()
            if page_file.exists() and not retry_cached:
                text = page_file.read_text(encoding="utf-8")
                method = "cached"
            else:
                try:
                    extracted = page.extract_text() or ""
                except Exception as exc:  # noqa: BLE001
                    extracted = ""
                    record["errors"].append({"page": page_index, "extract": str(exc)})
                quality = text_quality(extracted)
                needs_ocr = len(extracted.strip()) < 80 or quality < 0.82
                if needs_ocr:
                    try:
                        text = ocr_page(pdf, page_index, IMAGES / f"{key}-{page_index:04d}")
                        method = "ocr"
                        record["ocr_pages"].append(page_index)
                    except Exception as exc:  # noqa: BLE001
                        text = extracted
                        method = "extract-fallback"
                        record["errors"].append({"page": page_index, "ocr": str(exc)})
                else:
                    text = extracted
                    method = "text"
                    record["text_pages"].append(page_index)
                page_file.write_text(
                    f"[SOURCE] {pdf}\n[PAGE] {page_index}\n[METHOD] {method}\n\n{text}\n",
                    encoding="utf-8",
                )
            processed += 1
            write_progress(
                status="running",
                document=str(pdf),
                document_index=document_index,
                documents=len(review_pdfs),
                page=page_index,
                pages=processed,
                total_pages=total_pages,
            )
        catalog["documents"].append(record)
        CATALOG.write_text(
            json.dumps(catalog, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )

    write_progress(status="complete", pages=processed, total_pages=total_pages, error=None)
    print(json.dumps({"documents": len(review_pdfs), "pages": processed}, ensure_ascii=False))


if __name__ == "__main__":
    try:
        main()
    except Exception as error:  # noqa: BLE001
        write_progress(status="failed", error=str(error))
        raise
