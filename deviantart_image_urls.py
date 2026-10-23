#!/usr/bin/env python3
"""Resolve DeviantArt artwork pages to their public WixMP image URLs.

1. Paste DeviantArt artwork-page URLs into DEVIANTART_URLS below.
2. Run: python3 deviantart_image_urls.py
3. Copy each value printed as "image_url" into src/data.js.

The script uses the public Open Graph image on every artwork page, with a
WixMP URL fallback. DeviantArt can change or protect image URLs, so rerun it
if a previously generated link stops working.
"""

from __future__ import annotations

import html
import json
import re
import sys
from html.parser import HTMLParser
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen


# Add artwork page URLs here, one per line.
DEVIANTART_URLS = [
    "https://www.deviantart.com/metalex10/art/first-OC-963796563"
]

USER_AGENT = "Mozilla/5.0 (compatible; portfolio-image-link-helper/1.0)"
WIXMP_PATTERN = re.compile(r"https://images-wixmp[^\"'<\s]+", re.IGNORECASE)


class OpenGraphImageParser(HTMLParser):
    """Collect the page's og:image value without external dependencies."""

    def __init__(self) -> None:
        super().__init__()
        self.image_url: str | None = None

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag.lower() != "meta" or self.image_url:
            return

        values = {name.lower(): value for name, value in attrs if value}
        if values.get("property", "").lower() == "og:image":
            self.image_url = values.get("content")


def normalise_url(value: str) -> str:
    """Decode URL escapes used in DeviantArt's embedded page data."""
    return html.unescape(value).replace("\\/", "/").replace("\\u0026", "&")


def is_deviantart_artwork_url(url: str) -> bool:
    hostname = urlparse(url).hostname or ""
    return hostname.lower().endswith("deviantart.com")


def fetch_image_url(artwork_url: str) -> str:
    if not is_deviantart_artwork_url(artwork_url):
        raise ValueError("Expected a DeviantArt artwork-page URL")

    request = Request(
        artwork_url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "text/html,application/xhtml+xml",
        },
    )
    with urlopen(request, timeout=20) as response:  # noqa: S310 - URL is validated above.
        page = response.read().decode(response.headers.get_content_charset() or "utf-8", "replace")

    parser = OpenGraphImageParser()
    parser.feed(page)
    if parser.image_url and "images-wixmp" in parser.image_url:
        return normalise_url(parser.image_url)

    decoded_page = normalise_url(page)
    match = WIXMP_PATTERN.search(decoded_page)
    if match:
        return normalise_url(match.group(0))

    raise RuntimeError("No public WixMP image URL was found on the artwork page")


def main() -> int:
    if not DEVIANTART_URLS:
        print("Add DeviantArt artwork URLs to DEVIANTART_URLS, then run this script again.")
        return 0

    results = []
    for artwork_url in DEVIANTART_URLS:
        try:
            results.append({"artwork_url": artwork_url, "image_url": fetch_image_url(artwork_url)})
        except (HTTPError, URLError, ValueError, RuntimeError) as error:
            results.append({"artwork_url": artwork_url, "error": str(error)})

    print(json.dumps(results, indent=2, ensure_ascii=False))
    return 1 if any("error" in result for result in results) else 0


if __name__ == "__main__":
    sys.exit(main())
