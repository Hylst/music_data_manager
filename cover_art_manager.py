import os
import sys
from mutagen.mp3 import MP3
from mutagen.id3 import ID3, APIC
from PIL import Image
import io

def extract_cover_art(directory):
    """
    Extract cover art from all MP3 files in the given directory and its subdirectories.
    Save each cover art as a JPG file with the same name as the MP3 file.
    """
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith('.mp3'):
                mp3_path = os.path.join(root, file)
                try:
                    audio = MP3(mp3_path, ID3=ID3)
                    
                    # Check if the file has ID3 tags and cover art
                    if 'APIC:' in audio.tags:
                        cover_art = audio.tags['APIC:'].data
                        img = Image.open(io.BytesIO(cover_art))
                        
                        # Save the cover art as JPG
                        jpg_path = os.path.splitext(mp3_path)[0] + '.jpg'
                        img.save(jpg_path, 'JPEG')
                        print(f"Extracted cover art: {jpg_path}")
                    else:
                        print(f"No cover art found in: {mp3_path}")
                except Exception as e:
                    print(f"Error processing {mp3_path}: {str(e)}")

def update_cover_art(directory):
    """
    Update cover art of MP3 files based on corresponding JPG files in the given directory and its subdirectories.
    """
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith('.mp3'):
                mp3_path = os.path.join(root, file)
                jpg_path = os.path.splitext(mp3_path)[0] + '.jpg'
                
                if os.path.exists(jpg_path):
                    try:
                        # Open the JPG file
                        with open(jpg_path, 'rb') as jpg_file:
                            jpg_data = jpg_file.read()
                        
                        # Update the MP3 file's cover art
                        audio = MP3(mp3_path, ID3=ID3)
                        audio.tags.add(
                            APIC(
                                encoding=3,  # 3 is for utf-8
                                mime='image/jpeg',
                                type=3,  # 3 is for the cover image
                                desc='Cover',
                                data=jpg_data
                            )
                        )
                        audio.save()
                        print(f"Updated cover art for: {mp3_path}")
                    except Exception as e:
                        print(f"Error updating cover art for {mp3_path}: {str(e)}")
                else:
                    print(f"No corresponding JPG found for: {mp3_path}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python cover_art_manager.py <extract|update> <directory>")
        sys.exit(1)

    action = sys.argv[1].lower()
    directory = sys.argv[2]

    if not os.path.isdir(directory):
        print(f"Error: {directory} is not a valid directory")
        sys.exit(1)

    if action == "extract":
        extract_cover_art(directory)
    elif action == "update":
        update_cover_art(directory)
    else:
        print("Invalid action. Use 'extract' or 'update'")
        sys.exit(1)

