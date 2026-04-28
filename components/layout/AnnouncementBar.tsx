'use client'

import { useState, useSyncExternalStore } from 'react'

const ANNOUNCEMENT_DISMISSED_KEY = 'announcement-dismissed'

export function AnnouncementBar() {
  const [dismissedInSession, setDismissedInSession] = useState(false)
  const dismissedInStorage = useSyncExternalStore(
    () => () => {},
    () => window.localStorage.getItem(ANNOUNCEMENT_DISMISSED_KEY) === 'true',
    () => false
  )

  if (dismissedInSession || dismissedInStorage) return null

  return (
    <div className="bg-asphalt text-white text-center py-2.5 px-6 text-sm font-display font-medium relative">
      Drop 001 — Coming Soon
      <button
        onClick={() => {
          setDismissedInSession(true)
          window.localStorage.setItem(ANNOUNCEMENT_DISMISSED_KEY, 'true')
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 -m-2"
        aria-label="Dismiss announcement"
      >
        ✕
      </button>
    </div>
  )
}
