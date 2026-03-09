import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Container } from '@/components/ui/Container'
import { PageHero } from '@/components/ui/PageHero'
import { ShopGrid } from '@/components/shop/ShopGrid'
import { getProducts } from '@/lib/shopify'

export const revalidate = 60

export const metadata = {
  title: 'Shop — POSTED HAWAI\u02BBI',
  description: 'Shop the latest POSTED drops.',
}

export default async function ShopPage() {
  const products = await getProducts()

  return (
    <>
      <Navbar />
      <main className="bg-cream min-h-screen">
        <PageHero title="Shop" />
        <Container className="py-10 lg:py-12">
          <ShopGrid products={products} />
        </Container>
      </main>
      <Footer />
    </>
  )
}
