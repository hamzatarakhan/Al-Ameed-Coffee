import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';
import { useAuth } from './auth-store';
import { profile as seedProfile, type Gender, type MaritalStatus } from './mock-data';

type ProfileShape = typeof seedProfile;
export type EditableProfile = Partial<ProfileShape>;

const blankProfile: ProfileShape = {
  nameAr: '',
  nameEn: '',
  phone: '',
  email: '',
  memberSince: '',
  referralCode: '',
  dateOfBirth: '',
  gender: '',
  maritalStatus: '',
  city: '',
  area: '',
};

interface ProfileValue {
  profile: ProfileShape;
  updateProfile: (patch: EditableProfile) => void;
}

const ProfileContext = createContext<ProfileValue | null>(null);

function rowToProfile(row: Record<string, unknown>): ProfileShape {
  return {
    nameAr: (row.name_ar as string) ?? '',
    nameEn: (row.name_en as string) ?? '',
    phone: (row.phone as string) ?? '',
    email: (row.email as string) ?? '',
    memberSince: (row.created_at as string)?.slice(0, 10) ?? '',
    referralCode: (row.referral_code as string) ?? '',
    dateOfBirth: (row.date_of_birth as string) ?? '',
    gender: ((row.gender as Gender) ?? '') as Gender,
    maritalStatus: ((row.marital_status as MaritalStatus) ?? '') as MaritalStatus,
    city: (row.city as string) ?? '',
    area: (row.area as string) ?? '',
  };
}

const patchToRow: Record<keyof EditableProfile, string> = {
  nameAr: 'name_ar',
  nameEn: 'name_en',
  phone: 'phone',
  email: 'email',
  memberSince: 'created_at',
  referralCode: 'referral_code',
  dateOfBirth: 'date_of_birth',
  gender: 'gender',
  maritalStatus: 'marital_status',
  city: 'city',
  area: 'area',
};

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const [profile, setProfile] = useState<ProfileShape>(blankProfile);

  // Reloads whenever auth status changes — covers both "just signed in"
  // and "app relaunched with an existing session" (status resolves async
  // in auth-store, this effect just reacts to the result).
  useEffect(() => {
    if (status === 'signedOut') {
      setProfile(blankProfile);
      return;
    }
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return;
      supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle()
        .then(({ data: row }) => {
          if (row) setProfile(rowToProfile(row));
        });
    });
  }, [status]);

  const updateProfile = (patch: EditableProfile) => {
    setProfile((p) => ({ ...p, ...patch }));

    const row: Record<string, string | null> = {};
    for (const key of Object.keys(patch) as (keyof EditableProfile)[]) {
      if (key === 'memberSince') continue; // created_at isn't user-editable
      const value = patch[key];
      row[patchToRow[key]] = value === '' && key === 'dateOfBirth' ? null : (value ?? null);
    }
    if (Object.keys(row).length === 0) return;

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) supabase.from('profiles').update(row).eq('id', data.user.id);
    });
  };

  return <ProfileContext.Provider value={{ profile, updateProfile }}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
}
