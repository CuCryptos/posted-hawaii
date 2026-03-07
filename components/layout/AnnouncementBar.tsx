'use client'

import { useState, useEffect } from 'react'

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setDismissed(localStorage.getItem('announcement-dismissed') === 'true')
    setLoaded(true)
  }, [])

  if (!loaded || dismissed) return null

  return (
    <div className="bg-asphalt text-white text-center py-2.5 px-6 text-sm font-display font-medium relative">
      Drop 001 — Coming Soon
      <button
        onClick={() => {
          setDismissed(true)
          localStorage.setItem('announcement-dismissed', 'true')
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 -m-2"
        aria-label="Dismiss announcement"
      >
        ✕
      </button>
    </div>
  )
}
