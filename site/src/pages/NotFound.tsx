import { Link } from 'react-router-dom'
import { Seo } from '@/lib/seo/Seo'

export default function NotFound() {
  return (
    <>
      <Seo
        title="Page not found"
        description="The page you were looking for could not be found."
        path="/404"
        noindex
      />
      <div className="container-page flex min-h-[50vh] flex-col items-center justify-center py-20 text-center">
        <p className="text-6xl font-extrabold text-accent-500">404</p>
        <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
        <p className="mt-2 max-w-md text-silver-400">
          The page you were looking for doesn’t exist or has moved.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            to="/"
            className="inline-flex h-11 items-center rounded-xl bg-accent-600 px-5 font-semibold text-white hover:bg-accent-500"
          >
            Back to home
          </Link>
          <Link
            to="/shop"
            className="inline-flex h-11 items-center rounded-xl border border-white/15 px-5 font-semibold text-silver-100 hover:bg-white/5"
          >
            Go to shop
          </Link>
        </div>
      </div>
    </>
  )
}
