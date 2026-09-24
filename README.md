# Mood Haven · 情绪日记与自我关怀

面向学业 / 职场 / 社交压力下的年轻人：低门槛记录情绪、看见触发因素，并获得冥想 / 音乐 / 运动等自助调节方案。

> 本工具不能替代专业心理咨询。

## 功能

- **今日记录**：选择情绪与强度、标记触发因素；支持**讯飞 ASR 语音输入**
- **触发洞察**：本地统计高频触发与情绪分布
- **自我关怀**：按情绪推荐冥想 / 音乐 / 运动；支持 **Mureka AI 生成疗愈纯音乐**
- **日记**：本地时间线回顾（数据仅存浏览器 `localStorage`）

## 技术

| 能力 | 来源 |
|------|------|
| UI | 手机壳布局 + 底部导航 + 渐变 Hero（借鉴 sweet-sound 结构，青绿 wellness 色系） |
| 语音听写 | 讯飞 IAT（后端 HMAC 鉴权 + WebSocket） |
| 疗愈音乐 | Mureka `instrumental/generate` |

## 本地运行

```bash
# 1. 配置密钥（可复制模板后填入；本地已可从 wuxing-emotion 复用）
cp .env.example .env

# 2. 建议使用虚拟环境
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# 3. 启动（同时提供静态页与 API）
python server.py
# 打开 http://127.0.0.1:8080 （Chrome 开发者工具可切手机预览）
```

`.env` 需要：

```bash
XFYUN_APPID=...
XFYUN_API_KEY=...
XFYUN_API_SECRET=...
MUREKA_API_KEY=...
PORT=8080
```

> 密钥只放在服务端 `.env`，不要提交到 GitHub。仓库已忽略 `.env`。

## 目录

```
├── index.html          # 手机端页面
├── styles.css          # 设计系统
├── js/
│   ├── app.js          # 日记 / 洞察 / 关怀逻辑
│   ├── speech-xfyun.js # 讯飞 ASR 前端
│   └── mureka-music.js # Mureka 生成与轮询
├── backend/            # 讯飞鉴权、IAT WS、Mureka 客户端
├── server.py           # Flask：静态资源 + /api/*
├── requirements.txt
└── .env.example
```

## 部署说明

语音与音乐 API 需要 Python 后端。纯静态托管（如仅 Vercel 静态）无法调用讯飞 / Mureka；请将本服务部署到支持 Python 的环境（Railway、Render、自有服务器等），或前后端分离部署。
