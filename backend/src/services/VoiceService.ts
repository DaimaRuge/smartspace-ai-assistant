import * as fs from 'fs/promises';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface VoiceConfig {
  whisperModel?: 'tiny' | 'base' | 'small' | 'medium' | 'large' | 'large-v3';
  ttsEngine?: 'edge' | 'piper';
  edgeVoice?: string;
  sampleRate?: number;
}

export interface ASRResult {
  text: string;
  confidence: number;
  language: string;
  duration: number;
}

export interface TTSResult {
  audioPath: string;
  duration: number;
  sampleRate: number;
}

export class VoiceService {
  private config: Required<VoiceConfig>;
  private tempDir: string;

  constructor(config: VoiceConfig = {}) {
    this.config = {
      whisperModel: config.whisperModel || 'base',
      ttsEngine: config.ttsEngine || 'edge',
      edgeVoice: config.edgeVoice || 'zh-CN-XiaoxiaoNeural',
      sampleRate: config.sampleRate || 16000,
    };

    this.tempDir = path.join(process.cwd(), 'temp', 'voice');
    this.ensureTempDir();
  }

  private async ensureTempDir(): Promise<void> {
    try {
      await fs.mkdir(this.tempDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create temp directory:', error);
    }
  }

  async transcribe(audioPath: string): Promise<ASRResult> {
    try {
      // Use OpenAI Whisper API (could be replaced with local Whisper)
      const startTime = Date.now();

      // For now, simulate ASR with a mock response
      // In production, integrate with Whisper or other ASR service
      const mockResult: ASRResult = {
        text: '这是一个测试语音',
        confidence: 0.95,
        language: 'zh',
        duration: Date.now() - startTime,
      };

      console.log(`ASR transcribed: "${mockResult.text}" (confidence: ${mockResult.confidence})`);

      return mockResult;
    } catch (error) {
      console.error('ASR error:', error);
      throw new Error(`ASR failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async synthesize(text: string): Promise<TTSResult> {
    try {
      const startTime = Date.now();
      const outputPath = path.join(this.tempDir, `tts-${Date.now()}.mp3`);

      if (this.config.ttsEngine === 'edge') {
        // Use edge-tts
        await this.synthesizeEdgeTTS(text, outputPath);
      } else {
        // Use piper (local TTS)
        await this.synthesizePiperTTS(text, outputPath);
      }

      const duration = Date.now() - startTime;

      console.log(`TTS synthesized "${text}" to ${outputPath}`);

      return {
        audioPath: outputPath,
        duration,
        sampleRate: this.config.sampleRate,
      };
    } catch (error) {
      console.error('TTS error:', error);
      throw new Error(`TTS failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async synthesizeEdgeTTS(text: string, outputPath: string): Promise<void> {
    // Simulate edge-tts integration
    // In production, integrate with edge-tts library
    console.log(`Synthesizing with edge-tts: ${text}`);
    await fs.writeFile(outputPath, Buffer.from(''));
  }

  private async synthesizePiperTTS(text: string, outputPath: string): Promise<void> {
    // Simulate piper integration
    // In production, integrate with piper
    console.log(`Synthesizing with piper: ${text}`);
    await fs.writeFile(outputPath, Buffer.from(''));
  }

  async detectWakeWord(audioBuffer: Buffer): Promise<boolean> {
    // Simulate wake word detection
    // In production, integrate with OpenWakeWord or Porcupine
    return false;
  }

  async processVoiceStream(audioBuffer: Buffer): Promise<string> {
    // Process voice audio buffer and return transcribed text
    const tempPath = path.join(this.tempDir, `input-${Date.now()}.wav`);
    await fs.writeFile(tempPath, audioBuffer);

    const result = await this.transcribe(tempPath);

    // Clean up temp file
    await fs.unlink(tempPath).catch(() => {});

    return result.text;
  }

  async cleanupOldFiles(maxAgeMs: number = 24 * 60 * 60 * 1000): Promise<void> {
    try {
      const files = await fs.readdir(this.tempDir);
      const now = Date.now();

      for (const file of files) {
        const filePath = path.join(this.tempDir, file);
        const stats = await fs.stat(filePath);

        if (now - stats.mtimeMs > maxAgeMs) {
          await fs.unlink(filePath);
          console.log(`Cleaned up old voice file: ${file}`);
        }
      }
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }

  getConfig(): Required<VoiceConfig> {
    return { ...this.config };
  }
}
