export function Footer() {
  return (
    <footer className="border-border-dark mt-auto border-t px-4 py-6 sm:px-6 lg:px-10">
      <div className="text-text-muted flex flex-col items-center justify-between gap-4 text-sm sm:flex-row">
        <p>© 2025 MutationImpact. All rights reserved.</p>
        <div className="flex items-center gap-4 sm:gap-6">
          <a href="#" className="transition-colors hover:text-white">
            Terms of Service
          </a>
          <a href="#" className="transition-colors hover:text-white">
            Privacy Policy
          </a>
          <a href="#" className="transition-colors hover:text-white">
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}
