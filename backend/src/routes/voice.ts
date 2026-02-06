import { FastifyInstance } from 'fastify';
import { getServiceManager } from '../services/ServiceManager.js';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function voiceRoutes(fastify: FastifyInstance) {
  const voice = getServiceManager().getVoice();
  const agent = getServiceManager().getAgent();

  // Wake word detection
  fastify.post('/wake', async (request, reply) => {
    const { audioBuffer } = request.body as {
      audioBuffer: Buffer;
    };

    if (!audioBuffer) {
      return reply.status(400).send({
        success: false,
        error: 'Audio buffer is required',
      });
    }

    try {
      const detected = await voice.detectWakeWord(audioBuffer);

      return {
        success: true,
        detected,
        keyword: detected ? '唤醒成功' : '',
      };
    } catch (error) {
      fastify.log.error('Wake word detection error:', error);
      return reply.status(500).send({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // ASR - Speech to Text
  fastify.post('/asr', async (request, reply) => {
    const { audioBuffer, audioPath } = request.body as {
      audioBuffer?: Buffer;
      audioPath?: string;
    };

    if (!audioBuffer && !audioPath) {
      return reply.status(400).send({
        success: false,
        error: 'Either audioBuffer or audioPath is required',
      });
    }

    try {
      let text: string;

      if (audioBuffer) {
        text = await voice.processVoiceStream(audioBuffer);
      } else if (audioPath) {
        const result = await voice.transcribe(audioPath);
        text = result.text;
      }

      return {
        success: true,
        text,
      };
    } catch (error) {
      fastify.log.error('ASR error:', error);
      return reply.status(500).send({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // TTS - Text to Speech
  fastify.post('/tts', async (request, reply) => {
    const { text, voice: voiceName } = request.body as {
      text: string;
      voice?: string;
    };

    if (!text) {
      return reply.status(400).send({
        success: false,
        error: 'Text is required',
      });
    }

    try {
      const result = await voice.synthesize(text);

      // Return audio file
      const audioBuffer = await execAsync(`cat ${result.audioPath}`);

      reply.header('Content-Type', 'audio/mpeg');
      reply.header('Content-Disposition', `attachment; filename="tts-${Date.now()}.mp3"`);

      return reply.send(audioBuffer.stdout);
    } catch (error) {
      fastify.log.error('TTS error:', error);
      return reply.status(500).send({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // End-to-end voice processing
  fastify.post('/process', async (request, reply) => {
    const { audioBuffer, sessionId } = request.body as {
      audioBuffer: Buffer;
      sessionId: string;
    };

    if (!audioBuffer) {
      return reply.status(400).send({
        success: false,
        error: 'Audio buffer is required',
      });
    }

    try {
      // Step 1: ASR
      const userText = await voice.processVoiceStream(audioBuffer);
      fastify.log.info(`User said: "${userText}"`);

      // Step 2: Agent processing
      const agentResult = await agent.processTask(userText, sessionId || 'default');
      const assistantText = agentResult.response;
      fastify.log.info(`Assistant response: "${assistantText}"`);

      // Step 3: TTS
      const ttsResult = await voice.synthesize(assistantText);

      // Return audio file
      const audioBuffer = await execAsync(`cat ${ttsResult.audioPath}`);

      reply.header('Content-Type', 'audio/mpeg');
      reply.header('Content-Disposition', `attachment; filename="response-${Date.now()}.mp3"`);

      return reply.send(audioBuffer.stdout);
    } catch (error) {
      fastify.log.error('Voice process error:', error);
      return reply.status(500).send({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });
}
