from PIL import Image, ImageDraw, ImageFont
import textwrap




def write_letter(text_path, image_path, font_path, font_size, position, text_color):
    charPerLine = {
        18: 78,
        20: 72,
        22: 66,
        24: 61,
        26: 57,
        28: 53,
        30: 48,
        32: 45,
        34: 44,
        36: 42,
    }
    image = Image.open(image_path)
    draw = ImageDraw.Draw(image)
    font = ImageFont.truetype(font_path, size=font_size)
    with open(text_path, 'r', encoding='utf-8') as file:
        text = file.read()
    
    wrapper = textwrap.TextWrapper(width=charPerLine[font_size])
    paragraphs = text.splitlines()
    wrapped_paragraphs = [wrapper.fill(text=p) for p in paragraphs]
    wrapped_text = '\n'.join(wrapped_paragraphs)
    draw.multiline_text(position,wrapped_text, font=font, fill=text_color)
    image.show()
    return image

if __name__ == "__main__":

    write_letter(
        text_path='./public/letter.txt',
        image_path ='./Print/Letter.png',
        font_path='./Print/VCR_OSD_MONO_1.001.ttf',
        font_size=20,
        position=(20, 20),
        text_color="black"
    )
