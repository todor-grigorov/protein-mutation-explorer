import Link from 'next/link'

export function Navbar() {
  return (
    <header className="border-border-dark flex items-center justify-between border-b px-6 py-3 whitespace-nowrap lg:px-10">
      <Link href="/" className="flex items-center gap-4 text-white">
        <div className="text-primary size-5">
          <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path
              clipRule="evenodd"
              d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z"
              fill="currentColor"
              fillRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="text-lg leading-tight font-bold tracking-[-0.015em] text-white">
          MutationImpact
        </h2>
      </Link>

      <nav className="hidden items-center gap-9 md:flex">
        <Link
          href="/"
          className="text-text-muted text-sm leading-normal font-medium transition-colors hover:text-white"
        >
          Home
        </Link>
        <Link
          href="/about"
          className="text-text-muted text-sm leading-normal font-medium transition-colors hover:text-white"
        >
          About
        </Link>
        <Link
          href="/help"
          className="text-text-muted text-sm leading-normal font-medium transition-colors hover:text-white"
        >
          Help/FAQ
        </Link>
      </nav>
    </header>
  )
}
