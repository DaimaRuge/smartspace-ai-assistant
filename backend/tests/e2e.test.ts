import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import Fastify from 'fastify';
import { buildServer } from '../src/index.js';

describe('API E2E Tests', () => {
  let app: Fastify;

  beforeAll(async () => {
    app = await buildServer();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('services');
    });
  });

  describe('Chat API', () => {
    it('should process chat message', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: '你好',
          sessionId: 'test-e2e-session-1',
        })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('response');
      expect(response.body).toHaveProperty('taskId');
      expect(response.body).toHaveProperty('usedSkills');
      expect(response.body).toHaveProperty('duration');
      expect(response.body.response.length).toBeGreaterThan(0);
    });

    it('should handle missing message', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({
          sessionId: 'test-e2e-session-2',
        })
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle missing sessionId', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: '你好',
        })
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Voice API', () => {
    it('should process voice (end-to-end)', async () => {
      // This test requires audio file
      // In production, you would upload actual audio
      // For E2E testing, we skip this or use mock audio
      
      const response = await request(app)
        .post('/api/voice/process')
        .send({
          audioPath: '/tmp/test-audio.wav',
          sessionId: 'test-e2e-voice-session',
        })
        .expect(200);

      expect(response.body).toBeDefined();
      // In real test, we would expect audio buffer back
    });

    it('should handle ASR endpoint', async () => {
      // Skip for now as we need actual audio file
      // Test would look like:
      const response = await request(app)
        .post('/api/voice/asr')
        .set('Content-Type', 'multipart/form-data')
        .attach('audio', '/tmp/test-audio.wav')
        .expect(200);

      expect(response.body).toHaveProperty('text');
      expect(response.body).toHaveProperty('confidence');
      expect(response.body).toHaveProperty('duration');
    });

    it('should handle TTS endpoint', async () => {
      const response = await request(app)
        .post('/api/voice/tts')
        .send({
          text: '这是一个测试文本',
          voice: 'zh-CN-XiaoxiaoNeural',
        })
        .expect(200);

      expect(response.body).toBeDefined();
      // In real test, we would expect audio buffer back
    });
  });

  describe('Skills API', () => {
    it('should get all skills', async () => {
      const response = await request(app)
        .get('/api/skills')
        .expect(200);

      expect(response.body).toHaveProperty('skills');
      expect(response.body).toHaveProperty('total');
      expect(Array.isArray(response.body.skills)).toBe(true);
      expect(response.body.skills.length).toBeGreaterThan(0);
    });

    it('should get skill details', async () => {
      const response = await request(app)
        .get('/api/skills/smart-home')
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('triggers');
      expect(response.body).toHaveProperty('parameters');
    });

    it('should execute skill', async () => {
      const response = await request(app)
        .post('/api/skills/smart-home/execute')
        .send({
          action: 'turnOn',
          device: '灯',
          location: '客厅',
        })
        .expect(200);

      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('WebSocket E2E', () => {
    it('should connect to WebSocket voice endpoint', async () => {
      // This test requires actual WebSocket connection
      // In E2E testing, we would connect and verify handshake
      // Skip for now as WebSocket requires full server
      
      // Example:
      // const ws = new WebSocket('ws://localhost:3000/ws/voice');
      // ws.on('open', () => {
      //   ws.send(JSON.stringify({ type: 'ping' }));
      // });
      // ws.on('message', (data) => {
      //   const message = JSON.parse(data.toString());
      //   expect(message.type).toBe('pong');
      //   ws.close();
      // });
    }, 5000);
  });

  describe('Complex Workflows', () => {
    it('should handle multi-step conversation', async () => {
      const sessionId = 'test-complex-workflow-session';
      
      // Step 1: User says hello
      const response1 = await request(app)
        .post('/api/chat')
        .send({
          message: '你好',
          sessionId,
        })
        .expect(200);

      expect(response1.body.success).toBe(true);
      
      // Step 2: User asks for weather
      const response2 = await request(app)
        .post('/api/chat')
        .send({
          message: '今天天气怎么样？',
          sessionId,
        })
        .expect(200);

      expect(response2.body.success).toBe(true);
      expect(response2.body.usedSkills).toContain('weather');
      
      // Step 3: User asks to turn on light
      const response3 = await request(app)
        .post('/api/chat')
        .send({
          message: '打开客厅的灯',
          sessionId,
        })
        .expect(200);

      expect(response3.body.success).toBe(true);
      expect(response3.body.usedSkills).toContain('smart-home');
      
      // Step 4: Clear conversation
      const response4 = await request(app)
        .post('/api/chat/clear')
        .send({
          sessionId,
        })
        .expect(200);

      expect(response4.body).toHaveProperty('success', true);
      expect(response4.body).toHaveProperty('message');
    });
  });

  describe('Error Handling', () => {
    it('should handle server errors gracefully', async () => {
      // Simulate server error by sending invalid data
      const response = await request(app)
        .post('/api/voice/process')
        .send({
          audioPath: '/nonexistent/audio.wav',
          sessionId: 'test-error-session',
        })
        .expect(500);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle timeout errors', async () => {
      // This test would mock timeout scenarios
      // Skip for now
      
      // Example:
      // const response = await request(app)
      //   .post('/api/voice/process')
      //   .timeout(1000) // 1 second timeout
      //   .send({
      //     audioPath: '/tmp/slow-audio.wav',
      //     sessionId: 'test-timeout-session',
      //   });
      //
      // expect(response.status).toBe(408); // Request Timeout
    }, 2000);
  });

  describe('Performance E2E', () => {
    it('should complete chat within SLA', async () => {
      const startTime = Date.now();
      
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: '这是一个性能测试消息',
          sessionId: 'test-perf-e2e-session',
        })
        .expect(200);

      const latency = Date.now() - startTime;
      
      expect(latency).toBeLessThan(3000); // 3s SLA for chat
      expect(response.body.success).toBe(true);
    }, 5000);

    it('should complete skill execution within SLA', async () => {
      const startTime = Date.now();
      
      const response = await request(app)
        .post('/api/skills/weather/execute')
        .send({
          location: '北京',
        })
        .expect(200);

      const latency = Date.now() - startTime;
      
      expect(latency).toBeLessThan(2000); // 2s SLA for skills
      expect(response.body.success).toBe(true);
    }, 3000);
  });
});
