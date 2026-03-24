export function ExampleCollapsible() {
  return (
    <details className="border-border-dark bg-surface/50 group flex flex-col rounded-lg border px-4 py-2">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-2">
        <p className="text-sm leading-normal font-medium text-white">Show Example</p>
        <div className="text-white transition-transform group-open:rotate-180">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </summary>
      <p className="text-text-muted pb-2 font-mono text-sm leading-normal font-normal">
        Q7Z4H8 A126C
        <br />
        P12235 L100A
        <br />
        Q8IUR5 A100C
      </p>
    </details>
  )
}
