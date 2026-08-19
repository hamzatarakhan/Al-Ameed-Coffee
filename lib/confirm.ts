import { Alert, Platform } from 'react-native';

// react-native-web's Alert.alert silently no-ops for the multi-button/object
// form (confirmed: no dialog, no error) — only the plain title+message
// single-OK form maps to window.alert. Every confirm/choice prompt in the
// app needs to work on web too (it's GitHub-Pages-deployed), so route
// through window.confirm there instead of the native Alert.
export function confirmAction(title: string, message: string, confirmLabel: string, onConfirm: () => void, cancelLabel = 'Cancel', destructive = false) {
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n\n${message}`)) onConfirm();
    return;
  }
  Alert.alert(title, message, [
    { text: cancelLabel, style: 'cancel' },
    { text: confirmLabel, style: destructive ? 'destructive' : 'default', onPress: onConfirm },
  ]);
}
