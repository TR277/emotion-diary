"""讯飞 Spark 情绪分析报告（日记场景）。"""

from __future__ import annotations

import json
import re
from typing import Any

import requests

from backend.config import MOCK_SPARK, SPARK_API_KEY, SPARK_API_SECRET

SPARK_URL = "https://spark-api-open.xf-yun.com/v1/chat/completions"
SPARK_MODEL = "4.0Ultra"

EMOTION_KEYS = ["平静", "开心", "焦虑", "疲惫", "低落", "烦躁", "孤单", "期待"]

EMOTION_ID_TO_ZH = {
    "calm": "平静",
    "happy": "开心",
    "anxious": "焦虑",
    "tired": "疲惫",
    "sad": "低落",
    "angry": "烦躁",
    "lonely": "孤单",
    "hopeful": "期待",
}


def _spark_stream_chat(user_prompt: str, timeout: int = 60) -> tuple[str, bool]:
    if MOCK_SPARK or not (SPARK_API_KEY and SPARK_API_SECRET):
        return "", True

    payload = {
        "model": SPARK_MODEL,
        "messages": [{"role": "user", "content": user_prompt}],
        "stream": True,
    }
    headers = {
        "Authorization": f"Bearer {SPARK_API_KEY}:{SPARK_API_SECRET}",
        "Content-Type": "application/json",
    }

    try:
        response = requests.post(
            SPARK_URL, headers=headers, json=payload, stream=True, timeout=timeout
        )
        response.encoding = "utf-8"
        complete = ""
        for line in response.iter_lines(decode_unicode=True):
            if not line or not line.startswith("data: "):
                continue
            if line == "data: [DONE]":
                break
            try:
                chunk = json.loads(line[6:])
                content = chunk.get("choices", [{}])[0].get("delta", {}).get("content", "")
                complete += content
            except json.JSONDecodeError:
                continue
        if response.status_code >= 400 and not complete:
            return f"HTTP {response.status_code}", True
        return complete.strip(), False
    except Exception as exc:
        print(f"Spark API 错误: {exc}")
        return str(exc), True


def _zero_scores() -> dict[str, float]:
    return {k: 0.0 for k in EMOTION_KEYS}


def _local_report(
    emotion_id: str,
    intensity: int,
    triggers: list[str],
    note: str,
) -> dict[str, Any]:
    zh = EMOTION_ID_TO_ZH.get(emotion_id, "平静")
    scores = _zero_scores()
    scores[zh] = round(min(1.0, max(0.15, intensity / 10)), 2)
    for k in EMOTION_KEYS:
        if k != zh:
            scores[k] = round((1 - scores[zh]) / (len(EMOTION_KEYS) - 1), 3)

    trigger_text = "、".join(triggers) if triggers else "未标记具体触发"
    note_hint = f"你写到：「{note[:80]}」。" if note else ""

    suggestions_map = {
        "焦虑": ["做 5-4-3-2-1 感官 grounding 3 分钟", "把待办拆成最小下一步", "听一段慢节奏环境音"],
        "疲惫": ["允许自己小憩或拉伸 5 分钟", "减少并行任务，只保留一件", "喝水、开窗换气"],
        "低落": ["对自己说一句温柔的话", "联系一位安全的人分享近况", "做一件很小的照顾自己的事"],
        "烦躁": ["先冷水洗手或短暂离开现场", "把怒意强度从 0–10 标出来", "运动短时释放后再决策"],
        "孤单": ["先连结自己：写三行给未来的自己", "去人气适度的地方走走", "听听有温暖人声的音乐"],
        "开心": ["把此刻记成可回访的积极记忆", "用轻快但不嘈杂的音乐延长好心情", "把快乐分享给一个重要的人"],
        "期待": ["把期待落成一个最小行动", "写下明天的第一步", "用明亮但不刺激的旋律维持动能"],
        "平静": ["用三分钟呼吸巩固安定", "散步或慢节奏纯音乐陪伴", "回顾今天哪里做得足够好"],
    }

    return {
        "title": "今日情绪简报",
        "mood_label": f"偏{zh}",
        "summary": (
            f"你此刻标记的主情绪是「{zh}」，强度 {intensity}/10。"
            f"{note_hint}主要关联触发：{trigger_text}。"
        ),
        "trigger_analysis": (
            f"触发因素集中在「{trigger_text}」。学业/职场/社交压力常会叠加睡眠与自我批判，"
            "建议先降低身体唤起，再处理具体事情。"
            if triggers
            else "这次没有勾选触发因素。下次可补上，报告会更贴近你的真实情境。"
        ),
        "body_mind": (
            f"强度 {intensity}/10 说明情绪信号已经比较清晰。"
            "身体可能出现紧绷、呼吸变浅或想逃避——这是正常的保护反应，不是失败。"
        ),
        "suggestions": suggestions_map.get(zh, suggestions_map["平静"]),
        "encouragement": "你已经完成记录，这本身就是自我关怀的一步。",
        "scores": scores,
        "is_mock": True,
        "source": "local",
    }


def _parse_report_json(raw: str) -> dict[str, Any] | None:
    match = re.search(r"\{.*\}", raw, re.DOTALL)
    if not match:
        return None
    try:
        data = json.loads(match.group())
    except json.JSONDecodeError:
        return None
    if not isinstance(data, dict):
        return None
    return data


def analyze_diary_entry(
    emotion_id: str,
    intensity: int,
    triggers: list[str] | None = None,
    note: str = "",
) -> dict[str, Any]:
    """生成情绪分析报告；Spark 不可用时回退本地规则。"""
    triggers = triggers or []
    zh = EMOTION_ID_TO_ZH.get(emotion_id, "平静")
    intensity = int(max(1, min(10, intensity or 5)))

    fallback = _local_report(emotion_id, intensity, triggers, note)

    if MOCK_SPARK or not (SPARK_API_KEY and SPARK_API_SECRET):
        return fallback

    prompt = (
        "你是面向年轻人的情绪自我关怀助手（非心理医生、不做临床诊断）。"
        "根据用户情绪日记打卡，输出一份温和、具体、可执行的分析报告。"
        "只输出 JSON，不要 markdown，不要解释。字段如下：\n"
        "{\n"
        '  "title": "今日情绪简报",\n'
        '  "mood_label": "如：偏焦虑 / 偏疲惫",\n'
        '  "summary": "2-3句总览",\n'
        '  "trigger_analysis": "触发因素分析，结合学业/职场/社交压力语境",\n'
        '  "body_mind": "可能的身心信号解读",\n'
        '  "suggestions": ["建议1", "建议2", "建议3"],\n'
        '  "encouragement": "一句鼓励",\n'
        '  "scores": {"平静":0.1,"开心":0.05,"焦虑":0.45,"疲惫":0.2,"低落":0.1,"烦躁":0.05,"孤单":0.03,"期待":0.02}\n'
        "}\n"
        "scores 八个键必须齐全，数值 0-1，大致反映当前情绪分布。\n\n"
        f"用户选择情绪：{zh}（id={emotion_id}）\n"
        f"强度：{intensity}/10\n"
        f"触发因素：{'、'.join(triggers) if triggers else '无'}\n"
        f"备注：{note.strip() or '无'}"
    )

    raw, is_mock = _spark_stream_chat(prompt, timeout=75)
    if is_mock or not raw:
        fallback["raw"] = raw or ""
        return fallback

    parsed = _parse_report_json(raw)
    if not parsed:
        fallback["raw"] = raw
        return fallback

    scores = _zero_scores()
    raw_scores = parsed.get("scores") or {}
    if isinstance(raw_scores, dict):
        for key in EMOTION_KEYS:
            try:
                scores[key] = max(0.0, min(1.0, float(raw_scores.get(key, 0))))
            except (TypeError, ValueError):
                scores[key] = 0.0

    suggestions = parsed.get("suggestions") or fallback["suggestions"]
    if not isinstance(suggestions, list):
        suggestions = fallback["suggestions"]
    suggestions = [str(s) for s in suggestions][:5]

    return {
        "title": str(parsed.get("title") or "今日情绪简报"),
        "mood_label": str(parsed.get("mood_label") or f"偏{zh}"),
        "summary": str(parsed.get("summary") or fallback["summary"]),
        "trigger_analysis": str(parsed.get("trigger_analysis") or fallback["trigger_analysis"]),
        "body_mind": str(parsed.get("body_mind") or fallback["body_mind"]),
        "suggestions": suggestions,
        "encouragement": str(parsed.get("encouragement") or fallback["encouragement"]),
        "scores": scores,
        "is_mock": False,
        "source": "spark",
        "raw": raw[:500],
    }
