import json
import os
from typing import List

from bs4 import BeautifulSoup
from ebooklib import epub, ITEM_DOCUMENT


def extract_text_from_item(item) -> str:
    """
    Given an ebooklib ITEM_DOCUMENT (XHTML), return a cleaned text string.
    Here we just join all <p> tags with blank lines between them.
    """
    html_bytes = item.get_content()
    soup = BeautifulSoup(html_bytes, "lxml")

    paragraphs = [
        p.get_text(separator=" ", strip=True)
        for p in soup.find_all("p")
    ]
    text = "\n\n".join(p for p in paragraphs if p)
    return text.strip()


def flatten_epub_text(epub_path: str) -> str:
    """
    Read the EPUB and return a single big string with all chapter texts
    concatenated in spine order.
    """
    book = epub.read_epub(epub_path)

    # Spine gives us the reading order: list of (idref, linear)
    spine_ids = [sp[0] for sp in book.spine]

    # Map from id -> document item
    id_to_item = {
        item.get_id(): item
        for item in book.get_items_of_type(ITEM_DOCUMENT)
    }

    parts: List[str] = []

    for idref in spine_ids:
        item = id_to_item.get(idref)
        if not item:
            continue
        chapter_text = extract_text_from_item(item)
        if chapter_text:
            # Separate chapters with two newlines
            parts.append(chapter_text)

    full_text = "\n\n".join(parts)
    return full_text


def text_to_locations(full_text: str, chars_per_location: int):
    """
    Split full_text into chunks of size chars_per_location and
    return a dict ready to be dumped as JSON.

    Each location just has:
      - index: which location it is (0-based)
      - text: the text chunk for that location
    """
    locations = []
    total_chars = len(full_text)

    index = 0
    for start in range(0, total_chars, chars_per_location):
        chunk = full_text[start:start + chars_per_location]
        locations.append({
            "index": index,
            "text": chunk,
        })
        index += 1

    return {
        "charsPerLocation": chars_per_location,
        "totalChars": total_chars,
        "totalLocations": len(locations),
        "locations": locations,
    }


def epub_to_locations_json(
    epub_path: str,
    json_out_path: str,
    chars_per_location: int = 1600,
):
    """
    High-level helper: EPUB -> locations JSON file.
    """
    full_text = flatten_epub_text(epub_path)
    data = text_to_locations(full_text, chars_per_location)

    os.makedirs(os.path.dirname(json_out_path) or ".", exist_ok=True)
    with open(json_out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Wrote {data['totalLocations']} locations to {json_out_path}")


if __name__ == "__main__":
    # Change 'book.epub' to your actual EPUB filename
    epub_to_locations_json(
        epub_path="Alice-In-Wonderland.epub",
        json_out_path="alice_locations.json",
        chars_per_location=1600,  # match this in your Reader settings
    )
