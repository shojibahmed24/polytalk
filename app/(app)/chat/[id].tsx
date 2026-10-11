import React, { useState, useRef, useEffect } from 'react';
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
  SafeAreaView
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Text } from '@/components/ui';
import { ThemeContext } from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { TARGET_LANGUAGES } from '@/constants/languages';
import { supabase } from '@/utils/supabase';
import { getInterfaceLanguage } from '@/utils/languageStorage';
import { requestAIResponse } from '@/services/ai';
import { PuterConnectModal } from '@/components/PuterConnectModal';
import { getStoredPuterToken, verifyPuterToken, PuterProfile } from '@/services/puter';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  pedagogical?: {
    type: string;
    xp: number;
    originalHtml: string;
    betterHtml: string;
    explanation: string;
  };
};

export default function AIChatScreen() {
  const { isDark: isSystemDark } = React.useContext(ThemeContext);
  const { id } = useLocalSearchParams<{ id: string }>(); // This will be the language name in lowercase e.g., 'spanish'
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

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

  // Find actual language object or fallback
  const langMatch = TARGET_LANGUAGES.find(l => 
    l.englishName.toLowerCase() === (id || 'spanish').toLowerCase() ||
    l.id.toLowerCase() === (id || '').toLowerCase() ||
    l.name.toLowerCase() === (id || '').toLowerCase() ||
    l.searchAliases.some(a => a.toLowerCase() === (id || '').toLowerCase())
  );
  const languageName = langMatch ? langMatch.englishName : 'Language';
  const displayLanguageName = langMatch ? (langMatch.name || langMatch.englishName) : languageName;
  
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
    primaryContainer: isSystemDark ? '#003640' : '#E0F2FE', // Adjusted for better dark contrast
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

  

  

  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isPuterConnected, setIsPuterConnected] = useState(false);
  const [isPuterModalOpen, setIsPuterModalOpen] = useState(false);
  const [suggestedReplies, setSuggestedReplies] = useState<string[]>([]);

  useEffect(() => {
    async function loadOrCreateConversation() {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return; // Unauthenticated
        setCurrentUserId(user.id);

        // Check if Puter token is stored
        const token = await getStoredPuterToken(user.id);
        if (token) {
          const profile = await verifyPuterToken(token);
          setIsPuterConnected(!!profile);
        } else {
          setIsPuterConnected(false);
        }

        let targetId = id;
        
        // If id is not a uuid, it might be a language name
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetId);
        
        if (!isUUID) {
          // Find or create an active conversation for this language
          const targetLang = (id || 'spanish').toLowerCase();
          const { data: existing } = await supabase
            .from('conversations')
            .select('id')
            .eq('user_id', user.id)
            .eq('target_language', targetLang)
            .eq('status', 'active')
            .limit(1)
            .single();

          if (existing) {
            targetId = existing.id;
          } else {
            // Create new
            const { data: newConv } = await supabase
              .from('conversations')
              .insert({
                user_id: user.id,
                target_language: targetLang,
                difficulty: 'A1',
                status: 'active'
              })
              .select('id')
              .single();
            if (newConv) targetId = newConv.id;
          }
        }
        
        if (targetId) {
          setConversationId(targetId);
          // Load messages
          const { data: msgs } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', targetId)
            .order('created_at', { ascending: true });
          
          if (msgs) {
            setMessages(msgs.map(m => ({
              id: m.id,
              role: m.role,
              text: m.content,
              timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              pedagogical: m.pedagogical_type ? {
                type: m.pedagogical_type,
                xp: m.pedagogical_xp,
                originalHtml: m.original_html,
                betterHtml: m.better_html,
                explanation: '' // Optional logic
              } : undefined
            })));
          }
        }
      } catch (err) {
        console.warn('Load conversation err:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrCreateConversation();
  }, [id]);

  const handleSend = async () => {
    if (!inputText.trim() || isSending || !conversationId) return;
    const textToSend = inputText.trim();
    setInputText('');
    Keyboard.dismiss();
    setIsSending(true);

    if (!isPuterConnected) {
      setIsPuterModalOpen(true);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setIsSending(false);
      return;
    }

    // Insert user message locally
    const tempId = Date.now().toString();
    const newMsg: Message = {
      id: tempId,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMsg]);

    try {
      // Persist user message to DB
      const { data: insertedUserMsg } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          user_id: user.id,
          role: 'user',
          content: textToSend
        })
        .select('id')
        .single();
        
      if (insertedUserMsg) {
        setMessages(prev => prev.map(m => m.id === tempId ? { ...m, id: insertedUserMsg.id } : m));
      }

      // Request AI response via Puter
      const ifaceLang = await getInterfaceLanguage();
      const aiRes = await requestAIResponse(conversationId, textToSend, {
        targetLanguage: languageName,
        difficulty: 'B2',
        interfaceLanguage: ifaceLang,
        userId: user.id,
      });

      if (aiRes.needsPuterAuth) {
        setIsPuterConnected(false);
        setIsPuterModalOpen(true);
      }
      
      if (aiRes.error) {
        // Fallback for missing AI / error
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_err',
          role: 'assistant',
          text: aiRes.error || 'Unknown error',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        // Valid response
        const { data: insertedAiMsg } = await supabase
          .from('messages')
          .insert({
            conversation_id: conversationId,
            user_id: user.id, // technically assistant message owned by user for rls
            role: 'assistant',
            content: aiRes.reply,
            pedagogical_type: aiRes.pedagogical?.type,
            pedagogical_xp: aiRes.pedagogical?.xp,
            original_html: aiRes.pedagogical?.originalHtml,
            better_html: aiRes.pedagogical?.betterHtml
          })
          .select('id')
          .single();

        setMessages(prev => [...prev, {
          id: insertedAiMsg?.id || Date.now().toString() + '_ai',
          role: 'assistant',
          text: aiRes.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          pedagogical: aiRes.pedagogical
        }]);

        if (aiRes.suggestedReplies && aiRes.suggestedReplies.length > 0) {
          setSuggestedReplies(aiRes.suggestedReplies);
        }

        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch (err) {
      console.warn('Send error:', err);
    } finally {
      setIsSending(false);
    }
  };


  const handleMic = () => {
    setIsListening(prev => !prev);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: st.surface }}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isSystemDark ? 'rgba(14,19,32,0.85)' : 'rgba(248,249,252,0.85)', borderBottomColor: st.divider }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
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
                  Practicing {displayLanguageName} • Restaurant
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBtn}>
              <MaterialIcons name="tune" size={24} color={st.onSurface} />
            </TouchableOpacity>
            <View style={[styles.userAvatar, { backgroundColor: st.primary }]}>
              <MaterialIcons name="person" size={18} color={isSystemDark ? '#003640' : '#FFFFFF'} />
            </View>
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
              <View style={[styles.scenarioIconWrap, { backgroundColor: st.surfaceContainer }]}>
                <MaterialIcons name="restaurant" size={18} color={st.primary} />
              </View>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: st.primary, textTransform: 'uppercase' }}>Roleplay Scenario</Text>
                  <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: st.primary, opacity: 0.4 }} />
                  <Text style={{ fontSize: 10, color: st.onSurfaceVariant }}>Level: A2-B1</Text>
                </View>
                <Text style={{ fontSize: 15, fontWeight: '600', color: st.onSurface }}>Ordering at a Diner & Bistro</Text>
              </View>
            </View>
            <TouchableOpacity style={[styles.scenarioInfoBtn, { backgroundColor: st.surfaceContainer }]}>
              <MaterialIcons name="info" size={18} color={st.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          {/* Timeline */}
          <View style={styles.timelineRow}>
            <View style={[styles.timelineLine, { backgroundColor: st.surfaceContainerHigh }]} />
            <Text style={{ fontSize: 11, color: st.outline, paddingHorizontal: 8, backgroundColor: st.surface }}>Today, 10:24 AM</Text>
            <View style={[styles.timelineLine, { backgroundColor: st.surfaceContainerHigh }]} />
          </View>

          {/* Messages */}
          {messages.map(msg => {
            const isUser = msg.role === 'user';

            if (isUser) {
              return (
                <View key={msg.id} style={styles.userMsgRow}>
                  <View style={{ flex: 1, alignItems: 'flex-end', minWidth: 0 }}>
                    <LinearGradient
                      colors={[st.primaryContainer, st.secondaryContainer]}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                      style={styles.userBubble}
                    >
                      <Text style={{ fontSize: 15, color: '#FFFFFF', fontWeight: '500', lineHeight: 22 }}>
                        {msg.text}
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: 4 }}>
                        <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>{msg.timestamp}</Text>
                        <MaterialIcons name="done-all" size={14} color={st.primary} />
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
                        {msg.text}
                      </Text>
                      
                      <View style={[styles.aiBubbleActions, { borderTopColor: isSystemDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <Text style={{ fontSize: 11, color: st.onSurfaceVariant }}>AI Waiter • London</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <TouchableOpacity style={[styles.aiActionBtn, { backgroundColor: st.surfaceContainerHigh }]}>
                            <MaterialIcons name="volume-up" size={14} color={st.primary} />
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.aiActionBtn, { backgroundColor: st.surfaceContainerHigh }]}>
                            <MaterialIcons name="translate" size={14} color={st.onSurfaceVariant} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>

                    {/* Pedagogical Module */}
                    {msg.pedagogical && (
                      <View style={[styles.pedoModule, { backgroundColor: st.surfaceContainerLow }]}>
                        <LinearGradient colors={[st.primary, st.secondary]} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.pedoGlowBar} />
                        
                        <View style={styles.pedoHeader}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <View style={[styles.pedoIcon, { backgroundColor: isSystemDark ? 'rgba(242,184,181,0.1)' : 'rgba(255,228,230,0.4)' }]}>
                              <MaterialIcons name="tips-and-updates" size={14} color={st.tertiaryContainer} />
                            </View>
                            <Text style={{ fontSize: 13, fontWeight: '700', color: st.onSurface }}>{msg.pedagogical.type}</Text>
                          </View>
                          <View style={[styles.xpBadge, { backgroundColor: isSystemDark ? 'rgba(74,51,130,0.4)' : '#EDE9FE' }]}>
                            <Text style={{ fontSize: 10, fontWeight: '600', color: st.secondary }}>+{msg.pedagogical.xp} Fluency XP</Text>
                          </View>
                        </View>

                        <View style={[styles.comparisonCard, { backgroundColor: isSystemDark ? 'rgba(9,14,27,0.7)' : '#FFFFFF' }]}>
                          <View style={styles.compareRow}>
                            <Text style={[styles.compareLabel, { color: st.error }]}>ORIGINAL</Text>
                            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                              <View style={[styles.errorWrap, { backgroundColor: st.errorContainer }]}>
                                <Text style={[styles.errorText, { color: st.error }]}>{msg.pedagogical.originalHtml}</Text>
                              </View>
                            </View>
                          </View>

                          <View style={[styles.compareRow, { marginTop: 8 }]}>
                            <Text style={[styles.compareLabel, { color: st.primary }]}>BETTER</Text>
                            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                              <View style={[styles.betterWrap, { backgroundColor: isSystemDark ? 'rgba(76,215,246,0.15)' : 'rgba(6,182,212,0.15)' }]}>
                                <Text style={[styles.betterText, { color: st.primary }]}>{msg.pedagogical.betterHtml}</Text>
                              </View>
                            </View>
                          </View>
                        </View>

                        <Text style={{ fontSize: 13, color: st.onSurfaceVariant, marginTop: 8 }}>
                          {msg.pedagogical.explanation}
                        </Text>
                      </View>
                    )}
                    
                    <Text style={{ fontSize: 10, color: st.onSurfaceVariant, marginLeft: 4, marginTop: 4 }}>{msg.timestamp}</Text>
                  </View>
                </View>
              );
            }
          })}
        </ScrollView>

        {/* Input Area */}
        <View style={[styles.inputArea, { backgroundColor: st.surface, borderTopColor: st.divider }]}>
          
          {/* Puter Connect Banner */}
          {!isPuterConnected && (
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              paddingVertical: 10,
              backgroundColor: isSystemDark ? 'rgba(76,215,246,0.1)' : 'rgba(6,182,212,0.1)',
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderBottomColor: st.divider,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, marginRight: 8 }}>
                <MaterialIcons name="auto-awesome" size={18} color={st.primary} />
                <Text style={{ fontSize: 12, color: st.onSurface, flex: 1 }} numberOfLines={2}>
                  Connect Puter account to unlock AI conversation & coaching
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsPuterModalOpen(true)}
                style={{
                  backgroundColor: st.primary,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 6,
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#003640' }}>Connect</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Suggestions */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionsList}>
            {(suggestedReplies.length > 0
              ? suggestedReplies
              : ["Can I have the menu?", "I'll have a coffee.", "No, that is all for now."]
            ).map((sugg, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => setInputText(sugg)}
                style={[styles.suggestionChip, { backgroundColor: st.surfaceContainerHigh }]}
              >
                <Text style={{ fontSize: 13, color: st.onSurface }}>"{sugg}"</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Input Row */}
          <View style={styles.inputRow}>
            <TouchableOpacity style={[styles.addBtn, { backgroundColor: st.surfaceContainer }]}>
              <MaterialIcons name="add-circle" size={20} color={st.onSurfaceVariant} />
            </TouchableOpacity>
            
            <View style={[styles.inputCapsule, { backgroundColor: st.surfaceContainerLow }]}>
              <RNTextInput
                style={[styles.textInput, { color: st.onSurface }]}
                placeholder="Type your response in English..."
                placeholderTextColor={st.outline}
                value={inputText}
                onChangeText={setInputText}
              />
              <TouchableOpacity>
                <MaterialIcons name="g-translate" size={18} color={st.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              onPress={handleMic}
              style={[
                styles.micBtn, 
                { backgroundColor: st.surfaceContainerHigh },
                isListening && { backgroundColor: st.primaryContainer }
              ]}
            >
              <MaterialIcons name="mic" size={22} color={isListening ? st.onPrimaryContainer : st.primary} />
              <Animated.View style={[styles.micPulseRing, { opacity: micPulse, backgroundColor: st.primary }]} />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSend} style={styles.sendBtnWrap}>
              <LinearGradient colors={[st.primary, st.secondary]} start={{x:0, y:1}} end={{x:1, y:0}} style={styles.sendBtn}>
                <MaterialIcons name="arrow-upward" size={20} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Footnote */}
          <View style={styles.footnote}>
            <MaterialIcons name="graphic-eq" size={13} color={st.primary} />
            <Text style={{ fontSize: 11, color: st.onSurfaceVariant, marginLeft: 6 }}>Tap mic to speak • Real-time pronunciation grading active</Text>
          </View>
        </View>
      </KeyboardAvoidingView>

      <PuterConnectModal
        visible={isPuterModalOpen}
        onClose={() => setIsPuterModalOpen(false)}
        onConnected={(profile) => {
          setIsPuterConnected(true);
        }}
        userId={currentUserId}
        isDark={isSystemDark}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
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
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  scenarioBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  scenarioIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
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
    marginVertical: 16,
  },
  timelineLine: {
    flex: 1,
    height: 1,
  },
  userMsgRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    gap: 12,
    marginBottom: 20,
    paddingLeft: 40,
  },
  userBubble: {
    padding: 16,
    borderRadius: 16,
    borderTopRightRadius: 4,
  },
  userMiniAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  aiMsgRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 20,
    paddingRight: 16,
  },
  aiMiniAvatarWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginTop: 4,
  },
  aiMiniAvatarGradient: {
    flex: 1,
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
    padding: 16,
    borderRadius: 16,
    borderTopLeftRadius: 4,
  },
  aiBubbleActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  aiActionBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pedoModule: {
    marginTop: 12,
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
  },
  pedoGlowBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    opacity: 0.85,
  },
  pedoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 12,
  },
  pedoIcon: {
    width: 20,
    height: 20,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  xpBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  comparisonCard: {
    padding: 12,
    borderRadius: 12,
  },
  compareRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  compareLabel: {
    fontSize: 10,
    fontWeight: '700',
    width: 56,
    marginTop: 2,
  },
  errorWrap: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  errorText: {
    fontSize: 13,
    textDecorationLine: 'line-through',
  },
  betterWrap: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  betterText: {
    fontSize: 13,
    fontWeight: '600',
  },
  inputArea: {
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  suggestionsList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  suggestionChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputCapsule: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    minHeight: 20, // allows cursor size to fit well
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
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 22,
  },
  sendBtnWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  sendBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  footnote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
