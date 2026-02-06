import { FastifyInstance } from 'fastify';

export async function openclawRoutes(fastify: FastifyInstance) {
  // Send message via OpenClaw
  fastify.post('/send', async (request, reply) => {
    const { channel, target, message } = request.body as any;

    // TODO: Integrate with OpenClaw message tool
    return {
      success: true,
      channel,
      target,
      messageId: '',
      timestamp: new Date().toISOString(),
    };
  });

  // Get notification history
  fastify.get('/notifications', async (request, reply) => {
    // TODO: Fetch notification history
    return {
      notifications: [],
      total: 0,
    };
  });
}
