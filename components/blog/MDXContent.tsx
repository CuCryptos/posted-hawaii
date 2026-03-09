'use client'

import { MDXRemote } from 'next-mdx-remote/rsc'
import Image from 'next/image'

const components = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="font-display font-black text-[1.25rem] uppercase tracking-tight text-asphalt mt-12 mb-4"
      {...props}
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className="font-display font-bold text-[1rem] uppercase tracking-tight text-asphalt mt-8 mb-3"
      {...props}
    />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="font-body text-[15px] text-asphalt/80 leading-relaxed mb-6" {...props} />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-display font-bold text-asphalt" {...props} />
  ),
  em: (props: React.HTMLAttributes<HTMLElement>) => (
    <em className="font-body italic" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="font-body text-[15px] text-asphalt/80 leading-relaxed mb-6 list-disc pl-6 space-y-2" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="font-body text-[15px] text-asphalt/80 leading-relaxed mb-6 list-decimal pl-6 space-y-2" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-2 border-coral pl-6 my-8 font-body italic text-[17px] text-asphalt/70 leading-relaxed"
      {...props}
    />
  ),
  hr: () => <hr className="border-asphalt/10 my-12" />,
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <span className="block my-8 relative aspect-[16/9] overflow-hidden">
      <Image
        src={typeof props.src === 'string' ? props.src : ''}
        alt={props.alt || ''}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 720px"
      />
    </span>
  ),
}

export function MDXContent({ source }: { source: string }) {
  return (
    <div className="max-w-2xl">
      <MDXRemote source={source} components={components} />
    </div>
  )
}
