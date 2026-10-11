import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';
import { getStoredPuterToken, verifyPuterToken } from '../services/puter';

export interface UserProfileData {
  id: string;
  email: string;
  name: string;
  username: string;
  avatarUrl?: string;
  isPuterUser?: boolean;
}

/**
 * Retrieves the currently authenticated user's profile across Supabase Auth,
 * the profiles database table, Puter session, or local cache.
 */
export async function getCurrentUserProfile(): Promise<UserProfileData | null> {
  try {
    // 1. Check active Supabase Auth user session
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      let dbName = '';
      let dbUsername = '';
      let dbAvatar = '';

      try {
        const { data: dbProfile } = await supabase
          .from('profiles')
          .select('full_name, username, avatar_url')
          .eq('id', user.id)
          .maybeSingle();

        if (dbProfile) {
          dbName = dbProfile.full_name || '';
          dbUsername = dbProfile.username || '';
          dbAvatar = dbProfile.avatar_url || '';
        }
      } catch (dbErr) {
        console.warn('Could not fetch from profiles table:', dbErr);
      }

      const metaName = user.user_metadata?.full_name || user.user_metadata?.name;
      const metaUsername = user.user_metadata?.username;
      const emailPrefix = user.email ? user.email.split('@')[0] : 'user';

      const finalUsername = dbUsername || metaUsername || emailPrefix;
      const finalName = dbName || metaName || finalUsername || 'Learner';
      const isPuter = Boolean(
        user.user_metadata?.puter_user_id ||
        (user.email && user.email.endsWith('@puter.com'))
      );

      const profileData: UserProfileData = {
        id: user.id,
        email: user.email || `${finalUsername}@puter.com`,
        name: finalName,
        username: finalUsername,
        avatarUrl: dbAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${finalUsername}`,
        isPuterUser: isPuter,
      };

      // Update local cache
      await AsyncStorage.setItem('@polytalk_current_user_profile', JSON.stringify(profileData));
      return profileData;
    }

    // 2. Check local profile cache
    const cached = await AsyncStorage.getItem('@polytalk_current_user_profile');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && (parsed.name || parsed.username || parsed.email)) {
          return {
            id: parsed.id || 'local_user',
            email: parsed.email || 'user@polytalk.app',
            name: parsed.name || parsed.full_name || parsed.username || 'Learner',
            username: parsed.username || 'user',
            avatarUrl: parsed.avatarUrl || parsed.avatar_url,
            isPuterUser: Boolean(parsed.isPuter || parsed.isPuterUser),
          };
        }
      } catch {}
    }

    // 3. Check Puter token if available
    const puterToken = await getStoredPuterToken(null);
    if (puterToken) {
      const pProfile = await verifyPuterToken(puterToken);
      if (pProfile && pProfile.username) {
        const puterData: UserProfileData = {
          id: pProfile.uuid || 'puter_user',
          email: pProfile.email || `${pProfile.username}@puter.com`,
          name: pProfile.username,
          username: pProfile.username,
          avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${pProfile.username}`,
          isPuterUser: true,
        };
        await AsyncStorage.setItem('@polytalk_current_user_profile', JSON.stringify(puterData));
        return puterData;
      }
    }

    return null;
  } catch (err) {
    console.warn('getCurrentUserProfile unexpected error:', err);
    return null;
  }
}
