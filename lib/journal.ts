export type JournalEntry = {
  slug: string
  title: string
  category: string
  date: string
  excerpt: string
  image: string
  content: string
}

export const JOURNAL_ENTRIES: JournalEntry[] = [
  {
    slug: 'drop-001-posted-up',
    title: 'Drop 001 — POSTED UP Is Here',
    category: 'Drops',
    date: '2026-03-15',
    image: '/images/hero/homepage-hero.png',
    excerpt:
      'The first drop. Core everyday pieces for the crew — heavyweight tees, pullover hoodies, and structured snapbacks, all designed in Honolulu.',
    content: `<p>This is it. The first official POSTED drop.</p>
<p>We built POSTED UP around one idea: everyday pieces you actually want to wear. No gimmicks, no limited hype drops that sell out in 30 seconds and sit in a closet. Just heavyweight tees, pullover hoodies, and structured snapbacks — the stuff your crew actually rocks.</p>
<p>Every piece in Drop 001 was designed in Honolulu. The Sandy\u2019s Tee is named after the break that humbles everyone. The Diamond Head Hoodie carries an icon you can see from almost anywhere on the south shore. The OG Cap is exactly what it sounds like — the original, no debate.</p>
<p>We kept the color palette tight: volcanic blacks, coral accents, warm neutrals. The kind of tones that feel right whether you\u2019re posted up in Kaka\u02BBako or catching the last light at Ala Moana.</p>
<p>POSTED UP is the foundation. Everything we build from here starts with these pieces. You know where to find us.</p>`,
  },
  {
    slug: 'a-day-in-kakaako',
    title: "A Day in Kaka\u02BBako",
    category: 'Culture',
    date: '2026-03-10',
    image: '/images/lifestyle/kakaako-hoodie.png',
    excerpt:
      "From the murals to the markets — why Kaka\u02BBako is the heartbeat of Honolulu\u2019s creative scene and POSTED\u2019s home base.",
    content: `<p>If you want to understand POSTED, start in Kaka\u02BBako.</p>
<p>This is where the murals go up every year, where the warehouses turned into studios, where the food trucks line up on Saturdays. It\u2019s not polished. It\u2019s not trying to be. That\u2019s the whole point.</p>
<p>We shoot here because it looks like us. The concrete, the color, the mix of old and new. You can walk two blocks and go from a 50-year-old plate lunch spot to a gallery opening. That energy — local roots meeting creative ambition — is what POSTED is about.</p>
<p>Kaka\u02BBako isn\u2019t a backdrop. It\u2019s the blueprint.</p>`,
  },
  {
    slug: 'making-the-sandys-tee',
    title: "Making the Sandy\u2019s Tee",
    category: 'Process',
    date: '2026-03-08',
    image: '/images/products/sandys-tee-black.png',
    excerpt:
      'Behind the design of our wave graphic tee — from Recraft vectors to the final print.',
    content: `<p>The Sandy\u2019s Tee started with one rule: the wave had to hit as hard as the break it\u2019s named after.</p>
<p>We generated the initial graphic using Recraft V3 — bold geometric lines, red and blue tones inspired by classic Japanese wave art but filtered through a Hawaiian streetwear lens. The vector came out clean enough to screen print, which was the goal from day one.</p>
<p>From there it went into Figma for cleanup. We tightened the lines, adjusted the color balance to match our coral and teal palette, and made sure the triangle frame held the composition at any size. The POSTED HAWAI\u02BBI tag sits at the collar — subtle, not screaming.</p>
<p>The blank is a heavyweight oversized boxy cut in white. We wanted the graphic to do the talking. No extra branding, no sleeve prints, no back hit. Just the wave.</p>
<p>Named after Sandy Beach because if you\u2019ve been out there, you know — it doesn\u2019t care about your reputation. It just is what it is. That\u2019s the energy.</p>`,
  },
  {
    slug: 'where-were-posted',
    title: "Where We\u2019re Posted",
    category: 'Community',
    date: '2026-03-05',
    image: '/images/products/og-cap-black.png',
    excerpt:
      "POSTED isn\u2019t just a brand name — it\u2019s how we move. A look at the spots and the crew that make this thing real.",
    content: `<p>The name came first. Before the logo, before the tees, before any of it — there was the phrase.</p>
<p>\u201CWhere you at?\u201D \u201CPosted.\u201D That\u2019s it. No address needed. Your crew knows. You\u2019re at the spot — the one you always end up at. Maybe it\u2019s the wall outside 7-Eleven in Kaimuk\u012B. Maybe it\u2019s the bench at Ala Moana. Maybe it\u2019s someone\u2019s garage with the door up.</p>
<p>POSTED is a state of being. It means you\u2019re present. You\u2019re not rushing to the next thing. You\u2019re here, with your people, and that\u2019s enough.</p>
<p>We built this brand around that feeling because Honolulu runs on it. The best conversations, the best sessions, the best nights — they all start with someone being posted somewhere, and the crew showing up.</p>
<p>You know where to find us.</p>`,
  },
]

export function getJournalEntry(slug: string): JournalEntry | undefined {
  return JOURNAL_ENTRIES.find((e) => e.slug === slug)
}

export function getAdjacentEntries(slug: string): {
  prev: JournalEntry | null
  next: JournalEntry | null
} {
  const index = JOURNAL_ENTRIES.findIndex((e) => e.slug === slug)
  return {
    prev: index > 0 ? JOURNAL_ENTRIES[index - 1] : null,
    next: index < JOURNAL_ENTRIES.length - 1 ? JOURNAL_ENTRIES[index + 1] : null,
  }
}
