#!/usr/bin/env npx tsx
/**
 * Recraft V3 SVG Generator for POSTED HAWAI'I
 *
 * Generates vector graphic elements via Replicate's Recraft V3 SVG model.
 * These are real SVG files with editable paths — not rasterized images.
 *
 * Usage:
 *   npx tsx scripts/recraft-generate.ts --prompt "bold wave pattern" --output wave.svg
 *   npx tsx scripts/recraft-generate.ts --prompt "Diamond Head silhouette" --output diamond-head.svg --style realistic_image
 *   npx tsx scripts/recraft-generate.ts --prompt "plumeria flower" --output plumeria.svg --size 1024x1024
 *
 * Environment:
 *   REPLICATE_API_TOKEN — your Replicate API token (set in .env.local)
 */

import { writeFileSync, readFileSync } from 'fs'
import { resolve, dirname } from 'path'

// Load env from multiple possible locations
const scriptDir = dirname(new URL(import.meta.url).pathname)
const envPaths = [
  resolve(scriptDir, '..', '.env.local'),
  resolve(scriptDir, '..', '.env'),
  resolve(scriptDir, '..', '..', 'posted-brain', '.env'),
]
for (const envPath of envPaths) {
  try {
    const envContent = readFileSync(envPath, 'utf-8')
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIdx = trimmed.indexOf('=')
      if (eqIdx === -1) continue
      const key = trimmed.slice(0, eqIdx)
      const value = trimmed.slice(eqIdx + 1)
      if (!process.env[key]) process.env[key] = value
    }
  } catch {
    // env file may not exist
  }
}

// Parse args
const args = process.argv.slice(2)
function getArg(flag: string): string | undefined {
  const idx = args.indexOf(flag)
  return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : undefined
}

const prompt = getArg('--prompt')
const outputFile = getArg('--output') || 'output.svg'
const style = getArg('--style') || 'any'
const size = getArg('--size') || '1024x1024'

if (!prompt) {
  console.log(`
POSTED DESIGN — Recraft V3 SVG Generator
═══════════════════════════════════════════

Usage: npx tsx scripts/recraft-generate.ts --prompt "description" [options]

Options:
  --prompt <text>     Description of the graphic to generate (required)
  --output <file>     Output filename (default: output.svg)
  --style <style>     Style preset (default: digital_illustration)
  --size <WxH>        Image size (default: 1024x1024)

Styles (SVG model):
  any                     Let Recraft choose (default, recommended)
  line_art                Clean line drawings
  engraving               Detailed engraving style
  linocut                 Bold linocut/woodblock style (great for streetwear)
  line_circuit            Circuit board / technical style

Size options:
  1024x1024, 1365x1024, 1024x1365, 1536x1024, 1024x1536,
  1820x1024, 1024x1820, 1024x2048, 2048x1024, 1434x1024,
  1024x1434, 1024x1280, 1280x1024, 1024x1707, 1707x1024

POSTED brand prompt tips:
  - Include "transparent background" for garment graphics
  - Include "suitable for screen printing" for print artwork
  - Reference hex colors: Coral #C4705A, Teal #2B6B7F, Palm #4A6741
  - Add "bold geometric" or "clean vector lines" for brand-aligned style

Examples:
  npx tsx scripts/recraft-generate.ts \\
    --prompt "Bold geometric ocean wave, Hawaiian style, clean vector lines, coral and teal, transparent background, streetwear" \\
    --output wave-graphic.svg

  npx tsx scripts/recraft-generate.ts \\
    --prompt "Minimalist Diamond Head crater silhouette, bold line art, single color, transparent background" \\
    --output diamond-head.svg --style line_art
`)
  process.exit(0)
}

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN
if (!REPLICATE_API_TOKEN) {
  console.error('Error: REPLICATE_API_TOKEN not set in .env.local')
  console.error('Get your token at https://replicate.com/account/api-tokens')
  process.exit(1)
}

const outputPath = resolve(
  dirname(new URL(import.meta.url).pathname),
  '..',
  'printify-artwork',
  'src',
  outputFile
)

async function createPrediction(): Promise<string> {
  // Use the model-based endpoint (no version hash needed)
  const res = await fetch('https://api.replicate.com/v1/models/recraft-ai/recraft-v3-svg/predictions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
      Prefer: 'wait',  // Wait up to 60s for result inline
    },
    body: JSON.stringify({
      input: {
        prompt,
        style,
        size,
      },
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Replicate API error ${res.status}: ${body}`)
  }

  const data = await res.json()

  // If Prefer: wait returned a completed result, stash it
  if (data.status === 'succeeded' && data.output) {
    (createPrediction as any)._immediateResult = data
  }

  return data.id
}

async function pollPrediction(id: string): Promise<string> {
  const maxWait = 120_000 // 2 minutes
  const interval = 2_000
  const start = Date.now()

  while (Date.now() - start < maxWait) {
    const res = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
      headers: { Authorization: `Bearer ${REPLICATE_API_TOKEN}` },
    })

    const data = await res.json()

    if (data.status === 'succeeded') {
      // Output is a URL to the SVG file
      const svgUrl = Array.isArray(data.output) ? data.output[0] : data.output
      if (!svgUrl) throw new Error('No output URL in prediction result')
      return svgUrl
    }

    if (data.status === 'failed' || data.status === 'canceled') {
      throw new Error(`Prediction ${data.status}: ${data.error || 'unknown error'}`)
    }

    // Still processing
    process.stdout.write('.')
    await new Promise((r) => setTimeout(r, interval))
  }

  throw new Error('Prediction timed out after 2 minutes')
}

async function downloadSvg(url: string): Promise<string> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to download SVG: ${res.status}`)
  return res.text()
}

async function main() {
  console.log(`\nPOSTED DESIGN — Recraft V3 SVG Generator`)
  console.log(`═══════════════════════════════════════════\n`)
  console.log(`Prompt:  ${prompt}`)
  console.log(`Style:   ${style}`)
  console.log(`Size:    ${size}`)
  console.log(`Output:  ${outputPath}\n`)

  process.stdout.write('Creating prediction')
  const predictionId = await createPrediction()
  process.stdout.write(` [${predictionId}]\n`)

  // Check if Prefer: wait already returned the result
  let svgUrl: string
  const immediate = (createPrediction as any)._immediateResult
  if (immediate) {
    const output = Array.isArray(immediate.output) ? immediate.output[0] : immediate.output
    svgUrl = output
    console.log('Result ready immediately!')
  } else {
    process.stdout.write('Waiting for result')
    svgUrl = await pollPrediction(predictionId)
    console.log(' done!')
  }

  console.log('Downloading SVG...')
  const svgContent = await downloadSvg(svgUrl)

  writeFileSync(outputPath, svgContent)
  console.log(`\n✓ Saved to ${outputPath}`)
  console.log(`  ${(svgContent.length / 1024).toFixed(1)} KB`)

  // Also save to the design directory for reference
  const designDir = resolve(
    dirname(new URL(import.meta.url).pathname),
    '..',
    '..',
    '..',
    'Documents',
    'posted-design',
    'recraft'
  )
  try {
    const { mkdirSync } = await import('fs')
    mkdirSync(designDir, { recursive: true })
    const refPath = resolve(designDir, outputFile)
    writeFileSync(refPath, svgContent)
    console.log(`  Also saved to ${refPath}`)
  } catch {
    // Design directory may not be writable, that's fine
  }
}

main().catch((err) => {
  console.error(`\nError: ${err.message}`)
  process.exit(1)
})
