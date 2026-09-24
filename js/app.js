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

const SPOTIFY_SONGS = [
  {
    title: "Weightless",
    artist: "Marconi Union · 减压环境音",
    art: "art-1",
    url: "https://open.spotify.com/search/Weightless%20Marconi%20Union",
  },
  {
    title: "Experience",
    artist: "Ludovico Einaudi · 钢琴",
    art: "art-2",
    url: "https://open.spotify.com/search/Experience%20Ludovico%20Einaudi",
  },
  {
    title: "Spiegel im Spiegel",
    artist: "Arvo Pärt · 极简静心",
    art: "art-3",
    url: "https://open.spotify.com/search/Spiegel%20im%20Spiegel",
  },
  {
    title: "Calm Piano",
    artist: "精选歌单 · 专注与放松",
    art: "art-4",
    url: "https://open.spotify.com/search/calm%20piano%20playlist",
  },
];

function updateGreeting() {
  const h = new Date().getHours();
  let text = "今天也辛苦了";
  if (h < 11) text = "早上好，先关照一下情绪";
  else if (h < 14) text = "午间停一下，听听自己";
  else if (h < 19) text = "下午的压力可以放下一点";
  else text = "夜晚适合温柔地收束一天";
  document.getElementById("greetingEyebrow").textContent = text;
}

function updateHomeSummary() {
  const el = document.getElementById("homeSummary");
  const entries = loadEntries();
  if (!entries.length) {
    el.textContent = "先照顾好情绪，再面对学业、职场与社交。点下方开始今日记录。";
    return;
  }
  const latest = entries[0];
  const emotion = emotionById(latest.emotionId);
  const monthCount = entries.filter((e) => {
    const d = new Date(e.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  el.textContent = `本月已记录 ${monthCount} 次。最近一次是「${emotion.name}」· 强度 ${latest.intensity}/10。`;
}

function renderHome() {
  updateHomeSummary();

  const rail = document.getElementById("featureRail");
  const entries = loadEntries();
  const latest = entries[0];
  const emotionId = latest?.emotionId || selectedEmotion;
  const pack = CARE_LIBRARY[emotionId] || CARE_LIBRARY.calm;

  const features = [
    {
      rank: "1",
      title: pack.plans[0]?.title || "三分钟呼吸",
      sub: "冥想 · 低门槛调节",
      cls: "",
      img: "assets/meditation.jpg",
      href: "",
    },
    {
      rank: "2",
      title: pack.plans[2]?.title || "轻运动",
      sub: "运动 · 释放紧张",
      cls: "",
      img: "assets/exercise.jpg",
      href: "",
    },
    {
      rank: "3",
      title: "打开音乐放松",
      sub: "音乐 · 在 Spotify 收听",
      cls: "",
      img: "assets/music-starboy.png",
      href: "https://open.spotify.com/search/Starboy%20The%20Weeknd",
    },
  ];

  rail.innerHTML = features
    .map((f) => {
      const img = f.img ? `<img src="${f.img}" alt="" />` : "";
      const extra = f.img ? "" : f.cls || "feature-card-tone";
      const inner = `
        ${img}
        <div class="feature-fade"></div>
        <p class="feature-rank">${f.rank}</p>
        <div class="feature-body">
          <h3>${f.title}</h3>
          <p>${f.sub}</p>
        </div>`;
      if (f.href) {
        return `<a class="feature-card ${extra}" href="${f.href}" target="_blank" rel="noopener noreferrer">${inner}</a>`;
      }
      return `<article class="feature-card ${extra}">${inner}</article>`;
    })
    .join("");

  const list = document.getElementById("songList");
  list.innerHTML = SPOTIFY_SONGS.map(
    (s, i) => `
    <a class="song-item" href="${s.url}" target="_blank" rel="noopener noreferrer">
      <span class="song-rank">${i + 1}</span>
      <span class="song-art ${s.art}" aria-hidden="true">SP</span>
      <span class="song-meta">
        <strong>${s.title}</strong>
        <span>${s.artist}</span>
      </span>
      <span class="spotify-badge" aria-label="在 Spotify 打开">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.52 17.34c-.24.36-.66.48-1.02.24-2.82-1.74-6.36-2.1-10.56-1.14-.42.12-.78-.18-.9-.54-.12-.42.18-.78.54-.9 4.56-1.02 8.52-.6 11.64 1.32.42.18.48.66.3 1.02zm1.44-3.18c-.3.42-.84.6-1.26.3-3.24-1.98-8.16-2.58-11.94-1.38-.48.12-.96-.12-1.08-.6-.12-.48.12-.96.6-1.08 4.38-1.32 9.76-.66 13.4 1.62.42.24.54.84.28 1.14zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.3c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.72 1.62.54.3.72 1.02.42 1.56-.3.48-1.02.66-1.56.36z"/></svg>
      </span>
    </a>`
  ).join("");
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
  // report 面板不在底栏，单独处理高亮
  if (tab === "report") {
    document.querySelectorAll(".nav-item").forEach((btn) => {
      btn.classList.remove("is-active");
      btn.setAttribute("aria-selected", "false");
    });
  }
  document.querySelectorAll(".panel").forEach((panel) => {
    const on = panel.id === `panel-${tab}`;
    panel.classList.toggle("is-active", on);
    panel.hidden = !on;
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (tab === "home") renderHome();
  if (tab === "insight") renderInsight();
  if (tab === "history") renderHistory();
}

function showReport(report) {
  document.getElementById("reportTitle").textContent = report.title || "今日情绪简报";
  document.getElementById("reportMood").textContent = report.mood_label || "—";
  document.getElementById("reportSummary").textContent = report.summary || "—";
  document.getElementById("reportTriggers").textContent = report.trigger_analysis || "—";
  document.getElementById("reportBodyMind").textContent = report.body_mind || "—";
  document.getElementById("reportEncourage").textContent = report.encouragement || "—";

  const src = document.getElementById("reportSource");
  if (report.is_mock || report.source === "local") {
    src.textContent = "本地规则分析（星火暂不可用时的备用报告）";
  } else {
    src.textContent = "讯飞星火 Spark 情绪分析";
  }

  const scores = report.scores || {};
  const entries = Object.entries(scores).filter(([, v]) => Number(v) > 0);
  entries.sort((a, b) => Number(b[1]) - Number(a[1]));
  const max = Math.max(...entries.map(([, v]) => Number(v)), 0.01);
  const box = document.getElementById("reportScores");
  if (!entries.length) {
    box.innerHTML = `<div class="empty">暂无分布数据</div>`;
  } else {
    box.innerHTML = entries
      .map(
        ([name, val]) => `
      <div class="bar-item">
        <div class="rank-top"><span>${name}</span><em>${Math.round(Number(val) * 100)}%</em></div>
        <div class="meter"><span style="width:${Math.max(8, (Number(val) / max) * 100)}%"></span></div>
      </div>`
      )
      .join("");
  }

  const list = document.getElementById("reportSuggestions");
  const tips = report.suggestions || [];
  list.innerHTML = tips.length
    ? tips.map((t) => `<li>${escapeHtml(String(t))}</li>`).join("")
    : "<li>回到首页试试冥想、运动或音乐推荐</li>";

  switchTab("report");
}

async function fetchEmotionReport(entry) {
  const resp = await fetch(apiUrl("/api/spark/analyze"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      emotion_id: entry.emotionId,
      intensity: entry.intensity,
      triggers: entry.triggers,
      note: entry.note,
    }),
  });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    throw new Error(data.error || "分析请求失败");
  }
  return data;
}

async function saveEntry() {
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
  const saveBtn = document.getElementById("saveBtn");
  hint.hidden = false;
  hint.innerHTML = `<span class="analyzing-hint"><span class="analyzing-dot"></span>正在生成讯飞星火分析报告…</span>`;
  saveBtn.disabled = true;

  selectedTriggers = new Set();
  document.getElementById("note").value = "";
  renderTriggers();
  renderHome();

  try {
    const report = await fetchEmotionReport(entry);
    entry.report = {
      mood_label: report.mood_label,
      summary: report.summary,
      source: report.source,
      is_mock: report.is_mock,
    };
    const all = loadEntries();
    const idx = all.findIndex((e) => e.id === entry.id);
    if (idx >= 0) {
      all[idx] = entry;
      saveEntries(all);
    }
    hint.textContent = "分析完成";
    showReport(report);
  } catch (err) {
    hint.textContent = err.message || "分析失败，已保存日记";
    // 仍给出本地兜底报告
    showReport({
      title: "今日情绪简报",
      mood_label: emotionById(entry.emotionId).name,
      summary: `已保存「${emotionById(entry.emotionId).name}」· 强度 ${entry.intensity}/10。分析服务暂时不可用，请确认 Render 已配置 SPARK_API_KEY。`,
      trigger_analysis: entry.triggers?.length
        ? `触发：${entry.triggers.join("、")}`
        : "未标记触发因素。",
      body_mind: "先照顾呼吸与身体，再处理具体压力源。",
      suggestions: ["回首页试试冥想或运动", "听听 Spotify 放松歌单", "需要时生成 AI 疗愈音乐"],
      encouragement: "记录本身已经是很好的一步。",
      scores: {},
      is_mock: true,
      source: "local",
    });
  } finally {
    saveBtn.disabled = false;
  }
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
      const reportBit = e.report?.mood_label
        ? `<p class="entry-note">分析：${escapeHtml(e.report.mood_label)}</p>`
        : "";
      return `<article class="entry">
        <div class="entry-top">
          <div class="entry-mood">${emotion.name} · ${e.intensity}/10</div>
          <div class="entry-time">${formatTime(e.createdAt)}</div>
        </div>
        ${triggers}
        ${note}
        ${reportBit}
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
      status.textContent =
        "语音需要 Python 后端。本地请运行 python server.py；若用 Vercel，请在 index.html 配置 window.API_BASE";
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
    status.textContent =
      "音乐生成需要 Python 后端。本地请运行 python server.py；若用 Vercel，请在 index.html 配置 window.API_BASE";
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

  document.getElementById("goCheckinBtn").addEventListener("click", () => switchTab("checkin"));

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
  document.getElementById("reportToHomeBtn").addEventListener("click", () => switchTab("home"));
  document.getElementById("reportAgainBtn").addEventListener("click", () => switchTab("checkin"));
}

updateGreeting();
renderEmotions();
renderTriggers();
bind();
renderHome();
