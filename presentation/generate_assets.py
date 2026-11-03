import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from PIL import Image, ImageDraw, ImageFont

os.makedirs("presentation/assets", exist_ok=True)

# -------------------------------------------------------------
# Asset 1: Architecture Diagram (Slide 3)
# -------------------------------------------------------------
def generate_architecture_diagram():
    fig, ax = plt.subplots(figsize=(10, 5.2), dpi=250)
    fig.patch.set_facecolor('#0F172A') # Slate 900
    ax.set_facecolor('#0F172A')

    # Remove axes
    ax.axis('off')

    # Title
    ax.text(5.0, 4.8, "QuizLab End-to-End System Architecture", 
            ha='center', va='center', color='#FFFFFF', fontsize=16, fontweight='bold', fontfamily='sans-serif')
    ax.text(5.0, 4.45, "Client-Server Decoupled Monorepo with Vercel Orchestration", 
            ha='center', va='center', color='#94A3B8', fontsize=10, fontfamily='sans-serif')

    boxes = [
        # (x, y, w, h, title, subtitle, color, border_color)
        (0.5, 1.2, 2.4, 2.6, "CLIENT LAYER\n(React 18 + Vite)", "• Tailwind CSS (v3.4)\n• Dual-Theme Engine\n• Mobile Bottom HUD\n• Axios API Client\n• React Router v6", "#1E293B", "#10B981"),
        (3.8, 1.2, 2.4, 2.6, "SERVER LAYER\n(Express + Node.js)", "• TypeScript + tsx watch\n• JWT Token Guards\n• Zod Schema Validation\n• Quiz Timing Engine\n• Auto-Grading Logic", "#1E293B", "#06B6D4"),
        (7.1, 2.6, 2.4, 1.2, "DATABASE LAYER\n(Neon PostgreSQL)", "• Serverless Connection Pooling\n• ACID Transactions\n• Schema Migration Runner", "#1E293B", "#8B5CF6"),
        (7.1, 1.2, 2.4, 1.2, "AI ENGINE\n(Google Gemini 2.5)", "• Dynamic Question Blueprints\n• AI Study Chatbot Tutor\n• Step-by-Step Explanations", "#1E293B", "#F59E0B"),
    ]

    for x, y, w, h, title, sub, bg, border in boxes:
        rect = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.08,rounding_size=0.15",
                                      facecolor=bg, edgecolor=border, linewidth=2)
        ax.add_patch(rect)
        ax.text(x + w/2, y + h - 0.45, title, ha='center', va='center', color='#FFFFFF', 
                fontsize=11, fontweight='bold', multialignment='center')
        ax.text(x + 0.15, y + h/2 - 0.35, sub, ha='left', va='center', color='#CBD5E1', 
                fontsize=8.5, linespacing=1.4)

    # Connections / Arrows
    # Client <-> Server
    ax.annotate("", xy=(3.8, 2.5), xytext=(2.9, 2.5),
                arrowprops=dict(arrowstyle="<->", color='#10B981', lw=2.5, mutation_scale=15))
    ax.text(3.35, 2.7, "HTTP / JWT\nProxy: 5000", ha='center', va='center', color='#34D399', fontsize=8, fontweight='bold')

    # Server <-> Neon DB
    ax.annotate("", xy=(7.1, 3.2), xytext=(6.2, 3.0),
                arrowprops=dict(arrowstyle="<->", color='#8B5CF6', lw=2.5, mutation_scale=15))
    ax.text(6.65, 3.35, "TCP Pooler", ha='center', va='center', color='#A78BFA', fontsize=8, fontweight='bold')

    # Server <-> Gemini AI
    ax.annotate("", xy=(7.1, 1.8), xytext=(6.2, 2.0),
                arrowprops=dict(arrowstyle="<->", color='#F59E0B', lw=2.5, mutation_scale=15))
    ax.text(6.65, 1.65, "REST API", ha='center', va='center', color='#FBBF24', fontsize=8, fontweight='bold')

    # Overall Container
    outline = patches.FancyBboxPatch((0.2, 0.4), 9.6, 4.3, boxstyle="round,pad=0.1,rounding_size=0.2",
                                    facecolor='none', edgecolor='#334155', linewidth=1.2, linestyle='--')
    ax.add_patch(outline)

    # Monorepo footer note
    ax.text(5.0, 0.65, "⚡ Single Command Monorepo: 'npm run dev' launches Client & Server concurrently",
            ha='center', va='center', color='#10B981', fontsize=9.5, fontweight='bold')

    plt.tight_layout()
    plt.savefig("presentation/assets/architecture_diagram.png", facecolor=fig.get_facecolor(), edgecolor='none', bbox_inches='tight')
    plt.close()
    print("Architecture diagram created.")

# -------------------------------------------------------------
# Asset 2: Live Quiz Mockup Card (Slide 1 & 2)
# -------------------------------------------------------------
def generate_quiz_mockup_card():
    fig, ax = plt.subplots(figsize=(7.5, 4.5), dpi=250)
    fig.patch.set_facecolor('#0F172A')
    ax.set_facecolor('#0F172A')
    ax.axis('off')

    # Card background
    card = patches.FancyBboxPatch((0.3, 0.3), 6.9, 3.9, boxstyle="round,pad=0.08,rounding_size=0.2",
                                  facecolor='#1E293B', edgecolor='#10B981', linewidth=2)
    ax.add_patch(card)

    # Card Header
    ax.text(0.7, 3.75, "● LIVE EXAM ENGINE", color='#10B981', fontsize=9, fontweight='bold')
    ax.text(2.6, 3.75, "Subject: Python Core (Level 2)", color='#94A3B8', fontsize=8.5)
    
    # Timer Badge
    timer_rect = patches.FancyBboxPatch((5.4, 3.55), 1.5, 0.4, boxstyle="round,pad=0.04,rounding_size=0.08",
                                        facecolor='#020617', edgecolor='#F59E0B', linewidth=1.5)
    ax.add_patch(timer_rect)
    ax.text(6.15, 3.75, "TIME: 08:42", color='#FBBF24', fontsize=9, fontweight='bold', ha='center', va='center')

    # Question text
    q_text = "Q4: Which keyword in Python pauses execution and emits\na value without destroying function stack frame state?"
    ax.text(0.7, 3.0, q_text, color='#FFFFFF', fontsize=11, fontweight='bold', linespacing=1.3)

    # Options
    options = [
        ("A", "return", False),
        ("B", "yield  (Correct - Emits generator iterator)", True),
        ("C", "await", False),
        ("D", "defer", False)
    ]

    y_pos = 2.1
    for letter, text, is_correct in options:
        opt_bg = '#064E3B' if is_correct else '#0F172A'
        opt_border = '#10B981' if is_correct else '#334155'
        opt_rect = patches.FancyBboxPatch((0.7, y_pos), 6.1, 0.4, boxstyle="round,pad=0.04,rounding_size=0.08",
                                         facecolor=opt_bg, edgecolor=opt_border, linewidth=1.5 if is_correct else 1)
        ax.add_patch(opt_rect)

        ax.text(0.9, y_pos + 0.2, f"({letter})", color='#10B981' if is_correct else '#94A3B8', 
                fontsize=9, fontweight='bold', va='center')
        ax.text(1.3, y_pos + 0.2, text, color='#FFFFFF' if is_correct else '#CBD5E1', 
                fontsize=8.5, fontweight='bold' if is_correct else 'normal', va='center')
        if is_correct:
            ax.text(6.5, y_pos + 0.2, "✓", color='#10B981', fontsize=11, fontweight='bold', va='center')

        y_pos -= 0.48

    plt.tight_layout()
    plt.savefig("presentation/assets/quiz_mockup_card.png", facecolor=fig.get_facecolor(), edgecolor='none', bbox_inches='tight')
    plt.close()
    print("Quiz mockup card created.")

# -------------------------------------------------------------
# Asset 3: Development Pipeline & AI Workflow (Slide 4)
# -------------------------------------------------------------
def generate_workflow_diagram():
    fig, ax = plt.subplots(figsize=(9.5, 4.2), dpi=250)
    fig.patch.set_facecolor('#0F172A')
    ax.set_facecolor('#0F172A')
    ax.axis('off')

    stages = [
        ("PHASE 1", "Foundations & Auth", "• Neon DB setup\n• Users & roles\n• JWT auth & bcrypt\n• Teacher invite guard", "#10B981"),
        ("PHASE 2", "Assessment Core", "• 10-Q randomizer\n• PostgreSQL timers\n• Auto-grader\n• Reattempt logic", "#06B6D4"),
        ("PHASE 3", "Monorepo DX", "• Single npm run dev\n• Concurrently sync\n• Unified builds\n• Auto-shutdown -k", "#8B5CF6"),
        ("PHASE 4", "10/10 UI/UX Polish", "• Dual-theme engine\n• Mobile bottom HUD\n• AI study sheet\n• High-convert landing", "#F59E0B"),
    ]

    for i, (p_num, title, bullets, color) in enumerate(stages):
        x = 0.5 + i * 2.3
        y = 0.8
        w = 1.95
        h = 2.8

        box = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.08,rounding_size=0.15",
                                     facecolor='#1E293B', edgecolor=color, linewidth=2)
        ax.add_patch(box)

        # Header tag
        tag = patches.FancyBboxPatch((x + 0.15, y + h - 0.4), w - 0.3, 0.3, boxstyle="round,pad=0.02,rounding_size=0.05",
                                     facecolor=color, edgecolor='none')
        ax.add_patch(tag)
        ax.text(x + w/2, y + h - 0.25, p_num, ha='center', va='center', color='#020617', fontsize=9, fontweight='bold')

        ax.text(x + w/2, y + h - 0.75, title, ha='center', va='center', color='#FFFFFF', fontsize=10, fontweight='bold')
        ax.text(x + 0.15, y + 0.85, bullets, ha='left', va='center', color='#CBD5E1', fontsize=8, linespacing=1.4)

        if i < 3:
            ax.annotate("", xy=(x + w + 0.32, y + h/2), xytext=(x + w + 0.03, y + h/2),
                        arrowprops=dict(arrowstyle="->", color='#64748B', lw=2.5, mutation_scale=14))

    ax.text(4.75, 3.9, "QuizLab Development & AI Engineering Progression", 
            ha='center', va='center', color='#FFFFFF', fontsize=14, fontweight='bold')

    plt.tight_layout()
    plt.savefig("presentation/assets/workflow_diagram.png", facecolor=fig.get_facecolor(), edgecolor='none', bbox_inches='tight')
    plt.close()
    print("Workflow diagram created.")

if __name__ == "__main__":
    generate_architecture_diagram()
    generate_quiz_mockup_card()
    generate_workflow_diagram()
