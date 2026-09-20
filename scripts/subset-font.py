"""python subset-font.py /path/to/full-fusion-pixel.woff2 (fonttools + brotli)."""
from pathlib import Path
import sys
from fontTools import subset
from fontTools.ttLib import TTFont
root = Path(__file__).resolve().parents[1]
text = ''.join(p.read_text() for pattern in ['js/*.js', 'data/**/*.js', 'index.html'] for p in root.glob(pattern))
font = TTFont(sys.argv[1])
options = subset.Options()
options.flavor = 'woff2'
subsetter = subset.Subsetter(options=options)
subsetter.populate(text=text + ''.join(chr(i) for i in range(32, 127)))
subsetter.subset(font)
font.save(root / 'assets/fonts/fusion-pixel-12px-monospaced-zh_hans.woff2')
