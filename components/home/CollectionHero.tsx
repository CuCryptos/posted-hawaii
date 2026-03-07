import Image from 'next/image'
import { GhostButton } from '@/components/ui/GhostButton'

type CollectionHeroProps = {
  name: string
  description: string
  image: string
  shopHref: string
  lookHref?: string
}

export function CollectionHero({ name, description, image, shopHref, lookHref }: CollectionHeroProps) {
  return (
    <section className="relative h-[90vh] lg:h-screen w-full overflow-hidden">
      <Image
        src={image}
        alt={name}
        fill
        className="object-cover"
        sizes="100vw"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 px-6 lg:px-10 pb-12 lg:pb-16 max-w-[1440px] mx-auto w-full">
        <div className="lg:flex lg:items-end lg:justify-between">
          <div>
            <h2 className="font-display font-black text-[2rem] lg:text-[3rem] text-white uppercase leading-none">
              {name}
            </h2>
            <p className="font-body italic text-white/70 text-sm lg:text-base mt-3 max-w-md">
              {description}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mt-6 lg:mt-0">
            <GhostButton href={shopHref}>Shop Now</GhostButton>
            {lookHref && <GhostButton href={lookHref}>A Closer Look</GhostButton>}
          </div>
        </div>
      </div>
    </section>
  )
}
