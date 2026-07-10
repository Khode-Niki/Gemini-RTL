import os
from PIL import Image

source_path = os.path.join('icons', 'Google_Gemini_icon.webp')
sizes = [16, 48, 128]

if not os.path.exists(source_path):
    print(f"Error: {source_path} does not exist!")
    exit(1)

try:
    img = Image.open(source_path)
    os.makedirs('icons', exist_ok=True)
    
    for size in sizes:
        # Resize using Lanczos resampling for high quality scaling
        resized_img = img.resize((size, size), Image.Resampling.LANCZOS)
        filepath = os.path.join('icons', f'icon{size}.png')
        resized_img.save(filepath, 'PNG')
        print(f"Successfully generated: {filepath}")
        
    print("Icon generation from Google_Gemini_icon.webp completed!")
except Exception as e:
    print(f"Error converting WebP to PNG icons: {e}")
