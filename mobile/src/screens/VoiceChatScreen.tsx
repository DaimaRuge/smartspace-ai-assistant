import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { Audio } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import VoiceWave from '../components/VoiceWave';
import MessageBubble from '../components/MessageBubble';
import { api } from '../services/api';

const { width, height } = Dimensions.get('window');

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isPlaying?: boolean;
}

export default function VoiceChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sessionId, setSessionId] = useState<string>(`session-${Date.now()}`);

  const audioRecordingRef = useRef<Audio.Recording>();
  const soundRef = useRef<Audio.Sound>();

  useEffect(() => {
    requestMicrophonePermission();
    connectWebSocket();

    return () => {
      disconnectWebSocket();
    };
  }, []);

  const requestMicrophonePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn('Microphone permission denied');
        }
      } catch (err) {
        console.warn('Error requesting microphone permission:', err);
      }
    }
  };

  const connectWebSocket = () => {
    // Connect to WebSocket for real-time voice streaming
    console.log('Connecting to WebSocket...');
    // WebSocket connection logic here
  };

  const disconnectWebSocket = () => {
    console.log('Disconnecting from WebSocket...');
    // WebSocket disconnect logic here
  };

  const startRecording = async () => {
    try {
      console.log('Starting recording...');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      audioRecordingRef.current = recording;
      await recording.startAsync();
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  const stopRecording = async () => {
    if (!audioRecordingRef.current) return;

    try {
      console.log('Stopping recording...');
      await audioRecordingRef.current.stopAndUnloadAsync();
      setIsRecording(false);
      setIsProcessing(true);

      // Send audio to backend for processing
      const uri = audioRecordingRef.current.getURI();
      if (uri) {
        await processVoice(uri);
      }
    } catch (err) {
      console.error('Failed to stop recording:', err);
    }
  };

  const processVoice = async (audioUri: string) => {
    try {
      const response = await fetch(`${api.BASE_URL}/api/voice/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audioPath: audioUri,
          sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Voice processing failed');
      }

      const audioBuffer = await response.arrayBuffer();
      
      // Play assistant response
      await playAudioBuffer(audioBuffer);

      setIsProcessing(false);
    } catch (err) {
      console.error('Voice processing error:', err);
      setIsProcessing(false);
    }
  };

  const playAudioBuffer = async (buffer: ArrayBuffer) => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: '' },
        { buffer: buffer },
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded) {
            soundRef.current = sound;
            setIsSpeaking(true);
            
            sound.setOnPlaybackStatusUpdate((status) => {
              if (status.didJustFinish) {
                setIsSpeaking(false);
              }
            });
          }
        }
      );
    } catch (err) {
      console.error('Failed to play audio:', err);
    }
  };

  const handlePressIn = () => {
    if (!isRecording && !isProcessing) {
      startRecording();
    }
  };

  const handlePressOut = () => {
    if (isRecording) {
      stopRecording();
    }
  };

  const togglePlayback = (messageId: string) => {
    setMessages(messages.map(msg => ({
      ...msg,
      isPlaying: msg.id === messageId ? !msg.isPlaying : false,
    })));
  };

  const clearConversation = async () => {
    try {
      await api.clearConversation(sessionId);
      setMessages([]);
    } catch (err) {
      console.error('Failed to clear conversation:', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SmartSpace AI</Text>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={clearConversation}
        >
          <Text style={styles.clearButtonText}>清空</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <View style={styles.messagesContainer}>
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              点击麦克风按钮开始对话
            </Text>
            <Text style={styles.emptyStateSubtext}>
              支持语音和文本输入
            </Text>
          </View>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onTogglePlayback={togglePlayback}
            />
          ))
        )}
      </View>

      {/* Voice Input */}
      <View style={styles.voiceInputContainer}>
        <TouchableOpacity
          style={[
            styles.micButton,
            isRecording && styles.micButtonActive,
            isProcessing && styles.micButtonDisabled,
          ]}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={isProcessing}
          activeOpacity={0.8}
        >
          {isProcessing ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : isRecording ? (
            <VoiceWave isAnimating={true} color="#fff" />
          ) : (
            <Text style={styles.micIcon}>🎤</Text>
          )}
        </TouchableOpacity>

        {isRecording && (
          <View style={styles.recordingIndicator}>
            <View style={styles.recordingDot} />
            <Text style={styles.recordingText}>正在录音...</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#3498db',
    borderRadius: 20,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#95a5a6',
  },
  voiceInputContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  micButtonActive: {
    backgroundColor: '#e74c3c',
  },
  micButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  micIcon: {
    fontSize: 32,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e74c3c',
    marginRight: 8,
  },
  recordingText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
});
