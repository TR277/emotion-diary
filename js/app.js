const STORAGE_KEY = "mood-haven-entries-v1";

const EMOTIONS = [
  { id: "calm", name: "平静", tone: "steady" },
  { id: "happy", name: "开心", tone: "up" },
  { id: "anxious", name: "焦虑", tone: "down" },
  { id: "tired", name: "疲惫", tone: "down" },
  { id: "sad", name: "低落", tone: "down" },
  { id: "angry", name: "烦躁", tone: "down" },
  { id: "lonely", name: "孤单", tone: "down" },
  { id: "hopeful", name: "期待", tone: "up" },
];

const TRIGGERS = [
  "学业压力",
  "工作deadline",
  "人际关系",
  "睡眠不足",
  "身体不适",
  "经济顾虑",
  "自我批判",
  "社交比较",
  "环境嘈杂",
  "不确定未来",
];

const CARE_LIBRARY = {
  calm: {
    context: "你现在偏平稳。适合用轻量练习巩固这份安定。",
    plans: [
      {
        tag: "冥想",
        title: "三分钟呼吸锚定",
        desc: "把注意力带回身体，延长平静的余韵。",
        steps: ["坐直，双脚落地", "吸气 4 秒，呼气 6 秒", "重复 8 轮，感受胸口起伏"],
      },
      {
        tag: "音乐",
        title: "慢节奏纯音乐",
        desc: "选无歌词、节奏稳定的曲子，伴你做事或发呆。",
        steps: ["戴上耳机或放低音量", "听完一首完整曲子", "结束后写下一句此刻感受"],
      },
      {
        tag: "运动",
        title: "散步 10 分钟",
        desc: "用轻度走动维持身心节律。",
        steps: ["到窗边或室外", "步行时只看前方 5 米", "回来喝一杯温水"],
      },
    ],
  },
  happy: {
    context: "开心值得被记住。让它沉淀成可回访的资源。",
    plans: [
      {
        tag: "冥想",
        title: "感恩三件事",
        desc: "把愉悦固化成可提取的积极记忆。",
        steps: ["闭上眼", "心里说出三件小事", "感受身体哪里变暖"],
      },
      {
        tag: "音乐",
        title: "轻快歌单循环",
        desc: "用旋律延长好心情，但避免过度刺激。",
        steps: ["选 2–3 首熟悉的歌", "跟着哼或轻晃身体", "结束后回到当前任务"],
      },
      {
        tag: "运动",
        title: "伸展开肩",
        desc: "让快乐也留在身体里。",
        steps: ["双手交叉上举", "左右侧弯各 5 次", "转转肩、转转腕"],
      },
    ],
  },
  anxious: {
    context: "焦虑常来自不确定。先降低生理唤起，再处理事情。",
    plans: [
      {
        tag: "冥想",
        title: "5-4-3-2-1 接地",
        desc: "用感官把注意力拉回此时此地。",
        steps: ["说 5 样看见的", "4 样摸到的", "3 样听见的，2 样闻到的，1 样尝到的"],
      },
      {
        tag: "音乐",
        title: "低频白噪音 / 雨声",
        desc: "减少噪音干扰，给神经系统降温。",
        steps: ["播放稳定环境音", "设定 8 分钟计时", "期间只做深呼吸"],
      },
      {
        tag: "运动",
        title: "慢走 + 呼气加长",
        desc: "用身体消耗多余紧张。",
        steps: ["出门或走廊慢走", "每两步吸气，每四步呼气", "坚持 8–12 分钟"],
      },
    ],
  },
  tired: {
    context: "疲惫提示边界。先恢复能量，再追求效率。",
    plans: [
      {
        tag: "冥想",
        title: "身体扫描小憩",
        desc: "允许自己暂停，而不是硬撑。",
        steps: ["躺下或靠着椅背", "从脚到头慢慢扫一遍", "在紧绷处多停 2 次呼吸"],
      },
      {
        tag: "音乐",
        title: "轻柔器乐",
        desc: "避免强节奏，选择温柔陪伴。",
        steps: ["音量调到很低", "闭眼听 1 首歌", "起来后喝水、开窗"],
      },
      {
        tag: "运动",
        title: "猫牛式慢速",
        desc: "唤醒脊柱与呼吸，不要剧烈。",
        steps: ["双手双膝着地", "吸气塌腰抬头，呼气拱背", "做 10 次，动作放慢"],
      },
    ],
  },
  sad: {
    context: "低落需要被看见。温和陪伴比立刻振作更重要。",
    plans: [
      {
        tag: "冥想",
        title: "自我慈悲短句",
        desc: "对自己说一句够温柔的话。",
        steps: ["把手放在胸口", "默念：此刻很难，我允许自己慢一点", "重复三遍"],
      },
      {
        tag: "音乐",
        title: "熟悉的安慰曲",
        desc: "选真正让你觉得被抱住的歌，而不是励志歌。",
        steps: ["只听一首", "可以哭或发呆", "结束后写下一句给自己"],
      },
      {
        tag: "运动",
        title: "晒太阳 5 分钟",
        desc: "光与空气是低成本的情绪支持。",
        steps: ["走到有自然光的地方", "站立或坐下", "感受温度后回来继续"],
      },
    ],
  },
  angry: {
    context: "烦躁是信号。先疏导身体，再决定要不要回应。",
    plans: [
      {
        tag: "冥想",
        title: "冷水洗脸觉察",
        desc: "打断自动反应链。",
        steps: ["用凉水洗脸或洗手", "观察怒意强度 0–10", "等降 1–2 分再行动"],
      },
      {
        tag: "音乐",
        title: "鼓点释放后转柔",
        desc: "先允许释放，再慢慢收束。",
        steps: ["听 1 首有力节奏", "接着换 1 首柔和曲子", "写下触发点一句话"],
      },
      {
        tag: "运动",
        title: "快速爬楼梯 / 开合跳",
        desc: "把激动转化成可控消耗。",
        steps: ["选安全空间", "做 40–60 秒间歇", "休息，再评估情绪"],
      },
    ],
  },
  lonely: {
    context: "孤单不等于失败。可以先连结自己，再考虑连结他人。",
    plans: [
      {
        tag: "冥想",
        title: "写信给未来的自己",
        desc: "建立内部陪伴感。",
        steps: ["写三行给一周后的自己", "包括一句鼓励", "存进日记或备忘录"],
      },
      {
        tag: "音乐",
        title: "人声温暖的歌",
        desc: "人声有时能缓解空旷感。",
        steps: ["选温暖主唱的歌", "跟着轻声唱", "结束后想想可联系的一个人"],
      },
      {
        tag: "运动",
        title: "去人气适度的地方走走",
        desc: "不必社交，靠近生活即可。",
        steps: ["去便利店或公园", "观察 3 个路人细节", "买杯热饮回家"],
      },
    ],
  },
  hopeful: {
    context: "期待是燃料。把它落成一小步行动。",
    plans: [
      {
        tag: "冥想",
        title: "未来画面 60 秒",
        desc: "把希望具象化。",
        steps: ["想象渴望的场景", "注意颜色、声音、身体感觉", "睁眼写下下一步"],
      },
      {
        tag: "音乐",
        title: "明亮但不嘈杂的歌",
        desc: "用旋律维持动能。",
        steps: ["选节奏清晰的曲子", "边听边整理桌面 5 分钟", "开始最小下一步"],
      },
      {
        tag: "运动",
        title: "活力拉伸",
        desc: "让身体也进入「准备好了」的状态。",
        steps: ["高抬膝 20 次", "手臂绕环 20 次", "深呼吸两次开干"],
      },
    ],
  },
};

let selectedEmotion = "calm";
let selectedTriggers = new Set();
let voiceRecorder = null;
let isRecording = false;
let musicBusy = false;

function loadEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function emotionById(id) {
  return EMOTIONS.find((e) => e.id === id) || EMOTIONS[0];
}

function formatTime(ts) {
  const d = new Date(ts);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function updateGreeting() {
  const h = new Date().getHours();
  let text = "今天也辛苦了";
  if (h < 11) text = "早上好，先关照一下情绪";
  else if (h < 14) text = "午间停一下，听听自己";
  else if (h < 19) text = "下午的压力可以放下一点";
  else text = "夜晚适合温柔地收束一天";
  document.getElementById("greetingEyebrow").textContent = text;
}

function updateHeroEmotion() {
  const e = emotionById(selectedEmotion);
  document.getElementById("heroEmotion").textContent = e.name;
}

function renderEmotions() {
  const grid = document.getElementById("emotionGrid");
  grid.innerHTML = EMOTIONS.map(
    (e) => `
    <button type="button" class="emotion-btn ${e.id === selectedEmotion ? "is-selected" : ""}" data-emotion="${e.id}" role="option" aria-selected="${e.id === selectedEmotion}">
      <span class="emotion-swatch" aria-hidden="true"></span>
      <span class="emotion-name">${e.name}</span>
    </button>`
  ).join("");
  updateHeroEmotion();
}

function renderTriggers() {
  const row = document.getElementById("triggerChips");
  row.innerHTML = TRIGGERS.map(
    (t) => `
    <button type="button" class="chip ${selectedTriggers.has(t) ? "is-on" : ""}" data-trigger="${t}">${t}</button>`
  ).join("");
}

function switchTab(tab) {
  document.querySelectorAll(".nav-item").forEach((btn) => {
    const on = btn.dataset.tab === tab;
    btn.classList.toggle("is-active", on);
    btn.setAttribute("aria-selected", on ? "true" : "false");
  });
  document.querySelectorAll(".panel").forEach((panel) => {
    const on = panel.id === `panel-${tab}`;
    panel.classList.toggle("is-active", on);
    panel.hidden = !on;
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (tab === "insight") renderInsight();
  if (tab === "care") renderCare();
  if (tab === "history") renderHistory();
}

function saveEntry() {
  const intensity = Number(document.getElementById("intensity").value);
  const note = document.getElementById("note").value.trim();
  const entry = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    emotionId: selectedEmotion,
    intensity,
    triggers: [...selectedTriggers],
    note,
    createdAt: Date.now(),
  };
  const entries = loadEntries();
  entries.unshift(entry);
  saveEntries(entries);

  const hint = document.getElementById("saveHint");
  hint.hidden = false;
  hint.textContent = "已保存。可到「关怀」看看冥想、音乐与运动方案。";
  selectedTriggers = new Set();
  document.getElementById("note").value = "";
  renderTriggers();
  renderCare();

  setTimeout(() => switchTab("care"), 450);
}

function renderInsight() {
  const entries = loadEntries();
  const stats = document.getElementById("statRow");
  const rank = document.getElementById("triggerRank");
  const bars = document.getElementById("emotionBars");
  const story = document.getElementById("insightText");
  document.getElementById("statCount").textContent = String(entries.length);

  if (!entries.length) {
    stats.innerHTML = `
      <div class="stat"><strong>—</strong><span>平均强度</span></div>
      <div class="stat"><strong>—</strong><span>主情绪</span></div>`;
    rank.innerHTML = `<li class="empty">还没有足够数据</li>`;
    bars.innerHTML = `<div class="empty">先去记录一条吧</div>`;
    story.textContent = "先记录几条，洞察会出现在这里。";
    return;
  }

  const avg = (entries.reduce((s, e) => s + e.intensity, 0) / entries.length).toFixed(1);
  const emotionCount = {};
  const triggerCount = {};
  entries.forEach((e) => {
    emotionCount[e.emotionId] = (emotionCount[e.emotionId] || 0) + 1;
    e.triggers.forEach((t) => {
      triggerCount[t] = (triggerCount[t] || 0) + 1;
    });
  });

  const topEmotionId = Object.entries(emotionCount).sort((a, b) => b[1] - a[1])[0][0];
  const topEmotion = emotionById(topEmotionId);

  stats.innerHTML = `
    <div class="stat"><strong>${avg}</strong><span>平均强度</span></div>
    <div class="stat"><strong>${topEmotion.name}</strong><span>出现最多</span></div>`;

  const triggerSorted = Object.entries(triggerCount).sort((a, b) => b[1] - a[1]);
  if (!triggerSorted.length) {
    rank.innerHTML = `<li class="empty">你还没标记触发因素</li>`;
  } else {
    const maxT = triggerSorted[0][1];
    rank.innerHTML = triggerSorted
      .slice(0, 6)
      .map(
        ([name, count]) => `
      <li class="rank-item">
        <div class="rank-top"><span>${name}</span><em>${count} 次</em></div>
        <div class="meter"><span style="width:${Math.max(12, (count / maxT) * 100)}%"></span></div>
      </li>`
      )
      .join("");
  }

  const maxE = Math.max(...Object.values(emotionCount));
  bars.innerHTML = EMOTIONS.filter((e) => emotionCount[e.id])
    .sort((a, b) => (emotionCount[b.id] || 0) - (emotionCount[a.id] || 0))
    .map((e) => {
      const count = emotionCount[e.id] || 0;
      return `<div class="bar-item">
        <div class="rank-top"><span>${e.name}</span><em>${count} 次</em></div>
        <div class="meter"><span style="width:${Math.max(12, (count / maxE) * 100)}%"></span></div>
      </div>`;
    })
    .join("");

  const topTrigger = triggerSorted[0]?.[0];
  const downRatio =
    entries.filter((e) => emotionById(e.emotionId).tone === "down").length / entries.length;
  if (topTrigger && downRatio >= 0.5) {
    story.textContent = `最近「${topTrigger}」出现较多，且偏消耗型情绪占比约 ${Math.round(
      downRatio * 100
    )}%。下次再遇到时，可先用 3 分钟呼吸或短走打断自动反应。`;
  } else if (topTrigger) {
    story.textContent = `你最常提到的触发是「${topTrigger}」。它未必是坏事，但值得提前准备一个固定的小调节动作。`;
  } else {
    story.textContent = `你最近较常感到「${topEmotion.name}」。试着在记录时补上触发因素，洞察会更清晰。`;
  }
}

function renderCare() {
  const entries = loadEntries();
  const latest = entries[0];
  const emotionId = latest?.emotionId || selectedEmotion;
  const emotion = emotionById(emotionId);
  const pack = CARE_LIBRARY[emotionId] || CARE_LIBRARY.calm;
  const context = document.getElementById("careContext");
  const grid = document.getElementById("careGrid");

  context.textContent = latest
    ? `基于最近一次：${emotion.name} · 强度 ${latest.intensity}/10。${pack.context}`
    : `还没有日记，先按当前选择的「${emotion.name}」给你一套通用方案。${pack.context}`;

  grid.innerHTML = pack.plans
    .map(
      (p) => `
    <article class="care-card">
      <span class="care-tag">${p.tag}</span>
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
      <ol class="care-steps">${p.steps.map((s) => `<li>${s}</li>`).join("")}</ol>
    </article>`
    )
    .join("");
}

function renderHistory() {
  const entries = loadEntries();
  const timeline = document.getElementById("timeline");
  if (!entries.length) {
    timeline.innerHTML = `<div class="empty soft-card">还没有日记。去「记录」写第一条吧。</div>`;
    return;
  }
  timeline.innerHTML = entries
    .map((e) => {
      const emotion = emotionById(e.emotionId);
      const triggers = e.triggers?.length
        ? `<div class="entry-triggers">${e.triggers.map((t) => `<span>${t}</span>`).join("")}</div>`
        : "";
      const note = e.note ? `<p class="entry-note">${escapeHtml(e.note)}</p>` : "";
      return `<article class="entry">
        <div class="entry-top">
          <div class="entry-mood">${emotion.name} · ${e.intensity}/10</div>
          <div class="entry-time">${formatTime(e.createdAt)}</div>
        </div>
        ${triggers}
        ${note}
      </article>`;
    })
    .join("");
}

function escapeHtml(str) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function setVoiceUi(recording, statusText) {
  const btn = document.getElementById("voiceBtn");
  const label = document.getElementById("voiceBtnLabel");
  const status = document.getElementById("voiceStatus");
  btn.classList.toggle("is-recording", recording);
  btn.setAttribute("aria-pressed", recording ? "true" : "false");
  label.textContent = recording ? "结束录音" : "语音输入";
  if (statusText) {
    status.hidden = false;
    status.textContent = statusText;
  } else if (!recording) {
    status.hidden = true;
    status.textContent = "";
  }
}

async function toggleVoice() {
  const status = document.getElementById("voiceStatus");

  if (!window.XfyunIatRecorder) {
    status.hidden = false;
    status.textContent = "语音模块未加载";
    return;
  }

  if (!isRecording) {
    const ok = window.checkBackendAvailable ? await window.checkBackendAvailable() : false;
    if (!ok) {
      status.hidden = false;
      status.textContent = "后端未启动：请运行 python server.py 后再用语音";
      return;
    }

    voiceRecorder =
      voiceRecorder ||
      new window.XfyunIatRecorder({
        onTranscript: (text) => {
          const note = document.getElementById("note");
          note.value = note.value ? `${note.value.trim()} ${text}` : text;
        },
        onStatus: (msg) => setVoiceUi(isRecording, msg),
        onError: (msg) => {
          isRecording = false;
          setVoiceUi(false, msg);
        },
      });

    try {
      await voiceRecorder.start();
      isRecording = true;
      setVoiceUi(true, "正在录音…再点一次结束");
    } catch (err) {
      isRecording = false;
      setVoiceUi(false, err.message || "无法打开麦克风");
    }
    return;
  }

  isRecording = false;
  setVoiceUi(false, "正在识别…");
  await voiceRecorder.stop();
}

async function handleGenerateMusic() {
  if (musicBusy) return;
  const status = document.getElementById("musicStatus");
  const player = document.getElementById("musicPlayer");
  const btn = document.getElementById("genMusicBtn");

  const ok = window.checkBackendAvailable ? await window.checkBackendAvailable() : false;
  if (!ok) {
    status.hidden = false;
    status.textContent = "后端未启动：请运行 python server.py";
    return;
  }

  const entries = loadEntries();
  const latest = entries[0];
  const emotionId = latest?.emotionId || selectedEmotion;
  const note = latest?.note || document.getElementById("note").value.trim();

  musicBusy = true;
  btn.disabled = true;
  status.hidden = false;
  player.hidden = true;

  try {
    const result = await window.generateEmotionMusic({
      emotionId,
      note,
      musicType: "instrumental",
      onStatus: (msg) => {
        status.textContent = msg;
      },
    });
    player.src = result.audioUrl;
    player.hidden = false;
    player.play().catch(() => {});
    status.textContent = "生成完成，可以播放啦";
  } catch (err) {
    status.textContent = err.message || "音乐生成失败";
  } finally {
    musicBusy = false;
    btn.disabled = false;
  }
}

function bind() {
  document.querySelector(".bottom-nav").addEventListener("click", (e) => {
    const tab = e.target.closest(".nav-item");
    if (tab) switchTab(tab.dataset.tab);
  });

  document.getElementById("emotionGrid").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-emotion]");
    if (!btn) return;
    selectedEmotion = btn.dataset.emotion;
    renderEmotions();
  });

  document.getElementById("triggerChips").addEventListener("click", (e) => {
    const chip = e.target.closest("[data-trigger]");
    if (!chip) return;
    const t = chip.dataset.trigger;
    if (selectedTriggers.has(t)) selectedTriggers.delete(t);
    else selectedTriggers.add(t);
    renderTriggers();
  });

  document.getElementById("intensity").addEventListener("input", (e) => {
    document.getElementById("intensityValue").textContent = e.target.value;
  });

  document.getElementById("saveBtn").addEventListener("click", saveEntry);
  document.getElementById("voiceBtn").addEventListener("click", toggleVoice);
  document.getElementById("genMusicBtn").addEventListener("click", handleGenerateMusic);
}

updateGreeting();
renderEmotions();
renderTriggers();
bind();
renderCare();
