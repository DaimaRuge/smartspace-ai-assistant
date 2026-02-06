import { FastifyInstance } from 'fastify';

export async function chatRoutes(fastify: FastifyInstance) {
  // Chat completion
  fastify.post('/', async (request, reply) => {
    const { message, context } = request.body as any;

    // TODO: Implement LLM chat logic
    return {
      id: 'msg-123',
      role: 'assistant',
      content: 'I received your message: ' + message,
      timestamp: new Date().toISOString(),
    };
  });

  // Streaming chat
  fastify.post('/stream', async (request, reply) => {
    // TODO: Implement streaming chat
    return { message: 'Streaming not implemented yet' };
  });
}
