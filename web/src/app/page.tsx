'use client';

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import Head from 'next/head';

export default function Home() {
  const [messages, setMessages] = useState<Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    isPlaying?: boolean;
  }>>([]);
  
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [sessionId] = useState(`web-session-${Date.now()}`);
  const [latency, setLatency] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const connectWebSocket = () => {
    const socket = io('http://localhost:3000/ws/voice', {
      transports: ['websocket'],
      query: { sessionId },
    });

    socket.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    });

    socket.on('message', (data) => {
      console.log('WebSocket message:', data);
      handleWebSocketMessage(data);
    });

    socketRef.current = socket;
  };

  const handleWebSocketMessage = async (data: any) => {
    switch (data.type) {
      case 'asr_result':
        const userMessage: any = {
          id: `msg-${Date.now()}`,
          role: 'user',
          content: data.text,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMessage]);
        break;

      case 'agent_response':
        const assistantMessage: any = {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: data.text,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
        break;

      case 'tts_audio':
        // Play audio
        playAudio(data.audio);
        break;

      case 'latency':
        setLatency(data.value);
        setIsProcessing(false);
        break;

      case 'error':
        console.error('WebSocket error:', data.error);
        setIsProcessing(false);
        break;

      default:
        console.log('Unknown message type:', data.type);
    }
  };

  const playAudio = (base64Audio: string) => {
    const audioBuffer = Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0));
    const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
    const audioUrl = URL.createObjectURL(audioBlob);

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.play();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      audioChunksRef.current = [];
    } catch (err) {
      console.error('Error starting recording:', err);
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current || !isRecording) return;

    mediaRecorderRef.current.stop();
    setIsRecording(false);
    setIsProcessing(true);

    // Stop all tracks
    mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());

    // Send audio to server
    setTimeout(() => {
      sendAudioToServer();
    }, 100);
  };

  const sendAudioToServer = () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const base64 = btoa(new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));

      if (socketRef.current) {
        socketRef.current.emit('message', {
          type: 'audio',
          audio: Array.from(new Uint8Array(arrayBuffer)),
          timestamp: new Date().toISOString(),
        });
      }
    };
    reader.readAsArrayBuffer(audioBlob);
  };

  const clearConversation = () => {
    setMessages([]);
    setLatency(0);
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <>
      <Head>
        <title>SmartSpace AI Assistant</title>
        <meta name="description" content="SmartSpace AI Assistant - 智能空间 AI 助手" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              🏠 SmartSpace AI
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm text-gray-600">
                  {isConnected ? '已连接' : '未连接'}
                </span>
              </div>
              <button
                onClick={clearConversation}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                清空对话
              </button>
            </div>
          </div>
        </header>

        {/* Messages Container */}
        <div className="max-w-4xl mx-auto px-4 py-8 flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="text-6xl mb-4">🎤</div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                欢迎使用 SmartSpace AI
              </h2>
              <p className="text-gray-500 mb-4">
                点击下方麦克风按钮开始对话
              </p>
              <p className="text-sm text-gray-400">
                支持语音和文本输入
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white rounded-br-md'
                        : 'bg-white text-gray-800 rounded-bl-md shadow-sm'
                    }`}
                  >
                    <p className="text-lg leading-relaxed">{message.content}</p>
                    <p className="text-xs mt-2 opacity-70">
                      {formatTime(new Date(message.timestamp))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Voice Input */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col items-center">
            {/* Latency Display */}
            {latency > 0 && (
              <div className="mb-4 text-center">
                <span className="text-sm text-gray-600">
                  端到端延迟: <span className="font-semibold">{latency}ms</span>
                </span>
                {latency < 2000 ? (
                  <span className="ml-2 text-green-600 text-sm">✅ 优秀</span>
                ) : latency < 3000 ? (
                  <span className="ml-2 text-yellow-600 text-sm">⚠️ 良好</span>
                ) : (
                  <span className="ml-2 text-red-600 text-sm">❌ 需优化</span>
                )}
              </div>
            )}

            {/* Mic Button */}
            <button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              disabled={isProcessing}
              className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl transition-all transform hover:scale-105 ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 scale-110'
                  : isProcessing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 shadow-lg'
              }`}
            >
              {isProcessing ? (
                <div className="animate-spin">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-0V8a8 8 0 00-16 0v4z"></path>
                  </svg>
                </div>
              ) : isRecording ? (
                <span>🛑</span>
              ) : (
                <span>🎤</span>
              )}
            </button>

            {isRecording && (
              <div className="mt-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-gray-600 text-sm">正在录音...</span>
              </div>
            )}

            {isProcessing && (
              <div className="mt-4 text-gray-600 text-sm">
                正在处理...
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
