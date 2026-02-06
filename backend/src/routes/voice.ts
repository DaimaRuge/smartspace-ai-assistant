import { FastifyInstance } from 'fastify';

export async function voiceRoutes(fastify: FastifyInstance) {
  // Wake word detection
  fastify.post('/wake', async (request, reply) => {
    return {
      detected: false,
      keyword: '',
    };
  });

  // ASR - Speech to Text
  fastify.post('/asr', async (request, reply) => {
    // TODO: Implement Whisper ASR
    return {
      text: '',
      confidence: 0,
    };
  });

  // TTS - Text to Speech
  fastify.post('/tts', async (request, reply) => {
    const { text, voice } = request.body as any;

    // TODO: Implement Edge-TTS
    return {
      audioUrl: '',
      duration: 0,
    };
  });
}
