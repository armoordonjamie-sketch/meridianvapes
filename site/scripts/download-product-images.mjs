/**
 * Downloads retailer product pack shots into public/products/.
 * Re-run when adding catalogue items: node scripts/download-product-images.mjs
 *
 * Sources are third-party CDN URLs (Shopify) used for mock catalogue imagery only.
 */

import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '../public/products')

/** slug -> remote image URL */
const SOURCES = {
  'vaporesso-xros-5-pod-kit':
    'https://cdn.shopify.com/s/files/1/0517/8739/9350/files/XROS5-CosmicBlack.png?v=1753025681',
  'oxva-xlim-pro-2-pod-kit':
    'https://cdn.shopify.com/s/files/1/0241/2241/files/Black-Carbon-Oxva-Xlim-Pro-V2-Vape-Pod-Kit.jpg?v=1721307900',
  'uwell-caliburn-g3-pod-kit':
    'https://cdn.shopify.com/s/files/1/0241/2241/products/Uwell-caliburn-G3-pod-kit-2ml-Black-2mg.jpg?v=1694168238',
  'aspire-flexus-q-pod-kit':
    'https://cdn.shopify.com/s/files/1/0884/8221/8249/files/aspire-flexus-q-kit-8933067.jpg?v=1770920765',
  'ivg-pro-rainbow-burst-vape-kit':
    'https://cdn.shopify.com/s/files/1/0565/3426/9997/files/IVG_Pro_12_Vape_Kit_Rainbow_Burst.png?v=1774625963',
  'ivg-pro-blue-raspberry-ice-vape-kit':
    'https://cdn.shopify.com/s/files/1/0565/3426/9997/files/ivg-pro-12-10000-puff-vape-kit-blue-raspberry-ice.jpg?v=1744969268',
  'ivg-pro-fresh-mint-vape-kit':
    'https://cdn.shopify.com/s/files/1/0565/3426/9997/files/IVG_Pro_12_Vape_Fresh_Mint_Kit_afc05100-5cd6-4e83-bd0a-9c327112ac53.png?v=1753086817',
  'strawberry-nic-salt-10ml':
    'https://cdn.shopify.com/s/files/1/0517/8739/9350/files/IVG_INTENSE_Salts_Thumbnail_Strawberry_Sensation_grande_10mg.jpg?v=1753883279',
  'menthol-nic-salt-10ml':
    'https://cdn.shopify.com/s/files/1/0241/2241/files/Nasty-Liq-Nic-Salt-E-Liquid-Menthol.jpg?v=1707308160',
  'vanilla-custard-50ml-shortfill':
    'https://cdn.shopify.com/s/files/1/0241/2241/files/Vanilla-Custard-Drifter-Bar-Juice-Desserts-Shortfills-100ml.webp?v=1765453684',
  'mixed-berries-nic-salt-10ml':
    'https://cdn.shopify.com/s/files/1/0241/2241/files/Mixed-Berries-Elux-Firerose-Nic-Salt-E-liquid.jpg?v=1749792549',
  'vaporesso-xros-replacement-pods-2-pack':
    'https://cdn.shopify.com/s/files/1/0517/8739/9350/files/Vaporesso_XROS_COREX_3.0_Replacement_Pods.webp?v=1761309494',
  'mesh-coils-0-6ohm-5-pack':
    'https://cdn.shopify.com/s/files/1/0241/2241/products/Flexus-Q-0.6ohm.jpg?v=1636197780',
  'nic-shot-18mg-10ml':
    'https://cdn.shopify.com/s/files/1/0565/3426/9997/files/nic-nic-50vg-18mg-nic-shot-10ml-bottle.jpg?v=1744969682',
  'nic-shot-18mg-70vg-10ml':
    'https://cdn.shopify.com/s/files/1/0241/2241/products/Nic-Nic-Nicotine-Shot.jpg?v=1637234919',
  'usb-c-charging-cable':
    'https://cdn.shopify.com/s/files/1/0241/2241/files/Aspire-USB-Type-C-Charging-Cable.jpg?v=1739797378',
  '18650-battery-charger':
    'https://cdn.shopify.com/s/files/1/0241/2241/products/chargers-nitecore-new-i2-intellicharger-1.jpg?v=1637313750',
  'vaporesso-xros-4-mini-pod-kit':
    'https://cdn.shopify.com/s/files/1/0241/2241/files/Vaporesso-XROS-4-Mini-Pod-Kit-Black.jpg?v=1712317778',
  'oxva-xlim-se-2-pod-kit':
    'https://cdn.shopify.com/s/files/1/0241/2241/files/Oxva-Xlim-SE-2-Pod-Kit-Black.jpg?v=1702442951',
  'ivg-pro-lemon-lime-vape-kit':
    'https://cdn.shopify.com/s/files/1/0565/3426/9997/files/ivg-pro-12-10000-puff-vape-kit-lemon-lime.jpg?v=1744969266',
  'ivg-pro-strawberry-watermelon-vape-kit':
    'https://cdn.shopify.com/s/files/1/0565/3426/9997/files/ivg-pro-12-10000-puff-vape-kit-strawberry-watermelon.jpg?v=1744969264',
  'blueberry-nic-salt-10ml':
    'https://cdn.shopify.com/s/files/1/0241/2241/files/bar-juice-5000-nic-salt-eliquid-blueberry.jpg?v=1704723800',
  'tobacco-nic-salt-10ml':
    'https://cdn.shopify.com/s/files/1/0241/2241/files/Straight-Tobacco-elux-legend-nic-salts-eliquid-vape-juice.jpg?v=1736486494',
  'lemon-lime-nic-salt-10ml':
    'https://cdn.shopify.com/s/files/1/0517/8739/9350/files/ivg-intense-nic-salts-eliquid-LEMON-LIME-10MG.jpg?v=1753708901',
  'mango-ice-50ml-shortfill':
    'https://cdn.shopify.com/s/files/1/0241/2241/files/Mango-Ice-Drifter-Bar-Juice-100ml-Shortfill-E-Liquid.jpg?v=1737373987',
  'oxva-xlim-replacement-pods-3-pack':
    'https://cdn.shopify.com/s/files/1/0241/2241/products/OxvaXlimV2ReplacementPods3PcsPack.jpg?v=1667395903',
  'uwell-caliburn-g4-pods-2-pack':
    'https://cdn.shopify.com/s/files/1/0241/2241/files/Flamingo-Red-Uwell-Caliburn-G4-Pod-Kit.jpg?v=1743147087',
  'aspire-flexus-af-mesh-coils-5-pack':
    'https://cdn.shopify.com/s/files/1/0241/2241/products/Flexus-Q-0.6ohm.jpg?v=1636197780',
  'nic-shot-salt-20mg-10ml':
    'https://cdn.shopify.com/s/files/1/0241/2241/products/nicnic_salt_50vg_20mg_boxandbottle.jpg?v=1637259226',
  'usb-c-charging-cable-1m':
    'https://cdn.shopify.com/s/files/1/0241/2241/files/Aspire-USB-Type-C-Charging-Cable.jpg?v=1739797378',
}

function extFromUrl(url) {
  const pathname = new URL(url).pathname
  const ext = path.extname(pathname).toLowerCase()
  if (ext === '.jpeg') return '.jpg'
  return ext || '.jpg'
}

async function download(slug, url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'MeridianVapes-AssetSync/1.0' },
  })
  if (!res.ok) throw new Error(`${slug}: HTTP ${res.status}`)
  const ext = extFromUrl(url)
  const dest = path.join(outDir, `${slug}${ext}`)
  const buf = Buffer.from(await res.arrayBuffer())
  await writeFile(dest, buf)
  return `/products/${slug}${ext}`
}

await mkdir(outDir, { recursive: true })

const manifest = {}
for (const [slug, url] of Object.entries(SOURCES)) {
  const src = await download(slug, url)
  manifest[slug] = src
  console.log(`ok ${slug} -> ${src}`)
}

await writeFile(
  path.join(outDir, 'manifest.json'),
  JSON.stringify(manifest, null, 2) + '\n',
)
