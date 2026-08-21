"""Shadow-targeted lift: strong where the room is dark, nothing where it is bright.

The mask is built from a heavily blurred luminance map, so it follows the big
lit/unlit regions of the room rather than individual dark pixels — a black mat
sitting in sunlight is left alone, the shaded near half of the floor is lifted.
Large blur radius keeps the transition wide enough that no halo appears round
the door frames.
"""
import sys
import numpy as np
from PIL import Image, ImageFilter

def lift(src, dst, strength, sat=1.05, quality=82):
    im = Image.open(src).convert("RGB")
    a = np.asarray(im).astype(np.float32) / 255.0
    # Rec.709 luma
    L = a[..., 0] * 0.2126 + a[..., 1] * 0.7152 + a[..., 2] * 0.0722

    # Low-frequency luminance: which REGION is dark, not which pixel.
    sigma = max(im.size) * 0.045
    base = np.asarray(
        Image.fromarray((L * 255).astype(np.uint8)).filter(
            ImageFilter.GaussianBlur(radius=sigma)
        )
    ).astype(np.float32) / 255.0

    # Mask: 1 in deep shade, tapering to 0 by the time a region is mid-bright.
    lo, hi = 0.18, 0.62
    m = np.clip((hi - base) / (hi - lo), 0.0, 1.0)
    m = m * m * (3 - 2 * m)  # smoothstep

    # Per-pixel gamma, varying with the mask.
    g = 1.0 + strength * m
    Lg = np.power(np.clip(L, 1e-4, 1.0), 1.0 / g)

    # Re-apply the new luminance, keeping hue and relative colour.
    gain = (Lg / np.clip(L, 1e-4, 1.0))[..., None]
    out = a * gain

    # Lifting flattens colour; put a little back, and roll off near white so
    # the garden does not go poster-ish.
    grey = out[..., 0] * 0.2126 + out[..., 1] * 0.7152 + out[..., 2] * 0.0722
    out = grey[..., None] + (out - grey[..., None]) * sat

    out = np.clip(out, 0, 1)
    Image.fromarray((out * 255 + 0.5).astype(np.uint8)).save(
        dst, quality=quality, method=6
    )
    return out

if __name__ == "__main__":
    src, dst, strength = sys.argv[1], sys.argv[2], float(sys.argv[3])
    o = lift(src, dst, strength)
    a = np.asarray(Image.open(src).convert("RGB")).astype(float) / 255
    print(f"{dst}  mean {a.mean()*255:.1f} -> {o.mean()*255:.1f}  "
          f"p5 {np.percentile(a,5)*255:.1f} -> {np.percentile(o,5)*255:.1f}  "
          f"clip255 {(a>=0.996).mean()*100:.2f}% -> {(o>=0.996).mean()*100:.2f}%")
