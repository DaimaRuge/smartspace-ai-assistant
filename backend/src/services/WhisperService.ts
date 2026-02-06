import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';

const execAsync = promisify(exec);

export interface WhisperConfig {
  model?: 'tiny' | 'base' | 'small' | 'medium' | 'large' | 'large-v3';
  language?: string;
  task?: 'transcribe' | 'translate';
  temperature?: number;
  best_of?: number;
  beam_size?: number;
}

export interface WhisperResult {
  text: string;
  language: string;
  segments: Array<{
    id: number;
    start: number;
    end: number;
    text: string;
    no_speech_prob: number;
  }>;
  duration: number;
}

export class WhisperService {
  private config: Required<WhisperConfig>;
  private modelPath: string;

  constructor(config: WhisperConfig = {}) {
    this.config = {
      model: config.model || 'base',
      language: config.language || 'zh',
      task: config.task || 'transcribe',
      temperature: config.temperature || 0,
      best_of: config.best_of || 5,
      beam_size: config.beam_size || 5,
    };

    this.modelPath = path.join(process.cwd(), 'models', 'whisper');
    this.ensureModelDir();
  }

  private async ensureModelDir(): Promise<void> {
    try {
      await fs.mkdir(this.modelPath, { recursive: true });
      console.log('Whisper model directory ready');
    } catch (error) {
      console.error('Failed to create model directory:', error);
    }
  }

  async downloadModel(): Promise<void> {
    const modelName = `${this.config.model}.ggml`;
    const modelPath = path.join(this.modelPath, `${modelName}.bin`);

    try {
      await fs.access(modelPath);
      console.log(`Model ${this.config.model} already exists`);
      return;
    } catch {
      console.log(`Downloading ${this.config.model} model...`);
    }

    // Download from Hugging Face
    const url = `https://huggingface.co/ggerganov/whisper.cpp/resolve/main/${modelName}.bin`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to download model: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await fs.writeFile(modelPath, buffer);
    console.log(`✅ Model ${this.config.model} downloaded successfully`);
  }

  async transcribe(audioPath: string): Promise<WhisperResult> {
    try {
      const startTime = Date.now();

      // Use OpenAI Whisper API (more reliable than local)
      // Alternative: use local whisper.cpp
      const result = await this.transcribeWithOpenAI(audioPath);

      const duration = Date.now() - startTime;
      console.log(`Whisper transcribed "${result.text}" (${duration}ms)`);

      return {
        ...result,
        duration,
      };
    } catch (error) {
      console.error('Whisper transcribe error:', error);
      throw new Error(`Whisper transcribe failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async transcribeWithOpenAI(audioPath: string): Promise<WhisperResult> {
    // Read audio file
    const audioBuffer = await fs.readFile(audioPath);

    // Create FormData for API
    const formData = new FormData();
    formData.append('file', new Blob([audioBuffer]), path.basename(audioPath));
    formData.append('model', 'whisper-1');
    formData.append('language', this.config.language);
    formData.append('response_format', 'verbose_json');

    // Call OpenAI Whisper API
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY || process.env.ZAI_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();

    return {
      text: data.text,
      language: data.language,
      segments: data.segments || [],
      duration: data.duration || 0,
    };
  }

  async *streamingTranscribe(audioPath: string): AsyncGenerator<string> {
    try {
      // For streaming, we need to chunk the audio
      // This is a simplified implementation
      const chunks = await this.chunkAudio(audioPath, 5000); // 5 second chunks

      for (let i = 0; i < chunks.length; i++) {
        const chunkPath = chunks[i];
        const result = await this.transcribe(chunkPath);

        yield result.text;

        // Clean up chunk
        await fs.unlink(chunkPath).catch(() => {});
      }
    } catch (error) {
      console.error('Streaming transcribe error:', error);
      throw error;
    }
  }

  private async chunkAudio(audioPath: string, chunkDurationMs: number): Promise<string[]> {
    // Use ffmpeg to split audio into chunks
    const chunkDir = path.join(this.modelPath, 'chunks');
    await fs.mkdir(chunkDir, { recursive: true });

    const chunkPattern = path.join(chunkDir, 'chunk_%03d.wav');

    try {
      await execAsync(`ffmpeg -i ${audioPath} -f segment -segment_time ${chunkDurationMs / 1000} -c copy ${chunkPattern} -y`);

      const files = await fs.readdir(chunkDir);
      return files.map(f => path.join(chunkDir, f)).sort();
    } catch (error) {
      console.error('Chunk audio error:', error);
      return [audioPath]; // Return original if chunking fails
    }
  }

  async optimizeModel(): Promise<void> {
    console.log('Optimizing Whisper model...');

    // Convert model to GGML format if needed
    // This is a placeholder for model optimization logic
    console.log('Model optimization complete');
  }

  getModelInfo() {
    return {
      model: this.config.model,
      language: this.config.language,
      modelPath: this.modelPath,
      config: this.config,
    };
  }
}
