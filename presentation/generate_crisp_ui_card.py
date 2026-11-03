from PIL import Image, ImageDraw, ImageFont
import os

os.makedirs("presentation/assets", exist_ok=True)

# 2000 x 1250 High Resolution Canvas
W, H = 2000, 1250
img = Image.new("RGBA", (W, H), (11, 17, 32, 255)) # Slate 950
draw = ImageDraw.Draw(img)

# Load fonts
font_title = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 46)
font_sub = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 30)
font_badge = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 26)
font_timer = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 34)
font_q = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 44)
font_opt = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 34)
font_opt_bold = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 36)
font_meta = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 28)

# 1. Subtle Background Glow behind card
for r in range(120, 0, -20):
    alpha = int(12 * (1 - r / 120))
    draw.rounded_rectangle([150 - r, 80 - r, W - 150 + r, H - 80 + r], radius=40, outline=(16, 185, 129, alpha), width=3)

# 2. Main Card Body
card_box = [150, 80, W - 150, H - 80]
draw.rounded_rectangle(card_box, radius=32, fill=(30, 41, 59, 255), outline=(16, 185, 129, 255), width=4)

# 3. Card Top Header
# Pulse Dot
draw.ellipse([210, 140, 234, 164], fill=(16, 185, 129, 255))
# Header Title
draw.text((250, 134), "QUIZLAB EXAM ENGINE", font=font_badge, fill=(16, 185, 129, 255))
draw.text((620, 134), "•   Subject: Python Core (Level 2 Medium)", font=font_sub, fill=(148, 163, 184, 255))

# Timer Box (Right top)
timer_box = [W - 480, 120, W - 210, 185]
draw.rounded_rectangle(timer_box, radius=16, fill=(2, 6, 23, 255), outline=(245, 158, 11, 255), width=3)
draw.text((W - 440, 132), "TIME:  08:42", font=font_timer, fill=(251, 191, 36, 255))

# Header Separator
draw.line([150, 220, W - 150, 220], fill=(51, 65, 85, 255), width=2)

# 4. Question Text
q_line1 = "Q4: Which keyword in Python pauses execution and emits a value"
q_line2 = "without destroying the internal function stack frame state?"
draw.text((210, 260), q_line1, font=font_q, fill=(255, 255, 255, 255))
draw.text((210, 320), q_line2, font=font_q, fill=(255, 255, 255, 255))

# 5. Options
options = [
    ("A", "return", False),
    ("B", "yield       — Correct Answer (Generates an iterable iterator)", True),
    ("C", "await", False),
    ("D", "defer", False)
]

start_y = 430
opt_h = 110
gap = 26

for i, (letter, text, is_correct) in enumerate(options):
    y1 = start_y + i * (opt_h + gap)
    y2 = y1 + opt_h
    opt_rect = [210, y1, W - 210, y2]
    
    if is_correct:
        # Highlighted Correct Option
        draw.rounded_rectangle(opt_rect, radius=20, fill=(6, 78, 59, 255), outline=(16, 185, 129, 255), width=3)
        # Letter pill
        draw.rounded_rectangle([235, y1 + 22, 305, y2 - 22], radius=14, fill=(16, 185, 129, 255))
        draw.text((255, y1 + 32), letter, font=font_opt_bold, fill=(2, 6, 23, 255))
        # Text
        draw.text((335, y1 + 34), text, font=font_opt_bold, fill=(255, 255, 255, 255))
        # Checkmark Icon
        draw.text((W - 280, y1 + 30), "✓", font=font_title, fill=(52, 211, 153, 255))
    else:
        # Default Option
        draw.rounded_rectangle(opt_rect, radius=20, fill=(15, 23, 42, 255), outline=(51, 65, 85, 255), width=2)
        # Letter pill
        draw.rounded_rectangle([235, y1 + 22, 305, y2 - 22], radius=14, fill=(30, 41, 59, 255), outline=(71, 85, 105, 255), width=2)
        draw.text((255, y1 + 32), letter, font=font_opt, fill=(148, 163, 184, 255))
        # Text
        draw.text((335, y1 + 34), text, font=font_opt, fill=(203, 213, 225, 255))

# 6. Bottom Status Pill
footer_y = H - 180
draw.line([150, footer_y - 20, W - 150, footer_y - 20], fill=(51, 65, 85, 255), width=2)
draw.text((210, footer_y), "🔒 Server-Authoritative Anti-Cheat Active", font=font_meta, fill=(16, 185, 129, 255))
draw.text((W - 650, footer_y), "Adaptive AI Blueprint • 10 Fresh Questions", font=font_meta, fill=(148, 163, 184, 255))

out_path = "presentation/assets/quiz_mockup_card.png"
img.save(out_path, "PNG")
print(f"Crisp high-resolution UI card saved: {out_path} ({W}x{H})")
