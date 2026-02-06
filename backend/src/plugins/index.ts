import { FastifyInstance } from 'fastify';
import { databasePlugin } from './database.js';
import { llmPlugin } from './llm.js';
import { mqttPlugin } from './mqtt.js';
import { logger } from '../utils/logger.js';

export async function registerPlugins(fastify: FastifyInstance) {
  // Database plugin
  try {
    await fastify.register(databasePlugin);
    logger.info('✅ Database plugin registered');
  } catch (error) {
    logger.error('Failed to register database plugin', error);
  }

  // LLM plugin
  try {
    await fastify.register(llmPlugin);
    logger.info('✅ LLM plugin registered');
  } catch (error) {
    logger.error('Failed to register LLM plugin', error);
  }

  // MQTT plugin
  try {
    await fastify.register(mqttPlugin);
    logger.info('✅ MQTT plugin registered');
  } catch (error) {
    logger.error('Failed to register MQTT plugin', error);
  }
}
