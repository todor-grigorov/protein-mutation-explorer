import Link from 'next/link'
import { ArrowLeft, CircleHelp, Search, Table2, Box, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

const faqs = [
  {
    question: 'What input format does the app accept?',
    answer:
      'Enter variants in the format "UniProtID A123C" or "UniProtID/A123C". You can submit a single variant or multiple variants, one per line.',
  },
  {
    question: 'Can I submit multiple variants at once?',
    answer:
      'Yes. Use Bulk Input mode and paste one variant per line. The app will return the matched variants and also report entries that were invalid or not found.',
  },
  {
    question: 'What happens if my variant is not found?',
    answer:
      'A variant can be syntactically valid but still not exist in the dataset used by this prototype. In that case, it will appear in the "not found" section of the results summary.',
  },
  {
    question: 'What happens if my input is invalid?',
    answer:
      'The submission form performs syntax validation. If one or more entries do not match the expected format, the form will show an error before submission.',
  },
  {
    question: 'What information is shown in the results table?',
    answer:
      'The results table shows the matched variant ID, protein ID, residue position, AlphaMissense prediction, ESM1b pathogenicity, stability prediction, interface/pocket annotations, and mechanistic label.',
  },
  {
    question: 'How does the structure viewer work?',
    answer:
      'When you select a variant in the results table, the app loads the structural model for the corresponding protein and highlights the selected residue position where possible.',
  },
  {
    question: 'Why does the structure change when I click another row?',
    answer:
      'The viewer is tied to the currently selected variant. If you select a variant from a different protein, the app loads the corresponding structural model for that protein.',
  },
  {
    question: 'Can I export the results?',
    answer:
      'Yes. The results page is designed to support CSV export of the currently returned variants.',
  },
  {
    question: 'Does this app cover all human proteins?',
    answer:
      'No. This prototype uses a limited dataset for a small set of proteins included in the assignment materials.',
  },
]

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Button
          asChild
          variant="outline"
          className="border-border-dark text-text-muted gap-2 hover:text-white"
        >
          <Link href="/">
            <ArrowLeft className="size-4" />
            Back to Search
          </Link>
        </Button>
      </div>

      <div className="space-y-10">
        <header className="space-y-4">
          <p className="text-primary text-sm font-semibold tracking-wide uppercase">Help & FAQ</p>
          <h1 className="text-4xl font-black tracking-[-0.03em] text-white sm:text-5xl">
            Using the Protein Mutation Explorer
          </h1>
          <p className="text-text-muted max-w-3xl text-base leading-7 sm:text-lg">
            This page explains how to submit variants, interpret results, and use the structure
            viewer effectively.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="border-border-dark bg-surface rounded-2xl border p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="bg-primary/10 text-primary rounded-xl p-2">
                <Search className="size-5" />
              </div>
              <h2 className="text-lg font-bold text-white">Submit variants</h2>
            </div>
            <p className="text-text-muted text-sm leading-7">
              Enter a single variant or paste multiple variants using the supported format. Bulk
              input accepts one variant per line.
            </p>
          </div>

          <div className="border-border-dark bg-surface rounded-2xl border p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="bg-primary/10 text-primary rounded-xl p-2">
                <Table2 className="size-5" />
              </div>
              <h2 className="text-lg font-bold text-white">Review results</h2>
            </div>
            <p className="text-text-muted text-sm leading-7">
              The results page shows all matching variants and summarizes inputs that were invalid
              or not found in the dataset.
            </p>
          </div>

          <div className="border-border-dark bg-surface rounded-2xl border p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="bg-primary/10 text-primary rounded-xl p-2">
                <Box className="size-5" />
              </div>
              <h2 className="text-lg font-bold text-white">Inspect structure</h2>
            </div>
            <p className="text-text-muted text-sm leading-7">
              Selecting a row updates the detail panel and loads the corresponding protein structure
              in the viewer.
            </p>
          </div>
        </section>

        <section className="border-border-dark bg-surface rounded-2xl border p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="bg-primary/10 text-primary rounded-xl p-2">
              <CircleHelp className="size-5" />
            </div>
            <h2 className="text-2xl font-bold tracking-[-0.02em] text-white">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="border-border-dark group rounded-xl border bg-slate-900/30 p-5"
              >
                <summary className="cursor-pointer list-none font-semibold text-white">
                  <span className="group-open:text-primary">{faq.question}</span>
                </summary>
                <p className="text-text-muted mt-3 text-sm leading-7">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="border-border-dark bg-surface rounded-2xl border p-6 sm:p-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-amber-500/10 p-2 text-amber-400">
              <AlertTriangle className="size-5" />
            </div>
            <h2 className="text-2xl font-bold tracking-[-0.02em] text-white">
              Interpretation note
            </h2>
          </div>

          <div className="space-y-3 text-sm leading-7 text-slate-300">
            <p>This application is intended as an exploration tool for prediction results.</p>
            <p>
              Model outputs and mechanistic labels should be interpreted in context and do not
              replace expert biological or clinical evaluation.
            </p>
            <p>
              Structural visualization provides additional context, but the primary output of the
              app is the mutation-level prediction data shown in the table and detail panels.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
