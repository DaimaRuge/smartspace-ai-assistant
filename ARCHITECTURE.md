# SmartSpace AI Assistant - 架构设计文档

## 系统架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                        用户层                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │  iOS / iPad  │  │  Android Pad │  │  PC / Web    │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                              ↕ HTTPS / WebSocket
┌─────────────────────────────────────────────────────────────────┐
│                    网关与交互层                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              API Gateway (Fastify + WebSocket)           │   │
│  │  - REST API                                              │   │
│  │  - WebSocket (实时语音流)                                │   │
│  │  - 认证与授权                                              │   │
│  │  - 请求路由与负载均衡                                      │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                    AI 服务层                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────────────┐│
│  │ 语音服务     │  │ LLM 服务     │  │    Agent 引擎           ││
│  │ - Porcupine  │  │ - zai/glm-4.7│  │ - LangChain / LangGraph││
│  │ - Whisper    │  │ - Prompt管理 │  │ - 工具调用              ││
│  │ - Edge-TTS   │  │ - 上下文管理 │  │ - 决策编排              ││
│  └──────────────┘  └──────────────┘  └─────────────────────────┘│
│                              ↕                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────────────┐│
│  │ Skills 引擎   │  │ OpenClaw集成  │  │    向量存储              ││
│  │ - 技能注册   │  │ - 消息发送   │  │ - ChromaDB               ││
│  │ - 技能调度   │  │ - 通知接收   │  │ - RAG 检索              ││
│  │ - 参数解析   │  │ - 跨设备同步  │  │ - 语义搜索              ││
│  └──────────────┘  └──────────────┘  └─────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                    数据与设备层                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────────────┐│
│  │ PostgreSQL    │  │ MQTT Broker  │  │    外部 API             ││
│  │ - 用户数据   │  │ - 设备通信   │  │ - 天气/日历/打车        ││
│  │ - 对话历史   │  │ - 状态同步   │  │ - 购物/外卖            ││
│  │ - 设备状态   │  │ - 命令下发   │  │ - HomeKit/Matter        ││
│  └──────────────┘  └──────────────┘  └─────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

## 核心模块设计

### 1. 语音交互模块 (Voice Module)

**职责：** 处理语音唤醒、识别、合成的全流程

**组件：**
- `VoiceWaker` - 基于 Porcupine 的唤醒词检测
- `ASRService` - 基于 Whisper 的语音识别
- `TTSService` - 基于 Edge-TTS 的语音合成
- `VoiceStream` - 实时语音流处理

**接口：**
```typescript
// 唤醒检测
interface VoiceWaker {
  start(keyword: string): void;
  stop(): void;
  onWake(callback: () => void): void;
}

// 语音识别
interface ASRService {
  transcribe(audioStream: ReadableStream): Promise<string>;
  streamingTranscribe(audioStream: ReadableStream): AsyncGenerator<string>;
}

// 语音合成
interface TTSService {
  synthesize(text: string, voice?: string): Promise<Buffer>;
  streamingSynthesize(text: string): AsyncGenerator<Buffer>;
}
```

### 2. LLM 服务模块 (LLM Service)

**职责：** 管理大模型调用、上下文维护、Prompt 管理

**组件：**
- `LLMClient` - zai/glm-4.7 客户端封装
- `ContextManager` - 对话上下文管理
- `PromptTemplate` - Prompt 模板引擎
- `TokenTracker` - Token 使用统计

**接口：**
```typescript
interface LLMClient {
  chat(messages: Message[]): Promise<ChatResponse>;
  streamingChat(messages: Message[]): AsyncGenerator<string>;
}

interface ContextManager {
  addMessage(role: 'user' | 'assistant' | 'system', content: string): void;
  getContext(limit?: number): Message[];
  clear(): void;
}
```

### 3. Agent 引擎模块 (Agent Engine)

**职责：** 智能决策、工具调用、任务编排

**组件：**
- `AgentCore` - 核心 Agent 逻辑
- `ToolRegistry` - 工具注册与发现
- `TaskPlanner` - 任务规划器
- `DecisionEngine` - 决策引擎

**接口：**
```typescript
interface Tool {
  name: string;
  description: string;
  parameters: Schema;
  execute(params: any): Promise<Result>;
}

interface AgentCore {
  registerTool(tool: Tool): void;
  plan(userIntent: string): Promise<Plan>;
  execute(plan: Plan): Promise<ExecutionResult>;
}
```

### 4. Skills 引擎模块 (Skills Engine)

**职责：** 技能管理、调度、执行

**组件：**
- `SkillRegistry` - 技能注册表
- `SkillDispatcher` - 技能分发器
- `SkillExecutor` - 技能执行器
- `SkillMetrics` - 技能性能监控

**技能清单：**
- `SmartHomeSkill` - 智能家居控制
- `WeatherSkill` - 天气查询
- `CalendarSkill` - 日历与闹钟
- `MemoSkill` - 备忘录
- `ShoppingSkill` - 购物助手
- `RideHailingSkill` - 打车服务
- `OpenClawSkill` - OpenClaw 集成
- `EnergySkill` - 能源管理
- `TaskSkill` - 家务管理
- `PlanningSkill` - 智能规划

**技能接口：**
```typescript
interface Skill {
  id: string;
  name: string;
  description: string;
  triggers: string[];
  execute(params: SkillParams): Promise<SkillResult>;
}
```

### 5. OpenClaw 集成模块

**职责：** 与 OpenClaw 框架对接

**组件：**
- `OpenClawClient` - OpenClaw 客户端
- `MessageSender` - 消息发送
- `NotificationReceiver` - 通知接收
- `SessionManager` - 会话管理

**接口：**
```typescript
interface OpenClawClient {
  sendMessage(channel: string, target: string, message: string): Promise<void>;
  onNotification(callback: (notification: Notification) => void): void;
}
```

### 6. 设备管理模块 (Device Manager)

**职责：** 智能设备接入、控制、状态管理

**组件：**
- `DeviceRegistry` - 设备注册表
- `DeviceController` - 设备控制器
- `MQTTClient` - MQTT 通信客户端
- `StatusMonitor` - 设备状态监控

**接口：**
```typescript
interface Device {
  id: string;
  type: 'light' | 'ac' | 'curtain' | 'sensor' | ...;
  name: string;
  state: any;
  execute(command: DeviceCommand): Promise<void>;
}

interface DeviceController {
  registerDevice(device: Device): void;
  control(deviceId: string, command: DeviceCommand): Promise<void>;
  getDevices(): Device[];
  getDeviceStatus(deviceId: string): Promise<DeviceStatus>;
}
```

## 数据模型

### 用户与对话
```typescript
interface User {
  id: string;
  name: string;
  preferences: UserPreferences;
  devices: string[];
}

interface Conversation {
  id: string;
  userId: string;
  messages: Message[];
  context: any;
  createdAt: Date;
  updatedAt: Date;
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: any;
  timestamp: Date;
}
```

### 设备与技能
```typescript
interface Device {
  id: string;
  userId: string;
  type: string;
  name: string;
  capabilities: string[];
  state: Record<string, any>;
  location: string;
}

interface SkillExecution {
  id: string;
  skillId: string;
  userId: string;
  params: any;
  result: any;
  status: 'pending' | 'running' | 'success' | 'failed';
  duration: number;
  createdAt: Date;
}
```

## API 设计

### REST API

```
POST   /api/chat                 # 对话接口
POST   /api/voice/wake           # 语音唤醒
POST   /api/voice/asr            # 语音识别
POST   /api/voice/tts            # 语音合成
GET    /api/devices              # 获取设备列表
POST   /api/devices/{id}/control # 控制设备
GET    /api/skills               # 获取技能列表
POST   /api/skills/{id}/execute  # 执行技能
GET    /api/conversations        # 对话历史
POST   /api/openclaw/send        # 发送 OpenClaw 消息
```

### WebSocket API

```
WS /ws/voice                    # 实时语音流
WS /ws/chat                     # 实时对话
WS /ws/devices/updates          # 设备状态更新
WS /ws/notifications            # 系统通知
```

## 部署架构

### 开发环境
```
localhost:3000  -> API Gateway
localhost:3001  -> WebSocket Server
localhost:5432  -> PostgreSQL
localhost:1883  -> MQTT Broker
```

### 生产环境
```
Nginx (反向代理) -> API Gateway + WebSocket Server
                   -> PostgreSQL (主从)
                   -> MQTT Broker (集群)
                   -> Redis (缓存)
```

## 安全设计

1. **认证与授权**
   - JWT Token 认证
   - OAuth 2.0 集成
   - 基于 RBAC 的权限控制

2. **数据加密**
   - HTTPS 传输加密
   - 敏感数据 AES-256 加密
   - 密码 bcrypt 哈希

3. **隐私保护**
   - 本地语音处理优先
   - 用户数据匿名化
   - 符合 GDPR / 个人信息保护法

4. **API 安全**
   - Rate Limiting
   - CORS 配置
   - SQL 注入防护
   - XSS 防护
