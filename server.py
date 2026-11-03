#!/usr/bin/env python3
"""
Serveur local SOFTRIDER — Agence Tech & IA
Sert les fichiers statiques du site et expose un endpoint POST /api/gemini
pour propulser le chatbot flottant via Google Gemini (gemini-2.5-flash).
"""

import json
import os
import urllib.error
import urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

PORT = int(os.environ.get("PORT", "8080"))
GEMINI_MODEL = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")
WORKSPACE_DIR = os.path.dirname(os.path.abspath(__file__))


class SoftRiderHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=WORKSPACE_DIR, **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def do_POST(self):
        if self.path == "/api/gemini":
            self.handle_gemini_proxy()
        else:
            self.send_error(404, "Endpoint introuvable")

    def handle_gemini_proxy(self):
        api_key = os.environ.get("GEMINI_API_KEY", "").strip()
        if not api_key:
            self.send_response(503)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(
                json.dumps({"error": "GEMINI_API_KEY non configurée sur le serveur"}).encode("utf-8")
            )
            return

        length = int(self.headers.get("Content-Length", "0"))
        raw_body = self.rfile.read(length) if length > 0 else b"{}"
        try:
            payload = json.loads(raw_body.decode("utf-8"))
        except Exception:
            payload = {}

        system_instruction = payload.get("systemInstruction", "")
        contents = payload.get("contents", [])

        gemini_url = (
            f"https://generativelanguage.googleapis.com/v1beta/models/"
            f"{GEMINI_MODEL}:generateContent?key={api_key}"
        )
        req_body = {
            "contents": contents,
            "generationConfig": {"temperature": 0.7, "maxOutputTokens": 380},
        }
        if system_instruction:
            req_body["systemInstruction"] = {"parts": [{"text": system_instruction}]}

        req = urllib.request.Request(
            gemini_url,
            data=json.dumps(req_body).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )

        try:
            with urllib.request.urlopen(req, timeout=15) as resp:
                resp_data = json.loads(resp.read().decode("utf-8"))
                candidates = resp_data.get("candidates", [])
                parts = (
                    candidates[0].get("content", {}).get("parts", [])
                    if candidates
                    else []
                )
                reply_text = "".join(p.get("text", "") for p in parts)
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"reply": reply_text}).encode("utf-8"))
        except urllib.error.HTTPError as e:
            err_payload = e.read().decode("utf-8", errors="replace")
            self.send_response(e.code)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(err_payload.encode("utf-8"))
        except Exception as e:
            self.send_response(500)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))


if __name__ == "__main__":
    print(f"Serveur SOFTRIDER actif sur http://localhost:{PORT}")
    server = ThreadingHTTPServer(("", PORT), SoftRiderHandler)
    server.serve_forever()

