import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CollectionHero } from '@/components/home/CollectionHero'
import { LookbookGrid } from '@/components/home/LookbookGrid'
import { ProductCarousel } from '@/components/home/ProductCarousel'
import { EmailSignup } from '@/components/home/EmailSignup'
import { COLLECTIONS, LOOKBOOK_POSTED_UP, LOOKBOOK_POSTED_LATE } from '@/lib/constants'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* Collection 1: POSTED UP */}
        <CollectionHero
          name={COLLECTIONS[0].name}
          description={COLLECTIONS[0].description}
          image={COLLECTIONS[0].image}
          shopHref={COLLECTIONS[0].shopHref}
          lookHref={COLLECTIONS[0].lookHref}
        />
        <LookbookGrid items={LOOKBOOK_POSTED_UP} />

        {/* Collection 2: POSTED LATE */}
        <div className="pt-16 lg:pt-20" />
        <CollectionHero
          name={COLLECTIONS[1].name}
          description={COLLECTIONS[1].description}
          image={COLLECTIONS[1].image}
          shopHref={COLLECTIONS[1].shopHref}
          lookHref={COLLECTIONS[1].lookHref}
        />
        <LookbookGrid items={LOOKBOOK_POSTED_LATE} />

        {/* Collection 3: POSTED EARLY (hero only) */}
        <div className="pt-16 lg:pt-20" />
        <CollectionHero
          name={COLLECTIONS[2].name}
          description={COLLECTIONS[2].description}
          image={COLLECTIONS[2].image}
          shopHref={COLLECTIONS[2].shopHref}
        />

        {/* Products */}
        <ProductCarousel />

        {/* Signup */}
        <EmailSignup />
      </main>
      <Footer />
    </>
  )
}
