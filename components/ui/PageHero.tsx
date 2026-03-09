import { Container } from './Container'

type PageHeroProps = {
  title: string
  subtitle?: string
}

export function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <section className="bg-asphalt pt-28 pb-10 lg:pt-32 lg:pb-12">
      <Container>
        <h1 className="font-display font-black text-[2rem] lg:text-[2.5rem] uppercase tracking-tight text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="font-body italic text-white/50 text-sm lg:text-base mt-2 max-w-lg">
            {subtitle}
          </p>
        )}
      </Container>
    </section>
  )
}
