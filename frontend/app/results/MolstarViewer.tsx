'use client'

import { useEffect, useRef } from 'react'
import { getStructureUrl } from '@/lib/api/structures'

interface MolstarViewerProps {
  proteinId: string
  highlightPosition?: number
}

export function MolstarViewer({ proteinId, highlightPosition }: MolstarViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pluginRef = useRef<any>(null)

  useEffect(() => {
    if (!containerRef.current) return

    let cancelled = false

    async function initViewer() {
      const { createPluginUI } = await import('molstar/lib/mol-plugin-ui')
      const { renderReact18 } = await import('molstar/lib/mol-plugin-ui/react18')
      const { DefaultPluginUISpec } = await import('molstar/lib/mol-plugin-ui/spec')
      const { PluginConfig } = await import('molstar/lib/mol-plugin/config')

      if (cancelled || !containerRef.current) return

      // Dispose previous instance
      if (pluginRef.current) {
        pluginRef.current.dispose()
        pluginRef.current = null
      }

      const plugin = await createPluginUI({
        target: containerRef.current,
        render: renderReact18,
        spec: {
          ...DefaultPluginUISpec(),
          config: [[PluginConfig.Viewport.ShowAnimation, false]],
          layout: {
            initial: {
              isExpanded: false,
              showControls: false,
              regionState: {
                top: 'hidden',
                left: 'hidden',
                right: 'hidden',
                bottom: 'hidden',
              },
            },
          },
        },
      })

      if (cancelled) {
        plugin.dispose()
        return
      }

      pluginRef.current = plugin

      // Load structure
      const structureUrl = getStructureUrl(proteinId)

      await plugin.builders.data.download(
        { url: structureUrl, isBinary: false },
        { state: { isGhost: true } }
      )

      const data = await plugin.builders.data.download({
        url: structureUrl,
      })

      const trajectory = await plugin.builders.structure.parseTrajectory(data, 'pdb')

      await plugin.builders.structure.hierarchy.applyPreset(trajectory, 'default')

      // Highlight residue if position provided
      if (highlightPosition) {
        await highlightResidue(plugin, highlightPosition)
      }
    }

    initViewer().catch(console.error)

    return () => {
      cancelled = true
      if (pluginRef.current) {
        pluginRef.current.dispose()
        pluginRef.current = null
      }
    }
  }, [proteinId])

  // Update highlight when position changes without reloading structure
  useEffect(() => {
    if (!pluginRef.current || !highlightPosition) return
    highlightResidue(pluginRef.current, highlightPosition).catch(console.error)
  }, [highlightPosition])

  return (
    <div className="border-border-dark relative aspect-[4/3] w-full overflow-hidden rounded-lg border bg-slate-900">
      <div ref={containerRef} className="absolute inset-0" />

      {/* Legend */}
      <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg bg-slate-800/70 p-3 text-xs backdrop-blur-sm">
        <p className="mb-2 font-bold text-white">Legend</p>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#D9006C]" />
            <span className="text-text-muted">Selected Mutation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-[#00BCD4] opacity-60" />
            <span className="text-text-muted">Predicted Pocket</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-[#FFC107] opacity-60" />
            <span className="text-text-muted">Predicted Interface</span>
          </div>
        </div>
      </div>
    </div>
  )
}

async function highlightResidue(plugin: any, position: number) {
  const { Script } = await import('molstar/lib/mol-script/script')
  const { StructureSelection } = await import('molstar/lib/mol-model/structure')
  const { setSubtreeVisibility } = await import('molstar/lib/mol-plugin/behavior/static/state')

  try {
    const data = plugin.managers.structure.hierarchy.current.structures[0]?.cell.obj?.data
    if (!data) return

    const selection = Script.getStructureSelection(
      (Q) =>
        Q.struct.generator.atomGroups({
          'residue-test': Q.core.rel.eq([
            Q.struct.atomProperty.macromolecular.label_seq_id(),
            position,
          ]),
        }),
      data
    )

    const loci = StructureSelection.toLociWithSourceUnits(selection)
    plugin.managers.camera.focusLoci(loci)
    plugin.managers.interactivity.lociHighlights.highlightOnly({
      loci,
    })
  } catch (e) {
    console.warn('Could not highlight residue:', e)
  }
}
