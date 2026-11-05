"""
Fonction serverless Vercel — proxy Gemini pour le chatbot SOFTRIDER.
Remplace server.py en production (déploiement statique sur Vercel).
"""

import json
import os
import urllib.error
import urllib.request
from http.server import BaseHTTPRequestHandler

GEMINI_MODEL = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        api_key = os.environ.get("GEMINI_API_KEY", "").strip()
        if not api_key:
            self._send_json(503, {"error": "GEMINI_API_KEY non configurée sur le serveur"})
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
                self._send_json(200, {"reply": reply_text})
        except urllib.error.HTTPError as e:
            err_payload = e.read().decode("utf-8", errors="replace")
            self.send_response(e.code)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(err_payload.encode("utf-8"))
        except Exception as e:
            self._send_json(500, {"error": str(e)})

    def _send_json(self, status, obj):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(obj).encode("utf-8"))
