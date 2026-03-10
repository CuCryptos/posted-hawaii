import { notFound } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ProductDetail } from '@/components/shop/ProductDetail'
import { ProductEditorial } from '@/components/shop/ProductEditorial'
import { DropContext } from '@/components/shop/DropContext'
import { RelatedProducts } from '@/components/shop/RelatedProducts'
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
        <div className="h-20" />
        <div className="max-w-7xl mx-auto px-6 py-10 lg:py-12">
          <ProductDetail product={product} />
        </div>
        <ProductEditorial />
        <DropContext />
        <RelatedProducts products={related} />
      </main>
      <Footer />
    </>
  )
}
