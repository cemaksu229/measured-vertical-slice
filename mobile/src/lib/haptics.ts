import * as Haptics from 'expo-haptics';

export const tap = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});

export const success = () =>
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});

export const selection = () => Haptics.selectionAsync().catch(() => {});
