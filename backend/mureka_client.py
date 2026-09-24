"""Mureka API 客户端（情绪疗愈纯音乐生成与轮询）。"""

from typing import Any, Tuple

import requests

from backend.config import MUREKA_API_BASE, MUREKA_API_KEY

# 情绪 → 疗愈纯音乐 prompt（英文标签便于模型理解风格）
EMOTION_PROMPTS = {
    "calm": (
        "gentle ambient wellness music, soft piano and warm pads, "
        "slow 60bpm meditative, peaceful serene atmosphere, no lyrics, healing instrumental"
    ),
    "happy": (
        "light uplifting acoustic music, soft guitar and gentle bells, "
        "bright but soft 72bpm, warm daylight mood, no lyrics, cheerful instrumental"
    ),
    "anxious": (
        "calming ambient music for anxiety relief, deep breathing rhythm, "
        "soft rain textures and low cello, very slow 55bpm, grounding, no lyrics"
    ),
    "tired": (
        "restorative soft instrumental, warm lo-fi pads and distant piano, "
        "sleepy 50bpm, gentle recovery mood, no lyrics, quiet night room"
    ),
    "sad": (
        "comforting melancholic instrumental, soft strings and piano, "
        "tender 58bpm, embracing warmth, emotional but hopeful, no lyrics"
    ),
    "angry": (
        "releasing then soothing instrumental, start with soft drums then fade to ambient pads, "
        "60bpm, emotional release into calm, no lyrics, therapeutic"
    ),
    "lonely": (
        "warm intimate instrumental with soft female humming texture optional, "
        "cello and piano, 62bpm, companionship feeling, no lyrics, cozy room"
    ),
    "hopeful": (
        "hopeful cinematic ambient, soft rising strings and piano, "
        "moderato 68bpm, sunrise warmth, motivational but gentle, no lyrics"
    ),
}

EMOTION_LYRICS = {
    "calm": "[Verse]\n呼吸缓缓落下\n心湖渐渐澄清\n[Chorus]\n此刻足够安静\n我与自己同在",
    "happy": "[Verse]\n阳光落在肩上\n好心情轻轻留住\n[Chorus]\n把快乐记进身体\n明天还能找回",
    "anxious": "[Verse]\n不确定先放下\n先把呼吸找回\n[Chorus]\n一步一步落地\n紧张慢慢散开",
    "tired": "[Verse]\n允许自己停一下\n疲惫不是过错\n[Chorus]\n先休息再出发\n能量会回来",
    "sad": "[Verse]\n低落也可以被看见\n不必立刻振作\n[Chorus]\n温柔对自己说\n此刻慢一点也没关系",
    "angry": "[Verse]\n怒意先过身体\n再决定要不要回应\n[Chorus]\n冷水与深呼吸\n把火慢慢收起",
    "lonely": "[Verse]\n孤单不是失败\n先连结自己\n[Chorus]\n内心有一盏灯\n照亮这一小段路",
    "hopeful": "[Verse]\n期待是小小燃料\n落成一步行动\n[Chorus]\n明天值得靠近\n从现在开始",
}


def _headers() -> dict[str, str]:
    if not MUREKA_API_KEY:
        raise ValueError("未配置 MUREKA_API_KEY，请在 .env 中设置")
    return {
        "Authorization": f"Bearer {MUREKA_API_KEY}",
        "Content-Type": "application/json",
    }


def _post(path: str, payload: dict) -> Tuple[dict, int]:
    url = f"{MUREKA_API_BASE}{path}"
    resp = requests.post(url, headers=_headers(), json=payload, timeout=60)
    try:
        data = resp.json()
    except Exception:
        data = {"error": {"message": resp.text or "invalid response"}}
    return data, resp.status_code


def _get(path: str) -> Tuple[dict, int]:
    url = f"{MUREKA_API_BASE}{path}"
    resp = requests.get(url, headers=_headers(), timeout=30)
    try:
        data = resp.json()
    except Exception:
        data = {"error": {"message": resp.text or "invalid response"}}
    return data, resp.status_code


def build_emotion_payload(emotion_id: str, music_type: str = "instrumental", note: str = "") -> dict[str, Any]:
    emotion_id = emotion_id if emotion_id in EMOTION_PROMPTS else "calm"
    prompt = EMOTION_PROMPTS[emotion_id]
    if note.strip():
        prompt = f"{prompt}. Inspired by: {note.strip()[:120]}"

    if music_type == "instrumental":
        prompt = (
            f"{prompt}. IMPORTANT: purely instrumental, no vocals, no lyrics, no singing."
        )
        return {"model": "auto", "prompt": prompt}

    lyrics = EMOTION_LYRICS.get(emotion_id, EMOTION_LYRICS["calm"])
    return {"model": "auto", "prompt": prompt, "lyrics": lyrics}


def generate_song(payload: dict) -> Tuple[dict, int]:
    return _post("/v1/song/generate", payload)


def generate_instrumental(payload: dict) -> Tuple[dict, int]:
    return _post("/v1/instrumental/generate", payload)


def query_song(task_id: str) -> Tuple[dict, int]:
    return _get(f"/v1/song/query/{task_id}")


def query_instrumental(task_id: str) -> Tuple[dict, int]:
    return _get(f"/v1/instrumental/query/{task_id}")


def extract_audio_url(query_data: dict):
    choices = query_data.get("choices") or []
    if not choices:
        return None
    first = choices[0] if isinstance(choices[0], dict) else {}
    for key in ("url", "mp3_url", "audio_url", "stream_url"):
        if first.get(key):
            return first[key]
    return None
