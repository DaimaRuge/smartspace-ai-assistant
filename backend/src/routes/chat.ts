import { FastifyInstance } from 'fastify';
import { getServiceManager } from '../services/ServiceManager.js';
import { Message } from '../types/message.js';

export async function chatRoutes(fastify: FastifyInstance) {
  const agent = getServiceManager().getAgent();

  // Chat completion
  fastify.post('/', async (request, reply) => {
    const { message, sessionId } = request.body as {
      message: string;
      sessionId: string;
    };

    if (!message) {
      return reply.status(400).send({
        success: false,
        error: 'Message is required',
      });
    }

    if (!sessionId) {
      return reply.status(400).send({
        success: false,
        error: 'Session ID is required',
      });
    }

    try {
      const result = await agent.processTask(message, sessionId);

      return {
        success: true,
        ...result,
      };
    } catch (error) {
      fastify.log.error('Chat error:', error);
      return reply.status(500).send({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // Streaming chat
  fastify.post('/stream', async (request, reply) => {
    const { message, sessionId } = request.body as {
      message: string;
      sessionId: string;
    };

    reply.raw.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    try {
      const llm = getServiceManager().getLLM();
      const messages: Message[] = [
        { role: 'system', content: agent['config'].systemPrompt },
        { role: 'user', content: message },
      ];

      const stream = llm['streamingChat'](messages);
      for await (const chunk of stream) {
        reply.raw.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
      }

      reply.raw.write('data: [DONE]\n\n');
      reply.raw.end();
    } catch (error) {
      fastify.log.error('Streaming chat error:', error);
      reply.raw.write(`data: ${JSON.stringify({ error: 'Streaming failed' })}\n\n`);
      reply.raw.end();
    }
  });

  // Clear conversation
  fastify.post('/clear', async (request, reply) => {
    const { sessionId } = request.body as { sessionId: string };

    if (!sessionId) {
      return reply.status(400).send({
        success: false,
        error: 'Session ID is required',
      });
    }

    agent.clearHistory(sessionId);

    return {
      success: true,
      message: 'Conversation cleared',
    };
  });
}
