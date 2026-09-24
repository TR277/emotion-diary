import base64
import hashlib
import hmac
from datetime import datetime, timezone
from urllib.parse import quote

from backend.config import XFYUN_API_KEY, XFYUN_API_SECRET, XFYUN_APPID
from backend.iat_config import IAT_HOST, IAT_PATH


def format_datetime(dt: datetime) -> str:
    weekday = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][dt.weekday()]
    month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][
        dt.month - 1
    ]
    return f"{weekday}, {dt.day:02d} {month} {dt.year} {dt.hour:02d}:{dt.minute:02d}:{dt.second:02d} GMT"


def _rfc1123_utc_now() -> str:
    return format_datetime(datetime.now(timezone.utc))


def build_iat_auth_url() -> dict:
    """生成讯飞 IAT WebSocket 鉴权 URL（Secret 仅在后端）。"""
    if not all([XFYUN_APPID, XFYUN_API_KEY, XFYUN_API_SECRET]):
        raise ValueError("缺少讯飞 IAT 配置，请检查 .env 中的 XFYUN_APPID / API_KEY / API_SECRET")

    date = _rfc1123_utc_now()
    signature_origin = f"host: {IAT_HOST}\ndate: {date}\nGET {IAT_PATH} HTTP/1.1"
    signature_sha = hmac.new(
        XFYUN_API_SECRET.encode("utf-8"),
        signature_origin.encode("utf-8"),
        digestmod=hashlib.sha256,
    ).digest()
    signature = base64.b64encode(signature_sha).decode("utf-8")
    authorization_origin = (
        f'api_key="{XFYUN_API_KEY}", algorithm="hmac-sha256", '
        f'headers="host date request-line", signature="{signature}"'
    )
    authorization = base64.b64encode(authorization_origin.encode("utf-8")).decode("utf-8")

    query = "&".join(
        [
            f"authorization={quote(authorization, safe='')}",
            f"date={quote(date, safe='')}",
            f"host={quote(IAT_HOST, safe='')}",
        ]
    )
    url = f"wss://{IAT_HOST}{IAT_PATH}?{query}"
    return {"url": url, "app_id": XFYUN_APPID}
