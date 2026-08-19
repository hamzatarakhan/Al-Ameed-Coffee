import React, { createContext, useContext, useState } from 'react';
import { profile as seedProfile } from './mock-data';

export type EditableProfile = Partial<typeof seedProfile>;

interface ProfileValue {
  profile: typeof seedProfile;
  updateProfile: (patch: EditableProfile) => void;
}

const ProfileContext = createContext<ProfileValue | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState(seedProfile);

  const updateProfile = (patch: EditableProfile) => setProfile((p) => ({ ...p, ...patch }));

  return <ProfileContext.Provider value={{ profile, updateProfile }}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
}
