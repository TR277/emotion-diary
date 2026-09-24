"""情绪日记后端：静态页 + 讯飞 ASR + Mureka 音乐生成。"""

import base64
from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

from backend.config import PORT, ROOT_DIR, SPARK_API_KEY, SPARK_API_SECRET
from backend.iat_config import IAT_MIN_PCM_BYTES
from backend.iat_ws import transcribe_pcm_on_server
from backend.mureka_client import (
    build_emotion_payload,
    extract_audio_url,
    generate_instrumental,
    generate_song,
    query_instrumental,
    query_song,
)
from backend.spark_analyze import analyze_diary_entry
from backend.xfyun_auth import build_iat_auth_url

app = Flask(__name__, static_folder=str(ROOT_DIR), static_url_path="")
CORS(app)


@app.route("/")
def index():
    return send_from_directory(ROOT_DIR, "index.html")


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify(
        {
            "status": "ok",
            "service": "emotion-diary",
            "spark": bool(SPARK_API_KEY and SPARK_API_SECRET),
        }
    )


@app.route("/api/xfyun/auth", methods=["GET", "POST"])
def xfyun_auth():
    try:
        return jsonify(build_iat_auth_url())
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 503


@app.route("/api/xfyun/transcribe", methods=["POST"])
def xfyun_transcribe():
    data = request.get_json(silent=True) or {}
    pcm_b64 = data.get("pcm", "")
    if not pcm_b64:
        return jsonify({"error": "pcm 不能为空"}), 400

    try:
        pcm = base64.b64decode(pcm_b64)
    except Exception:
        return jsonify({"error": "pcm 格式无效"}), 400

    if len(pcm) < IAT_MIN_PCM_BYTES:
        return jsonify({"error": "录音太短，请多说几个字"}), 400

    try:
        text = transcribe_pcm_on_server(pcm)
        return jsonify({"text": text, "language": "zh_cn"})
    except RuntimeError as exc:
        return jsonify({"error": str(exc)}), 502
    except Exception as exc:
        return jsonify({"error": f"听写失败: {exc}"}), 500


@app.route("/api/spark/analyze", methods=["POST"])
def spark_analyze():
    """讯飞 Spark 情绪分析报告。"""
    data = request.get_json(silent=True) or {}
    emotion_id = (data.get("emotion_id") or "calm").strip()
    try:
        intensity = int(data.get("intensity") or 5)
    except (TypeError, ValueError):
        intensity = 5
    triggers = data.get("triggers") or []
    if not isinstance(triggers, list):
        triggers = []
    note = (data.get("note") or "").strip()

    try:
        report = analyze_diary_entry(
            emotion_id=emotion_id,
            intensity=intensity,
            triggers=[str(t) for t in triggers],
            note=note,
        )
        return jsonify(report)
    except Exception as exc:
        return jsonify({"error": f"分析失败: {exc}"}), 500


@app.route("/api/mureka/generate", methods=["POST"])
def mureka_generate():
    data = request.get_json(silent=True) or {}
    emotion_id = (data.get("emotion_id") or "calm").strip()
    music_type = (data.get("music_type") or "instrumental").strip().lower()
    note = (data.get("note") or "").strip()

    if music_type not in ("song", "instrumental"):
        return jsonify({"error": "music_type 须为 song 或 instrumental"}), 400

    try:
        payload = build_emotion_payload(emotion_id, music_type=music_type, note=note)
        if music_type == "instrumental":
            result, status = generate_instrumental(payload)
        else:
            result, status = generate_song(payload)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 503
    except Exception as exc:
        return jsonify({"error": f"提交生成失败: {exc}"}), 500

    if status >= 400:
        return jsonify({"error": result.get("error", result)}), status

    return jsonify(
        {
            "task": result,
            "task_id": result.get("id"),
            "music_type": music_type,
            "emotion_id": emotion_id,
            "payload_preview": {
                "prompt": payload.get("prompt"),
                "lyrics": payload.get("lyrics"),
            },
        }
    )


@app.route("/api/mureka/query/<task_id>", methods=["GET"])
def mureka_query(task_id):
    music_type = (request.args.get("music_type") or "instrumental").strip().lower()
    try:
        if music_type == "song":
            result, status = query_song(task_id)
        else:
            result, status = query_instrumental(task_id)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 503
    except Exception as exc:
        return jsonify({"error": f"查询失败: {exc}"}), 500

    if status >= 400:
        return jsonify({"error": result.get("error", result)}), status

    return jsonify(
        {
            "task": result,
            "status": result.get("status"),
            "audio_url": extract_audio_url(result),
            "failed_reason": result.get("failed_reason"),
        }
    )


@app.route("/<path:path>")
def static_proxy(path):
    target = Path(ROOT_DIR) / path
    if target.is_file():
        return send_from_directory(ROOT_DIR, path)
    return send_from_directory(ROOT_DIR, "index.html")


if __name__ == "__main__":
    print(f"情绪日记后端启动: http://127.0.0.1:{PORT}")
    print("请在浏览器打开上述地址（建议用手机宽度预览）。")
    app.run(host="0.0.0.0", port=PORT, debug=True, use_reloader=False)
