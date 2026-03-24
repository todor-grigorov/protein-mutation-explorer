import { SubmissionForm } from '@/components/submission/SubmissionForm'
import { ExampleCollapsible } from '@/components/submission/ExampleCollapsible'

export default function HomePage() {
  return (
    <div className="flex flex-1 justify-center px-4 py-5 sm:px-8 md:px-20 lg:px-40">
      <div className="flex w-full max-w-[960px] flex-1 flex-col">
        <main className="flex-grow px-4 py-8 sm:px-6 lg:px-10">
          <div className="flex flex-col gap-8">
            {/* Heading */}
            <div className="flex flex-col gap-3">
              <h1 className="text-4xl leading-tight font-black tracking-[-0.033em] text-white">
                Predict the Impact of Protein Mutations
              </h1>
              <p className="text-text-muted text-base leading-normal font-normal">
                Enter UniProt IDs and mutations in the format: [UniProt ID] [Original Amino
                Acid][Position][New Amino Acid].
              </p>
            </div>

            <ExampleCollapsible />
            <SubmissionForm />
          </div>
        </main>
      </div>
    </div>
  )
}
