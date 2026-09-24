/**
 * Mureka 情绪疗愈音乐：提交生成 → 轮询 → 播放
 */
async function generateEmotionMusic({ emotionId, note = "", musicType = "instrumental", onStatus }) {
  const say = onStatus || (() => {});
  say("正在提交生成任务…");

  const resp = await fetch("/api/mureka/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      emotion_id: emotionId,
      music_type: musicType,
      note,
    }),
  });

  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    throw new Error(typeof data.error === "string" ? data.error : "音乐生成提交失败");
  }

  const taskId = data.task_id;
  if (!taskId) {
    throw new Error("未返回 task_id");
  }

  say("作曲中，大约需要 1–2 分钟…");

  const maxTries = 90;
  for (let i = 0; i < maxTries; i++) {
    await sleep(4000);
    const q = await fetch(`/api/mureka/query/${encodeURIComponent(taskId)}?music_type=${musicType}`);
    const qd = await q.json().catch(() => ({}));
    if (!q.ok) {
      throw new Error(typeof qd.error === "string" ? qd.error : "查询任务失败");
    }

    const status = (qd.status || "").toLowerCase();
    if (status === "succeeded" || status === "success" || status === "completed") {
      if (!qd.audio_url) throw new Error("生成成功但没有音频地址");
      say("生成完成");
      return {
        audioUrl: qd.audio_url,
        taskId,
        musicType,
        emotionId,
        preview: data.payload_preview,
      };
    }
    if (status === "failed" || status === "error") {
      throw new Error(qd.failed_reason || "音乐生成失败");
    }
    say(`作曲中… (${i + 1}/${maxTries})`);
  }

  throw new Error("生成超时，请稍后重试");
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

window.generateEmotionMusic = generateEmotionMusic;
