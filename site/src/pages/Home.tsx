import { Seo } from '@/lib/seo/Seo'
import { Hero } from '@/components/home/Hero'
import { TrustStrip } from '@/components/home/TrustStrip'
import { CategoryGrid } from '@/components/home/CategoryGrid'
import { HowItWorks } from '@/components/home/HowItWorks'
import { AboutBand } from '@/components/home/AboutBand'
import { localBusinessSchema, organizationSchema } from '@/lib/seo/jsonld'
import { siteConfig } from '@/config/site'

export default function Home() {
  return (
    <>
      <Seo
        title={`${siteConfig.name} — ${siteConfig.tagline}`}
        description={siteConfig.description}
        path="/"
        rawTitle
        jsonLd={[localBusinessSchema(), organizationSchema()]}
      />
      <Hero />
      <TrustStrip />
      <CategoryGrid />
      <HowItWorks />
      <AboutBand />
    </>
  )
}
