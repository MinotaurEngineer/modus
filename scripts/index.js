const KEYS = {
  SCHEDULE: 'schedule',
  LOCATION: 'location'
}

const endpoints = {
  [KEYS.LOCATION]: () => 'https://ipwho.is/?fields=latitude,longitude',
  [KEYS.SCHEDULE]: ({ latitude, longitude }) => `https://api.met.no/weatherapi/sunrise/3.0/sun?lat=${latitude}&lon=${longitude}`
}

function setLocalStorage(key, state) {
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

function getLocalStorage(key) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error("Error retrieving from local storage:", error);
    return null;
  }
}

async function fetchData(key, props = {}) {
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

async function init() {
  const location = getLocalStorage(KEYS.LOCATION) || await fetchData(KEYS.LOCATION)

  setLocalStorage(KEYS.LOCATION, location)

  const { latitude, longitude } = location

  if (!latitude || !longitude) throw new Error('cannot get user location')

  const schedule = getLocalStorage(KEYS.SCHEDULE) || await fetchData(KEYS.SCHEDULE, { latitude, longitude })

  setLocalStorage(KEYS.SCHEDULE, schedule)

  const { when: { interval: [start, end] } } = schedule

  if (new Date() > new Date(end)) {
    const nextSchedule = await fetchData(KEYS.SCHEDULE, { latitude, longitude })
    setLocalStorage(KEYS.SCHEDULE, nextSchedule)
  }
}

function toStimeString(minutes) {
  const hour = Math.floor(minutes / 60) % 24;
  const min = minutes % 60;
  return `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
}

init()

document.addEventListener('alpine:init', () => {
  Alpine.store('schedule', {
    init() {
      try {
        const { properties: { sunrise, sunset, solarnoon } } = getLocalStorage(KEYS.SCHEDULE)

        const times = {
          sunrise: new Date(sunrise.time),
          sunset: new Date(sunset.time),
          solarnoon: new Date(solarnoon.time)
        }

        times.sunrise = (times.sunrise.getHours() * 60) + times.sunrise.getMinutes()
        times.sunset = (times.sunset.getHours() * 60) + times.sunset.getMinutes()
        times.solarnoon = (times.solarnoon.getHours() * 60) + times.solarnoon.getMinutes()

        this.time[0] = toStimeString(times.sunrise)
        this.time[1] = toStimeString(times.sunrise + 15)
        this.time[2] = toStimeString(times.sunrise + 45)
        this.time[3] = toStimeString((times.solarnoon + times.sunrise) * 0.5)
        this.time[4] = toStimeString(times.solarnoon)
        this.time[5] = toStimeString(times.sunset - 120)
        this.time[6] = toStimeString(times.sunset - 90)
        this.time[7] = toStimeString(times.sunset)
        this.time[8] = toStimeString(1440 - (times.sunrise - 300))
        this.time[9] = toStimeString(1440 - (times.sunrise - 390))

      } catch (error) {
        console.log(error)
      }
    },
    time: []
  })

}, { passive: true, once: true })