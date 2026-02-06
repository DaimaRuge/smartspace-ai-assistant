import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const EMAIL = 'qun.xitang.du@gmail.com';
const APP_PASSWORD = 'lxpr bfyc ilxx azbs';

async function sendEmail() {
  // 创建 SMTP 传输器
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL,
      pass: APP_PASSWORD,
    },
  });

  // 读取项目概要
  const readmePath = path.join(process.cwd(), 'README.md');
  const readmeContent = fs.readFileSync(readmePath, 'utf-8');

  // 构建邮件内容
  const mailOptions = {
    from: EMAIL,
    to: EMAIL,
    subject: '🚀 SmartSpace AI Assistant 项目规划文档',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h1 style="color: #2c3e50;">SmartSpace AI Assistant 项目规划</h1>

        <p>您好！</p>

        <p>SmartSpace AI Assistant 项目的完整规划已完成，共计 9 份文档，约 52,800 字。</p>

        <h2 style="color: #34495e;">📋 文档清单</h2>
        <ul>
          <li><strong>README.md</strong> - 项目总览与导航</li>
          <li><strong>PROJECT.md</strong> - 项目概述与整体规划</li>
          <li><strong>ARCHITECTURE.md</strong> - 系统架构设计</li>
          <li><strong>PRD.md</strong> - 产品需求文档</li>
          <li><strong>TECH_RESEARCH_PLAN.md</strong> - 技术研究计划</li>
          <li><strong>SOFTWARE_ENGINEERING_PLAN.md</strong> - 软件工程计划</li>
          <li><strong>DEPLOYMENT_PLAN.md</strong> - 上线计划</li>
          <li><strong>ITERATION_PLAN.md</strong> - 迭代计划</li>
          <li><strong>SUMMARY.md</strong> - 项目总结报告</li>
        </ul>

        <h2 style="color: #34495e;">📊 项目亮点</h2>
        <ul>
          <li>✅ <strong>全开源技术栈</strong>：从语音识别到合成的全流程开源方案</li>
          <li>✅ <strong>插件化技能架构</strong>：易于扩展新技能</li>
          <li>✅ <strong>多场景适配</strong>：智能家居/智能酒店/智能房车</li>
          <li>✅ <strong>OpenClaw 深度集成</strong>：无缝对接消息渠道</li>
          <li>✅ <strong>清晰的迭代计划</strong>：28 周完整路线图</li>
        </ul>

        <h2 style="color: #34495e;">🎯 核心成果</h2>

        <h3>技术选型</h3>
        <table border="1" cellpadding="5" style="border-collapse: collapse; width: 100%;">
          <tr style="background-color: #f8f9fa;">
            <th style="text-align: left;">技术模块</th>
            <th style="text-align: left;">选型方案</th>
          </tr>
          <tr>
            <td>ASR</td>
            <td>Whisper v3 + FunASR</td>
          </tr>
          <tr>
            <td>TTS</td>
            <td>Edge-TTS + Piper</td>
          </tr>
          <tr>
            <td>唤醒词</td>
            <td>OpenWakeWord</td>
          </tr>
          <tr>
            <td>LLM</td>
            <td>zai/glm-4.7 + Qwen2.5</td>
          </tr>
          <tr>
            <td>Agent</td>
            <td>LangChain + LangGraph</td>
          </tr>
          <tr>
            <td>后端</td>
            <td>Node.js + Fastify</td>
          </tr>
          <tr>
            <td>前端</td>
            <td>React Native + Next.js</td>
          </tr>
        </table>

        <h3>时间规划</h3>
        <table border="1" cellpadding="5" style="border-collapse: collapse; width: 100%;">
          <tr style="background-color: #f8f9fa;">
            <th style="text-align: left;">阶段</th>
            <th style="text-align: left;">周期</th>
            <th style="text-align: left;">里程碑</th>
          </tr>
          <tr>
            <td>Phase 1</td>
            <td>Week 1-4</td>
            <td>V0.1 项目框架</td>
          </tr>
          <tr>
            <td>Phase 2</td>
            <td>Week 5-8</td>
            <td>V0.5 AI 引擎</td>
          </tr>
          <tr>
            <td>Phase 3</td>
            <td>Week 9-12</td>
            <td>V1.0 核心功能</td>
          </tr>
          <tr>
            <td>Phase 4</td>
            <td>Week 13-14</td>
            <td>V1.1 上线</td>
          </tr>
          <tr>
            <td>Phase 5</td>
            <td>Week 15-16</td>
            <td>V1.5 增强功能</td>
          </tr>
          <tr>
            <td>Phase 6</td>
            <td>Week 17-28</td>
            <td>V2.0 完整功能</td>
          </tr>
        </table>

        <h2 style="color: #34495e;">📦 附件说明</h2>
        <p>附件包含：</p>
        <ul>
          <li>9 份完整的规划文档（Markdown 格式）</li>
          <li>25+ 代码文件（后端框架）</li>
          <li>项目配置文件（package.json、tsconfig.json 等）</li>
        </ul>

        <h2 style="color: #34495e;">🚀 下一步行动</h2>
        <ol>
          <li>解压附件到本地目录</li>
          <li>阅读 <code>README.md</code> 了解项目概览</li>
          <li>创建 GitHub 仓库并提交代码</li>
          <li>开始 Phase 2：核心服务开发</li>
        </ol>

        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">

        <p style="color: #7f8c8d; font-size: 14px;">
          此邮件由 SmartSpace AI Assistant 自动发送<br>
          项目负责人：祖冲之 (AI Agent)<br>
          发送时间：${new Date().toLocaleString('zh-CN')}
        </p>
      </div>
    `,
    attachments: [
      {
        filename: 'smartspace-ai-assistant-docs.tar.gz',
        path: path.join(process.cwd(), 'smartspace-ai-assistant-docs.tar.gz'),
      },
      {
        filename: 'README.md',
        content: readmeContent,
      },
      {
        filename: 'PROJECT.md',
        path: path.join(process.cwd(), 'PROJECT.md'),
      },
      {
        filename: 'ARCHITECTURE.md',
        path: path.join(process.cwd(), 'ARCHITECTURE.md'),
      },
      {
        filename: 'PRD.md',
        path: path.join(process.cwd(), 'PRD.md'),
      },
      {
        filename: 'TECH_RESEARCH_PLAN.md',
        path: path.join(process.cwd(), 'TECH_RESEARCH_PLAN.md'),
      },
      {
        filename: 'SOFTWARE_ENGINEERING_PLAN.md',
        path: path.join(process.cwd(), 'SOFTWARE_ENGINEERING_PLAN.md'),
      },
      {
        filename: 'DEPLOYMENT_PLAN.md',
        path: path.join(process.cwd(), 'DEPLOYMENT_PLAN.md'),
      },
      {
        filename: 'ITERATION_PLAN.md',
        path: path.join(process.cwd(), 'ITERATION_PLAN.md'),
      },
      {
        filename: 'SUMMARY.md',
        path: path.join(process.cwd(), 'SUMMARY.md'),
      },
    ],
  };

  try {
    console.log('正在发送邮件...');
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ 邮件发送成功！');
    console.log('邮件 ID:', info.messageId);
    console.log('收件人:', EMAIL);
  } catch (error) {
    console.error('❌ 邮件发送失败:', error);
    throw error;
  }
}

sendEmail();
