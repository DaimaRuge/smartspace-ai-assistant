import { FastifyPluginAsync } from 'fastify';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const databasePlugin: FastifyPluginAsync = async (fastify, options) => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  // Test connection
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    fastify.log.info('Database connected successfully');
  } catch (error) {
    fastify.log.error('Database connection failed', error);
    throw error;
  }

  // Decorate fastify with db instance
  fastify.decorate('db', pool);

  // Close connection on close
  fastify.addHook('onClose', async (instance) => {
    await pool.end();
  });
};

// Type augmentation
declare module 'fastify' {
  interface FastifyInstance {
    db: pg.Pool;
  }
}
