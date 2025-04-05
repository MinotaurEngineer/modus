const defaultState = {
  location: "Unknown Location",
  day_schedule_index: 0,
  day_schedule: [
    { title: "Rise", time: null },
    { title: "Breakfast", time: null },
    { title: "Lunch", time: null },
    { title: "Snack", time: null },
    { title: "Gym", time: null },
    { title: "Supper", time: null },
    { title: "Rest", time: null },
  ],
  tdee: [
    { label: "Total Daily Energy", value: null },
    { label: "Breakfast", value: null },
    { label: "Lunch", value: null },
    { label: "Snack", value: null },
    { label: "Supper", value: null },
  ],
  water: [
    { label: "Minimum Water Intake", value: null },
    { label: "Breakfast", value: null },
    { label: "Lunch", value: null },
    { label: "Snack", value: null },
    { label: "Supper", value: null },
  ],
  macros: [
    { label: "Macros (Unknown Goal)", value: null },
    { label: "Breakfast", value: null },
    { label: "Lunch", value: null },
    { label: "Snack", value: null },
    { label: "Supper", value: null },
  ],
  hr_zones: [
    { title: "Recovery", range: null },
    { title: "Aerobic Endurance", range: null },
    { title: "Aerobic Strength", range: null },
    { title: "Threshhold", range: null },
    { title: "Anaerobic Endurance", range: null },
    { title: "Anaerobic Strength", range: null },
  ],
  cardio_performance: [
    { label: "HR Rest", value: null, unit: 'bpm' },
    { label: "HR Max", value: null, unit: 'bpm' },
    { label: "VO2 Max", value: null, unit: 'ml/kg/min' },
  ],
  muscular_potential: [
    { ratio: "10%", weight: null },
    { ratio: "15%", weight: null },
    { ratio: "20%", weight: null },
  ],
  mass: [
    { label: "Lean Body Mass", value: null, unit: 'kg' },
    { label: "Weight", value: null, unit: 'kg' },
  ],
};

const CIRCADIAN_SETTINGS = {
  events: [
    { title: "Rise", offset: 0 },
    { title: "Breakfast", offset: 0.1 },
    { title: "Lunch", offset: 0.5 },
    { title: "Snack", offset: 0.75 },
    { title: "Gym", offset: 0.8 },
    { title: "Supper", offset: 1 },
    { title: "Rest", offset: 1.25 }
  ]
};

const MEALWEIGHTS = {
  Breakfast: 0.25,
  Lunch: 0.25,
  Gym: 0.3,
  Supper: 0.2,
};

export function viewData({ user, schedule }) {
  const nextState = {};

  const now = new Date();
  const hours = now.getHours();

  // Location from user profile
  if (user?.profile?.location) {
    nextState.location = `${user.profile.location.city}, ${user.profile.location.country}`;
  }

  // Day schedule processing
  if (schedule?.properties) {
    const sunriseTime = new Date(schedule.properties.sunrise.time)
    const sunsetTime = new Date(schedule.properties.sunset.time)

    const sunriseMinutes
      = (sunriseTime.getHours() * 60) + sunriseTime.getMinutes()

    const sunsetMinutes
      = (sunsetTime.getHours() * 60) + sunsetTime.getMinutes()

    // Parse times to minutes
    const daylightMinutes = sunsetMinutes - sunriseMinutes;

    // Helper to convert minutes back to "HH:MM"
    const toTimeString = (minutes) => {
      const hour = Math.floor(minutes / 60) % 24;
      const min = minutes % 60;
      return `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
    };

    const nowMinutes = hours * 60 + now.getMinutes();

    nextState.day_schedule = CIRCADIAN_SETTINGS.events.map(({ title, offset }) => {
      let eventMinutes;
      if (offset <= 1) {
        eventMinutes = sunriseMinutes + Math.round(daylightMinutes * offset);
      } else {
        eventMinutes = sunsetMinutes + Math.round(daylightMinutes * (offset - 1));
      }
      return { title, time: toTimeString(eventMinutes) };
    });

    nextState.day_schedule_index = nextState.day_schedule.findIndex(
      (event) => {
        const [eventHour, eventMin] = event.time.split(":").map(Number);
        const eventMinutes = eventHour * 60 + eventMin;
        return eventMinutes > nowMinutes;
      }
    ) || 0;
  }

  // TDEE (Total Daily Energy Expenditure) and breakdowns
  if (user?.metrics?.tdee) {
    const tdee = user.metrics.tdee;
    nextState.tdee = [
      { label: "Total Daily Energy", value: `${tdee} calories` },
      { label: "Breakfast", value: `${Math.round(tdee * 0.3)} calories` },
      { label: "Lunch", value: `${Math.round(tdee * 0.2)} calories` },
      { label: "Snack", value: `${Math.round(tdee * 0.1)} calories` },
      { label: "Supper", value: `${Math.round(tdee * 0.4)} calories` },
    ];
  }

  // Water intake and breakdowns
  if (user?.metrics?.water_intake) {
    const water = user.metrics.water_intake; // in liters
    nextState.water = [
      { label: "Minimum Water Intake", value: `${water} litres` },
      { label: "Breakfast", value: `${Math.round(water * 300)} ml` },
      { label: "Lunch", value: `${Math.round(water * 200)} ml` },
      { label: "Snack", value: `${Math.round(water * 100)} ml` },
      { label: "Supper", value: `${Math.round(water * 400)} ml` },
    ];
  }

  // Macros
  if (user?.metrics?.macros && user?.profile?.activityGoal) {

    const macroGrams = user.metrics.macros.map(macro =>
      macro.values.find(v => v.type === "grams").value
    );
    const macroRatios = user.metrics.macros.map(macro =>
      Math.round(macro.values.find(v => v.type === "ratio").value * 100)
    );

    nextState.macros = [
      {
        label: `Macros (${user.profile.activityGoal})`,
        value: `${macroGrams.join("g / ")}g`.trim()
      },
      ...nextState.day_schedule
        .filter(event => ["Breakfast", "Lunch", "Gym", "Supper"].includes(event.title))
        .map(event => {
          const weight = MEALWEIGHTS[event.title] || 0;
          const values = macroGrams.map(grams =>
            `${Math.round(grams * weight)}g`
          );
          return {
            label: event.title,
            value: values.join(" / ").trim()
          };
        })
    ];
  }

  if (user?.metrics?.hr_zones) {
    nextState.hr_zones = defaultState.hr_zones.map((zone, index) => {
      zone.range = user.metrics.hr_zones[index]
      return zone
    })
  }


  if (user?.profile?.hr_rest && user?.metrics?.hr_max && user?.metrics?.vo2max) {
    nextState.cardio_performance = defaultState.cardio_performance.map((entry) => {
      if (entry.label === "HR Rest") entry.value = user.profile.hr_rest
      if (entry.label === "HR Max") entry.value = user.metrics.hr_max
      if (entry.label === "VO2 Max") entry.value = user.metrics.vo2max
      return entry
    })
  }

  if (user?.metrics?.muscular_potential) {
    nextState.muscular_potential = user.metrics.muscular_potential.map(([ratio, weight]) => ({
      ratio: `${ratio * 100}%`,
      weight: `${weight} kg`
    }));
  }

  if (user?.metrics?.lbm && user?.profile?.weight) {
    nextState.mass = defaultState.mass.map((entry) => {
      if (entry.label === 'Lean Body Mass') entry.value = user.metrics.lbm
      if (entry.label === 'Weight') entry.value = user.profile.weight
      return entry
    })
  }

  return { ...defaultState, ...nextState };
}