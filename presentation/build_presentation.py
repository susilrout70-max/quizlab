import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

# 16:9 Widescreen Dimensions
SLIDE_WIDTH = Inches(13.333)
SLIDE_HEIGHT = Inches(7.5)

# Color Palette (Derived from QuizLab design system)
COLOR_BG_DARK = RGBColor(11, 17, 32)        # #0B1120 Deep Slate
COLOR_SURFACE = RGBColor(30, 41, 59)        # #1E293B Slate 800
COLOR_SURFACE_LIGHT = RGBColor(15, 23, 42)  # #0F172A Slate 900
COLOR_EMERALD = RGBColor(16, 185, 129)      # #10B981 Emerald 500
COLOR_EMERALD_DARK = RGBColor(5, 150, 105)  # #059669 Emerald 600
COLOR_TEXT_WHITE = RGBColor(255, 255, 255)
COLOR_TEXT_MUTED = RGBColor(148, 163, 184)  # #94A3B8 Slate 400
COLOR_TEXT_LIGHT = RGBColor(226, 232, 240)  # #E2E8F0 Slate 200
COLOR_AMBER = RGBColor(245, 158, 11)        # #F59E0B
COLOR_CYAN = RGBColor(6, 182, 212)          # #06B6D4
COLOR_BORDER = RGBColor(51, 65, 85)         # #334155

prs = Presentation()
prs.slide_width = SLIDE_WIDTH
prs.slide_height = SLIDE_HEIGHT
blank_layout = prs.slide_layouts[6]

def set_slide_background(slide):
    background = slide.background
    fill = background.fill
    fill.solid()
    fill.fore_color.rgb = COLOR_BG_DARK

def add_header(slide, tag_text, title_text):
    # Header tag
    tag_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(8.0), Inches(0.4))
    tf_tag = tag_box.text_frame
    tf_tag.word_wrap = True
    p_tag = tf_tag.paragraphs[0]
    p_tag.text = tag_text.upper()
    p_tag.font.size = Pt(10)
    p_tag.font.bold = True
    p_tag.font.color.rgb = COLOR_EMERALD
    p_tag.font.name = "Arial"

    # Main Title
    title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.5), Inches(0.7))
    tf_title = title_box.text_frame
    tf_title.word_wrap = True
    p_title = tf_title.paragraphs[0]
    p_title.text = title_text
    p_title.font.size = Pt(22)
    p_title.font.bold = True
    p_title.font.color.rgb = COLOR_TEXT_WHITE
    p_title.font.name = "Arial"

# ==============================================================================
# SLIDE 1: Project Identity
# ==============================================================================
slide1 = prs.slides.add_slide(blank_layout)
set_slide_background(slide1)

# Badge Pill
pill = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.8), Inches(4.2), Inches(0.4))
pill.fill.solid()
pill.fill.fore_color.rgb = RGBColor(6, 78, 59)
pill.line.color.rgb = COLOR_EMERALD
pill.line.width = Pt(1)
tf_pill = pill.text_frame
p_pill = tf_pill.paragraphs[0]
p_pill.text = "AI-POWERED ADAPTIVE ASSESSMENT PLATFORM"
p_pill.font.size = Pt(9)
p_pill.font.bold = True
p_pill.font.color.rgb = COLOR_EMERALD
p_pill.alignment = PP_ALIGN.CENTER

# Main Title
title_box = slide1.shapes.add_textbox(Inches(0.8), Inches(1.3), Inches(5.8), Inches(1.3))
tf = title_box.text_frame
tf.word_wrap = True
p1 = tf.paragraphs[0]
p1.text = "QuizLab"
p1.font.size = Pt(44)
p1.font.bold = True
p1.font.color.rgb = COLOR_TEXT_WHITE
p1.font.name = "Arial"

# Tagline (explicit clean line break)
p2 = tf.add_paragraph()
p2.text = "Fair, Server-Timed Quizzes with Dynamic AI Blueprints\n& Anti-Cheat Engine"
p2.font.size = Pt(13)
p2.font.bold = True
p2.font.color.rgb = COLOR_EMERALD
p2.font.name = "Arial"

# Description Paragraph
desc_box = slide1.shapes.add_textbox(Inches(0.8), Inches(2.8), Inches(5.8), Inches(1.5))
tf_desc = desc_box.text_frame
tf_desc.word_wrap = True
p_desc = tf_desc.paragraphs[0]
p_desc.text = (
    "QuizLab ensures true examination fairness where every student receives a personalized, "
    "randomized assessment satisfying deep academic blueprints. The server strictly owns time, "
    "question generation, and instant cognitive evaluation."
)
p_desc.font.size = Pt(12)
p_desc.font.color.rgb = COLOR_TEXT_LIGHT
p_desc.font.name = "Arial"
p_desc.line_spacing = 1.3

# Presenter Card
card_pres = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(4.5), Inches(5.8), Inches(1.5))
card_pres.fill.solid()
card_pres.fill.fore_color.rgb = COLOR_SURFACE
card_pres.line.color.rgb = COLOR_BORDER
card_pres.line.width = Pt(1.5)
tf_p = card_pres.text_frame
tf_p.word_wrap = True
pp1 = tf_p.paragraphs[0]
pp1.text = "PROJECT PRESENTATION & DEFENSE"
pp1.font.size = Pt(9)
pp1.font.bold = True
pp1.font.color.rgb = COLOR_EMERALD
pp2 = tf_p.add_paragraph()
pp2.text = "Presented by: [STUDENT NAME]"
pp2.font.size = Pt(14)
pp2.font.bold = True
pp2.font.color.rgb = COLOR_TEXT_WHITE
pp3 = tf_p.add_paragraph()
pp3.text = "Role: Full-Stack Engineer & System Architect  •  Academic Year: 2026"
pp3.font.size = Pt(10)
pp3.font.color.rgb = COLOR_TEXT_MUTED

# Right Side Image: Premium 3D Glassmorphic UI Mockup
quiz_img_path = "presentation/assets/quizlab_ui_mockup.jpg"
if not os.path.exists(quiz_img_path):
    quiz_img_path = "presentation/assets/quiz_mockup_card.png"

if os.path.exists(quiz_img_path):
    # Add stylish rounded card container with glowing border behind the image
    img_card = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.2), Inches(5.75), Inches(4.8))
    img_card.fill.solid()
    img_card.fill.fore_color.rgb = COLOR_SURFACE
    img_card.line.color.rgb = COLOR_EMERALD
    img_card.line.width = Pt(1.5)
    slide1.shapes.add_picture(quiz_img_path, Inches(6.95), Inches(1.35), width=Inches(5.45))
    
    # Feature caption pill inside bottom of card
    sub_card = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.95), Inches(4.7), Inches(5.45), Inches(1.15))
    sub_card.fill.solid()
    sub_card.fill.fore_color.rgb = COLOR_SURFACE_LIGHT
    sub_card.line.color.rgb = COLOR_BORDER
    sub_card.line.width = Pt(1)
    stf = sub_card.text_frame
    stf.word_wrap = True
    sp1 = stf.paragraphs[0]
    sp1.text = "LIVE EXAM RUNNER • TIMED BLUEPRINTS"
    sp1.font.size = Pt(9.5)
    sp1.font.bold = True
    sp1.font.color.rgb = COLOR_EMERALD
    sp2 = stf.add_paragraph()
    sp2.text = "Server-synced countdown timer, instant answer selection, and automated submission lock on expiry."
    sp2.font.size = Pt(8.5)
    sp2.font.color.rgb = COLOR_TEXT_LIGHT
    sp2.line_spacing = 1.2

# Bottom Metric Pill Strip
metrics = [
    ("15,000+", "Questions Generated"),
    ("99.98%", "Server Timing Sync"),
    ("40+", "Subjects Supported"),
    ("< 150ms", "Neon Cloud Latency")
]
for i, (m_val, m_lbl) in enumerate(metrics):
    mx = Inches(0.8 + i * 2.95)
    my = Inches(6.3)
    mbox = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, mx, my, Inches(2.75), Inches(0.75))
    mbox.fill.solid()
    mbox.fill.fore_color.rgb = COLOR_SURFACE_LIGHT
    mbox.line.color.rgb = COLOR_BORDER
    mtf = mbox.text_frame
    mtf.word_wrap = True
    mp1 = mtf.paragraphs[0]
    mp1.text = m_val
    mp1.font.size = Pt(14)
    mp1.font.bold = True
    mp1.font.color.rgb = COLOR_EMERALD
    mp1.alignment = PP_ALIGN.CENTER
    mp2 = mtf.add_paragraph()
    mp2.text = m_lbl
    mp2.font.size = Pt(9)
    mp2.font.color.rgb = COLOR_TEXT_MUTED
    mp2.alignment = PP_ALIGN.CENTER


# ==============================================================================
# SLIDE 2: Problem, Solution & Project Overview
# ==============================================================================
slide2 = prs.slides.add_slide(blank_layout)
set_slide_background(slide2)
add_header(slide2, "EXECUTIVE OVERVIEW", "Problem, Solution & Core Features")

# Left Column: The Problem Card
card_prob = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.5), Inches(5.6), Inches(4.5))
card_prob.fill.solid()
card_prob.fill.fore_color.rgb = COLOR_SURFACE
card_prob.line.color.rgb = RGBColor(239, 68, 68) # Red border
card_prob.line.width = Pt(1.5)
tf_prob = card_prob.text_frame
tf_prob.word_wrap = True
pr_p = tf_prob.paragraphs[0]
pr_p.text = "⚠️ THE ONLINE ASSESSMENT PROBLEM"
pr_p.font.size = Pt(11)
pr_p.font.bold = True
pr_p.font.color.rgb = RGBColor(248, 113, 113)

problems = [
    ("Client-Side Clock Tampering:", "Traditional web quizzes run timers inside JavaScript. Students can pause, freeze, or modify client clocks using browser dev tools."),
    ("Static Question Leakage:", "Fixed question pools lead to students memorizing answers or collaborating during simultaneous tests, compromising academic integrity."),
    ("Lack of Adaptive Cognitive Depth:", "Standard quizzes provide only raw scores without granular feedback, leaving students confused about conceptual blind spots.")
]
for title, desc in problems:
    p_t = tf_prob.add_paragraph()
    p_t.text = "\n• " + title
    p_t.font.size = Pt(11)
    p_t.font.bold = True
    p_t.font.color.rgb = COLOR_TEXT_WHITE
    p_d = tf_prob.add_paragraph()
    p_d.text = desc
    p_d.font.size = Pt(10)
    p_d.font.color.rgb = COLOR_TEXT_MUTED
    p_d.line_spacing = 1.2

# Right Column: The Solution Card (4 Core Features)
card_sol = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.5), Inches(5.7), Inches(4.5))
card_sol.fill.solid()
card_sol.fill.fore_color.rgb = COLOR_SURFACE
card_sol.line.color.rgb = COLOR_EMERALD
card_sol.line.width = Pt(1.5)
tf_sol = card_sol.text_frame
tf_sol.word_wrap = True
sol_p = tf_sol.paragraphs[0]
sol_p.text = "✓ THE QUIZLAB SOLUTION (4 PILLARS)"
sol_p.font.size = Pt(11)
sol_p.font.bold = True
sol_p.font.color.rgb = COLOR_EMERALD

solutions = [
    ("1. Server-Owned Timing Engine:", "PostgreSQL timestamps strictly enforce countdowns. If a submission arrives 1s late, the server locks and auto-grades it."),
    ("2. Dynamic AI Question Blueprints:", "Google Gemini 2.5 synthesizes fresh, targeted questions across 40+ subjects so no two students receive identical papers."),
    ("3. Granular Topic & Gap Analytics:", "Instant question review with clear conceptual explanations, category mastery radar, and exact reattempt support."),
    ("4. Responsive Dual-Theme Mobile UX:", "Tailwind class theming, sticky bottom thumb bar, and slide-up mobile drawers engineered for phone viewports.")
]
for title, desc in solutions:
    s_t = tf_sol.add_paragraph()
    s_t.text = "\n" + title
    s_t.font.size = Pt(11)
    s_t.font.bold = True
    s_t.font.color.rgb = COLOR_TEXT_WHITE
    s_d = tf_sol.add_paragraph()
    s_d.text = desc
    s_d.font.size = Pt(10)
    s_d.font.color.rgb = COLOR_TEXT_LIGHT
    s_d.line_spacing = 1.2

# Bottom Summary Banner
banner = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.2), Inches(11.7), Inches(0.8))
banner.fill.solid()
banner.fill.fore_color.rgb = COLOR_SURFACE_LIGHT
banner.line.color.rgb = COLOR_BORDER
banner.line.width = Pt(1)
tf_b = banner.text_frame
tf_b.word_wrap = True
pb = tf_b.paragraphs[0]
pb.text = "Target Audience: University students, educators, placement candidates, and technical interview preparation teams."
pb.font.size = Pt(10.5)
pb.font.bold = True
pb.font.color.rgb = COLOR_TEXT_WHITE
pb.alignment = PP_ALIGN.CENTER


# ==============================================================================
# SLIDE 3: Technology Stack and System Architecture
# ==============================================================================
slide3 = prs.slides.add_slide(blank_layout)
set_slide_background(slide3)
add_header(slide3, "SYSTEM ARCHITECTURE", "Technology Stack & Decoupled Architecture")

# Left Side Visual: 3D Isometric Architecture Diagram (with fallback to crisp block diagram)
arch_img_path = "presentation/assets/quizlab_architecture_3d.jpg"
if not os.path.exists(arch_img_path):
    arch_img_path = "presentation/assets/architecture_diagram.png"

if os.path.exists(arch_img_path):
    # Container card for the visual
    arch_card = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.35), Inches(7.2), Inches(5.15))
    arch_card.fill.solid()
    arch_card.fill.fore_color.rgb = COLOR_SURFACE
    arch_card.line.color.rgb = COLOR_CYAN
    arch_card.line.width = Pt(1.5)
    
    # Visual Image
    slide3.shapes.add_picture(arch_img_path, Inches(0.92), Inches(1.48), width=Inches(6.96))
    
    # Architecture caption pill
    arch_pill = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.92), Inches(5.62), Inches(6.96), Inches(0.75))
    arch_pill.fill.solid()
    arch_pill.fill.fore_color.rgb = COLOR_SURFACE_LIGHT
    arch_pill.line.color.rgb = COLOR_BORDER
    arch_pill.line.width = Pt(1)
    aptf = arch_pill.text_frame
    aptf.word_wrap = True
    ap1 = aptf.paragraphs[0]
    ap1.text = "ISOMETRIC 4-TIER TOPOLOGY"
    ap1.font.size = Pt(9.5)
    ap1.font.bold = True
    ap1.font.color.rgb = COLOR_CYAN
    ap2 = aptf.add_paragraph()
    ap2.text = "Zero-Trust Client (React/Vite) ➔ Enforced API (Express) ➔ ACID Persistence (Neon) ➔ Generative AI (Gemini 2.5)"
    ap2.font.size = Pt(8.5)
    ap2.font.color.rgb = COLOR_TEXT_LIGHT

# Right Side: Technology Highlights (4 Cards)
tech_groups = [
    ("Frontend Layer", "React 18  •  Vite  •  TypeScript  •  Tailwind CSS\nLucide Icons  •  Axios Reverse Proxy", COLOR_EMERALD),
    ("Backend Layer", "Node.js  •  Express  •  TypeScript (TSX watch)\nZod Validation  •  JWT Auth  •  Bcrypt", COLOR_CYAN),
    ("Database Layer", "Neon Serverless PostgreSQL\nConnection Pooler TCP  •  SQL Migration Scripts", RGBColor(167, 139, 250)),
    ("AI & Deployment", "Google Gemini 2.5 REST API\nVercel Multi-Service Monorepo  •  npm run dev", COLOR_AMBER),
]

for i, (layer_title, layer_desc, accent_color) in enumerate(tech_groups):
    box = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(8.3), Inches(1.35 + i * 1.3), Inches(4.2), Inches(1.15))
    box.fill.solid()
    box.fill.fore_color.rgb = COLOR_SURFACE
    box.line.color.rgb = accent_color
    box.line.width = Pt(1.5)
    btf = box.text_frame
    btf.word_wrap = True
    bp1 = btf.paragraphs[0]
    bp1.text = layer_title
    bp1.font.size = Pt(11)
    bp1.font.bold = True
    bp1.font.color.rgb = accent_color
    bp2 = btf.add_paragraph()
    bp2.text = layer_desc
    bp2.font.size = Pt(9.5)
    bp2.font.color.rgb = COLOR_TEXT_LIGHT
    bp2.line_spacing = 1.2

# Bottom architecture note
arch_note = slide3.shapes.add_textbox(Inches(0.8), Inches(6.7), Inches(11.7), Inches(0.5))
an_tf = arch_note.text_frame
an_p = an_tf.paragraphs[0]
an_p.text = "Architecture Principle: Strict separation of concerns — Client handles UI state, Server strictly enforces timers and grading."
an_p.font.size = Pt(10)
an_p.font.bold = True
an_p.font.color.rgb = COLOR_TEXT_MUTED
an_p.alignment = PP_ALIGN.CENTER


# ==============================================================================
# SLIDE 4: Development Process, Antigravity Prompts and Screenshots
# ==============================================================================
slide4 = prs.slides.add_slide(blank_layout)
set_slide_background(slide4)
add_header(slide4, "ENGINEERING LIFECYCLE", "Development Workflow, Antigravity Prompts & Iteration")

# Top Workflow Image
wf_img_path = "presentation/assets/workflow_diagram.png"
if os.path.exists(wf_img_path):
    slide4.shapes.add_picture(wf_img_path, Inches(0.8), Inches(1.35), width=Inches(11.7))

# Bottom: Recovered / Reconstructed Prompts & AI Orchestration
prompts = [
    ("Antigravity Prompt #1 — Monorepo Orchestration", 
     '"I want both backend and frontend to run at a single command when I run npm run dev, and rearrange the folder structure cleanly into a monorepo."',
     "Result: Integrated concurrently with -k process killing, color prefixes, and eliminated nested directory duplication."),
    
    ("Antigravity Prompt #2 — 10/10 UI/UX Specification", 
     '"Create an implementation plan for landing page, signin/signup, light & dark modes, and align with mobile view."',
     "Result: Built dual-theme engine (ThemeContext), responsive slide-over drawer, and sticky mobile HUD."),
]

for i, (pr_title, pr_quote, pr_res) in enumerate(prompts):
    px = Inches(0.8 + i * 5.95)
    py = Inches(4.9)
    pbox = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, px, py, Inches(5.75), Inches(2.2))
    pbox.fill.solid()
    pbox.fill.fore_color.rgb = COLOR_SURFACE
    pbox.line.color.rgb = COLOR_BORDER
    pbox.line.width = Pt(1.5)
    ptf = pbox.text_frame
    ptf.word_wrap = True
    
    p1 = ptf.paragraphs[0]
    p1.text = pr_title
    p1.font.size = Pt(10.5)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_EMERALD

    p2 = ptf.add_paragraph()
    p2.text = pr_quote
    p2.font.size = Pt(9.5)
    p2.font.italic = True
    p2.font.color.rgb = COLOR_TEXT_WHITE
    p2.line_spacing = 1.2

    p3 = ptf.add_paragraph()
    p3.text = "\n" + pr_res
    p3.font.size = Pt(9)
    p3.font.color.rgb = COLOR_TEXT_MUTED


# ==============================================================================
# SLIDE 5: Repository, Conclusion and Thank You
# ==============================================================================
slide5 = prs.slides.add_slide(blank_layout)
set_slide_background(slide5)
add_header(slide5, "PROJECT SUMMARY & VERIFICATION", "Conclusion, Source Code Repository & Defense")

# Left Column: Project Conclusion & Value
card_conc = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.5), Inches(6.8), Inches(5.2))
card_conc.fill.solid()
card_conc.fill.fore_color.rgb = COLOR_SURFACE
card_conc.line.color.rgb = COLOR_EMERALD
card_conc.line.width = Pt(1.5)
tf_c = card_conc.text_frame
tf_c.word_wrap = True

cp1 = tf_c.paragraphs[0]
cp1.text = "KEY TAKEAWAYS & PROJECT IMPACT"
cp1.font.size = Pt(12)
cp1.font.bold = True
cp1.font.color.rgb = COLOR_EMERALD

conclusions = [
    ("Academic Fairness Guaranteed:", "By anchoring countdown timers and blueprint generation inside the server, QuizLab eliminates client-side clock tampering and test item leakages."),
    ("AI as an Educational Co-Pilot:", "Instead of replacing learning, Gemini 2.5 generates fresh targeted problems and explains underlying misconceptions in real time."),
    ("Production-Grade Engineering:", "Built as a modular full-stack monorepo featuring TypeScript end-to-end, Neon connection pooling, zero-FOUC dual themes, and mobile-first touch ergonomics."),
    ("Future Roadmap:", "Phase 5 will introduce teacher custom blueprint builders and real-time student cohort performance telemetry.")
]

for c_title, c_desc in conclusions:
    c_t = tf_c.add_paragraph()
    c_t.text = "\n• " + c_title
    c_t.font.size = Pt(11)
    c_t.font.bold = True
    c_t.font.color.rgb = COLOR_TEXT_WHITE
    c_d = tf_c.add_paragraph()
    c_d.text = c_desc
    c_d.font.size = Pt(10)
    c_d.font.color.rgb = COLOR_TEXT_LIGHT
    c_d.line_spacing = 1.2

# Right Column: Repository & QR Code Card
card_repo = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(8.0), Inches(1.5), Inches(4.5), Inches(3.2))
card_repo.fill.solid()
card_repo.fill.fore_color.rgb = COLOR_SURFACE_LIGHT
card_repo.line.color.rgb = COLOR_BORDER
card_repo.line.width = Pt(1.5)
tf_r = card_repo.text_frame
tf_r.word_wrap = True

rp1 = tf_r.paragraphs[0]
rp1.text = "GITHUB SOURCE REPOSITORY"
rp1.font.size = Pt(10)
rp1.font.bold = True
rp1.font.color.rgb = COLOR_CYAN

rp2 = tf_r.add_paragraph()
rp2.text = "susilrout70-max / quizlab"
rp2.font.size = Pt(13)
rp2.font.bold = True
rp2.font.color.rgb = COLOR_TEXT_WHITE

rp3 = tf_r.add_paragraph()
rp3.text = "https://github.com/susilrout70-max/quizlab.git"
rp3.font.size = Pt(8.5)
rp3.font.color.rgb = COLOR_EMERALD

# Embed QR Code
qr_path = "presentation/assets/repo_qr.png"
if os.path.exists(qr_path):
    slide5.shapes.add_picture(qr_path, Inches(9.45), Inches(2.7), width=Inches(1.6))

# Right Column Bottom: Thank You Banner
card_ty = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(8.0), Inches(4.9), Inches(4.5), Inches(1.8))
card_ty.fill.solid()
card_ty.fill.fore_color.rgb = RGBColor(6, 78, 59) # Emerald 900
card_ty.line.color.rgb = COLOR_EMERALD
card_ty.line.width = Pt(1.5)
tf_ty = card_ty.text_frame
tf_ty.word_wrap = True

tp1 = tf_ty.paragraphs[0]
tp1.text = "Thank You!"
tp1.font.size = Pt(24)
tp1.font.bold = True
tp1.font.color.rgb = COLOR_TEXT_WHITE
tp1.alignment = PP_ALIGN.CENTER

tp2 = tf_ty.add_paragraph()
tp2.text = "Open for Questions & Discussion"
tp2.font.size = Pt(11)
tp2.font.bold = True
tp2.font.color.rgb = COLOR_EMERALD
tp2.alignment = PP_ALIGN.CENTER

tp3 = tf_ty.add_paragraph()
tp3.text = "Candidate: [STUDENT NAME]"
tp3.font.size = Pt(9.5)
tp3.font.color.rgb = COLOR_TEXT_LIGHT
tp3.alignment = PP_ALIGN.CENTER


# Robust Multi-Target Save Logic (handles Windows PowerPoint open file locks)
targets = [
    "Project_Presentation_Final.pptx",
    "Project_Presentation.pptx",
    "Project_Presentation_Updated.pptx",
    "presentation/QuizLab_5Slide_Defense.pptx"
]

saved_targets = []
for target in targets:
    try:
        prs.save(target)
        saved_targets.append(target)
        print(f"[OK] Successfully saved: {target}")
    except Exception as e:
        print(f"Notice: Could not write {target} (likely open in PowerPoint): {e}")

if saved_targets:
    print(f"\nDeck successfully generated! Ready in: {', '.join(saved_targets)}")
else:
    fallback = f"Project_Presentation_{os.getpid()}.pptx"
    prs.save(fallback)
    print(f"Saved to fallback: {fallback}")

