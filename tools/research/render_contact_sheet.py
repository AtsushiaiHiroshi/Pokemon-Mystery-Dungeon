"""Render representative pages from every core PDF into a visual audit sheet."""

from pathlib import Path

import pymupdf
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(r"C:\Users\Gamer\AppData\Local\FoundryVTT\Pokemon-Mystery-Dungeon")
OUTPUT = ROOT / "tmp" / "research" / "pdf-contact-sheet.png"
SOURCES = [
    (Path(r"C:\Users\Gamer\Documents\D&D\Homebrew\Pokémon\Manual PokeD&D Modo Aventura version 2 de 2026.pdf"), 2),
    (Path(r"C:\Users\Gamer\Documents\D&D\Homebrew\Pokémon\Resumen de funcionamiento de hoja personaje de pokednd.pdf"), 7),
    (Path(r"C:\Users\Gamer\Documents\D&D\Homebrew\Pokémon\Hoja de personaje PokeDyD.pdf"), 2),
    (Path(r"C:\Users\Gamer\Documents\D&D\Homebrew\Pokémon\Cronicas de Evaloren Libro de Aventura.pdf"), 3),
    (Path(r"C:\Users\Gamer\Documents\D&D\Homebrew\Pokémon\Gimnasios Pokemon y sus Lideres.pdf"), 2),
    (Path(r"C:\Users\Gamer\Documents\Pokemon Mystery Dungeon\Explorers! A PMD RPG\Explorers! A PMD RPG v1.0.pdf"), 8),
    (Path(r"C:\Users\Gamer\Documents\Pokemon Mystery Dungeon\Explorers! A PMD RPG\ExplorersCheatSheet.pdf"), 1),
    (Path(r"C:\Users\Gamer\Documents\Pokemon Mystery Dungeon\Explorers! A PMD RPG\Status Conditions.pdf"), 1),
    (Path(r"C:\Users\Gamer\Documents\Pokemon Mystery Dungeon\Explorers! A PMD RPG\Character Sheets\CharacterSheet_FormFillable.pdf"), 1),
    (Path(r"C:\Users\Gamer\Documents\Pokemon Mystery Dungeon\Mystery Dungeon TTRPG Rulebook _ GM Binder.pdf"), 4),
    (Path(r"C:\Users\Gamer\Documents\Pokemon Mystery Dungeon\Pokerole Mystery Dungeon.pdf"), 8),
    (Path(r"C:\Users\Gamer\Documents\Pokemon Mystery Dungeon\Pokémon Mystery Dungeon Tabletop Adventures\Player's Guide.pdf"), 5),
    (Path(r"C:\Users\Gamer\Documents\Pokemon Mystery Dungeon\Pokémon Mystery Dungeon Tabletop Adventures\Narrator's Guide and Resources\Narrator's Guide.pdf"), 18),
    (Path(r"C:\Users\Gamer\Documents\Pokemon Mystery Dungeon\Pokémon Mystery Dungeon Tabletop Adventures\PMDTA Optional.pdf"), 1),
]

THUMB_W = 320
THUMB_H = 390
LABEL_H = 58
COLS = 4
ROWS = (len(SOURCES) + COLS - 1) // COLS
canvas = Image.new("RGB", (COLS * THUMB_W, ROWS * (THUMB_H + LABEL_H)), "white")
draw = ImageDraw.Draw(canvas)
font = ImageFont.load_default(size=16)

for index, (source, page_number) in enumerate(SOURCES):
    document = pymupdf.open(source)
    page = document.load_page(page_number - 1)
    pixmap = page.get_pixmap(matrix=pymupdf.Matrix(0.7, 0.7), alpha=False)
    image = Image.frombytes("RGB", (pixmap.width, pixmap.height), pixmap.samples)
    image.thumbnail((THUMB_W - 12, THUMB_H - 12))
    col = index % COLS
    row = index // COLS
    x = col * THUMB_W + (THUMB_W - image.width) // 2
    y = row * (THUMB_H + LABEL_H) + 6
    canvas.paste(image, (x, y))
    label = f"{source.name}\np. {page_number}"
    draw.multiline_text(
        (col * THUMB_W + 6, row * (THUMB_H + LABEL_H) + THUMB_H),
        label,
        fill="black",
        font=font,
        spacing=2,
    )

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
canvas.save(OUTPUT)
print(OUTPUT)
