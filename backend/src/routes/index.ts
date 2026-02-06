import { FastifyInstance } from 'fastify';
import { chatRoutes } from './chat.js';
import { voiceRoutes } from './voice.js';
import { deviceRoutes } from './devices.js';
import { skillRoutes } from './skills.js';
import { openclawRoutes } from './openclaw.js';
import { conversationRoutes } from './conversations.js';

export async function registerRoutes(fastify: FastifyInstance) {
  // API routes
  await fastify.register(chatRoutes, { prefix: '/api/chat' });
  await fastify.register(voiceRoutes, { prefix: '/api/voice' });
  await fastify.register(deviceRoutes, { prefix: '/api/devices' });
  await fastify.register(skillRoutes, { prefix: '/api/skills' });
  await fastify.register(openclawRoutes, { prefix: '/api/openclaw' });
  await fastify.register(conversationRoutes, { prefix: '/api/conversations' });

  // WebSocket routes
  fastify.register(async function (fastify) {
    fastify.get('/ws/voice', { websocket: true }, async (connection, req) => {
      fastify.log.info('Voice WebSocket connected');
      connection.socket.on('message', async (message) => {
        // Handle voice stream
        connection.socket.send('pong');
      });
    });

    fastify.get('/ws/chat', { websocket: true }, async (connection, req) => {
      fastify.log.info('Chat WebSocket connected');
    });

    fastify.get('/ws/devices/updates', { websocket: true }, async (connection, req) => {
      fastify.log.info('Device updates WebSocket connected');
    });
  });
}
