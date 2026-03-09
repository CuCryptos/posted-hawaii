import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Container } from '@/components/ui/Container'
import { MDXContent } from '@/components/blog/MDXContent'
import { PostCard } from '@/components/blog/PostCard'
import { getPostBySlug, getAllPosts } from '@/lib/blog'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: `${post.title} — POSTED HAWAI\u02BBI`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: [post.image],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const allPosts = getAllPosts()
  const related = allPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3)

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <>
      <Navbar />
      <main className="bg-cream min-h-screen">
        {/* Hero image */}
        <section className="relative h-[50vh] lg:h-[60vh] overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 px-6 lg:px-10 pb-12 max-w-[1440px] mx-auto w-full">
            <span className="font-display font-bold text-[10px] uppercase tracking-widest text-coral">
              {post.category}
            </span>
            <h1 className="font-display font-black text-[2rem] lg:text-[3rem] uppercase leading-none text-white mt-2">
              {post.title}
            </h1>
            <p className="font-display text-[11px] uppercase tracking-widest text-white/60 mt-3">
              {formattedDate} &middot; {post.author}
            </p>
          </div>
        </section>

        {/* Content */}
        <Container className="py-12 lg:py-16">
          <MDXContent source={post.content} />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-asphalt/10 flex gap-2 flex-wrap">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-display text-[10px] uppercase tracking-widest text-asphalt/40 border border-asphalt/10 px-3 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Back link */}
          <div className="mt-8">
            <Link
              href="/blog"
              className="font-display font-bold text-[11px] uppercase tracking-widest text-asphalt/40 hover:text-asphalt transition-colors"
            >
              &larr; All Posts
            </Link>
          </div>

          {/* Related posts */}
          {related.length > 0 && (
            <section className="mt-16 pt-12 border-t border-asphalt/10">
              <h2 className="font-display font-black text-[1.25rem] uppercase tracking-tight text-asphalt mb-8">
                More from the blog
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {related.map((p) => (
                  <PostCard key={p.slug} post={p} />
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
