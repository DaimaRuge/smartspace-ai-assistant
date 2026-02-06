# SmartSpace AI Assistant - 项目总览

## 📋 项目文档导航

本目录包含 SmartSpace AI Assistant 项目的完整规划文档。

### 📄 核心文档

| 文档 | 描述 | 状态 |
|------|------|------|
| **[PROJECT.md](./PROJECT.md)** | 项目概述与整体规划 | ✅ 完成 |
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | 系统架构设计 | ✅ 完成 |
| **[PRD.md](./PRD.md)** | 产品需求文档 | ✅ 完成 |
| **[TECH_RESEARCH_PLAN.md](./TECH_RESEARCH_PLAN.md)** | 技术研究计划 | ✅ 完成 |
| **[SOFTWARE_ENGINEERING_PLAN.md](./SOFTWARE_ENGINEERING_PLAN.md)** | 软件工程计划 | ✅ 完成 |
| **[DEPLOYMENT_PLAN.md](./DEPLOYMENT_PLAN.md)** | 上线计划 | ✅ 完成 |
| **[ITERATION_PLAN.md](./ITERATION_PLAN.md)** | 迭代计划 | ✅ 完成 |

---

## 🚀 项目概览

### 项目名称
**SmartSpace AI Assistant** - 智能空间 AI 助手

### 项目目标
构建一个基于大模型+智能体+Skills 的全功能 AI 语音助手，支持多终端（iPad/Android Pad/PC），应用于智能家居、智能酒店、智能房车等场景。

### 核心价值
- **便捷性**：语音交互，解放双手
- **智能化**：AI 理解，自然对话
- **统一性**：一站式控制所有设备
- **扩展性**：插件化技能，持续升级

---

## 📅 时间规划

### 总体时间线

| 阶段 | 时间 | 主要成果 |
|------|------|---------|
| **Phase 1: 项目初始化** | Week 1-4 | 项目框架、开发环境 |
| **Phase 2: 核心服务** | Week 5-8 | AI 引擎、语音服务 |
| **Phase 3: 功能开发** | Week 9-12 | 核心功能、前端应用 |
| **Phase 4: 测试与优化** | Week 13-14 | 集成测试、性能优化 |
| **Phase 5: 上线发布** | Week 15 | 生产环境部署 |
| **Phase 6: 迭代优化** | Week 16-28 | 功能增强、完整版 |

### 关键里程碑

| 里程碑 | 日期 | 交付物 |
|-------|------|--------|
| **M1: 项目启动** | 2026-02-06 | 项目脚手架、环境搭建 |
| **M2: V0.1** | 2026-03-05 | 核心框架完成 |
| **M3: V0.5** | 2026-04-02 | AI 引擎完成 |
| **M4: V1.0** | 2026-04-30 | 核心功能完成 |
| **M5: V1.1** | 2026-05-14 | 上线发布 |
| **M6: V1.5** | 2026-06-25 | 增强功能 |
| **M7: V2.0** | 2026-08-20 | 完整功能 |

---

## 🛠️ 技术选型

### 语音模块

| 技术 | 选型 | 原因 |
|------|------|------|
| **ASR** | Whisper v3 + FunASR | 通用性强 + 中文优化 |
| **TTS** | Edge-TTS + Piper | 快速原型 + 生产级本地化 |
| **唤醒词** | OpenWakeWord | 完全开源、可自定义 |
| **声学处理** | WebRTC + Sherpa-ONNX | 工业级 + 端侧全流程 |

### AI 引擎

| 技术 | 选型 | 原因 |
|------|------|------|
| **LLM** | zai/glm-4.7 + Qwen2.5 | 已配置 + 中文优秀 |
| **Agent** | LangChain + LangGraph | 生态丰富 + 任务编排 |
| **向量存储** | ChromaDB | 轻量级、易部署 |

### 后端服务

| 技术 | 选型 | 原因 |
|------|------|------|
| **框架** | Node.js + Fastify | 高性能、与 OpenClaw 同栈 |
| **数据库** | PostgreSQL | 成熟稳定、功能丰富 |
| **缓存** | Redis | 高性能缓存 |
| **消息队列** | MQTT + RabbitMQ | IoT 通信 + 任务队列 |

### 前端开发

| 技术 | 选型 | 原因 |
|------|------|------|
| **移动端** | React Native | 跨平台、生态丰富 |
| **Web 端** | Next.js | SEO 友好、开发体验好 |
| **UI 组件** | Ant Design | 现代化、功能完善 |

---

## 📦 核心功能

### V1.0 MVP（必需功能）

| 功能模块 | 功能点 | 优先级 |
|---------|-------|--------|
| **语音交互** | 唤醒/识别/合成 | P0 |
| **智能家居控制** | 设备控制/场景模式/状态查询 | P0 |
| **信息查询** | 天气/日历/闹钟 | P0 |
| **消息通知** | 发送/接收消息 | P0 |
| **备忘录** | 语音记录/分类管理 | P0 |

### V2.0 完整版（扩展功能）

| 功能模块 | 功能点 |
|---------|-------|
| **购物助手** | 商品推荐/比价/下单跟踪 |
| **打车服务** | 呼叫车辆/行程规划/费用估算 |
| **家务管理** | 家务清单/任务分配/完成度跟踪 |
| **能源管理** | 用电统计/节能建议/异常告警 |
| **智能规划** | 日程规划/旅行规划/个性化推荐 |

---

## 🎯 成功指标

### 技术指标

| 指标 | 目标值 |
|------|--------|
| 唤醒响应时间 | < 200ms |
| ASR 识别准确率 | > 95% |
| 端到端延迟 | < 2s |
| 并发支持 | 1000+ QPS |
| 系统可用性 | > 99.5% |

### 业务指标

| 指标 | 目标值 |
|------|--------|
| DAU | > 1000 |
| 用户留存率（7日） | > 60% |
| 任务完成率 | > 90% |
| 用户满意度 | > 4.5/5.0 |

---

## 👥 团队分工

| 角色 | 主要职责 |
|------|---------|
| **产品经理** | 需求定义、优先级管理 |
| **技术负责人** | 技术决策、架构设计 |
| **后端工程师** | 后端开发、AI 集成 |
| **前端工程师** | 移动端、Web 端开发 |
| **AI 工程师** | 模型优化、算法调优 |
| **测试工程师** | 测试自动化、质量保证 |
| **DevOps 工程师** | 部署、监控、运维 |
| **客服团队** | 用户支持、问题收集 |

---

## 📚 开源资源

### ASR
- [Whisper](https://github.com/openai/whisper) - OpenAI 开源 ASR
- [FunASR](https://github.com/alibaba-damo-academy/FunASR) - 阿里达摩院 ASR
- [WeNet](https://github.com/wenet-e2e/wenet) - 科大讯飞端到端 ASR

### TTS
- [Edge-TTS](https://github.com/rany2/edge-tts) - 微软 Edge TTS
- [Piper](https://github.com/rhasspy/piper) - 本地化 TTS
- [XTTS v2](https://github.com/coqui-ai/XTTS-v2) - Coqui 语音合成

### Wake Word
- [OpenWakeWord](https://github.com/dscripka/openWakeWord) - 开源唤醒词
- [Sherpa-ONNX](https://github.com/k2-fsa/sherpa-onnx) - 跨平台语音处理

### Agent
- [LangChain](https://github.com/langchain-ai/langchain) - AI 应用开发框架
- [LangGraph](https://github.com/langchain-ai/langgraph) - 状态图建模

### 智能家居
- [Home Assistant](https://github.com/home-assistant/core) - 开源智能家居平台

---

## 🚨 风险与应对

| 风险 | 影响 | 应对方案 |
|------|------|----------|
| ASR 准确率不足 | 高 | 多模型融合、领域微调 |
| TTS 自然度不够 | 中 | 多模型对比、情感控制 |
| 唤醒词误触发 | 中 | 阈值调优、声纹识别 |
| LLM 响应延迟 | 中 | 流式输出、缓存优化 |
| 端侧性能不足 | 高 | 模型量化、硬件加速 |

---

## 📞 联系方式

- **项目负责人**：祖冲之 (AI Agent)
- **项目启动日期**：2026-02-06
- **预计上线日期**：2026-04-10
- **项目完成日期**：2026-08-20

---

## 📊 项目进度

### 当前状态

```
Phase 1: 项目初始化 ━━━━━━━━━━━━━━━━━━ 100% ✅
Phase 2: 核心服务   ━━━━━━━━━━━━━━━━━━   0% 🔄
Phase 3: 功能开发   ━━━━━━━━━━━━━━━━━━   0% ⏳
Phase 4: 测试优化   ━━━━━━━━━━━━━━━━━━   0% ⏳
Phase 5: 上线发布   ━━━━━━━━━━━━━━━━━━   0% ⏳
Phase 6: 迭代优化   ━━━━━━━━━━━━━━━━━━   0% ⏳
```

### 下一步行动

1. ✅ 已完成项目文档编写
2. 🔄 开始 Phase 2：核心服务开发
3. ⏳ 创建 GitHub 仓库
4. ⏳ 搭建开发环境
5. ⏳ 开始 Sprint 3

---

## 📖 文档说明

### 如何使用本文档

1. **快速了解项目**：阅读 [PROJECT.md](./PROJECT.md)
2. **了解架构设计**：阅读 [ARCHITECTURE.md](./ARCHITECTURE.md)
3. **了解产品需求**：阅读 [PRD.md](./PRD.md)
4. **技术研究参考**：阅读 [TECH_RESEARCH_PLAN.md](./TECH_RESEARCH_PLAN.md)
5. **开发流程参考**：阅读 [SOFTWARE_ENGINEERING_PLAN.md](./SOFTWARE_ENGINEERING_PLAN.md)
6. **部署上线参考**：阅读 [DEPLOYMENT_PLAN.md](./DEPLOYMENT_PLAN.md)
7. **迭代规划参考**：阅读 [ITERATION_PLAN.md](./ITERATION_PLAN.md)

### 文档维护

- 所有文档由项目负责人维护
- 每次迭代后更新文档
- 重大变更后同步更新

---

*文档最后更新：2026-02-06*
