/**
 * Strips light pack-shot backgrounds for hero floating tiles.
 * Output: public/products/hero/{slug}.png
 *
 * node scripts/hero-product-cutouts.mjs
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const productsDir = path.join(__dirname, '../public/products')
const heroDir = path.join(productsDir, 'hero')
const assetsHeroDir = path.join(__dirname, '../src/assets/hero')

/** Hero FEATURED slugs (see Hero.tsx) */
const HERO_SLUGS = [
  'ivg-pro-rainbow-burst-vape-kit',
  'vaporesso-xros-5-pod-kit',
  'strawberry-nic-salt-10ml',
]

const manifest = JSON.parse(
  await readFile(path.join(productsDir, 'manifest.json'), 'utf8'),
)

function backgroundAlpha(r, g, b) {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const sat = max === 0 ? 0 : (max - min) / max

  // Near-white / light grey studio backgrounds
  if (min >= 235 && sat < 0.12) return 0
  if (min >= 210 && sat < 0.06) return 0

  // Soft edge on off-white
  if (min >= 200 && sat < 0.1) {
    return Math.round(255 * (1 - (min - 200) / 35))
  }

  return 255
}

async function cutout(slug) {
  const rel = manifest[slug]?.replace(/^\//, '')
  if (!rel) throw new Error(`No manifest entry for ${slug}`)
  const input = path.join(__dirname, '../public', rel)

  const { data, info } = await sharp(input)
    .ensureAlpha()
    .resize(800, 800, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .raw()
    .toBuffer({ resolveWithObject: true })

  const pixels = Buffer.from(data)
  for (let i = 0; i < pixels.length; i += 4) {
    const a = backgroundAlpha(pixels[i], pixels[i + 1], pixels[i + 2])
    pixels[i + 3] = Math.min(pixels[i + 3], a)
  }

  const png = await sharp(pixels, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer()

  await writeFile(path.join(heroDir, `${slug}.png`), png)
  await writeFile(path.join(assetsHeroDir, `${slug}.png`), png)

  return `/products/hero/${slug}.png`
}

await mkdir(heroDir, { recursive: true })
await mkdir(assetsHeroDir, { recursive: true })

const outManifest = {}
for (const slug of HERO_SLUGS) {
  outManifest[slug] = await cutout(slug)
  console.log(`ok ${slug}`)
}

await import('node:fs/promises').then(({ writeFile }) =>
  writeFile(
    path.join(heroDir, 'manifest.json'),
    JSON.stringify(outManifest, null, 2) + '\n',
  ),
)
