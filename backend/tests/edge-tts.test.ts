import { describe, it, expect } from '@jest/globals';
import { EdgeTTSService } from '../services/EdgeTTSService';

describe('EdgeTTSService', () => {
  let ttsService: EdgeTTSService;

  beforeAll(async () => {
    ttsService = new EdgeTTSService({ voice: 'zh-CN-XiaoxiaoNeural' });
    await ttsService.initialize();
  });

  describe('Initialization', () => {
    it('should initialize with available voices', async () => {
      const voices = await ttsService.getVoices();
      expect(voices.length).toBeGreaterThan(0);
      expect(voices).toContain('zh-CN-XiaoxiaoNeural');
    });

    it('should get Chinese voices', async () => {
      const chineseVoices = await ttsService.getChineseVoices();
      expect(chineseVoices.length).toBeGreaterThan(0);
      expect(chineseVoices.every(v => v.startsWith('zh-CN'))).toBe(true);
    });

    it('should get English voices', async () => {
      const englishVoices = await ttsService.getEnglishVoices();
      expect(englishVoices.length).toBeGreaterThan(0);
      expect(englishVoices.every(v => v.startsWith('en-'))).toBe(true);
    });
  });

  describe('Synthesize', () => {
    it('should synthesize text to audio', async () => {
      const result = await ttsService.synthesize('你好，世界');
      
      expect(result).toBeDefined();
      expect(result.audioBuffer).toBeInstanceOf(Buffer);
      expect(result.duration).toBeGreaterThan(0);
      expect(result.format).toBe('mp3');
      expect(result.voice).toBe('zh-CN-XiaoxiaoNeural');
    }, 5000);

    it('should handle empty text', async () => {
      const result = await ttsService.synthesize('');
      
      expect(result).toBeDefined();
      expect(result.audioBuffer).toBeInstanceOf(Buffer);
      expect(result.duration).toBeGreaterThanOrEqual(0);
    });

    it('should support streaming synthesis', async () => {
      const chunks: Buffer[] = [];
      
      for await (const chunk of ttsService.streamingSynthesize('这是一个流式语音合成测试')) {
        chunks.push(chunk);
      }

      expect(chunks.length).toBeGreaterThan(0);
    }, 10000);
  });

  describe('Voice Configuration', () => {
    it('should set voice', async () => {
      const originalVoice = ttsService.getConfig().voice;
      
      ttsService.setVoice('en-US-AriaNeural');
      const newVoice = ttsService.getConfig().voice;
      
      expect(newVoice).toBe('en-US-AriaNeural');
      expect(newVoice).not.toBe(originalVoice);
    });

    it('should not set invalid voice', async () => {
      const originalVoice = ttsService.getConfig().voice;
      
      ttsService.setVoice('invalid-voice-name');
      const newVoice = ttsService.getConfig().voice;
      
      expect(newVoice).toBe(originalVoice); // Should not change
    });

    it('should set rate', async () => {
      const originalRate = ttsService.getConfig().rate;
      
      ttsService.setRate('+10%');
      const newRate = ttsService.getConfig().rate;
      
      expect(newRate).toBe('+10%');
      expect(newRate).not.toBe(originalRate);
    });

    it('should set pitch', async () => {
      const originalPitch = ttsService.getConfig().pitch;
      
      ttsService.setPitch('+2Hz');
      const newPitch = ttsService.getConfig().pitch;
      
      expect(newPitch).toBe('+2Hz');
      expect(newPitch).not.toBe(originalPitch);
    });

    it('should set volume', async () => {
      const originalVolume = ttsService.getConfig().volume;
      
      ttsService.setVolume('+5%');
      const newVolume = ttsService.getConfig().volume;
      
      expect(newVolume).toBe('+5%');
      expect(newVolume).not.toBe(originalVolume);
    });
  });

  describe('File Output', () => {
    it('should synthesize to file', async () => {
      const testPath = '/tmp/tts-test-output.mp3';
      
      await ttsService.synthesizeToFile('这是一个文件输出测试', testPath);
      
      const fs = await import('fs/promises');
      const fileExists = await fs.access(testPath).then(() => true).catch(() => false);
      
      expect(fileExists).toBe(true);
    }, 5000);
  });

  describe('Performance', () => {
    it('should meet latency target', async () => {
      const startTime = Date.now();
      
      await ttsService.synthesize('性能测试文本');
      
      const latency = Date.now() - startTime;
      expect(latency).toBeLessThan(1000); // < 1s target
    }, 5000);

    it('should handle long text efficiently', async () => {
      const longText = '这是一段很长的文本，用来测试TTS服务的性能和稳定性。' +
                        '这个测试应该能够验证系统在处理大量文本时的表现。' +
                        '我们希望看到系统能够稳定、高效地完成语音合成任务。' +
                        '同时，我们也关注系统在不同负载下的表现。';
      
      const startTime = Date.now();
      await ttsService.synthesize(longText);
      const latency = Date.now() - startTime;
      
      expect(latency).toBeLessThan(3000); // Should handle long text reasonably
    }, 10000);
  });
});
