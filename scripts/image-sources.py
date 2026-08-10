#!/usr/bin/env python3
"""Sift the site's photographs against the originals they were cut from.

The Studham studio photographs shipped at 1000px because that is the size they
were exported at, not because that is all the camera caught — the originals are
2048x1536, and at 52vw on a retina screen a 1000px file is stretched half again
past what it has. That is not a mistake anyone can see by reading the markup:
the derivative and its original have different names, different folders and
often a different shape, because the web copy is usually a crop.

So this matches on pixels rather than on filenames. For every photograph the
site references it looks through the source folders for a file whose contents
contain it — a straight resize, or the frame the crop was lifted out of — and
reports the ones where the original still holds detail we are not shipping.

    python3 scripts/image-sources.py              # report
    python3 scripts/image-sources.py --apply      # re-cut the ones worth it
    python3 scripts/image-sources.py --sources ~/Shoot ~/Downloads

--apply writes one new file per photograph, at the largest size its original
supports, next to the existing variants and named for its width. It never
overwrites and it never touches markup: adding the new file to a srcset is a
separate, deliberate edit, because how a photograph is delivered depends on the
frame it sits in and this script cannot know that.

Needs numpy, opencv-python and Pillow.
"""

import argparse
import glob
import os
import re
import sys

try:
    import cv2
    import numpy as np
    from PIL import Image
except ImportError as exc:  # pragma: no cover - a setup problem, not a bug
    sys.exit(f"missing dependency: {exc}.\n  pip install numpy opencv-python Pillow")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(ROOT, "public")

# The comparison runs on 64x64 greyscale. Small enough that a hundred source
# files times a slide of twenty-one window positions is seconds rather than
# minutes, and large enough that two photographs of the same room from the same
# corner still score apart.
N = 64
# Source files are held in memory at this size. Only the winner is ever read
# back at full resolution.
WORK = 640
# Below this a match is two different pictures that happen to share a wall.
MATCH_FLOOR = 0.90
# And below this a gain is not worth a new file: a photograph already covering
# nine tenths of its slot is not what anyone is seeing when they say soft.
GAIN_FLOOR = 1.15

# Drawn assets, not photographs. They have no camera original and their sources
# are vectors, so a raster match against them is noise.
SKIP = re.compile(r"linework|animated|logos/|njh-mark|favicon|-orb-|wave|COMP")

SOURCE_DEFAULTS = ["~/Downloads", "~/Desktop", os.path.join(PUBLIC, "images/legacy")]
SOURCE_EXTS = (".jpg", ".jpeg", ".png", ".webp")
# Shoots arrive as folders — ~/Downloads/Studio held the best photographs of the
# room and a flat search walked straight past them. Depth is capped so a source
# folder that happens to sit above a checkout does not drag the world in.
SOURCE_DEPTH = 3
SOURCE_PRUNE = {"node_modules", "dist", ".git", "Library", "Applications"}


def thumb(img):
    """A contrast-normalised 64x64 signature, so exposure differences between
    an export and its original do not read as a different picture."""
    grey = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    grey = cv2.resize(grey, (N, N), interpolation=cv2.INTER_AREA).astype(np.float32)
    grey -= grey.mean()
    spread = grey.std()
    return grey / spread if spread > 1e-6 else grey


def family(path):
    """Variants of one photograph share a name once the width is taken off it:
    room-mats-500 and room-mats-1000 are one photograph shipped twice, and it is
    the largest of them that has to answer for how sharp the page looks."""
    stem = os.path.splitext(os.path.basename(path))[0]
    return re.sub(r"-\d+$", "", stem)


def referenced():
    """Every image path the site actually asks for. Reading the source rather
    than the folder keeps retired files out of the report."""
    found = set()
    pattern = re.compile(r"/images/[A-Za-z0-9_/.-]+\.(?:webp|jpg|jpeg|png)")
    sources = [os.path.join(ROOT, "index.html")]
    sources += glob.glob(os.path.join(ROOT, "src/**/*.js"), recursive=True)
    for path in sources:
        with open(path, encoding="utf-8", errors="ignore") as handle:
            found.update(pattern.findall(handle.read()))
    return sorted(found)


def load_shipped():
    groups = {}
    for ref in referenced():
        if SKIP.search(ref):
            continue
        path = os.path.join(PUBLIC, ref.lstrip("/"))
        if not os.path.exists(path):
            continue
        img = cv2.imread(path)
        if img is None or min(img.shape[:2]) < 200:
            continue
        h, w = img.shape[:2]
        groups.setdefault(family(ref), []).append((ref, path, w, h, img))
    # Only the largest variant of each photograph is judged; the smaller ones
    # are the responsive set doing its job.
    return {name: max(v, key=lambda e: e[2]) for name, v in groups.items()}


def walk_sources(folders):
    """Every image file under the source folders, subfolders included."""
    for folder in folders:
        base = os.path.expanduser(folder)
        if not os.path.isdir(base):
            print(f"  (no such source folder: {folder})")
            continue
        depth0 = base.rstrip(os.sep).count(os.sep)
        for here, dirs, files in os.walk(base):
            dirs[:] = [
                d for d in dirs
                if not d.startswith(".") and d not in SOURCE_PRUNE
                and here.count(os.sep) - depth0 < SOURCE_DEPTH
            ]
            for name in files:
                if os.path.splitext(name)[1].lower() in SOURCE_EXTS:
                    yield os.path.join(here, name)


def load_sources(folders):
    seen, out = {}, []
    for path in walk_sources(folders):
        img = cv2.imread(path)
        if img is None or min(img.shape[:2]) < 400:
            continue
        h, w = img.shape[:2]
        scale = WORK / max(h, w)
        small = (
            cv2.resize(img, (max(1, int(w * scale)), max(1, int(h * scale))),
                       interpolation=cv2.INTER_AREA)
            if scale < 1 else img
        )
        # "IMG_0341 2.JPG" beside "IMG_0341.JPG" is the same photograph twice;
        # comparing against both only doubles the work. The bigger copy wins,
        # so a folder holding both an export and its original keeps the original.
        sig = thumb(small).round(1).tobytes()
        if sig in seen:
            at = seen[sig]
            if w > out[at][1]:
                out[at] = (path, w, h, small)
            continue
        seen[sig] = len(out)
        out.append((path, w, h, small))
    return out


def window(img, ratio):
    """The crops of `img` with the wanted aspect ratio, walked along its long
    axis. A web copy is usually a crop, so the original rarely matches whole."""
    h, w = img.shape[:2]
    if w / h >= ratio:
        win_h, win_w = h, int(round(h * ratio))
        span, horizontal = w - win_w, True
    else:
        win_w, win_h = w, int(round(w / ratio))
        span, horizontal = h - win_h, False
    if win_w < 8 or win_h < 8:
        return
    for i in range(21):
        off = int(span * i / 20) if span > 0 else 0
        yield (img[:, off:off + win_w] if horizontal
               else img[off:off + win_h, :])


def best_offset(img, target, ratio):
    """The winning crop again, this time to the pixel and at full size."""
    h, w = img.shape[:2]
    horizontal = w / h >= ratio
    win_w = int(round(h * ratio)) if horizontal else w
    win_h = h if horizontal else int(round(w / ratio))
    span = (w - win_w) if horizontal else (h - win_h)
    best = (-9.0, 0)
    for off in range(max(span, 0) + 1):
        crop = (img[:, off:off + win_w] if horizontal
                else img[off:off + win_h, :])
        score = float((target * thumb(crop)).mean())
        if score > best[0]:
            best = (score, off)
    return best[1], best[0], win_w, win_h, horizontal


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--apply", action="store_true",
                        help="re-cut the photographs worth redoing")
    parser.add_argument("--sources", nargs="*", default=SOURCE_DEFAULTS,
                        help="folders to search for originals")
    parser.add_argument("--quality", type=int, default=80,
                        help="webp quality for --apply (default 80)")
    parser.add_argument("--only", nargs="*", default=None, metavar="PATTERN",
                        help="restrict to photographs whose path contains any "
                             "of these, e.g. --only room-mats chair-doors")
    args = parser.parse_args()

    shipped = load_shipped()
    if args.only:
        shipped = {
            name: entry for name, entry in shipped.items()
            if any(p in entry[0] for p in args.only)
        }
        missing = [p for p in args.only
                   if not any(p in e[0] for e in shipped.values())]
        for p in missing:
            print(f"  (--only {p} matched nothing)")
    sources = load_sources(args.sources)
    print(f"{len(shipped)} photographs referenced, "
          f"{len(sources)} distinct sources in {', '.join(args.sources)}\n")

    findings, unmatched = [], []
    for name, (ref, path, w, h, img) in sorted(shipped.items()):
        target = thumb(img)
        ratio = w / h
        best = (-9.0, None)
        for cand in sources:
            # A photograph is not its own source. Source folders can overlap the
            # checkout — ~/Desktop contains this project — and without this every
            # image matches the file it was read from at 1.00x, which scores
            # higher than the original ever can and silently answers "nothing to
            # redo" for the whole site. Siblings go too: room-mats-1346 is an
            # output of the same pipeline, not something room-mats-1000 came from.
            if cand[0].startswith(PUBLIC) and family(cand[0]) == name:
                continue
            score = max((float((target * thumb(c)).mean())
                         for c in window(cand[3], ratio)), default=-9.0)
            if score > best[0]:
                best = (score, cand)
        score, cand = best
        if not cand or score < MATCH_FLOOR:
            unmatched.append((ref, w, score))
            continue
        cpath, cw, ch, _ = cand
        available = int(round(min(cw, ch * ratio)))
        gain = available / w
        if gain >= GAIN_FLOOR:
            findings.append((gain, name, ref, w, available, score, cpath))

    findings.sort(reverse=True)
    if not findings:
        print("Nothing to redo — every photograph ships at its original's size.")
    for gain, name, ref, w, available, score, cpath in findings:
        print(f"{gain:4.2f}x  {w:>5} -> {available:<5} (match {score:.3f})  {ref}")
        print(f"{'':>14}{os.path.basename(cpath)}")

    if unmatched:
        print(f"\nNo original found for {len(unmatched)}:")
        for ref, w, score in sorted(unmatched):
            print(f"       {w:>5}         (best {score:.3f})  {ref}")

    if not args.apply:
        if findings:
            print(f"\n{len(findings)} to redo. Re-run with --apply to cut them.")
        return

    print()
    for gain, name, ref, w, available, score, cpath in findings:
        img = cv2.imread(cpath)
        current = cv2.imread(os.path.join(PUBLIC, ref.lstrip("/")))
        ratio = current.shape[1] / current.shape[0]
        off, fine, win_w, win_h, horizontal = best_offset(img, thumb(current), ratio)
        crop = (img[:, off:off + win_w] if horizontal
                else img[off:off + win_h, :])
        # Follow the format already shipped rather than assuming webp: a .png
        # in here is drawn artwork, and putting linework through a lossy
        # encoder to gain pixels trades one kind of soft for another.
        ext = os.path.splitext(ref)[1].lower()
        ext = ext if ext in (".png", ".webp") else ".webp"
        out = os.path.join(PUBLIC, os.path.dirname(ref.lstrip("/")),
                           f"{name}-{win_w}{ext}")
        if os.path.exists(out):
            print(f"  skipped, exists: {os.path.basename(out)}")
            continue
        picture = Image.fromarray(cv2.cvtColor(crop, cv2.COLOR_BGR2RGB))
        if ext == ".png":
            picture.save(out, "PNG", optimize=True)
        else:
            picture.save(out, "WEBP", quality=args.quality, method=6)
        note = "  <-- CHECK, low match" if fine < 0.99 else ""
        print(f"  {os.path.basename(out)}  {win_w}x{win_h}  "
              f"{os.path.getsize(out) // 1024} kB  match {fine:.4f}{note}")

    print("\nFiles written. Nothing is wired up: add each to its srcset by hand.")


if __name__ == "__main__":
    main()
