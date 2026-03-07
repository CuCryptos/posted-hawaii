import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/home/Hero'
import { CollectionShowcase } from '@/components/home/CollectionShowcase'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { BrandStory } from '@/components/home/BrandStory'
import { EmailSignup } from '@/components/home/EmailSignup'

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>
        <Hero />
        <CollectionShowcase />
        <FeaturedProducts />
        <BrandStory />
        <EmailSignup />
      </main>
      <Footer />
    </>
  )
}
