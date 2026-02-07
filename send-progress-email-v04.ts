import nodemailer from 'nodemailer';

const EMAIL = 'qun.xitang.du@gmail.com';
const APP_PASSWORD = 'lxpr bfyc ilxx azbs';

async function sendProgressEmail() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL,
      pass: APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: EMAIL,
    to: EMAIL,
    subject: '🚀 SmartSpace AI Assistant - 迭代进度报告 v0.4.0',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h1 style="color: #2c3e50;">🚀 SmartSpace AI Assistant - 迭代进度报告</h1>

        <p><strong>版本：</strong> v0.4.0</p>
        <p><strong>阶段：</strong> Sprint 5 - 前端开发</p>
        <p><strong>时间：</strong> ${new Date().toLocaleString('zh-CN')}</p>

        <hr style="margin: 30px 0; border: none; border-top: 2px solid #eee;">

        <h2 style="color: #34495e;">✅ 本次迭代完成内容</h2>

        <h3 style="color: #2c3e50;">1. 移动端应用（React Native）</h3>
        <ul>
          <li><strong>VoiceChatScreen</strong> - 完整的语音聊天界面
            <ul>
              <li>语音录制与可视化反馈</li>
              <li>实时音频流传输</li>
              <li>消息气泡与播放控制</li>
              <li>WebSocket 集成</li>
              <li>麦克风权限处理</li>
              <li>录音状态显示</li>
              <li>清空对话功能</li>
            </ul>
          </li>
          <li><strong>VoiceWave 组件</strong> - 语音波形动画
            <ul>
              <li>三波形动画效果</li>
              <li>平滑过渡动画</li>
              <li>可配置颜色和大小</li>
            </ul>
          </li>
          <li><strong>MessageBubble 组件</strong> - 聊天气泡
            <ul>
              <li>用户/助手消息区分</li>
              <li>语音播放控制</li>
              <li>时间戳显示</li>
              <li>播放状态指示</li>
            </ul>
          </li>
          <li><strong>API 服务</strong> - 完整的 API 客户端
            <ul>
              <li>所有后端端点集成</li>
              <li>WebSocket 连接助手</li>
              <li>错误处理与重试</li>
              <li>TypeScript 类型安全</li>
            </ul>
          </li>
        </ul>

        <h3 style="color: #2c3e50;">2. Web 应用（Next.js）</h3>
        <ul>
          <li><strong>主页面</strong> - 完整的实时聊天界面
            <ul>
              <li>Socket.IO WebSocket 客户端</li>
              <li>MediaRecorder API 录音</li>
              <li>Base64 音频解码播放</li>
              <li>延迟监控显示</li>
              <li>连接状态指示器</li>
              <li>响应式设计（Tailwind CSS）</li>
            </ul>
          </li>
          <li><strong>实时功能</strong>
            <ul>
              <li>实时 ASR 结果显示</li>
              <li>实时 Agent 响应</li>
              <li>实时 TTS 音频播放</li>
              <li>实时延迟监控</li>
            </ul>
          </li>
        </ul>

        <h3 style="color: #2c3e50;">3. 核心功能实现</h3>
        <ul>
          <li>✅ <strong>语音录制</strong> - 按住说话，松开发送</li>
          <li>✅ <strong>实时管道</strong> - ASR → Agent → TTS 完整流程</li>
          <li>✅ <strong>消息播放</strong> - 助手回复语音播放控制</li>
          <li>✅ <strong>视觉反馈</strong> - 录音/处理/播放状态显示</li>
          <li>✅ <strong>延迟监控</strong> - 实时显示端到端延迟</li>
          <li>✅ <strong>连接状态</strong> - WebSocket 连接状态显示</li>
          <li>✅ <strong>清空对话</strong> - 一键清空对话历史</li>
          <li>✅ <strong>响应式设计</strong> - 适配不同屏幕尺寸</li>
          <li>✅ <strong>跨平台支持</strong> - iOS/Android/Web 统一体验</li>
        </ul>

        <hr style="margin: 30px 0; border: none; border-top: 2px solid #eee;">

        <h2 style="color: #34495e;">📊 代码统计</h2>

        <table border="1" cellpadding="5" style="border-collapse: collapse; width: 100%; margin-top: 10px;">
          <tr style="background-color: #f8f9fa;">
            <th style="text-align: left;">指标</th>
            <th style="text-align: right;">数量</th>
          </tr>
          <tr>
            <td>新增文件</td>
            <td style="text-align: right;">7 个</td>
          </tr>
          <tr>
            <td>修改文件</td>
            <td style="text-align: right;">1 个</td>
          </tr>
          <tr>
            <td>新增代码行</td>
            <td style="text-align: right;">+3,743</td>
          </tr>
          <tr>
            <td>删除代码行</td>
            <td style="text-align: right;">-7</td>
          </tr>
          <tr>
            <td>总代码行</td>
            <td style="text-align: right;">~25,800</td>
          </tr>
        </table>

        <hr style="margin: 30px 0; border: none; border-top: 2px solid #eee;">

        <h2 style="color: #34495e;">📦 技术栈</h2>

        <table border="1" cellpadding="5" style="border-collapse: collapse; width: 100%; margin-top: 10px;">
          <tr style="background-color: #f8f9fa;">
            <th style="text-align: left;">平台</th>
            <th style="text-align: left;">技术</th>
            <th style="text-align: left;">版本</th>
          </tr>
          <tr>
            <td>移动端框架</td>
            <td>React Native</td>
            <td>0.73.6</td>
          </tr>
          <tr>
            <td>移动端导航</td>
            <td>React Navigation</td>
            <td>^6.1.9</td>
          </tr>
          <tr>
            <td>移动端音频</td>
            <td>Expo Audio</td>
            <td>^14.1.0</td>
          </tr>
          <tr>
            <td>Web 框架</td>
            <td>Next.js</td>
            <td>14.1.0</td>
          </tr>
          <tr>
            <td>WebSocket</td>
            <td>Socket.IO Client</td>
            <td>^4.7.2</td>
          </tr>
          <tr>
            <td>HTTP 客户端</td>
            <td>Axios</td>
            <td>^1.6.5</td>
          </tr>
          <tr>
            <td>样式</td>
            <td>Tailwind CSS</td>
            <td>^3.4.0</td>
          </tr>
          <tr>
            <td>TypeScript</td>
            <td>TypeScript</td>
            <td>^5.3.3</td>
          </tr>
        </table>

        <hr style="margin: 30px 0; border: none; border-top: 2px solid #eee;">

        <h2 style="color: #34495e;">📋 功能清单</h2>

        <h3 style="color: #2c3e50;">移动端功能</h3>
        <ul>
          <li>✅ 语音录制（按住说话）</li>
          <li>✅ 实时音频流传输</li>
          <li>✅ 消息气泡显示</li>
          <li>✅ 语音播放控制</li>
          <li>✅ 录音波形动画</li>
          <li>✅ 录音状态指示器</li>
          <li>✅ 处理中状态显示</li>
          <li>✅ 清空对话功能</li>
          <li>✅ 麦克风权限处理</li>
          <li>✅ WebSocket 实时通信</li>
          <li>✅ 错误处理与重试</li>
        </ul>

        <h3 style="color: #2c3e50;">Web 端功能</h3>
        <ul>
          <li>✅ 语音录制（MediaRecorder）</li>
          <li>✅ 实时 WebSocket 通信</li>
          <li>✅ 实时消息显示</li>
          <li>✅ 音频播放（Base64 解码）</li>
          <li>✅ 延迟监控显示</li>
          <li>✅ 连接状态指示</li>
          <li>✅ 响应式设计</li>
          <li>✅ 清空对话功能</li>
          <li>✅ 处理中状态显示</li>
        </ul>

        <hr style="margin: 30px 0; border: none; border-top: 2px solid #eee;">

        <h2 style="color: #34495e;">🔗 GitHub 仓库</h2>

        <p><strong>仓库地址：</strong> <a href="https://github.com/DaimaRuge/smartspace-ai-assistant" style="color: #3498db; text-decoration: none;">https://github.com/DaimaRuge/smartspace-ai-assistant</a></p>

        <p><strong>最新提交：</strong></p>
        <pre style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; overflow-x: auto;">commit 82ca1da
feat: Add mobile and web frontend (v0.4.0)

Files changed: 8
Insertions: +3,743
Deletions: -7

主要变更：
- React Native 移动端应用
  - VoiceChatScreen（语音聊天界面）
  - VoiceWave 组件（波形动画）
  - MessageBubble 组件（聊天气泡）
  - API 服务（完整客户端）
- Next.js Web 应用
  - 主页面（实时聊天）
  - Socket.IO 集成
  - 响应式设计
- 实时语音流管道
- 跨平台支持（iOS/Android/Web）</pre>

        <hr style="margin: 30px 0; border: none; border-top: 2px solid #eee;">

        <h2 style="color: #34495e;">📅 项目进度</h2>

        <table border="1" cellpadding="5" style="border-collapse: collapse; width: 100%; margin-top: 10px;">
          <tr style="background-color: #f8f9fa;">
            <th style="text-align: left;">阶段</th>
            <th style="text-align: left;">状态</th>
            <th style="text-align: center;">完成度</th>
          </tr>
          <tr>
            <td>Phase 1: 项目初始化</td>
            <td>✅ 完成</td>
            <td style="text-align: center;">100%</td>
          </tr>
          <tr>
            <td>Phase 2: 核心服务</td>
            <td>✅ 完成</td>
            <td style="text-align: center;">100%</td>
          </tr>
          <tr>
            <td>Phase 2: 语音全链路</td>
            <td>✅ 完成</td>
            <td style="text-align: center;">100%</td>
          </tr>
          <tr>
            <td>Phase 3: 前端开发</td>
            <td>✅ 完成</td>
            <td style="text-align: center;">100%</td>
          </tr>
          <tr>
            <td>Phase 4: 测试优化</td>
            <td>⏳ 待开始</td>
            <td style="text-align: center;">0%</td>
          </tr>
          <tr>
            <td>Phase 5: 上线发布</td>
            <td>⏳ 待开始</td>
            <td style="text-align: center;">0%</td>
          </tr>
        </table>

        <hr style="margin: 30px 0; border: none; border-top: 2px solid #eee;">

        <h2 style="color: #34495e;">🎯 下一步计划</h2>

        <ol>
          <li><strong>Sprint 6 - 集成测试（30 分钟冲刺）</strong>
            <ul>
              <li>单元测试编写</li>
              <li>集成测试编写</li>
              <li>E2E 测试编写</li>
              <li>性能测试</li>
              <li>Bug 修复</li>
            </ul>
          </li>
          <li><strong>Sprint 7 - 性能优化（30 分钟冲刺）</strong>
            <ul>
              <li>实现 Piper TTS</li>
              <li>实现本地 Whisper</li>
              <li>并行处理优化</li>
              <li>缓存优化</li>
              <li>端到端延迟优化</li>
            </ul>
          </li>
          <li><strong>Sprint 8 - V0.5 完整版（30 分钟冲刺）</strong>
            <ul>
              <li>智能家居功能完善</li>
              <li>日历闹钟功能完善</li>
              <li>备忘录功能完善</li>
              <li>OpenClaw 集成完善</li>
              <li>文档完善</li>
            </ul>
          </li>
        </ol>

        <hr style="margin: 30px 0; border: none; border-top: 2px solid #eee;">

        <h2 style="color: #34495e;">📝 总结</h2>

        <p>本次迭代成功完成了前端应用的完整实现，包括：</p>
        <ul>
          <li>✅ React Native 移动端应用（iOS/Android）</li>
          <li>✅ Next.js Web 应用</li>
          <li>✅ 实时语音流管道</li>
          <li>✅ 完整的聊天界面</li>
          <li>✅ WebSocket 实时通信</li>
          <li>✅ 跨平台支持</li>
          <li>✅ 响应式设计</li>
        </ul>

        <p><strong>版本里程碑：</strong></p>
        <ul>
          <li>v0.1.0 - 项目框架搭建 ✅</li>
          <li>v0.2.0 - 核心服务实现 ✅</li>
          <li>v0.3.0 - 语音全链路 ✅</li>
          <li>v0.4.0 - 前端开发 ✅（当前版本）</li>
          <li>v0.5.0 - AI 引擎完成 ⏳（下一步）</li>
          <li>v1.0.0 - 核心功能完成 ⏳</li>
        </ul>

        <p>项目正在按计划稳步推进，持续迭代中！</p>

        <hr style="margin: 30px 0; border: none; border-top: 2px solid #eee;">

        <p style="color: #7f8c8d; font-size: 14px;">
          此邮件由 SmartSpace AI Assistant 自动发送<br>
          项目负责人：祖冲之 (AI Agent)<br>
          发送时间：${new Date().toLocaleString('zh-CN')}<br>
          <br>
          <a href="https://github.com/DaimaRuge/smartspace-ai-assistant" style="color: #3498db;">GitHub 仓库</a> |
          <a href="https://github.com/DaimaRuge/smartspace-ai-assistant/commits/main" style="color: #3498db;">提交历史</a>
        </p>
      </div>
    `,
  };

  try {
    console.log('正在发送进度报告邮件...');
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ 邮件发送成功！');
    console.log('邮件 ID:', info.messageId);
    console.log('收件人:', EMAIL);
  } catch (error) {
    console.error('❌ 邮件发送失败:', error);
    throw error;
  }
}

sendProgressEmail();
