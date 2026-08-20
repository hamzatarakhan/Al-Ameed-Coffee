import { useCallback, useMemo, useState } from 'react';
import * as Location from 'expo-location';

import { branches, branchCityById, cityCoords, type Branch } from './mock-data';
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
      const city = branchCityById[branchId];
      const cc = city && cityCoords[city.en];
      if (!cc) return null;
      return haversineKm(coords, cc);
    },
    [coords]
  );

  const nearest: Branch | null = useMemo(() => {
    if (!coords) return null;
    let best: Branch | null = null;
    let bestDist = Infinity;
    for (const b of branches) {
      const d = distanceTo(b.id);
      if (d != null && d < bestDist) {
        bestDist = d;
        best = b;
      }
    }
    return best;
  }, [coords, distanceTo]);

  return { status, coords, request, distanceTo, nearest };
}
