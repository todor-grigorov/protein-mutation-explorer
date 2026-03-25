'use client'

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { useMemo } from 'react'
import type { ProteinVariantResponse } from '@/types/api'

interface DistributionChartsProps {
  variants: ProteinVariantResponse[]
}

// Color maps matching existing badge colors
const AM_CLASS_COLORS: Record<string, string> = {
  Pathogenic: '#ef4444',
  Ambiguous: '#f97316',
  Benign: '#22c55e',
}

const MECHANISTIC_COLORS: Record<string, string> = {
  Unassigned: '#6b7280',
  Stability: '#60a5fa',
  Pockets: '#c084fc',
  Interface: '#22d3ee',
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; payload: { name: string } }>
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null

  return (
    <div className="border-border-dark bg-surface rounded-lg border px-3 py-2 text-xs shadow-lg">
      <p className="font-medium text-white">{payload[0].payload.name}</p>
      <p className="text-text-muted">
        Count: <span className="font-medium text-white">{payload[0].value}</span>
      </p>
    </div>
  )
}

function CustomBarTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null

  return (
    <div className="border-border-dark bg-surface rounded-lg border px-3 py-2 text-xs shadow-lg">
      <p className="font-medium text-white">{payload[0].payload.name}</p>
      <p className="text-text-muted">
        Count: <span className="font-medium text-white">{payload[0].value}</span>
      </p>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-center text-sm font-medium text-white">{children}</p>
}

export function DistributionCharts({ variants }: DistributionChartsProps) {
  // AM Class distribution
  const amClassData = useMemo(() => {
    const counts: Record<string, number> = {
      Pathogenic: 0,
      Ambiguous: 0,
      Benign: 0,
    }
    variants.forEach((v) => {
      counts[v.amClass] = (counts[v.amClass] ?? 0) + 1
    })
    return Object.entries(counts)
      .filter(([, count]) => count > 0)
      .map(([name, value]) => ({ name, value }))
  }, [variants])

  // Mechanistic label distribution
  const mechanisticData = useMemo(() => {
    const counts: Record<string, number> = {
      Unassigned: 0,
      Stability: 0,
      Pockets: 0,
      Interface: 0,
    }
    variants.forEach((v) => {
      counts[v.mechanisticLabel] = (counts[v.mechanisticLabel] ?? 0) + 1
    })
    return Object.entries(counts)
      .filter(([, count]) => count > 0)
      .map(([name, value]) => ({ name, value }))
  }, [variants])

  // AM Pathogenicity score histogram — bucket into 0.1 intervals
  const histogramData = useMemo(() => {
    const buckets: Record<string, number> = {
      '0.0–0.1': 0,
      '0.1–0.2': 0,
      '0.2–0.3': 0,
      '0.3–0.4': 0,
      '0.4–0.5': 0,
      '0.5–0.6': 0,
      '0.6–0.7': 0,
      '0.7–0.8': 0,
      '0.8–0.9': 0,
      '0.9–1.0': 0,
    }

    variants.forEach((v) => {
      const bucket = Math.min(Math.floor(v.amPathogenicity * 10), 9)
      const key = Object.keys(buckets)[bucket]
      if (key) buckets[key]++
    })

    return Object.entries(buckets).map(([name, value]) => ({ name, value }))
  }, [variants])

  if (variants.length === 0) return null

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {/* AM Class Donut */}
      <div className="border-border-dark bg-surface rounded-lg border p-4">
        <SectionTitle>AlphaMissense Classification</SectionTitle>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={amClassData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {amClassData.map((entry) => (
                <Cell key={entry.name} fill={AM_CLASS_COLORS[entry.name] ?? '#6b7280'} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => <span className="text-text-muted text-xs">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Mechanistic Label Bar Chart */}
      <div className="border-border-dark bg-surface rounded-lg border p-4">
        <SectionTitle>Mechanistic Labels</SectionTitle>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={mechanisticData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <XAxis
              dataKey="name"
              tick={{ fill: '#93a5c8', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fill: '#93a5c8', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomBarTooltip />} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {mechanisticData.map((entry) => (
                <Cell key={entry.name} fill={MECHANISTIC_COLORS[entry.name] ?? '#6b7280'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pathogenicity Score Histogram */}
      <div className="border-border-dark bg-surface rounded-lg border p-4">
        <SectionTitle>Pathogenicity Score Distribution</SectionTitle>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={histogramData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <XAxis
              dataKey="name"
              tick={{ fill: '#93a5c8', fontSize: 8 }}
              tickLine={false}
              axisLine={false}
              interval={1}
            />
            <YAxis
              tick={{ fill: '#93a5c8', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomBarTooltip />} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {histogramData.map((entry) => {
                const score = parseFloat(entry.name.split('–')[0])
                const color = score >= 0.7 ? '#ef4444' : score >= 0.4 ? '#f97316' : '#22c55e'
                return <Cell key={entry.name} fill={color} />
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
