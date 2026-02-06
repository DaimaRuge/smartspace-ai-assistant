import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import websocket from '@fastify/websocket';
import swagger from '@fastify/swagger';
import { registerRoutes } from './routes/index.js';
import { registerPlugins } from './plugins/index.js';
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

  // Register plugins
  await registerPlugins(fastify);

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
        version: '0.1.0',
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

  // Health check
  fastify.get('/health', async () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
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

    logger.info(`🚀 SmartSpace AI Assistant API Server started`);
    logger.info(`📡 Server listening on http://${host}:${port}`);
    logger.info(`📚 API Docs: http://${host}:${port}/docs`);
  } catch (err) {
    logger.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
