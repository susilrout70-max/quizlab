import http.server
import socketserver
import subprocess
import threading
import time
import os
import sys

PORT = 9123
DIST_DIR = os.path.abspath("client/dist")

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIST_DIR, **kwargs)

    # Simple SPA fallback for client routing
    def do_GET(self):
        path = self.translate_path(self.path)
        if not os.path.exists(path):
            self.path = "/index.html"
        return super().do_GET()

def start_server():
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving at port {PORT}")
        httpd.serve_forever()

server_thread = threading.Thread(target=start_server, daemon=True)
server_thread.start()
time.sleep(1)

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if not os.path.exists(edge_path):
    print("Edge not found")
    sys.exit(1)

out_dir = os.path.abspath("presentation/assets")
os.makedirs(out_dir, exist_ok=True)

# 1. Capture Landing Page (Desktop)
landing_shot = os.path.join(out_dir, "landing_page.png")
cmd1 = [
    edge_path,
    "--headless",
    "--disable-gpu",
    f"--screenshot={landing_shot}",
    "--window-size=1440,900",
    f"http://localhost:{PORT}/"
]
subprocess.run(cmd1, timeout=15)
print(f"Landing screenshot captured: {os.path.exists(landing_shot)}")

# 2. Capture Login Page
login_shot = os.path.join(out_dir, "login_page.png")
cmd2 = [
    edge_path,
    "--headless",
    "--disable-gpu",
    f"--screenshot={login_shot}",
    "--window-size=1440,900",
    f"http://localhost:{PORT}/login"
]
subprocess.run(cmd2, timeout=15)
print(f"Login screenshot captured: {os.path.exists(login_shot)}")

# 3. Capture Signup Page
signup_shot = os.path.join(out_dir, "signup_page.png")
cmd3 = [
    edge_path,
    "--headless",
    "--disable-gpu",
    f"--screenshot={signup_shot}",
    "--window-size=1440,900",
    f"http://localhost:{PORT}/signup"
]
subprocess.run(cmd3, timeout=15)
print(f"Signup screenshot captured: {os.path.exists(signup_shot)}")

# 4. Capture Mobile Viewport of Landing
mobile_shot = os.path.join(out_dir, "mobile_landing.png")
cmd4 = [
    edge_path,
    "--headless",
    "--disable-gpu",
    f"--screenshot={mobile_shot}",
    "--window-size=390,844",
    f"http://localhost:{PORT}/"
]
subprocess.run(cmd4, timeout=15)
print(f"Mobile screenshot captured: {os.path.exists(mobile_shot)}")

