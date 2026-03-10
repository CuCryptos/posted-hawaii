import Image from 'next/image'

export function Editorial() {
  return (
    <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center">
      {/* Background image */}
      <Image
        src="/images/lifestyle/kakaako-hoodie.png"
        alt="POSTED lifestyle in Kaka'ako"
        fill
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Text content */}
      <div className="relative z-10 px-6 md:px-16 max-w-2xl">
        <h2 className="font-display font-black text-3xl md:text-5xl uppercase text-white tracking-tight">
          FROM THE ISLANDS
        </h2>
        <p className="font-body text-lg text-white/80 mt-6 max-w-lg leading-relaxed">
          POSTED reflects the rhythm of Honolulu — sunrise surf sessions, nights
          in Kaka&#x02BB;ako, and the culture that connects them.
        </p>
      </div>
    </section>
  )
}
