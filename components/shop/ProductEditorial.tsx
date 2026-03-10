import Image from 'next/image'

export function ProductEditorial() {
  return (
    <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-center justify-center">
      <Image
        src="/images/lifestyle/kakaako-hoodie.png"
        alt="POSTED lifestyle — Honolulu streetwear"
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 text-center max-w-2xl px-6">
        <h2 className="font-display font-black text-3xl md:text-5xl uppercase text-white tracking-tight">
          Built for Honolulu
        </h2>
        <p className="font-body text-lg text-white/80 mt-6 leading-relaxed">
          Worn from town to the coast, the POSTED tee is designed as an everyday
          uniform — clean graphics, easy styling, and a local point of view.
        </p>
      </div>
    </section>
  )
}
