import os
from pathlib import Path

from dotenv import load_dotenv

ROOT_DIR = Path(__file__).resolve().parent.parent
load_dotenv(ROOT_DIR / ".env")

XFYUN_APPID = os.getenv("XFYUN_APPID", "")
XFYUN_API_KEY = os.getenv("XFYUN_API_KEY", "")
XFYUN_API_SECRET = os.getenv("XFYUN_API_SECRET", "")

MUREKA_API_KEY = os.getenv("MUREKA_API_KEY", "")
MUREKA_API_BASE = os.getenv("MUREKA_API_BASE", "https://api.mureka.ai")

PORT = int(os.getenv("PORT", "8080"))
