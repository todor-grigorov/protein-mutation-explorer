import Link from 'next/link'
import { ArrowLeft, Database, FlaskConical, Search, Box, BarChart2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AboutPage() {
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
          <p className="text-primary text-sm font-semibold tracking-wide uppercase">About</p>
          <h1 className="text-4xl font-black tracking-[-0.03em] text-white sm:text-5xl">
            Protein Mutation Impact Explorer
          </h1>
          <p className="text-text-muted max-w-3xl text-base leading-7 sm:text-lg">
            This prototype is a web application for exploring predicted effects of human missense
            variants across a small set of proteins. It is designed to make mutation-level
            prediction results easier to search, review, and interpret in a scientist-friendly
            interface.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="border-border-dark bg-surface rounded-2xl border p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="bg-primary/10 text-primary rounded-xl p-2">
                <Search className="size-5" />
              </div>
              <h2 className="text-lg font-bold text-white">What this app does</h2>
            </div>
            <p className="text-text-muted leading-7">
              Users can submit one or more variants in the format{' '}
              <span className="font-mono text-white">UniProtID A123C</span> and retrieve prediction
              results for variants that exist in the dataset. The results page presents matched
              variants in a searchable table and supports inspection of the selected variant in more
              detail.
            </p>
          </div>

          <div className="border-border-dark bg-surface rounded-2xl border p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="bg-primary/10 text-primary rounded-xl p-2">
                <Database className="size-5" />
              </div>
              <h2 className="text-lg font-bold text-white">Dataset</h2>
            </div>
            <p className="text-text-muted leading-7">
              This prototype uses a subset of predicted missense variant data for three proteins.
              Each row in the dataset represents a single amino acid substitution and includes
              multiple model outputs and structural annotations.
            </p>
          </div>

          <div className="border-border-dark bg-surface rounded-2xl border p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="bg-primary/10 text-primary rounded-xl p-2">
                <FlaskConical className="size-5" />
              </div>
              <h2 className="text-lg font-bold text-white">Prediction fields</h2>
            </div>
            <p className="text-text-muted leading-7">
              Results include AlphaMissense predictions, ESM1b-based pathogenicity, predicted
              stability effects, pocket/interface annotations, and a mechanistic label summarizing
              the likely mode of impact.
            </p>
          </div>

          <div className="border-border-dark bg-surface rounded-2xl border p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="bg-primary/10 text-primary rounded-xl p-2">
                <Box className="size-5" />
              </div>
              <h2 className="text-lg font-bold text-white">Structural context</h2>
            </div>
            <p className="text-text-muted leading-7">
              Where available, the selected variant can be explored in the context of a structural
              model of its protein. This helps connect mutation-level predictions with residue
              position and 3D protein context.
            </p>
          </div>

          <div className="border-border-dark bg-surface rounded-2xl border p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="bg-primary/10 text-primary rounded-xl p-2">
                <BarChart2 className="size-5" />
              </div>
              <h2 className="text-lg font-bold text-white">Analysis tools</h2>
            </div>
            <p className="text-text-muted leading-7">
              Results include distribution charts summarising pathogenicity classifications and
              mechanistic labels across submitted variants. Individual variants can be compared side
              by side, and recent searches are saved locally for quick access.
            </p>
          </div>
        </section>

        <section className="border-border-dark bg-surface rounded-2xl border p-6 sm:p-8">
          <h2 className="mb-4 text-2xl font-bold tracking-[-0.02em] text-white">
            How to use the app
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-slate-900/40 p-4">
              <p className="text-primary mb-2 text-sm font-semibold">1. Submit variants</p>
              <p className="text-text-muted text-sm leading-6">
                Enter one variant or paste multiple variants, one per line, using the supported
                format.
              </p>
            </div>
            <div className="rounded-xl bg-slate-900/40 p-4">
              <p className="text-primary mb-2 text-sm font-semibold">2. Review matches</p>
              <p className="text-text-muted text-sm leading-6">
                The results page shows variants found in the dataset, together with invalid or
                not-found entries.
              </p>
            </div>
            <div className="rounded-xl bg-slate-900/40 p-4">
              <p className="text-primary mb-2 text-sm font-semibold">3. Inspect and compare</p>
              <p className="text-text-muted text-sm leading-6">
                Select a row to inspect scores and structural context. Use the comparison tool to
                analyse two variants side by side.
              </p>
            </div>
          </div>
        </section>

        <section className="border-border-dark bg-surface rounded-2xl border p-6 sm:p-8">
          <h2 className="mb-4 text-2xl font-bold tracking-[-0.02em] text-white">Notes</h2>
          <div className="space-y-3 text-sm leading-7 text-slate-300">
            <p>
              This application is a prototype intended for exploration and interface evaluation.
            </p>
            <p>
              Client-side validation checks the syntax of submitted variants, while variant
              existence is determined by the backend dataset.
            </p>
            <p>
              Structural visualization is provided as contextual support and should be interpreted
              together with the tabular prediction outputs.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
