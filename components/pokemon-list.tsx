"use client"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { PokemonResponseDto, PokemonDetailResponseDto } from "@/lib/api-client"

interface PokemonListProps {
  pokemon: PokemonResponseDto[]
  selectedPokemon: PokemonDetailResponseDto | null
  favorites: number[]
  loading: boolean
  error: string | null
  onSelectPokemon: (pokemon: PokemonResponseDto) => void
  onToggleFavorite: (id: number) => void
}

export function PokemonList({
  pokemon,
  selectedPokemon,
  favorites,
  loading,
  error,
  onSelectPokemon,
  onToggleFavorite,
}: PokemonListProps) {
  return (
    <div className="w-full md:w-[35%] border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-y-auto">
      {loading ? (
        <div className="p-4 space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : error ? (
        <div className="p-4">
          <Card className="p-4 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-900">
            <p className="text-red-800 dark:text-red-200">❌ {error}</p>
          </Card>
        </div>
      ) : (
        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {pokemon.map((p) => (
            <div
              key={p.id}
              onClick={() => onSelectPokemon(p)}
              className={`p-4 cursor-pointer transition-colors flex items-center gap-3 ${
                selectedPokemon?.id === p.id
                  ? "bg-blue-50 dark:bg-blue-950"
                  : "hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <img src={p.sprite || "/placeholder.svg?height=50&width=50"} alt={p.name} className="w-12 h-12" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold capitalize text-ellipsis overflow-hidden">{p.name}</p>
                <p className="text-xs text-slate-500">#{p.id}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleFavorite(p.id)
                }}
                className="text-2xl"
              >
                {favorites.includes(p.id) ? "⭐" : "☆"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
