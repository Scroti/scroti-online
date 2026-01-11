import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { Profile, Link, SocialLink } from '@/types';

const PROFILES_COLLECTION = 'profiles';

export async function getProfile(profileId: string): Promise<Profile | null> {
  try {
    const profileRef = doc(db, PROFILES_COLLECTION, profileId);
    const profileSnap = await getDoc(profileRef);
    
    if (profileSnap.exists()) {
      const data = profileSnap.data();
      return {
        ...data,
        id: profileSnap.id,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Profile;
    }
    return null;
  } catch (error) {
    console.error('Error getting profile:', error);
    return null;
  }
}

export async function createOrUpdateProfile(profileId: string, profileData: Partial<Profile>): Promise<boolean> {
  try {
    const profileRef = doc(db, PROFILES_COLLECTION, profileId);
    const existingProfile = await getDoc(profileRef);
    
    // Remove id from profileData as it's the document ID
    const { id, ...dataToSave } = profileData as any;
    
    if (existingProfile.exists()) {
      await updateDoc(profileRef, {
        ...dataToSave,
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(profileRef, {
        ...dataToSave,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    return true;
  } catch (error) {
    console.error('Error saving profile:', error);
    return false;
  }
}

export async function updateLinks(profileId: string, links: Link[]): Promise<boolean> {
  try {
    const profileRef = doc(db, PROFILES_COLLECTION, profileId);
    await updateDoc(profileRef, {
      links,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error('Error updating links:', error);
    return false;
  }
}

export async function updateSocialLinks(profileId: string, socialLinks: SocialLink[]): Promise<boolean> {
  try {
    const profileRef = doc(db, PROFILES_COLLECTION, profileId);
    await updateDoc(profileRef, {
      socialLinks,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error('Error updating social links:', error);
    return false;
  }
}
