import Image from 'next/image'
import Link from 'next/link'
import type { BlogPost } from '@/lib/blog-types'

export function PostCard({ post }: { post: BlogPost }) {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
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
}
