import { FastifyPluginAsync } from 'fastify';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

export const llmPlugin: FastifyPluginAsync = async (fastify, options) => {
  const openai = new OpenAI({
    apiKey: process.env.ZAI_API_KEY,
    baseURL: process.env.ZAI_API_BASE || 'https://open.bigmodel.cn/api/paas/v4',
  });

  // Chat completion helper
  fastify.decorate('llm', {
    chat: async (messages: any[], options?: any) => {
      try {
        const response = await openai.chat.completions.create({
          model: process.env.ZAI_MODEL || 'zai/glm-4.7',
          messages,
          stream: options?.stream || false,
          temperature: options?.temperature || 0.7,
          max_tokens: options?.max_tokens,
        });

        return response;
      } catch (error) {
        fastify.log.error('LLM chat failed', error);
        throw error;
      }
    },

    streamingChat: async function* (messages: any[], options?: any) {
      try {
        const stream = await openai.chat.completions.create({
          model: process.env.ZAI_MODEL || 'zai/glm-4.7',
          messages,
          stream: true,
          temperature: options?.temperature || 0.7,
        });

        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            yield content;
          }
        }
      } catch (error) {
        fastify.log.error('LLM streaming chat failed', error);
        throw error;
      }
    },
  });
};

// Type augmentation
declare module 'fastify' {
  interface FastifyInstance {
    llm: {
      chat: (messages: any[], options?: any) => Promise<any>;
      streamingChat: (messages: any[], options?: any) => AsyncGenerator<string>;
    };
  }
}
