import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { WhisperService } from '../services/WhisperService.js';
import { EdgeTTSService } from '../services/EdgeTTSService.js';
import { AgentService } from '../services/AgentService.js';
import { getServiceManager } from '../services/ServiceManager.js';

describe('WhisperService', () => {
  let whisperService: WhisperService;

  beforeAll(async () => {
    whisperService = new WhisperService({ model: 'base', language: 'zh' });
    await whisperService.downloadModel();
  });

  describe('Model Management', () => {
    it('should initialize with correct config', () => {
      const config = whisperService.getModelInfo();
      expect(config.model).toBe('base');
      expect(config.language).toBe('zh');
    });

    it('should have model directory', () => {
      const config = whisperService.getModelInfo();
      expect(config.modelPath).toBeDefined();
      expect(config.modelPath).toContain('whisper');
    });
  });

  describe('Transcribe', () => {
    it('should transcribe audio file', async () => {
      // Mock test - in production, use real audio file
      const result = await whisperService.transcribe('/tmp/test-audio.wav');
      
      expect(result).toBeDefined();
      expect(result.text).toBeDefined();
      expect(result.language).toBe('zh');
      expect(result.duration).toBeGreaterThan(0);
    }, 10000);

    it('should handle invalid audio file', async () => {
      await expect(whisperService.transcribe('/nonexistent/file.wav')).rejects.toThrow();
    });
  });

  describe('Streaming', () => {
    it('should support streaming transcription', async () => {
      const chunks: string[] = [];
      
      for await (const chunk of whisperService.streamingTranscribe('/tmp/test-audio.wav')) {
        chunks.push(chunk);
      }

      expect(chunks.length).toBeGreaterThan(0);
    }, 15000);
  });
});
