import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  ScrollView, 
  TextInput as RNTextInput, 
  Keyboard, 
  KeyboardAvoidingView, 
  Platform, 
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Text } from '@/components/ui';
import { ThemeContext } from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { TARGET_LANGUAGES } from '@/constants/languages';
import { supabase } from '@/utils/supabase';
import { getInterfaceLanguage } from '@/utils/languageStorage';
import { coachService } from '@/services/coach/coachService';
import { speechService } from '@/services/coach/speechService';
import { 
  CoachScenario, 
  CoachSession, 
  CoachMessage, 
  SessionSettings, 
  VocabularyItem,
  CoachSessionStats 
} from '@/services/coach/types';
import { ScenarioInfoModal } from '@/components/coach/ScenarioInfoModal';
import { SessionSettingsModal } from '@/components/coach/SessionSettingsModal';
import { VocabularyModal } from '@/components/coach/VocabularyModal';
import { SessionSummaryModal } from '@/components/coach/SessionSummaryModal';
import { PuterConnectModal } from '@/components/PuterConnectModal';
import { getStoredPuterToken, verifyPuterToken } from '@/services/puter';

export default function AIChatScreen() {
  const { isDark: isSystemDark } = React.useContext(ThemeContext);
  const { id } = useLocalSearchParams<{ id: string }>(); // Language id or scenario id
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

  // Core Coach State
  const [session, setSession] = useState<CoachSession | null>(null);
  const [scenario, setScenario] = useState<CoachScenario | null>(null);
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [suggestedReplies, setSuggestedReplies] = useState<string[]>([
    "Can I have the menu?",
    "I'll have a coffee.",
    "No, thank you, that is all."
  ]);
  const [savedVocabulary, setSavedVocabulary] = useState<VocabularyItem[]>([]);
  const [sessionStats, setSessionStats] = useState<Partial<CoachSessionStats> | null>(null);

  // Modals
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isVocabModalOpen, setIsVocabModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isPuterModalOpen, setIsPuterModalOpen] = useState(false);

  // Audio & Translation runtime state
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [translatedMessages, setTranslatedMessages] = useState<Record<string, string>>({});
  const [translatingId, setTranslatingId] = useState<string | null>(null);
  const [isVoiceInputUsed, setIsVoiceInputUsed] = useState(false);

  // User auth state
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isPuterConnected, setIsPuterConnected] = useState(true);

  // Animations
  const [micPulse] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (isListening) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(micPulse, { toValue: 1, duration: 800, useNativeDriver: true }),
          Animated.timing(micPulse, { toValue: 0, duration: 800, useNativeDriver: true })
        ])
      ).start();
    } else {
      micPulse.stopAnimation();
      micPulse.setValue(0);
    }
  }, [isListening, micPulse]);

  // Resolve active language
  const langMatch = TARGET_LANGUAGES.find(l => 
    l.englishName.toLowerCase() === (id || 'spanish').toLowerCase() ||
    l.id.toLowerCase() === (id || '').toLowerCase() ||
    l.name.toLowerCase() === (id || '').toLowerCase() ||
    l.searchAliases.some(a => a.toLowerCase() === (id || '').toLowerCase())
  );
  const languageName = langMatch ? langMatch.englishName : 'English';
  const displayLanguageName = langMatch ? (langMatch.name || langMatch.englishName) : languageName;

  // Session Settings
  const [sessionSettings, setSessionSettings] = useState<SessionSettings>({
    targetLanguage: languageName,
    nativeLanguage: 'Bengali',
    proficiencyLevel: 'A2-B1',
    conversationTopic: 'Restaurant',
    aiCharacter: 'Waiter / Server',
    voiceRate: 1.0,
    translationPreference: true,
    pronunciationAssessment: true,
    correctionIntensity: 'balanced',
    autoplayAudio: false,
  });

  // Load Session and History
  const initializeSession = useCallback(async () => {
    setIsLoadingSession(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const uid = user?.id || 'demo_learner_user';
      setCurrentUserId(uid);

      // Check Puter connection status
      const puterToken = await getStoredPuterToken(uid);
      if (puterToken) {
        const profile = await verifyPuterToken(puterToken);
        setIsPuterConnected(!!profile);
      } else {
        setIsPuterConnected(true); // Don't block roleplay, service has seamless fallback
      }

      // Read preferred native language
      const nativeLang = await getInterfaceLanguage();

      // Load scenario
      const scenarios = await coachService.getScenarios();
      const activeScenario = scenarios.find(s => s.category.toLowerCase() === 'dining') || scenarios[0];
      setScenario(activeScenario);

      // Create or restore active session
      const activeSession = await coachService.createOrGetSession(
        uid,
        activeScenario.id,
        languageName,
        'A2-B1',
        { nativeLanguage: nativeLang }
      );
      setSession(activeSession);
      setSessionSettings(activeSession.settings);

      // Load messages
      const msgs = await coachService.getSessionMessages(activeSession.id);
      setMessages(msgs);

      if (activeScenario.suggested_responses?.length > 0) {
        setSuggestedReplies(activeScenario.suggested_responses);
      }

      // Load user vocabulary
      const vocab = await coachService.getVocabulary(uid);
      setSavedVocabulary(vocab);

      // Load stats
      const stats = await coachService.getSessionStats(activeSession.id);
      setSessionStats(stats);
    } catch (err) {
      console.warn('Initialization notice:', err);
    } finally {
      setIsLoadingSession(false);
    }
  }, [id, languageName]);

  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  // Color tokens
  const st = {
    surface: isSystemDark ? '#0E1320' : '#F8F9FC',
    surfaceContainerLowest: isSystemDark ? '#090E1B' : '#FFFFFF',
    surfaceContainerLow: isSystemDark ? '#161B29' : '#F9FAFB',
    surfaceContainer: isSystemDark ? '#1A1F2D' : '#F3F4F6',
    surfaceContainerHigh: isSystemDark ? '#252A38' : '#E5E7EB',
    surfaceContainerHighest: isSystemDark ? '#303443' : '#D1D5DB',
    surfaceVariant: isSystemDark ? '#303443' : '#E2E8F0',
    onSurface: isSystemDark ? '#DEE2F5' : '#111827',
    onSurfaceVariant: isSystemDark ? '#BCC9CD' : '#6B7280',
    primary: isSystemDark ? '#4CD7F6' : '#06B6D4',
    primaryContainer: isSystemDark ? '#003640' : '#E0F2FE',
    onPrimaryContainer: isSystemDark ? '#4CD7F6' : '#0369A1',
    secondary: isSystemDark ? '#D0BCFF' : '#8B5CF6',
    secondaryContainer: isSystemDark ? '#4A3382' : '#EDE9FE',
    tertiaryContainer: isSystemDark ? '#F2B8B5' : '#FFE4E6',
    onTertiaryContainer: isSystemDark ? '#601410' : '#BE123C',
    error: isSystemDark ? '#FFB4AB' : '#EF4444',
    errorContainer: isSystemDark ? '#93000A' : '#FEE2E2',
    outline: isSystemDark ? '#869397' : '#9CA3AF',
    divider: isSystemDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
  };

  // Send message handler
  const handleSend = async (customText?: string) => {
    const textToSend = (customText !== undefined ? customText : inputText).trim();
    if (!textToSend || isSending || !session) return;

    if (!customText) {
      setInputText('');
      Keyboard.dismiss();
    }

    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    }

    const wasVoice = isVoiceInputUsed;
    setIsVoiceInputUsed(false);
    setIsSending(true);

    const tempId = `temp_${Date.now()}`;
    const optimisticUserMsg: CoachMessage = {
      id: tempId,
      session_id: session.id,
      user_id: currentUserId || 'user',
      role: 'user',
      content: textToSend,
      input_type: wasVoice ? 'voice' : 'text',
      created_at: new Date().toISOString(),
      isSending: true,
    };

    setMessages(prev => [...prev, optimisticUserMsg]);
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 50);

    try {
      const response = await coachService.sendMessage(session.id, {
        content: textToSend,
        inputType: wasVoice ? 'voice' : 'text',
        language: session.target_language,
        idempotencyKey: `user_${tempId}`,
      });

      // Update optimistic user message and append AI message
      setMessages(prev => [
        ...prev.map(m => m.id === tempId ? response.userMessage : m),
        response.aiMessage,
      ]);

      if (response.suggestedResponses && response.suggestedResponses.length > 0) {
        setSuggestedReplies(response.suggestedResponses);
      }

      // Autoplay AI voice if enabled
      if (sessionSettings.autoplayAudio && speechService.isSpeechSynthesisSupported()) {
        speechService.speak(response.aiMessage.content, {
          language: session.target_language,
          rate: sessionSettings.voiceRate,
        });
      }

      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (err: any) {
      console.warn('Send error:', err);
      setMessages(prev => prev.map(m => m.id === tempId ? { ...m, isSending: false, isError: true } : m));
    } finally {
      setIsSending(false);
    }
  };

  // Microphone toggle handler
  const handleMic = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      setIsVoiceInputUsed(true);
      const started = speechService.startListening({
        language: sessionSettings.targetLanguage,
        onInterimResult: (transcript) => {
          setInputText(transcript);
        },
        onFinalResult: (finalTranscript) => {
          setInputText(finalTranscript);
          setIsListening(false);
        },
        onError: (errMsg) => {
          console.warn('Mic error:', errMsg);
          setIsListening(false);
        },
        onEnd: () => {
          setIsListening(false);
        },
      });
      if (started) {
        setIsListening(true);
      }
    }
  };

  // Text-To-Speech Playback
  const handleTogglePlayAudio = (messageId: string, text: string) => {
    if (playingMessageId === messageId) {
      speechService.stopSpeaking();
      setPlayingMessageId(null);
    } else {
      setPlayingMessageId(messageId);
      speechService.speak(text, {
        language: sessionSettings.targetLanguage,
        rate: sessionSettings.voiceRate,
        onEnd: () => setPlayingMessageId(null),
        onError: () => setPlayingMessageId(null),
      });
    }
  };

  // On-demand Translation
  const handleToggleTranslate = async (messageId: string) => {
    if (translatedMessages[messageId]) {
      // Toggle off
      setTranslatedMessages(prev => {
        const copy = { ...prev };
        delete copy[messageId];
        return copy;
      });
      return;
    }

    setTranslatingId(messageId);
    try {
      const translated = await coachService.translateMessage(messageId, sessionSettings.nativeLanguage);
      setTranslatedMessages(prev => ({ ...prev, [messageId]: translated }));
    } catch (e) {
      console.warn('Translation failed:', e);
    } finally {
      setTranslatingId(null);
    }
  };

  // Save Vocabulary Item
  const handleSaveWord = async (word: string, translation: string, contextSentence?: string) => {
    if (!currentUserId) return;
    try {
      const saved = await coachService.saveVocabulary(
        currentUserId,
        word,
        translation,
        contextSentence,
        sessionSettings.targetLanguage
      );
      setSavedVocabulary(prev => [saved, ...prev]);
    } catch {}
  };

  // Retry failed message
  const handleRetry = (msg: CoachMessage) => {
    setMessages(prev => prev.filter(m => m.id !== msg.id));
    handleSend(msg.content);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: st.surface }}>
      <View style={[styles.outerContainer, { backgroundColor: st.surface }]}>
        
        {/* Header */}
        <View style={[styles.header, { backgroundColor: isSystemDark ? 'rgba(14,19,32,0.85)' : 'rgba(248,249,252,0.85)', borderBottomColor: st.divider }]}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn} accessibilityLabel="Back">
                <MaterialIcons name="arrow-back" size={24} color={st.onSurface} />
              </TouchableOpacity>
              
              <View style={styles.aiAvatarWrap}>
                <LinearGradient colors={[st.primaryContainer, st.primary, st.secondary]} style={styles.aiAvatarGradient}>
                  <View style={[styles.aiAvatarInner, { backgroundColor: st.surfaceContainer }]}>
                    <MaterialIcons name="auto-awesome" size={20} color={st.primary} />
                  </View>
                </LinearGradient>
                <View style={[styles.statusDot, { backgroundColor: st.primary, borderColor: st.surface }]} />
              </View>

              <View style={{ justifyContent: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 18, fontWeight: '600', color: st.onSurface }}>AI Language Coach</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                  <Text style={{ fontSize: 12, color: st.onSurfaceVariant }} numberOfLines={1}>
                    Practicing {displayLanguageName} • {scenario?.category || 'Restaurant'}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.headerRight}>
              <TouchableOpacity onPress={() => setIsSettingsModalOpen(true)} style={styles.iconBtn} accessibilityLabel="Session Settings">
                <MaterialIcons name="tune" size={24} color={st.onSurface} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/(tabs)/profile')} style={[styles.userAvatar, { backgroundColor: st.primary }]} accessibilityLabel="Profile">
                <MaterialIcons name="person" size={18} color={isSystemDark ? '#003640' : '#FFFFFF'} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Main Keyboard Avoiding View */}
        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView 
            ref={scrollViewRef}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          >
            {/* Scenario Banner */}
            <View style={[styles.scenarioBanner, { backgroundColor: st.surfaceContainerLow }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                <View style={[styles.scenarioIconWrap, { backgroundColor: isSystemDark ? 'rgba(76,215,246,0.1)' : '#E0F2FE' }]}>
                  <MaterialIcons name="restaurant" size={20} color={st.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={{ fontSize: 10, fontWeight: '700', color: st.primary, textTransform: 'uppercase', letterSpacing: 0.5 }}>ROLEPLAY SCENARIO</Text>
                    <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: st.primary, opacity: 0.4 }} />
                    <Text style={{ fontSize: 10, color: st.onSurfaceVariant }}>Level: {scenario?.proficiency_levels?.join('-') || 'A2-B1'}</Text>
                  </View>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: st.onSurface, marginTop: 2 }}>
                    {scenario?.title || 'Ordering at a Diner & Bistro'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setIsScenarioModalOpen(true)} style={[styles.scenarioInfoBtn, { backgroundColor: st.surfaceContainer }]} accessibilityLabel="Scenario Info">
                <MaterialIcons name="info" size={18} color={st.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            {/* Timeline */}
            <View style={styles.timelineRow}>
              <View style={[styles.timelineLine, { backgroundColor: st.surfaceContainerHigh }]} />
              <Text style={{ fontSize: 11, color: st.outline, paddingHorizontal: 10, backgroundColor: st.surface }}>Today, 10:24 AM</Text>
              <View style={[styles.timelineLine, { backgroundColor: st.surfaceContainerHigh }]} />
            </View>

            {/* Empty state / Welcome */}
            {messages.length === 0 && !isLoadingSession && (
              <View style={[styles.welcomeCard, { backgroundColor: st.surfaceContainerLow }]}>
                <MaterialIcons name="forum" size={32} color={st.primary} style={{ alignSelf: 'center', marginBottom: 8 }} />
                <Text style={{ fontSize: 15, fontWeight: '700', color: st.onSurface, textAlign: 'center' }}>
                  Welcome to {scenario?.title}!
                </Text>
                <Text style={{ fontSize: 13, color: st.onSurfaceVariant, textAlign: 'center', marginTop: 4, lineHeight: 18 }}>
                  Your coach is ready as the {scenario?.ai_role}. Send your first greeting or tap one of the suggested starters below!
                </Text>
              </View>
            )}

            {/* Messages */}
            {messages.map(msg => {
              const isUser = msg.role === 'user';
              const isPlaying = playingMessageId === msg.id;
              const translation = translatedMessages[msg.id];
              const isTranslating = translatingId === msg.id;

              if (isUser) {
                return (
                  <View key={msg.id} style={styles.userMsgRow}>
                    <View style={{ flex: 1, alignItems: 'flex-end', minWidth: 0 }}>
                      <LinearGradient
                        colors={[st.primaryContainer, st.secondaryContainer]}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                        style={[styles.userBubble, msg.isError && { borderColor: st.error, borderWidth: 1 }]}
                      >
                        <Text style={{ fontSize: 15, color: '#FFFFFF', fontWeight: '500', lineHeight: 22 }}>
                          {msg.content}
                        </Text>
                        
                        {/* Pronunciation Assessment Badge */}
                        {msg.pronunciation_score !== null && msg.pronunciation_score !== undefined && (
                          <View style={styles.pronunBadge}>
                            <MaterialIcons name="record-voice-over" size={12} color="#FFFFFF" />
                            <Text style={{ fontSize: 10, fontWeight: '700', color: '#FFFFFF', marginLeft: 4 }}>
                              Pronunciation: {msg.pronunciation_score}%
                            </Text>
                          </View>
                        )}

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: 4 }}>
                          <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Text>
                          {msg.isSending ? (
                            <ActivityIndicator size="small" color="#FFFFFF" style={{ transform: [{ scale: 0.6 }] }} />
                          ) : msg.isError ? (
                            <TouchableOpacity onPress={() => handleRetry(msg)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <MaterialIcons name="error-outline" size={14} color={st.error} />
                              <Text style={{ fontSize: 10, color: st.error, marginLeft: 2 }}>Retry</Text>
                            </TouchableOpacity>
                          ) : (
                            <MaterialIcons name="done-all" size={14} color={st.primary} />
                          )}
                        </View>
                      </LinearGradient>
                    </View>
                    <View style={[styles.userMiniAvatar, { backgroundColor: st.surfaceContainerHighest }]}>
                      <MaterialIcons name="person" size={16} color={st.onSurfaceVariant} />
                    </View>
                  </View>
                );
              } else {
                return (
                  <View key={msg.id} style={styles.aiMsgRow}>
                    <View style={styles.aiMiniAvatarWrap}>
                      <LinearGradient colors={[st.primaryContainer, st.secondary]} style={styles.aiMiniAvatarGradient}>
                        <View style={[styles.aiMiniAvatarInner, { backgroundColor: st.surfaceContainer }]}>
                          <MaterialIcons name="auto-awesome" size={14} color={st.primary} />
                        </View>
                      </LinearGradient>
                    </View>
                    
                    <View style={{ flex: 1 }}>
                      <View style={[styles.aiBubble, { backgroundColor: st.surfaceContainer }]}>
                        <Text style={{ fontSize: 15, color: st.onSurface, lineHeight: 22 }}>
                          {msg.content}
                        </Text>

                        {/* Inline Translated Text */}
                        {translation && (
                          <View style={[styles.translationWrap, { backgroundColor: st.surfaceContainerHigh }]}>
                            <MaterialIcons name="translate" size={14} color={st.primary} />
                            <Text style={{ fontSize: 13, color: st.onSurfaceVariant, marginLeft: 6, flex: 1 }}>
                              {translation}
                            </Text>
                          </View>
                        )}
                        
                        <View style={[styles.aiBubbleActions, { borderTopColor: isSystemDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Text style={{ fontSize: 11, color: st.onSurfaceVariant }}>
                              {scenario?.ai_role || 'AI Waiter'} • London
                            </Text>
                          </View>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            {/* TTS Button */}
                            <TouchableOpacity 
                              onPress={() => handleTogglePlayAudio(msg.id, msg.content)} 
                              style={[styles.aiActionBtn, { backgroundColor: isPlaying ? st.primary : st.surfaceContainerHigh }]}
                              accessibilityLabel="Listen to audio"
                            >
                              <MaterialIcons name={isPlaying ? "stop" : "volume-up"} size={14} color={isPlaying ? '#090E1B' : st.primary} />
                            </TouchableOpacity>

                            {/* Translate Button */}
                            <TouchableOpacity 
                              onPress={() => handleToggleTranslate(msg.id)} 
                              style={[styles.aiActionBtn, { backgroundColor: translation ? st.primaryContainer : st.surfaceContainerHigh }]}
                              accessibilityLabel="Translate message"
                            >
                              {isTranslating ? (
                                <ActivityIndicator size="small" color={st.primary} style={{ transform: [{ scale: 0.6 }] }} />
                              ) : (
                                <MaterialIcons name="translate" size={14} color={translation ? st.primary : st.onSurfaceVariant} />
                              )}
                            </TouchableOpacity>

                            {/* Bookmark / Vocab Button */}
                            <TouchableOpacity 
                              onPress={() => handleSaveWord(msg.content.slice(0, 30), 'Phrase from roleplay', msg.content)} 
                              style={[styles.aiActionBtn, { backgroundColor: st.surfaceContainerHigh }]}
                              accessibilityLabel="Save word"
                            >
                              <MaterialIcons name="bookmark-border" size={14} color={st.onSurfaceVariant} />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>

                      {/* Pedagogical Correction Module */}
                      {(msg.correction || msg.explanation) && (
                        <View style={[styles.pedoModule, { backgroundColor: st.surfaceContainerLow }]}>
                          <LinearGradient colors={[st.primary, st.secondary]} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.pedoGlowBar} />
                          
                          <View style={styles.pedoHeader}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                              <View style={[styles.pedoIcon, { backgroundColor: isSystemDark ? 'rgba(242,184,181,0.1)' : 'rgba(255,228,230,0.4)' }]}>
                                <MaterialIcons name="tips-and-updates" size={14} color={st.tertiaryContainer} />
                              </View>
                              <Text style={{ fontSize: 13, fontWeight: '700', color: st.onSurface }}>Grammar & Phrasing Coach</Text>
                            </View>
                            <View style={[styles.xpBadge, { backgroundColor: isSystemDark ? 'rgba(74,51,130,0.4)' : '#EDE9FE' }]}>
                              <Text style={{ fontSize: 10, fontWeight: '600', color: st.secondary }}>+10 Fluency XP</Text>
                            </View>
                          </View>

                          {msg.correction && (
                            <View style={[styles.comparisonCard, { backgroundColor: isSystemDark ? 'rgba(9,14,27,0.7)' : '#FFFFFF' }]}>
                              <View style={styles.compareRow}>
                                <Text style={[styles.compareLabel, { color: st.primary }]}>NATURAL</Text>
                                <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                  <View style={[styles.betterWrap, { backgroundColor: isSystemDark ? 'rgba(76,215,246,0.15)' : 'rgba(6,182,212,0.15)' }]}>
                                    <Text style={[styles.betterText, { color: st.primary }]}>{msg.correction}</Text>
                                  </View>
                                </View>
                              </View>
                            </View>
                          )}

                          {msg.explanation && (
                            <Text style={{ fontSize: 13, color: st.onSurfaceVariant, marginTop: 8, lineHeight: 18 }}>
                              {msg.explanation}
                            </Text>
                          )}
                        </View>
                      )}
                      
                      <Text style={{ fontSize: 10, color: st.onSurfaceVariant, marginLeft: 4, marginTop: 4 }}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                  </View>
                );
              }
            })}

            {/* AI Typing Indicator */}
            {isSending && (
              <View style={styles.aiMsgRow}>
                <View style={styles.aiMiniAvatarWrap}>
                  <View style={[styles.aiMiniAvatarInner, { backgroundColor: st.surfaceContainer }]}>
                    <ActivityIndicator size="small" color={st.primary} />
                  </View>
                </View>
                <View style={[styles.aiBubble, { backgroundColor: st.surfaceContainer, paddingVertical: 12, paddingHorizontal: 16 }]}>
                  <Text style={{ fontSize: 13, color: st.onSurfaceVariant, fontStyle: 'italic' }}>
                    {scenario?.ai_role || 'AI Waiter'} is responding...
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Bottom Message Composer Area */}
          <View style={[styles.inputArea, { backgroundColor: st.surface, borderTopColor: st.divider }]}>
            
            {/* Suggested Responses Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionsList}>
              {suggestedReplies.map((sugg, idx) => (
                <TouchableOpacity
                  key={idx}
                  disabled={isSending}
                  onPress={() => handleSend(sugg)}
                  style={[
                    styles.suggestionChip, 
                    { backgroundColor: st.surfaceContainerHigh },
                    isSending && { opacity: 0.5 }
                  ]}
                  accessibilityRole="button"
                >
                  <Text style={{ fontSize: 13, color: st.onSurface }}>"{sugg}"</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Input Row */}
            <View style={styles.inputRow}>
              {/* Plus Button: Quick Actions */}
              <TouchableOpacity 
                onPress={() => setIsVocabModalOpen(true)} 
                style={[styles.addBtn, { backgroundColor: st.surfaceContainer }]}
                accessibilityLabel="Vocabulary and Actions"
              >
                <MaterialIcons name="add-circle" size={20} color={st.onSurfaceVariant} />
              </TouchableOpacity>
              
              {/* Capsule Text Input */}
              <View style={[styles.inputCapsule, { backgroundColor: st.surfaceContainerLow }]}>
                <RNTextInput
                  style={[styles.textInput, { color: st.onSurface }]}
                  placeholder={`Type your response in ${sessionSettings.targetLanguage}...`}
                  placeholderTextColor={st.outline}
                  value={inputText}
                  onChangeText={setInputText}
                  onSubmitEditing={() => handleSend()}
                  returnKeyType="send"
                  multiline={false}
                />
                <TouchableOpacity onPress={() => handleSend(inputText)} style={{ padding: 4 }}>
                  <MaterialIcons name="g-translate" size={18} color={st.onSurfaceVariant} />
                </TouchableOpacity>
              </View>

              {/* Microphone Speaking Practice Button */}
              <TouchableOpacity 
                onPress={handleMic}
                style={[
                  styles.micBtn, 
                  { backgroundColor: st.surfaceContainerHigh },
                  isListening && { backgroundColor: st.primaryContainer }
                ]}
                accessibilityLabel="Voice Input"
              >
                <MaterialIcons name="mic" size={22} color={isListening ? st.onPrimaryContainer : st.primary} />
                <Animated.View style={[styles.micPulseRing, { opacity: micPulse, backgroundColor: st.primary }]} />
              </TouchableOpacity>

              {/* Send Button */}
              <TouchableOpacity 
                onPress={() => handleSend()} 
                disabled={isSending || !inputText.trim()}
                style={[styles.sendBtnWrap, (!inputText.trim() || isSending) && { opacity: 0.6 }]}
                accessibilityLabel="Send message"
              >
                <LinearGradient colors={[st.primary, st.secondary]} start={{x:0, y:1}} end={{x:1, y:0}} style={styles.sendBtn}>
                  <MaterialIcons name="arrow-upward" size={20} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Footnote */}
            <View style={styles.footnote}>
              <MaterialIcons name="graphic-eq" size={13} color={st.primary} />
              <Text style={{ fontSize: 11, color: st.onSurfaceVariant, marginLeft: 6 }}>
                Tap mic to speak • Real-time pronunciation grading active
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>

        {/* Modals */}
        <ScenarioInfoModal
          visible={isScenarioModalOpen}
          scenario={scenario}
          onClose={() => setIsScenarioModalOpen(false)}
          isDark={isSystemDark}
        />

        <SessionSettingsModal
          visible={isSettingsModalOpen}
          settings={sessionSettings}
          onSave={(newSettings) => {
            setSessionSettings(newSettings);
            if (session) {
              coachService.createOrGetSession(
                currentUserId || 'user',
                scenario?.id,
                newSettings.targetLanguage,
                newSettings.proficiencyLevel,
                newSettings
              );
            }
          }}
          onClose={() => setIsSettingsModalOpen(false)}
          isDark={isSystemDark}
        />

        <VocabularyModal
          visible={isVocabModalOpen}
          items={savedVocabulary}
          onClose={() => setIsVocabModalOpen(false)}
          isDark={isSystemDark}
        />

        <SessionSummaryModal
          visible={isSummaryModalOpen}
          stats={sessionStats}
          avgPronunciationScore={88}
          onClose={() => setIsSummaryModalOpen(false)}
          isDark={isSystemDark}
        />

        <PuterConnectModal
          visible={isPuterModalOpen}
          onClose={() => setIsPuterModalOpen(false)}
          onConnected={() => setIsPuterConnected(true)}
          userId={currentUserId}
          isDark={isSystemDark}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 44 : 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 64,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiAvatarWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  aiAvatarGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    padding: 2,
  },
  aiAvatarInner: {
    flex: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  scenarioBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    marginBottom: 20,
  },
  scenarioIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scenarioInfoBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  timelineLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  welcomeCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  userMsgRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginBottom: 16,
    gap: 8,
  },
  userBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomRightRadius: 4,
    maxWidth: '85%',
  },
  pronunBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  userMiniAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  aiMsgRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 10,
  },
  aiMiniAvatarWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginTop: 4,
  },
  aiMiniAvatarGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
    padding: 1.5,
  },
  aiMiniAvatarInner: {
    flex: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiBubble: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    borderRadius: 20,
    borderTopLeftRadius: 4,
  },
  aiBubbleActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  aiActionBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  translationWrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  pedoModule: {
    marginTop: 10,
    padding: 12,
    borderRadius: 14,
    overflow: 'hidden',
  },
  pedoGlowBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  pedoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  pedoIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  xpBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  comparisonCard: {
    padding: 10,
    borderRadius: 10,
    marginTop: 6,
  },
  compareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  compareLabel: {
    fontSize: 9,
    fontWeight: '700',
    width: 54,
  },
  betterWrap: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  betterText: {
    fontSize: 13,
    fontWeight: '600',
  },
  inputArea: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  suggestionsList: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 10,
  },
  suggestionChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputCapsule: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 14,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    paddingRight: 6,
  },
  micBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micPulseRing: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 26,
    zIndex: -1,
  },
  sendBtnWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  sendBtn: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footnote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
});
