import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from '../utils/supabase';

export interface PuterProfile {
  username: string;
  uuid?: string;
  email?: string;
}

export interface PuterConnectionState {
  isConnected: boolean;
  token: string | null;
  user: PuterProfile | null;
  isLoading: boolean;
  error?: string | null;
}

const PUTER_API_BASE = 'https://api.puter.com';
const PUTER_GUI_BASE = 'https://puter.com';
const PUTER_OPENAI_COMPLETIONS = 'https://api.puter.com/puterai/openai/v1/chat/completions';

const getStorageKey = (userId?: string | null) => {
  return `@polytalk_puter_token_${userId || 'default'}`;
};

/**
 * Retrieves the stored Puter token for the given PolyTalk user ID.
 */
export async function getStoredPuterToken(userId?: string | null): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(getStorageKey(userId));
  } catch (err) {
    console.warn('Failed to get stored Puter token:', err);
    return null;
  }
}

/**
 * Saves the Puter token scoped to the PolyTalk user ID.
 */
export async function savePuterToken(userId: string | null | undefined, token: string): Promise<void> {
  await AsyncStorage.setItem(getStorageKey(userId), token.trim());
}

/**
 * Removes the stored Puter token for the PolyTalk user ID.
 */
export async function clearPuterToken(userId?: string | null): Promise<void> {
  await AsyncStorage.removeItem(getStorageKey(userId));
}

/**
 * Validates a Puter Auth Token by calling the /whoami endpoint.
 */
export async function verifyPuterToken(token: string): Promise<PuterProfile | null> {
  if (!token || !token.trim()) return null;
  try {
    const res = await fetch(`${PUTER_API_BASE}/whoami`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token.trim()}`,
      },
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    if (data && data.username) {
      return {
        username: data.username,
        uuid: data.uuid,
        email: data.email,
      };
    }
    return null;
  } catch (err) {
    console.warn('Puter token verification failed:', err);
    return null;
  }
}

/**
 * Connects Puter using a manually provided auth token.
 */
export async function connectPuterWithToken(
  userId: string | null | undefined,
  token: string
): Promise<{ success: boolean; user?: PuterProfile; error?: string }> {
  const profile = await verifyPuterToken(token);
  if (!profile) {
    return {
      success: false,
      error: 'Invalid or expired Puter Auth Token. Please verify on puter.com/dashboard.',
    };
  }

  await savePuterToken(userId, token);
  return { success: true, user: profile };
}

/**
 * Disconnects the Puter account for the current user.
 */
export async function disconnectPuter(userId?: string | null): Promise<void> {
  await clearPuterToken(userId);
}

/**
 * Dynamically loads official Puter.js in web environment.
 */
export async function loadPuterScript(): Promise<any> {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return null;
  if ((window as any).puter) return (window as any).puter;

  return new Promise((resolve) => {
    try {
      const existing = document.querySelector('script[src*="js.puter.com"]');
      if (existing) {
        if ((window as any).puter) return resolve((window as any).puter);
        existing.addEventListener('load', () => resolve((window as any).puter));
        existing.addEventListener('error', () => resolve(null));
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js.puter.com/v2/';
      script.async = true;
      script.onload = () => resolve((window as any).puter);
      script.onerror = () => resolve(null);
      document.head.appendChild(script);
    } catch {
      resolve(null);
    }
  });
}

/**
 * Initiates the Puter OAuth/browser sign-in flow.
 * Works across Web (Puter.js SDK + postMessage listener + auto-close) and Mobile (WebBrowser).
 */
export async function startPuterBrowserAuth(
  userId: string | null | undefined,
  onStatusUpdate?: (status: string) => void
): Promise<{ success: boolean; token?: string; user?: PuterProfile; error?: string }> {
  onStatusUpdate?.('Opening Puter sign-in...');

  // 1. Try official Puter SDK on Web first
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    try {
      const puter = await loadPuterScript();
      if (puter && puter.auth && typeof puter.auth.signIn === 'function') {
        onStatusUpdate?.('Waiting for Puter authorization...');
        const authRes = await puter.auth.signIn();
        const token = puter.authToken || authRes?.token;
        if (token) {
          onStatusUpdate?.('Verifying Puter account...');
          let profile = null;
          try {
            const u = await puter.auth.getUser();
            if (u && u.username) {
              profile = { username: u.username, uuid: u.uuid, email: u.email };
            }
          } catch {}
          if (!profile) {
            profile = await verifyPuterToken(token);
          }
          await savePuterToken(userId, token);
          await savePuterToken(null, token);

          return {
            success: true,
            token,
            user: profile || { username: 'Puter User' },
          };
        }
      }
    } catch (sdkErr: any) {
      console.warn('Puter SDK sign-in exception:', sdkErr);
      if (sdkErr?.error === 'auth_window_closed') {
        return { success: false, error: 'Sign-in window was closed.' };
      }
      if (sdkErr?.error === 'popup_blocked') {
        return { success: false, error: 'Popup was blocked by your browser. Please allow popups.' };
      }
    }
  }

  // 2. Custom Hybrid Browser/Mobile Flow (postMessage listener + polling + auto-closing popup)
  return new Promise(async (resolve) => {
    const msgId = Math.floor(Math.random() * 10000000);
    const sessionId = 'pt_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now();
    const authUrl = `${PUTER_GUI_BASE}/action/sign-in?embedded_in_popup=true&msg_id=${msgId}&signin_session=${sessionId}`;

    let popupWindow: any = null;
    let isFinished = false;
    let checkInterval: any = null;

    const cleanup = () => {
      isFinished = true;
      if (checkInterval) clearInterval(checkInterval);
      if (typeof window !== 'undefined') {
        window.removeEventListener('message', handleMessage);
      }
      if (popupWindow && !popupWindow.closed) {
        try {
          popupWindow.close();
        } catch {}
      }
      if (Platform.OS !== 'web') {
        try {
          WebBrowser.dismissBrowser();
        } catch {}
      }
    };

    const handleMessage = async (event: MessageEvent) => {
      if (
        event.origin.includes('puter.com') ||
        event.origin.includes('localhost')
      ) {
        const data = event.data;
        if (data) {
          const possibleToken = data.token || (data.msg === 'puter.token' && data.token);
          if (possibleToken && !isFinished) {
            cleanup();
            onStatusUpdate?.('Verifying Puter account...');
            const profile = await verifyPuterToken(possibleToken);
            await savePuterToken(userId, possibleToken);
            await savePuterToken(null, possibleToken);
            resolve({
              success: true,
              token: possibleToken,
              user: profile || { username: 'Puter User' },
            });
          }
        }
      }
    };

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.addEventListener('message', handleMessage);
      popupWindow = window.open(authUrl, 'puter_auth', 'width=540,height=680,menubar=no,toolbar=no');

      // Monitor if popup is closed by user or Puter
      checkInterval = setInterval(async () => {
        if (popupWindow && popupWindow.closed && !isFinished) {
          // Check if puter globally received token
          if (typeof window !== 'undefined' && (window as any).puter?.authToken) {
            const token = (window as any).puter.authToken;
            cleanup();
            const profile = await verifyPuterToken(token);
            await savePuterToken(userId, token);
            await savePuterToken(null, token);
            return resolve({
              success: true,
              token,
              user: profile || { username: 'Puter User' },
            });
          }
          cleanup();
          resolve({ success: false, error: 'Sign-in window was closed.' });
        }
      }, 500);
    } else {
      try {
        await WebBrowser.openBrowserAsync(authUrl);
      } catch (e) {
        console.warn('WebBrowser open failed:', e);
      }
    }

    // Concurrent poll on /login/wait as fallback
    (async () => {
      const maxAttempts = 18;
      for (let i = 0; i < maxAttempts && !isFinished; i++) {
        try {
          const waitRes = await fetch(`${PUTER_API_BASE}/login/wait`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session: sessionId }),
          });
          if (waitRes.ok) {
            const result = await waitRes.json();
            if (result?.auth_token && !isFinished) {
              const token = result.auth_token;
              cleanup();
              onStatusUpdate?.('Verifying Puter account...');
              const profile = await verifyPuterToken(token);
              await savePuterToken(userId, token);
              await savePuterToken(null, token);
              return resolve({
                success: true,
                token,
                user: profile || { username: 'Puter User' },
              });
            }
          }
          await new Promise((r) => setTimeout(r, 2000));
        } catch {
          await new Promise((r) => setTimeout(r, 2000));
        }
      }

      if (!isFinished) {
        cleanup();
        resolve({
          success: false,
          error: 'Authentication timed out. You can also connect via your Puter Auth Token.',
        });
      }
    })();
  });
}

/**
 * Automatically authenticates or registers a PolyTalk Supabase user using their Puter identity.
 * Binds the user's Puter token to their PolyTalk Supabase account so all AI charges are billed to their Puter account.
 */
export async function loginOrRegisterWithPuter(
  token: string,
  profile: PuterProfile
): Promise<{ success: boolean; user?: any; error?: string }> {
  try {
    const cleanUsername = (profile.username || 'user').toLowerCase().replace(/[^a-z0-9]/g, '');
    const puterEmail = `${cleanUsername}@puter.com`;
    const puterPassword = `Puter_${profile.uuid || cleanUsername}_PolyTalk!`;

    // Try signing in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: puterEmail,
      password: puterPassword,
    });

    let authenticatedUser = signInData?.user;

    if (signInError || !authenticatedUser) {
      // User doesn't exist yet, register them
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: puterEmail,
        password: puterPassword,
        options: {
          data: {
            full_name: profile.username,
            username: profile.username,
            puter_user_id: profile.uuid,
          },
        },
      });

      if (signUpError) {
        return { success: false, error: signUpError.message };
      }

      authenticatedUser = signUpData.user;
    }

    if (authenticatedUser) {
      // Save Puter token for this user
      await savePuterToken(authenticatedUser.id, token);
      await savePuterToken(null, token); // Default fallback

      // Flag that a Puter connection notice should be shown on Dashboard!
      await AsyncStorage.setItem(
        '@polytalk_show_puter_connected_notice',
        JSON.stringify({
          username: profile.username || 'Puter User',
          tokenSnippet: token.substring(0, 8) + '...',
          shown: false,
        })
      );

      return { success: true, user: authenticatedUser };
    }

    return { success: false, error: 'Could not establish PolyTalk session.' };
  } catch (err: any) {
    console.warn('loginOrRegisterWithPuter failed:', err);
    return { success: false, error: err.message || 'Login with Puter failed.' };
  }
}

export interface PuterChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Sends a chat completion request to Puter's OpenAI-compatible endpoint.
 */
export async function callPuterChatCompletion(
  token: string,
  messages: PuterChatMessage[],
  model: string = 'gpt-4o-mini'
): Promise<{ text: string; raw?: any }> {
  if (!token || !token.trim()) {
    throw new Error('Puter authentication token is missing.');
  }

  const response = await fetch(PUTER_OPENAI_COMPLETIONS, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.trim()}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    let errorDetail = `Puter AI request failed with status ${response.status}`;
    try {
      const errJson = await response.json();
      if (errJson?.error?.message) {
        errorDetail = errJson.error.message;
      }
    } catch {}

    if (response.status === 401) {
      throw new Error('Puter authentication expired or invalid. Please reconnect your Puter account.');
    }
    if (response.status === 429) {
      throw new Error('Puter usage limit reached for this model. Please check your Puter balance at puter.com.');
    }
    throw new Error(errorDetail);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content || '';
  return { text, raw: data };
}
