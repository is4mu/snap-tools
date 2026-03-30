#!/usr/bin/env python3
"""1200x630 の OG 画像を img/og-default.png に出力する（Pillow 必須）。"""
from __future__ import annotations

import os
import sys

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("Pillow が必要です: pip install Pillow", file=sys.stderr)
    sys.exit(1)

W, H = 1200, 630
BG = (13, 17, 23)  # ダーク背景（サイトのトーンに近い）
ACCENT = (0, 123, 255)  # --snap-accent に近い


def main() -> None:
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    out = os.path.join(root, "img", "og-default.png")
    os.makedirs(os.path.dirname(out), exist_ok=True)

    im = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(im)
    draw.rectangle([0, H - 6, W, H], fill=ACCENT)

    title = "Snap Tools"
    sub = "パッと使えるウェブツール集"

    # フォント（Noto は未インストール環境もあるのでフォールバック）
    font_paths = [
        "/System/Library/Fonts/ヒラギノ角ゴシック W6.ttc",
        "/System/Library/Fonts/Supplemental/Hiragino Sans GB.ttc",
        "/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc",
    ]
    font_title = None
    font_sub = None
    for fp in font_paths:
        if os.path.isfile(fp):
            try:
                font_title = ImageFont.truetype(fp, 72)
                font_sub = ImageFont.truetype(fp, 32)
                break
            except OSError:
                continue
    if font_title is None:
        font_title = ImageFont.load_default()
        font_sub = ImageFont.load_default()

    tx = 80
    ty = H // 2 - 60
    draw.text((tx, ty), title, fill=(255, 255, 255), font=font_title)
    draw.text((tx, ty + 88), sub, fill=(200, 210, 225), font=font_sub)

    im.save(out, "PNG", optimize=True)
    print("Wrote", out)


if __name__ == "__main__":
    main()
