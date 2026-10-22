import habitsData from '@/data/habits.json';
import type { HeightPrediction } from '@/logic/height';

export type PlanGoal = 'know-final-height' | 'reach-potential' | 'track-child';
export type SleepAnswer = '<7' | '7-8' | '9+';
export type Level3 = 'low' | 'medium' | 'high';
export type DietAnswer = 'low' | 'ok' | 'good';

export type PlanAnswers = {
  goal: PlanGoal;
  /** null (unanswered) falls back to '7-8'. */
  sleepHours: SleepAnswer | null;
  /** null falls back to 'medium'. */
  activity: Level3 | null;
  /** null falls back to 'ok'. */
  diet: DietAnswer | null;
};

export type Habit = {
  id: string;
  category: 'sleep' | 'nutrition' | 'activity' | 'posture';
  title: string;
  why: string;
  dailyTarget: string;
  icon: string;
};

export type PlanHabit = Habit & {
  /** Exactly 4 entries, one per week. */
  weeks: [string, string, string, string];
};

const HEADLINES: Record<PlanAnswers['goal'], string> = {
  'know-final-height': 'Your final-height check-in',
  'reach-potential': 'Reach the top of your range',
  'track-child': 'Help your child reach their range',
};

export type Plan = {
  headline: string;
  summary: string;
  habits: PlanHabit[];
  disclaimer: string;
};

const HABITS = habitsData as Habit[];
const byId = (id: string): Habit => {
  const h = HABITS.find((x) => x.id === id);
  if (!h) throw new Error(`Unknown habit: ${id}`);
  return h;
};

const PROGRESSION: Record<string, [string, string, string, string]> = {
  'sleep-consistent': [
    'Pick a bedtime and keep it within 1 hour on weekdays.',
    'Keep it on weekends too.',
    'Move bedtime 15 minutes earlier if you are still short on sleep.',
    'Hold your routine; note how rested you feel.',
  ],
  'sleep-duration': [
    'Add 15 minutes to your sleep time.',
    'Add another 15 minutes.',
    'Aim for at least 8 hours on most nights.',
    'Keep it steady, including weekends.',
  ],
  'sleep-screens': [
    'Screens off 20 minutes before bed.',
    'Screens off 30 minutes before bed.',
    'Screens off 45 minutes before bed.',
    'Replace the screen time with reading or music.',
  ],
  'nutrition-protein': [
    'Add a protein food to breakfast.',
    'Include protein at lunch too.',
    'Include protein at all 3 meals.',
    'Mix sources: eggs, fish, beans, dairy, meat.',
  ],
  'nutrition-calcium': [
    'Add 1 calcium-rich serving a day.',
    'Reach 2 servings a day.',
    'Reach 3 servings a day.',
    'Vary the sources; keep 3 servings.',
  ],
  'nutrition-vitd': [
    'Spend 10 minutes outdoors in daylight.',
    'Make it 15 minutes.',
    'Add a vitamin D food (eggs, oily fish, fortified milk).',
    'Keep both going; ask a doctor before any supplement.',
  ],
  'activity-daily': [
    'Move 20 minutes a day.',
    'Move 30-40 minutes a day.',
    'Move 45-60 minutes a day.',
    'Keep 60 minutes on most days with an activity you enjoy.',
  ],
  'activity-impact': [
    '10 minutes of jumping or running, 3 days.',
    '10-15 minutes, 4 days.',
    '15-20 minutes, 5 days.',
    'Keep it up; try a team sport or a new game.',
  ],
  'posture-check': [
    'Do one wall-stand check a day.',
    'Do two checks a day.',
    'Do three checks a day.',
    'Notice your posture while sitting and walking.',
  ],
  'posture-desk': [
    'Stand up once per hour of sitting.',
    'Stand and stretch every 60 minutes.',
    'Stand and stretch every 45 minutes.',
    'Keep the break habit during homework and screens.',
  ],
};

const FALLBACK: [string, string, string, string] = [
  'Start with a small version of this habit.',
  'Do it on most days.',
  'Do it every day.',
  'Keep it going and note how it feels.',
];

const SLEEP_TEXT: Record<SleepAnswer, string> = {
  '<7': 'under 7 hours of sleep',
  '7-8': '7-8 hours of sleep',
  '9+': '9+ hours of sleep',
};

export function buildPlan(prediction: HeightPrediction, input: PlanAnswers): Plan {
  const answers = {
    goal: input.goal,
    sleepHours: input.sleepHours ?? '7-8',
    activity: input.activity ?? 'medium',
    diet: input.diet ?? 'ok',
  };
  const ids: string[] = [];
  const add = (id: string) => {
    if (!ids.includes(id)) ids.push(id);
  };

  // Rule order = priority: biggest gaps first.
  if (answers.sleepHours === '<7') {
    add('sleep-duration');
    add('sleep-consistent');
  } else if (answers.sleepHours === '7-8') {
    add('sleep-consistent');
  }
  if (answers.diet === 'low') {
    add('nutrition-protein');
    add('nutrition-calcium');
  } else if (answers.diet === 'ok') {
    add('nutrition-protein');
  }
  if (answers.activity === 'low') add('activity-daily');
  else if (answers.activity === 'medium') add('activity-impact');
  if (answers.sleepHours === '<7') add('sleep-screens');
  add('nutrition-vitd');
  add('posture-check');
  add('posture-desk');
  add('sleep-consistent');

  const habits: PlanHabit[] = ids.slice(0, 5).map((id) => {
    const h = byId(id);
    return { ...h, weeks: PROGRESSION[id] ?? FALLBACK };
  });

  const strengths: string[] = [];
  if (answers.sleepHours === '9+') strengths.push('great sleep');
  if (answers.activity === 'high') strengths.push('an active routine');
  if (answers.diet === 'good') strengths.push('a solid diet');
  const who = answers.goal === 'track-child' ? 'Your child already has' : 'You already have';
  const strengthText = strengths.length ? ` ${who} ${strengths.join(' and ')}.` : '';

  const headline = HEADLINES[answers.goal];
  const summary =
    `Built around ${SLEEP_TEXT[answers.sleepHours]}, ${answers.activity} activity ` +
    `and ${answers.diet === 'ok' ? 'an okay' : answers.diet} diet.` +
    strengthText;

  return {
    headline,
    summary,
    habits,
    disclaimer:
      'Habits support healthy growth but cannot change your genetic potential. Talk to a doctor if you are worried about growth.',
  };
}
