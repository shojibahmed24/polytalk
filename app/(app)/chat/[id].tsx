import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  ScrollView, 
  TextInput as RNTextInput,
  Keyboard
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Screen, Stack as LayoutStack, Box } from '@/components/layout';
import { Text } from '@/components/ui';
import { theme } from '@/theme';
import { SymbolView } from 'expo-symbols';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
};

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  
  // Entrance animation
  const [fadeAnim] = useState(() => new Animated.Value(0));
  const [slideAnim] = useState(() => new Animated.Value(12));
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: trimmed,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    Keyboard.dismiss(); // In a real app we might keep it open, but simple here

    // Simulate system response
    setTimeout(() => {
      const systemMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: 'AI provider is not connected yet. This is a local UI demonstration for PolyTalk. Real-time inference will be added in upcoming phases.',
      };
      setMessages(prev => [...prev, systemMessage]);
    }, 600);
  };

  const handleMicPress = () => {
    alert('Voice input is not yet implemented. Please type your message.');
  };

  const languageName = id ? id.charAt(0).toUpperCase() + id.slice(1) : 'Language';

  return (
    <Screen bg="background" edges={['top', 'bottom', 'left', 'right']} keyboardAware padded={false}>
      <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        
        {/* Custom Header */}
        <Box direction="row" align="center" style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            activeOpacity={0.7}
          >
            <SymbolView name="chevron.left" size={24} tintColor={theme.colors.textPrimary} />
          </TouchableOpacity>
          <LayoutStack style={styles.headerCenter}>
            <Text variant="heading" color="textPrimary" align="center">
              {languageName} Tutor
            </Text>
            <Box direction="row" align="center" justify="center" gap="xs">
              <View style={styles.offlineDot} />
              <Text variant="label" color="textSecondary" align="center">
                Local Interface Mode
              </Text>
            </Box>
          </LayoutStack>
          <View style={styles.headerPlaceholder} />
        </Box>

        {/* Conversation Area */}
        <ScrollView 
          ref={scrollViewRef}
          style={styles.chatArea}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <SymbolView name="bubble.left.and.bubble.right.fill" size={48} tintColor={theme.colors.secondary} />
              </View>
              <Text variant="title" color="textPrimary" align="center">
                Start the conversation
              </Text>
              <Text variant="body" color="textSecondary" align="center" style={styles.emptySub}>
                Type a message below to test the chat UI. AI responses are currently mocked locally.
              </Text>
            </View>
          ) : (
            messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <View 
                  key={msg.id} 
                  style={[
                    styles.messageBubble, 
                    isUser ? styles.messageUser : styles.messageAssistant
                  ]}
                >
                  <Text 
                    variant="body" 
                    color={isUser ? 'textInverse' : 'textPrimary'}
                  >
                    {msg.text}
                  </Text>
                </View>
              );
            })
          )}
        </ScrollView>

        {/* Composer Area */}
        <Box direction="row" align="flex-end" style={styles.composer}>
          <TouchableOpacity 
            activeOpacity={0.7} 
            onPress={handleMicPress}
            style={styles.micButton}
            accessibilityRole="button"
            accessibilityLabel="Voice input not implemented"
          >
            <SymbolView name="mic.fill" size={24} tintColor={theme.colors.textSecondary} />
          </TouchableOpacity>
          
          <View style={styles.inputWrapper}>
            <RNTextInput
              style={styles.textInput}
              placeholder="Type your message..."
              placeholderTextColor={theme.colors.textSecondary}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
          </View>
          
          <TouchableOpacity 
            activeOpacity={0.7} 
            onPress={handleSend}
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            disabled={!inputText.trim()}
            accessibilityRole="button"
            accessibilityLabel="Send message"
          >
            <SymbolView 
              name="arrow.up.circle.fill" 
              size={32} 
              tintColor={inputText.trim() ? theme.colors.primary : theme.colors.disabled} 
            />
          </TouchableOpacity>
        </Box>
        
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    maxWidth: theme.layout.contentMaxWidth,
    alignSelf: 'center',
  },
  header: {
    paddingHorizontal: theme.layout.screenPadding,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  backButton: {
    padding: theme.spacing.xs,
    marginLeft: -theme.spacing.xs,
  },
  headerCenter: {
    flex: 1,
  },
  offlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.warning,
  },
  headerPlaceholder: {
    width: 32,
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    paddingHorizontal: theme.layout.screenPadding,
    paddingVertical: theme.spacing.lg,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(139, 92, 246, 0.1)', // Secondary tint
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  emptySub: {
    marginTop: theme.spacing.sm,
  },
  messageBubble: {
    maxWidth: '85%',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: theme.spacing.md,
  },
  messageUser: {
    backgroundColor: theme.colors.primary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  messageAssistant: {
    backgroundColor: theme.colors.surfaceElevated,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  composer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  micButton: {
    padding: theme.spacing.sm,
    marginBottom: 2, // align with input field center visually
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginHorizontal: theme.spacing.xs,
    minHeight: 40,
    maxHeight: 120,
    justifyContent: 'center',
  },
  textInput: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.sizes.md,
    paddingHorizontal: theme.spacing.md,
    paddingTop: 10,
    paddingBottom: 10,
  },
  sendButton: {
    padding: theme.spacing.xs,
    marginBottom: 4,
  },
  sendButtonDisabled: {
    opacity: 0.7,
  },
});
