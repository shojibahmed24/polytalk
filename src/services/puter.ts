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
 * Initiates the Puter OAuth/browser sign-in flow.
 * Works across Web (window.open) and Mobile (WebBrowser.openBrowserAsync).
 * Uses Puter's official polling mechanism via /login/wait.
 */
export async function startPuterBrowserAuth(
  userId: string | null | undefined,
  onStatusUpdate?: (status: string) => void
): Promise<{ success: boolean; token?: string; user?: PuterProfile; error?: string }> {
  // Generate unique session ID
  const sessionId = 'pt_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now();
  const authUrl = `${PUTER_GUI_BASE}/action/sign-in?embedded_in_popup=true&cross_origin_isolated=true&signin_session=${sessionId}`;

  onStatusUpdate?.('Opening Puter sign-in window...');

  let popupWindow: any = null;
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    popupWindow = window.open(authUrl, 'puter_auth', 'width=540,height=680,menubar=no,toolbar=no');
  } else {
    // Mobile React Native
    try {
      await WebBrowser.openBrowserAsync(authUrl);
    } catch (e) {
      console.warn('WebBrowser open failed:', e);
    }
  }

  onStatusUpdate?.('Waiting for Puter authorization...');

  // Poll /login/wait for up to 3 minutes
  const maxAttempts = 18; // 18 * ~10s = 180 seconds
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const waitRes = await fetch(`${PUTER_API_BASE}/login/wait`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session: sessionId }),
      });

      if (waitRes.ok) {
        const result = await waitRes.json();
        if (result && result.auth_token) {
          const token = result.auth_token;
          if (popupWindow && !popupWindow.closed) {
            popupWindow.close();
          }
          if (Platform.OS !== 'web') {
            WebBrowser.dismissBrowser();
          }

          onStatusUpdate?.('Verifying Puter session...');
          const profile = await verifyPuterToken(token);
          await savePuterToken(userId, token);

          return {
            success: true,
            token,
            user: profile || { username: 'Puter User' },
          };
        }
      }

      // If status 408 (timeout), simply continue next attempt
      if (waitRes.status === 408) {
        continue;
      }

      // If 400 or other bad request
      if (waitRes.status === 400 || waitRes.status === 403) {
        // Wait 2 seconds before retry
        await new Promise((r) => setTimeout(r, 2000));
      }
    } catch (err: any) {
      // Network hiccup during polling
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  return {
    success: false,
    error: 'Authentication timed out. You can also connect directly with your Puter Auth Token from puter.com/dashboard.',
  };
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
