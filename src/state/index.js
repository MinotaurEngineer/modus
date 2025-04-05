export const KEYS = {
  USER: 'user',
  SCHEDULE: 'schedule',
  LOCATION: 'location'
}

export const EMPTY = {
  USER: {
    profile: {
      activityGoal: null,
      activityLevel: null,
      age: null,
      bodyfat: null,
      gender: null,
      height: null,
      hr_rest: null,
      location: null,
      trainingYears: null,
      weight: null,
    },
    metrics: {
      bmr: null,
      hr_max: null,
      hr_reserve: null,
      hr_zones: null,
      lbm: null,
      muscular_potential: null,
      macros: null,
      tdee: null,
      vo2max: null,
      water_intake: null
    }
  }
}

const endpoints = {
  [KEYS.LOCATION]: () => 'https://ipwho.is/?fields=country,city,latitude,longitude',
  [KEYS.SCHEDULE]: ({ latitude, longitude }) => `https://api.met.no/weatherapi/sunrise/3.0/sun?lat=${latitude}&lon=${longitude}`
}

export function setLocalStorage(key, state) {
  try {
    const last = localStorage.getItem(key);
    const existingState = last ? JSON.parse(last) : {}

    localStorage.setItem(key, JSON.stringify({
      ...existingState,
      ...state
    }));
    window.dispatchEvent(new CustomEvent('localstorage:update'))
  } catch (error) {
    console.error("Error setting local storage:", error);
  }
}

export function getLocalStorage(key) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error("Error retrieving from local storage:", error);
    return null;
  }
}

export async function fetchData(key, props = {}) {
  try {
    const res = await fetch(endpoints[key](props));
    if (res.ok) {
      return await res.json();
    } else {
      console.error(`Filed to fetch ${key}`, res.status, res.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error fetching location:", error);
    return null;
  }
}

export async function init() {
  const user = getLocalStorage(KEYS.USER)
  const location = user?.profile?.location || await fetchData(KEYS.LOCATION)

  const { latitude, longitude, country, city } = location

  if (!latitude || !longitude) throw new Error('cannot get user location')

  setLocalStorage(KEYS.USER, {
    ...EMPTY.USER,
    ...user,
    profile: {
      ...EMPTY.USER.profile,
      ...(user?.profile || {}),
      location: { latitude, longitude, country, city }
    }
  })

  const schedule = getLocalStorage(KEYS.SCHEDULE) || await fetchData(KEYS.SCHEDULE, { latitude, longitude })

  setLocalStorage(KEYS.SCHEDULE, schedule)

  const { when: { interval: [start, end] } } = schedule

  if (new Date() > new Date(end)) {
    const nextSchedule = await fetchData(KEYS.SCHEDULE, { latitude, longitude })
    setLocalStorage(KEYS.SCHEDULE, nextSchedule)
  }
}