'use client'

import { useEffect, useState } from 'react'

type DropCountdownProps = {
  releaseDate: string
  isLive: boolean
}

function getTimeLeft(target: Date) {
  const now = new Date()
  const diff = target.getTime() - now.getTime()
  if (diff <= 0) return null

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)

  return { days, hours, minutes, seconds }
}

export function DropCountdown({ releaseDate, isLive }: DropCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft>>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const target = new Date(releaseDate)
    setTimeLeft(getTimeLeft(target))

    const interval = setInterval(() => {
      const tl = getTimeLeft(target)
      setTimeLeft(tl)
      if (!tl) clearInterval(interval)
    }, 1000)

    return () => clearInterval(interval)
  }, [releaseDate])

  if (isLive) {
    return (
      <p className="font-display font-bold text-[11px] uppercase tracking-widest text-palm">
        Live Now
      </p>
    )
  }

  if (!mounted) {
    return (
      <p className="font-display text-[11px] uppercase tracking-widest text-asphalt/40">
        Loading...
      </p>
    )
  }

  if (!timeLeft) {
    return (
      <p className="font-display font-bold text-[11px] uppercase tracking-widest text-coral">
        Dropped
      </p>
    )
  }

  return (
    <div className="flex gap-4" data-countdown>
      {[
        { value: timeLeft.days, label: 'Days' },
        { value: timeLeft.hours, label: 'Hrs' },
        { value: timeLeft.minutes, label: 'Min' },
        { value: timeLeft.seconds, label: 'Sec' },
      ].map((unit) => (
        <div key={unit.label} className="text-center">
          <p className="font-display font-black text-[1.5rem] text-asphalt tabular-nums">
            {String(unit.value).padStart(2, '0')}
          </p>
          <p className="font-display text-[9px] uppercase tracking-widest text-asphalt/40 mt-0.5">
            {unit.label}
          </p>
        </div>
      ))}
    </div>
  )
}
