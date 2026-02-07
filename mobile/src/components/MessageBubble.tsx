import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';

interface MessageBubbleProps {
  message: {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    isPlaying?: boolean;
  };
  onTogglePlayback?: (messageId: string) => void;
}

export default function MessageBubble({ message, onTogglePlayback }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const soundRef = useRef<Audio.Sound>();

  const handlePlay = async () => {
    if (message.isPlaying) {
      // Pause playback
      if (soundRef.current) {
        await soundRef.current.stopAsync();
      }
      onTogglePlayback?.(message.id);
    } else {
      // Start playback
      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri: '' },
          { shouldPlay: true },
        );
        soundRef.current = sound;
        
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            onTogglePlayback?.(message.id);
          }
        });
        
        onTogglePlayback?.(message.id);
      } catch (err) {
        console.error('Failed to play message:', err);
      }
    }
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.assistantContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.assistantBubble,
        ]}
      >
        <Text
          style={[
            styles.text,
            isUser ? styles.userText : styles.assistantText,
          ]}
        >
          {message.content}
        </Text>

        {!isUser && onTogglePlayback && (
          <TouchableOpacity
            style={styles.playButton}
            onPress={handlePlay}
            activeOpacity={0.7}
          >
            <Text style={styles.playIcon}>
              {message.isPlaying ? '⏸' : '▶️'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.timestamp}>
        {formatTime(new Date(message.timestamp))}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  assistantContainer: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: 16,
    padding: 12,
  },
  userBubble: {
    backgroundColor: '#3498db',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: '#f0f0f0',
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#fff',
  },
  assistantText: {
    color: '#333',
  },
  playButton: {
    position: 'absolute',
    bottom: 4,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 14,
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
    marginHorizontal: 8,
    marginBottom: 2,
  },
});
