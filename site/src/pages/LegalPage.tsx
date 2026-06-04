import { Seo } from '@/lib/seo/Seo'
import { PageHeader } from '@/components/common/PageHeader'
import { breadcrumbSchema } from '@/lib/seo/jsonld'
import { getLegalDoc } from '@/data/legal'
import NotFound from './NotFound'

/** Renders a single legal/policy document by slug (one route each). */
export default function LegalPage({ slug }: { slug: string }) {
  const doc = getLegalDoc(slug)
  if (!doc) return <NotFound />

  const path = `/${doc.slug}`
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: doc.title, path },
  ]
  const updated = new Date(doc.updated).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <>
      <Seo
        title={doc.title}
        description={doc.description}
        path={path}
        jsonLd={breadcrumbSchema(crumbs)}
      />

      <PageHeader title={doc.title} crumbs={crumbs} />

      <div className="container-page py-12">
        <div className="mx-auto max-w-3xl">
          <p className="mb-8 text-sm text-silver-500">Last updated: {updated}</p>

          <div className="mb-8 rounded-xl border border-amber-500/25 bg-amber-500/[0.06] p-4 text-sm text-amber-200/90">
            {doc.intro}
          </div>

          <div className="prose-mv">
            {doc.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.blocks.map((block, i) =>
                  block.type === 'p' ? (
                    <p key={i}>{block.text}</p>
                  ) : (
                    <ul key={i}>
                      {block.items.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  ),
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
