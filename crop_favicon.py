from PIL import Image

def crop_center(image_path, crop_percentage=0.10):
    with Image.open(image_path) as img:
        width, height = img.size
        left = width * crop_percentage
        top = height * crop_percentage
        right = width * (1 - crop_percentage)
        bottom = height * (1 - crop_percentage)
        
        cropped_img = img.crop((left, top, right, bottom))
        cropped_img.save(image_path)
        print(f"Cropped {image_path} by {crop_percentage*100}% on each side.")

if __name__ == "__main__":
    crop_center("favicon.png")
