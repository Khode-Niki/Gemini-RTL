import os
import zlib
import struct

def create_png_raw(width, height, color):
    # Create a simple valid PNG from scratch using zlib
    # color: (R, G, B)
    # PNG signature
    png = bytearray([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])
    
    # IHDR chunk
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)
    
    def make_chunk(tag, data):
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', zlib.crc32(tag + data))
        
    png += make_chunk(b'IHDR', ihdr_data)
    
    # Scanlines: each line starts with a filter type byte (0) followed by RGB pixel bytes
    scanline = bytearray([0] + list(color) * width)
    idat_data = zlib.compress(scanline * height)
    png += make_chunk(b'IDAT', idat_data)
    png += make_chunk(b'IEND', b'')
    return png

# Try PIL for beautiful shapes, fallback to pure python binary writing
try:
    from PIL import Image, ImageDraw
    has_pil = True
except ImportError:
    has_pil = False

os.makedirs('icons', exist_ok=True)
sizes = [16, 48, 128]
colors = {
    16: (139, 92, 246),   # Violet
    48: (6, 182, 212),    # Cyan
    128: (139, 92, 246)   # Violet
}

for size in sizes:
    filepath = f'icons/icon{size}.png'
    if has_pil:
        img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        # Draw a beautiful circle representing a settings badge
        r = size // 2
        draw.ellipse([2, 2, size-3, size-3], fill=(16, 17, 34, 255), outline=(139, 92, 246, 255), width=max(1, size // 16))
        
        # Draw a sleek sparkle core
        cx, cy = size // 2, size // 2
        offset = size // 4
        draw.line([cx - offset, cy, cx + offset, cy], fill=(6, 182, 212, 255), width=max(1, size // 16))
        draw.line([cx, cy - offset, cx, cy + offset], fill=(6, 182, 212, 255), width=max(1, size // 16))
        draw.ellipse([cx - offset//2, cy - offset//2, cx + offset//2, cy + offset//2], fill=(255, 255, 255, 255))
        
        img.save(filepath)
        print(f"Generated PIL icon: {filepath}")
    else:
        png_bytes = create_png_raw(size, size, colors[size])
        with open(filepath, 'wb') as f:
            f.write(png_bytes)
        print(f"Generated raw fallback icon: {filepath}")

print("Icon generation completed!")
