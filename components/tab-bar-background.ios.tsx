import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';

// Matches the system material native iOS uses behind its own tab bar —
// paired with tabBarStyle:{position:'absolute'} in (tabs)/_layout.tsx so
// content shows through, scrolling underneath, like a real iOS tab bar.
export default function TabBarBackground() {
  return <BlurView tint="systemChromeMaterialLight" intensity={100} style={StyleSheet.absoluteFill} />;
}
