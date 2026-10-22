/**
 * Adult height estimate. Method: Tanner mid-parental height
 * (male = (father + mother + 13) / 2, female = (father + mother - 13) / 2, all cm),
 * with an honest +/-8.5 cm (~95%) range. A light blend (25%) with the child's current
 * height scaled by typical percent-of-adult-height by age (CDC growth charts) is applied
 * from age 12. This is an estimate, not a diagnosis or a promise.
 */

export type Sex = 'male' | 'female';
export type HeightUnit = 'metric' | 'imperial';

export type HeightInput = {
  sex: Sex;
  ageYears?: number;
  currentHeightCm?: number;
  /** null means unknown; the adult population mean is used instead. */
  motherHeightCm: number | null;
  fatherHeightCm: number | null;
};

export type PercentileLabel = 'below average' | 'average' | 'above average';

export type HeightPrediction = {
  predictedCm: number;
  lowCm: number;
  highCm: number;
  growthRemainingCm: number;
  /** Rough comparison with adult population means; not a medical percentile. */
  percentileLabel: PercentileLabel;
  confidence: 'low' | 'medium';
  notes: string[];
};

const RANGE_CM = 8.5;
const RANGE_ONE_UNKNOWN_CM = 10.5;
const RANGE_BOTH_UNKNOWN_CM = 12;
const POP = { male: { mean: 175.5, sd: 7 }, female: { mean: 162, sd: 6.5 } } as const;
const COMPLETE_AGE = { male: 18, female: 16 } as const;

// Approximate fraction of adult height reached by age (rounded from CDC-style charts).
const PCT_OF_ADULT: Record<Sex, [number, number][]> = {
  male: [[10, 0.78], [12, 0.84], [13, 0.88], [14, 0.92], [15, 0.96], [16, 0.98], [17, 0.99], [18, 1]],
  female: [[10, 0.844], [11, 0.884], [12, 0.929], [13, 0.965], [14, 0.983], [15, 0.991], [16, 1]],
};

function pctOfAdult(sex: Sex, age: number): number {
  const t = PCT_OF_ADULT[sex];
  if (age <= t[0][0]) return t[0][1];
  for (let i = 1; i < t.length; i++) {
    if (age <= t[i][0]) {
      const [a0, p0] = t[i - 1];
      const [a1, p1] = t[i];
      return p0 + ((p1 - p0) * (age - a0)) / (a1 - a0);
    }
  }
  return 1;
}

const round1 = (n: number) => Math.round(n * 10) / 10;

function labelFor(sex: Sex, cm: number): PercentileLabel {
  const z = (cm - POP[sex].mean) / POP[sex].sd;
  if (z < -0.5) return 'below average';
  if (z > 0.5) return 'above average';
  return 'average';
}

export function predictAdultHeight(input: HeightInput): HeightPrediction {
  const { sex, ageYears, currentHeightCm, motherHeightCm, fatherHeightCm } = input;
  const notes: string[] = [];
  const age = typeof ageYears === 'number' && ageYears > 0 ? ageYears : undefined;
  const current =
    typeof currentHeightCm === 'number' && currentHeightCm > 0 ? currentHeightCm : undefined;

  const confidence: 'low' | 'medium' =
    age !== undefined && age >= 8 && age <= 17 ? 'medium' : 'low';
  if (confidence === 'low') {
    notes.push('Estimates are less reliable for children under 8 and for people over 17.');
  }

  if (age !== undefined && current !== undefined && age >= COMPLETE_AGE[sex]) {
    notes.push('Growth is likely complete, so your current height is treated as your final height.');
    return {
      predictedCm: round1(current),
      lowCm: round1(current - 1),
      highCm: round1(current + 1),
      growthRemainingCm: 0,
      percentileLabel: labelFor(sex, current),
      confidence,
      notes,
    };
  }

  const adj = sex === 'male' ? 13 : -13;
  const unknownCount = (motherHeightCm === null ? 1 : 0) + (fatherHeightCm === null ? 1 : 0);
  const mother = motherHeightCm ?? POP.female.mean;
  const father = fatherHeightCm ?? POP.male.mean;
  const range = [RANGE_CM, RANGE_ONE_UNKNOWN_CM, RANGE_BOTH_UNKNOWN_CM][unknownCount];
  let predicted = (father + mother + adj) / 2;
  if (unknownCount === 0) {
    notes.push("Based on your parents' heights (Tanner mid-parental method). Real outcomes vary by about 8.5 cm either way.");
  } else if (unknownCount === 1) {
    notes.push("One parent's height is unknown, so we widened your range.");
  } else {
    notes.push("Both parents' heights are unknown, so this estimate rests on population averages and the range is much wider.");
  }

  if (age !== undefined && current !== undefined && age >= 12) {
    const fromCurrent = current / pctOfAdult(sex, age);
    predicted = 0.75 * predicted + 0.25 * fromCurrent;
    notes.push('Lightly adjusted using current height for this age.');
  }

  let low = predicted - range;
  let high = predicted + range;
  if (current !== undefined) {
    if (predicted < current) {
      predicted = current;
      notes.push('Estimate raised to current height; you are already at or above the parent-based estimate.');
    }
    low = Math.max(low, current);
  }
  high = Math.max(high, predicted);

  return {
    predictedCm: round1(predicted),
    lowCm: round1(low),
    highCm: round1(high),
    growthRemainingCm: current !== undefined ? round1(Math.max(0, predicted - current)) : 0,
    percentileLabel: labelFor(sex, predicted),
    confidence,
    notes,
  };
}

export function cmToFtIn(cm: number): { ft: number; inches: number } {
  const totalIn = Math.round(cm / 2.54);
  return { ft: Math.floor(totalIn / 12), inches: totalIn % 12 };
}

export function ftInToCm(ft: number, inches: number): number {
  return round1((ft * 12 + inches) * 2.54);
}

export function formatHeight(cm: number, unit: HeightUnit): string {
  if (unit === 'metric') return `${Math.round(cm)} cm`;
  const { ft, inches } = cmToFtIn(cm);
  return `${ft}'${inches}"`;
}
