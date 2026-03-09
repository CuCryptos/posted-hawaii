import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Container } from '@/components/ui/Container'
import { PageHero } from '@/components/ui/PageHero'
import { BlogListClient } from '@/components/blog/BlogListClient'
import { getAllPosts } from '@/lib/blog'

export const metadata = {
  title: 'Blog — POSTED HAWAI\u02BBI',
  description: 'Drops, lookbooks, culture, and behind-the-scenes from POSTED.',
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <>
      <Navbar />
      <main className="bg-cream min-h-screen">
        <PageHero title="Blog" subtitle="Drops, lookbooks, and stories from the crew." />
        <Container className="py-10 lg:py-12">
          <BlogListClient posts={posts} />
        </Container>
      </main>
      <Footer />
    </>
  )
}
