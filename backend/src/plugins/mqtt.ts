import { FastifyPluginAsync } from 'fastify';
import mqtt from 'mqtt';
import dotenv from 'dotenv';

dotenv.config();

export const mqttPlugin: FastifyPluginAsync = async (fastify, options) => {
  const mqttUrl = process.env.MQTT_URL || 'mqtt://localhost:1883';
  const client = mqtt.connect(mqttUrl, {
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
  });

  client.on('connect', () => {
    fastify.log.info('MQTT client connected');
  });

  client.on('error', (error) => {
    fastify.log.error('MQTT client error', error);
  });

  client.on('close', () => {
    fastify.log.info('MQTT client disconnected');
  });

  // Decorate fastify with mqtt client
  fastify.decorate('mqtt', {
    client,
    publish: (topic: string, message: string) => {
      return new Promise((resolve, reject) => {
        client.publish(topic, message, (err) => {
          if (err) reject(err);
          else resolve(true);
        });
      });
    },
    subscribe: (topic: string, callback: (message: string) => void) => {
      client.subscribe(topic);
      client.on('message', (receivedTopic, message) => {
        if (receivedTopic === topic) {
          callback(message.toString());
        }
      });
    },
  });

  // Close connection on close
  fastify.addHook('onClose', async () => {
    client.end();
  });
};

// Type augmentation
declare module 'fastify' {
  interface FastifyInstance {
    mqtt: {
      client: mqtt.MqttClient;
      publish: (topic: string, message: string) => Promise<boolean>;
      subscribe: (topic: string, callback: (message: string) => void) => void;
    };
  }
}
