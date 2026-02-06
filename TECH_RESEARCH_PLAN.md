# SmartSpace AI Assistant - 技术研究计划

## 一、开源模型与数据集调研

### 1.1 ASR（语音识别）

| 模型名称 | 机构 | 特点 | 部署方式 | 推荐度 |
|---------|------|------|----------|--------|
| **Whisper** | OpenAI | 多语言支持、高准确率、中英文优秀 | CPU/GPU、可量化 | ⭐⭐⭐⭐⭐ |
| **FunASR** | 阿里达摩院 | 中文优化、工业级、流式识别 | CPU/GPU、边缘部署 | ⭐⭐⭐⭐⭐ |
| **WeNet** | 科大讯飞 | 端到端、低延迟、流式支持 | 端侧/云端 | ⭐⭐⭐⭐ |
| **SenseVoice** | 阿里达摩院 | 多语言、多情感、多说话人识别 | CPU/GPU | ⭐⭐⭐⭐ |
| **Kaldi** | 开源社区 | 传统语音识别、可定制性强 | CPU/GPU | ⭐⭐⭐ |

**推荐方案：**
- 主选：**Whisper (v3-large-v3)** - 通用性强，准确率高
- 备选：**FunASR** - 中文场景优化
- 端侧：**WeNet** - 低延迟流式识别

**数据集：**
- AISHELL-1/2 - 中文语音数据集
- Common Voice - 多语言语音数据集
- LibriSpeech - 英文语音数据集
- GigaSpeech - 大规模英语数据集

---

### 1.2 TTS（语音合成）

| 模型名称 | 机构 | 特点 | 部署方式 | 推荐度 |
|---------|------|------|----------|--------|
| **Edge-TTS** | Microsoft Edge | 免费、多语言、质量高 | 在线API | ⭐⭐⭐⭐⭐ |
| **Piper** | rhasspy | 本地化、快速、多语言 | CPU/GPU | ⭐⭐⭐⭐⭐ |
| **XTTS v2** | Coqui | 语音克隆、多语言、高自然度 | GPU | ⭐⭐⭐⭐ |
| **ChatTTS** | 开源 | 对话式、音色丰富、情感表达 | GPU | ⭐⭐⭐⭐ |
| **CosyVoice** | 阿里达摩院 | 自然度高、零样本克隆 | GPU/CPU | ⭐⭐⭐⭐ |
| **GPT-SoVITS** | 开源 | 语音克隆、少样本训练 | GPU | ⭐⭐⭐⭐ |
| **Fish Speech** | 开源 | 高质量、自然流畅 | GPU | ⭐⭐⭐⭐ |

**推荐方案：**
- Demo阶段：**Edge-TTS** - 免费、快速、无需部署
- 生产环境：**Piper** - 本地化、低延迟
- 高级特性：**XTTS v2** - 语音克隆、情感控制

**数据集：**
- AISHELL-3 - 中文多说话人数据集
- LibriTTS - 英文多说话人数据集
- VCTK - 多语言数据集

---

### 1.3 语音唤醒（Wake Word）

| 模型名称 | 机构 | 特点 | 部署方式 | 推荐度 |
|---------|------|------|----------|--------|
| **Porcupine** | Picovoice | 低延迟、高准确率、多关键词 | CPU | ⭐⭐⭐⭐⭐ |
| **OpenWakeWord** | 开源 | 可训练、本地处理、轻量化 | CPU/GPU | ⭐⭐⭐⭐⭐ |
| **Snowboy** | 开源 | 自定义训练、免费 | CPU | ⭐⭐⭐ |
| **Mycroft Precise** | Mycroft | 可训练、低资源占用 | CPU | ⭐⭐⭐⭐ |
| **Sherpa-ONNX** | 开源 | 多语言、ONNX格式、跨平台 | CPU/GPU | ⭐⭐⭐⭐ |

**推荐方案：**
- 主选：**OpenWakeWord** - 完全开源、可自定义训练
- 备选：**Porcupine** - 准确率高、支持多关键词
- 轻量级：**Sherpa-ONNX** - ONNX格式、易于部署

**训练数据：**
- Common Voice - 用于自定义关键词训练
- 自录制数据 - 针对特定唤醒词

---

### 1.4 端侧声学处理 SDK

| 项目名称 | 功能 | 特点 | 推荐度 |
|---------|------|------|--------|
| **WebRTC Audio Processing** | VAD、AEC、NS、AGC | 工业级、成熟稳定 | ⭐⭐⭐⭐⭐ |
| **Kaldi Active Grammar** | 语音活动检测 | 轻量级、低延迟 | ⭐⭐⭐⭐ |
| **Sherpa-ONNX** | VAD、ASR、KWS | 全流程、跨平台 | ⭐⭐⭐⭐⭐ |
| **Torchaudio** | 音频预处理 | PyTorch生态、灵活 | ⭐⭐⭐⭐ |
| **Librosa** | 音频特征提取 | Python生态、功能丰富 | ⭐⭐⭐⭐ |

**推荐方案：**
- **WebRTC VAD** - 语音活动检测
- **Sherpa-ONNX** - 端侧全流程处理
- **Torchaudio** - 音频预处理和特征提取

---

### 1.5 NLU（自然语言理解）

| 模型名称 | 机构 | 特点 | 部署方式 | 推荐度 |
|---------|------|------|----------|--------|
| **GLM-4** | 智谱AI | 中文优秀、长上下文 | API/本地 | ⭐⭐⭐⭐⭐ |
| **Qwen2.5** | 阿里云 | 多语言、性能强 | API/本地 | ⭐⭐⭐⭐⭐ |
| **DeepSeek-V3** | DeepSeek | 性价比高、推理快 | API/本地 | ⭐⭐⭐⭐⭐ |
| **Yi-1.5** | 零一万物 | 中文优化、长文本 | API/本地 | ⭐⭐⭐⭐ |
| **Baichuan2** | 百川智能 | 中文场景、推理能力强 | API/本地 | ⭐⭐⭐⭐ |

**推荐方案：**
- 已配置：**zai/glm-4.7** - 当前使用
- 备选：**Qwen2.5-72B** - 综合性能优秀
- 端侧：**Qwen2.5-7B-Instruct** - 量化后可本地部署

**数据集：**
- 中文对话数据集
- 任务型对话数据集
- 意图识别数据集

---

### 1.6 Agent 框架

| 框架名称 | 机构 | 特点 | 推荐度 |
|---------|------|------|--------|
| **LangChain** | 开源 | 生态丰富、文档完善、工具链齐全 | ⭐⭐⭐⭐⭐ |
| **LangGraph** | 开源 | 状态图建模、复杂任务编排 | ⭐⭐⭐⭐⭐ |
| **AutoGen** | Microsoft | 多智能体协作 | ⭐⭐⭐⭐ |
| **CrewAI** | 开源 | 角色扮演、任务分配 | ⭐⭐⭐⭐ |
| **OpenAI Swarm** | OpenAI | 轻量级、快速开发 | ⭐⭐⭐⭐ |
| **Semantic Kernel** | Microsoft | 企业级、插件化 | ⭐⭐⭐⭐ |

**推荐方案：**
- **LangChain + LangGraph** - 组合使用，LangChain做工具集成，LangGraph做任务编排

---

### 1.7 Skills（技能）开源项目

| 项目名称 | 功能 | 推荐度 |
|---------|------|--------|
| **Home Assistant** | 智能家居集成平台 | ⭐⭐⭐⭐⭐ |
| **OpenHAB** | 开源智能家居平台 | ⭐⭐⭐⭐ |
| **LangChain Tools** | 内置工具集 | ⭐⭐⭐⭐⭐ |
| **Hugging Face Tools** | 工具生态 | ⭐⭐⭐⭐ |
| **TaskWeaver** | 代码生成任务代理 | ⭐⭐⭐⭐ |

---

## 二、技术选型决策矩阵

| 技术模块 | 选型方案 | 理由 | 兼容性 |
|---------|---------|------|--------|
| **ASR** | Whisper v3 + FunASR | Whisper通用性强，FunASR中文优化 | ⭐⭐⭐⭐⭐ |
| **TTS** | Edge-TTS + Piper | 快速原型+生产级本地化 | ⭐⭐⭐⭐⭐ |
| **唤醒词** | OpenWakeWord | 完全开源、可自定义 | ⭐⭐⭐⭐⭐ |
| **声学处理** | WebRTC + Sherpa-ONNX | 工业级+端侧全流程 | ⭐⭐⭐⭐⭐ |
| **LLM** | zai/glm-4.7 + Qwen2.5 | 已配置+中文优秀 | ⭐⭐⭐⭐⭐ |
| **Agent** | LangChain + LangGraph | 生态丰富+任务编排 | ⭐⭐⭐⭐⭐ |
| **智能家居** | Home Assistant API | 生态完善 | ⭐⭐⭐⭐⭐ |

---

## 三、技术研究优先级

### P0（必须研究）- Week 1-2
1. ✅ Whisper ASR 集成与优化
2. ✅ OpenWakeWord 唤醒词训练
3. ✅ Edge-TTS 语音合成
4. ✅ LangChain/LangGraph Agent 基础

### P1（重要研究）- Week 3-4
1. ✅ FunASR 中文场景测试
2. ✅ Piper TTS 本地部署
3. ✅ WebRTC VAD 集成
4. ✅ Home Assistant API 对接

### P2（可选研究）- Week 5-6
1. ✅ XTTS 语音克隆
2. ✅ ChatTTS 对话式合成
3. ✅ Qwen2.5 本地部署
4. ✅ CosyVoice 零样本克隆

---

## 四、技术风险与应对

| 风险 | 影响 | 应对方案 |
|------|------|----------|
| ASR准确率不足 | 高 | 多模型融合、领域微调 |
| TTS自然度不够 | 中 | 多模型对比、情感控制 |
| 唤醒词误触发 | 中 | 阈值调优、声纹识别 |
| LLM响应延迟 | 中 | 流式输出、缓存优化 |
| 端侧性能不足 | 高 | 模型量化、硬件加速 |

---

## 五、技术调研清单

### Week 1：ASR 与唤醒词
- [ ] Whisper 各版本性能对比
- [ ] Whisper 模型量化测试
- [ ] FunASR 流式识别测试
- [ ] OpenWakeWord 自定义训练
- [ ] 唤醒词误报率测试

### Week 2：TTS 与声学处理
- [ ] Edge-TTS 多语音测试
- [ ] Piper 本地部署与性能
- [ ] WebRTC VAD 性能测试
- [ ] 音频预处理流程设计
- [ ] 端到端语音链路测试

### Week 3：LLM 与 Agent
- [ ] GLM-4.7 性能基准测试
- [ ] Qwen2.5 性能对比
- [ ] LangChain 工具集成测试
- [ ] LangGraph 任务编排测试
- [ ] Prompt 优化实验

### Week 4：集成与优化
- [ ] Home Assistant API 对接
- [ ] 全链路性能测试
- [ ] 端侧资源占用测试
- [ ] 延迟优化实验
- [ ] 准确率与召回率评估

---

## 六、开源资源链接

### ASR
- Whisper: https://github.com/openai/whisper
- FunASR: https://github.com/alibaba-damo-academy/FunASR
- WeNet: https://github.com/wenet-e2e/wenet
- SenseVoice: https://github.com/FunAudioLLM/SenseVoice

### TTS
- Edge-TTS: https://github.com/rany2/edge-tts
- Piper: https://github.com/rhasspy/piper
- XTTS: https://github.com/coqui-ai/XTTS-v2
- ChatTTS: https://github.com/2noise/ChatTTS
- CosyVoice: https://github.com/FunAudioLLM/CosyVoice
- GPT-SoVITS: https://github.com/RVC-Boss/GPT-SoVITS
- Fish Speech: https://github.com/fishaudio/fish-speech

### Wake Word
- OpenWakeWord: https://github.com/dscripka/openWakeWord
- Porcupine: https://github.com/Picovoice/porcupine
- Sherpa-ONNX: https://github.com/k2-fsa/sherpa-onnx

### Agent
- LangChain: https://github.com/langchain-ai/langchain
- LangGraph: https://github.com/langchain-ai/langgraph
- AutoGen: https://github.com/microsoft/autogen
- CrewAI: https://github.com/joaomdmoura/crewAI

### 智能家居
- Home Assistant: https://github.com/home-assistant/core
- OpenHAB: https://github.com/openhab/openhab-core
