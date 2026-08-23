import { useCallback, useMemo, useState } from 'react';
import * as Location from 'expo-location';

import { branches, type Branch } from './mock-data';
import { haversineKm } from './geo';

export function useBranchDistances() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'granted' | 'denied'>('idle');

  const request = useCallback(async () => {
    setStatus('loading');
    try {
      const { status: perm } = await Location.requestForegroundPermissionsAsync();
      if (perm !== 'granted') {
        setStatus('denied');
        return;
      }
      const pos = await Location.getCurrentPositionAsync({});
      setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      setStatus('granted');
    } catch {
      setStatus('denied');
    }
  }, []);

  const distanceTo = useCallback(
    (branchId: string) => {
      if (!coords) return null;
      const branch = branches.find((b) => b.id === branchId);
      if (!branch) return null;
      return haversineKm(coords, { lat: branch.lat, lng: branch.lng });
    },
    [coords]
  );

  // All 31 branches ranked by real distance from the user's own coordinates
  // (each branch's own lat/lng, not just its city) — nearest first.
  const sortedByDistance: Branch[] | null = useMemo(() => {
    if (!coords) return null;
    return [...branches].sort((a, b) => (distanceTo(a.id) ?? Infinity) - (distanceTo(b.id) ?? Infinity));
  }, [coords, distanceTo]);

  const nearest: Branch | null = sortedByDistance?.[0] ?? null;

  return { status, coords, request, distanceTo, nearest, sortedByDistance };
}
