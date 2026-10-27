export const formatVolume = (ml) => ml >= 1000 ? `${(ml / 1000).toFixed(ml % 1000 ? 1 : 0)} L` : `${ml} mL`

export const formatTime = (iso) => new Intl.DateTimeFormat(undefined, {
  hour: 'numeric', minute: '2-digit',
}).format(new Date(iso))

export const longDate = (date = new Date()) => new Intl.DateTimeFormat(undefined, {
  weekday: 'long', month: 'long', day: 'numeric',
}).format(typeof date === 'string' ? new Date(`${date}T12:00:00`) : date)

export const apiDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const dateTimeLocalValue = (iso = new Date().toISOString()) => {
  const date = new Date(iso)
  const offset = date.getTimezoneOffset() * 60000
  return new Date(date - offset).toISOString().slice(0, 16)
}
