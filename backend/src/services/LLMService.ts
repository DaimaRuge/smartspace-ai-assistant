import { OpenAI } from 'openai';
import { Message } from '../types/message.js';

export interface LLMConfig {
  apiKey: string;
  baseURL?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export class LLMService {
  private client: OpenAI;
  private config: Required<LLMConfig>;

  constructor(config: LLMConfig) {
    this.config = {
      apiKey: config.apiKey,
      baseURL: config.baseURL || 'https://open.bigmodel.cn/api/paas/v4',
      model: config.model || 'zai/glm-4.7',
      maxTokens: config.maxTokens || 2000,
      temperature: config.temperature || 0.7,
    };

    this.client = new OpenAI({
      apiKey: this.config.apiKey,
      baseURL: this.config.baseURL,
    });
  }

  async chat(messages: Message[]): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: this.config.model,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('LLM chat error:', error);
      throw new Error(`LLM chat failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async *streamingChat(messages: Message[]): AsyncGenerator<string> {
    try {
      const stream = await this.client.chat.completions.create({
        model: this.config.model,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
        stream: true,
        temperature: this.config.temperature,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          yield content;
        }
      }
    } catch (error) {
      console.error('LLM streaming chat error:', error);
      throw new Error(`LLM streaming chat failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  getConfig(): Required<LLMConfig> {
    return { ...this.config };
  }
}
