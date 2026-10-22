import { Redirect } from 'expo-router';

import { useAppStore } from '@/store/useAppStore';

export default function Index() {
  const completed = useAppStore((s) => s.onboardingCompleted);
  return <Redirect href={completed ? '/home' : '/onboarding/promise'} />;
}
