import Link from 'next/link'
import {
  getLaunchMerchandisingHref,
  getLaunchMerchandisingLabel,
  type Launch,
} from '@/lib/launches'

export function DropContext({ launch }: { launch?: Launch }) {
  if (!launch) return null

  return (
    <section className="bg-cream py-16 md:py-20">
      <div className="max-w-2xl mx-auto text-center px-6">
        <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-coral mb-2">
          DROP {String(launch.number).padStart(3, '0')}
        </p>
        <h2 className="font-display font-black text-xl md:text-2xl uppercase text-asphalt tracking-tight">
          {launch.name}
        </h2>
        <p className="font-body text-base text-asphalt/60 mt-4 leading-relaxed">
          {launch.description}
        </p>
        <Link
          href={getLaunchMerchandisingHref(launch)}
          className="mt-8 inline-block border-2 border-asphalt text-asphalt px-8 py-3 font-display font-bold text-xs uppercase tracking-widest hover:bg-asphalt hover:text-cream transition-colors"
        >
          {getLaunchMerchandisingLabel(launch)}
        </Link>
      </div>
    </section>
  )
}
