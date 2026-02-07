import { describe, it, expect, beforeAll } from '@jest/globals';
import { AgentService } from '../services/AgentService.js';
import { getServiceManager } from '../services/ServiceManager.js';

describe('AgentService', () => {
  let agent: AgentService;

  beforeAll(async () => {
    const serviceManager = getServiceManager();
    await serviceManager.testConnection();
    agent = serviceManager.getAgent();
  });

  describe('Task Processing', () => {
    it('should process user intent correctly', async () => {
      const userIntent = '打开客厅的灯';
      const sessionId = 'test-session-1';
      
      const result = await agent.processTask(userIntent, sessionId);
      
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.response).toBeDefined();
      expect(result.usedSkills).toContain('smart-home');
      expect(result.duration).toBeGreaterThan(0);
    }, 5000);

    it('should handle weather query', async () => {
      const userIntent = '北京今天天气怎么样？';
      const sessionId = 'test-session-2';
      
      const result = await agent.processTask(userIntent, sessionId);
      
      expect(result.success).toBe(true);
      expect(result.usedSkills).toContain('weather');
    }, 3000);

    it('should handle calendar query', async () => {
      const userIntent = '帮我添加一个明天下午3点的提醒';
      const sessionId = 'test-session-3';
      
      const result = await agent.processTask(userIntent, sessionId);
      
      expect(result.success).toBe(true);
      expect(result.usedSkills).toContain('calendar');
    }, 3000);

    it('should handle OpenClaw message', async () => {
      const userIntent = '发一条消息到飞书：项目进度更新了';
      const sessionId = 'test-session-4';
      
      const result = await agent.processTask(userIntent, sessionId);
      
      expect(result.success).toBe(true);
      expect(result.usedSkills).toContain('openclaw');
    }, 3000);

    it('should handle unclear intent', async () => {
      const userIntent = '嗯...';
      const sessionId = 'test-session-5';
      
      const result = await agent.processTask(userIntent, sessionId);
      
      expect(result).toBeDefined();
      expect(result.response).toBeDefined();
      // Might not use a skill if intent is unclear
    }, 2000);

    it('should handle complex multi-step task', async () => {
      const userIntent = '先查询北京的天气，然后如果下雨就提醒我带伞，最后把结果发到飞书';
      const sessionId = 'test-session-6';
      
      const result = await agent.processTask(userIntent, sessionId);
      
      expect(result.success).toBe(true);
      expect(result.usedSkills.length).toBeGreaterThan(1);
    }, 10000);
  });

  describe('Intent Analysis', () => {
    it('should detect smart home intent correctly', () => {
      const userIntent = '打开卧室的空调到26度';
      
      const { shouldUseSkill, skillId, skillParams } = agent['analyzeIntent'](userIntent, '');
      
      expect(shouldUseSkill).toBe(true);
      expect(skillId).toBe('smart-home');
      expect(skillParams).toBeDefined();
      expect(skillParams.device).toContain('空调');
      expect(skillParams.action).toBeDefined();
    });

    it('should detect weather intent correctly', () => {
      const userIntent = '上海明天的天气预报';
      
      const { shouldUseSkill, skillId, skillParams } = agent['analyzeIntent'](userIntent, '');
      
      expect(shouldUseSkill).toBe(true);
      expect(skillId).toBe('weather');
      expect(skillParams).toBeDefined();
      expect(skillParams.location).toContain('上海');
    });

    it('should detect calendar intent correctly', () => {
      const userIntent = '下周三上午10点安排一个会议';
      
      const { shouldUseSkill, skillId, skillParams } = agent['analyzeIntent'](userIntent, '');
      
      expect(shouldUseSkill).toBe(true);
      expect(skillId).toBe('calendar');
      expect(skillParams).toBeDefined();
    });
  });

  describe('Skill Execution', () => {
    it('should execute smart home skill successfully', async () => {
      const skillParams = {
        action: 'turnOn',
        device: '灯',
        location: '客厅',
      };
      
      const skill = agent['executeSkill']('smart-home', skillParams);
      
      expect(skill).toBeDefined();
      expect(skill.success).toBe(true);
      expect(skill.data).toBeDefined();
      expect(skill.message).toBeDefined();
    });

    it('should handle skill execution failure', async () => {
      const skillParams = {
        action: 'invalidAction',
      };
      
      const result = await agent['executeSkill']('smart-home', skillParams);
      
      expect(result).toBeDefined();
      // Might fail gracefully
    });
  });

  describe('Conversation Management', () => {
    it('should maintain conversation history', async () => {
      const sessionId = 'test-conversation-session';
      
      // First message
      const result1 = await agent.processTask('打开客厅的灯', sessionId);
      expect(result1.success).toBe(true);
      
      // Second message
      const result2 = await agent.processTask('把灯调暗一点', sessionId);
      expect(result2.success).toBe(true);
      
      // Check history (internal method, testing indirectly)
      const history1 = agent.getConversationHistory(sessionId);
      expect(history1.length).toBeGreaterThanOrEqual(2);
      
      // Third message
      const result3 = await agent.processTask('关灯', sessionId);
      expect(result3.success).toBe(true);
      
      const history2 = agent.getConversationHistory(sessionId);
      expect(history2.length).toBeGreaterThanOrEqual(3);
    });

    it('should trim history to max messages', async () => {
      const sessionId = 'test-trim-session';
      
      // Add more messages than the limit (10)
      for (let i = 0; i < 15; i++) {
        await agent.processTask(`消息 ${i}`, sessionId);
      }
      
      const history = agent.getConversationHistory(sessionId);
      expect(history.length).toBeLessThanOrEqual(10);
      expect(history.length).toBeGreaterThanOrEqual(10); // Should be exactly 10
    });

    it('should clear conversation history', async () => {
      const sessionId = 'test-clear-session';
      
      // Add some messages
      await agent.processTask('消息1', sessionId);
      await agent.processTask('消息2', sessionId);
      
      let history = agent.getConversationHistory(sessionId);
      expect(history.length).toBe(2);
      
      // Clear history
      agent.clearHistory(sessionId);
      
      history = agent.getConversationHistory(sessionId);
      expect(history.length).toBe(0);
    });

    it('should clear all conversation histories', async () => {
      const sessionId1 = 'test-clear-all-session1';
      const sessionId2 = 'test-clear-all-session2';
      
      // Add messages
      await agent.processTask('消息1', sessionId1);
      await agent.processTask('消息2', sessionId2);
      
      expect(agent.getConversationHistory(sessionId1).length).toBe(1);
      expect(agent.getConversationHistory(sessionId2).length).toBe(1);
      
      // Clear all
      agent.clearAllHistory();
      
      expect(agent.getConversationHistory(sessionId1).length).toBe(0);
      expect(agent.getConversationHistory(sessionId2).length).toBe(0);
    });
  });

  describe('Context Management', () => {
    it('should use system prompt for all sessions', async () => {
      const sessionId1 = 'test-context-session1';
      const sessionId2 = 'test-context-session2';
      
      await agent.processTask('测试消息1', sessionId1);
      await agent.processTask('测试消息2', sessionId2);
      
      // Both sessions should have independent contexts
      const history1 = agent.getConversationHistory(sessionId1);
      const history2 = agent.getConversationHistory(sessionId2);
      
      expect(history1.length).toBeGreaterThan(0);
      expect(history2.length).toBeGreaterThan(0);
      expect(history1[0].role).toBe('system');
      expect(history2[0].role).toBe('system');
    });

    it('should handle multi-session correctly', async () => {
      const sessions = ['test-multi-session1', 'test-multi-session2', 'test-multi-session3'];
      
      // Send messages to all sessions
      for (const sessionId of sessions) {
        await agent.processTask(`发送给${sessionId}`, sessionId);
      }
      
      // Check each session has independent history
      for (const sessionId of sessions) {
        const history = agent.getConversationHistory(sessionId);
        expect(history.length).toBe(1);
      }
    });
  });

  describe('Performance', () => {
    it('should process simple query quickly', async () => {
      const startTime = Date.now();
      
      await agent.processTask('你好', 'test-perf-session');
      
      const latency = Date.now() - startTime;
      expect(latency).toBeLessThan(3000); // < 3s for simple query
    }, 3000);

    it('should process skill execution quickly', async () => {
      const startTime = Date.now();
      
      await agent.processTask('打开客厅的灯', 'test-perf-skill-session');
      
      const latency = Date.now() - startTime;
      expect(latency).toBeLessThan(2000); // < 2s for skill execution
    }, 2000);
  });
});
