import { useEffect, useRef } from 'react'

export function useReminderScheduler(settings) {
  const lastReminder = useRef('')

  useEffect(() => {
    if (!settings?.reminder_enabled || !('Notification' in window) || Notification.permission !== 'granted') return

    const check = () => {
      const now = new Date()
      const [startHour, startMinute] = settings.reminder_start_time.split(':').map(Number)
      const [endHour, endMinute] = settings.reminder_end_time.split(':').map(Number)
      const currentMinutes = now.getHours() * 60 + now.getMinutes()
      const start = startHour * 60 + startMinute
      const end = endHour * 60 + endMinute
      if (currentMinutes < start || currentMinutes > end) return

      const interval = settings.reminder_interval_minutes
      const bucket = Math.floor((currentMinutes - start) / interval)
      const dateKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${bucket}`
      const storageKey = 'aquatrack-last-reminder'
      if (lastReminder.current === dateKey || sessionStorage.getItem(storageKey) === dateKey) return

      lastReminder.current = dateKey
      sessionStorage.setItem(storageKey, dateKey)
      new Notification('A gentle hydration check-in', {
        body: 'Take a moment for some water if it feels right for you.',
        icon: '/favicon.svg',
        tag: `aquatrack-${dateKey}`,
      })
    }

    check()
    const timer = window.setInterval(check, 30_000)
    return () => window.clearInterval(timer)
  }, [settings])
}
