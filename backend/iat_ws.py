"""讯飞 IAT WebSocket 客户端。"""

import base64
import json
import threading
import time
from typing import Optional

import websocket

from backend.iat_config import (
    IAT_ACCENT,
    IAT_FRAME_BYTES,
    IAT_FRAME_INTERVAL_SEC,
    IAT_LANGUAGE,
    IAT_VAD_EOS,
)
from backend.xfyun_auth import build_iat_auth_url


def transcribe_pcm_over_ws(pcm: bytes, url: str, app_id: str, timeout: float = 20.0) -> str:
    segments: dict[int, str] = {}
    result_holder: list[str] = [""]
    error_holder: list[Optional[str]] = [None]
    done = threading.Event()

    def finish(err: Optional[str] = None, text: Optional[str] = None) -> None:
        if done.is_set():
            return
        if err:
            error_holder[0] = err
        if text is not None:
            result_holder[0] = text
        done.set()
        try:
            ws_app.close()
        except Exception:
            pass

    def sorted_text() -> str:
        return "".join(segments[k] for k in sorted(segments.keys()))

    def on_message(_ws, message: str) -> None:
        try:
            payload = json.loads(message)
        except json.JSONDecodeError:
            return

        if payload.get("code") != 0:
            finish(payload.get("message") or f"听写错误 {payload.get('code')}")
            return

        result = payload.get("data", {}).get("result")
        if result and result.get("ws"):
            text = ""
            for item in result["ws"]:
                for word in item.get("cw", []):
                    text += word.get("w", "")
            sn = result.get("sn", 0)
            if result.get("pgs") == "rpl":
                segments[sn] = text
            else:
                segments[sn] = segments.get(sn, "") + text

        if payload.get("data", {}).get("status") == 2:
            finish(text=sorted_text())

    def on_error(_ws, err) -> None:
        msg = str(err) if err else "听写 WebSocket 连接失败"
        if "401" in msg:
            finish("讯飞听写鉴权失败 (401) — 请检查 .env 中的 XFYUN_API_KEY / XFYUN_API_SECRET")
        else:
            finish(f"听写 WebSocket 连接失败: {msg}" if msg else "听写 WebSocket 连接失败")

    def on_close(_ws, status_code, _msg) -> None:
        if done.is_set():
            return
        final = sorted_text()
        if final:
            finish(text=final)
        else:
            finish(
                f"听写连接关闭 ({status_code})" if status_code else "听写 WebSocket 连接失败"
            )

    def on_open(ws) -> None:
        def send_frames() -> None:
            try:
                offset = 0
                is_first = True
                pcm_len = len(pcm)

                while True:
                    chunk = pcm[offset : offset + IAT_FRAME_BYTES]
                    is_last = offset + IAT_FRAME_BYTES >= pcm_len
                    offset += len(chunk)

                    b64 = base64.b64encode(chunk).decode("ascii")

                    if is_first:
                        ws.send(
                            json.dumps(
                                {
                                    "common": {"app_id": app_id},
                                    "business": {
                                        "domain": "iat",
                                        "language": IAT_LANGUAGE,
                                        "accent": IAT_ACCENT,
                                        "vinfo": 1,
                                        "vad_eos": IAT_VAD_EOS,
                                    },
                                    "data": {
                                        "status": 0,
                                        "format": "audio/L16;rate=16000",
                                        "audio": b64,
                                        "encoding": "raw",
                                    },
                                }
                            )
                        )
                        is_first = False
                    elif is_last:
                        ws.send(
                            json.dumps(
                                {
                                    "data": {
                                        "status": 2,
                                        "format": "audio/L16;rate=16000",
                                        "audio": b64,
                                        "encoding": "raw",
                                    },
                                }
                            )
                        )
                        break
                    else:
                        ws.send(
                            json.dumps(
                                {
                                    "data": {
                                        "status": 1,
                                        "format": "audio/L16;rate=16000",
                                        "audio": b64,
                                        "encoding": "raw",
                                    },
                                }
                            )
                        )

                    time.sleep(IAT_FRAME_INTERVAL_SEC)
            except Exception as exc:
                finish(str(exc))

        threading.Thread(target=send_frames, daemon=True).start()

    ws_app = websocket.WebSocketApp(
        url,
        on_open=on_open,
        on_message=on_message,
        on_error=on_error,
        on_close=on_close,
    )

    thread = threading.Thread(target=ws_app.run_forever, daemon=True)
    thread.start()

    if not done.wait(timeout):
        finish("听写超时，请重试")

    thread.join(timeout=1)

    if error_holder[0] and not result_holder[0]:
        raise RuntimeError(error_holder[0])
    return (result_holder[0] or "").strip()


def transcribe_pcm_on_server(pcm: bytes) -> str:
    auth = build_iat_auth_url()
    return transcribe_pcm_over_ws(pcm, auth["url"], auth["app_id"])
