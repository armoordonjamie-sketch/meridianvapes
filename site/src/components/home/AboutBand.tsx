import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export function AboutBand() {
  return (
    <section className="container-page py-16">
      <div className="surface overflow-hidden rounded-2xl p-8 sm:p-12">
        <div className="max-w-3xl">
          <p className="eyebrow mb-3">About Meridian Vapes</p>
          <h2 className="text-2xl font-bold sm:text-3xl">
            A straightforward, local way to restock
          </h2>
          <p className="mt-4 text-base leading-relaxed text-silver-300">
            Meridian Vapes is a local vape delivery service for Eltham and the
            surrounding South East London area. We stock a focused range of refillable
            devices, e-liquids and accessories, and we deliver them locally with proper
            age verification — both at checkout and at the door.
          </p>
          <p className="mt-3 text-base leading-relaxed text-silver-400">
            We do not sell single-use disposable vapes, and our product information is
            kept factual: strengths, ratios and specifications, with no health claims.
          </p>
          <Link
            to="/about"
            className="mt-6 inline-flex items-center gap-2 font-semibold text-accent-300 hover:text-accent-200"
          >
            Read more about us
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
