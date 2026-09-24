/**
 * 讯飞 IAT 中文语音听写
 * MediaRecorder → PCM 16k → POST /api/xfyun/transcribe
 */
class XfyunIatRecorder {
  constructor(options = {}) {
    this.onTranscript = options.onTranscript || (() => {});
    this.onStatus = options.onStatus || (() => {});
    this.onError = options.onError || (() => {});

    this.recording = false;
    this.stream = null;
    this.recorder = null;
    this.chunks = [];
    this.recStart = 0;
  }

  async start() {
    if (this.recording) return;

    this.chunks = [];
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const mimeType = pickMediaRecorderMimeType();
    this.recorder = mimeType
      ? new MediaRecorder(this.stream, { mimeType })
      : new MediaRecorder(this.stream);

    this.recorder.ondataavailable = (e) => {
      if (e.data.size > 0) this.chunks.push(e.data);
    };

    this.recorder.start(100);
    this.recording = true;
    this.recStart = Date.now();
    this.onStatus("正在录音…", "listening");
  }

  async stop() {
    if (!this.recording || !this.recorder) return;

    const duration = Date.now() - this.recStart;
    if (duration < 400) {
      this._cleanup();
      this.onError("录音太短，请多说几个字");
      return;
    }

    this.recording = false;

    await new Promise((resolve) => {
      this.recorder.onstop = () => resolve();
      if (this.recorder.state === "recording") {
        this.recorder.stop();
      } else {
        resolve();
      }
    });

    const mimeType = this.recorder.mimeType || "audio/webm";
    const blob = new Blob(this.chunks, { type: mimeType });
    this._cleanup();

    try {
      this.onStatus("正在识别…", "listening");

      const pcmBuffer = await blobToPcm16k(blob);
      if (pcmBuffer.byteLength < 3200) {
        throw new Error("录音太短，请多说几个字");
      }

      const resp = await fetch(apiUrl("/api/xfyun/transcribe"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pcm: arrayBufferToBase64(pcmBuffer) }),
      });

      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        throw new Error(data.error || `识别失败 (HTTP ${resp.status})`);
      }

      const text = (data.text || "").trim();
      if (!text) {
        throw new Error("未识别到语音，请在安静环境重试");
      }

      this.onTranscript(text);
      this.onStatus("识别完成", "");
    } catch (err) {
      this.onError(err.message || "语音识别失败");
      this.onStatus("", "");
    }
  }

  _cleanup() {
    this.recording = false;
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
      this.stream = null;
    }
    this.recorder = null;
    this.chunks = [];
  }
}

function pickMediaRecorderMimeType() {
  if (typeof MediaRecorder === "undefined") return undefined;
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/aac"];
  for (const type of candidates) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return undefined;
}

async function blobToPcm16k(blob) {
  if (blob.size === 0) {
    throw new Error("录音为空，请稍长一点再结束");
  }

  const arrayBuffer = await blob.arrayBuffer();
  const decodeContext = new AudioContext();
  try {
    let audioBuffer;
    try {
      audioBuffer = await decodeContext.decodeAudioData(arrayBuffer.slice(0));
    } catch {
      throw new Error("无法解析录音格式，请重试");
    }

    const targetRate = 16000;
    const offline = new OfflineAudioContext(
      1,
      Math.max(1, Math.ceil(audioBuffer.duration * targetRate)),
      targetRate
    );
    const source = offline.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(offline.destination);
    source.start(0);
    const resampled = await offline.startRendering();

    const samples = resampled.getChannelData(0);
    const pcm = new Int16Array(samples.length);
    for (let i = 0; i < samples.length; i++) {
      const s = Math.max(-1, Math.min(1, samples[i]));
      pcm[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return pcm.buffer;
  } finally {
    await decodeContext.close();
  }
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

async function checkBackendAvailable() {
  try {
    const r = await fetch(apiUrl("/api/health"), { signal: AbortSignal.timeout(4000) });
    return r.ok;
  } catch {
    return false;
  }
}

window.XfyunIatRecorder = XfyunIatRecorder;
window.checkBackendAvailable = checkBackendAvailable;
