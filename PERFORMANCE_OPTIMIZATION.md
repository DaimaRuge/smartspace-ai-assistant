# Performance Optimization Guide

## 优化策略

### 1. ASR 优化

#### 当前状态
- 使用 Whisper OpenAI API
- 平均延迟：500-1500ms

#### 优化方案

**方案 A：本地 Whisper（推荐）**
```bash
# 安装 whisper.cpp
git clone https://github.com/ggerganov/whisper.cpp
cd whisper.cpp
make

# 下载模型
wget https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.bin

# 运行
./main -m ggml-base.bin -f input.wav
```

**优势：**
- ✅ 延迟更低（200-500ms）
- ✅ 无网络依赖
- ✅ 成本更低

**劣势：**
- ❌ 需要额外硬件资源
- ❌ 模型文件较大（~300MB）

**方案 B：FunASR（中文优化）**
```python
from funasr import AutoModel

asr = AutoModel(
    model="paraformer-zh",
    device="cuda"  # or "cpu"
)

result = asr.generate(input="input.wav")
```

**优势：**
- ✅ 中文识别准确率更高
- ✅ 流式识别支持
- ✅ 延迟更低（300-800ms）

---

### 2. LLM 优化

#### 当前状态
- 使用 zai/glm-4.7 API
- 平均延迟：1000-3000ms

#### 优化方案

**方案 A：流式输出（已实现）**
```typescript
const stream = await llm.streamingChat(messages);
for await (const chunk of stream) {
  // 立即发送 chunk，不等待完整响应
}
```

**优势：**
- ✅ 感知延迟显著降低
- ✅ 用户体验更好

**方案 B：Prompt 优化**
```typescript
const optimizedPrompt = `You are a concise AI assistant.
Answer briefly in 1-2 sentences.`;

// 减少 Token 使用，提高响应速度
```

**优势：**
- ✅ 输出 Token 更少
- ✅ 响应更快

**方案 C：缓存常见回复**
```typescript
const commonResponses = {
  'hello': '你好！有什么可以帮助你的吗？',
  'thank you': '不客气！',
  // ...
};

if (userInput in commonResponses) {
  return commonResponses[userInput];
}
```

---

### 3. TTS 优化

#### 当前状态
- 使用 Edge-TTS
- 平均延迟：200-800ms

#### 优化方案

**方案 A：Piper（本地 TTS）**
```bash
# 安装 Piper
pip install piper-tts

# 下载模型
wget https://huggingface.co/rhasspy/piper-voices/resolve/main/en_US-lessac-medium.tar.gz

# 运行
piper --model en_US-lessac-medium.onnx --output output.wav "Hello world"
```

**优势：**
- ✅ 延迟更低（100-300ms）
- ✅ 无网络依赖
- ✅ 音质可调

**劣势：**
- ❌ 需要额外硬件资源
- ❌ 音质可能略低于云端

**方案 B：语音缓存**
```typescript
const voiceCache = new Map();

async function getOrSynthesize(text: string): Promise<Buffer> {
  if (voiceCache.has(text)) {
    return voiceCache.get(text);
  }

  const audio = await tts.synthesize(text);
  voiceCache.set(text, audio);

  return audio;
}
```

---

### 4. 端到端优化

#### 目标
- 当前：~2000ms (2秒）
- 目标：< 1000ms (1秒）

#### 优化策略

**策略 1：并行处理**
```typescript
async function processVoiceParallel(audioBuffer: Buffer): Promise<string> {
  // 并行执行 ASR 和唤醒词检测
  const [asrResult, wakeResult] = await Promise.all([
    asr.transcribe(audioBuffer),
    wakeWord.detect(audioBuffer),
  ]);

  return asrResult.text;
}
```

**策略 2：WebSocket 流式处理**
```typescript
// 边录音边识别（实时处理）
function* streamAudioChunks(audioStream: ReadableStream) {
  for (const chunk of audioStream) {
    yield asr.transcribeChunk(chunk);  // 实时识别
  }
}
```

**策略 3：智能缓存**
```typescript
// 缓存常见模式和回复
const patternCache = {
  'weather': { response: '天气查询...', tts: preGeneratedTTS },
  'time': { response: '现在时间是...', tts: preGeneratedTTS },
};
```

---

## 性能基准

### 硬件配置

| 组件 | 最低配置 | 推荐配置 |
|------|---------|---------|
| CPU | 2 核心 | 4 核心+ |
| 内存 | 2GB | 8GB+ |
| 存储 | 10GB | 20GB+ |
| 网络 | 10Mbps | 100Mbps+ |

### 性能目标

| 指标 | 当前 | 目标 | 状态 |
|------|------|------|------|
| ASR 延迟 | 500-1500ms | < 500ms | ⚠️ |
| LLM 延迟 | 1000-3000ms | < 1500ms | ⚠️ |
| TTS 延迟 | 200-800ms | < 300ms | ✅ |
| 端到端 | ~2000ms | < 1000ms | ⚠️ |
| CPU 使用率 | 5-20% | < 50% | ✅ |
| 内存使用率 | 50-60% | < 70% | ✅ |

---

## 优化实施计划

### 阶段 1：基础优化（立即实施）
- [ ] 实现 Piper TTS 本地化
- [ ] 优化 Prompt 模板
- [ ] 添加常见回复缓存
- [ ] 实现流式输出优化

### 阶段 2：深度优化（1-2 周）
- [ ] 集成本地 Whisper
- [ ] 实现并行处理
- [ ] 优化 WebSocket 流式
- [ ] 添加智能预加载

### 阶段 3：架构优化（2-4 周）
- [ ] 实现边缘计算架构
- [ ] 优化数据传输
- [ ] 实现 CDN 加速
- [ ] 添加负载均衡

---

## 监控与测试

### 性能监控脚本

```bash
# 运行性能测试
npm run benchmark

# 输出示例：
# 🚀 Starting performance benchmark...
# Sample 1/5:
# 🎤 ASR Latency: 800ms
# 🧠 LLM Latency: 1500ms
# 🔊 TTS Latency: 300ms
# End-to-End: 2600ms
# ⚠️  End-to-end latency exceeds target (≥ 2s)
```

### 持续监控

```typescript
// 每小时自动收集指标
setInterval(async () => {
  const metrics = await monitor.collectMetrics();
  await reportMetrics(metrics);  // 上报到监控系统
}, 3600000);
```

---

## 总结

**当前状态：**
- 端到端延迟：~2000ms（2秒）
- 未达到目标（< 1000ms）

**优化方向：**
1. 本地化 TTS（Piper）
2. 本地化 ASR（Whisper.cpp）
3. 流式输出优化
4. 并行处理
5. 智能缓存

**预期效果：**
- 端到端延迟：~800ms（1秒内）
- 性能提升：60%

---

*更新日期：2026-02-07*
