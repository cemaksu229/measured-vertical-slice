import { useMemo } from 'react';

import { predictAdultHeight, type HeightPrediction } from '@/logic/height';
import { buildPlan, type Plan } from '@/logic/plan';

import { useAppStore } from './useAppStore';

/** Null until the user has picked a sex. */
export function usePrediction(): HeightPrediction | null {
  const profile = useAppStore((s) => s.profile);
  return useMemo(
    () => (profile.sex ? predictAdultHeight({ ...profile, sex: profile.sex }) : null),
    [profile],
  );
}

/** Null while there is no prediction. Missing habit answers fall back to neutral defaults. */
export function usePlan(): Plan | null {
  const prediction = usePrediction();
  const goal = useAppStore((s) => s.goal);
  const habits = useAppStore((s) => s.habits);
  return useMemo(
    () =>
      prediction ? buildPlan(prediction, { goal: goal ?? 'reach-potential', ...habits }) : null,
    [prediction, goal, habits],
  );
}

export type Copy = {
  subject: 'you' | 'your child';
  possessive: 'your' | "your child's";
  isParent: boolean;
};

export function useCopy(): Copy {
  const isParent = useAppStore((s) => s.goal === 'track-child');
  return useMemo(
    () =>
      isParent
        ? { subject: 'your child', possessive: "your child's", isParent: true }
        : { subject: 'you', possessive: 'your', isParent: false },
    [isParent],
  );
}
