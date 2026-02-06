import { FastifyInstance } from 'fastify';
import { WebSocket } from '@fastify/websocket';
import { getServiceManager } from '../services/ServiceManager.js';
import { WhisperService } from '../services/WhisperService.js';
import { EdgeTTSService } from '../services/EdgeTTSService.js';
import { AgentService } from '../services/AgentService.js';

export async function voiceWebSocketRoutes(fastify: FastifyInstance) {
  const whisper = new WhisperService({ model: 'base', language: 'zh' });
  const edgeTTS = new EdgeTTSService({ voice: 'zh-CN-XiaoxiaoNeural' });
  const agent = getServiceManager().getAgent();

  // WebSocket for real-time voice streaming
  fastify.register(async function (fastify) {
    fastify.get('/ws/voice', { websocket: true }, async (connection, req) => {
      const sessionId = req.query.sessionId as string || 'default';
      const clientIp = req.socket.remoteAddress;

      console.log(`🎤 Voice WebSocket connected: ${clientIp} (session: ${sessionId})`);

      let audioBuffer: Buffer[] = [];
      let isProcessing = false;

      // Send welcome message
      connection.socket.send(JSON.stringify({
        type: 'connected',
        sessionId,
        timestamp: new Date().toISOString(),
      }));

      // Handle incoming audio data
      connection.socket.on('message', async (message) => {
        try {
          const data = JSON.parse(message.toString());

          switch (data.type) {
            case 'audio':
              // Accumulate audio chunks
              if (Buffer.isBuffer(data.audio)) {
                audioBuffer.push(data.audio);
              }

              // Process when enough data accumulated
              if (audioBuffer.length >= 5) {
                await processAudioBuffer();
              }
              break;

            case 'text':
              // Direct text input
              await processTextInput(data.text);
              break;

            case 'config':
              // Update configuration
              if (data.voice) {
                edgeTTS.setVoice(data.voice);
              }
              break;

            case 'ping':
              connection.socket.send(JSON.stringify({ type: 'pong' }));
              break;

            default:
              console.warn(`Unknown message type: ${data.type}`);
          }
        } catch (error) {
          console.error('WebSocket message error:', error);
          connection.socket.send(JSON.stringify({
            type: 'error',
            error: error instanceof Error ? error.message : 'Unknown error',
          }));
        }
      });

      // Handle disconnection
      connection.socket.on('close', () => {
        console.log(`🔌 Voice WebSocket disconnected: ${clientIp} (session: ${sessionId})`);
      });

      // Process accumulated audio buffer
      async function processAudioBuffer() {
        if (isProcessing || audioBuffer.length === 0) return;

        isProcessing = true;
        const startTime = Date.now();

        try {
          // Combine audio chunks
          const combinedAudio = Buffer.concat(audioBuffer);
          audioBuffer = [];

          // Save to temp file
          const tempPath = `/tmp/voice-${Date.now()}.wav`;
          await require('fs/promises').writeFile(tempPath, combinedAudio);

          // Step 1: ASR (Speech to Text)
          const asrResult = await whisper.transcribe(tempPath);
          const userText = asrResult.text;

          console.log(`🎤 User said: "${userText}"`);

          // Send ASR result to client
          connection.socket.send(JSON.stringify({
            type: 'asr_result',
            text: userText,
            confidence: 0.95,
            timestamp: new Date().toISOString(),
          }));

          // Step 2: Agent processing
          const agentResult = await agent.processTask(userText, sessionId);
          const assistantText = agentResult.response;

          console.log(`🤖 Assistant: "${assistantText}"`);

          // Send agent processing status
          connection.socket.send(JSON.stringify({
            type: 'agent_processing',
            status: 'processing',
            timestamp: new Date().toISOString(),
          }));

          // Step 3: TTS (Text to Speech)
          const ttsResult = await edgeTTS.synthesize(assistantText);

          // Send audio buffer to client
          connection.socket.send(JSON.stringify({
            type: 'tts_audio',
            audio: ttsResult.audioBuffer.toString('base64'),
            duration: ttsResult.duration,
            format: ttsResult.format,
            voice: ttsResult.voice,
            timestamp: new Date().toISOString(),
          }));

          // Calculate end-to-end latency
          const latency = Date.now() - startTime;
          console.log(`⏱️ End-to-end latency: ${latency}ms`);

          // Send latency info
          connection.socket.send(JSON.stringify({
            type: 'latency',
            value: latency,
            timestamp: new Date().toISOString(),
          }));

          // Clean up temp file
          await require('fs/promises').unlink(tempPath).catch(() => {});
        } catch (error) {
          console.error('Audio processing error:', error);
          connection.socket.send(JSON.stringify({
            type: 'error',
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString(),
          }));
        } finally {
          isProcessing = false;
        }
      }

      // Process direct text input
      async function processTextInput(text: string) {
        if (isProcessing) return;

        isProcessing = true;
        const startTime = Date.now();

        try {
          console.log(`💬 User text: "${text}"`);

          // Send text acknowledgment
          connection.socket.send(JSON.stringify({
            type: 'text_received',
            text,
            timestamp: new Date().toISOString(),
          }));

          // Agent processing
          const agentResult = await agent.processTask(text, sessionId);
          const assistantText = agentResult.response;

          console.log(`🤖 Assistant: "${assistantText}"`);

          // Send agent response
          connection.socket.send(JSON.stringify({
            type: 'agent_response',
            text: assistantText,
            timestamp: new Date().toISOString(),
          }));

          // TTS
          const ttsResult = await edgeTTS.synthesize(assistantText);

          // Send audio
          connection.socket.send(JSON.stringify({
            type: 'tts_audio',
            audio: ttsResult.audioBuffer.toString('base64'),
            duration: ttsResult.duration,
            format: ttsResult.format,
            timestamp: new Date().toISOString(),
          }));

          const latency = Date.now() - startTime;
          console.log(`⏱️ Text-to-speech latency: ${latency}ms`);

          connection.socket.send(JSON.stringify({
            type: 'latency',
            value: latency,
            timestamp: new Date().toISOString(),
          }));
        } catch (error) {
          console.error('Text processing error:', error);
          connection.socket.send(JSON.stringify({
            type: 'error',
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString(),
          }));
        } finally {
          isProcessing = false;
        }
      }
    });
  });
}
