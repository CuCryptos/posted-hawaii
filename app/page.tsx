import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/home/Hero'
import { DropAnnouncement } from '@/components/home/DropAnnouncement'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { Editorial } from '@/components/home/Editorial'
import { HomeShopGrid } from '@/components/home/HomeShopGrid'
import { BrandStatement } from '@/components/home/BrandStatement'
import { EmailSignup } from '@/components/home/EmailSignup'
import { getProducts } from '@/lib/shopify'

export const revalidate = 60

export default async function Home() {
  const products = await getProducts()

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <DropAnnouncement />
        <FeaturedProducts products={products} />
        <Editorial />
        <HomeShopGrid products={products} />
        <BrandStatement />
        <EmailSignup />
      </main>
      <Footer />
    </>
  )
}
