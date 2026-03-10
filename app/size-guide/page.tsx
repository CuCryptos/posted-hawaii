import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata = {
  title: 'Size Guide — POSTED HAWAI\u02BBI',
  description: 'Fit and measurement guide for all POSTED garments.',
}

const TEE_SIZES = [
  { size: 'S', chest: '40"', length: '28"' },
  { size: 'M', chest: '42"', length: '29"' },
  { size: 'L', chest: '44"', length: '30"' },
  { size: 'XL', chest: '46"', length: '31"' },
  { size: '2XL', chest: '48"', length: '32"' },
]

const HOODIE_SIZES = [
  { size: 'S', chest: '42"', length: '27"' },
  { size: 'M', chest: '44"', length: '28"' },
  { size: 'L', chest: '46"', length: '29"' },
  { size: 'XL', chest: '48"', length: '30"' },
  { size: '2XL', chest: '50"', length: '31"' },
]

function SizeTable({ rows }: { rows: { size: string; chest: string; length: string }[] }) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className="font-display text-xs font-bold uppercase tracking-[0.2em] text-asphalt py-3 px-4 text-left border-b border-asphalt/10">
            Size
          </th>
          <th className="font-display text-xs font-bold uppercase tracking-[0.2em] text-asphalt py-3 px-4 text-left border-b border-asphalt/10">
            Chest
          </th>
          <th className="font-display text-xs font-bold uppercase tracking-[0.2em] text-asphalt py-3 px-4 text-left border-b border-asphalt/10">
            Length
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.size}>
            <td className="font-body text-sm text-asphalt/70 py-3 px-4 border-b border-asphalt/10">
              {row.size}
            </td>
            <td className="font-body text-sm text-asphalt/70 py-3 px-4 border-b border-asphalt/10">
              {row.chest}
            </td>
            <td className="font-body text-sm text-asphalt/70 py-3 px-4 border-b border-asphalt/10">
              {row.length}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default function SizeGuidePage() {
  return (
    <>
      <Navbar />
      <main className="bg-cream min-h-screen">
        <div className="h-20" />

        <div className="max-w-3xl mx-auto px-6 py-24">
          <h1 className="font-display font-black text-3xl uppercase text-asphalt tracking-tight text-center">
            Size Guide
          </h1>
          <p className="font-body text-base text-asphalt/50 mt-2 text-center mb-12">
            All measurements in inches.
          </p>

          {/* Fit Note */}
          <div className="bg-warm-sand p-6 mb-12">
            <p className="font-body text-sm text-asphalt/70 leading-relaxed">
              All POSTED tees are designed with a relaxed fit. Size up one for an oversized look.
              Our model is 5&apos;10&quot; / 175cm and wears size L in all tees.
            </p>
          </div>

          {/* Tees */}
          <h2 className="font-display font-bold text-lg uppercase text-asphalt tracking-tight mt-12 mb-4">
            Tees
          </h2>
          <SizeTable rows={TEE_SIZES} />

          {/* Hoodies */}
          <h2 className="font-display font-bold text-lg uppercase text-asphalt tracking-tight mt-12 mb-4">
            Hoodies
          </h2>
          <SizeTable rows={HOODIE_SIZES} />

          {/* Care */}
          <h2 className="font-display font-bold text-lg uppercase text-asphalt tracking-tight mt-12 mb-4">
            Care
          </h2>
          <div className="font-body text-sm text-asphalt/70 space-y-2">
            <p>&bull; Machine wash cold, inside out</p>
            <p>&bull; Tumble dry low or hang dry</p>
            <p>&bull; Do not bleach</p>
            <p>&bull; Do not iron over print</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
