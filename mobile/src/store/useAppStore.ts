import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Goal = 'know-final-height' | 'reach-potential' | 'track-child';
export type Unit = 'metric' | 'imperial';
export type Sex = 'male' | 'female';
export type SleepHours = '<7' | '7-8' | '9+';
export type Activity = 'low' | 'medium' | 'high';
export type Diet = 'low' | 'ok' | 'good';

export type Profile = {
  sex: Sex | null;
  ageYears: number;
  currentHeightCm: number;
  /** null means the parent's height is unknown. */
  motherHeightCm: number | null;
  fatherHeightCm: number | null;
};

export type Habits = {
  sleepHours: SleepHours | null;
  activity: Activity | null;
  diet: Diet | null;
};

type Data = {
  goal: Goal | null;
  unit: Unit;
  profile: Profile;
  habits: Habits;
  completedHabitIds: string[];
  isPro: boolean;
  onboardingCompleted: boolean;
  notificationsAsked: boolean;
};

type Actions = {
  setGoal: (goal: Goal) => void;
  setUnit: (unit: Unit) => void;
  setProfile: (patch: Partial<Profile>) => void;
  setHabits: (patch: Partial<Habits>) => void;
  toggleHabit: (id: string) => void;
  completeOnboarding: () => void;
  setPro: (isPro: boolean) => void;
  setNotificationsAsked: (asked: boolean) => void;
  resetAll: () => void;
};

export type AppState = Data & Actions & { hasHydrated: boolean };

const initialData: Data = {
  goal: null,
  unit: 'metric',
  profile: {
    sex: null,
    ageYears: 14,
    currentHeightCm: 160,
    motherHeightCm: 163,
    fatherHeightCm: 177,
  },
  habits: { sleepHours: null, activity: null, diet: null },
  completedHabitIds: [],
  isPro: false,
  onboardingCompleted: false,
  notificationsAsked: false,
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialData,
      hasHydrated: false,
      setGoal: (goal) => set({ goal }),
      setUnit: (unit) => set({ unit }),
      setProfile: (patch) => set((s) => ({ profile: { ...s.profile, ...patch } })),
      setHabits: (patch) => set((s) => ({ habits: { ...s.habits, ...patch } })),
      toggleHabit: (id) =>
        set((s) => ({
          completedHabitIds: s.completedHabitIds.includes(id)
            ? s.completedHabitIds.filter((x) => x !== id)
            : [...s.completedHabitIds, id],
        })),
      completeOnboarding: () => set({ onboardingCompleted: true }),
      setPro: (isPro) => set({ isPro }),
      setNotificationsAsked: (notificationsAsked) => set({ notificationsAsked }),
      resetAll: () => set({ ...initialData }),
    }),
    {
      name: 'app-store',
      version: 2,
      storage: createJSONStorage(() => AsyncStorage),
      migrate: () => ({ ...initialData }),
      partialize: (s): Data => ({
        goal: s.goal,
        unit: s.unit,
        profile: s.profile,
        habits: s.habits,
        completedHabitIds: s.completedHabitIds,
        isPro: s.isPro,
        onboardingCompleted: s.onboardingCompleted,
        notificationsAsked: s.notificationsAsked,
      }),
      onRehydrateStorage: () => () => {
        useAppStore.setState({ hasHydrated: true });
      },
    },
  ),
);
