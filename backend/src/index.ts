import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import websocket from '@fastify/websocket';
import swagger from '@fastify/swagger';
import { registerRoutes } from './routes/index.js';
import { getServiceManager } from './services/ServiceManager.js';
import { Logger } from './utils/logger.js';

const logger = new Logger();

async function buildServer() {
  const fastify = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:HH:MM:ss',
          ignore: 'pid,hostname,reqId',
        },
      },
    },
  });

  // Register CORS
  await fastify.register(cors, {
    origin: true,
    credentials: true,
  });

  // Register JWT
  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET || 'secret-key',
  });

  // Register WebSocket
  await fastify.register(websocket);

  // Register Swagger
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: 'SmartSpace AI Assistant API',
        description: 'API documentation for SmartSpace AI Assistant',
        version: '1.0.0',
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server',
        },
      ],
    },
  });

  // Register routes
  await registerRoutes(fastify);

  // Initialize services
  const serviceManager = getServiceManager();
  await serviceManager.testConnection();

  // Health check
  fastify.get('/health', async () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        llm: 'connected',
        agent: 'ready',
        voice: 'ready',
      },
    };
  });

  return fastify;
}

async function start() {
  try {
    const server = await buildServer();
    const port = parseInt(process.env.PORT || '3000', 10);
    const host = process.env.HOST || '0.0.0.0';

    await server.listen({ port, host });

    logger.info('🚀 SmartSpace AI Assistant API Server started');
    logger.info('📡 Server listening on http://%s:%s', host, port);
    logger.info('📚 API Docs: http://%s:%s/docs', host, port);
  } catch (err) {
    logger.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
