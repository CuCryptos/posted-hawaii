import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { GhostButton } from '@/components/ui/GhostButton'
import { getAllPosts } from '@/lib/blog'

export function LatestPosts() {
  const posts = getAllPosts().slice(0, 3)
  if (posts.length === 0) return null

  return (
    <section className="py-16 lg:py-24 bg-cream">
      <Container>
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-display font-black text-[1.5rem] lg:text-[2rem] uppercase tracking-tight text-asphalt">
            From the Blog
          </h2>
          <Link
            href="/blog"
            className="hidden sm:block font-display font-bold text-[11px] uppercase tracking-widest text-asphalt/40 hover:text-asphalt transition-colors"
          >
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {posts.map((post) => {
            const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })
            return (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                <div className="relative aspect-[3/2] overflow-hidden bg-warm-sand">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="font-display font-bold text-[9px] uppercase tracking-widest bg-cream/90 text-asphalt px-2.5 py-1">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="font-display text-[10px] uppercase tracking-widest text-asphalt/40">
                    {formattedDate}
                  </p>
                  <h3 className="font-display font-bold text-[14px] uppercase tracking-wider text-asphalt mt-1 group-hover:text-coral transition-colors">
                    {post.title}
                  </h3>
                  <p className="font-body italic text-[13px] text-asphalt/60 mt-1.5 line-clamp-2">
                    {post.description}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
        <div className="mt-10 text-center sm:hidden">
          <GhostButton href="/blog" variant="dark">
            View All Posts
          </GhostButton>
        </div>
      </Container>
    </section>
  )
}
