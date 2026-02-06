import { FastifyInstance } from 'fastify';

export async function deviceRoutes(fastify: FastifyInstance) {
  // Get all devices
  fastify.get('/', async (request, reply) => {
    // TODO: Fetch devices from database
    return {
      devices: [],
      total: 0,
    };
  });

  // Get device status
  fastify.get('/:id/status', async (request, reply) => {
    const { id } = request.params as any;

    // TODO: Fetch device status
    return {
      id,
      status: 'offline',
      state: {},
    };
  });

  // Control device
  fastify.post('/:id/control', async (request, reply) => {
    const { id } = request.params as any;
    const { command, params } = request.body as any;

    // TODO: Send command to device via MQTT
    return {
      success: true,
      deviceId: id,
      command,
      result: {},
    };
  });
}
