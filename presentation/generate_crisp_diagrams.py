from PIL import Image, ImageDraw, ImageFont
import os

os.makedirs("presentation/assets", exist_ok=True)

# -------------------------------------------------------------
# 1. CRISP HIGH-RESOLUTION ARCHITECTURE DIAGRAM (Slide 3)
# -------------------------------------------------------------
def make_architecture_diagram():
    W, H = 2400, 1400
    img = Image.new("RGBA", (W, H), (11, 17, 32, 255)) # Slate 950 (#0B1120)
    draw = ImageDraw.Draw(img)

    # Fonts
    font_header_tag = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 26)
    font_header_title = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 46)
    font_header_sub = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 26)
    font_card_tag = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 22)
    font_card_title = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 34)
    font_body = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 26)
    font_pipe = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 20)
    font_footer = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 26)

    # Top Header
    draw.text((100, 50), "SYSTEM ARCHITECTURE SPECIFICATION", font=font_header_tag, fill=(16, 185, 129, 255))
    draw.text((100, 85), "QuizLab End-to-End System Architecture", font=font_header_title, fill=(255, 255, 255, 255))
    draw.text((100, 145), "Decoupled Single-Page Architecture with Reverse Proxy & Cloud Persistence", font=font_header_sub, fill=(148, 163, 184, 255))

    # Outer dashed boundary container
    draw.rounded_rectangle([60, 200, W - 60, H - 120], radius=32, outline=(51, 65, 85, 255), width=3)

    # Connection Lines & Pipes (Drawn behind cards)
    # Client <-> Server Pipe
    draw.line([760, 680, 940, 680], fill=(16, 185, 129, 255), width=8)
    # Server <-> Neon DB Pipe
    draw.line([1600, 440, 1780, 440], fill=(168, 85, 247, 255), width=8)
    # Server <-> Gemini AI Pipe
    draw.line([1600, 960, 1780, 960], fill=(245, 158, 11, 255), width=8)

    # Pipe Badges
    # Client-Server Badge
    draw.rounded_rectangle([800, 640, 900, 720], radius=14, fill=(2, 6, 23, 255), outline=(16, 185, 129, 255), width=2)
    draw.text((815, 650), "HTTP", font=font_pipe, fill=(52, 211, 153, 255))
    draw.text((812, 680), "JWT", font=font_pipe, fill=(52, 211, 153, 255))

    # Server-DB Badge
    draw.rounded_rectangle([1640, 400, 1740, 480], radius=14, fill=(2, 6, 23, 255), outline=(168, 85, 247, 255), width=2)
    draw.text((1650, 415), "TCP", font=font_pipe, fill=(192, 132, 252, 255))
    draw.text((1645, 445), "Pooler", font=font_pipe, fill=(192, 132, 252, 255))

    # Server-AI Badge
    draw.rounded_rectangle([1640, 920, 1740, 1000], radius=14, fill=(2, 6, 23, 255), outline=(245, 158, 11, 255), width=2)
    draw.text((1652, 935), "REST", font=font_pipe, fill=(251, 191, 36, 255))
    draw.text((1655, 965), "API", font=font_pipe, fill=(251, 191, 36, 255))

    # --- CARD 1: CLIENT LAYER (Emerald) ---
    c1 = [100, 240, 760, 1160]
    draw.rounded_rectangle(c1, radius=24, fill=(30, 41, 59, 255), outline=(16, 185, 129, 255), width=4)
    # Tag Pill
    draw.rounded_rectangle([130, 270, 370, 315], radius=12, fill=(6, 78, 59, 255), outline=(16, 185, 129, 255), width=2)
    draw.text((150, 278), "FRONTEND SPA LAYER", font=font_card_tag, fill=(16, 185, 129, 255))
    draw.text((130, 340), "React 18 + Vite (TS)", font=font_card_title, fill=(255, 255, 255, 255))
    draw.line([130, 400, 730, 400], fill=(51, 65, 85, 255), width=2)

    client_items = [
        "• Single Page Application (SPA)",
        "• Tailwind CSS v3.4 Styling",
        "• Dual-Theme Engine (Light/Dark)",
        "• Mobile Slide-Over Menu Drawer",
        "• Sticky Bottom Exam Navigation",
        "• Axios Client with JWT Headers",
        "• Local Answer Persistence Mirror",
        "• Dev Reverse Proxy (/api -> :5000)"
    ]
    for idx, item in enumerate(client_items):
        draw.text((130, 430 + idx * 75), item, font=font_body, fill=(226, 232, 240, 255))

    # --- CARD 2: BACKEND LAYER (Cyan) ---
    c2 = [940, 240, 1600, 1160]
    draw.rounded_rectangle(c2, radius=24, fill=(30, 41, 59, 255), outline=(6, 182, 212, 255), width=4)
    # Tag Pill
    draw.rounded_rectangle([970, 270, 1200, 315], radius=12, fill=(8, 51, 68, 255), outline=(6, 182, 212, 255), width=2)
    draw.text((990, 278), "BACKEND API LAYER", font=font_card_tag, fill=(6, 182, 212, 255))
    draw.text((970, 340), "Express + Node.js (TS)", font=font_card_title, fill=(255, 255, 255, 255))
    draw.line([970, 400, 1570, 400], fill=(51, 65, 85, 255), width=2)

    server_items = [
        "• TypeScript Engine (tsx watch)",
        "• Zod Payload Schema Validation",
        "• JWT Auth & Bcrypt Security",
        "• Server-Owned Timing Engine",
        "• Automatic Exam Lockdown Logic",
        "• Instant Question Auto-Grader",
        "• 40+ Subject Category Controller",
        "• Teacher Invite Cryptographic Guard"
    ]
    for idx, item in enumerate(server_items):
        draw.text((970, 430 + idx * 75), item, font=font_body, fill=(226, 232, 240, 255))

    # --- CARD 3: DATABASE LAYER (Purple) ---
    c3 = [1780, 240, W - 100, 660]
    draw.rounded_rectangle(c3, radius=24, fill=(30, 41, 59, 255), outline=(168, 85, 247, 255), width=4)
    draw.rounded_rectangle([1810, 265, 2030, 305], radius=10, fill=(59, 7, 100, 255), outline=(168, 85, 247, 255), width=2)
    draw.text((1825, 272), "DATABASE LAYER", font=font_card_tag, fill=(192, 132, 252, 255))
    draw.text((1810, 325), "Neon PostgreSQL", font=font_card_title, fill=(255, 255, 255, 255))
    draw.line([1810, 375, W - 130, 375], fill=(51, 65, 85, 255), width=2)

    db_items = [
        "• Serverless Connection Pooler",
        "• ACID Compliant Transactions",
        "• SQL Schema Migration Runner",
        "• Server-Side Timestamp Records"
    ]
    for idx, item in enumerate(db_items):
        draw.text((1810, 400 + idx * 60), item, font=font_body, fill=(226, 232, 240, 255))

    # --- CARD 4: AI ENGINE (Amber) ---
    c4 = [1780, 740, W - 100, 1160]
    draw.rounded_rectangle(c4, radius=24, fill=(30, 41, 59, 255), outline=(245, 158, 11, 255), width=4)
    draw.rounded_rectangle([1810, 765, 1980, 805], radius=10, fill=(69, 26, 3, 255), outline=(245, 158, 11, 255), width=2)
    draw.text((1825, 772), "AI SERVICE", font=font_card_tag, fill=(251, 191, 36, 255))
    draw.text((1810, 825), "Google Gemini 2.5", font=font_card_title, fill=(255, 255, 255, 255))
    draw.line([1810, 875, W - 130, 875], fill=(51, 65, 85, 255), width=2)

    ai_items = [
        "• Dynamic Question Blueprints",
        "• 4-Option Multiple Choice Engine",
        "• Interactive AI Study Chatbot",
        "• Step-by-Step Problem Solver"
    ]
    for idx, item in enumerate(ai_items):
        draw.text((1810, 900 + idx * 60), item, font=font_body, fill=(226, 232, 240, 255))

    # Bottom Monorepo Callout Strip
    draw.rounded_rectangle([100, H - 95, W - 100, H - 35], radius=14, fill=(2, 6, 23, 255), outline=(16, 185, 129, 255), width=2)
    draw.text((W/2 - 580, H - 85), "⚡ MONOREPO ORCHESTRATION: 'npm run dev' boots Client & Server concurrently with process sync", font=font_footer, fill=(16, 185, 129, 255))

    out_file = "presentation/assets/architecture_diagram.png"
    img.save(out_file, "PNG")
    print(f"Crisp architecture diagram saved: {out_file} ({W}x{H})")

# -------------------------------------------------------------
# 2. CRISP HIGH-RESOLUTION WORKFLOW DIAGRAM (Slide 4)
# -------------------------------------------------------------
def make_workflow_diagram():
    W, H = 2400, 700
    img = Image.new("RGBA", (W, H), (11, 17, 32, 255))
    draw = ImageDraw.Draw(img)

    font_header_tag = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 22)
    font_header_title = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 36)
    font_phase_num = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 22)
    font_phase_title = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 28)
    font_body = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 22)

    # Header
    draw.text((60, 30), "ENGINEERING LIFECYCLE PROGRESSION", font=font_header_tag, fill=(16, 185, 129, 255))
    draw.text((60, 60), "Agile Development Milestones & Antigravity AI Orchestration", font=font_header_title, fill=(255, 255, 255, 255))

    phases = [
        ("PHASE 1", "Foundations & Auth", [
            "• Neon PostgreSQL setup",
            "• Users & Roles schema",
            "• JWT token auth & bcrypt",
            "• Teacher invite code guard"
        ], (16, 185, 129, 255), (6, 78, 59, 255)),

        ("PHASE 2", "Assessment Core", [
            "• 10-Question randomized sets",
            "• Server PostgreSQL timers",
            "• Expiry auto-lock & grading",
            "• Instant cognitive feedback"
        ], (6, 182, 212, 255), (8, 51, 68, 255)),

        ("PHASE 3", "Monorepo DX", [
            "• Single 'npm run dev' boot",
            "• Concurrently -k process sync",
            "• Streamlined folder tree",
            "• Vercel monorepo config"
        ], (168, 85, 247, 255), (59, 7, 100, 255)),

        ("PHASE 4", "10/10 UI/UX Polish", [
            "• Dual-Theme (Light/Dark)",
            "• High-converting Landing page",
            "• Slide-over mobile drawer",
            "• Mobile sticky thumb HUD"
        ], (245, 158, 11, 255), (69, 26, 3, 255)),
    ]

    card_w = 520
    card_h = 510
    start_x = 60
    gap = 66

    for i, (p_num, title, bullets, border_col, tag_bg) in enumerate(phases):
        x1 = start_x + i * (card_w + gap)
        x2 = x1 + card_w
        y1 = 135
        y2 = y1 + card_h

        # Connecting Arrow to next card
        if i < 3:
            arrow_x = x2 + 10
            draw.line([arrow_x, y1 + card_h//2, arrow_x + gap - 20, y1 + card_h//2], fill=(100, 116, 139, 255), width=5)
            # Arrow head
            draw.polygon([
                (arrow_x + gap - 8, y1 + card_h//2),
                (arrow_x + gap - 25, y1 + card_h//2 - 12),
                (arrow_x + gap - 25, y1 + card_h//2 + 12)
            ], fill=(100, 116, 139, 255))

        # Card Body
        draw.rounded_rectangle([x1, y1, x2, y2], radius=20, fill=(30, 41, 59, 255), outline=border_col, width=3)

        # Header Tag Pill
        draw.rounded_rectangle([x1 + 25, y1 + 25, x1 + 180, y1 + 65], radius=10, fill=tag_bg, outline=border_col, width=2)
        draw.text((x1 + 45, y1 + 32), p_num, font=font_phase_num, fill=border_col)

        # Title
        draw.text((x1 + 25, y1 + 85), title, font=font_phase_title, fill=(255, 255, 255, 255))
        draw.line([x1 + 25, y1 + 135, x2 - 25, y1 + 135], fill=(51, 65, 85, 255), width=2)

        # Bullets
        for b_idx, bullet in enumerate(bullets):
            draw.text((x1 + 25, y1 + 165 + b_idx * 78), bullet, font=font_body, fill=(226, 232, 240, 255))

    out_file = "presentation/assets/workflow_diagram.png"
    img.save(out_file, "PNG")
    print(f"Crisp workflow diagram saved: {out_file} ({W}x{H})")

if __name__ == "__main__":
    make_architecture_diagram()
    make_workflow_diagram()
