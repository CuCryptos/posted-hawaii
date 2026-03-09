import { notFound } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Container } from '@/components/ui/Container'
import { ProductDetail } from '@/components/shop/ProductDetail'
import { ProductCard } from '@/components/shop/ProductCard'
import { getProductByHandle, getProducts } from '@/lib/shopify'

export const revalidate = 60

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const products = await getProducts()
  return products.map((p) => ({ slug: p.handle }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const product = await getProductByHandle(slug)
  if (!product) return {}
  return {
    title: `${product.title} — POSTED HAWAI\u02BBI`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductByHandle(slug)
  if (!product) notFound()

  const allProducts = await getProducts()
  const related = allProducts
    .filter((p) => p.productType === product.productType && p.handle !== product.handle)
    .slice(0, 4)

  return (
    <>
      <Navbar />
      <main className="bg-cream min-h-screen">
        <div className="bg-asphalt pt-28 pb-6 lg:pt-32 lg:pb-8" />
        <Container className="py-10 lg:py-12">
          <ProductDetail product={product} />

          {related.length > 0 && (
            <section className="mt-20 pt-12 border-t border-asphalt/10">
              <h2 className="font-display font-black text-[1.25rem] uppercase tracking-tight text-asphalt mb-8">
                You might also like
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {related.map((p) => (
                  <ProductCard key={p.handle} product={p} />
                ))}
              </div>
            </section>
          )}
        </Container>
      </main>
      <Footer />
    </>
  )
}
