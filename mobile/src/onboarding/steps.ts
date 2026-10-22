export const ONBOARDING_STEPS = [
  { id: 'promise', showProgress: false },
  { id: 'goal', showProgress: true },
  { id: 'about', showProgress: true },
  { id: 'height', showProgress: true },
  { id: 'parents', showProgress: true },
  { id: 'building', showProgress: false },
  { id: 'reveal', showProgress: true },
  { id: 'habits', showProgress: true },
  { id: 'plan', showProgress: true },
  { id: 'priming', showProgress: true },
  { id: 'paywall', showProgress: true },
  { id: 'welcome', showProgress: false },
] as const;

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number]['id'];

const IDS: readonly string[] = ONBOARDING_STEPS.map((s) => s.id);
const PROGRESS_STEPS: readonly string[] = ONBOARDING_STEPS.filter((s) => s.showProgress).map(
  (s) => s.id,
);

export const stepRoute = (step: OnboardingStep) => `/onboarding/${step}` as const;

export function getStepIndex(step: string): number {
  return IDS.indexOf(step);
}

export function showsProgress(step: string): boolean {
  return PROGRESS_STEPS.includes(step);
}

/** 0..1 over the steps that show the bar; 0 for hidden steps. */
export function getProgress(step: string): number {
  const i = PROGRESS_STEPS.indexOf(step);
  return i < 0 ? 0 : (i + 1) / PROGRESS_STEPS.length;
}

export function getNextStep(step: OnboardingStep): OnboardingStep | null {
  return (ONBOARDING_STEPS[getStepIndex(step) + 1]?.id as OnboardingStep | undefined) ?? null;
}
