const endpoints = ['kinesiology', 'features', 'constants']

export async function load({ fetch }) {
  if (!endpoints.length) return { props: {} }

  const files = endpoints.map(endpoint =>
    fetch(`./api/${endpoint}.json`).then(res => {
      if (!res.ok) {
        throw new Error(`Failed to fetch ${endpoint}: ${res.statusText}`)
      }
      return res.json().then(data => [endpoint, data])
    })
  )

  const entries = await Promise.all(files)
  const data = Object.fromEntries(entries)

  return data
}