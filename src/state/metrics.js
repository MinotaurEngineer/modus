const MACRO_CALORIES = {
  PROTEIN: 4,
  CARBOHYDRATES: 4,
  FATS: 9
}

const GOAL_ADJUSTMENTS = {
  HYPERTROPHY: { PROTEIN: 1.8, FATS: 0.9 },
  STRENGTH: { PROTEIN: 1.6, FATS: 0.9 },
  POWER: { PROTEIN: 1.7, FATS: 0.9 },
  ENDURANCE: { PROTEIN: 1.4, FATS: 0.8 },
  SPEED: { PROTEIN: 1.6, FATS: 0.9 }
};

export function bmr({ metrics: { lbm } }) {
  if (!lbm) return null
  // Katch-McArdle BMR
  return Math.round(370 + 21.6 * lbm)
}


export function hr_max({ profile: { age } }) {
  if (!age) return null
  // Multiple formulas averaged
  return Math.floor(
    (
      207 - (0.7 * age) +
      206.9 - (0.67 * age) +
      211 - (0.64 * age) +
      205.8 - (0.685 * age)
    ) * 0.25
  )

}

export function hr_reserve({ profile: { hr_rest }, metrics: { hr_max } }) {
  if (!hr_rest || !hr_max) return null
  return hr_max - hr_rest
}

export function hr_zones({ profile: { hr_rest }, metrics: { hr_reserve } }) {
  if (!hr_rest || !hr_reserve) return null
  // Heart Rate Reserve Zones
  const z0 = Math.floor(hr_rest + hr_reserve * 0.59)
  const z1 = Math.floor(hr_rest + hr_reserve * 0.74)
  const z2 = Math.floor(hr_rest + hr_reserve * 0.84)
  const z3 = Math.floor(hr_rest + hr_reserve * 0.88)
  const z4 = Math.floor(hr_rest + hr_reserve * 0.95)
  const z5 = hr_rest + hr_reserve

  return [
    [hr_rest, z0],
    [z0, z1],
    [z1, z2],
    [z2, z3],
    [z3, z4],
    [z4, z5],
  ]
}

export function lbm({ profile: { weight, bodyfat } }) {
  if (!weight || !bodyfat) return null
  return (weight - (weight * bodyfat))
}

export function macros({
  profile: { activityGoal },
  metrics: { lbm, tdee }
}) {
  if (!activityGoal || !lbm || !tdee) {
    return null;
  }

  const { PROTEIN, FATS } =
    GOAL_ADJUSTMENTS[activityGoal.toUpperCase()] || GOAL_ADJUSTMENTS.HYPERTROPHY;

  // Protein based on LBM
  const proteinGrams = lbm * PROTEIN;
  const proteinCalories = proteinGrams * MACRO_CALORIES.PROTEIN;

  // Fats based on LBM
  const fatGrams = lbm * FATS;
  const fatCalories = fatGrams * MACRO_CALORIES.FATS;

  // Carbs fill the rest
  const remainingCalories = tdee - (proteinCalories + fatCalories);
  const carbGrams = remainingCalories / MACRO_CALORIES.CARBOHYDRATES;
  const carbCalories = carbGrams * MACRO_CALORIES.CARBOHYDRATES;

  return [
    {
      name: "Protein",
      values: [
        { type: "grams", value: Math.round(proteinGrams) },
        { type: "ratio", value: proteinCalories / tdee },
        { type: "calories", value: Math.round(proteinCalories) }
      ]
    },
    {
      name: "Fats",
      values: [
        { type: "grams", value: Math.round(fatGrams) },
        { type: "ratio", value: fatCalories / tdee },
        { type: "calories", value: Math.round(fatCalories) }
      ]
    },
    {
      name: "Carbohydrates",
      values: [
        { type: "grams", value: Math.round(carbGrams) },
        { type: "ratio", value: carbCalories / tdee },
        { type: "calories", value: Math.round(carbCalories) }
      ]
    }
  ];
}


function calculateTotalWeight(leanMass, bf) {
  return Math.floor(leanMass / (1 - bf))
}

export function muscular_potential({
  profile: { height, bodyfat, age, trainingYears }
}) {

  if (!height || !bodyfat || !age || !trainingYears) return null

  let trainingFactor = 1.02;

  if (trainingYears >= 2) trainingFactor += 0.03
  if (trainingYears >= 5) trainingFactor += 0.07
  if (trainingYears >= 10) trainingFactor += 0.05

  trainingFactor = Math.min(trainingFactor, 1.30);

  const adjustedLeanKg =
    (height - 100)
    * trainingFactor
    * (age > 50 ? 0.95 : age > 40 ? 0.98 : 1.0);

  return [0.10, 0.15, 0.20]
    .map(bf => [bf, calculateTotalWeight(adjustedLeanKg, bf)])
}

export function tdee({ profile: { activityLevel }, metrics: { bmr } }) {
  if (!activityLevel || !bmr) return null
  return Math.round(bmr * activityLevel);
}

export function vo2max({ profile: { hr_rest }, metrics: { hr_max } }) {
  if (!hr_rest || !hr_max) return null
  return Math.ceil(15 * (hr_max / hr_rest))
}

export function water_intake({ profile: { weight } }) {
  if (!weight) return null
  return Math.min((3 * 16) * (weight * 2) / 10000, 2.4)
}