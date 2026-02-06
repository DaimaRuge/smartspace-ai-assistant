export type MessageRole = 'system' | 'user' | 'assistant' | 'tool';

export interface Message {
  role: MessageRole;
  content: string;
  timestamp?: Date;
  metadata?: Record<string, any>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  language: string;
  timezone: string;
  notifications: boolean;
  voicePreference: {
    speed: number;
    pitch: number;
    volume: number;
    voiceName: string;
  };
}

export interface Device {
  id: string;
  userId: string;
  type: string;
  name: string;
  state: Record<string, any>;
  capabilities: string[];
  location: string;
  lastSeen: Date;
  isOnline: boolean;
}

export interface DeviceCommand {
  action: string;
  parameters?: Record<string, any>;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  userId: string;
  sessionId: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SkillExecution {
  id: string;
  skillId: string;
  userId: string;
  params: Record<string, any>;
  result: Record<string, any>;
  status: 'pending' | 'running' | 'success' | 'failed';
  duration: number;
  createdAt: Date;
  completedAt?: Date;
}

export interface VoiceRequest {
  id: string;
  userId: string;
  sessionId: string;
  audioBuffer: Buffer;
  language: string;
  timestamp: Date;
}

export interface VoiceResponse {
  id: string;
  requestId: string;
  text: string;
  audioBuffer?: Buffer;
  duration: number;
  timestamp: Date;
}
