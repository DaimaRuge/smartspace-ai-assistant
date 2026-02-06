import * as edgeTTS from 'edge-tts';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface EdgeTTSConfig {
  voice?: string;
  rate?: string;
  pitch?: string;
  volume?: string;
  outputFormat?: 'mp3' | 'wav' | 'webm';
}

export interface TTSResult {
  audioBuffer: Buffer;
  duration: number;
  format: string;
  voice: string;
}

export class EdgeTTSService {
  private config: Required<EdgeTTSConfig>;
  private availableVoices: string[] = [];

  constructor(config: EdgeTTSConfig = {}) {
    this.config = {
      voice: config.voice || 'zh-CN-XiaoxiaoNeural',
      rate: config.rate || '+0%',
      pitch: config.pitch || '+0Hz',
      volume: config.volume || '+0%',
      outputFormat: config.outputFormat || 'mp3',
    };

    this.initialize();
  }

  private async initialize(): Promise<void> {
    // Get available voices
    this.availableVoices = await edgeTTS.getVoices();
    console.log(`✅ Edge-TTS initialized with ${this.availableVoices.length} voices`);
  }

  async *streamingSynthesize(text: string): AsyncGenerator<Buffer> {
    try {
      const communicate = edgeTTSCommunicate({
        text,
        voice: this.config.voice,
        rate: this.config.rate,
        pitch: this.config.pitch,
        volume: this.config.volume,
      });

      for await (const chunk of communicate) {
        if (chunk.type === 'audio') {
          yield Buffer.from(chunk.data);
        }
      }
    } catch (error) {
      console.error('Streaming TTS error:', error);
      throw new Error(`Streaming TTS failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async synthesize(text: string): Promise<TTSResult> {
    try {
      const startTime = Date.now();

      // Generate audio using edge-tts
      const audioData = await edgeTTSCommunicate({
        text,
        voice: this.config.voice,
        rate: this.config.rate,
        pitch: this.config.pitch,
        volume: this.config.volume,
      });

      // Collect audio chunks
      const chunks: Buffer[] = [];
      for await (const chunk of audioData) {
        if (chunk.type === 'audio') {
          chunks.push(Buffer.from(chunk.data));
        }
      }

      const audioBuffer = Buffer.concat(chunks);
      const duration = Date.now() - startTime;

      console.log(`Edge-TTS synthesized "${text.substring(0, 50)}..." (${audioBuffer.length} bytes, ${duration}ms)`);

      return {
        audioBuffer,
        duration,
        format: this.config.outputFormat,
        voice: this.config.voice,
      };
    } catch (error) {
      console.error('TTS error:', error);
      throw new Error(`TTS failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async synthesizeToFile(text: string, outputPath: string): Promise<void> {
    try {
      const result = await this.synthesize(text);

      await fs.writeFile(outputPath, result.audioBuffer);
      console.log(`✅ Audio saved to ${outputPath}`);
    } catch (error) {
      console.error('Synthesize to file error:', error);
      throw error;
    }
  }

  async getVoices(): Promise<string[]> {
    try {
      const voices = await edgeTTS.getVoices();
      return voices;
    } catch (error) {
      console.error('Get voices error:', error);
      return [];
    }
  }

  async getChineseVoices(): Promise<string[]> {
    const allVoices = await this.getVoices();
    return allVoices.filter(voice => voice.startsWith('zh-CN'));
  }

  async getEnglishVoices(): Promise<string[]> {
    const allVoices = await this.getVoices();
    return allVoices.filter(voice => voice.startsWith('en-'));
  }

  setVoice(voice: string): void {
    if (this.availableVoices.includes(voice)) {
      this.config.voice = voice;
      console.log(`✅ Voice changed to ${voice}`);
    } else {
      console.warn(`⚠️ Voice ${voice} not available, using default`);
    }
  }

  setRate(rate: string): void {
    // Rate can be from -50% to +100%
    if (this.validateRate(rate)) {
      this.config.rate = rate;
    }
  }

  setPitch(pitch: string): void {
    // Pitch can be from -10Hz to +10Hz
    if (this.validatePitch(pitch)) {
      this.config.pitch = pitch;
    }
  }

  setVolume(volume: string): void {
    // Volume can be from -100% to +100%
    if (this.validateVolume(volume)) {
      this.config.volume = volume;
    }
  }

  private validateRate(rate: string): boolean {
    const match = rate.match(/([+-]?)(\d+)%/);
    if (!match) return false;

    const sign = match[1] || '+';
    const value = parseInt(match[2]);

    if (sign === '-') {
      return value <= 50;
    } else {
      return value <= 100;
    }
  }

  private validatePitch(pitch: string): boolean {
    const match = pitch.match(/([+-]?)(\d+)Hz/);
    if (!match) return false;

    const sign = match[1] || '+';
    const value = parseInt(match[2]);

    if (sign === '-') {
      return value <= 10;
    } else {
      return value <= 10;
    }
  }

  private validateVolume(volume: string): boolean {
    const match = volume.match(/([+-]?)(\d+)%/);
    if (!match) return false;

    const sign = match[1] || '+';
    const value = parseInt(match[2]);

    if (sign === '-') {
      return value <= 100;
    } else {
      return value <= 100;
    }
  }

  async testVoice(voice: string, testText: string = '你好，这是语音测试。'): Promise<void> {
    const originalVoice = this.config.voice;
    this.setVoice(voice);

    const testPath = path.join(process.cwd(), 'temp', `voice-test-${Date.now()}.mp3`);
    await fs.mkdir(path.dirname(testPath), { recursive: true });

    await this.synthesizeToFile(testText, testPath);

    console.log(`✅ Voice test saved to ${testPath}`);

    this.config.voice = originalVoice;
  }

  getConfig(): Required<EdgeTTSConfig> {
    return { ...this.config };
  }

  getAvailableVoices(): string[] {
    return [...this.availableVoices];
  }
}
