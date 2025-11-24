import type { StatDto } from "@/lib/api-client"

interface PokemonStatsProps {
  stats: StatDto[]
}

export function PokemonStats({ stats }: PokemonStatsProps) {
  const maxStat = 150

  return (
    <div className="space-y-3">
      {stats.map((stat) => (
        <div key={stat.name}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">{stat.name}</span>
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{stat.value}</span>
          </div>

          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
              style={{ width: `${Math.min((stat.value / maxStat) * 100, 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
