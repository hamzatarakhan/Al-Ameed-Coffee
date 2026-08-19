import { Platform } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

// Only iOS floats the tab bar (position: 'absolute', see (tabs)/_layout.tsx),
// so only iOS needs its height added back as bottom padding on scroll content.
// Android/web keep the bar in normal flex flow, which already reserves the space.
export function useTabBarInset() {
  const height = useBottomTabBarHeight();
  return Platform.OS === 'ios' ? height : 0;
}
