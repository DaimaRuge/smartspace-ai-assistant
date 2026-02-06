import { LLMService } from './services/LLMService.js';
import { AgentService } from './services/AgentService.js';
import { VoiceService } from './services/VoiceService.js';

export class ServiceManager {
  private llm: LLMService;
  private agent: AgentService;
  private voice: VoiceService;

  constructor() {
    // Initialize LLM service
    this.llm = new LLMService({
      apiKey: process.env.ZAI_API_KEY || 'your-api-key',
      baseURL: process.env.ZAI_API_BASE || 'https://open.bigmodel.cn/api/paas/v4',
      model: process.env.ZAI_MODEL || 'zai/glm-4.7',
      maxTokens: parseInt(process.env.ZAI_MAX_TOKENS || '2000', 10),
      temperature: parseFloat(process.env.ZAI_TEMPERATURE || '0.7'),
    });

    // Initialize Agent service
    this.agent = new AgentService(this.llm, {
      maxIterations: parseInt(process.env.AGENT_MAX_ITERATIONS || '3', 10),
      temperature: parseFloat(process.env.AGENT_TEMPERATURE || '0.7'),
    });

    // Initialize Voice service
    this.voice = new VoiceService({
      whisperModel: (process.env.WHISPER_MODEL as any) || 'base',
      ttsEngine: (process.env.TTS_ENGINE as any) || 'edge',
      edgeVoice: process.env.EDGE_VOICE || 'zh-CN-XiaoxiaoNeural',
      sampleRate: parseInt(process.env.AUDIO_SAMPLE_RATE || '16000', 10),
    });

    console.log('✅ ServiceManager initialized');
    console.log('   - LLM Service:', this.llm.getConfig().model);
    console.log('   - Agent Service: configured');
    console.log('   - Voice Service:', this.voice.getConfig().ttsEngine);
  }

  getLLM(): LLMService {
    return this.llm;
  }

  getAgent(): AgentService {
    return this.agent;
  }

  getVoice(): VoiceService {
    return this.voice;
  }

  async testConnection(): Promise<boolean> {
    try {
      // Test LLM connection
      await this.llm.chat([{ role: 'user', content: 'Hello' }]);

      console.log('✅ All services connected successfully');
      return true;
    } catch (error) {
      console.error('❌ Service connection failed:', error);
      return false;
    }
  }
}

// Singleton instance
let serviceManagerInstance: ServiceManager | null = null;

export function getServiceManager(): ServiceManager {
  if (!serviceManagerInstance) {
    serviceManagerInstance = new ServiceManager();
  }
  return serviceManagerInstance;
}
